"use client";

import { useEffect, useRef } from "react";

/**
 * Looping HUD field: grid, orbits, and a tracking pip.
 * Canvas 2D only — paused off-screen and when the user prefers reduced motion.
 */
export function HeroField() {
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
    let last = performance.now();

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.7,
      r: Math.random() * 1.2 + 0.2,
      s: 0.15 + Math.random() * 0.55,
      p: Math.random() * Math.PI * 2,
    }));

    function resize() {
      const node = canvas!;
      const rect = node.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      node.width = Math.max(1, Math.floor(width * dpr));
      node.height = Math.max(1, Math.floor(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function ring(
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      tilt: number,
      spin: number,
      alpha: number,
    ) {
      const c = ctx!;
      c.beginPath();
      for (let i = 0; i <= 140; i++) {
        const th = (i / 140) * Math.PI * 2;
        const x = rx * Math.cos(th);
        const y = ry * Math.sin(th);
        const xr = x * Math.cos(spin) - y * Math.sin(spin);
        const yr = x * Math.sin(spin) + y * Math.cos(spin);
        const y2 = yr * Math.cos(tilt);
        const z = yr * Math.sin(tilt);
        const s = 1 / (1 + z * 0.0018);
        const px = cx + xr * s;
        const py = cy + y2 * s;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.strokeStyle = `rgba(244,244,245,${alpha})`;
      c.lineWidth = 1;
      c.stroke();
    }

    function pip(
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      tilt: number,
      spin: number,
      th: number,
    ) {
      const x = rx * Math.cos(th);
      const y = ry * Math.sin(th);
      const xr = x * Math.cos(spin) - y * Math.sin(spin);
      const yr = x * Math.sin(spin) + y * Math.cos(spin);
      const y2 = yr * Math.cos(tilt);
      const z = yr * Math.sin(tilt);
      const s = 1 / (1 + z * 0.0018);
      const px = cx + xr * s;
      const py = cy + y2 * s;
      const c = ctx!;
      const g = c.createRadialGradient(px, py, 0, px, py, 18);
      g.addColorStop(0, "rgba(244,244,245,0.9)");
      g.addColorStop(0.25, "rgba(244,244,245,0.22)");
      g.addColorStop(1, "rgba(244,244,245,0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(px, py, 18, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#f4f4f5";
      c.beginPath();
      c.arc(px, py, 2.2, 0, Math.PI * 2);
      c.fill();
      return { px, py };
    }

    function draw(now: number) {
      const t = now / 1000;
      const c = ctx!;
      c.clearRect(0, 0, width, height);
      c.fillStyle = "#050505";
      c.fillRect(0, 0, width, height);

      for (const star of stars) {
        const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * star.s * 3 + star.p));
        const x = ((star.x + t * 0.006 * star.s) % 1) * width;
        const y = star.y * height;
        c.fillStyle = `rgba(244,244,245,${0.18 * tw})`;
        c.beginPath();
        c.arc(x, y, star.r, 0, Math.PI * 2);
        c.fill();
      }

      const horizon = height * 0.46;
      const vpX = width * 0.5;
      const cycle = (t * 0.08) % 1;

      c.strokeStyle = "rgba(244,244,245,0.07)";
      c.lineWidth = 1;
      for (let i = 0; i < 18; i++) {
        const z = (i / 18 + cycle) % 1;
        const y = horizon + Math.pow(z, 1.55) * (height - horizon);
        c.globalAlpha = Math.min(0.35, z * 0.45);
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(width, y);
        c.stroke();
      }

      const lanes = 14;
      for (let i = -lanes; i <= lanes; i++) {
        const edge = i / lanes;
        c.globalAlpha = 0.06;
        c.beginPath();
        c.moveTo(vpX, horizon);
        c.lineTo(vpX + edge * width * 1.35, height + 20);
        c.stroke();
      }
      c.globalAlpha = 1;

      c.strokeStyle = "rgba(244,244,245,0.12)";
      c.beginPath();
      c.moveTo(0, horizon);
      c.lineTo(width, horizon);
      c.stroke();

      const cx = width * 0.5;
      const cy = height * 0.38;
      const scale = Math.min(width, height);

      ring(cx, cy, scale * 0.22, scale * 0.22, 1.12, t * 0.12, 0.14);
      ring(cx, cy, scale * 0.34, scale * 0.2, 0.82, -t * 0.08, 0.2);
      ring(cx, cy, scale * 0.46, scale * 0.16, 0.55, t * 0.05, 0.28);

      const th = t * 0.55;
      const track = pip(cx, cy, scale * 0.46, scale * 0.16, 0.55, t * 0.05, th);
      pip(cx, cy, scale * 0.34, scale * 0.2, 0.82, -t * 0.08, -th * 0.7 + 1.2);

      c.strokeStyle = "rgba(244,244,245,0.08)";
      c.beginPath();
      c.moveTo(track.px - 14, track.py);
      c.lineTo(track.px + 14, track.py);
      c.moveTo(track.px, track.py - 14);
      c.lineTo(track.px, track.py + 14);
      c.stroke();

      const sweep = (t * 0.22) % 1;
      const sy = sweep * height;
      const sg = c.createLinearGradient(0, sy - 40, 0, sy + 40);
      sg.addColorStop(0, "rgba(244,244,245,0)");
      sg.addColorStop(0.5, "rgba(244,244,245,0.05)");
      sg.addColorStop(1, "rgba(244,244,245,0)");
      c.fillStyle = sg;
      c.fillRect(0, sy - 40, width, 80);

      const vg = c.createRadialGradient(cx, cy, scale * 0.1, cx, cy, scale * 0.85);
      vg.addColorStop(0, "rgba(5,5,5,0)");
      vg.addColorStop(1, "rgba(5,5,5,0.55)");
      c.fillStyle = vg;
      c.fillRect(0, 0, width, height);
    }

    function loop(now: number) {
      if (!(inView && pageVisible)) {
        last = now;
        frame = requestAnimationFrame(loop);
        return;
      }
      if (!reduce) {
        draw(now);
      } else if (now - last > 0) {
        draw(0);
        last = now + 1e9;
        return;
      }
      frame = requestAnimationFrame(loop);
    }

    resize();
    if (reduce) {
      draw(0);
    } else {
      frame = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.05 },
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
  }, []);

  return (
    <div className="absolute inset-0 bg-[#050505]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      <div className="hero-grain pointer-events-none absolute inset-0" />
    </div>
  );
}
