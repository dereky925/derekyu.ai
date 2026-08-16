export function MediaLoader({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const px = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-12 w-12" : "h-9 w-9";

  return (
    <div
      className={`pointer-events-none flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 48 48"
        className={`media-loader ${px} text-white`}
        aria-hidden
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="1.15"
        />
        <g className="media-loader-spin" style={{ transformOrigin: "24px 24px" }}>
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeDasharray="20 106"
          />
        </g>
        <g
          className="media-loader-spin-rev"
          style={{ transformOrigin: "24px 24px" }}
        >
          <circle
            cx="24"
            cy="24"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.8"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeDasharray="14 68"
          />
        </g>
        <g
          className="media-loader-spin-slow"
          style={{ transformOrigin: "24px 24px" }}
        >
          <circle
            cx="24"
            cy="24"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.05"
            strokeLinecap="round"
            strokeDasharray="7 34"
          />
        </g>
      </svg>
    </div>
  );
}
