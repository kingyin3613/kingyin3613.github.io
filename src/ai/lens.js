// The Lens: select any passage on the page and have it explained at your level.
import { endpoint, checkHealth, stream } from './client.js';
import { renderMarkdown } from './markdown.js';
import { glossaryFor } from './offline.js';

export function initLens({ guide }) {
  const btnWrap = document.querySelector('[data-lens-btn]');
  const pop = document.querySelector('[data-lens]');
  if (!btnWrap || !pop) return;
  const btn = btnWrap.querySelector('button');
  const quote = pop.querySelector('[data-lens-quote]');
  const body = pop.querySelector('[data-lens-body]');
  const levels = [...pop.querySelectorAll('[data-level]')];
  const more = pop.querySelector('[data-lens-more]');
  let level = 'curious';
  try { level = localStorage.getItem('lattice-level') || 'curious'; } catch { /* default */ }
  let live = false;
  checkHealth().then((h) => (live = h.live));
  let sel = null;
  let controller = null;
  const cache = new Map();

  const setLevel = (l) => {
    level = l;
    levels.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.level === l)));
    try { localStorage.setItem('lattice-level', l); } catch { /* ignore */ }
  };
  setLevel(level);

  const contextOf = (range) => {
    let n = range.commonAncestorContainer;
    if (n.nodeType !== 1) n = n.parentElement;
    const block = n.closest('p, li, h1, h2, h3, .pub, .step, .chapter__inner') || n;
    const section = n.closest('section');
    const title = section?.querySelector('h1, h2')?.textContent || '';
    return (title ? `[${title}] ` : '') + block.textContent.replace(/\s+/g, ' ').trim().slice(0, 1500);
  };

  const hideBtn = () => { btnWrap.hidden = true; };
  const hidePop = () => { pop.hidden = true; controller?.abort(); };

  document.addEventListener('selectionchange', () => {
    const s = document.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) { if (!btnWrap.contains(document.activeElement)) setTimeout(() => { const t = document.getSelection(); if (!t || t.isCollapsed) hideBtn(); }, 120); return; }
  });

  const onUp = () => {
    setTimeout(() => {
      const s = document.getSelection();
      if (!s || s.isCollapsed || !s.rangeCount) return;
      const text = s.toString().replace(/\s+/g, ' ').trim();
      const range = s.getRangeAt(0);
      const host = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
      if (!host || !host.closest('main') || host.closest('textarea, input, button, [data-lab], .guide, .lens')) return;
      if (text.length < 2 || text.length > 700) { hideBtn(); return; }
      const rect = range.getBoundingClientRect();
      sel = { text, context: contextOf(range), rect: { x: rect.left + rect.width / 2, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY } };
      btnWrap.style.left = Math.max(60, Math.min(window.innerWidth - 60, sel.rect.x)) + 'px';
      btnWrap.style.top = sel.rect.top + 'px';
      btnWrap.hidden = false;
    }, 10);
  };
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchend', onUp);
  document.addEventListener('keyup', (e) => { if (e.shiftKey) onUp(); });

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', () => {
    if (!sel) return;
    hideBtn();
    quote.textContent = sel.text;
    const w = Math.min(390, window.innerWidth - 24);
    pop.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, sel.rect.x - w / 2)) + 'px';
    pop.style.top = sel.rect.bottom + 12 + 'px';
    pop.hidden = false;
    explain();
  });

  levels.forEach((b) => b.addEventListener('click', () => { setLevel(b.dataset.level); explain(); }));
  pop.querySelector('[data-lens-close]').addEventListener('click', hidePop);
  more.addEventListener('click', () => {
    if (!sel) return;
    hidePop();
    guide.ask(`On the page it says: “${sel.text}”. Can you explain this in more depth?`);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { hidePop(); hideBtn(); } });
  document.addEventListener('pointerdown', (e) => {
    if (!pop.hidden && !pop.contains(e.target)) hidePop();
    if (!btnWrap.hidden && !btnWrap.contains(e.target)) setTimeout(hideBtn, 200);
  });

  async function explain() {
    const key = level + '\u0000' + sel.text;
    controller?.abort();
    if (cache.has(key)) { body.innerHTML = renderMarkdown(cache.get(key)); return; }
    if (!live) {
      const hits = glossaryFor(sel.text + ' ' + (sel.text.length < 60 ? sel.context.slice(0, 200) : ''));
      body.innerHTML = hits.length
        ? hits.map((g) => `<p><strong>${g.term}.</strong> ${g.text}</p>`).join('')
        : `<p>${endpoint ? 'The live explainer is not reachable right now.' : 'Live explanations switch on when the site’s Claude endpoint is connected.'} The offline glossary has no entry for this passage yet.</p>`;
      return;
    }
    controller = new AbortController();
    let text = '';
    body.innerHTML = '<p><span class="cursor"></span></p>';
    try {
      await stream('/api/explain', { text: sel.text, context: sel.context, level }, (ev) => {
        if (ev.t === 'text') { text += ev.d; body.innerHTML = renderMarkdown(text) + '<span class="cursor"></span>'; }
        else if (ev.t === 'error') text = ev.message || 'The explainer could not answer.';
      }, controller.signal);
      body.innerHTML = renderMarkdown(text || 'No explanation came back.');
      if (text) cache.set(key, text);
    } catch (e) {
      if (e.name !== 'AbortError') body.innerHTML = '<p>The connection dropped. Try again.</p>';
    }
  }
}
