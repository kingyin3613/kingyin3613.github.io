// Hovering a career step lights its growth ring in the lattice.
export function initPath({ lattice }) {
  const steps = [...document.querySelectorAll('.step[data-ring]')];
  const on = (s) => lattice.setHighlightRing(Number(s.dataset.ring));
  const off = () => lattice.setHighlightRing(-1);
  for (const s of steps) {
    s.addEventListener('pointerenter', () => on(s));
    s.addEventListener('pointerleave', off);
    s.addEventListener('focus', () => on(s));
    s.addEventListener('blur', off);
  }
}
