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

/**
 * Flowing topographic contours — thick white isolines on black.
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

    let cols = 0;
    let rows = 0;
    let aspect = 1;
    let image: ImageData | null = null;
    let frame = 0;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";

    function resize() {
      const rect = node.getBoundingClientRect();
      const area = Math.max(1, rect.width * rect.height);
      const sim = Math.min(0.38, Math.sqrt(140000 / area));
      cols = Math.max(140, Math.floor(rect.width * sim));
      rows = Math.max(90, Math.floor(rect.height * sim));
      aspect = cols / rows;
      node.width = cols;
      node.height = rows;
      image = ctx!.createImageData(cols, rows);
    }

    function field(nx: number, ny: number, t: number) {
      const x = nx * aspect;
      const y = ny;

      const wx =
        Math.sin(y * 3.1 + t * 0.18) * 0.07 + Math.sin(x * 1.6 - t * 0.11) * 0.05;
      const wy =
        Math.cos(x * 2.4 - t * 0.14) * 0.06 + Math.sin(y * 1.9 + t * 0.09) * 0.04;
      const u = x + wx;
      const v = y + wy;

      let n = 0;
      n += Math.sin(u * 3.6 + t * 0.12) * 0.42;
      n += Math.sin(v * 2.9 - t * 0.09) * 0.36;
      n += Math.sin((u * 0.85 + v * 1.25) * 2.4 + t * 0.07) * 0.28;

      for (let i = 0; i < HILLS.length; i++) {
        const h = HILLS[i]!;
        const hx = (h.x + Math.sin(t * 0.13 + h.p) * 0.035) * aspect;
        const hy = h.y + Math.cos(t * 0.1 + h.p * 1.3) * 0.03;
        const dx = u - hx;
        const dy = v - hy;
        n += h.a * Math.exp(-(dx * dx + dy * dy) * h.s);
      }

      return n;
    }

    function draw(now: number) {
      const t = reduce ? 0 : now / 1000;
      if (!image) return;
      const data = image.data;

      for (let y = 0; y < rows; y++) {
        const ny = (y + 0.5) / rows;
        for (let x = 0; x < cols; x++) {
          const nx = (x + 0.5) / cols;
          const n = field(nx, ny, t);
          const levels = n * 1.85;
          const dist = Math.abs(levels - Math.round(levels));
          const line = dist < 0.36 ? 1 : dist < 0.4 ? 1 - (dist - 0.36) / 0.04 : 0;
          const i = (y * cols + x) * 4;
          const c = 8 + line * 236;
          data[i] = c;
          data[i + 1] = c;
          data[i + 2] = c;
          data[i + 3] = 255;
        }
      }

      ctx!.putImageData(image, 0, 0);
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
