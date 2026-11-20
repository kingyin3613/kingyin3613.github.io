// The headline is made of the same stuff as the lattice: letters near the
// indenter (your cursor) compress and stiffen, then relax.
export function initHero({ lattice, reduced }) {
  const title = document.querySelector('[data-letters]');
  if (!title) return;
  const text = title.textContent.trim();
  title.setAttribute('aria-label', text);
  title.textContent = '';
  const chars = [];
  text.split(' ').forEach((word, wi, words) => {
    const w = document.createElement('span');
    w.className = 'w';
    w.setAttribute('aria-hidden', 'true');
    for (const ch of word) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      w.appendChild(s);
      chars.push(s);
    }
    title.appendChild(w);
    if (wi < words.length - 1) title.appendChild(document.createTextNode(' '));
  });
  if (reduced) return;
  let centers = [];
  const measure = () => {
    centers = chars.map((c) => {
      const r = c.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2 + window.scrollY];
    });
  };
  measure();
  window.addEventListener('resize', measure, { passive: true });
  document.fonts?.ready.then(measure);
  const state = chars.map(() => ({ w: 112, g: 780 }));
  lattice.onFrame(() => {
    const p = lattice.pointer;
    if (window.scrollY > window.innerHeight * 1.2) return;
    const R = p.down ? 230 : 150;
    for (let i = 0; i < chars.length; i++) {
      const dx = p.x - centers[i][0];
      const dy = p.y + window.scrollY - centers[i][1];
      const k = p.x < -1000 ? 0 : Math.exp(-(dx * dx + dy * dy) / (R * R));
      const w = Math.round(112 - k * (p.down ? 37 : 22));
      const g = Math.round(780 + k * (p.down ? 120 : 60));
      if (w !== state[i].w || g !== state[i].g) {
        state[i].w = w; state[i].g = g;
        chars[i].style.setProperty('--w', w);
        chars[i].style.setProperty('--g', g);
      }
    }
  });
}
