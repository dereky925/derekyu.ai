"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { SilentClip } from "@/components/silent-clip";
import type { PhotoClip } from "@/lib/photos";

export function HomeClipCard({
  href,
  title,
  detail,
  clip,
}: {
  href: string;
  title: string;
  detail: string;
  clip: PhotoClip;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "80px", threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <FadeIn distance={32} duration={0.85}>
      <div ref={ref}>
        <Link href={href} className="group block">
          <SilentClip
            id={clip.id}
            poster={clip.poster}
            title={title}
            active={active}
            className="relative aspect-[16/10] rounded-2xl"
          />
          <h2 className="mt-4 text-lg tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted">{detail}</p>
        </Link>
      </div>
    </FadeIn>
  );
}

export function HomeClipStrip({ clips }: { clips: PhotoClip[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll("[data-home-clip]");
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((current) => {
          const next = { ...current };
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.homeClip;
            if (id) next[id] = entry.isIntersecting;
          }
          return next;
        });
      },
      { rootMargin: "80px", threshold: 0.2 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [clips]);

  return (
    <div ref={rootRef} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {clips.map((clip) => (
        <Link
          key={clip.id}
          href="/photography"
          data-home-clip={clip.id}
          className="relative overflow-hidden rounded-xl bg-black"
        >
          <SilentClip
            id={clip.id}
            poster={clip.poster}
            title={clip.title}
            active={Boolean(visible[clip.id])}
            className="relative aspect-video"
          />
        </Link>
      ))}
    </div>
  );
}
