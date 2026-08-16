"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { mediaUrl, muxMp4 } from "@/lib/media";
import type { ProjectVideo } from "@/lib/projects";

type VideoPlayerProps = {
  poster: string;
  title: string;
  video?: ProjectVideo;
};

export function VideoPlayer({ poster, title, video }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const [failed, setFailed] = useState(false);
  const muxSrc = video?.muxPlaybackId ? muxMp4(video.muxPlaybackId) : undefined;
  const fileSrc = video?.src ? mediaUrl(video.src) : undefined;
  const hasHostedFile = Boolean(
    muxSrc || (fileSrc && /^https?:\/\//.test(fileSrc)),
  );
  const hostedSrc =
    !failed && (muxSrc || (hasHostedFile ? fileSrc : undefined));
  const youtubeId = video?.youtubeId;
  const canPlay = Boolean(hostedSrc || youtubeId);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={rootRef} className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface">
        {!playing || !canPlay ? (
          <>
            <Image
              src={poster}
              alt={`${title} video poster`}
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
            {canPlay ? (
              <button
                type="button"
                onClick={() => {
                  setInView(true);
                  setPlaying(true);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35"
                aria-label={`Play ${title} video`}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    className="ml-0.5 h-6 w-6 fill-current"
                    aria-hidden
                  >
                    <path d="M8 5.14v13.72L19 12 8 5.14z" />
                  </svg>
                </span>
              </button>
            ) : null}
          </>
        ) : hostedSrc && inView ? (
          <video
            className="h-full w-full object-cover"
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={poster}
            onError={() => setFailed(true)}
          >
            <source src={hostedSrc} type="video/mp4" />
          </video>
        ) : youtubeId && inView ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={`${title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={poster}
            alt={`${title} video poster`}
            fill
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
          />
        )}
      </div>
      {video?.caption ? (
        <figcaption className="text-sm text-muted">{video.caption}</figcaption>
      ) : null}
    </figure>
  );
}
