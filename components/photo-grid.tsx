"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo } from "@/lib/photos";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") {
        setActive((i) => (i === null ? i : (i + 1) % photos.length));
      }
      if (event.key === "ArrowLeft") {
        setActive((i) =>
          i === null ? i : (i - 1 + photos.length) % photos.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active, photos.length]);

  const current = active !== null ? photos[active] : null;

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActive(index)}
            className="mb-3 block w-full overflow-hidden rounded-xl bg-surface text-left"
          >
            <Image
              src={photo.src}
              alt="Drone photograph by Derek Yu"
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition-transform duration-500 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
            />
          </button>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 sm:p-10"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
        >
          <Image
            src={current.src}
            alt="Drone photograph by Derek Yu"
            width={current.width}
            height={current.height}
            sizes="100vw"
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
            priority
          />
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 text-sm text-white/70 hover:text-white"
          >
            Close
          </button>
        </div>
      ) : null}
    </>
  );
}
