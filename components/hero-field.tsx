"use client";

import { useEffect, useRef } from "react";

const HILLS = [
  { x: 0.16, y: 0.28, a: 1.15, s: 22, p: 0.4 },
  { x: 0.58, y: 0.2, a: 1.05, s: 18, p: 1.3 },
  { x: 0.82, y: 0.42, a: 1.2, s: 20, p: 2.1 },
  { x: 0.34, y: 0.52, a: 0.9, s: 16, p: 0.8 },
  { x: 0.7, y: 0.68, a: 0.95, s: 19, p: 2.7 },
  { x: 0.12, y: 0.74, a: 0.85, s: 17, p: 1.9 },
  { x: 0.48, y: 0.84, a: 0.75, s: 21, p: 3.2 },
  { x: 0.9, y: 0.78, a: 0.8, s: 15, p: 0.2 },
];

const ISO_START = -0.35;
const ISO_END = 2.15;
const ISO_STEP = 0.46;

type Pt = [number, number];
type Seg = [Pt, Pt];

function interp(iso: number, a: number, b: number, va: number, vb: number) {
  const t = (iso - va) / (vb - va || 1);
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function pointKey(p: Pt) {
  return `${Math.round(p[0] * 2)},${Math.round(p[1] * 2)}`;
}

function stitch(segs: Seg[]) {
  const used = new Uint8Array(segs.length);
  const byKey = new Map<string, number[]>();

  const add = (p: Pt, i: number) => {
    const key = pointKey(p);
    const list = byKey.get(key);
    if (list) list.push(i);
    else byKey.set(key, [i]);
  };

  for (let i = 0; i < segs.length; i++) {
    add(segs[i]![0], i);
    add(segs[i]![1], i);
  }

  const other = (seg: Seg, p: Pt): Pt =>
    pointKey(seg[0]) === pointKey(p) ? seg[1] : seg[0];

  const extend = (from: Pt, into: Pt[]) => {
    let cur = from;
    while (true) {
      const cand = byKey.get(pointKey(cur));
      if (!cand) break;
      let next = -1;
      for (let i = 0; i < cand.length; i++) {
        const idx = cand[i]!;
        if (!used[idx]) {
          next = idx;
          break;
        }
      }
      if (next < 0) break;
      used[next] = 1;
      const nxt = other(segs[next]!, cur);
      into.push(nxt);
      cur = nxt;
    }
  };

  const chains: Pt[][] = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const start = segs[i]!;
    const forward: Pt[] = [start[0], start[1]];
    extend(start[1], forward);
    const back: Pt[] = [];
    extend(start[0], back);
    chains.push(back.length ? [...back.reverse(), ...forward] : forward);
  }
  return chains;
}

function strokeChain(c: CanvasRenderingContext2D, pts: Pt[]) {
  if (pts.length < 2) return;
  const first = pts[0]!;
  c.moveTo(first[0], first[1]);
  if (pts.length === 2) {
    c.lineTo(pts[1]![0], pts[1]![1]);
    return;
  }
  for (let i = 1; i < pts.length - 1; i++) {
    const cur = pts[i]!;
    const next = pts[i + 1]!;
    c.quadraticCurveTo(
      cur[0],
      cur[1],
      (cur[0] + next[0]) * 0.5,
      (cur[1] + next[1]) * 0.5,
    );
  }
  const last = pts[pts.length - 1]!;
  c.lineTo(last[0], last[1]);
}

/**
 * Flowing topographic contours as stroked paths.
 * A coarse scalar field is marched into polylines, then drawn at display
 * resolution so the lines stay sharp without a full-screen pixel shader.
 */
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvasRef.current;
    if (!surface) return;
    const node: HTMLCanvasElement = surface;
    const ctx = node.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let aspect = 1;
    let gx = 0;
    let gy = 0;
    let field = new Float32Array(0);
    let frame = 0;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";

    const hills = HILLS.map((h) => ({ x: 0, y: 0, a: h.a, s: h.s }));

    function resize() {
      const rect = node.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      aspect = width / Math.max(1, height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      node.width = Math.max(1, Math.floor(width * dpr));
      node.height = Math.max(1, Math.floor(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      gx = Math.max(96, Math.round(width / 6));
      gy = Math.max(60, Math.round(height / 6));
      field = new Float32Array((gx + 1) * (gy + 1));
    }

    function sample(nx: number, ny: number, t: number) {
      const x = nx * aspect;
      const y = ny;
      const wx =
        Math.sin(y * 3.1 + t * 0.18) * 0.07 + Math.sin(x * 1.6 - t * 0.11) * 0.05;
      const wy =
        Math.cos(x * 2.4 - t * 0.14) * 0.06 + Math.sin(y * 1.9 + t * 0.09) * 0.04;
      const u = x + wx;
      const v = y + wy;

      let n =
        Math.sin(u * 3.6 + t * 0.12) * 0.42 +
        Math.sin(v * 2.9 - t * 0.09) * 0.36 +
        Math.sin((u * 0.85 + v * 1.25) * 2.4 + t * 0.07) * 0.28;

      for (let i = 0; i < hills.length; i++) {
        const h = hills[i]!;
        const dx = u - h.x;
        const dy = v - h.y;
        n += h.a * Math.exp(-(dx * dx + dy * dy) * h.s);
      }
      return n;
    }

    function fillField(t: number) {
      for (let i = 0; i < HILLS.length; i++) {
        const src = HILLS[i]!;
        const dst = hills[i]!;
        dst.x = (src.x + Math.sin(t * 0.13 + src.p) * 0.035) * aspect;
        dst.y = src.y + Math.cos(t * 0.1 + src.p * 1.3) * 0.03;
      }
      const nx = gx;
      const ny = gy;
      for (let j = 0; j <= ny; j++) {
        const y = j / ny;
        for (let i = 0; i <= nx; i++) {
          field[j * (nx + 1) + i] = sample(i / nx, y, t);
        }
      }
    }

    function edge(
      which: number,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      v0: number,
      v1: number,
      v2: number,
      v3: number,
      iso: number,
    ): [number, number] {
      if (which === 0) return [interp(iso, x0, x1, v0, v1), y0];
      if (which === 1) return [x1, interp(iso, y0, y1, v1, v2)];
      if (which === 2) return [interp(iso, x0, x1, v3, v2), y1];
      return [x0, interp(iso, y0, y1, v0, v3)];
    }

    function march(c: CanvasRenderingContext2D) {
      const nx = gx;
      const ny = gy;
      const cw = width / nx;
      const ch = height / ny;
      const stride = nx + 1;
      const segs: Seg[] = [];

      c.beginPath();
      for (let iso = ISO_START; iso <= ISO_END; iso += ISO_STEP) {
        segs.length = 0;
        for (let j = 0; j < ny; j++) {
          const y0 = j * ch;
          const y1 = y0 + ch;
          const row = j * stride;
          const next = row + stride;
          for (let i = 0; i < nx; i++) {
            const v0 = field[row + i]!;
            const v1 = field[row + i + 1]!;
            const v2 = field[next + i + 1]!;
            const v3 = field[next + i]!;
            const idx =
              (v0 >= iso ? 1 : 0) |
              (v1 >= iso ? 2 : 0) |
              (v2 >= iso ? 4 : 0) |
              (v3 >= iso ? 8 : 0);
            if (idx === 0 || idx === 15) continue;

            const x0 = i * cw;
            const x1 = x0 + cw;
            const pt = (which: number) =>
              edge(which, x0, y0, x1, y1, v0, v1, v2, v3, iso);

            const seg = (a: number, b: number) => {
              segs.push([pt(a), pt(b)]);
            };

            switch (idx) {
              case 1:
              case 14:
                seg(3, 0);
                break;
              case 2:
              case 13:
                seg(0, 1);
                break;
              case 3:
              case 12:
                seg(3, 1);
                break;
              case 4:
              case 11:
                seg(1, 2);
                break;
              case 6:
              case 9:
                seg(0, 2);
                break;
              case 7:
              case 8:
                seg(3, 2);
                break;
              case 5:
                seg(3, 0);
                seg(1, 2);
                break;
              case 10:
                seg(3, 2);
                seg(0, 1);
                break;
            }
          }
        }

        const chains = stitch(segs);
        for (let i = 0; i < chains.length; i++) {
          strokeChain(c, chains[i]!);
        }
      }
      c.stroke();
    }

    function draw(now: number) {
      const t = reduce ? 0 : now / 1000;
      const c = ctx!;
      c.fillStyle = "#050505";
      c.fillRect(0, 0, width, height);
      fillField(t);
      c.strokeStyle = "rgba(154,154,162,0.88)";
      c.lineWidth = 2.25;
      c.lineJoin = "round";
      c.lineCap = "round";
      march(c);
    }

    function loop(now: number) {
      if (inView && pageVisible && !reduce) draw(now);
      frame = requestAnimationFrame(loop);
    }

    resize();
    draw(reduce ? 0 : performance.now());
    if (!reduce) frame = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(node);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(node);
    const onVis = () => {
      pageVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 bg-[#050505]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  );
}
