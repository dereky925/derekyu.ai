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
  const [hls, setHls] = useState(false);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const shouldPlay = active && !reduce;

  useEffect(() => {
    setHls(supportsHls());
  }, []);

  useEffect(() => {
    setReady(false);
  }, [id]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (shouldPlay) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [shouldPlay]);

  return (
    <div className={`silent-clip relative overflow-hidden bg-black ${className}`}>
      {hls ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full bg-black ${cover ? "object-cover" : "object-contain"}`}
          muted
          loop
          playsInline
          autoPlay={shouldPlay}
          preload={shouldPlay ? "auto" : "metadata"}
          poster={poster}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onPlaying={() => setReady(true)}
        >
          <source src={streamHlsSrc(id)} type="application/vnd.apple.mpegURL" />
        </video>
      ) : shouldPlay ? (
        <>
          <iframe
            className={
              cover
                ? "pointer-events-none absolute left-1/2 top-1/2 border-0"
                : "pointer-events-none absolute inset-0 h-full w-full border-0 bg-black"
            }
            src={streamIframeSrc(id)}
            title={title}
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            onLoad={() => setReady(true)}
            style={
              cover
                ? {
                    background: "#050505",
                    height: `${coverScale * 100}%`,
                    width: `${coverScale * 100}%`,
                    transform: "translate(-50%, -50%)",
                    maxWidth: "none",
                  }
                : { background: "#050505" }
            }
          />
          {!ready ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
        </>
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      {shouldPlay && !ready ? (
        <MediaLoader className="absolute inset-0 z-[1]" />
      ) : null}
    </div>
  );
}
