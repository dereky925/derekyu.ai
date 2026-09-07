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
    width: 0.7 + i * 0.035,
    duration: 28 + (i % 10) * 1.4,
    // Outer lines quieter gray, inner closer to white
    baseOpacity: 0.28 + (1 - i / 40) * 0.42,
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
            pathLength={1}
            // Visible immediately — no entrance fade-in.
            initial={false}
            animate={{
              opacity: [
                path.baseOpacity * 0.75,
                Math.min(path.baseOpacity * 1.35, 0.95),
                path.baseOpacity * 0.75,
              ],
              pathOffset: [0, 1],
            }}
            transition={{
              opacity: {
                duration: path.duration * 0.45,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              pathOffset: {
                duration: path.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
            style={{ opacity: path.baseOpacity }}
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
