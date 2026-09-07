"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type PathSpec = {
  id: string;
  d: string;
  width: number;
  opacity: number;
  duration: number;
  delay: number;
  /** Absolute animation-delay for flow (includes stagger + small edge phase). */
  flowDelay: number;
};

function buildLayer(position: 1 | -1, count: number): PathSpec[] {
  return Array.from({ length: count }, (_, i) => {
    // Tighter spacing than the old i*5 / i*6 pack → denser field.
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
    const duration = 10 + ((i * 5 + (position > 0 ? 2 : 7)) % 12);
    // Scramble draw order so intro isn’t a clean bottom→top wipe with index.
    const staggerSlot = (i * 13 + (position > 0 ? 5 : 11)) % count;
    const delay = staggerSlot * 0.03 + (position > 0 ? 0 : 0.1);
    // Start just at the view edge — not mid-screen (that reads as a snap).
    const enterOffset = 0.045 + (staggerSlot % 9) * 0.005;
    const phase = -(enterOffset * duration);
    return {
      id: `${position}:${i}`,
      d: `M${x0} ${y0}C${x0} ${y0} ${x1} ${y1} ${xj} ${yj}S${x3} ${y3} ${x3} ${y3}`,
      width: 0.45 + i * 0.028,
      opacity: 0.11 + i * 0.015,
      duration,
      delay,
      // Flow begins with the draw so the tip travels in while the dash grows.
      flowDelay: delay + phase,
    };
  });
}

/** White animated stroke field for the About hero (paths backdrop). */
export function HeroPaths() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  const [active, setActive] = useState(true);

  const paths = useMemo(
    () => [...buildLayer(1, 48), ...buildLayer(-1, 48)],
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`hero-paths absolute inset-0 overflow-hidden bg-[#050505] ${
        reduce ? "hero-paths--static" : ""
      } ${active ? "" : "hero-paths--paused"}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 text-white"
          viewBox="0 0 696 316"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {paths.map((path) => (
            <path
              key={path.id}
              className="hero-path-stroke"
              d={path.d}
              pathLength={1}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={path.opacity}
              style={
                {
                  "--hero-path-duration": `${path.duration}s`,
                  "--hero-path-delay": `${path.delay}s`,
                  "--hero-path-flow-delay": `${path.flowDelay}s`,
                  "--hero-path-opacity": "0.45",
                } as CSSProperties
              }
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
