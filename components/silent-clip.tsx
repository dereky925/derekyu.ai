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
  cover?: boolean;
  /** Source width/height. Stream iframes are 16:9 and letterbox anything else. */
  mediaAspect?: number;
  /** Tile width/height. About cards are 16:9; Work cards are 16:10. */
  frameAspect?: number;
  className?: string;
};

function coverSize(mediaAspect: number, frameAspect: number) {
  if (mediaAspect >= frameAspect) {
    return {
      width: `${(mediaAspect / frameAspect) * 100}%`,
      height: "100%",
    };
  }
  return {
    width: "100%",
    height: `${(frameAspect / mediaAspect) * 100}%`,
  };
}

function iframeCoverScale(mediaAspect: number, frameAspect: number) {
  const visible = {
    width:
      mediaAspect >= STREAM_CANVAS ? 1 : mediaAspect / STREAM_CANVAS,
    height:
      mediaAspect >= STREAM_CANVAS ? STREAM_CANVAS / mediaAspect : 1,
  };
  return (
    Math.max(1 / visible.width, frameAspect / STREAM_CANVAS / visible.height) *
    1.02
  );
}

export function SilentClip({
  id,
  poster,
  title,
  active,
  cover = true,
  mediaAspect = STREAM_CANVAS,
  frameAspect = STREAM_CANVAS,
  className = "",
}: SilentClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const shouldPlay = active && !reduce;
  const showPoster = !shouldPlay || !ready;
  const box = coverSize(mediaAspect, frameAspect);
  const iframeScale = iframeCoverScale(mediaAspect, frameAspect);

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
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          style={box}
        >
          <video
            ref={videoRef}
            className="h-full w-full"
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
        </div>
      ) : null}

      {hls === false && shouldPlay ? (
        <iframe
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 border-0"
          src={streamIframeSrc(id)}
          title={title}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          onLoad={() => setReady(true)}
          style={{
            background: "#050505",
            width: cover ? `${iframeScale * 100}%` : "100%",
            height: cover ? `${iframeScale * 100}%` : "100%",
            transform: "translate(-50%, -50%)",
            maxWidth: "none",
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
