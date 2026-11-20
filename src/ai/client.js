// Talks to the Cloudflare Worker that holds the Claude API key. The endpoint is
// set at build time (VITE_CLAUDE_ENDPOINT). Without it the site uses its
// offline guide.
const fromEnv = (import.meta.env && import.meta.env.VITE_CLAUDE_ENDPOINT) || '';

function readOverride() {
  try { return localStorage.getItem('lattice-endpoint') || ''; } catch { return ''; }
}

export const endpoint = (readOverride() || fromEnv).replace(/\/+$/, '');

let healthPromise = null;
export function checkHealth() {
  if (!endpoint) return Promise.resolve({ live: false, reason: 'no-endpoint' });
  if (!healthPromise) {
    healthPromise = fetch(endpoint + '/api/health', { method: 'GET', mode: 'cors' })
      .then((r) => (r.ok ? r.json() : { ok: false }))
      .then((j) => ({ live: Boolean(j.ok), model: j.model }))
      .catch(() => ({ live: false, reason: 'unreachable' }));
  }
  return healthPromise;
}

// POST and read a server-sent event stream of JSON objects.
export async function stream(path, body, onEvent, signal) {
  const res = await fetch(endpoint + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    let msg = 'The guide could not answer right now.';
    try { const j = await res.json(); if (j.message) msg = j.message; } catch { /* not json */ }
    onEvent({ t: 'error', code: String(res.status), message: msg });
    return;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n\n')) >= 0) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        try { onEvent(JSON.parse(line.slice(6))); } catch { /* ignore malformed line */ }
      }
    }
  }
}
