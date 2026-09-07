"use client";

import { useEffect, useRef } from "react";

type PathSpec = {
  // Cubic: P0, CP1, join, then smooth S end (reflected CP → end)
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  xj: number;
  yj: number;
  x3: number;
  y3: number;
  width: number;
  opacity: number;
  /** Seconds for one full lap along the path. */
  duration: number;
  /** Seconds before this stroke begins drawing. */
  delay: number;
  /** Normalized 0–1 phase when the stroke first appears (near view edge). */
  enterOffset: number;
  length: number;
};

const VIEW_W = 696;
const VIEW_H = 316;
const INTRO_S = 2.4;
const DASH_MAX = 0.36;

function cubicPoint(
  t: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
) {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  return {
    x: uu * u * x0 + 3 * uu * t * x1 + 3 * u * tt * x2 + tt * t * x3,
    y: uu * u * y0 + 3 * uu * t * y1 + 3 * u * tt * y2 + tt * t * y3,
  };
}

function approxCubicLength(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  steps = 24,
) {
  let len = 0;
  let prev = cubicPoint(0, x0, y0, x1, y1, x2, y2, x3, y3);
  for (let i = 1; i <= steps; i++) {
    const p = cubicPoint(i / steps, x0, y0, x1, y1, x2, y2, x3, y3);
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return len;
}

function buildLayer(position: 1 | -1, count: number): PathSpec[] {
  return Array.from({ length: count }, (_, i) => {
    const o = i * 3.6 * position;
    const yo = i * 4.2;
    const x0 = -(380 - o);
    const y0 = -(189 + yo);
    const x1 = -(312 - o);
    const y1 = 216 - yo;
    const xj = 152 - o;
    const yj = 343 - yo;
    const x3 = 684 - o;
    const y3 = 875 - yo;
    // Smooth cubic `S`: reflect (x1,y1) about join for second-segment CP1.
    const x2 = xj * 2 - x1;
    const y2 = yj * 2 - y1;

    const len1 = approxCubicLength(x0, y0, x0, y0, x1, y1, xj, yj);
    const len2 = approxCubicLength(xj, yj, x2, y2, x3, y3, x3, y3);

    const staggerSlot = (i * 13 + (position > 0 ? 5 : 11)) % count;
    // Slow, heavy laps — motion stays readable because dashes stay short.
    const duration = 28 + ((i * 5 + (position > 0 ? 2 : 7)) % 11) * 1.4;

    return {
      x0,
      y0,
      x1,
      y1,
      xj,
      yj,
      x3,
      y3,
      width: 0.45 + i * 0.028,
      opacity: 0.12 + i * 0.014,
      duration,
      delay: staggerSlot * 0.045 + (position > 0 ? 0 : 0.14),
      enterOffset: 0.04 + (staggerSlot % 9) * 0.005,
      length: Math.max(len1 + len2, 1),
    };
  });
}

function strokePath(ctx: CanvasRenderingContext2D, p: PathSpec) {
  const x2 = p.xj * 2 - p.x1;
  const y2 = p.yj * 2 - p.y1;
  ctx.beginPath();
  ctx.moveTo(p.x0, p.y0);
  ctx.bezierCurveTo(p.x0, p.y0, p.x1, p.y1, p.xj, p.yj);
  ctx.bezierCurveTo(x2, y2, p.x3, p.y3, p.x3, p.y3);
  ctx.stroke();
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** White animated stroke field for the About hero (paths backdrop). */
export function HeroPaths() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paths = [...buildLayer(1, 48), ...buildLayer(-1, 48)];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let frame = 0;
    let start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      // Cap DPR — hero backdrop doesn’t need retina overdraw cost.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const viewTransform = () => {
      // Match prior SVG: 160% cover, centered on viewBox 696×316.
      const scale = Math.max(width / VIEW_W, height / VIEW_H) * 1.6;
      const drawW = VIEW_W * scale;
      const drawH = VIEW_H * scale;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate((width - drawW) / 2, (height - drawH) / 2);
      ctx.scale(scale, scale);
    };

    const paint = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);
      viewTransform();

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#ffffff";

      const elapsed = (now - start) / 1000;

      for (const p of paths) {
        const local = elapsed - p.delay;
        if (!reduce && local < 0) continue;

        let dashFrac = DASH_MAX;
        let alphaMul = 0.45;
        let offsetNorm = p.enterOffset;

        if (reduce) {
          dashFrac = DASH_MAX;
          alphaMul = 0.35;
          offsetNorm = 0.22;
        } else {
          const intro = Math.min(1, Math.max(0, local / INTRO_S));
          // Linear grow keeps the tip short longer; travel reads as flow, not a pop.
          dashFrac = 0.025 + (DASH_MAX - 0.025) * intro;
          alphaMul = 0.45 * easeOutCubic(Math.min(1, intro / 0.35));
          offsetNorm = (p.enterOffset + local / p.duration) % 1;
        }

        const dash = dashFrac * p.length;
        const gap = Math.max(p.length - dash, 1);
        ctx.globalAlpha = p.opacity * alphaMul;
        ctx.lineWidth = p.width;
        ctx.setLineDash([dash, gap]);
        ctx.lineDashOffset = -offsetNorm * p.length;
        strokePath(ctx, p);
      }

      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    };

    const tick = (now: number) => {
      if (visible && !reduce) {
        paint(now);
        frame = requestAnimationFrame(tick);
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      paint(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(frame);
          if (visible) paint(performance.now());
        }
      },
      { rootMargin: "120px", threshold: 0 },
    );
    io.observe(canvas);

    resize();
    if (reduce) {
      paint(performance.now());
    } else {
      frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />
    </div>
  );
}
