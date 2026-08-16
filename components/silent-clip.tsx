"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

/** 16:9 frame that covers a 16:10 tile (and slightly crops 16:9 tiles). */
const coverFrame =
  "absolute left-1/2 top-1/2 h-full w-[111.12%] max-w-none -translate-x-1/2 -translate-y-1/2";

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
  const [iframeReady, setIframeReady] = useState(false);
  const reduce = useReducedMotion();
  const shouldPlay = active && !reduce && native !== null;

  useEffect(() => {
    setNative(nativeHls());
  }, []);

  useEffect(() => {
    setIframeReady(false);
  }, [id]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !shouldPlay || !native) return;
    node.muted = true;
    node.playsInline = true;
    node.play().catch(() => {});
  }, [id, native, shouldPlay]);

  const frame = cover ? coverFrame : "absolute inset-0";

  return (
    <div className={`silent-clip relative overflow-hidden bg-black ${className}`}>
      {shouldPlay && native ? (
        <div className={frame}>
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
          >
            <source src={streamHlsSrc(id)} type="application/vnd.apple.mpegURL" />
          </video>
        </div>
      ) : null}
      {shouldPlay && native === false ? (
        <>
          <iframe
            className={`pointer-events-none border-0 ${frame}`}
            src={streamIframeSrc(id)}
            title={title}
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            onLoad={() => setIframeReady(true)}
          />
          {!iframeReady ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes="100vw"
              className="z-[1] object-cover"
            />
          ) : null}
        </>
      ) : null}
      {!shouldPlay ? (
        <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />
      ) : null}
    </div>
  );
}
