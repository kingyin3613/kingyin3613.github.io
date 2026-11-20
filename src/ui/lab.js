// The learning lab: draw a strain history, watch a network learn to answer it.
import { makePath, YIELD_STRAIN } from '../lab/plasticity.js';

const EY = YIELD_STRAIN;
const LIM = 4.2 * EY;

function fit(canvas) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function initLab({ reduced }) {
  const root = document.querySelector('[data-lab]');
  if (!root) return;
  const pathCv = root.querySelector('[data-lab-path]');
  const plotCv = root.querySelector('[data-lab-plot]');
  const spark = root.querySelector('[data-lab-spark]');
  const stepEl = root.querySelector('[data-lab-step]');
  const lossEl = root.querySelector('[data-lab-loss]');
  const errEl = root.querySelector('[data-lab-err]');
  const toggle = root.querySelector('[data-lab-toggle]');
  const resetBtn = root.querySelector('[data-lab-reset]');
  const presets = [...root.querySelectorAll('[data-lab-preset]')];

  let path = Array.from(makePath('cyclic', 3, 2));
  let data = null;
  const losses = [];
  let worker = null;
  let wanted = false;
  let paused = false;
  let visible = false;
  let done = false;

  const start = () => {
    if (!worker) {
      worker = new Worker(new URL('../lab/trainer.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        if (e.data.type === 'done') {
          done = true;
          toggle.textContent = 'Keep training';
          return;
        }
        if (e.data.type !== 'progress') return;
        data = e.data;
        if (data.loss) {
          losses.push(data.loss);
          if (losses.length > 400) losses.splice(0, losses.length - 400);
        }
        stepEl.textContent = data.step.toLocaleString('en-GB');
        lossEl.textContent = data.loss ? data.loss.toExponential(1) : '—';
        errEl.textContent = data.err != null ? (data.err * 100).toFixed(1) + '%' : '—';
        drawPlot();
        drawSpark();
      };
      worker.postMessage({ type: 'init', path });
    }
    if (!paused) worker.postMessage({ type: 'start' });
  };
  const pause = () => worker && worker.postMessage({ type: 'pause' });

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    wanted = visible;
    if (wanted) start();
    else pause();
  }, { rootMargin: '30% 0px 30% 0px' }).observe(root);

  toggle.addEventListener('click', () => {
    if (done) {
      done = false;
      paused = false;
      toggle.textContent = 'Pause training';
      worker?.postMessage({ type: 'more' });
      return;
    }
    paused = !paused;
    toggle.textContent = paused ? 'Resume training' : 'Pause training';
    if (paused) pause(); else start();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else if (visible && !paused && !done) start();
  });
  resetBtn.addEventListener('click', () => {
    losses.length = 0;
    done = false;
    paused = false;
    toggle.textContent = 'Pause training';
    if (worker) worker.postMessage({ type: 'reset' });
    if (!paused) start();
  });
  presets.forEach((b) => b.addEventListener('click', () => {
    presets.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const type = b.dataset.labPreset;
    path = Array.from(makePath(type, type === 'monotonic' ? 3.5 : 3, type === 'growing' ? 3 : 2, Math.floor(Math.random() * 1e6)));
    worker?.postMessage({ type: 'probe', path });
    drawPath();
  }));

  // ---- drawing a strain history
  let drawing = null;
  const toStrain = (y, h) => ((h / 2 - y) / (h / 2 - 10)) * LIM;
  pathCv.addEventListener('pointerdown', (e) => {
    pathCv.setPointerCapture(e.pointerId);
    const r = pathCv.getBoundingClientRect();
    drawing = [[0, 0], [Math.max(0, (e.clientX - r.left) / r.width), toStrain(e.clientY - r.top, r.height)]];
    presets.forEach((x) => x.setAttribute('aria-pressed', 'false'));
    drawPath();
  });
  pathCv.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const r = pathCv.getBoundingClientRect();
    const u = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const s = Math.max(-LIM, Math.min(LIM, toStrain(e.clientY - r.top, r.height)));
    const last = drawing[drawing.length - 1];
    if (u > last[0] + 0.004) drawing.push([u, s]);
    drawPath();
  });
  const finish = () => {
    if (!drawing) return;
    const pts = drawing;
    drawing = null;
    if (pts.length < 4) { drawPath(); return; }
    const n = 160;
    const out = [0];
    for (let k = 1; k <= n; k++) {
      const u = (k / n) * pts[pts.length - 1][0];
      let j = 1;
      while (j < pts.length - 1 && pts[j][0] < u) j++;
      const [u0, s0] = pts[j - 1], [u1, s1] = pts[j];
      out.push(s0 + ((s1 - s0) * (u - u0)) / Math.max(1e-6, u1 - u0));
    }
    path = out;
    worker?.postMessage({ type: 'probe', path });
    drawPath();
  };
  pathCv.addEventListener('pointerup', finish);
  pathCv.addEventListener('pointercancel', finish);

  function drawPath() {
    const { ctx, w, h } = fit(pathCv);
    ctx.clearRect(0, 0, w, h);
    const y = (s) => h / 2 - (s / LIM) * (h / 2 - 10);
    ctx.strokeStyle = 'rgba(242,238,231,0.08)';
    ctx.lineWidth = 1;
    for (const k of [-3, -2, -1, 1, 2, 3]) { ctx.beginPath(); ctx.moveTo(0, y(k * EY)); ctx.lineTo(w, y(k * EY)); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(242,238,231,0.22)';
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.fillStyle = 'rgba(242,238,231,0.4)';
    ctx.font = '11px "Mona Sans Variable", sans-serif';
    ctx.fillText('+3 εy', 6, y(3 * EY) - 4);
    ctx.fillText('−3 εy', 6, y(-3 * EY) + 13);
    ctx.fillText('time →', w - 50, h / 2 - 6);
    const line = (pts, color, lw) => {
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach(([u, s], i) => (i ? ctx.lineTo(u * w, y(s)) : ctx.moveTo(u * w, y(s))));
      ctx.stroke();
    };
    if (drawing) line(drawing, css('--accent') || '#ffd27c', 2);
    else line(path.map((s, i) => [i / (path.length - 1), s]), css('--accent') || '#ffd27c', 2);
  }

  function drawPlot() {
    const { ctx, w, h } = fit(plotCv);
    ctx.clearRect(0, 0, w, h);
    const SX = 4.2 * EY * 100, SY = 1250;
    const X = (e) => w / 2 + ((e * 100) / SX) * (w / 2 - 14);
    const Y = (s) => h / 2 - (s / SY) * (h / 2 - 12);
    ctx.strokeStyle = 'rgba(242,238,231,0.07)';
    ctx.lineWidth = 1;
    for (const s of [-1000, -500, 500, 1000]) { ctx.beginPath(); ctx.moveTo(0, Y(s)); ctx.lineTo(w, Y(s)); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(242,238,231,0.22)';
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
    ctx.fillStyle = 'rgba(242,238,231,0.42)';
    ctx.font = '11px "Mona Sans Variable", sans-serif';
    ctx.fillText('1000 MPa', w / 2 + 6, Y(1000) - 4);
    ctx.fillText('−1000', w / 2 + 6, Y(-1000) + 13);
    ctx.fillText('strain', w - 40, h / 2 - 6);
    if (!data || !data.strain) return;
    const n = data.strain.length;
    const draw = (arr, color, lw, glow) => {
      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineJoin = 'round';
      if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
      ctx.beginPath();
      for (let i = 0; i < n; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, X(data.strain[i]), Y(arr[i]));
      ctx.stroke();
      ctx.restore();
    };
    draw(data.truth, 'rgba(242,238,231,0.55)', 1.5, false);
    if (data.pred) draw(data.pred, '#ffd27c', 2, true);
  }

  function drawSpark() {
    const { ctx, w, h } = fit(spark);
    ctx.clearRect(0, 0, w, h);
    if (losses.length < 2) return;
    const lg = losses.map((l) => Math.log10(l));
    const mn = Math.min(...lg), mx = Math.max(...lg);
    ctx.strokeStyle = 'rgba(255,210,124,0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    lg.forEach((v, i) => {
      const x = (i / (lg.length - 1)) * w;
      const y = h - 2 - ((v - mn) / Math.max(1e-6, mx - mn)) * (h - 4);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  }

  drawPath();
  drawPlot();
  window.addEventListener('resize', () => { drawPath(); drawPlot(); drawSpark(); }, { passive: true });
  return { reduced };
}
