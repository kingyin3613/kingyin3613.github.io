// Trains the GRU continuously in a worker thread and reports progress.
import { GRU } from './gru.js';
import { makeBatch, features, stresses, resample, SCALE } from './data.js';
import { rng } from '../lib/random.js';

const B = 8, T = 96;
const MAX_STEPS = 14000; // converged enough; stop warming laptops
let net, rand, cache = null, ema = null, step = 0, running = false, probe = null, lastPost = 0, seed = 1;

function reset() {
  seed += 1;
  rand = rng(1000 + seed);
  net = new GRU(16, 2, rand);
  step = 0; ema = null; cache = null;
}

function setProbe(path) {
  const p = resample(Float64Array.from(path));
  probe = { p, x: features(p), truth: stresses(p) };
}

function lr() {
  if (step < 500) return 0.006;
  return Math.max(0.0015, 0.006 * Math.exp(-(step - 500) / 2500));
}

function trainStep() {
  const { xs, ys } = makeBatch(rand, B, T);
  let L = 0;
  for (let b = 0; b < B; b++) {
    cache = net.forward(xs[b], T, cache);
    L += net.backward(xs[b], ys[b], T, cache, 1 / (B * T));
  }
  net.adam(lr(), 1.0);
  step++;
  ema = ema === null ? L : 0.97 * ema + 0.03 * L;
}

function report(force) {
  const now = performance.now();
  if (!force && now - lastPost < 110) return;
  lastPost = now;
  let pred = null, err = null;
  if (probe) {
    const c = net.forward(probe.x, probe.p.length);
    pred = new Float32Array(probe.p.length);
    let se = 0, mx = 1;
    for (let t = 0; t < probe.p.length; t++) {
      pred[t] = c.y[t] * SCALE.stress;
      const e = pred[t] - probe.truth[t];
      se += e * e;
      mx = Math.max(mx, Math.abs(probe.truth[t]));
    }
    err = Math.sqrt(se / probe.p.length) / mx;
  }
  postMessage({
    type: 'progress', step, loss: ema === null ? null : 2 * ema, err, running,
    strain: probe ? Float32Array.from(probe.p) : null,
    truth: probe ? Float32Array.from(probe.truth) : null,
    pred,
  });
}

function loop() {
  if (!running) return;
  const t0 = performance.now();
  // about half of one core: train for a slice, then rest
  while (performance.now() - t0 < 16 && step < MAX_STEPS) trainStep();
  if (step >= MAX_STEPS) {
    running = false;
    report(true);
    postMessage({ type: 'done', step });
    return;
  }
  report(false);
  setTimeout(loop, 18);
}

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'init') { reset(); if (m.path) setProbe(m.path); report(true); }
  else if (m.type === 'start') { if (!running && step < MAX_STEPS) { running = true; loop(); } }
  else if (m.type === 'more') { if (!running) { step = Math.min(step, MAX_STEPS - 4000); running = true; loop(); } }
  else if (m.type === 'pause') { running = false; report(true); }
  else if (m.type === 'reset') { reset(); report(true); }
  else if (m.type === 'probe') { setProbe(m.path); report(true); }
};
