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
        duration: 22 + ((i * 7 + (position > 0 ? 3 : 0)) % 11),
      })),
    [position],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Scale past the viewport so strokes fill edge-to-edge */}
      <svg
        className="absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 text-white"
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
                : { pathLength: 0.5, opacity: 0.4 }
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
                    pathLength: {
                      duration: 2.4,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: {
                      duration: path.duration,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    pathOffset: {
                      duration: path.duration,
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
