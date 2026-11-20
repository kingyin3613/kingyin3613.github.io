// Training data for the lab: random strain histories through the plasticity
// model, with measurement noise, normalised for the network.
import { createState, step, YIELD_STRAIN } from './plasticity.js';

export const SCALE = { strain: 4 * YIELD_STRAIN, dstrain: 0.14 * YIELD_STRAIN, stress: 1100 };
export const MAX_STEP = 0.12 * YIELD_STRAIN;

// Rate-independent material: re-sample any path so increments stay small.
export function resample(path) {
  const out = [path[0]];
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i];
    const n = Math.max(1, Math.ceil(Math.abs(b - a) / MAX_STEP));
    for (let k = 1; k <= n; k++) out.push(a + ((b - a) * k) / n);
  }
  return Float64Array.from(out);
}

export function randomPath(rand, T) {
  const ey = YIELD_STRAIN;
  const amp = (1.6 + rand() * 2.4) * ey;
  const out = new Float64Array(T);
  let e = 0;
  let target = (rand() * 2 - 1) * amp;
  for (let t = 1; t < T; t++) {
    const inc = (0.06 + rand() * 0.06) * ey;
    if (Math.abs(target - e) < inc) target = (rand() * 2 - 1) * amp;
    e += Math.sign(target - e) * inc;
    out[t] = e;
  }
  return out;
}

export function stresses(path) {
  const s = createState();
  const out = new Float64Array(path.length);
  for (let i = 0; i < path.length; i++) out[i] = step(s, path[i]);
  return out;
}

export function features(path) {
  const T = path.length;
  const x = new Float64Array(2 * T);
  for (let t = 0; t < T; t++) {
    x[2 * t] = path[t] / SCALE.strain;
    x[2 * t + 1] = (t ? path[t] - path[t - 1] : 0) / SCALE.dstrain;
  }
  return x;
}

export function makeBatch(rand, B, T, noiseMPa = 9) {
  const xs = [], ys = [];
  for (let b = 0; b < B; b++) {
    const p = randomPath(rand, T);
    const s = stresses(p);
    const y = new Float64Array(T);
    for (let t = 0; t < T; t++) {
      const u1 = rand() || 1e-12, u2 = rand();
      const g = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      y[t] = (s[t] + g * noiseMPa) / SCALE.stress;
    }
    xs.push(features(p));
    ys.push(y);
  }
  return { xs, ys };
}
