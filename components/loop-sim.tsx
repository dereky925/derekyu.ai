"use client";

import { useEffect, useRef } from "react";

type LoopSimProps = {
  theme: "anduril" | "northrop";
  className?: string;
};

export function LoopSim({ theme, className = "" }: LoopSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.floor(width * dpr));
      canvas!.height = Math.max(1, Math.floor(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function anduril(t: number) {
      const c = ctx!;
      c.fillStyle = "#050505";
      c.fillRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.52;
      const nodes = 18;
      for (let i = 0; i < nodes; i++) {
        const a = (i / nodes) * Math.PI * 2 + t * 0.08;
        const r = Math.min(width, height) * (0.18 + 0.16 * Math.sin(t * 0.35 + i));
        const x = cx + Math.cos(a) * r * 1.5;
        const y = cy + Math.sin(a) * r * 0.55;
        for (let j = i + 1; j < nodes; j += 3) {
          const a2 = (j / nodes) * Math.PI * 2 + t * 0.08;
          const r2 = Math.min(width, height) * (0.18 + 0.16 * Math.sin(t * 0.35 + j));
          const x2 = cx + Math.cos(a2) * r2 * 1.5;
          const y2 = cy + Math.sin(a2) * r2 * 0.55;
          c.strokeStyle = "rgba(244,244,245,0.06)";
          c.beginPath();
          c.moveTo(x, y);
          c.lineTo(x2, y2);
          c.stroke();
        }
        c.fillStyle = "rgba(244,244,245,0.45)";
        c.beginPath();
        c.arc(x, y, 1.6, 0, Math.PI * 2);
        c.fill();
      }

      const th = t * 0.7;
      const x = cx + Math.cos(th) * width * 0.28;
      const y = cy + Math.sin(th * 1.4) * height * 0.12;
      const g = c.createRadialGradient(x, y, 0, x, y, 28);
      g.addColorStop(0, "rgba(244,244,245,0.85)");
      g.addColorStop(1, "rgba(244,244,245,0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, 28, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#f4f4f5";
      c.beginPath();
      c.arc(x, y, 2.4, 0, Math.PI * 2);
      c.fill();

      c.strokeStyle = "rgba(244,244,245,0.08)";
      for (let i = 0; i < 6; i++) {
        const yy = ((t * 12 + i * height) / 6) % height;
        c.beginPath();
        c.moveTo(0, yy);
        c.lineTo(width, yy);
        c.stroke();
      }
    }

    function northrop(t: number) {
      const c = ctx!;
      c.fillStyle = "#050505";
      c.fillRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.55;
      const sweep = (t * 0.55) % (Math.PI * 2);
      const grd = c.createConicGradient(sweep, cx, cy);
      grd.addColorStop(0, "rgba(244,244,245,0.16)");
      grd.addColorStop(0.12, "rgba(244,244,245,0)");
      grd.addColorStop(1, "rgba(244,244,245,0)");
      c.fillStyle = grd;
      c.beginPath();
      c.moveTo(cx, cy);
      c.arc(cx, cy, Math.min(width, height) * 0.7, 0, Math.PI * 2);
      c.fill();

      c.strokeStyle = "rgba(244,244,245,0.1)";
      for (let i = 1; i <= 4; i++) {
        c.beginPath();
        c.ellipse(cx, cy, i * width * 0.1, i * height * 0.08, 0, 0, Math.PI * 2);
        c.stroke();
      }
      c.beginPath();
      c.moveTo(cx, 0);
      c.lineTo(cx, height);
      c.moveTo(0, cy);
      c.lineTo(width, cy);
      c.stroke();

      for (let i = 0; i < 8; i++) {
        const a = t * 0.25 + (i / 8) * Math.PI * 2;
        const rx = width * 0.18 * (1.1 + 0.2 * Math.sin(i));
        const ry = height * 0.22;
        const x = cx + Math.cos(a) * rx * 1.6;
        const y = cy + Math.sin(a) * ry;
        c.fillStyle = "rgba(244,244,245,0.7)";
        c.beginPath();
        c.arc(x, y, 2, 0, Math.PI * 2);
        c.fill();
      }
    }

    function draw(now: number) {
      const t = now / 1000;
      if (theme === "anduril") anduril(t);
      else northrop(t);
    }

    function loop(now: number) {
      if (inView && pageVisible && !reduce) draw(now);
      frame = requestAnimationFrame(loop);
    }

    resize();
    draw(reduce ? 0 : performance.now());
    if (!reduce) frame = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    io.observe(canvas);
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
  }, [theme]);

  return (
    <canvas ref={canvasRef} className={`h-full w-full bg-[#050505] ${className}`} aria-hidden />
  );
}
