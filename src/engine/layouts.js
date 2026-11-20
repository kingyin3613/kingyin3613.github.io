// Geometry generators for every scene of the lattice, in "unit" coordinates:
// x to the right, y downward, the stage roughly within the unit disk.
import { Delaunay } from 'd3-delaunay';
import { rng } from '../lib/random.js';
import { smoothstep } from '../lib/ease.js';
import { simulate, makePath, YIELD_STRAIN } from '../lab/plasticity.js';

// ---------------------------------------------------------------- wood
function growSeeds(rand, base) {
  const xs = [];
  const late = [];
  const push = (x, y, l) => { xs.push(x, y); late.push(l); };
  push(0, 0, 0.3);
  let r = base * 1.15;
  const rMax = 0.93;
  while (r < rMax) {
    // one annual ring: radial files of earlywood, then flattened latewood
    const nEarly = 3 + Math.floor(rand() * 3);
    const nLate = 2 + Math.floor(rand() * 2);
    const files = Math.max(8, Math.round((2 * Math.PI * (r + base)) / base));
    const off = rand();
    const wob = Array.from({ length: files }, () => rand.range(-0.09, 0.09));
    for (let row = 0; row < nEarly + nLate && r < rMax; row++) {
      const isLate = row >= nEarly;
      const dr = isLate ? base * rand.range(0.36, 0.46) : base * rand.range(0.88, 1.08);
      const lw = isLate ? 0.65 + 0.35 * ((row - nEarly + 1) / nLate) : 0.12 * (row / nEarly);
      for (let j = 0; j < files; j++) {
        const th = (2 * Math.PI * (j + off + wob[j] + rand.range(-0.035, 0.035))) / files;
        const rr = r + dr * (0.5 + rand.range(-0.07, 0.07));
        push(rr * Math.cos(th), rr * Math.sin(th), lw);
      }
      r += dr;
    }
  }
  // bark: a thin ring of small cells
  const rb = 0.972;
  const nb = Math.round((2 * Math.PI * rb) / (base * 0.6));
  for (let j = 0; j < nb; j++) {
    const th = (2 * Math.PI * (j + rand.range(-0.15, 0.15))) / nb;
    push((rb + rand.range(-0.005, 0.005)) * Math.cos(th), (rb + rand.range(-0.005, 0.005)) * Math.sin(th), 1);
  }
  return { xs, late };
}

export function buildWood({ seeds = 820, seed = 11 } = {}) {
  let base = 0.06;
  let grown;
  for (let it = 0; it < 6; it++) {
    grown = growSeeds(rng(seed), base);
    const count = grown.late.length;
    base *= Math.sqrt(count / seeds);
  }
  grown = growSeeds(rng(seed), base);
  const nIn = grown.late.length;
  // ghost seeds close the outer cells
  const all = grown.xs.slice();
  const ng = Math.round((2 * Math.PI * 1.07) / (base * 0.75));
  for (let j = 0; j < ng; j++) {
    const th = (2 * Math.PI * j) / ng;
    all.push(1.07 * Math.cos(th), 1.07 * Math.sin(th));
  }
  const pts = Float64Array.from(all);
  const del = new Delaunay(pts);
  const { triangles, halfedges } = del;
  const nt = triangles.length / 3;
  // circumcentres = Voronoi vertices
  const cx = new Float64Array(nt);
  const cy = new Float64Array(nt);
  for (let t = 0; t < nt; t++) {
    const i0 = triangles[3 * t], i1 = triangles[3 * t + 1], i2 = triangles[3 * t + 2];
    const ax = pts[2 * i0], ay = pts[2 * i0 + 1];
    const bx = pts[2 * i1] - ax, by = pts[2 * i1 + 1] - ay;
    const qx = pts[2 * i2] - ax, qy = pts[2 * i2 + 1] - ay;
    const d = 2 * (bx * qy - by * qx);
    if (Math.abs(d) < 1e-12) { cx[t] = 99; cy[t] = 99; continue; }
    const bl = bx * bx + by * by, ql = qx * qx + qy * qy;
    cx[t] = ax + (qy * bl - by * ql) / d;
    cy[t] = ay + (bx * ql - qx * bl) / d;
  }
  // keep vertices inside the log, merging near-duplicates
  const keep = new Int32Array(nt).fill(-1);
  const vx = [];
  const vy = [];
  const vlate = [];
  const grid = new Map();
  for (let t = 0; t < nt; t++) {
    const r = Math.hypot(cx[t], cy[t]);
    if (r > 1.03) continue;
    const key = Math.round(cx[t] * 2e4) + ',' + Math.round(cy[t] * 2e4);
    if (grid.has(key)) { keep[t] = grid.get(key); continue; }
    const id = vx.length;
    grid.set(key, id);
    keep[t] = id;
    vx.push(cx[t]);
    vy.push(cy[t]);
    let l = 0, c = 0;
    for (let k = 0; k < 3; k++) {
      const s = triangles[3 * t + k];
      if (s < nIn) { l += grown.late[s]; c++; }
    }
    vlate.push(c ? l / c : 1);
  }
  const V = vx.length;
  // Voronoi walls between kept vertices; Delaunay links between real seeds
  const walls = [];
  const wallLate = [];
  const links = [];
  for (let e = 0; e < halfedges.length; e++) {
    const o = halfedges[e];
    const a = triangles[e];
    const b = triangles[e % 3 === 2 ? e - 2 : e + 1];
    if (o < 0 || e < o) {
      if (a < nIn && b < nIn) links.push(a, b);
    }
    if (o < 0 || e > o) continue;
    const va = keep[Math.floor(e / 3)];
    const vb = keep[Math.floor(o / 3)];
    if (va < 0 || vb < 0 || va === vb) continue;
    walls.push(va, vb);
    wallLate.push(0.5 * (vlate[va] + vlate[vb]));
  }
  const seedsXY = Float32Array.from(grown.xs);
  return {
    V,
    S: nIn,
    verts: Float32Array.from(vx.flatMap((x, i) => [x, vy[i]])),
    vertLate: Float32Array.from(vlate),
    seeds: seedsXY,
    seedLate: Float32Array.from(grown.late),
    walls: Uint32Array.from(walls),
    wallLate: Float32Array.from(wallLate),
    links: Uint32Array.from(links),
  };
}

// A radial drying check from the bark toward the pith.
export function buildCrack(rand, theta0 = (205 * Math.PI) / 180) {
  const pts = [];
  const steps = 60;
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    const r = 1.04 - t * 0.8;
    const th = theta0 + 0.035 * Math.sin(t * 7.0 + 1.3) + 0.018 * Math.sin(t * 19.0) + t * 0.04;
    pts.push(r * Math.cos(th), r * Math.sin(th));
  }
  // cumulative arc length
  const s = [0];
  for (let k = 1; k <= steps; k++) {
    s.push(s[k - 1] + Math.hypot(pts[2 * k] - pts[2 * k - 2], pts[2 * k + 1] - pts[2 * k - 1]));
  }
  return { pts: Float32Array.from(pts), s: Float32Array.from(s), length: s[steps] };
}

// Project a point on the crack polyline: arc length, signed distance, normal.
export function crackFrame(crack, x, y) {
  const { pts, s } = crack;
  let best = 1e9, bs = 0, bd = 0, bnx = 0, bny = 0;
  for (let k = 0; k < s.length - 1; k++) {
    const ax = pts[2 * k], ay = pts[2 * k + 1];
    const dx = pts[2 * k + 2] - ax, dy = pts[2 * k + 3] - ay;
    const L2 = dx * dx + dy * dy;
    let u = ((x - ax) * dx + (y - ay) * dy) / L2;
    u = u < 0 ? 0 : u > 1 ? 1 : u;
    const px = ax + u * dx, py = ay + u * dy;
    const dist = Math.hypot(x - px, y - py);
    if (dist < best) {
      best = dist;
      const L = Math.sqrt(L2);
      bnx = -dy / L; bny = dx / L;
      const side = (x - px) * bnx + (y - py) * bny;
      bd = side >= 0 ? dist : -dist;
      bs = s[k] + u * L;
    }
  }
  return { s: bs, d: bd, nx: bnx, ny: bny };
}

// ---------------------------------------------------------------- stones
export function buildGrains(rand, nStones, corners = 6) {
  const floor = 0.86;
  const area = 1.25;
  const rMean = Math.sqrt((area * 0.62) / (nStones * Math.PI));
  const stones = [];
  for (let k = 0; k < nStones; k++) {
    const r = rMean * rand.range(0.7, 1.3);
    let bestX = 0, bestY = -1e9;
    const x0 = Math.max(-0.96, Math.min(0.96, rand.normal() * 0.42));
    for (let c = 0; c < 11; c++) {
      const x = Math.max(-1.0 + r, Math.min(1.0 - r, x0 + (c - 5) * 0.012));
      let y = floor - r;
      for (const st of stones) {
        const dx = x - st.x;
        const rr = r + st.r;
        if (Math.abs(dx) < rr) {
          const yc = st.y - Math.sqrt(rr * rr - dx * dx);
          if (yc < y) y = yc;
        }
      }
      if (y > bestY) { bestY = y; bestX = x; }
    }
    stones.push({ x: bestX, y: bestY, r });
  }
  const tops = stones.filter((st) => Math.abs(st.x) < 0.4).map((st) => st.y - st.r).sort((a, b) => a - b);
  const top = tops.length ? tops[Math.min(tops.length - 1, Math.floor(tops.length * 0.08))] : floor - 0.5;
  const slots = [];
  const edges = [];
  const kind = [];
  const addPoly = (pts, k) => {
    const start = slots.length / 2;
    for (let i = 0; i < pts.length; i += 2) { slots.push(pts[i], pts[i + 1]); kind.push(k); }
    const n = pts.length / 2;
    for (let i = 0; i < n; i++) edges.push(start + i, start + ((i + 1) % n));
  };
  for (const st of stones) {
    const pts = [];
    const off = rand() * Math.PI * 2;
    for (let j = 0; j < corners; j++) {
      const th = off + ((j + rand.range(-0.28, 0.28)) / corners) * Math.PI * 2;
      const rr = st.r * rand.range(0.74, 0.98);
      pts.push(st.x + rr * Math.cos(th), st.y + rr * Math.sin(th));
    }
    addPoly(pts, 0);
  }
  const sy0 = top - 0.13, sy1 = top - 0.008;
  addPoly([-0.46, sy0, 0.46, sy0, 0.46, sy1, -0.46, sy1], 1);
  for (const rx of [-0.27, 0.27]) {
    addPoly([rx - 0.035, sy0 - 0.07, rx + 0.035, sy0 - 0.07, rx + 0.035, sy0, rx - 0.035, sy0], 1);
  }
  return { slots: Float32Array.from(slots), edges: Uint32Array.from(edges), kind: Uint8Array.from(kind), floor, top };
}

// ---------------------------------------------------------------- light
// alpha-titanium (hcp) reflections; ring radius proportional to 1/d.
const TI_RINGS = [
  { hkl: '10.0', q: 0.3914, I: 0.45 },
  { hkl: '00.2', q: 0.4273, I: 0.35 },
  { hkl: '10.1', q: 0.446, I: 1.0 },
  { hkl: '10.2', q: 0.5797, I: 0.3 },
  { hkl: '11.0', q: 0.678, I: 0.35 },
  { hkl: '10.3', q: 0.751, I: 0.4 },
  { hkl: '20.0', q: 0.7828, I: 0.12 },
  { hkl: '11.2', q: 0.8014, I: 0.32 },
  { hkl: '20.1', q: 0.8115, I: 0.25 },
];

export function buildLight(rand, budget) {
  const ringCenter = [0.0, -0.16];
  const Rmax = 0.74;
  const qmax = TI_RINGS[TI_RINGS.length - 1].q;
  const nSpec = Math.min(190, Math.floor(budget * 0.12));
  const nRings = budget - nSpec;
  const weights = TI_RINGS.map((r) => (r.q / qmax) * (0.35 + r.I));
  const wsum = weights.reduce((a, b) => a + b, 0);
  const slots = [];
  const ringOf = [];
  const intensity = [];
  const edges = [];
  const radii = [];
  TI_RINGS.forEach((ring, k) => {
    const n = Math.max(24, Math.round((nRings * weights[k]) / wsum));
    const R = (ring.q / qmax) * Rmax;
    radii.push(R);
    const start = slots.length / 2;
    for (let j = 0; j < n; j++) {
      const th = (2 * Math.PI * (j + rand.range(-0.25, 0.25))) / n;
      const rr = R * (1 + rand.normal() * 0.004);
      slots.push(ringCenter[0] + rr * Math.cos(th), ringCenter[1] + rr * Math.sin(th));
      ringOf.push(k);
      intensity.push(ring.I);
    }
    for (let j = 0; j < n; j++) edges.push(start + j, start + ((j + 1) % n));
  });
  const specStart = slots.length / 2;
  const x0 = -0.95, x1 = 0.95, base = 0.9;
  for (let j = 0; j < nSpec; j++) {
    slots.push(x0 + ((x1 - x0) * j) / (nSpec - 1), base);
    ringOf.push(-1);
    intensity.push(0.3);
    if (j > 0) edges.push(specStart + j - 1, specStart + j);
  }
  return {
    slots: Float32Array.from(slots),
    edges: Uint32Array.from(edges),
    ringOf: Int16Array.from(ringOf),
    intensity: Float32Array.from(intensity),
    radii,
    rings: TI_RINGS,
    center: ringCenter,
    spec: { start: specStart, count: nSpec, x0, x1, base, qmax },
  };
}

// Energy-dispersive spectrum: peaks at energies proportional to 1/d, shifted by strain.
export function spectrumHeight(x, spec, rings, strain) {
  const t = (x - spec.x0) / (spec.x1 - spec.x0); // 0..1 energy axis
  let h = 0.018 + 0.03 * Math.exp(-t * 3.5);
  for (const r of rings) {
    const c = 0.12 + 0.78 * (r.q / spec.qmax) * (1 - strain);
    const w = 0.0065;
    h += 0.26 * r.I * Math.exp(-((t - c) * (t - c)) / (2 * w * w));
  }
  return h;
}

// ---------------------------------------------------------------- architecture
export function buildArch(rand, budget) {
  const x0 = -0.98, x1 = 0.98, y0 = -0.3, y1 = 0.92;
  const area = (x1 - x0) * (y1 - y0);
  const nIndenter = 46;
  const target = budget - nIndenter - 2;
  const h = Math.sqrt((area * 2) / (Math.sqrt(3) * target));
  const rows = Math.floor((y1 - y0) / ((h * Math.sqrt(3)) / 2)) + 1;
  const cols = Math.floor((x1 - x0) / h) + 1;
  const slots = [];
  const id = [];
  for (let j = 0; j < rows; j++) {
    const row = [];
    const off = (j % 2) * h * 0.5;
    for (let i = 0; i < cols; i++) {
      const x = x0 + off + i * h;
      if (x > x1 + 1e-6) { row.push(-1); continue; }
      row.push(slots.length / 2);
      slots.push(x + rand.normal() * h * 0.015, y0 + (j * h * Math.sqrt(3)) / 2 + rand.normal() * h * 0.015);
    }
    id.push(row);
  }
  const edges = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = id[j][i];
      if (a < 0) continue;
      if (i + 1 < cols && id[j][i + 1] >= 0) edges.push(a, id[j][i + 1]);
      if (j + 1 < rows) {
        const odd = j % 2 === 1;
        const l = odd ? i : i - 1;
        const r = odd ? i + 1 : i;
        if (l >= 0 && l < cols && id[j + 1][l] >= 0) edges.push(a, id[j + 1][l]);
        if (r >= 0 && r < cols && id[j + 1][r] >= 0) edges.push(a, id[j + 1][r]);
      }
    }
  }
  const nLattice = slots.length / 2;
  const Rind = 0.3;
  const ind = { cx: 0, cy: y0 - Rind - 0.01, R: Rind, start: nLattice, count: nIndenter, top: y0 };
  for (let j = 0; j < nIndenter; j++) {
    const th = Math.PI * (0.06 + (0.88 * j) / (nIndenter - 1));
    slots.push(ind.cx + Rind * Math.cos(th), ind.cy + Rind * Math.sin(th));
    if (j > 0) edges.push(nLattice + j - 1, nLattice + j);
  }
  // shaft
  const s0 = slots.length / 2;
  const rim = Rind * Math.cos(Math.PI * 0.06);
  slots.push(ind.cx + rim, ind.cy - 0.62, ind.cx - rim, ind.cy - 0.62);
  edges.push(nLattice, s0, nLattice + nIndenter - 1, s0 + 1);
  // hop distance from the contact zone, for message-passing pulses
  const n = slots.length / 2;
  const adj = Array.from({ length: n }, () => []);
  for (let k = 0; k < edges.length; k += 2) { adj[edges[k]].push(edges[k + 1]); adj[edges[k + 1]].push(edges[k]); }
  const hop = new Int32Array(n).fill(-1);
  const queue = [];
  for (let i = 0; i < nLattice; i++) {
    if (Math.hypot(slots[2 * i], slots[2 * i + 1] - y0) < h * 1.6) { hop[i] = 0; queue.push(i); }
  }
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q];
    for (const j of adj[i]) if (j < nLattice && hop[j] < 0) { hop[j] = hop[i] + 1; queue.push(j); }
  }
  return { slots: Float32Array.from(slots), edges: Uint32Array.from(edges), nLattice, ind, hop, h };
}

// ---------------------------------------------------------------- laws
export function buildLaws(rand, budget) {
  const T = 8, H = 10;
  const slots = [];
  const role = []; // 0 hidden, 1 input, 2 output, 3 curve, 4 cloud, 5 axis
  const col = [];
  const nnEdges = [];
  const curveEdges = [];
  const net = [];
  for (let t = 0; t < T; t++) {
    const x = -0.84 + (t * 1.68) / (T - 1);
    const hid = [];
    for (let j = 0; j < H; j++) {
      hid.push(slots.length / 2);
      slots.push(x + rand.normal() * 0.012, -0.74 + (j * 0.52) / (H - 1));
      role.push(0); col.push(t);
    }
    const inp = slots.length / 2;
    slots.push(x, -0.06); role.push(1); col.push(t);
    const out = slots.length / 2;
    slots.push(x, -0.93); role.push(2); col.push(t);
    net.push({ hid, inp, out });
  }
  for (let t = 0; t < T; t++) {
    const { hid, inp, out } = net[t];
    for (const h of hid) { nnEdges.push(inp, h, t * 3 + 0); nnEdges.push(h, out, t * 3 + 2); }
    if (t + 1 < T) {
      for (const h of hid) {
        for (let k = 0; k < 3; k++) nnEdges.push(h, net[t + 1].hid[Math.floor(rand() * H)], t * 3 + 1);
      }
    }
  }
  // hysteresis loop from the plasticity model
  const strains = makePath('cyclic', 3, 2);
  const { stress } = simulate(strains);
  const ex = 0.86 / (3.15 * YIELD_STRAIN);
  const sy = 0.36 / 1060;
  const yc = 0.56;
  const curveStart = slots.length / 2;
  for (let i = 0; i < strains.length; i++) {
    slots.push(strains[i] * ex, yc - stress[i] * sy);
    role.push(3); col.push(i / (strains.length - 1));
    if (i > 0) curveEdges.push(curveStart + i - 1, curveStart + i);
  }
  const axes = slots.length / 2;
  slots.push(-0.93, yc, 0.93, yc, 0, yc - 0.4, 0, yc + 0.4);
  role.push(5, 5, 5, 5); col.push(0, 0, 0, 0);
  curveEdges.push(axes, axes + 1, axes + 2, axes + 3);
  const nCloud = Math.max(0, Math.min(560, budget - slots.length / 2));
  for (let k = 0; k < nCloud; k++) {
    const i = Math.floor(rand() * strains.length);
    slots.push(strains[i] * ex + rand.normal() * 0.012, yc - stress[i] * sy + rand.normal() * 0.03);
    role.push(4); col.push(i / (strains.length - 1));
  }
  return {
    slots: Float32Array.from(slots),
    role: Uint8Array.from(role),
    col: Float32Array.from(col),
    nnEdges: Uint32Array.from(nnEdges),
    curveEdges: Uint32Array.from(curveEdges),
    T, H, curveStart, curveCount: strains.length,
  };
}

// ---------------------------------------------------------------- ask
export function buildSphere(rand, count) {
  const p = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    p[3 * i] = r * Math.cos(th);
    p[3 * i + 1] = y;
    p[3 * i + 2] = r * Math.sin(th);
  }
  const edges = [];
  const seen = new Set();
  const K = 3;
  for (let i = 0; i < count; i++) {
    const best = [];
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const dx = p[3 * i] - p[3 * j], dy = p[3 * i + 1] - p[3 * j + 1], dz = p[3 * i + 2] - p[3 * j + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (best.length < K || d < best[best.length - 1][0]) {
        best.push([d, j]);
        best.sort((a, b) => a[0] - b[0]);
        if (best.length > K) best.pop();
      }
    }
    for (const [, j] of best) {
      const key = i < j ? i * 65536 + j : j * 65536 + i;
      if (!seen.has(key)) { seen.add(key); edges.push(i, j); }
    }
  }
  return { p3: p, edges: Uint32Array.from(edges), count };
}

// ---------------------------------------------------------------- career rings
export const CAREER_YEARS = [2012, 2026];
export function buildCareer(rand, budget) {
  const [ya, yb] = CAREER_YEARS;
  const nRing = yb - ya + 1;
  const radii = [];
  for (let k = 0; k < nRing; k++) radii.push(0.12 + (0.82 * k) / (nRing - 1));
  const total = radii.reduce((a, b) => a + b, 0);
  const slots = [];
  const ringOf = [];
  const edges = [];
  for (let k = 0; k < nRing; k++) {
    const n = Math.max(12, Math.round((budget * radii[k]) / total));
    const start = slots.length / 2;
    const off = rand();
    for (let j = 0; j < n; j++) {
      const th = (2 * Math.PI * (j + off + rand.range(-0.2, 0.2))) / n;
      const rr = radii[k] * (1 + rand.normal() * 0.006);
      slots.push(rr * Math.cos(th), rr * Math.sin(th));
      ringOf.push(k);
    }
    for (let j = 0; j < n; j++) edges.push(start + j, start + ((j + 1) % n));
  }
  return { slots: Float32Array.from(slots), ringOf: Int16Array.from(ringOf), edges: Uint32Array.from(edges), radii, years: [ya, yb] };
}
