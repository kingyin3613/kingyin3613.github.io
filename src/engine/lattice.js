// Owns the canvas, the scene and the render loop. The page talks to it through
// setView (which scenes are blending, from scroll) and a few signals.
import { LatticeScene } from './scene.js';
import { GLRenderer, CanvasRenderer } from './renderer.js';

export class Lattice {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.reduced = reducedMotion;
    const small = window.innerWidth < 760 || Math.min(window.innerWidth, window.innerHeight) < 560;
    this.small = small;
    this.scene = new LatticeScene({ mobile: small, reducedMotion });
    try {
      this.renderer = new GLRenderer(canvas, this.scene);
      this.kind = 'webgl2';
    } catch (err) {
      this.renderer = new CanvasRenderer(canvas, this.scene);
      this.kind = 'canvas2d';
    }
    document.documentElement.dataset.renderer = this.kind;
    this.view = { a: 'hero', b: 'hero', m: 0, subA: 0, subB: 0 };
    this.pointer = { x: -9999, y: -9999, inside: false, down: false };
    this.listeners = new Set();
    this.t = 0;
    this.last = 0;
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    this.bindPointer();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
      else this.start();
    });
  }

  resize() {
    const W = this.canvas.clientWidth || window.innerWidth;
    const H = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.W = W; this.H = H; this.dpr = dpr;
    this.renderer.resize(W, H, dpr);
  }

  bindPointer() {
    const blocked = (el) => !el || !el.closest || el.closest('[data-no-indent], a, button, input, textarea, select, .bar');
    window.addEventListener('pointermove', (e) => {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.inside = !blocked(e.target) && e.pointerType !== 'touch';
    }, { passive: true });
    window.addEventListener('pointerdown', (e) => {
      if (blocked(e.target)) return;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.down = true;
      this.pointer.inside = true;
    }, { passive: true });
    const up = () => {
      this.pointer.down = false;
      if (this.pointerTouch) this.pointer.inside = false;
    };
    window.addEventListener('pointerup', (e) => { this.pointerTouch = e.pointerType === 'touch'; up(); }, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { this.pointer.inside = false; this.pointer.down = false; });
  }

  setView(v) { this.view = v; }
  setShift(px) { this.shiftTarget = px; }
  setThinking(v) { this.scene.thinking = v; }
  setHighlightRing(k) { this.scene.highlightRing = k; }
  onFrame(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      this.frame(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  frame(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    for (const fn of this.listeners) fn(dt);
    this.t += this.reduced ? 0 : dt;
    this.shift = (this.shift || 0) + ((this.shiftTarget || 0) - (this.shift || 0)) * Math.min(1, dt * 4);
    const v = this.view;
    const u = this.scene.update({
      a: v.a, b: v.b, m: v.m, subA: v.subA, subB: v.subB,
      t: this.t, dt, W: this.W, H: this.H,
      pointer: this.pointer,
      shift: this.shift,
    });
    if (this.reduced) { u.pulse.fill(0); }
    const mobile = this.W < 860;
    this.renderer.render(u, this.t, {
      lineScale: this.dpr >= 2 ? 1 : 1.15,
      edgeAlpha: mobile ? 0.8 : 1,
      nodeAlpha: mobile ? 0.85 : 1,
    });
    this.lastUniforms = u;
  }
}
