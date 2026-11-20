// Deterministic little drawings for each publication, by theme.
import { rng, hashString } from '../lib/random.js';

const ACCENT = {
  stones: '#d4c0a1', cells: '#e8ab62', fracture: '#ff6c3f', flow: '#53d8ca',
  light: '#8db8ff', architecture: '#cdb6ff', laws: '#ffd27c',
};

const f = (v) => +v.toFixed(2);

export function glyph(theme, key) {
  const r = rng(hashString(key));
  const c = ACCENT[theme] || '#e8ab62';
  let body = '';
  if (theme === 'stones') {
    for (let k = 0; k < 7; k++) {
      const cx = 8 + r() * 28, cy = 18 + r() * 20, rad = 3 + r() * 4;
      let d = '';
      for (let j = 0; j < 6; j++) {
        const a = (j / 6) * Math.PI * 2 + r() * 0.6;
        const rr = rad * (0.75 + r() * 0.25);
        d += (j ? 'L' : 'M') + f(cx + rr * Math.cos(a)) + ' ' + f(cy + rr * Math.sin(a));
      }
      body += `<path d="${d}Z"/>`;
    }
  } else if (theme === 'cells') {
    const cx = 4 + r() * 6, cy = 40 - r() * 6;
    for (let k = 1; k <= 6; k++) {
      const rad = k * 6 + (k % 2 ? 0 : 1.5);
      body += `<path d="M${f(cx + rad)} ${f(cy)}A${rad} ${rad} 0 0 0 ${f(cx)} ${f(cy - rad)}"/>`;
    }
    for (let k = 0; k < 9; k++) {
      const a = -((k + 0.5) / 9) * (Math.PI / 2);
      body += `<path d="M${f(cx + 3 * Math.cos(a))} ${f(cy + 3 * Math.sin(a))}L${f(cx + 40 * Math.cos(a))} ${f(cy + 40 * Math.sin(a))}" stroke-opacity="0.45"/>`;
    }
  } else if (theme === 'fracture') {
    let d = 'M2 ' + f(14 + r() * 16);
    for (let x = 6; x <= 42; x += 4) d += ' L' + x + ' ' + f(12 + r() * 20);
    body += `<path d="${d}"/>`;
    for (let k = 0; k < 4; k++) {
      const x = 8 + r() * 28, y = 6 + r() * 32;
      body += `<path d="M${f(x)} ${f(y)}l${f(r() * 6 - 3)} ${f(r() * 6 - 3)}" stroke-opacity="0.5"/>`;
    }
  } else if (theme === 'flow') {
    for (let k = 0; k < 4; k++) {
      const y = 9 + k * 8.5, a = 2 + r() * 3, ph = r() * 6;
      let d = 'M2 ' + f(y);
      for (let x = 4; x <= 42; x += 2) d += ' L' + x + ' ' + f(y + a * Math.sin(x / 6 + ph));
      body += `<path d="${d}" stroke-opacity="${f(0.45 + k * 0.15)}"/>`;
      body += `<circle cx="${f(6 + r() * 32)}" cy="${f(y)}" r="1.3" fill="${c}" stroke="none"/>`;
    }
  } else if (theme === 'light') {
    const e = 0.85 + r() * 0.12;
    for (const rad of [5, 9, 10.5, 15, 18.5, 20]) {
      body += `<ellipse cx="22" cy="22" rx="${f(rad * e)}" ry="${f(rad)}" stroke-opacity="${f(0.35 + r() * 0.65)}"/>`;
    }
  } else if (theme === 'architecture') {
    const h = 7;
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 6; i++) {
        const x = 4 + i * h + (j % 2) * h / 2, y = 6 + j * h * 0.866;
        if (x + h < 44) body += `<path d="M${f(x)} ${f(y)}L${f(x + h)} ${f(y)}"/>`;
        if (j < 5) body += `<path d="M${f(x)} ${f(y)}L${f(x + h / 2)} ${f(y + h * 0.866)}M${f(x)} ${f(y)}L${f(x - h / 2)} ${f(y + h * 0.866)}" stroke-opacity="0.6"/>`;
      }
    }
  } else {
    const cols = [6, 16, 28, 38];
    const counts = [2, 4, 4, 1];
    const pts = cols.map((x, k) => Array.from({ length: counts[k] }, (_, j) => [x, 22 + (j - (counts[k] - 1) / 2) * 8]));
    for (let k = 0; k < 3; k++) for (const a of pts[k]) for (const b of pts[k + 1]) body += `<path d="M${a[0]} ${f(a[1])}L${b[0]} ${f(b[1])}" stroke-opacity="0.45"/>`;
    for (const col of pts) for (const p of col) body += `<circle cx="${p[0]}" cy="${f(p[1])}" r="1.6" fill="${c}" stroke="none"/>`;
    body += `<path d="M16 12 C 22 ${f(2 + r() * 4)}, 30 ${f(2 + r() * 4)}, 28 12" stroke-opacity="0.8"/>`;
  }
  return `<svg viewBox="0 0 44 44" width="44" height="44" fill="none" stroke="${c}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}
