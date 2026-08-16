"use client";

import { useEffect, useRef } from "react";

const VERT = `#version 300 es
void main() {
  vec2 pos = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 uRes;
uniform float uTime;
uniform float uAspect;

float bump(vec2 p, float x, float y, float a, float s, float ph, float t) {
  float hx = (x + sin(t * 0.13 + ph) * 0.035) * uAspect;
  float hy = y + cos(t * 0.1 + ph * 1.3) * 0.03;
  vec2 d = p - vec2(hx, hy);
  return a * exp(-dot(d, d) * s);
}

float field(vec2 uv, float t) {
  float x = uv.x * uAspect;
  float y = uv.y;
  float wx = sin(y * 3.1 + t * 0.18) * 0.07 + sin(x * 1.6 - t * 0.11) * 0.05;
  float wy = cos(x * 2.4 - t * 0.14) * 0.06 + sin(y * 1.9 + t * 0.09) * 0.04;
  vec2 p = vec2(x + wx, y + wy);

  float n =
    sin(p.x * 3.6 + t * 0.12) * 0.42 +
    sin(p.y * 2.9 - t * 0.09) * 0.36 +
    sin((p.x * 0.85 + p.y * 1.25) * 2.4 + t * 0.07) * 0.28;

  n += bump(p, 0.16, 0.28, 1.15, 22.0, 0.4, t);
  n += bump(p, 0.58, 0.20, 1.05, 18.0, 1.3, t);
  n += bump(p, 0.82, 0.42, 1.20, 20.0, 2.1, t);
  n += bump(p, 0.34, 0.52, 0.90, 16.0, 0.8, t);
  n += bump(p, 0.70, 0.68, 0.95, 19.0, 2.7, t);
  n += bump(p, 0.12, 0.74, 0.85, 17.0, 1.9, t);
  n += bump(p, 0.48, 0.84, 0.75, 21.0, 3.2, t);
  n += bump(p, 0.90, 0.78, 0.80, 15.0, 0.2, t);
  return n;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1.0 - uv.y;
  float n = field(uv, uTime);
  float scaled = (n + 0.35) / 0.46;
  float dist = abs(scaled - floor(scaled + 0.5));
  float fw = max(fwidth(scaled), 1e-5);
  float line = 1.0 - smoothstep(1.05, 2.35, dist / fw);
  vec3 bg = vec3(0.0196);
  vec3 fg = vec3(0.604, 0.604, 0.635);
  fragColor = vec4(mix(bg, fg, line * 0.88), 1.0);
}
`;

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * GPU topographic field — same gray isolines, without Safari's
 * Canvas2D path/GC stutter.
 */
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvasRef.current;
    if (!surface) return;
    const node: HTMLCanvasElement = surface;
    const context = node.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!context) return;
    const gl: WebGL2RenderingContext = context;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uAspect = gl.getUniformLocation(program, "uAspect");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";

    function resize() {
      const rect = node.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.max(1, Math.floor(width * dpr));
      const bh = Math.max(1, Math.floor(height * dpr));
      if (node.width !== bw || node.height !== bh) {
        node.width = bw;
        node.height = bh;
      }
      gl.viewport(0, 0, bw, bh);
      gl.uniform2f(uRes, bw, bh);
      gl.uniform1f(uAspect, width / Math.max(1, height));
    }

    function draw(now: number) {
      gl.uniform1f(uTime, reduce ? 0 : now / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function loop(now: number) {
      if (!running) return;
      draw(now);
      if (inView && pageVisible && !reduce) {
        frame = requestAnimationFrame(loop);
      } else {
        running = false;
        frame = 0;
      }
    }

    function start() {
      if (reduce || running || !inView || !pageVisible) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }

    resize();
    draw(reduce ? 0 : performance.now());
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(reduce ? 0 : performance.now());
    });
    ro.observe(node);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
      },
      { threshold: 0.05 },
    );
    io.observe(node);
    const onVis = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 bg-[#050505]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  );
}
