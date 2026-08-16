"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  className?: string;
};

export function SilentClip({
  id,
  poster,
  title,
  active,
  cover = true,
  className = "",
}: SilentClipProps) {
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

  return (
    <div className={`silent-clip relative overflow-hidden bg-black ${className}`}>
      {hls ? (
        <video
          ref={videoRef}
          className={`h-full w-full bg-black ${cover ? "object-cover" : "object-contain"}`}
          muted
          loop
          playsInline
          autoPlay={shouldPlay}
          preload={shouldPlay ? "auto" : "metadata"}
          poster={poster}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        >
          <source src={streamHlsSrc(id)} type="application/vnd.apple.mpegURL" />
        </video>
      ) : shouldPlay ? (
        <>
          <iframe
            className={
              cover
                ? "pointer-events-none absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
                : "pointer-events-none absolute inset-0 h-full w-full border-0 bg-black"
            }
            src={streamIframeSrc(id)}
            title={title}
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            onLoad={() => setIframeReady(true)}
            style={
              cover
                ? {
                    width: "100vw",
                    height: "56.25vw",
                    minHeight: "100%",
                    minWidth: "177.78vh",
                    background: "#050505",
                  }
                : { background: "#050505" }
            }
          />
          {!iframeReady ? (
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
    </div>
  );
}
