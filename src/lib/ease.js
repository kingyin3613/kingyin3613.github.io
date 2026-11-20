export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutQuint = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2);
export const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
// Elastic settle with a small overshoot, for morph arrivals.
export const easeOutBack = (t, s = 1.4) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
// Falling grains: accelerate, land, small rebound.
export const easeDrop = (t) => {
  if (t < 0.78) { const u = t / 0.78; return u * u; }
  const u = (t - 0.78) / 0.22;
  return 1 - 0.06 * Math.sin(Math.PI * u) * (1 - u);
};
export const easings = { cubic: easeInOutCubic, back: (t) => easeOutBack(easeInOutCubic(t)), drop: easeDrop, quint: easeInOutQuint };
