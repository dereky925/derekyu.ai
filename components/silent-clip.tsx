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
  /** Source width/height. Default 16:9. */
  mediaAspect?: number;
  className?: string;
};

export function SilentClip({
  id,
  poster,
  title,
  active,
  mediaAspect = STREAM_CANVAS,
  className = "",
}: SilentClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const shouldPlay = active && !reduce;
  const showPoster = !shouldPlay || !ready;
  const useNativeVideo = Math.abs(mediaAspect - STREAM_CANVAS) > 0.05;

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
    if (!node || !shouldPlay) return;
    if (hls === true || useNativeVideo) {
      node.play().catch(() => {});
    }
  }, [shouldPlay, hls, useNativeVideo]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || hls !== false || !shouldPlay || !useNativeVideo) return;

    let cancelled = false;
    let player: { destroy: () => void } | undefined;

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return;
      const instance = new Hls();
      instance.loadSource(streamHlsSrc(id));
      instance.attachMedia(node);
      player = instance;
    });

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [hls, shouldPlay, id, useNativeVideo]);

  const showVideo =
    shouldPlay && (hls === true || (hls === false && useNativeVideo));
  const showIframe = shouldPlay && hls === false && !useNativeVideo;

  return (
    <div className={`silent-clip relative overflow-hidden bg-black ${className}`}>
      {showVideo ? (
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
          {hls === true ? (
            <source src={streamHlsSrc(id)} type="application/vnd.apple.mpegURL" />
          ) : null}
        </video>
      ) : null}

      {showIframe ? (
        <iframe
          className="pointer-events-none absolute inset-0 z-0 h-full w-full border-0"
          src={streamIframeSrc(id)}
          title={title}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          onLoad={() => setReady(true)}
          style={{ background: "#050505" }}
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
