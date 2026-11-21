// "Ask the lattice": a streaming chat whose tool calls move the page.
import { endpoint, checkHealth, stream } from './client.js';
import { renderMarkdown } from './markdown.js';
import { offlineAnswer, pubById } from './offline.js';
import { makePath, simulate } from '../lab/plasticity.js';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const STORE = 'lattice-conversation-v1';
const SECTION_TITLES = {
  top: 'the beginning', stones: 'Stones', cells: 'Cells', ringspy: 'RingsPy', fracture: 'Fracture', flow: 'Flow', light: 'Light',
  architecture: 'Architecture', laws: 'Laws', ask: 'Ask', lab: 'the learning lab', publications: 'Publications', path: 'Path', contact: 'Contact',
};

function plotSVG({ path, amplitude, cycles }) {
  const strain = makePath(path, amplitude, cycles);
  const { stress } = simulate(strain);
  const W = 360, H = 220, pad = 18;
  let ex = 1e-9, sx = 1;
  for (let i = 0; i < strain.length; i++) { ex = Math.max(ex, Math.abs(strain[i])); sx = Math.max(sx, Math.abs(stress[i])); }
  const X = (e) => W / 2 + (e / ex) * (W / 2 - pad);
  const Y = (s) => H / 2 - (s / sx) * (H / 2 - pad);
  let d = '';
  for (let i = 0; i < strain.length; i++) d += (i ? 'L' : 'M') + X(strain[i]).toFixed(1) + ' ' + Y(stress[i]).toFixed(1);
  return `<svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="Stress against strain for a ${path} path, peak strain ${amplitude} times the yield strain">
    <path d="M0 ${H / 2}H${W}M${W / 2} 0V${H}" stroke="rgba(242,238,231,.22)" stroke-width="1"/>
    <text x="${W - 6}" y="${H / 2 - 6}" text-anchor="end" fill="rgba(242,238,231,.45)" font-size="10" font-family="Mona Sans Variable, sans-serif">strain</text>
    <text x="${W / 2 + 6}" y="12" fill="rgba(242,238,231,.45)" font-size="10" font-family="Mona Sans Variable, sans-serif">stress, peak ${Math.round(sx)} MPa</text>
    <path d="${d}" fill="none" stroke="#ffd27c" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>`;
}

export function initGuide({ lattice, scroll }) {
  const panel = document.getElementById('guide');
  const log = panel.querySelector('[data-guide-log]');
  const form = panel.querySelector('[data-guide-form]');
  const input = form.querySelector('textarea');
  const send = form.querySelector('[data-guide-send]');
  const status = panel.querySelector('[data-guide-status]');
  const openers = [...document.querySelectorAll('[data-open-guide]')];
  const dots = [...document.querySelectorAll('[data-live-dot]')];
  let live = false;
  let busy = false;
  let controller = null;
  let opener = null;
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORE) || '[]'); } catch { history = []; }
  const save = () => { try { sessionStorage.setItem(STORE, JSON.stringify(history)); } catch { /* storage unavailable */ } };

  const setStatus = (text, on) => {
    status.textContent = text;
    dots.forEach((d) => (d.dataset.live = on ? 'on' : 'off'));
  };
  setStatus(endpoint ? 'Connecting…' : 'Offline guide · answers from this page', false);
  checkHealth().then((h) => {
    live = h.live;
    if (live) setStatus('Live · Claude', true);
    else setStatus('Offline guide · answers from this page', false);
  });

  // restore earlier exchange in this tab
  const replay = () => {
    log.innerHTML = '';
    for (const m of history) {
      if (m.role === 'user') {
        const text = typeof m.content === 'string' ? m.content : m.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
        if (text) addUser(text);
      } else {
        const text = m.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n\n');
        if (text) addBot().set(text, true);
      }
    }
    if (!history.length) intro();
  };

  function intro() {
    const el = document.createElement('div');
    el.className = 'msg msg--note';
    el.innerHTML = live || endpoint
      ? 'Ask anything about Hao’s research. The lattice will move to show you what the answer is about.'
      : 'Ask anything about Hao’s research. This offline guide answers from the page itself; with the Claude endpoint connected it answers any question.';
    log.appendChild(el);
  }

  function addUser(text) {
    const el = document.createElement('div');
    el.className = 'msg msg--user';
    el.textContent = text;
    log.appendChild(el);
    el.scrollIntoView({ block: 'end' });
  }

  function addBot() {
    const el = document.createElement('div');
    el.className = 'msg msg--bot';
    log.appendChild(el);
    let text = '';
    let pending = false;
    let final = false;
    const render = () => {
      pending = false;
      el.innerHTML = renderMarkdown(text) + (final ? '' : '<span class="cursor"></span>');
      log.scrollTop = log.scrollHeight;
    };
    return {
      el,
      append(d) { text += d; if (!pending) { pending = true; requestAnimationFrame(render); } },
      para() { if (text && !text.endsWith('\n\n')) text += '\n\n'; },
      set(t, isFinal) { text = t; final = Boolean(isFinal); render(); },
      done() { final = true; render(); if (!text.trim()) el.remove(); },
      get text() { return text; },
    };
  }

  function addAct(label) {
    const el = document.createElement('div');
    el.className = 'act';
    el.textContent = label;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function addNote(text) {
    const el = document.createElement('div');
    el.className = 'msg msg--note';
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  // ---- choreography for tool calls
  function perform(name, view, actEl) {
    const act = actEl || addAct('');
    if (name === 'navigate_site') {
      act.textContent = `Moving the lattice to ${SECTION_TITLES[view.section] || view.section}`;
      scroll.goTo(view.section);
    } else if (name === 'show_publications') {
      act.textContent = view.ids.length === 1 ? 'Showing a paper' : `Showing ${view.ids.length} papers`;
      const cards = document.createElement('div');
      cards.className = 'cards';
      cards.innerHTML = view.ids
        .map(pubById)
        .filter(Boolean)
        .map((p) => `<a class="card" href="${p.href}" target="_blank" rel="noopener"><span class="card__t">${esc(p.title)}</span><span class="card__m">${esc(p.venue)}${p.year ? ', ' + p.year : ''}</span></a>`)
        .join('');
      act.after(cards);
      for (const id of view.ids) {
        const li = document.getElementById('pub-' + id);
        if (!li) continue;
        li.hidden = false;
        li.closest('[data-year-group]')?.removeAttribute('hidden');
        li.classList.add('is-lit');
        setTimeout(() => li.classList.remove('is-lit'), 9000);
      }
    } else if (name === 'run_plasticity_experiment') {
      act.textContent = `Ran a ${view.path} plasticity experiment, peak strain ${view.amplitude}× yield`;
      const fig = document.createElement('div');
      fig.innerHTML = plotSVG(view);
      act.after(fig);
    }
    act.classList.add('is-done');
    log.scrollTop = log.scrollHeight;
  }

  // ---- open / close
  const open = (from) => {
    if (!panel.hidden) { input.focus(); return; }
    opener = from || document.activeElement;
    panel.hidden = false;
    openers.forEach((b) => b.setAttribute('aria-expanded', 'true'));
    lattice.setShift?.(window.innerWidth >= 1100 ? 190 : 0);
    if (!log.children.length) replay();
    setTimeout(() => input.focus({ preventScroll: true }), 30);
  };
  const close = () => {
    panel.hidden = true;
    openers.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    lattice.setShift?.(0);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  };
  openers.forEach((b) => b.addEventListener('click', () => (panel.hidden ? open(b) : close())));
  panel.querySelector('[data-guide-close]').addEventListener('click', close);
  panel.querySelector('[data-guide-new]').addEventListener('click', () => {
    controller?.abort();
    history = [];
    save();
    log.innerHTML = '';
    intro();
    input.focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) close();
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); open(); }
  });

  // ---- input
  const autosize = () => { input.style.height = 'auto'; input.style.height = Math.min(150, input.scrollHeight) + 'px'; };
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q || busy) return;
    input.value = '';
    autosize();
    ask(q);
  });

  async function ask(question) {
    open();
    if (log.firstElementChild?.classList.contains('msg--note') && !history.length) log.innerHTML = '';
    busy = true;
    send.disabled = true;
    addUser(question);
    lattice.setThinking(1);
    const bot = addBot();
    bot.set('', false);
    if (!live) {
      await offline(question, bot);
    } else {
      await online(question, bot);
    }
    lattice.setThinking(0);
    busy = false;
    send.disabled = false;
  }

  async function offline(question, bot) {
    const { text, actions } = offlineAnswer(question);
    await new Promise((r) => setTimeout(r, 380));
    for (const a of actions) perform(a.name, a.view);
    const words = text.split(/(\s+)/);
    for (let i = 0; i < words.length; i++) {
      bot.append(words[i]);
      if (i % 3 === 0) await new Promise((r) => setTimeout(r, 16));
    }
    bot.done();
    log.appendChild(bot.el);
    history.push({ role: 'user', content: question }, { role: 'assistant', content: [{ type: 'text', text }] });
    save();
  }

  async function online(question, bot) {
    controller = new AbortController();
    const userMsg = { role: 'user', content: question };
    const acts = new Map();
    let current = bot;
    let turn = null;
    let stop = null;
    let error = null;
    try {
      await stream('/api/ask', { messages: [...history, userMsg] }, (ev) => {
        if (ev.t === 'text') current.append(ev.d);
        else if (ev.t === 'block') current.para();
        else if (ev.t === 'tool_call') {
          current.done();
          const a = addAct('Working…');
          acts.set(ev.id, a);
        } else if (ev.t === 'tool') {
          perform(ev.name, ev.view, acts.get(ev.id));
          current = addBot();
        } else if (ev.t === 'tool_error') {
          const a = acts.get(ev.id);
          if (a) { a.textContent = 'A tool call did not work; retrying'; a.classList.add('is-done'); }
          current = addBot();
        } else if (ev.t === 'turn') turn = ev.messages;
        else if (ev.t === 'done') stop = ev.stop;
        else if (ev.t === 'error') error = ev;
      }, controller.signal);
    } catch (e) {
      if (e.name !== 'AbortError') error = { message: 'The connection dropped. Try again.' };
    }
    current.done();
    if (error) {
      addNote(error.message || 'Something went wrong.');
      if (error.code === 'too_long' || error.code === '413') addNote('Use the + button to start a new conversation.');
      return;
    }
    if (stop === 'refusal') {
      addNote('The guide could not help with that one. Try asking it another way, or about another part of the research.');
      return;
    }
    if (turn && turn.length) {
      history.push(userMsg, ...turn);
      save();
    }
    if (stop === 'max_tokens') addNote('The answer was cut short. Ask a narrower question to get the rest.');
  }

  // ---- entry points elsewhere on the page
  document.querySelector('[data-ask-inline]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const ta = e.currentTarget.querySelector('textarea');
    const q = ta.value.trim();
    if (!q || busy) return;
    ta.value = '';
    ask(q);
  });
  document.querySelector('[data-ask-inline] textarea')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); e.currentTarget.form.requestSubmit(); }
  });
  document.querySelectorAll('[data-starter]').forEach((b) => b.addEventListener('click', () => { if (!busy) ask(b.dataset.starter); }));
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-ask-pub]');
    if (!b || busy) return;
    const p = pubById(b.dataset.askPub);
    if (p) ask(`Tell me about “${p.title}”: what did it show, and how does it fit Hao’s research?`);
  });

  return { open, close, ask, get live() { return live; } };
}
