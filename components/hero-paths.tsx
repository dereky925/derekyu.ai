"use client";

import { motion } from "framer-motion";

function FloatingPaths({ position }: { position: number }) {
  const gradId = `hero-path-grad-${position > 0 ? "a" : "b"}`;
  const paths = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.75 + i * 0.035,
    duration: 26 + (i % 10) * 1.5,
    baseOpacity: 0.32 + (1 - i / 40) * 0.48,
    // Long dashes read as continuous ribbons while still allowing flow.
    dash: `${220 + i * 2} ${36 + (i % 5) * 4}`,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#9a9aa3" />
            <stop offset="100%" stopColor="#e8e8ec" />
          </linearGradient>
        </defs>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={`url(#${gradId})`}
            strokeWidth={path.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={path.dash}
            initial={{
              opacity: path.baseOpacity,
              strokeDashoffset: 0,
            }}
            animate={{
              opacity: [
                path.baseOpacity * 0.7,
                Math.min(path.baseOpacity * 1.25, 1),
                path.baseOpacity * 0.7,
              ],
              strokeDashoffset: [0, -260],
            }}
            transition={{
              opacity: {
                duration: 8 + (path.id % 5),
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              strokeDashoffset: {
                duration: path.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/** White→gray animated stroke field for the About hero. */
export function HeroPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
