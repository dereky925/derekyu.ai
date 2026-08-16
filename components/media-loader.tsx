export function MediaLoader({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const box = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-10 w-10" : "h-7 w-7";

  return (
    <div
      className={`pointer-events-none flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className={`relative ${box}`} aria-hidden>
        <span className="media-loader-ring" />
        <span className="media-loader-core" />
      </span>
    </div>
  );
}
