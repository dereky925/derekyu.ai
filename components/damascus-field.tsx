"use client";

import { useEffect, useRef } from "react";

type Theme = "anduril" | "northrop";

type DamascusFieldProps = {
  theme: Theme;
  className?: string;
};

type Ripple = { x: number; y: number; born: number };

const PALETTES: Record<Theme, number[][]> = {
  anduril: [
    [8, 9, 12],
    [26, 30, 38],
    [70, 78, 90],
    [164, 174, 188],
    [230, 234, 240],
  ],
  northrop: [
    [10, 8, 7],
    [34, 28, 24],
    [86, 72, 56],
    [184, 166, 138],
    [238, 230, 216],
  ],
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function samplePalette(stops: number[][], t: number) {
  const x = Math.min(0.999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = stops[i]!;
  const b = stops[i + 1] ?? a;
  return [
    lerp(a[0]!, b[0]!, f),
    lerp(a[1]!, b[1]!, f),
    lerp(a[2]!, b[2]!, f),
  ] as const;
}

export function DamascusField({ theme, className = "" }: DamascusFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvasRef.current;
    if (!surface) return;
    const node: HTMLCanvasElement = surface;
    const ctx = node.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = PALETTES[theme];
    const diagonal = theme === "northrop";

    let cols = 0;
    let rows = 0;
    let image: ImageData | null = null;
    let frame = 0;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";
    let hovering = false;
    let pointerId: number | null = null;

    let px = 0.5;
    let py = 0.55;
    let tx = 0.5;
    let ty = 0.55;
    let pull = 0.22;
    let targetPull = 0.22;

    const ripples: Ripple[] = [];

    function resize() {
      const rect = node.getBoundingClientRect();
      const sim = 0.52;
      cols = Math.max(96, Math.floor(rect.width * sim));
      rows = Math.max(60, Math.floor(rect.height * sim));
      node.width = cols;
      node.height = rows;
      image = ctx!.createImageData(cols, rows);
    }

    function field(x: number, y: number, t: number, clock: number) {
      const dx = x - px;
      const dy = y - py;
      const d2 = dx * dx + dy * dy;
      const magnet = pull * Math.exp(-d2 * 7.5);
      const ang = Math.atan2(dy, dx);
      let u = x + Math.cos(ang) * magnet * 0.2;
      let v = y + Math.sin(ang) * magnet * 0.2;

      if (diagonal) {
        const r = u;
        u = (u + v) * 0.72;
        v = (v - r) * 0.72 + 0.5;
      }

      const wx = Math.sin(v * 3.15 + t * 0.32) * 0.11;
      const wy = Math.cos(u * 2.35 - t * 0.21) * 0.09;
      u += wx;
      v += wy;

      let n = Math.sin(u * 13.4 + v * 2.15 + t * 0.42);
      n += 0.52 * Math.sin(u * 6.2 - v * 9.4 + t * 0.18);
      n += 0.27 * Math.sin((u * 0.65 + v) * 17.5 - t * 0.5);

      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i]!;
        const age = clock - r.born;
        if (age < 0 || age > 2.4) continue;
        const rd = Math.hypot(x - r.x, y - r.y);
        const ring = rd - age * 0.52;
        const pulse = Math.exp(-ring * ring * 70) * (1 - age / 2.4);
        n += pulse * 1.55;
      }

      return n;
    }

    function draw(now: number) {
      const clock = now / 1000;
      const t = reduce ? 0 : clock;
      const idleX = 0.5 + Math.sin(clock * 0.28) * 0.18;
      const idleY = 0.52 + Math.cos(clock * 0.21) * 0.12;
      if (!hovering) {
        tx = reduce ? 0.5 : idleX;
        ty = reduce ? 0.55 : idleY;
        targetPull = 0.2;
      }

      px += (tx - px) * 0.07;
      py += (ty - py) * 0.07;
      pull += (targetPull - pull) * 0.08;

      for (let i = ripples.length - 1; i >= 0; i--) {
        if (clock - ripples[i]!.born > 2.4) ripples.splice(i, 1);
      }

      if (!image) return;
      const data = image.data;
      const lightX = px * 2 - 1;
      const lightY = py * 2 - 1;

      for (let y = 0; y < rows; y++) {
        const ny = (y + 0.5) / rows;
        for (let x = 0; x < cols; x++) {
          const nx = (x + 0.5) / cols;
          const n = field(nx, ny, t, clock);
          const edge = Math.pow(Math.abs(Math.sin(n * Math.PI)), 0.38);
          const spec = Math.pow(
            Math.max(0, Math.sin(n * Math.PI + 0.55 + lightX * 0.35 + lightY * 0.2)),
            10,
          );
          const vignette = 1 - Math.min(0.45, ((nx - 0.5) ** 2 + (ny - 0.55) ** 2) * 1.6);
          const tone = (0.12 + edge * 0.72 + spec * 0.42) * vignette;
          const [r, g, b] = samplePalette(palette, tone);
          const i = (y * cols + x) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
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
      targetPull = 1.25;
      pointerId = e.pointerId;
      node.setPointerCapture(e.pointerId);
      ripples.push({ x: tx, y: ty, born: performance.now() / 1000 });
      if (reduce) draw(performance.now());
    }

    function onUp(e: PointerEvent) {
      if (pointerId === e.pointerId) pointerId = null;
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        hovering = false;
        targetPull = 0.2;
      }
    }

    function onLeave() {
      if (pointerId !== null) return;
      hovering = false;
      targetPull = 0.2;
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
      { threshold: 0.08 },
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
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full touch-none bg-[#050505] ${className}`}
      aria-hidden
    />
  );
}
