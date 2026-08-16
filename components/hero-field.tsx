"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; born: number };

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
 * Flowing topographic contours — white isolines on black.
 * Warps toward the pointer and rings out on tap.
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
    let hovering = false;
    let pointerId: number | null = null;

    let px = 0.55;
    let py = 0.4;
    let tx = 0.55;
    let ty = 0.4;
    let pull = 0;
    let targetPull = 0;

    const ripples: Ripple[] = [];

    function resize() {
      const rect = node.getBoundingClientRect();
      const area = Math.max(1, rect.width * rect.height);
      const sim = Math.min(0.4, Math.sqrt(150000 / area));
      cols = Math.max(140, Math.floor(rect.width * sim));
      rows = Math.max(90, Math.floor(rect.height * sim));
      aspect = cols / rows;
      node.width = cols;
      node.height = rows;
      image = ctx!.createImageData(cols, rows);
    }

    function field(nx: number, ny: number, t: number, clock: number) {
      const x = nx * aspect;
      const y = ny;

      const wx = Math.sin(y * 3.1 + t * 0.18) * 0.07 + Math.sin(x * 1.6 - t * 0.11) * 0.05;
      const wy = Math.cos(x * 2.4 - t * 0.14) * 0.06 + Math.sin(y * 1.9 + t * 0.09) * 0.04;
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

      if (pull > 0.01) {
        const dx = x - px * aspect;
        const dy = y - py;
        n += pull * 1.35 * Math.exp(-(dx * dx + dy * dy) * 14);
      }

      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i]!;
        const age = clock - r.born;
        if (age < 0 || age > 2.8) continue;
        const dx = x - r.x * aspect;
        const dy = y - r.y;
        const rd = Math.hypot(dx, dy);
        const ring = rd - age * 0.38;
        n += Math.exp(-ring * ring * 55) * (1 - age / 2.8) * 1.4;
      }

      return n;
    }

    function draw(now: number) {
      const clock = now / 1000;
      const t = reduce ? 0 : clock;

      if (!hovering) {
        tx = reduce ? 0.55 : 0.55 + Math.sin(clock * 0.17) * 0.12;
        ty = reduce ? 0.4 : 0.4 + Math.cos(clock * 0.13) * 0.08;
        targetPull = 0;
      }

      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      pull += (targetPull - pull) * 0.1;

      for (let i = ripples.length - 1; i >= 0; i--) {
        if (clock - ripples[i]!.born > 2.8) ripples.splice(i, 1);
      }

      if (!image) return;
      const data = image.data;

      for (let y = 0; y < rows; y++) {
        const ny = (y + 0.5) / rows;
        for (let x = 0; x < cols; x++) {
          const nx = (x + 0.5) / cols;
          const n = field(nx, ny, t, clock);
          const levels = n * 3.4;
          const dist = Math.abs(levels - Math.round(levels));
          const line = Math.max(0, 1 - dist / 0.2);
          const a = Math.pow(line, 1.15);
          const i = (y * cols + x) * 4;
          const c = 8 + a * 236;
          data[i] = c;
          data[i + 1] = c;
          data[i + 2] = c;
          data[i + 3] = 255;
        }
      }

      ctx!.putImageData(image, 0, 0);
    }

    function loop(now: number) {
      if (inView && pageVisible) draw(now);
      frame = requestAnimationFrame(loop);
    }

    function local(e: PointerEvent) {
      const rect = node.getBoundingClientRect();
      tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      ty = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    }

    function onEnter(e: PointerEvent) {
      hovering = true;
      targetPull = 1;
      local(e);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch" && pointerId !== e.pointerId) return;
      hovering = true;
      targetPull = 1;
      local(e);
    }

    function onDown(e: PointerEvent) {
      local(e);
      hovering = true;
      targetPull = 1.15;
      pointerId = e.pointerId;
      node.setPointerCapture(e.pointerId);
      ripples.push({ x: tx, y: ty, born: performance.now() / 1000 });
    }

    function onUp(e: PointerEvent) {
      if (pointerId === e.pointerId) pointerId = null;
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        hovering = false;
        targetPull = 0;
      }
    }

    function onLeave() {
      if (pointerId !== null) return;
      hovering = false;
      targetPull = 0;
    }

    resize();
    draw(performance.now());
    frame = requestAnimationFrame(loop);

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
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-[#050505]">
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        aria-hidden
      />
    </div>
  );
}
