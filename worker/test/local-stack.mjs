// Runs the worker on http://localhost:8787 against a scripted stand-in for the
// Claude API, for browser end-to-end tests without spending credits.
import http from 'node:http';
import Anthropic from '@anthropic-ai/sdk';
import { createHandler } from '../src/index.js';
import { startMock, sseEvents } from './mock-anthropic.js';

const lastText = (messages) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'user') continue;
    if (typeof m.content === 'string') return m.content;
    const t = m.content.find((b) => b.type === 'text');
    if (t) return t.text;
  }
  return '';
};

const mock = await startMock((body) => {
  if (!body.tools) return { sse: sseEvents([{ type: 'text', text: 'A **Debye–Scherrer ring** is the circle of diffracted X-rays from many tiny crystals at once; when the metal is stretched the circle squashes into an ellipse, and that squash is the strain.' }]) };
  const msgs = body.messages;
  const last = msgs[msgs.length - 1];
  const afterTool = Array.isArray(last.content) && last.content[0]?.type === 'tool_result';
  const q = lastText(msgs).toLowerCase();
  if (q.includes('crack')) {
    return afterTool
      ? { sse: sseEvents([{ type: 'thinking', signature: 'sig-b' }, { type: 'text', text: 'In the **connector–beam lattice**, every joint between cells can soften and break, so the crack chooses its own path. Drying makes wood shrink more around the rings than along the rays, which is why logs split radially.' }]) }
      : { sse: sseEvents([{ type: 'thinking', signature: 'sig-a' }, { type: 'text', text: 'Let me show you the crack opening.' }, { type: 'tool_use', id: 'toolu_nav', name: 'navigate_site', input: { section: 'fracture' } }], { stop: 'tool_use' }) };
  }
  if (q.includes('paper')) {
    return afterTool
      ? { sse: sseEvents([{ type: 'text', text: `Start with the X-ray plasticity preprint. (This request carried ${msgs.length} messages of history.)` }]) }
      : { sse: sseEvents([{ type: 'tool_use', id: 'toolu_pub', name: 'show_publications', input: { ids: ['xray-plasticity-2026', 'ringspy-2023'] } }], { stop: 'tool_use' }) };
  }
  if (q.includes('plasticity')) {
    return afterTool
      ? { sse: sseEvents([{ type: 'text', text: 'The loop shows the Bauschinger effect: reverse yielding starts early because the back stress has moved the yield surface.' }]) }
      : { sse: sseEvents([{ type: 'tool_use', id: 'toolu_pl', name: 'run_plasticity_experiment', input: { path: 'cyclic', amplitude: 3, cycles: 2 } }], { stop: 'tool_use' }) };
  }
  return { sse: sseEvents([{ type: 'text', text: 'Hello from the scripted Claude stand-in.' }]) };
});

const handler = createHandler({ makeClient: () => new Anthropic({ apiKey: 'local-test', baseURL: mock.url, maxRetries: 0 }) });
const env = { ANTHROPIC_API_KEY: 'local-test', ALLOWED_ORIGINS: 'http://localhost:4173,http://localhost:5173' };
http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const request = new Request('http://localhost:8787' + req.url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? undefined : Buffer.concat(chunks) });
  const response = await handler.fetch(request, env, { waitUntil() {} });
  res.writeHead(response.status, Object.fromEntries(response.headers));
  if (response.body) for await (const chunk of response.body) res.write(chunk);
  res.end();
}).listen(8787, () => console.log('local stack on http://localhost:8787, mock API on ' + mock.url));
