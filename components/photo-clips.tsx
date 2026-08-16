"use client";

import { useEffect, useRef, useState } from "react";
import { SilentClip } from "@/components/silent-clip";
import { clipDateLabel, type PhotoClip } from "@/lib/photos";

export function PhotoClips({ clips }: { clips: PhotoClip[] }) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll("[data-clip-id]");
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((current) => {
          const next = { ...current };
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.clipId;
            if (id) next[id] = entry.isIntersecting;
          }
          return next;
        });
      },
      { rootMargin: "120px", threshold: 0.25 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [clips]);

  return (
    <ol ref={rootRef} className="relative space-y-12">
      <span
        className="absolute bottom-4 left-[0.3rem] top-4 w-px bg-border"
        aria-hidden
      />
      {clips.map((clip) => (
        <li
          key={clip.id}
          data-clip-id={clip.id}
          className="relative grid gap-4 pl-7 sm:grid-cols-[13rem_1fr] sm:gap-10 sm:pl-0"
        >
          <div>
            <span
              className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-foreground"
              aria-hidden
            />
            <div className="sm:pl-7">
              <p className="text-lg tracking-tight text-foreground">
                {clip.location}
              </p>
              {clip.year ? (
                <p className="mt-1 text-sm text-muted">
                  {clipDateLabel(clip)}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <SilentClip
              id={clip.id}
              poster={clip.poster}
              title={clip.title}
              active={Boolean(visible[clip.id])}
              className="aspect-video rounded-xl"
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
