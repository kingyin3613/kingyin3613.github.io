// Scroll choreography: smooth scrolling, which lattice scenes blend at the
// current position, per-section progress, reveals, and navigation.
import Lenis from 'lenis';
import { clamp, easeInOutQuint } from '../lib/ease.js';

export function initScroll({ lattice, reduced }) {
  const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.1, autoRaf: false });
  if (lenis) {
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.documentElement.classList.add('lenis');
  }

  const sections = [...document.querySelectorAll('main [data-state]')];
  const railLinks = new Map([...document.querySelectorAll('[data-rail]')].map((a) => [a.dataset.rail, a]));
  const navLinks = [...document.querySelectorAll('.bar__nav a')];
  const rail = document.querySelector('.rail');
  const bar = document.querySelector('.bar');
  let barScrolled = false;
  let tops = [], heights = [];
  const inners = [...document.querySelectorAll('.chapter__inner')];
  const fitChapters = () => {
    const vh = window.innerHeight;
    for (const el of inners) {
      if (window.innerWidth < 860) { el.classList.remove('is-tall'); el.style.removeProperty('--pad-top'); continue; }
      const cs = getComputedStyle(el);
      const content = el.offsetHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const free = vh - content - 36;
      if (free < 84) {
        el.classList.add('is-tall');
        el.style.removeProperty('--pad-top');
      } else {
        el.classList.remove('is-tall');
        const pad = Math.round(Math.min(vh * 0.17, Math.max(76, free * 0.55))) + 'px';
        if (el.style.getPropertyValue('--pad-top') !== pad) el.style.setProperty('--pad-top', pad);
      }
    }
  };
  const measure = () => {
    fitChapters();
    const y = window.scrollY;
    tops = sections.map((s) => s.getBoundingClientRect().top + y);
    heights = sections.map((s) => s.offsetHeight);
  };
  measure();
  window.addEventListener('resize', measure, { passive: true });
  document.fonts?.ready.then(measure);
  new ResizeObserver(() => measure()).observe(document.body);

  let current = -1;
  const listeners = new Set();
  const crackTitle = document.querySelector('[data-crack-title]');

  const sample = () => {
    const vh = window.innerHeight;
    const y = lenis ? lenis.animatedScroll : window.scrollY;
    let k = 0;
    for (let i = 0; i < sections.length; i++) if (tops[i] - y <= vh * 0.8) k = i;
    if ((y > 40) !== barScrolled) { barScrolled = y > 40; bar?.classList.toggle('is-scrolled', barScrolled); }
    const rel = tops[k] - y;
    const m = k > 0 ? clamp((vh * 0.8 - rel) / (vh * 0.6)) : 1;
    const sub = (i) => clamp((vh * 0.25 - (tops[i] - y)) / Math.max(vh * 0.4, heights[i] - vh * 1.0));
    const a = k > 0 && m < 1 ? k - 1 : k;
    lattice.setView({
      a: sections[a].dataset.state,
      b: sections[k].dataset.state,
      m: a === k ? 0 : m,
      subA: sub(a),
      subB: sub(k),
    });
    // the section that owns the middle of the screen
    let active = 0;
    for (let i = 0; i < sections.length; i++) if (tops[i] - y <= vh * 0.5) active = i;
    if (active !== current) {
      current = active;
      const s = sections[active];
      if (s.dataset.accent) document.documentElement.style.setProperty('--accent', s.dataset.accent);
      for (const [id, link] of railLinks) link.setAttribute('aria-current', String(id === (s.id === 'ringspy' ? 'cells' : s.id)));
      const navId = { stones: 'stones', cells: 'stones', ringspy: 'stones', fracture: 'stones', flow: 'stones', light: 'stones', architecture: 'stones', laws: 'stones', ask: 'stones', lab: 'lab', publications: 'publications', path: 'path', contact: 'contact' }[s.id];
      for (const l of navLinks) l.setAttribute('aria-current', String(l.getAttribute('href') === '#' + navId));
      if (rail) rail.dataset.hidden = String(!railLinks.has(s.id) && s.id !== 'lab' && s.id !== 'ringspy');
      for (const fn of listeners) fn(s.id);
    }
    if (crackTitle) {
      const i = sections.findIndex((s) => s.id === 'fracture');
      const p = clamp(sub(i) * 1.15);
      crackTitle.style.setProperty('--open', (p * p * (3 - 2 * p)).toFixed(3));
    }
  };
  lattice.onFrame(sample);

  // reveals
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  document.querySelectorAll('[data-reveal], [data-strain]').forEach((el) => {
    const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal')) : [];
    el.style.setProperty('--i', String(Math.max(0, sibs.indexOf(el))));
    io.observe(el);
  });

  const goTo = (target, opts = {}) => {
    const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target;
    if (!el) return false;
    const y = el.getBoundingClientRect().top + window.scrollY + (opts.offset || 0);
    if (lenis) {
      const dist = Math.abs(y - window.scrollY);
      const duration = Math.min(4.2, 1.1 + dist / 3200);
      lenis.scrollTo(y, { duration, easing: easeInOutQuint, lock: false });
    } else {
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
    return true;
  };

  // in-page links glide through the story
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    goTo(id, { offset: a.dataset.pubLink ? -window.innerHeight * 0.3 : 0 });
    history.replaceState(null, '', '#' + id);
  });
  if (location.hash && document.getElementById(location.hash.slice(1))) {
    setTimeout(() => { measure(); window.scrollTo(0, document.getElementById(location.hash.slice(1)).getBoundingClientRect().top + window.scrollY); }, 60);
  }

  return {
    lenis,
    goTo,
    onSection: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    current: () => sections[current]?.id,
    stop: () => lenis?.stop(),
    resume: () => lenis?.start(),
  };
}
