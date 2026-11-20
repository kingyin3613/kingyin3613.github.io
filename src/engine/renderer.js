// WebGL2 renderer for the lattice: instanced anti-aliased edges whose endpoints
// are fetched from a node texture, glowing point nodes, and a graded backdrop.
import { NG, TEXW } from './scene.js';

const EDGE_VS = `#version 300 es
precision highp float;
precision highp int;
layout(location=0) in vec2 a_corner;
layout(location=1) in uvec2 a_ends;
layout(location=2) in vec4 a_attr;   // group, rest length, width, unused
layout(location=3) in vec2 a_param;  // pulse phase or crack break time, direction
uniform sampler2D u_pos;
uniform sampler2D u_col;
uniform vec2 u_view;
uniform float u_groups[${NG}];
uniform float u_strainVis;
uniform float u_unitScale;
uniform float u_crack;
uniform float u_lineScale;
out vec4 v_color;
out float v_side;
out float v_u;
out float v_halfw;
flat out float v_phase;
flat out float v_dir;
flat out int v_g;
ivec2 tc(uint i) { return ivec2(int(i % ${TEXW}u), int(i / ${TEXW}u)); }
void main() {
  int g = int(a_attr.x + 0.5);
  vec4 pa = texelFetch(u_pos, tc(a_ends.x), 0);
  vec4 pb = texelFetch(u_pos, tc(a_ends.y), 0);
  float alpha = u_groups[g] * min(pa.w, pb.w);
  float flash = 0.0;
  if (g == 0 && a_param.x < 8.0) {
    float d = u_crack - a_param.x;
    if (d > 0.0) { flash = exp(-d * 28.0); alpha *= flash; }
    else { flash = exp(d * 22.0) * 0.8; }
  }
  if (alpha < 0.002) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec2 A = pa.xy, B = pb.xy;
  vec2 dv = B - A;
  float len = max(length(dv), 1e-4);
  vec2 n = vec2(-dv.y, dv.x) / len;
  float hw = 0.5 * a_attr.z * u_lineScale + 0.85;
  vec2 p = mix(A, B, a_corner.x) + n * a_corner.y * hw;
  vec2 clip = p / u_view * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  vec4 ca = texelFetch(u_col, tc(a_ends.x), 0);
  vec4 cb = texelFetch(u_col, tc(a_ends.y), 0);
  vec3 col = mix(ca.rgb, cb.rgb, a_corner.x);
  if (u_strainVis > 0.0 && a_attr.y > 0.0) {
    float strain = (len / u_unitScale - a_attr.y) / a_attr.y;
    col = mix(col, vec3(1.0, 0.42, 0.22), clamp(strain * 5.0, 0.0, 1.0) * u_strainVis);
    col = mix(col, vec3(0.42, 0.72, 1.0), clamp(-strain * 5.0, 0.0, 1.0) * u_strainVis);
    alpha *= 1.0 + clamp(abs(strain) * 6.0, 0.0, 1.2) * u_strainVis;
  }
  col = mix(col, vec3(1.0, 0.55, 0.25), clamp(flash, 0.0, 1.0));
  alpha = min(alpha * (1.0 + flash * 1.5), 1.0);
  v_color = vec4(col, alpha);
  v_side = a_corner.y;
  v_u = a_corner.x;
  v_halfw = hw;
  v_phase = a_param.x;
  v_dir = a_param.y;
  v_g = g;
}`;

const EDGE_FS = `#version 300 es
precision highp float;
in vec4 v_color;
in float v_side;
in float v_u;
in float v_halfw;
flat in float v_phase;
flat in float v_dir;
flat in int v_g;
uniform float u_time;
uniform float u_pulse[${NG}];
uniform float u_speed[${NG}];
out vec4 o;
void main() {
  float dist = abs(v_side) * v_halfw;
  float aa = 1.0 - smoothstep(v_halfw - 1.1, v_halfw, dist);
  float a = v_color.a * aa;
  vec3 col = v_color.rgb;
  float amp = u_pulse[v_g];
  if (amp > 0.0 && v_phase > -40.0) {
    float tau = fract(u_time * u_speed[v_g] - v_phase);
    float pos = v_dir >= 0.0 ? v_u : 1.0 - v_u;
    float c = tau * 3.0;
    float k = exp(-pow((pos - c) * 5.5, 2.0)) * amp;
    col = mix(col, vec3(1.0), clamp(k * 0.8, 0.0, 1.0));
    a = min(1.0, a * (1.0 + 2.2 * k));
  }
  o = vec4(col * a, a);
}`;

const NODE_VS = `#version 300 es
precision highp float;
uniform sampler2D u_pos;
uniform sampler2D u_col;
uniform vec2 u_view;
uniform float u_dpr;
uniform float u_nodeAlpha;
out vec4 v_color;
out float v_core;
out float v_glow;
void main() {
  int i = gl_VertexID;
  ivec2 c = ivec2(i % ${TEXW}, i / ${TEXW});
  vec4 p = texelFetch(u_pos, c, 0);
  vec4 col = texelFetch(u_col, c, 0);
  if (p.w < 0.004) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  vec2 clip = p.xy / u_view * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  float glow = col.a;
  float size = p.z * u_dpr;
  float total = size * (1.0 + glow * 3.0) + 2.0 * u_dpr;
  gl_PointSize = total;
  v_core = size / total;
  v_glow = glow;
  v_color = vec4(col.rgb, p.w * u_nodeAlpha);
}`;

const NODE_FS = `#version 300 es
precision highp float;
in vec4 v_color;
in float v_core;
in float v_glow;
out vec4 o;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r = length(q);
  if (r > 1.0) discard;
  float core = 1.0 - smoothstep(v_core * 0.75, v_core, r);
  float halo = exp(-r * r * 5.0) * v_glow * 0.75;
  float a = clamp(core + halo, 0.0, 1.0) * v_color.a;
  o = vec4(v_color.rgb * a, a);
}`;

const BG_VS = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }`;

const BG_FS = `#version 300 es
precision highp float;
uniform vec2 u_view;
uniform float u_dpr;
uniform vec3 u_tint;
uniform vec3 u_accent;
uniform vec2 u_glowPos;
uniform float u_glowR;
uniform float u_time;
out vec4 o;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_view.y * u_dpr - gl_FragCoord.y) / u_dpr;
  float d = length(frag - u_glowPos) / max(u_glowR, 1.0);
  vec3 col = u_tint;
  col += u_accent * 0.075 * exp(-d * d * 0.9);
  col += u_accent * 0.025 * exp(-d * 0.55);
  vec2 uv = frag / u_view - 0.5;
  col *= 1.0 - 0.38 * smoothstep(0.35, 0.95, length(uv * vec2(1.0, 1.15)));
  col += (hash(gl_FragCoord.xy + fract(u_time * 13.0) * 97.0) - 0.5) * (1.6 / 255.0);
  o = vec4(col, 1.0);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
  return s;
}
function program(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link failed');
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    const name = info.name.replace(/\[0\]$/, '');
    u[name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

export class GLRenderer {
  constructor(canvas, scene) {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL2 unavailable');
    this.gl = gl;
    this.scene = scene;
    this.edgeProg = program(gl, EDGE_VS, EDGE_FS);
    this.nodeProg = program(gl, NODE_VS, NODE_FS);
    this.bgProg = program(gl, BG_VS, BG_FS);
    const rows = scene.rows;
    const mkTex = () => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, TEXW, rows, 0, gl.RGBA, gl.FLOAT, null);
      return t;
    };
    this.posTex = mkTex();
    this.colTex = mkTex();
    // edge VAO
    this.edgeVAO = gl.createVertexArray();
    gl.bindVertexArray(this.edgeVAO);
    const corner = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corner);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 1, -1, 0, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const ends = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ends);
    gl.bufferData(gl.ARRAY_BUFFER, scene.edgeEnds, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribIPointer(1, 2, gl.UNSIGNED_INT, 0, 0);
    gl.vertexAttribDivisor(1, 1);
    const attr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, attr);
    gl.bufferData(gl.ARRAY_BUFFER, scene.edgeAttr, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(2, 1);
    const param = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, param);
    gl.bufferData(gl.ARRAY_BUFFER, scene.edgeParam, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(3, 1);
    gl.bindVertexArray(null);
    this.emptyVAO = gl.createVertexArray();
    this.lost = false;
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.lost = true; });
  }

  resize(W, H, dpr) {
    this.W = W; this.H = H; this.dpr = dpr;
    const c = this.gl.canvas;
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
  }

  render(u, t, opts = {}) {
    if (this.lost) return;
    const { gl, scene } = this;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.disable(gl.DEPTH_TEST);
    // backdrop
    gl.disable(gl.BLEND);
    gl.useProgram(this.bgProg.p);
    const bu = this.bgProg.u;
    gl.uniform2f(bu.u_view, this.W, this.H);
    gl.uniform1f(bu.u_dpr, this.dpr);
    gl.uniform3fv(bu.u_tint, u.tint);
    gl.uniform3fv(bu.u_accent, u.accent);
    gl.uniform2fv(bu.u_glowPos, u.glowPos);
    gl.uniform1f(bu.u_glowR, u.glowR);
    gl.uniform1f(bu.u_time, t);
    gl.bindVertexArray(this.emptyVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // node data
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.posTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TEXW, scene.rows, gl.RGBA, gl.FLOAT, scene.out.pos);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.colTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TEXW, scene.rows, gl.RGBA, gl.FLOAT, scene.out.col);
    gl.enable(gl.BLEND);
    // edges: premultiplied "over"
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.edgeProg.p);
    const eu = this.edgeProg.u;
    gl.uniform1i(eu.u_pos, 0);
    gl.uniform1i(eu.u_col, 1);
    gl.uniform2f(eu.u_view, this.W, this.H);
    gl.uniform1fv(eu.u_groups, u.groups.map((g) => g * (opts.edgeAlpha ?? 1)));
    gl.uniform1fv(eu.u_pulse, u.pulse);
    gl.uniform1fv(eu.u_speed, u.speed);
    gl.uniform1f(eu.u_strainVis, u.strainVis);
    gl.uniform1f(eu.u_unitScale, u.unitScale);
    gl.uniform1f(eu.u_crack, u.crack);
    gl.uniform1f(eu.u_lineScale, opts.lineScale ?? 1);
    gl.uniform1f(eu.u_time, t);
    gl.bindVertexArray(this.edgeVAO);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, scene.edgeCount);
    // nodes: additive glow
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(this.nodeProg.p);
    const nu = this.nodeProg.u;
    gl.uniform1i(nu.u_pos, 0);
    gl.uniform1i(nu.u_col, 1);
    gl.uniform2f(nu.u_view, this.W, this.H);
    gl.uniform1f(nu.u_dpr, this.dpr);
    gl.uniform1f(nu.u_nodeAlpha, opts.nodeAlpha ?? 1);
    gl.bindVertexArray(this.emptyVAO);
    gl.drawArrays(gl.POINTS, 0, scene.N);
    gl.bindVertexArray(null);
  }
}

// Fallback for browsers without WebGL2: grouped strokes, no glow.
export class CanvasRenderer {
  constructor(canvas, scene) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.scene = scene;
  }
  resize(W, H, dpr) {
    this.W = W; this.H = H; this.dpr = dpr;
    this.canvas.width = Math.round(W * dpr);
    this.canvas.height = Math.round(H * dpr);
  }
  render(u, t, opts = {}) {
    const { ctx, scene } = this;
    const { pos, col } = scene.out;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const [r, g, b] = u.tint.map((v) => Math.round(v * 255));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, this.W, this.H);
    const ends = scene.edgeEnds, attr = scene.edgeAttr, param = scene.edgeParam;
    ctx.lineWidth = 1;
    for (let grp = 0; grp < u.groups.length; grp++) {
      const ga = u.groups[grp] * (opts.edgeAlpha ?? 1);
      if (ga < 0.01) continue;
      ctx.beginPath();
      let cr = 0, cg = 0, cb = 0, n = 0;
      for (let k = 0; k < scene.edgeCount; k++) {
        if (attr[4 * k] !== grp) continue;
        if (grp === 0 && param[2 * k] < 8 && u.crack > param[2 * k]) continue;
        const a = ends[2 * k], bb = ends[2 * k + 1];
        if (pos[4 * a + 3] < 0.05 || pos[4 * bb + 3] < 0.05) continue;
        ctx.moveTo(pos[4 * a], pos[4 * a + 1]);
        ctx.lineTo(pos[4 * bb], pos[4 * bb + 1]);
        if (n < 64) { cr += col[4 * a]; cg += col[4 * a + 1]; cb += col[4 * a + 2]; n++; }
      }
      if (!n) continue;
      ctx.strokeStyle = `rgba(${Math.round((cr / n) * 255)},${Math.round((cg / n) * 255)},${Math.round((cb / n) * 255)},${Math.min(1, ga * 0.85)})`;
      ctx.stroke();
    }
    for (let i = 0; i < scene.N; i++) {
      const a = pos[4 * i + 3] * (opts.nodeAlpha ?? 1);
      if (a < 0.05) continue;
      ctx.fillStyle = `rgba(${Math.round(col[4 * i] * 255)},${Math.round(col[4 * i + 1] * 255)},${Math.round(col[4 * i + 2] * 255)},${a})`;
      const s = pos[4 * i + 2];
      ctx.fillRect(pos[4 * i] - s / 2, pos[4 * i + 1] - s / 2, s, s);
    }
  }
}
