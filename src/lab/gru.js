// A tiny gated recurrent unit with hand-written backpropagation through time
// and Adam, small enough to train in a browser tab. Inputs per step: strain and
// strain increment; output: stress. The hidden state plays the role of the
// internal variables (back stress, accumulated plastic strain) of plasticity.

const sigmoid = (x) => 1 / (1 + Math.exp(-x));

export class GRU {
  constructor(H = 16, D = 2, rand = Math.random) {
    this.H = H;
    this.D = D;
    const names = [
      ['Wr', H * D], ['Ur', H * H], ['br', H],
      ['Wz', H * D], ['Uz', H * H], ['bz', H],
      ['Wn', H * D], ['Un', H * H], ['bn', H], ['bhn', H],
      ['Wo', H], ['Wx', D], ['bo', 1],
    ];
    this.off = {};
    let n = 0;
    for (const [k, s] of names) { this.off[k] = n; n += s; }
    this.size = n;
    this.P = new Float64Array(n);
    this.G = new Float64Array(n);
    this.m = new Float64Array(n);
    this.v = new Float64Array(n);
    this.steps = 0;
    this.init(rand);
  }

  init(rand) {
    const k = 1 / Math.sqrt(this.H);
    for (let i = 0; i < this.size; i++) this.P[i] = (rand() * 2 - 1) * k;
    const { bz } = this.off;
    for (let i = 0; i < this.H; i++) this.P[bz + i] += 0.6; // lean toward remembering
    this.m.fill(0); this.v.fill(0); this.steps = 0;
  }

  // Forward over one sequence. x: Float64Array(T*D). Returns cache with outputs.
  forward(x, T, cache) {
    const { H, D, P, off } = this;
    const c = cache && cache.T >= T ? cache : {
      T, hp: new Float64Array(T * H), r: new Float64Array(T * H), z: new Float64Array(T * H),
      n: new Float64Array(T * H), ahn: new Float64Array(T * H), h: new Float64Array(T * H), y: new Float64Array(T),
    };
    const { Wr, Ur, br, Wz, Uz, bz, Wn, Un, bn, bhn, Wo, Wx, bo } = off;
    const hprev = new Float64Array(H);
    for (let t = 0; t < T; t++) {
      const xo = t * D, o = t * H;
      for (let i = 0; i < H; i++) c.hp[o + i] = hprev[i];
      for (let i = 0; i < H; i++) {
        let ar = P[br + i], az = P[bz + i], an = P[bn + i], ah = P[bhn + i];
        for (let d = 0; d < D; d++) {
          const xv = x[xo + d];
          ar += P[Wr + i * D + d] * xv;
          az += P[Wz + i * D + d] * xv;
          an += P[Wn + i * D + d] * xv;
        }
        const ur = Ur + i * H, uz = Uz + i * H, un = Un + i * H;
        for (let j = 0; j < H; j++) {
          const hj = hprev[j];
          ar += P[ur + j] * hj;
          az += P[uz + j] * hj;
          ah += P[un + j] * hj;
        }
        const r = sigmoid(ar), z = sigmoid(az);
        const nn = Math.tanh(an + r * ah);
        c.r[o + i] = r; c.z[o + i] = z; c.n[o + i] = nn; c.ahn[o + i] = ah;
        c.h[o + i] = (1 - z) * nn + z * hprev[i];
      }
      // stress reads the current strain directly plus the learned internal state,
      // like sigma = F(epsilon, xi) in a recurrent neural operator
      let y = P[bo];
      for (let d = 0; d < D; d++) y += P[Wx + d] * x[xo + d];
      for (let i = 0; i < H; i++) { hprev[i] = c.h[o + i]; y += P[Wo + i] * hprev[i]; }
      c.y[t] = y;
    }
    return c;
  }

  // Accumulate gradients of 0.5 * sum (y - s)^2 * scale into G.
  backward(x, s, T, c, scale) {
    const { H, D, P, G, off } = this;
    const { Wr, Ur, br, Wz, Uz, bz, Wn, Un, bn, bhn, Wo, Wx, bo } = off;
    const dhNext = new Float64Array(H);
    const dh = new Float64Array(H);
    const dar = new Float64Array(H), daz = new Float64Array(H), dahn = new Float64Array(H), dan = new Float64Array(H);
    let loss = 0;
    for (let t = T - 1; t >= 0; t--) {
      const o = t * H, xo = t * D;
      const err = c.y[t] - s[t];
      loss += 0.5 * err * err * scale;
      const dy = err * scale;
      G[bo] += dy;
      for (let d = 0; d < D; d++) G[Wx + d] += dy * x[xo + d];
      for (let i = 0; i < H; i++) {
        G[Wo + i] += dy * c.h[o + i];
        dh[i] = dy * P[Wo + i] + dhNext[i];
      }
      for (let i = 0; i < H; i++) {
        const z = c.z[o + i], n = c.n[o + i], r = c.r[o + i], hp = c.hp[o + i];
        const dn = dh[i] * (1 - z);
        const dz = dh[i] * (hp - n);
        dan[i] = dn * (1 - n * n);
        dahn[i] = dan[i] * r;
        const dr = dan[i] * c.ahn[o + i];
        dar[i] = dr * r * (1 - r);
        daz[i] = dz * z * (1 - z);
        dhNext[i] = dh[i] * z;
      }
      for (let i = 0; i < H; i++) {
        G[br + i] += dar[i]; G[bz + i] += daz[i]; G[bn + i] += dan[i]; G[bhn + i] += dahn[i];
        for (let d = 0; d < D; d++) {
          const xv = x[xo + d];
          G[Wr + i * D + d] += dar[i] * xv;
          G[Wz + i * D + d] += daz[i] * xv;
          G[Wn + i * D + d] += dan[i] * xv;
        }
        const ur = Ur + i * H, uz = Uz + i * H, un = Un + i * H;
        for (let j = 0; j < H; j++) {
          const hj = c.hp[o + j];
          G[ur + j] += dar[i] * hj;
          G[uz + j] += daz[i] * hj;
          G[un + j] += dahn[i] * hj;
          dhNext[j] += P[ur + j] * dar[i] + P[uz + j] * daz[i] + P[un + j] * dahn[i];
        }
      }
    }
    return loss;
  }

  adam(lr = 3e-3, clip = 1.0, b1 = 0.9, b2 = 0.999, eps = 1e-8) {
    const { P, G, m, v } = this;
    let norm = 0;
    for (let i = 0; i < G.length; i++) norm += G[i] * G[i];
    norm = Math.sqrt(norm);
    const k = norm > clip ? clip / norm : 1;
    this.steps++;
    const c1 = 1 - Math.pow(b1, this.steps), c2 = 1 - Math.pow(b2, this.steps);
    for (let i = 0; i < P.length; i++) {
      const g = G[i] * k;
      m[i] = b1 * m[i] + (1 - b1) * g;
      v[i] = b2 * v[i] + (1 - b2) * g * g;
      P[i] -= (lr * (m[i] / c1)) / (Math.sqrt(v[i] / c2) + eps);
    }
    G.fill(0);
    return norm;
  }
}
