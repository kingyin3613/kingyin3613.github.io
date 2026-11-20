// A small stand-in for POST /v1/messages that streams scripted SSE responses
// and records every request, so the worker can be tested with the real SDK.
import http from 'node:http';

export function sseEvents(blocks, { stop = 'end_turn', model = 'claude-opus-5-5', id = 'msg_test' } = {}) {
  const ev = [];
  const push = (type, data) => ev.push(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
  push('message_start', { message: { id, type: 'message', role: 'assistant', model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 100, output_tokens: 1, cache_read_input_tokens: 80, cache_creation_input_tokens: 0 } } });
  blocks.forEach((b, index) => {
    if (b.type === 'thinking') {
      push('content_block_start', { index, content_block: { type: 'thinking', thinking: '', signature: '' } });
      if (b.thinking) push('content_block_delta', { index, delta: { type: 'thinking_delta', thinking: b.thinking } });
      push('content_block_delta', { index, delta: { type: 'signature_delta', signature: b.signature } });
    } else if (b.type === 'text') {
      push('content_block_start', { index, content_block: { type: 'text', text: '' } });
      for (const piece of b.text.match(/.{1,12}/gs)) push('content_block_delta', { index, delta: { type: 'text_delta', text: piece } });
    } else if (b.type === 'tool_use') {
      push('content_block_start', { index, content_block: { type: 'tool_use', id: b.id, name: b.name, input: {} } });
      const js = JSON.stringify(b.input);
      for (const piece of js.match(/.{1,7}/gs)) push('content_block_delta', { index, delta: { type: 'input_json_delta', partial_json: piece } });
    } else if (b.type === 'fallback') {
      push('content_block_start', { index, content_block: { type: 'fallback', from: b.from, to: b.to } });
    }
    push('content_block_stop', { index });
  });
  push('message_delta', { delta: { stop_reason: stop, stop_sequence: null }, usage: { output_tokens: 42 } });
  push('message_stop', {});
  return ev.join('');
}

export function startMock(script) {
  const requests = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const parsed = body ? JSON.parse(body) : null;
      requests.push({ url: req.url, headers: req.headers, body: parsed });
      const reply = script(parsed, requests.length - 1);
      if (reply.status && reply.status !== 200) {
        res.writeHead(reply.status, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ type: 'error', error: { type: reply.errorType || 'invalid_request_error', message: reply.message || 'error' } }));
        return;
      }
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(reply.sse);
    });
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, requests, url: `http://127.0.0.1:${server.address().port}` })));
}
