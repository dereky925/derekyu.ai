"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type SilentYouTubeProps = {
  id: string;
  title: string;
  poster: string;
  active: boolean;
  className?: string;
};

export function SilentYouTube({
  id,
  title,
  poster,
  active,
  className = "",
}: SilentYouTubeProps) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const shouldPlay = active && !reduce;
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0`;

  useEffect(() => {
    if (!shouldPlay) setReady(false);
  }, [shouldPlay]);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {shouldPlay ? (
        <iframe
          className="pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-[180%] max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
          src={src}
          title={title}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          onLoad={() => setReady(true)}
        />
      ) : null}
      {!shouldPlay || !ready ? (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}

export function useInViewPlay(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "80px", threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, active };
}
