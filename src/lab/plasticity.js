// One-dimensional rate-independent elastoplasticity with combined hardening:
// Armstrong-Frederick nonlinear kinematic hardening (back stress) plus Voce
// isotropic hardening, integrated with a backward-Euler return mapping. It is
// the ground truth for the learning lab and for the guide's plasticity tool.
// Units: MPa and strain.

export const MATERIAL = Object.freeze({
  name: 'titanium-like alloy',
  E: 110000, // Young's modulus, MPa
  sy0: 820, // initial yield stress, MPa
  C: 52000, // kinematic hardening modulus, MPa
  gamma: 340, // dynamic recovery; back stress saturates at C / gamma
  Q: 70, // isotropic hardening saturation, MPa
  b: 18, // isotropic hardening rate
});

export const YIELD_STRAIN = MATERIAL.sy0 / MATERIAL.E;

export function createState() {
  return { ep: 0, alpha: 0, p: 0 };
}

// Advance the material to total strain `eps`; returns the stress.
export function step(state, eps, m = MATERIAL) {
  const sigTrial = m.E * (eps - state.ep);
  const xi = sigTrial - state.alpha;
  const R = m.Q * (1 - Math.exp(-m.b * state.p));
  const f = Math.abs(xi) - (m.sy0 + R);
  if (f <= 0) return sigTrial;
  const n = Math.sign(xi);
  const na = n * state.alpha;
  const ns = n * sigTrial;
  let dg = f / (m.E + m.C);
  for (let k = 0; k < 40; k++) {
    const den = 1 + m.gamma * dg;
    const ex = Math.exp(-m.b * (state.p + dg));
    const g = ns - m.E * dg - (na + m.C * dg) / den - m.sy0 - m.Q * (1 - ex);
    const dgd = -m.E - (m.C * den - (na + m.C * dg) * m.gamma) / (den * den) - m.Q * m.b * ex;
    const delta = g / dgd;
    dg -= delta;
    if (dg < 0) dg = 0;
    if (Math.abs(delta) < 1e-15) break;
  }
  state.ep += n * dg;
  state.alpha = (state.alpha + n * m.C * dg) / (1 + m.gamma * dg);
  state.p += dg;
  return m.E * (eps - state.ep);
}

export function simulate(strains, m = MATERIAL) {
  const s = createState();
  const stress = new Float64Array(strains.length);
  let plasticWork = 0;
  let prevEp = 0;
  let prevSig = 0;
  for (let i = 0; i < strains.length; i++) {
    const sig = step(s, strains[i], m);
    const dEp = s.ep - prevEp;
    plasticWork += 0.5 * (sig + prevSig) * dEp;
    stress[i] = sig;
    prevEp = s.ep;
    prevSig = sig;
  }
  return { stress, plasticStrain: s.ep, backStress: s.alpha, accumulated: s.p, plasticWork };
}

// Strain paths, amplitudes in multiples of the yield strain.
export const PATH_TYPES = ['monotonic', 'cyclic', 'growing', 'random'];

export function makePath(type, amplitude = 2.5, cycles = 2, seed = 7) {
  const a = amplitude * YIELD_STRAIN;
  const out = [0];
  const seg = (from, to, n) => {
    for (let i = 1; i <= n; i++) out.push(from + ((to - from) * i) / n);
  };
  const n = 24;
  if (type === 'monotonic') {
    seg(0, a, n * 3);
  } else if (type === 'cyclic') {
    let cur = 0;
    for (let c = 0; c < cycles; c++) {
      seg(cur, a, c === 0 ? n : 2 * n);
      seg(a, -a, 2 * n);
      cur = -a;
    }
    seg(cur, 0, n);
  } else if (type === 'growing') {
    let cur = 0;
    for (let c = 0; c < cycles; c++) {
      const amp = (a * (c + 1)) / cycles;
      seg(cur, amp, n * 2);
      seg(amp, -amp, n * 2);
      cur = -amp;
    }
    seg(cur, 0, n);
  } else {
    let x = 0;
    let s = seed >>> 0;
    const rnd = () => {
      s = (Math.imul(s ^ (s >>> 15), 2246822507) + 0x9e3779b9) >>> 0;
      return s / 4294967296;
    };
    const legs = 3 + cycles * 2;
    for (let k = 0; k < legs; k++) {
      const target = (rnd() * 2 - 1) * a;
      seg(x, target, Math.max(8, Math.round((Math.abs(target - x) / (2 * a)) * 3 * n)));
      x = target;
    }
  }
  return Float64Array.from(out);
}

// Summary numbers for the guide (plain JSON).
export function experiment(type = 'cyclic', amplitude = 2.5, cycles = 2) {
  const strains = makePath(type, amplitude, cycles);
  const r = simulate(strains);
  let peak = 0;
  for (const v of r.stress) peak = Math.max(peak, Math.abs(v));
  const sample = [];
  const stride = Math.max(1, Math.floor(strains.length / 60));
  for (let i = 0; i < strains.length; i += stride) {
    sample.push([+(strains[i] * 100).toFixed(4), +r.stress[i].toFixed(1)]);
  }
  return {
    material: MATERIAL.name,
    model: '1D return mapping, Armstrong-Frederick kinematic + Voce isotropic hardening',
    parameters_MPa: { E: MATERIAL.E, initial_yield_stress: MATERIAL.sy0, kinematic_modulus_C: MATERIAL.C, kinematic_recovery_gamma: MATERIAL.gamma, isotropic_saturation_Q: MATERIAL.Q, isotropic_rate_b: MATERIAL.b },
    path: type,
    amplitude_in_yield_strains: amplitude,
    cycles,
    steps: strains.length,
    peak_abs_stress_MPa: +peak.toFixed(1),
    final_plastic_strain_percent: +(r.plasticStrain * 100).toFixed(4),
    final_back_stress_MPa: +r.backStress.toFixed(1),
    accumulated_plastic_strain_percent: +(r.accumulated * 100).toFixed(4),
    plastic_work_MJ_per_m3: +r.plasticWork.toFixed(4),
    strain_percent_vs_stress_MPa_sampled: sample,
  };
}
