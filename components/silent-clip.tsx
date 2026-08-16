"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MediaLoader } from "@/components/media-loader";
import { streamHlsSrc, streamIframeSrc } from "@/lib/stream";

function nativeHls() {
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

/** Cover without object-fit — Safari HLS treats object-cover as letterbox or a black frame. */
const coverClass =
  "absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2";
const coverStyle = { minWidth: "100%", minHeight: "100%", width: "auto", height: "auto" } as const;

export function SilentClip({
  id,
  poster,
  title,
  active,
  cover = true,
  className = "",
}: SilentClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [native, setNative] = useState<boolean | null>(null);
  const [iframe, setIframe] = useState(false);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const shouldPlay = active && !reduce && native !== null;

  useEffect(() => {
    setNative(nativeHls());
  }, []);

  useEffect(() => {
    setReady(false);
    setIframe(false);
  }, [id]);

  useEffect(() => {
    const node = videoRef.current;
    if (!shouldPlay || iframe || !node || native === null) return;

    const play = () => {
      node.muted = true;
      node.play().catch(() => {});
    };

    if (native) {
      play();
      return;
    }

    let cancelled = false;
    let player: { destroy: () => void } | undefined;

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) {
        setIframe(true);
        return;
      }
      const instance = new Hls({
        capLevelToPlayerSize: true,
        abrEwmaDefaultEstimate: 8_000_000,
        maxBufferLength: 12,
      });
      if (cancelled) {
        instance.destroy();
        return;
      }
      instance.loadSource(streamHlsSrc(id));
      instance.attachMedia(node);
      instance.on(Hls.Events.MANIFEST_PARSED, play);
      player = instance;
    });

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [id, iframe, native, shouldPlay]);

  return (
    <div className={`silent-clip relative overflow-hidden bg-black ${className}`}>
      {shouldPlay && !iframe ? (
        <video
          ref={videoRef}
          className={cover ? coverClass : "absolute inset-0 h-full w-full object-contain"}
          style={cover ? coverStyle : undefined}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onPlaying={() => setReady(true)}
          onLoadedData={() => setReady(true)}
        >
          {native ? (
            <source src={streamHlsSrc(id)} type="application/vnd.apple.mpegURL" />
          ) : null}
        </video>
      ) : null}
      {shouldPlay && iframe ? (
        <iframe
          className={
            cover
              ? "pointer-events-none absolute left-1/2 top-1/2 h-full w-[111.12%] max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
              : "pointer-events-none absolute inset-0 h-full w-full border-0"
          }
          src={streamIframeSrc(id)}
          title={title}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          onLoad={() => setReady(true)}
        />
      ) : null}
      {!shouldPlay || !ready ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className="z-[1] object-cover"
        />
      ) : null}
      {shouldPlay && !ready ? (
        <MediaLoader className="absolute inset-0 z-[2]" />
      ) : null}
    </div>
  );
}
