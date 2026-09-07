"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function FloatingPaths({ position }: { position: number }) {
  const reduce = useReducedMotion();
  const paths = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const o = i * 5 * position;
        const yo = i * 6;
        // Two cubics with SVG `S` so the mid join stays C1-smooth (no kink).
        const x0 = -(380 - o);
        const y0 = -(189 + yo);
        const x1 = -(312 - o);
        const y1 = 216 - yo;
        const xj = 152 - o;
        const yj = 343 - yo;
        const x3 = 684 - o;
        const y3 = 875 - yo;
        return {
          id: i,
          d: `M${x0} ${y0}C${x0} ${y0} ${x1} ${y1} ${xj} ${yj}S${x3} ${y3} ${x3} ${y3}`,
          width: 0.5 + i * 0.03,
          // One-way speeds — staggered so the field never syncs to a pause
          duration: 10 + ((i * 5 + (position > 0 ? 2 : 7)) % 12),
          drawDelay: i * 0.035 + (position > 0 ? 0 : 0.25),
        };
      }),
    [position],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 text-white"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="geometricPrecision"
        aria-hidden
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.1 + path.id * 0.022}
            initial={
              reduce
                ? { pathLength: 0.4, pathOffset: 0, opacity: 0.35 }
                : { pathLength: 0, pathOffset: 0, opacity: 0 }
            }
            animate={
              reduce
                ? { pathLength: 0.4, pathOffset: 0, opacity: 0.35 }
                : {
                    // Grow onto blank, then keep a traveling segment flowing one way
                    pathLength: 0.4,
                    pathOffset: [0, 1],
                    opacity: 0.45,
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    pathLength: {
                      duration: 2.6,
                      delay: path.drawDelay,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: {
                      duration: 1.1,
                      delay: path.drawDelay,
                      ease: "easeOut",
                    },
                    pathOffset: {
                      duration: path.duration,
                      delay: path.drawDelay,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}

/** White animated stroke field for the About hero (paths backdrop). */
export function HeroPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
