"use client";

import { useEffect, useRef } from "react";

type Curve = {
  position: number;
  index: number;
  width: number;
  // 0 = white, 1 = gray
  tone: number;
  opacity: number;
  dash: number;
  gap: number;
  speed: number;
  phase: number;
};

function buildCurves(): Curve[] {
  const curves: Curve[] = [];
  for (const position of [1, -1] as const) {
    for (let i = 0; i < 16; i++) {
      const t = i / 15;
      curves.push({
        position,
        index: i,
        width: 1.2 + t * 1.4,
        tone: t,
        opacity: 0.55 + (1 - t) * 0.4,
        dash: 140 + i * 8,
        gap: 24 + (i % 4) * 8,
        speed: 28 + i * 2.2,
        phase: i * 17 + (position > 0 ? 0 : 40),
      });
    }
  }
  return curves;
}

function curvePath(
  ctx: CanvasRenderingContext2D,
  position: number,
  i: number,
  w: number,
  h: number,
) {
  // Same bezier family as the original FloatingPaths, mapped into the canvas.
  const sx = w / 696;
  const sy = h / 316;
  const x0 = (-380 + i * 5 * position) * sx;
  const y0 = (-189 - i * 6) * sy;
  const c1x = (-312 + i * 5 * position) * sx;
  const c1y = (216 - i * 6) * sy;
  const midX = (152 - i * 5 * position) * sx;
  const midY = (343 - i * 6) * sy;
  const c2x = (616 - i * 5 * position) * sx;
  const c2y = (470 - i * 6) * sy;
  const x1 = (684 - i * 5 * position) * sx;
  const y1 = (875 - i * 6) * sy;

  ctx.beginPath();
  ctx.moveTo(x0 + w * 0.15, y0 + h * 0.35);
  ctx.bezierCurveTo(
    c1x + w * 0.15,
    c1y + h * 0.2,
    midX + w * 0.2,
    midY + h * 0.05,
    midX + w * 0.35,
    midY + h * 0.15,
  );
  ctx.bezierCurveTo(
    c2x + w * 0.1,
    c2y * 0.55,
    x1 + w * 0.05,
    y1 * 0.35,
    x1 + w * 0.2,
    h * 0.75,
  );
}

function mixWhiteGray(tone: number) {
  // tone 0 → white, 1 → soft gray
  const r = Math.round(255 - tone * 90);
  const g = Math.round(255 - tone * 90);
  const b = Math.round(255 - tone * 80);
  return `rgb(${r},${g},${b})`;
}

/** Bright white↔gray flowing paths — one canvas, one rAF (no Framer/SMIL/CSS). */
export function HeroPaths() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const curves = buildCurves();
    let raf = 0;
    let w = 0;
    let h = 0;
    const start = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const panX = Math.sin(t * 0.18) * w * 0.04;
      const panY = Math.cos(t * 0.14) * h * 0.025;

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(panX, panY);

      for (const c of curves) {
        const pulse = 0.82 + Math.sin(t * 0.7 + c.phase * 0.05) * 0.18;
        ctx.strokeStyle = mixWhiteGray(c.tone);
        ctx.globalAlpha = Math.min(1, c.opacity * pulse);
        ctx.lineWidth = c.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([c.dash, c.gap]);
        ctx.lineDashOffset = -((t * c.speed + c.phase) % (c.dash + c.gap));

        curvePath(ctx, c.position, c.index, w, h);
        ctx.stroke();
      }

      ctx.restore();
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
