"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function FloatingPaths({ position }: { position: number }) {
  const reduce = useReducedMotion();
  const paths = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
          380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
          152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
          684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
        // Stable per-path duration (avoids hydration/random flicker)
        duration: 22 + ((i * 7 + (position > 0 ? 3 : 0)) % 11),
      })),
    [position],
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-white"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.025}
            initial={
              reduce
                ? { pathLength: 1, opacity: 0.35 }
                : { pathLength: 0.3, opacity: 0.45 }
            }
            animate={
              reduce
                ? { pathLength: 1, opacity: 0.35 }
                : {
                    pathLength: 1,
                    opacity: [0.22, 0.5, 0.22],
                    pathOffset: [0, 1, 0],
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: path.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
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
