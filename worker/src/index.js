// Cloudflare Worker: the only place the Claude API key lives. The static site
// calls it; it validates, rate-limits, runs the guide and streams events back.
import Anthropic from '@anthropic-ai/sdk';
import { runGuide, runExplain } from './agent.js';
import { validateAsk, validateExplain, RequestError, LIMITS } from './validate.js';

const DEFAULT_ORIGINS = 'https://kingyin3613.github.io,http://localhost:5173,http://localhost:4173';

function cors(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(',').map((s) => s.trim()).filter(Boolean);
  const ok = origin && allowed.includes(origin);
  return {
    ok,
    headers: ok
      ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Max-Age': '86400', Vary: 'Origin' }
      : { Vary: 'Origin' },
  };
}

const json = (obj, status, headers) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });

async function hashIp(ip, salt) {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function readJson(request) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > LIMITS.bodyBytes) throw new RequestError('too_large', 'Request too large. Start a new conversation.', 413);
  const text = await request.text();
  if (text.length > LIMITS.bodyBytes) throw new RequestError('too_large', 'Request too large. Start a new conversation.', 413);
  try { return JSON.parse(text); } catch { throw new RequestError('bad_request', 'Invalid JSON.'); }
}

function sse(headers, run) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const enc = new TextEncoder();
  const controller = new AbortController();
  let closed = false;
  const emit = (obj) => {
    if (closed) return;
    writer.write(enc.encode(`data: ${JSON.stringify(obj)}\n\n`)).catch(() => { closed = true; controller.abort(); });
  };
  const done = (async () => {
    try {
      await run(emit, controller.signal);
    } catch (err) {
      emit(errorEvent(err));
    } finally {
      closed = true;
      try { await writer.close(); } catch { /* client went away */ }
    }
  })();
  const response = new Response(readable, {
    status: 200,
    headers: { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache, no-transform', 'x-accel-buffering': 'no', ...headers },
  });
  return { response, done };
}

function errorEvent(err) {
  if (err instanceof Anthropic.RateLimitError) return { t: 'error', code: 'busy', message: 'The guide is busy right now. Try again in a minute.' };
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) return { t: 'error', code: 'config', message: 'The guide is not configured correctly.' };
  if (err instanceof Anthropic.BadRequestError) return { t: 'error', code: 'bad_request', message: 'The guide could not continue this conversation. Start a new one.' };
  if (err instanceof Anthropic.APIError) return { t: 'error', code: 'upstream', message: 'The guide had a problem reaching Claude. Try again shortly.' };
  if (err?.name === 'AbortError') return { t: 'error', code: 'aborted', message: 'Stopped.' };
  return { t: 'error', code: 'internal', message: 'Something went wrong.' };
}

export function createHandler({ makeClient } = {}) {
  return {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const origin = request.headers.get('origin');
      const c = cors(origin, env);
      if (request.method === 'OPTIONS') return new Response(null, { status: c.ok ? 204 : 403, headers: c.headers });
      if (url.pathname === '/api/health' && request.method === 'GET') {
        return json({ ok: Boolean(env.ANTHROPIC_API_KEY), model: env.CLAUDE_MODEL || 'claude-opus-5-5' }, 200, c.headers);
      }
      const route = url.pathname === '/api/ask' ? 'ask' : url.pathname === '/api/explain' ? 'explain' : null;
      if (!route || request.method !== 'POST') return json({ error: 'not_found' }, 404, c.headers);
      if (!c.ok) return json({ error: 'forbidden_origin' }, 403, c.headers);
      if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured', message: 'The guide is not configured.' }, 503, c.headers);

      const ip = request.headers.get('cf-connecting-ip') || 'local';
      const limiter = route === 'ask' ? env.ASK_LIMITER : env.EXPLAIN_LIMITER;
      if (limiter) {
        const { success } = await limiter.limit({ key: `${route}:${ip}` });
        if (!success) return json({ error: 'rate_limited', message: 'Slow down a little and try again in a minute.' }, 429, c.headers);
      }

      let body, input;
      try {
        body = await readJson(request);
        input = route === 'ask' ? validateAsk(body) : validateExplain(body);
      } catch (err) {
        if (err instanceof RequestError) return json({ error: err.code, message: err.message }, err.status, c.headers);
        throw err;
      }

      const client = makeClient ? makeClient(env) : new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1 });
      const model = env.CLAUDE_MODEL || 'claude-opus-5-5';
      const effort = env.CLAUDE_EFFORT || 'low';
      const userId = await hashIp(ip, env.USER_SALT || 'lattice');
      const { response, done } = sse(c.headers, (emit, signal) =>
        route === 'ask'
          ? runGuide({ client, model, effort, messages: input, emit, signal, userId })
          : runExplain({ client, model, effort: env.EXPLAIN_EFFORT || effort, input, emit, signal, userId }),
      );
      ctx?.waitUntil?.(done);
      return response;
    },
  };
}

export default createHandler();
