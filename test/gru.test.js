import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GRU } from '../src/lab/gru.js';
import { rng } from '../src/lib/random.js';

test('GRU backpropagation through time matches finite differences', () => {
  const rand = rng(42);
  const net = new GRU(4, 2, rand);
  const T = 7;
  const x = Float64Array.from({ length: 2 * T }, () => rand() * 2 - 1);
  const s = Float64Array.from({ length: T }, () => rand() * 2 - 1);
  const loss = () => {
    const c = net.forward(x, T);
    let L = 0;
    for (let t = 0; t < T; t++) L += 0.5 * (c.y[t] - s[t]) ** 2;
    return L;
  };
  net.G.fill(0);
  const c = net.forward(x, T);
  net.backward(x, s, T, c, 1);
  const analytic = Float64Array.from(net.G);
  let worst = 0;
  for (let i = 0; i < net.size; i++) {
    const keep = net.P[i];
    const h = 1e-6;
    net.P[i] = keep + h; const lp = loss();
    net.P[i] = keep - h; const lm = loss();
    net.P[i] = keep;
    const numeric = (lp - lm) / (2 * h);
    const excess = Math.abs(numeric - analytic[i]) - (1e-8 + 1e-5 * (Math.abs(numeric) + Math.abs(analytic[i])));
    worst = Math.max(worst, excess);
  }
  assert.ok(worst <= 0, `gradient mismatch beyond tolerance by ${worst}`);
});
