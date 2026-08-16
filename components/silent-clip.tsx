"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MediaLoader } from "@/components/media-loader";
import { streamHlsSrc } from "@/lib/stream";

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

function coverBox(mediaAspect: number, frameAspect: number) {
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
  const box = coverBox(mediaAspect, frameAspect);

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

  useEffect(() => {
    if (hls !== false || !warm) return;
    const node = videoRef.current;
    if (!node) return;

    let cancelled = false;
    let player: { destroy: () => void } | undefined;

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return;
      const instance = new Hls({ maxBufferLength: 30 });
      instance.loadSource(streamHlsSrc(id));
      instance.attachMedia(node);
      player = instance;
    });

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [hls, warm, id]);

  return (
    <div className={`silent-clip relative overflow-hidden bg-black ${className}`}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={box}
      >
        {warm && hls !== null ? (
          <video
            ref={videoRef}
            className="h-full w-full"
            muted
            loop
            playsInline
            preload="auto"
            aria-label={title}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onPlaying={() => setReady(true)}
          >
            {hls === true ? (
              <source src={streamHlsSrc(id)} type="application/vnd.apple.mpegURL" />
            ) : null}
          </video>
        ) : null}

        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className={`z-[1] object-cover transition-opacity duration-500 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {shouldPlay && !ready ? (
        <MediaLoader className="absolute inset-0 z-[3]" />
      ) : null}
    </div>
  );
}
