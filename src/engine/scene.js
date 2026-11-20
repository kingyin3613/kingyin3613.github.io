// Assembles every layout onto one persistent set of nodes, defines each
// chapter's look and live dynamics, and blends between chapters per frame.
import { rng } from '../lib/random.js';
import { hilbertIndex } from '../lib/hilbert.js';
import { clamp, easings, smoothstep, easeInOutCubic } from '../lib/ease.js';
import {
  buildWood, buildCrack, crackFrame, buildGrains, buildLight, spectrumHeight,
  buildArch, buildLaws, buildSphere, buildCareer,
} from './layouts.js';

export const G = { WOOD: 0, FLOW: 1, GRAIN: 2, RING: 3, ARCH: 4, NN: 5, CURVE: 6, SPHERE: 7, CAREER: 8, NNIO: 9 };
export const NG = 10;
export const TEXW = 256;

const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const C = {
  amber: hex('#e8ab62'), cream: hex('#ffe4bd'), ember: hex('#ff6c3f'), sand: hex('#d4c0a1'),
  bone: hex('#f2ece2'), aqua: hex('#53d8ca'), teal: hex('#1d5b57'), xray: hex('#8db8ff'),
  white: hex('#ffffff'), lilac: hex('#cdb6ff'), gold: hex('#ffd27c'), paper: hex('#fff1cf'),
  grey: hex('#7c808a'), warm: hex('#ffe2a8'),
};

export function stageFor(kind, W, H) {
  const mobile = W < 860;
  switch (kind) {
    case 'hero':
      return mobile ? { cx: W * 0.5, cy: H * 0.66, R: Math.max(W, H) * 0.6 } : { cx: W * 0.68, cy: H * 0.57, R: Math.max(W, H) * 0.6 };
    case 'quiet':
      return { cx: W * 0.5, cy: H * 0.5, R: Math.max(W, H) * 0.9 };
    case 'contact':
      return mobile ? { cx: W * 0.5, cy: H * 0.3, R: Math.min(W * 0.42, H * 0.24) } : { cx: W * 0.7, cy: H * 0.5, R: Math.min(W * 0.24, H * 0.38) };
    default:
      return mobile ? { cx: W * 0.5, cy: H * 0.31, R: Math.min(W * 0.44, H * 0.26) } : { cx: W * 0.695, cy: H * 0.52, R: Math.min(W * 0.245, H * 0.4) };
  }
}

function sortedBy(n, key) {
  const idx = Array.from({ length: n }, (_, i) => i);
  const k = new Float64Array(n);
  for (let i = 0; i < n; i++) k[i] = key(i);
  idx.sort((a, b) => k[a] - k[b]);
  return idx;
}

const polarKey = (x, y) => {
  const r = Math.hypot(x, y);
  const band = Math.floor(r / 0.05);
  let a = Math.atan2(y, x) / (2 * Math.PI);
  if (a < 0) a += 1;
  return band + a * 0.999;
};
const hilbertKey = (x, y) => {
  const n = 1024;
  const gx = Math.max(0, Math.min(n - 1, Math.floor(((x + 2) / 4) * n)));
  const gy = Math.max(0, Math.min(n - 1, Math.floor(((y + 2) / 4) * n)));
  return hilbertIndex(n, gx, gy);
};

export class LatticeScene {
  constructor({ mobile = false, reducedMotion = false } = {}) {
    this.reducedMotion = reducedMotion;
    const rand = rng(2026);
    const wood = buildWood({ seeds: mobile ? 470 : 820, seed: 11 });
    this.wood = wood;
    const V = wood.V, S = wood.S, N = V + S;
    this.V = V; this.S = S; this.N = N;
    this.rows = Math.ceil(N / TEXW);
    const canon = new Float32Array(2 * N);
    canon.set(wood.verts, 0);
    canon.set(wood.seeds, 2 * V);
    this.canon = canon;
    const lateOf = new Float32Array(N);
    lateOf.set(wood.vertLate, 0);
    lateOf.set(wood.seedLate, V);
    this.lateOf = lateOf;
    this.orders = {
      polar: sortedBy(N, (i) => polarKey(canon[2 * i], canon[2 * i + 1])),
      hilbert: sortedBy(N, (i) => hilbertKey(canon[2 * i], canon[2 * i + 1])),
    };

    // crack geometry relative to every wood node
    const crack = buildCrack(rand);
    this.crack = crack;
    this.crackS = new Float32Array(N);
    this.crackD = new Float32Array(N);
    this.crackN = new Float32Array(2 * N);
    for (let i = 0; i < N; i++) {
      const f = crackFrame(crack, canon[2 * i], canon[2 * i + 1]);
      this.crackS[i] = f.s / crack.length;
      this.crackD[i] = f.d;
      this.crackN[2 * i] = f.nx;
      this.crackN[2 * i + 1] = f.ny;
    }

    this.edges = { a: [], b: [], group: [], rest: [], width: [], p0: [], p1: [] };
    this.states = {};
    this.buildWoodStates();
    this.buildGrainState(rand);
    this.buildLightState(rand, mobile);
    this.buildArchState(rand, mobile);
    this.buildLawsState(rand);
    this.buildAskState(rand, mobile);
    this.buildCareerState(rand, mobile);
    this.finalizeEdges();

    const cap = this.rows * TEXW;
    this.out = { pos: new Float32Array(4 * cap), col: new Float32Array(4 * cap) };
    this.swirl = new Float32Array(N);
    for (let i = 0; i < N; i++) this.swirl[i] = rand.range(-1, 1);
    // indentation field (mass-spring), shared by the interactive wood scenes
    this.u = new Float32Array(2 * V);
    this.v = new Float32Array(2 * V);
    this.energy = 0;
    this.indenter = { x: 0, y: 0, r: 0, target: 0, active: false };
    this.thinking = 0;
    this.highlightRing = -1;
    this.time = 0;
  }

  // ------------------------------------------------------------ helpers
  newState(id, opts) {
    const N = this.N;
    const st = {
      id,
      layout: opts.layout || id,
      stage: opts.stage || 'stage',
      ease: easings[opts.ease || 'cubic'],
      base: new Float32Array(2 * N),
      size: new Float32Array(N),
      alpha: new Float32Array(N),
      color: new Float32Array(3 * N),
      glow: new Float32Array(N),
      delay: new Float32Array(N),
      groups: new Float32Array(NG),
      pulse: new Float32Array(NG),
      speed: new Float32Array(NG).fill(0.5),
      strainVis: opts.strainVis || 0,
      crack: opts.crack ?? -10,
      tint: hex(opts.tint || '#0b0b0d'),
      accent: hex(opts.accent || '#e8ab62'),
      live: opts.live || null,
      sim: !!opts.sim,
    };
    st.pos = st.base;
    this.states[id] = st;
    return st;
  }

  dynamic(st) {
    st.pos = new Float32Array(st.base);
    st.dsize = new Float32Array(st.size);
    st.dalpha = new Float32Array(st.alpha);
    st.dcolor = new Float32Array(st.color);
    st.dglow = new Float32Array(st.glow);
  }

  // Map M layout slots onto nodes so that nearby stays nearby; returns node index per slot.
  assign(st, slots, keyType, park = true) {
    const N = this.N;
    const M = slots.length / 2;
    const keyF = keyType === 'polar' ? polarKey : hilbertKey;
    const slotOrder = sortedBy(M, (j) => keyF(slots[2 * j], slots[2 * j + 1]));
    const nodeOrder = this.orders[keyType];
    const nodeOfSlot = new Int32Array(M);
    const used = new Uint8Array(N);
    for (let j = 0; j < M; j++) {
      const q = Math.min(N - 1, Math.floor(((j + 0.5) * N) / M));
      const node = nodeOrder[q];
      nodeOfSlot[slotOrder[j]] = node;
      used[node] = 1;
      st.base[2 * node] = slots[2 * slotOrder[j]];
      st.base[2 * node + 1] = slots[2 * slotOrder[j] + 1];
    }
    if (park) {
      for (let i = 0; i < N; i++) {
        if (used[i]) continue;
        const a = Math.atan2(this.canon[2 * i + 1], this.canon[2 * i]);
        const r = 1.45 + 0.5 * ((i * 0.618) % 1);
        st.base[2 * i] = r * Math.cos(a);
        st.base[2 * i + 1] = r * Math.sin(a);
        st.alpha[i] = 0;
        st.size[i] = 1;
      }
    }
    return { nodeOfSlot, used };
  }

  addEdges(group, list, map, opts = {}) {
    const E = this.edges;
    const stride = opts.stride || 2;
    for (let k = 0; k < list.length; k += stride) {
      const a = map ? map[list[k]] : list[k];
      const b = map ? map[list[k + 1]] : list[k + 1];
      if (a === b) continue;
      E.a.push(a); E.b.push(b); E.group.push(group);
      E.rest.push(opts.rest ? opts.rest(k / stride, list[k], list[k + 1]) : 0);
      E.width.push(opts.width ? opts.width(k / stride) : 1);
      const p = opts.param ? opts.param(k / stride, list[k], list[k + 1], list[k + 2]) : [0, 1];
      E.p0.push(p[0]); E.p1.push(p[1]);
    }
  }

  finalizeEdges() {
    const E = this.edges;
    const n = E.a.length;
    this.edgeCount = n;
    this.edgeEnds = new Uint32Array(2 * n);
    this.edgeAttr = new Float32Array(4 * n);
    this.edgeParam = new Float32Array(2 * n);
    for (let k = 0; k < n; k++) {
      this.edgeEnds[2 * k] = E.a[k];
      this.edgeEnds[2 * k + 1] = E.b[k];
      this.edgeAttr[4 * k] = E.group[k];
      this.edgeAttr[4 * k + 1] = E.rest[k];
      this.edgeAttr[4 * k + 2] = E.width[k];
      this.edgeParam[2 * k] = E.p0[k];
      this.edgeParam[2 * k + 1] = E.p1[k];
    }
    this.edges = null;
  }

  // ------------------------------------------------------------ wood family
  buildWoodStates() {
    const { V, S, N, canon, lateOf, wood } = this;
    const radial = (st, spread = 0.7) => {
      for (let i = 0; i < N; i++) st.delay[i] = clamp(Math.hypot(canon[2 * i], canon[2 * i + 1])) * spread;
    };
    const woodLook = (st, vAlpha, gain = 1) => {
      st.base.set(canon);
      for (let i = 0; i < N; i++) {
        const l = lateOf[i];
        const c = mix3(C.amber, C.cream, Math.pow(l, 1.5) * 0.9);
        st.color.set([c[0] * gain, c[1] * gain, c[2] * gain], 3 * i);
        if (i < V) { st.alpha[i] = vAlpha * (0.75 + 0.25 * l); st.size[i] = 1.4 + 1.1 * l; }
        else { st.alpha[i] = 0; st.size[i] = 2; }
      }
    };

    const hero = this.newState('hero', { stage: 'hero', layout: 'wood', strainVis: 1, sim: true, tint: '#0c0a08', accent: '#e8ab62' });
    woodLook(hero, 0.55, 0.95);
    hero.groups[G.WOOD] = 0.5;
    radial(hero);
    this.dynamic(hero);

    const cells = this.newState('cells', { layout: 'wood', ease: 'back', sim: true, strainVis: 1, tint: '#16110b', accent: '#e8ab62' });
    woodLook(cells, 0.95, 1.0);
    cells.groups[G.WOOD] = 1;
    radial(cells, 0.85);
    this.dynamic(cells);

    // crack: walls that span the check break as its tip passes
    const late = wood.walls;
    const fracture = this.newState('crack', { layout: 'wood', tint: '#170d0a', accent: '#ff6c3f', crack: 0 });
    woodLook(fracture, 0.85, 0.82);
    fracture.groups[G.WOOD] = 1;
    this.dynamic(fracture);
    fracture.live = (st, ctx) => this.liveCrack(st, ctx.sub, ctx);

    this.addEdges(G.WOOD, late, null, {
      rest: (k, a, b) => Math.hypot(canon[2 * a] - canon[2 * b], canon[2 * a + 1] - canon[2 * b + 1]),
      width: (k) => 0.9 + 0.9 * wood.wallLate[k],
      param: (k, a, b) => {
        const da = this.crackD[a], db = this.crackD[b];
        const sa = this.crackS[a], sb = this.crackS[b];
        if (Math.sign(da) !== Math.sign(db) && Math.min(Math.abs(da), Math.abs(db)) < 0.06 && Math.max(sa, sb) < 0.995) {
          return [0.5 * (sa + sb), 0];
        }
        return [99, 0];
      },
    });

    // flow: the dual Delaunay lattice carries moisture in from bark and crack
    const flow = this.newState('flow', { layout: 'wood', tint: '#08130f', accent: '#53d8ca', crack: 1.05 });
    woodLook(flow, 0.32, 0.55);
    this.openCrack(flow.base, 1);
    this.phi = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const x = flow.base[2 * i], y = flow.base[2 * i + 1];
      const fromBark = Math.max(0, 1 - Math.hypot(x, y));
      const fromCrack = this.crackS[i] < 1 ? Math.abs(this.crackD[i]) * 0.9 + this.crackS[i] * 0.25 : 9;
      this.phi[i] = Math.min(fromBark, fromCrack);
    }
    for (let i = V; i < N; i++) {
      flow.alpha[i] = 0.95;
      flow.size[i] = 2.3;
      flow.color.set(C.teal, 3 * i);
    }
    flow.groups[G.WOOD] = 0.3;
    flow.groups[G.FLOW] = 0.62;
    flow.pulse[G.FLOW] = 0.9;
    flow.speed[G.FLOW] = 0.55;
    this.dynamic(flow);
    flow.live = (st, ctx) => this.liveFlow(st, ctx.sub, ctx.t);
    this.addEdges(G.FLOW, wood.links, null, {
      param: (k, a, b) => {
        const pa = this.phi[V + a], pb = this.phi[V + b];
        return [Math.min(pa, pb) * 7.5, pb >= pa ? 1 : -1];
      },
    });
    // remap flow edge endpoints to node indices (seeds follow vertices)
    const E = this.edges;
    for (let k = E.a.length - wood.links.length / 2; k < E.a.length; k++) { E.a[k] += V; E.b[k] += V; }

    const quiet = this.newState('quiet', { stage: 'quiet', layout: 'wood', tint: '#0a0a0c', accent: '#8c7a62' });
    woodLook(quiet, 0.22, 0.7);
    quiet.groups[G.WOOD] = 0.16;
    radial(quiet, 0.4);
    this.dynamic(quiet);
    quiet.live = (st, ctx) => this.rotateWood(st, ctx.t * 0.012);

    const contact = this.newState('contact', { stage: 'contact', layout: 'wood', ease: 'back', sim: true, strainVis: 1, tint: '#0c0a08', accent: '#e8ab62' });
    woodLook(contact, 0.9, 1.0);
    contact.groups[G.WOOD] = 0.85;
    radial(contact, 0.8);
    this.dynamic(contact);
  }

  openCrack(pos, p, out) {
    const { N, crackS, crackD, crackN, canon } = this;
    const tip = p;
    const d0 = 0.085;
    for (let i = 0; i < N; i++) {
      let x = canon[2 * i], y = canon[2 * i + 1];
      const s = crackS[i];
      if (s < tip) {
        const open = d0 * Math.sqrt((tip - s) / 1.0) * Math.exp(-Math.abs(crackD[i]) / 0.42);
        const sg = crackD[i] >= 0 ? 1 : -1;
        x += sg * crackN[2 * i] * open * 0.5;
        y += sg * crackN[2 * i + 1] * open * 0.5;
      }
      pos[2 * i] = x;
      pos[2 * i + 1] = y;
    }
  }

  liveCrack(st, sub, ctx) {
    const p = easeInOutCubic(clamp(sub * 1.15));
    st.crack = p * 1.03;
    this.openCrack(st.pos, p);
    const { N, crackS, crackD } = this;
    st.dglow.fill(0);
    st.dcolor.set(st.color);
    for (let i = 0; i < N; i++) {
      const ds = crackS[i] - p;
      if (Math.abs(crackD[i]) < 0.16 && ds > -0.06 && ds < 0.05 && p > 0.01 && p < 1.0) {
        const k = Math.exp(-(ds * ds) / 0.0012) * Math.exp(-Math.abs(crackD[i]) / 0.06);
        st.dglow[i] = k * 1.2;
        const c = mix3([st.color[3 * i], st.color[3 * i + 1], st.color[3 * i + 2]], C.ember, Math.min(1, k * 1.6));
        st.dcolor.set(c, 3 * i);
      }
    }
  }

  liveFlow(st, sub, t) {
    const { V, N, phi } = this;
    const front = 0.06 + 0.62 * easeInOutCubic(clamp(sub * 1.1)) + 0.02 * Math.sin(t * 0.8);
    for (let i = V; i < N; i++) {
      const wet = smoothstep(front, front - 0.14, phi[i]);
      const c = mix3(C.teal, C.aqua, wet);
      st.dcolor.set(c, 3 * i);
      st.dglow[i] = wet * 0.35;
      st.dalpha[i] = 0.55 + 0.45 * wet;
    }
    for (let i = 0; i < V; i++) {
      const wet = smoothstep(front, front - 0.14, phi[i]);
      st.dalpha[i] = st.alpha[i] * (0.8 + 0.9 * wet);
    }
  }

  rotateWood(st, ang) {
    const { N, canon } = this;
    const c = Math.cos(ang), s = Math.sin(ang);
    for (let i = 0; i < N; i++) {
      const x = canon[2 * i], y = canon[2 * i + 1];
      st.pos[2 * i] = c * x - s * y;
      st.pos[2 * i + 1] = s * x + c * y;
    }
  }

  // ------------------------------------------------------------ stones
  buildGrainState(rand) {
    const { N } = this;
    const st = this.newState('grains', { ease: 'drop', tint: '#141210', accent: '#d4c0a1' });
    const nStones = Math.floor((N * 0.86) / 6) - 3;
    const g = buildGrains(rand, nStones);
    const { nodeOfSlot } = this.assign(st, g.slots, 'hilbert');
    let yMin = 9, yMax = -9;
    for (let j = 0; j < g.kind.length; j++) { yMin = Math.min(yMin, g.slots[2 * j + 1]); yMax = Math.max(yMax, g.slots[2 * j + 1]); }
    for (let j = 0; j < g.kind.length; j++) {
      const i = nodeOfSlot[j];
      const sleeper = g.kind[j] === 1;
      st.alpha[i] = sleeper ? 1 : 0.9;
      st.size[i] = sleeper ? 1.6 : 1.5;
      st.color.set(sleeper ? C.bone : C.sand, 3 * i);
      st.delay[i] = sleeper ? 0.95 : clamp((yMax - g.slots[2 * j + 1]) / (yMax - yMin)) * 0.85;
    }
    st.groups[G.GRAIN] = 0.9;
    this.grainInfo = { nodeOfSlot, kind: g.kind, top: g.top };
    this.addEdges(G.GRAIN, g.edges, nodeOfSlot, {
      rest: (k, a, b) => Math.hypot(g.slots[2 * a] - g.slots[2 * b], g.slots[2 * a + 1] - g.slots[2 * b + 1]),
    });
    this.dynamic(st);
    st.live = (s, ctx) => {
      // a train passes every few seconds: the ballast shivers under the sleeper
      const cyc = (ctx.t % 7) / 7;
      const env = Math.sin(Math.PI * clamp((cyc - 0.55) / 0.35)) ** 2;
      if (env <= 0.001) { s.pos.set(s.base); return; }
      for (let j = 0; j < g.kind.length; j++) {
        const i = nodeOfSlot[j];
        const x = s.base[2 * i], y = s.base[2 * i + 1];
        const near = g.kind[j] === 1 ? 1 : Math.exp(-((x * x) / 0.25 + ((y - g.top) * (y - g.top)) / 0.08));
        const a = 0.0045 * env * near;
        s.pos[2 * i] = x + a * Math.sin(ctx.t * 61 + i);
        s.pos[2 * i + 1] = y + a * Math.cos(ctx.t * 47 + i * 1.7);
      }
    };
  }

  // ------------------------------------------------------------ light
  buildLightState(rand, mobile) {
    const { N } = this;
    const st = this.newState('light', { tint: '#0a0e18', accent: '#8db8ff' });
    const L = buildLight(rand, Math.min(N, mobile ? 1000 : 1650));
    const { nodeOfSlot } = this.assign(st, L.slots, 'polar');
    for (let j = 0; j < L.ringOf.length; j++) {
      const i = nodeOfSlot[j];
      const I = L.intensity[j];
      const ring = L.ringOf[j] >= 0;
      st.alpha[i] = ring ? 0.35 + 0.6 * I : 0.95;
      st.size[i] = ring ? 1.1 + 1.6 * I : 1.5;
      st.color.set(ring ? mix3(C.xray, C.white, I * 0.75) : mix3(C.xray, C.white, 0.4), 3 * i);
      const x = L.slots[2 * j] - L.center[0], y = L.slots[2 * j + 1] - L.center[1];
      st.delay[i] = ring ? clamp(Math.hypot(x, y)) * 0.75 : 0.9;
    }
    st.groups[G.RING] = 0.85;
    this.lightInfo = { L, nodeOfSlot };
    this.addEdges(G.RING, L.edges, nodeOfSlot);
    this.dynamic(st);
    const phase = new Float32Array(N);
    for (let i = 0; i < N; i++) phase[i] = rand() * 6.28;
    st.live = (s, ctx) => {
      const eps = 0.055 * easeInOutCubic(clamp(ctx.sub * 1.1));
      const [cx, cy] = L.center;
      const sx = 1 - eps, sy = 1 + 0.34 * eps;
      for (let j = 0; j < L.ringOf.length; j++) {
        const i = nodeOfSlot[j];
        if (L.ringOf[j] >= 0) {
          s.pos[2 * i] = cx + (L.slots[2 * j] - cx) * sx;
          s.pos[2 * i + 1] = cy + (L.slots[2 * j + 1] - cy) * sy;
          s.dalpha[i] = s.alpha[i] * (0.78 + 0.22 * Math.sin(ctx.t * 2.2 + phase[i]));
        } else {
          const x = L.slots[2 * j];
          s.pos[2 * i] = x;
          s.pos[2 * i + 1] = L.spec.base - spectrumHeight(x, L.spec, L.rings, eps) * 0.85;
        }
      }
    };
  }

  // ------------------------------------------------------------ architecture
  buildArchState(rand, mobile) {
    const { N } = this;
    const st = this.newState('arch', { ease: 'back', strainVis: 1, tint: '#110d18', accent: '#cdb6ff' });
    const A = buildArch(rand, Math.min(N, mobile ? 560 : 900));
    const { nodeOfSlot } = this.assign(st, A.slots, 'hilbert');
    const nSlots = A.slots.length / 2;
    for (let j = 0; j < nSlots; j++) {
      const i = nodeOfSlot[j];
      const lattice = j < A.nLattice;
      st.alpha[i] = lattice ? 0.92 : 1;
      st.size[i] = lattice ? 1.6 : 1.4;
      st.color.set(lattice ? C.lilac : C.white, 3 * i);
      st.delay[i] = lattice ? clamp((A.slots[2 * j + 1] + 0.4) / 1.4) * 0.8 : 0;
    }
    st.groups[G.ARCH] = 0.95;
    st.pulse[G.ARCH] = 0.65;
    st.speed[G.ARCH] = 0.75;
    this.addEdges(G.ARCH, A.edges, nodeOfSlot, {
      rest: (k, a, b) => (a < A.nLattice && b < A.nLattice ? Math.hypot(A.slots[2 * a] - A.slots[2 * b], A.slots[2 * a + 1] - A.slots[2 * b + 1]) : 0),
      param: (k, a, b) => {
        if (a >= A.nLattice || b >= A.nLattice) return [-50, 1];
        const ha = A.hop[a], hb = A.hop[b];
        return [Math.min(ha, hb) / 3, hb >= ha ? 1 : -1];
      },
    });
    this.dynamic(st);
    const ind = A.ind;
    st.live = (s, ctx) => {
      const depth = 0.15 * easeInOutCubic(clamp(ctx.sub * 1.15)) + 0.004 * Math.sin(ctx.t * 1.3);
      const cy = ind.cy + depth;
      for (let j = 0; j < nSlots; j++) {
        const i = nodeOfSlot[j];
        let x = A.slots[2 * j], y = A.slots[2 * j + 1];
        if (j >= A.nLattice) { s.pos[2 * i] = x; s.pos[2 * i + 1] = y + depth; continue; }
        const dx = x - ind.cx, dy = y - ind.top;
        const f = Math.exp(-(dx * dx + dy * dy * 0.7) / 0.11);
        x += depth * 0.32 * dx * f * 2.2;
        y += depth * f;
        const ex = x - ind.cx, ey = y - cy;
        const r = Math.hypot(ex, ey);
        if (r < ind.R && ey > 0) { x = ind.cx + (ex / r) * ind.R; y = cy + (ey / r) * ind.R; }
        s.pos[2 * i] = x;
        s.pos[2 * i + 1] = y;
      }
    };
  }

  // ------------------------------------------------------------ laws
  buildLawsState(rand) {
    const st = this.newState('laws', { tint: '#14110a', accent: '#ffd27c' });
    const L = buildLaws(rand, this.N);
    const { nodeOfSlot } = this.assign(st, L.slots, 'hilbert');
    const n = L.role.length;
    const look = [
      [0.95, 2.4, C.gold], [1, 3.2, C.white], [1, 3.2, C.white], [1, 1.5, C.paper], [0.3, 1.2, C.gold], [0.35, 1.0, C.grey],
    ];
    for (let j = 0; j < n; j++) {
      const i = nodeOfSlot[j];
      const [a, sz, c] = look[L.role[j]];
      st.alpha[i] = a; st.size[i] = sz; st.color.set(c, 3 * i);
      st.delay[i] = clamp((L.slots[2 * j] + 1) / 2) * 0.8;
    }
    st.groups[G.NN] = 0.5;
    st.groups[G.CURVE] = 0.9;
    st.pulse[G.NN] = 1.0;
    st.speed[G.NN] = 0.9;
    const hidden = [], io = [];
    for (let k = 0; k < L.nnEdges.length; k += 3) {
      const stage = L.nnEdges[k + 2];
      (stage % 3 === 1 ? hidden : io).push(L.nnEdges[k], L.nnEdges[k + 1], stage);
    }
    this.addEdges(G.NN, hidden, nodeOfSlot, { stride: 3, param: (k, a, b, stage) => [stage / 3, 1] });
    this.addEdges(G.NNIO, io, nodeOfSlot, { stride: 3, param: (k, a, b, stage) => [stage / 3, 1] });
    st.groups[G.NNIO] = 0.2;
    st.pulse[G.NNIO] = 0.8;
    st.speed[G.NNIO] = 0.9;
    this.addEdges(G.CURVE, L.curveEdges, nodeOfSlot);
    this.dynamic(st);
    const lab = this.newState('lab', { layout: 'laws', tint: '#100e09', accent: '#ffd27c' });
    lab.base = st.base; lab.pos = st.pos; lab.delay = st.delay;
    lab.size = st.size; lab.color = st.color; lab.glow = st.glow;
    lab.alpha = st.alpha.map((a) => a * 0.35);
    lab.groups.set(st.groups.map((g) => g * 0.3));
    lab.pulse.set(st.pulse.map((g) => g * 0.5));
    lab.speed.set(st.speed);
    const curve = [];
    for (let j = L.curveStart; j < L.curveStart + L.curveCount; j++) curve.push(nodeOfSlot[j]);
    st.live = (s, ctx) => {
      s.dglow.fill(0);
      const head = ((ctx.t * 0.11) % 1) * (curve.length - 1);
      for (let k = 0; k < curve.length; k++) {
        const d = Math.abs(k - head);
        const i = curve[k];
        s.dglow[i] = d < 6 ? (1 - d / 6) * 1.4 : 0;
        s.dsize[i] = s.size[i] + (d < 6 ? (1 - d / 6) * 2 : 0);
      }
    };
  }

  // ------------------------------------------------------------ ask
  buildAskState(rand, mobile) {
    const { N } = this;
    const st = this.newState('ask', { tint: '#0d0c10', accent: '#ffe2a8' });
    const M = Math.min(N, mobile ? 600 : 1000);
    const sp = buildSphere(rand, M);
    const slots = new Float32Array(2 * M);
    for (let j = 0; j < M; j++) { slots[2 * j] = sp.p3[3 * j] * 0.82; slots[2 * j + 1] = sp.p3[3 * j + 1] * 0.82; }
    const { nodeOfSlot, used } = this.assign(st, slots, 'polar');
    for (let j = 0; j < M; j++) {
      const i = nodeOfSlot[j];
      st.alpha[i] = 0.8; st.size[i] = 1.8; st.color.set(C.warm, 3 * i);
      st.delay[i] = rand() * 0.7;
    }
    // remaining nodes: faint dust around the sphere
    for (let i = 0; i < N; i++) {
      if (used[i]) continue;
      const a = rand() * Math.PI * 2, r = 1.05 + rand() * 0.75;
      st.base[2 * i] = r * Math.cos(a); st.base[2 * i + 1] = r * Math.sin(a) * 0.8;
      st.alpha[i] = 0.12 + rand() * 0.12; st.size[i] = 1.0; st.color.set(C.warm, 3 * i);
      st.delay[i] = rand() * 0.8;
    }
    st.groups[G.SPHERE] = 0.42;
    st.speed[G.SPHERE] = 0.6;
    this.addEdges(G.SPHERE, sp.edges, nodeOfSlot, { param: () => [rand() * 3, rand() < 0.5 ? 1 : -1] });
    this.dynamic(st);
    st.live = (s, ctx) => {
      const ang = ctx.t * 0.09;
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const tilt = 0.38, ct = Math.cos(tilt), stl = Math.sin(tilt);
      const breathe = 1 + 0.015 * Math.sin(ctx.t * 1.1) + 0.03 * this.thinking * Math.sin(ctx.t * 6);
      for (let j = 0; j < M; j++) {
        const i = nodeOfSlot[j];
        const x0 = sp.p3[3 * j], y0 = sp.p3[3 * j + 1], z0 = sp.p3[3 * j + 2];
        const x1 = ca * x0 + sa * z0, z1 = -sa * x0 + ca * z0;
        const y2 = ct * y0 - stl * z1, z2 = stl * y0 + ct * z1;
        const persp = 1 / (1.9 - z2 * 0.35);
        s.pos[2 * i] = x1 * 0.82 * breathe * persp * 1.55;
        s.pos[2 * i + 1] = y2 * 0.82 * breathe * persp * 1.55;
        const depth = (z2 + 1) / 2;
        s.dalpha[i] = 0.18 + 0.82 * depth * depth;
        s.dsize[i] = 1.2 + 1.4 * depth + this.thinking * 0.8 * Math.max(0, Math.sin(ctx.t * 5 + j));
        s.dglow[i] = this.thinking * 0.5 * depth;
      }
    };
  }

  // ------------------------------------------------------------ career
  buildCareerState(rand, mobile) {
    const { N } = this;
    const st = this.newState('career', { tint: '#0f0d0a', accent: '#ffd27c' });
    const K = buildCareer(rand, Math.min(N, mobile ? 900 : 1500));
    const { nodeOfSlot } = this.assign(st, K.slots, 'polar');
    const nS = K.ringOf.length;
    for (let j = 0; j < nS; j++) {
      const i = nodeOfSlot[j];
      st.alpha[i] = 0.5; st.size[i] = 1.3; st.color.set(mix3(C.amber, C.paper, 0.5), 3 * i);
      st.delay[i] = (K.ringOf[j] / K.radii.length) * 0.8;
    }
    st.groups[G.CAREER] = 0.55;
    this.addEdges(G.CAREER, K.edges, nodeOfSlot);
    this.dynamic(st);
    this.careerInfo = { K, nodeOfSlot };
    st.live = (s, ctx) => {
      const hl = this.highlightRing;
      for (let j = 0; j < nS; j++) {
        const i = nodeOfSlot[j];
        const on = hl >= 0 && K.ringOf[j] === hl;
        const pulse = 0.5 + 0.5 * Math.sin(ctx.t * 2 - K.ringOf[j] * 0.5);
        s.dalpha[i] = on ? 1 : 0.32 + 0.22 * pulse;
        s.dglow[i] = on ? 0.6 : 0;
        s.dsize[i] = on ? 2.2 : 1.2;
        s.dcolor.set(on ? C.gold : mix3(C.amber, C.paper, 0.5), 3 * i);
      }
    };
  }

  // ------------------------------------------------------------ interaction
  // Mass-spring indentation on the wood lattice (unit coordinates).
  stepIndent(dt) {
    const { V, canon, u, v } = this;
    const ind = this.indenter;
    ind.r += (ind.target - ind.r) * Math.min(1, dt * 10);
    if (!ind.active && ind.r < 1e-4 && this.energy < 1e-7) return false;
    const ends = this.edgeEnds;
    const attr = this.edgeAttr;
    const wallCount = this.wallCount;
    const ks = 900, ka = 34, damp = 10;
    const sub = 4;
    const h = Math.min(dt, 1 / 30) / sub;
    const fx = this._fx || (this._fx = new Float32Array(V));
    const fy = this._fy || (this._fy = new Float32Array(V));
    for (let s = 0; s < sub; s++) {
      fx.fill(0); fy.fill(0);
      for (let k = 0; k < wallCount; k++) {
        const a = ends[2 * k], b = ends[2 * k + 1];
        const ax = canon[2 * a] + u[2 * a], ay = canon[2 * a + 1] + u[2 * a + 1];
        const bx = canon[2 * b] + u[2 * b], by = canon[2 * b + 1] + u[2 * b + 1];
        const dx = bx - ax, dy = by - ay;
        const L = Math.hypot(dx, dy);
        if (L < 1e-7) continue;
        const L0 = attr[4 * k + 1];
        const f = ks * (L - L0);
        const ux = dx / L, uy = dy / L;
        fx[a] += f * ux; fy[a] += f * uy; fx[b] -= f * ux; fy[b] -= f * uy;
      }
      let e = 0;
      for (let i = 0; i < V; i++) {
        const ax = fx[i] - ka * u[2 * i] - damp * v[2 * i];
        const ay = fy[i] - ka * u[2 * i + 1] - damp * v[2 * i + 1];
        v[2 * i] += ax * h; v[2 * i + 1] += ay * h;
        u[2 * i] += v[2 * i] * h; u[2 * i + 1] += v[2 * i + 1] * h;
        if (ind.r > 1e-4) {
          const px = canon[2 * i] + u[2 * i] - ind.x, py = canon[2 * i + 1] + u[2 * i + 1] - ind.y;
          const d = Math.hypot(px, py);
          if (d < ind.r && d > 1e-9) {
            const push = ind.r - d;
            u[2 * i] += (px / d) * push; u[2 * i + 1] += (py / d) * push;
            const vn = v[2 * i] * (px / d) + v[2 * i + 1] * (py / d);
            if (vn < 0) { v[2 * i] -= vn * (px / d); v[2 * i + 1] -= vn * (py / d); }
          }
        }
        e += v[2 * i] * v[2 * i] + v[2 * i + 1] * v[2 * i + 1] + u[2 * i] * u[2 * i] + u[2 * i + 1] * u[2 * i + 1];
      }
      if (!Number.isFinite(e)) { u.fill(0); v.fill(0); e = 0; }
      this.energy = e;
    }
    return true;
  }

  // ------------------------------------------------------------ per frame
  // ctx: { a, b, m, subA, subB, t, dt, W, H, pointer }
  update(ctx) {
    const { N } = this;
    const A = this.states[ctx.a] || this.states.hero;
    const B = this.states[ctx.b] || A;
    const m = A === B ? 0 : clamp(ctx.m);
    this.time = ctx.t;
    const TA = stageFor(A.stage, ctx.W, ctx.H);
    const TB = stageFor(B.stage, ctx.W, ctx.H);
    if (ctx.shift) {
      const k = 1 - ctx.shift * 0.0009;
      for (const T of [TA, TB]) { T.cx -= ctx.shift; T.R *= k; }
    }

    // pointer -> indenter in the unit frame of the interactive wood scene in view
    const simState = A.sim && m < 0.5 ? A : B.sim && m >= 0.5 ? B : null;
    if (simState && ctx.pointer && !this.reducedMotion) {
      const T = simState === A ? TA : TB;
      const ind = this.indenter;
      ind.active = ctx.pointer.inside;
      ind.x = (ctx.pointer.x - T.cx) / T.R;
      ind.y = (ctx.pointer.y - T.cy) / T.R;
      ind.target = ctx.pointer.inside ? (ctx.pointer.down ? 112 : 34) / T.R : 0;
    } else {
      this.indenter.active = false;
      this.indenter.target = 0;
    }
    if (this.wallCount === undefined) {
      let c = 0;
      while (c < this.edgeCount && this.edgeAttr[4 * c] === G.WOOD) c++;
      this.wallCount = c;
    }
    const simRunning = this.stepIndent(ctx.dt);

    for (const [st, sub, w] of [[A, ctx.subA, 1 - m], [B, ctx.subB, m]]) {
      if (w <= 0 && st !== A) continue;
      if (st.live) st.live(st, { sub: sub || 0, t: ctx.t, dt: ctx.dt });
      if (st.sim && simRunning) {
        const { V, canon, u } = this;
        for (let i = 0; i < V; i++) {
          st.pos[2 * i] = canon[2 * i] + u[2 * i];
          st.pos[2 * i + 1] = canon[2 * i + 1] + u[2 * i + 1];
        }
      }
    }

    const pa = A.pos, pb = B.pos;
    const sa = A.dsize || A.size, sb = B.dsize || B.size;
    const aa = A.dalpha || A.alpha, ab = B.dalpha || B.alpha;
    const ca = A.dcolor || A.color, cb = B.dcolor || B.color;
    const ga = A.dglow || A.glow, gb = B.dglow || B.glow;
    const out = this.out;
    const WIN = 0.55;
    const ease = B.ease;
    const sameLayout = A.layout === B.layout;
    for (let i = 0; i < N; i++) {
      let e = 0;
      if (m > 0) {
        const t = clamp((m - B.delay[i] * (1 - WIN)) / WIN);
        e = sameLayout ? easeInOutCubic(t) : ease(t);
      }
      const xa = TA.cx + pa[2 * i] * TA.R, ya = TA.cy + pa[2 * i + 1] * TA.R;
      let x = xa, y = ya;
      if (e > 0) {
        const xb = TB.cx + pb[2 * i] * TB.R, yb = TB.cy + pb[2 * i + 1] * TB.R;
        const dx = xb - xa, dy = yb - ya;
        const sw = Math.sin(Math.PI * Math.min(1, e)) * 0.22 * this.swirl[i];
        x = xa + dx * e - dy * sw;
        y = ya + dy * e + dx * sw;
      }
      const k4 = 4 * i;
      out.pos[k4] = x;
      out.pos[k4 + 1] = y;
      out.pos[k4 + 2] = sa[i] + (sb[i] - sa[i]) * e;
      out.pos[k4 + 3] = aa[i] + (ab[i] - aa[i]) * e;
      const k3 = 3 * i;
      out.col[k4] = ca[k3] + (cb[k3] - ca[k3]) * e;
      out.col[k4 + 1] = ca[k3 + 1] + (cb[k3 + 1] - ca[k3 + 1]) * e;
      out.col[k4 + 2] = ca[k3 + 2] + (cb[k3 + 2] - ca[k3 + 2]) * e;
      out.col[k4 + 3] = ga[i] + (gb[i] - ga[i]) * e;
    }

    // uniforms
    const groups = new Float32Array(NG);
    const pulse = new Float32Array(NG);
    const speed = new Float32Array(NG);
    const fadeOut = sameLayout ? 1 - m : 1 - smoothstep(0.0, 0.55, m);
    const fadeIn = sameLayout ? m : smoothstep(0.45, 1.0, m);
    for (let g = 0; g < NG; g++) {
      groups[g] = A.groups[g] * fadeOut + B.groups[g] * fadeIn;
      pulse[g] = A.pulse[g] * (1 - m) + B.pulse[g] * m;
      speed[g] = A.speed[g] * (1 - m) + B.speed[g] * m;
    }
    pulse[G.SPHERE] = Math.max(pulse[G.SPHERE], this.thinking * groups[G.SPHERE] > 0 ? this.thinking : 0);
    const tint = mix3(A.tint, B.tint, m);
    const accent = mix3(A.accent, B.accent, m);
    return {
      groups, pulse, speed,
      strainVis: A.strainVis * (1 - m) + B.strainVis * m,
      unitScale: TA.R + (TB.R - TA.R) * m,
      crack: m < 0.5 ? A.crack : B.crack,
      tint, accent,
      glowPos: [TA.cx + (TB.cx - TA.cx) * m, TA.cy + (TB.cy - TA.cy) * m],
      glowR: TA.R + (TB.R - TA.R) * m,
    };
  }
}
