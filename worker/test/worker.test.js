import { test } from 'node:test';
import assert from 'node:assert/strict';
import Anthropic from '@anthropic-ai/sdk';
import { createHandler } from '../src/index.js';
import { echoable } from '../src/agent.js';
import { startMock, sseEvents } from './mock-anthropic.js';

const ORIGIN = 'https://kingyin3613.github.io';
const env = { ANTHROPIC_API_KEY: 'test-key', CLAUDE_MODEL: 'claude-opus-5-5', CLAUDE_EFFORT: 'low' };

async function call(handler, path, body, { origin = ORIGIN, method = 'POST', envOverride } = {}) {
  const req = new Request('https://api.example' + path, {
    method,
    headers: { 'content-type': 'application/json', origin, 'cf-connecting-ip': '203.0.113.7' },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
  return handler.fetch(req, envOverride || env, {});
}

async function events(res) {
  const text = await res.text();
  return text.split('\n\n').filter((s) => s.startsWith('data: ')).map((s) => JSON.parse(s.slice(6)));
}

const withMock = async (script, fn) => {
  const mock = await startMock(script);
  const handler = createHandler({ makeClient: () => new Anthropic({ apiKey: 'test-key', baseURL: mock.url, maxRetries: 0 }) });
  try { await fn(handler, mock); } finally { mock.server.close(); }
};

test('ask: runs a tool round, preserves thinking verbatim, and streams the answer', async () => {
  await withMock(
    (body, i) =>
      i === 0
        ? { sse: sseEvents([
            { type: 'thinking', thinking: '', signature: 'sig-round-one' },
            { type: 'text', text: 'Let me show you the crack.' },
            { type: 'tool_use', id: 'toolu_01', name: 'navigate_site', input: { section: 'fracture' } },
          ], { stop: 'tool_use' }) }
        : { sse: sseEvents([{ type: 'thinking', thinking: '', signature: 'sig-round-two' }, { type: 'text', text: 'Wood checks open radially as it dries.' }]) },
    async (handler, mock) => {
      const res = await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'Show me how wood cracks.' }] });
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('access-control-allow-origin'), ORIGIN);
      assert.match(res.headers.get('content-type'), /text\/event-stream/);
      const ev = await events(res);
      const text = ev.filter((e) => e.t === 'text').map((e) => e.d).join('');
      assert.equal(text, 'Let me show you the crack.Wood checks open radially as it dries.');
      const tool = ev.find((e) => e.t === 'tool');
      assert.deepEqual(tool.view, { section: 'fracture' });
      const done = ev.at(-1);
      assert.equal(done.t, 'done');
      assert.equal(done.stop, 'end_turn');
      const turn = ev.find((e) => e.t === 'turn');
      assert.equal(turn.messages.length, 3);
      assert.deepEqual(turn.messages.map((m) => m.role), ['assistant', 'user', 'assistant']);
      assert.equal(turn.messages[0].content[0].type, 'thinking');
      assert.equal(turn.messages[0].content[0].signature, 'sig-round-one');

      // first request: the documented shape
      const r0 = mock.requests[0];
      assert.equal(r0.url, '/v1/messages');
      assert.equal(r0.headers.authorization, 'Bearer test-key');
      assert.equal(r0.headers['anthropic-version'], '2026-10-21');
      assert.match(r0.headers['anthropic-beta'], /server-side-fallback-2026-07-01/);
      assert.match(r0.headers['anthropic-beta'], /thinking-binding-controls-2026-08-01/);
      const b0 = r0.body;
      assert.equal(b0.model, 'claude-opus-5-5');
      assert.equal(b0.stream, true);
      assert.equal(b0.fallbacks, 'default');
      assert.deepEqual(b0.thinking, { type: 'adaptive', block_binding: { prefix_mismatch_behavior: 'drop_block' } });
      assert.deepEqual(b0.output_config, { effort: 'low' });
      assert.deepEqual(b0.cache_control, { type: 'ephemeral' });
      assert.equal(b0.system[0].cache_control.type, 'ephemeral');
      assert.ok(b0.system[0].text.length > 4000);
      assert.equal(b0.tools.length, 3);
      assert.ok(b0.tools.every((t) => t.eager_input_streaming === true));
      assert.equal(b0.betas, undefined, 'betas travel as a header, not in the body');
      assert.equal(b0.temperature, undefined);
      assert.ok(b0.metadata.user_id && !b0.metadata.user_id.includes('203.0.113.7'));

      // second request: history appended verbatim, tool result attached
      const b1 = mock.requests[1].body;
      assert.equal(b1.messages.length, 3);
      assert.deepEqual(b1.messages[1].content[0], { type: 'thinking', thinking: '', signature: 'sig-round-one' });
      const tu = b1.messages[1].content.find((b) => b.type === 'tool_use');
      assert.deepEqual(tu.input, { section: 'fracture' });
      const tr = b1.messages[2].content[0];
      assert.equal(tr.type, 'tool_result');
      assert.equal(tr.tool_use_id, 'toolu_01');
      assert.equal(JSON.parse(tr.content).section, 'fracture');
      // system and tools are byte-identical between rounds (cache + preserved thinking)
      assert.equal(JSON.stringify(b1.system), JSON.stringify(b0.system));
      assert.equal(JSON.stringify(b1.tools), JSON.stringify(b0.tools));
    },
  );
});

test('ask: a follow-up turn replays the stored transcript unchanged', async () => {
  const first = [
    { role: 'user', content: 'Which paper should I read first?' },
    { role: 'assistant', content: [{ type: 'thinking', thinking: '', signature: 'sig-x' }, { type: 'text', text: 'Start with the X-ray preprint.' }] },
    { role: 'user', content: 'Why that one?' },
  ];
  await withMock(
    () => ({ sse: sseEvents([{ type: 'text', text: 'Because it is the newest.' }]) }),
    async (handler, mock) => {
      const res = await call(handler, '/api/ask', { messages: first });
      const ev = await events(res);
      assert.equal(ev.at(-1).stop, 'end_turn');
      assert.deepEqual(mock.requests[0].body.messages, first);
    },
  );
});

test('ask: invalid tool input is returned to Claude as an error result', async () => {
  await withMock(
    (body, i) =>
      i === 0
        ? { sse: sseEvents([{ type: 'tool_use', id: 'toolu_bad', name: 'run_plasticity_experiment', input: { path: 'zigzag', amplitude: 9, cycles: 2 } }], { stop: 'tool_use' }) }
        : { sse: sseEvents([{ type: 'text', text: 'Sorry, that path does not exist.' }]) },
    async (handler, mock) => {
      const ev = await events(await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'zigzag please' }] }));
      assert.ok(ev.some((e) => e.t === 'tool_error'));
      const tr = mock.requests[1].body.messages[2].content[0];
      assert.equal(tr.is_error, true);
      assert.match(tr.content, /path must be one of/);
    },
  );
});

test('ask: plasticity and publication tools return real data', async () => {
  await withMock(
    (body, i) =>
      i === 0
        ? { sse: sseEvents([
            { type: 'tool_use', id: 'toolu_p', name: 'run_plasticity_experiment', input: { path: 'cyclic', amplitude: 3, cycles: 2 } },
            { type: 'tool_use', id: 'toolu_q', name: 'show_publications', input: { ids: ['xray-plasticity-2026', 'nope'] } },
          ], { stop: 'tool_use' }) }
        : { sse: sseEvents([{ type: 'text', text: 'Done.' }]) },
    async (handler, mock) => {
      const ev = await events(await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'Run a cyclic test and show the paper.' }] }));
      const tools = ev.filter((e) => e.t === 'tool');
      assert.deepEqual(tools.map((t) => t.name), ['run_plasticity_experiment', 'show_publications']);
      assert.deepEqual(tools[1].view.ids, ['xray-plasticity-2026']);
      const results = mock.requests[1].body.messages[2].content;
      assert.equal(results.length, 2, 'both results in one user message');
      const exp = JSON.parse(results[0].content);
      assert.ok(exp.peak_abs_stress_MPa > 900 && exp.peak_abs_stress_MPa < 1200);
      const pubs = JSON.parse(results[1].content);
      assert.equal(pubs.publications[0].title, 'Learning metal plasticity constitutive models via laboratory-based X-ray measurements');
    },
  );
});

test('ask: the last allowed round forbids tools so the visitor always gets an answer', async () => {
  await withMock(
    (body, i) =>
      i < 3
        ? { sse: sseEvents([{ type: 'tool_use', id: 'toolu_' + i, name: 'navigate_site', input: { section: 'cells' } }], { stop: 'tool_use' }) }
        : { sse: sseEvents([{ type: 'text', text: 'Here is the answer.' }]) },
    async (handler, mock) => {
      const ev = await events(await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'loop' }] }));
      assert.equal(mock.requests.length, 4);
      assert.deepEqual(mock.requests[3].body.tool_choice, { type: 'none' });
      assert.equal(mock.requests[0].body.tool_choice, undefined);
      assert.equal(ev.at(-1).stop, 'end_turn');
    },
  );
});

test('ask: a refusal is reported and not stored in the transcript', async () => {
  await withMock(
    () => ({ sse: sseEvents([], { stop: 'refusal' }) }),
    async (handler) => {
      const ev = await events(await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'something declined' }] }));
      assert.equal(ev.find((e) => e.t === 'turn').messages.length, 0);
      assert.equal(ev.at(-1).stop, 'refusal');
    },
  );
});

test('ask: API errors become friendly events', async () => {
  await withMock(
    () => ({ status: 429, errorType: 'rate_limit_error', message: 'slow down' }),
    async (handler) => {
      const ev = await events(await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'hello' }] }));
      assert.equal(ev.at(-1).t, 'error');
      assert.equal(ev.at(-1).code, 'busy');
    },
  );
});

test('explain: streams a levelled explanation without tools', async () => {
  await withMock(
    () => ({ sse: sseEvents([{ type: 'text', text: 'Rings are like tree rings for crystals.' }]) }),
    async (handler, mock) => {
      const ev = await events(await call(handler, '/api/explain', { text: 'Debye–Scherrer rings', context: 'The lattice becomes diffraction rings.', level: 'curious' }));
      assert.equal(ev.filter((e) => e.t === 'text').map((e) => e.d).join(''), 'Rings are like tree rings for crystals.');
      const b = mock.requests[0].body;
      assert.equal(b.tools, undefined);
      assert.match(b.messages[0].content, /Level: curious/);
      assert.match(b.messages[0].content, /<passage>\nDebye–Scherrer rings\n<\/passage>/);
    },
  );
});

test('requests are validated before any API call', async () => {
  await withMock(
    () => { throw new Error('the API must not be called'); },
    async (handler) => {
      const bad = [
        { messages: [] },
        { messages: [{ role: 'assistant', content: [{ type: 'text', text: 'hi' }] }] },
        { messages: [{ role: 'user', content: 'a' }, { role: 'user', content: 'b' }] },
        { messages: [{ role: 'user', content: 'x'.repeat(1501) }] },
        { messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'url', url: 'https://x/y.png' } }] }] },
        { messages: [{ role: 'user', content: 'a' }, { role: 'assistant', content: [{ type: 'tool_use', id: 't', name: 'bash', input: {} }] }, { role: 'user', content: 'b' }] },
      ];
      for (const body of bad) {
        const res = await call(handler, '/api/ask', body);
        assert.equal(res.status, 400, JSON.stringify(body).slice(0, 80));
      }
      const many = [];
      for (let i = 0; i < 13; i++) many.push({ role: 'user', content: 'q' + i }, { role: 'assistant', content: [{ type: 'text', text: 'a' }] });
      many.pop();
      assert.equal((await call(handler, '/api/ask', { messages: many })).status, 400);
      assert.equal((await call(handler, '/api/explain', { text: 'x', level: 'curious' })).status, 400);
      assert.equal((await call(handler, '/api/explain', { text: 'fine text', level: 'genius' })).status, 400);
    },
  );
});

test('origin, preflight, health, configuration and rate limits', async () => {
  const handler = createHandler({ makeClient: () => { throw new Error('no client expected'); } });
  const evil = await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'hi' }] }, { origin: 'https://evil.example' });
  assert.equal(evil.status, 403);
  assert.equal(evil.headers.get('access-control-allow-origin'), null);
  const pre = await handler.fetch(new Request('https://api.example/api/ask', { method: 'OPTIONS', headers: { origin: ORIGIN } }), env, {});
  assert.equal(pre.status, 204);
  assert.match(pre.headers.get('access-control-allow-headers'), /content-type/);
  const health = await call(handler, '/api/health', null, { method: 'GET' });
  assert.deepEqual(await health.json(), { ok: true, model: 'claude-opus-5-5' });
  const noKey = await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'hi' }] }, { envOverride: {} });
  assert.equal(noKey.status, 503);
  const limited = await call(handler, '/api/ask', { messages: [{ role: 'user', content: 'hi' }] }, { envOverride: { ...env, ASK_LIMITER: { limit: async () => ({ success: false }) } } });
  assert.equal(limited.status, 429);
});

test('fallback boundary: thinking and tool calls before it are not echoed', () => {
  const content = [
    { type: 'thinking', thinking: '', signature: 's1' },
    { type: 'text', text: 'partial ' },
    { type: 'fallback', from: { model: 'claude-opus-5-5' }, to: { model: 'claude-opus-5' } },
    { type: 'text', text: 'continued' },
  ];
  assert.deepEqual(echoable(content).map((b) => b.type), ['text', 'fallback', 'text']);
  assert.equal(echoable([{ type: 'text', text: 'x' }]).length, 1);
});
