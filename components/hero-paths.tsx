"use client";

function PathLayer({ position }: { position: number }) {
  const gradId = `hero-path-grad-${position > 0 ? "a" : "b"}`;
  const paths = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    return {
      id: i,
      d: `M-${380 - i * 14 * position} -${189 + i * 16}C-${
        380 - i * 14 * position
      } -${189 + i * 16} -${312 - i * 14 * position} ${216 - i * 16} ${
        152 - i * 14 * position
      } ${343 - i * 16}C${616 - i * 14 * position} ${470 - i * 16} ${
        684 - i * 14 * position
      } ${875 - i * 16} ${684 - i * 14 * position} ${875 - i * 16}`,
      width: 1.1 + t * 1.1,
      // White → gray depth across the stack
      color: t < 0.35 ? "#ffffff" : t < 0.7 ? "#c4c4cc" : "#8a8a93",
      opacity: 0.45 + (1 - t) * 0.4,
    };
  });

  return (
    <svg
      className="absolute inset-0 h-[120%] w-[140%] max-w-none"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          stroke={path.color}
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/**
 * White→gray path field. Motion is one GPU transform on the group —
 * not dozens of per-stroke JS/CSS dash animations.
 */
export function HeroPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <div className="hero-paths-drift absolute inset-[-10%]">
        <PathLayer position={1} />
        <PathLayer position={-1} />
      </div>
    </div>
  );
}
