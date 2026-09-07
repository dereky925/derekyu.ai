"use client";

import { useEffect, useRef } from "react";

function PathLayer({ position }: { position: number }) {
  const paths = Array.from({ length: 18 }, (_, i) => {
    const t = i / 17;
    return {
      id: i,
      d: `M-${380 - i * 10 * position} -${189 + i * 12}C-${
        380 - i * 10 * position
      } -${189 + i * 12} -${312 - i * 10 * position} ${216 - i * 12} ${
        152 - i * 10 * position
      } ${343 - i * 12}C${616 - i * 10 * position} ${470 - i * 12} ${
        684 - i * 10 * position
      } ${875 - i * 12} ${684 - i * 10 * position} ${875 - i * 12}`,
      width: 1.15 + t * 1.05,
      // White → mid gray stack
      color: t < 0.33 ? "#ffffff" : t < 0.66 ? "#c8c8d0" : "#9a9aa3",
      opacity: 0.5 + (1 - t) * 0.45,
      dash: `${160 + i * 6} ${28 + (i % 4) * 6}`,
      duration: 18 + i * 1.1,
    };
  });

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          stroke={path.color}
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={path.dash}
        >
          {/* SMIL — independent of CSS reduced-motion overrides */}
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-220"
            dur={`${path.duration}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}

/**
 * White→gray path field. Container pans via rAF; dashes flow via SMIL
 * so global CSS `prefers-reduced-motion` rules can’t freeze it.
 */
export function HeroPaths() {
  const driftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = driftRef.current;
    if (!el) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const x = Math.sin(t * 0.22) * 5.5;
      const y = Math.cos(t * 0.17) * 3.2;
      const s = 1.06 + Math.sin(t * 0.13) * 0.03;
      el.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${s})`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <div
        ref={driftRef}
        className="absolute inset-[-12%] will-change-transform"
        style={{ transform: "translate3d(0,0,0) scale(1.06)" }}
      >
        <PathLayer position={1} />
        <PathLayer position={-1} />
      </div>
    </div>
  );
}
