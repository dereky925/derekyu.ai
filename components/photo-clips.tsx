"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  STREAM_CUSTOMER,
  clipDateLabel,
  type PhotoClip,
} from "@/lib/photos";

function supportsHls() {
  if (typeof document === "undefined") return false;
  const video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegURL") !== "";
}

function AutoplayClip({ clip, active }: { clip: PhotoClip; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const reduce = useReducedMotion();
  const shouldPlay = active && !reduce;

  useEffect(() => {
    setHls(supportsHls());
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (shouldPlay) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [shouldPlay]);

  const hlsSrc = `https://${STREAM_CUSTOMER}.cloudflarestream.com/${clip.id}/manifest/video.m3u8`;
  const iframeSrc = `https://${STREAM_CUSTOMER}.cloudflarestream.com/${clip.id}/iframe?autoplay=true&muted=true&loop=true&preload=auto&letterboxColor=%23050505&primaryColor=%23f4f4f5`;

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      {hls ? (
        <video
          ref={videoRef}
          className="h-full w-full bg-black object-cover"
          muted
          loop
          playsInline
          autoPlay={shouldPlay}
          preload={shouldPlay ? "auto" : "none"}
          poster={clip.poster}
          controls
        >
          <source src={hlsSrc} type="application/vnd.apple.mpegURL" />
        </video>
      ) : shouldPlay ? (
        <>
          <iframe
            className="absolute inset-0 h-full w-full bg-black"
            src={iframeSrc}
            title={clip.title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            onLoad={() => setIframeReady(true)}
            style={{ background: "#050505" }}
          />
          {!iframeReady ? (
            <Image
              src={clip.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          ) : null}
        </>
      ) : (
        <Image
          src={clip.poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

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
            <AutoplayClip clip={clip} active={Boolean(visible[clip.id])} />
            <p className="mt-3 text-sm text-muted">{clip.title}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
