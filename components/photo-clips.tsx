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
        className="absolute bottom-4 left-[0.3rem] top-4 hidden w-px bg-border sm:block"
        aria-hidden
      />
      {clips.map((clip) => (
        <li
          key={clip.id}
          data-clip-id={clip.id}
          className="relative grid gap-4 sm:grid-cols-[9.5rem_1fr] sm:gap-10"
        >
          <div className="flex gap-3 sm:block">
            <span
              className="mt-1.5 hidden h-2.5 w-2.5 shrink-0 rounded-full bg-foreground sm:absolute sm:left-0 sm:mt-1 sm:block"
              aria-hidden
            />
            <div className="sm:pl-7">
              <p className="text-sm text-foreground">{clipDateLabel(clip)}</p>
              <p className="mt-1 text-sm text-muted">{clip.location}</p>
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
            <p className="mt-3 text-sm text-muted">{clip.title}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
