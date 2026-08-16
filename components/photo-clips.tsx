"use client";

import Image from "next/image";
import { useState } from "react";
import { STREAM_CUSTOMER, type PhotoClip } from "@/lib/photos";

export function PhotoClips({ clips }: { clips: PhotoClip[] }) {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {clips.map((clip) => {
        const isPlaying = playing === clip.id;
        return (
          <div
            key={clip.id}
            className="relative aspect-video overflow-hidden rounded-xl bg-surface"
          >
            {isPlaying ? (
              <iframe
                className="h-full w-full"
                src={`https://${STREAM_CUSTOMER}.cloudflarestream.com/${clip.id}/iframe?autoplay=true&letterboxColor=transparent`}
                title="Drone clip"
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(clip.id)}
                className="absolute inset-0"
                aria-label="Play drone clip"
              >
                <Image
                  src={clip.poster}
                  alt="Drone clip poster"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-black">
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-0.5 h-5 w-5 fill-current"
                      aria-hidden
                    >
                      <path d="M8 5.14v13.72L19 12 8 5.14z" />
                    </svg>
                  </span>
                </span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
