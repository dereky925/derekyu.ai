"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MediaLoader } from "@/components/media-loader";
import { streamHlsSrc, streamIframeSrc } from "@/lib/stream";

function supportsHls() {
  if (typeof document === "undefined") return false;
  const video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegURL") !== "";
}

type SilentClipProps = {
  id: string;
  poster: string;
  title: string;
  active: boolean;
  cover?: boolean;
  /** Extra zoom so non-16:9 footage fills a 16:9 tile (Stream iframes letterbox). */
  coverScale?: number;
  className?: string;
};

export function SilentClip({
  id,
  poster,
  title,
  active,
  cover = true,
  coverScale = 1,
  className = "",
}: SilentClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const shouldPlay = active && !reduce;
  const showPoster = !shouldPlay || !ready;

  useEffect(() => {
    setHls(supportsHls());
  }, []);

  useEffect(() => {
    setReady(false);
  }, [id]);

  useEffect(() => {
    if (!shouldPlay) setReady(false);
  }, [shouldPlay]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (shouldPlay) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [shouldPlay, hls]);

  return (
    <div className={`silent-clip relative overflow-hidden bg-black ${className}`}>
      {hls === true && shouldPlay ? (
        <video
          ref={videoRef}
          className={`h-full w-full ${cover ? "object-cover" : "object-contain"}`}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={poster}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onPlaying={() => setReady(true)}
        >
          <source src={streamHlsSrc(id)} type="application/vnd.apple.mpegURL" />
        </video>
      ) : null}

      {hls === false && shouldPlay ? (
        <iframe
          className="pointer-events-none absolute inset-0 z-0 h-full w-full border-0"
          src={streamIframeSrc(id)}
          title={title}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          onLoad={() => setReady(true)}
          style={{
            background: "#050505",
            transform:
              cover && coverScale !== 1 ? `scale(${coverScale})` : undefined,
            transformOrigin: "center center",
          }}
        />
      ) : null}

      {showPoster ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className="z-[2] object-cover"
        />
      ) : null}

      {shouldPlay && !ready ? (
        <MediaLoader className="absolute inset-0 z-[3]" />
      ) : null}
    </div>
  );
}
