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

const STREAM_CANVAS = 16 / 9;

type SilentClipProps = {
  id: string;
  poster: string;
  title: string;
  active: boolean;
  mediaAspect?: number;
  frameAspect?: number;
  className?: string;
};

function iframeCoverScale(mediaAspect: number, frameAspect: number) {
  if (Math.abs(mediaAspect - STREAM_CANVAS) < 0.05) return 1;
  const visibleW =
    mediaAspect >= STREAM_CANVAS ? 1 : mediaAspect / STREAM_CANVAS;
  const visibleH =
    mediaAspect >= STREAM_CANVAS ? STREAM_CANVAS / mediaAspect : 1;
  return Math.max(1 / visibleW, frameAspect / STREAM_CANVAS / visibleH) * 1.02;
}

export function SilentClip({
  id,
  poster,
  title,
  active,
  mediaAspect = STREAM_CANVAS,
  frameAspect = STREAM_CANVAS,
  className = "",
}: SilentClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [warm, setWarm] = useState(false);
  const reduce = useReducedMotion();
  const shouldPlay = active && !reduce;
  const scale = iframeCoverScale(mediaAspect, frameAspect);
  const pinTop = mediaAspect + 0.05 < frameAspect;

  useEffect(() => {
    setHls(supportsHls());
  }, []);

  useEffect(() => {
    setReady(false);
    setWarm(false);
  }, [id]);

  useEffect(() => {
    if (shouldPlay) setWarm(true);
  }, [shouldPlay]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (shouldPlay) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [shouldPlay, warm, hls]);

  return (
    <div className={`silent-clip relative overflow-hidden bg-black ${className}`}>
      {hls === true && warm ? (
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${pinTop ? "object-top" : ""}`}
          muted
          loop
          playsInline
          autoPlay={shouldPlay}
          preload="auto"
          poster={poster}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onPlaying={() => setReady(true)}
        >
          <source src={streamHlsSrc(id)} type="application/vnd.apple.mpegURL" />
        </video>
      ) : null}

      {hls === false && warm ? (
        <iframe
          className={
            scale === 1
              ? "pointer-events-none absolute inset-0 z-0 h-full w-full border-0"
              : "pointer-events-none absolute left-1/2 top-0 z-0 border-0"
          }
          src={streamIframeSrc(id)}
          title={title}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          onLoad={() => setReady(true)}
          style={
            scale === 1
              ? { background: "#050505" }
              : {
                  background: "#050505",
                  width: `${scale * 100}%`,
                  height: `${scale * 100}%`,
                  transform: "translateX(-50%)",
                  maxWidth: "none",
                }
          }
        />
      ) : null}

      <Image
        src={poster}
        alt=""
        fill
        sizes="100vw"
        className={`z-[2] object-cover transition-opacity duration-500 ${
          pinTop ? "object-top" : ""
        } ${ready ? "pointer-events-none opacity-0" : "opacity-100"}`}
      />

      {shouldPlay && !ready ? (
        <MediaLoader className="absolute inset-0 z-[3]" />
      ) : null}
    </div>
  );
}
