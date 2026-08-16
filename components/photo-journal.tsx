"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { clipDateLabel } from "@/lib/photos";
import type { Photo, PhotoAlbum } from "@/lib/stills";

function Lightbox({
  photos,
  index,
  onClose,
  onMove,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onMove: (index: number) => void;
}) {
  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 sm:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
    >
      <img
        src={photo.fullSrc}
        alt={photo.location}
        className="max-h-full max-w-full object-contain"
        onClick={(event) => event.stopPropagation()}
      />
      <p className="pointer-events-none absolute bottom-5 left-5 text-sm text-white/70">
        {[clipDateLabel(photo), photo.location].filter(Boolean).join(" · ")}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 text-sm text-white/70 hover:text-white"
      >
        Close
      </button>
      {photos.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              onMove((index - 1 + photos.length) % photos.length);
            }}
          >
            Prev
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              onMove((index + 1) % photos.length);
            }}
          >
            Next
          </button>
        </>
      ) : null}
    </div>
  );
}

export function PhotoJournal({ albums }: { albums: PhotoAlbum[] }) {
  const photos = useMemo(() => albums.flatMap((album) => album.photos), [albums]);
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

  let cursor = 0;

  return (
    <>
      <div className="relative space-y-16">
        <span
          className="absolute bottom-4 left-[0.3rem] top-4 hidden w-px bg-border sm:block"
          aria-hidden
        />
        {albums.map((album) => {
          const start = cursor;
          cursor += album.photos.length;
          return (
            <section
              key={`${album.year}-${album.month}-${album.location}-${start}`}
              className="relative grid gap-6 sm:grid-cols-[9.5rem_1fr] sm:gap-10"
            >
              <div className="sm:block">
                <span
                  className="mt-1.5 hidden h-2.5 w-2.5 shrink-0 rounded-full bg-foreground sm:absolute sm:left-0 sm:mt-1 sm:block"
                  aria-hidden
                />
                <div className="sm:pl-7">
                  {album.year ? (
                    <p className="text-sm text-foreground">
                      {clipDateLabel(album)}
                    </p>
                  ) : null}
                  <p
                    className={
                      album.year
                        ? "mt-1 text-sm text-muted"
                        : "text-sm text-foreground"
                    }
                  >
                    {album.location}
                  </p>
                </div>
              </div>
              <div className="columns-1 gap-3 sm:columns-2">
                {album.photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActive(start + i)}
                    className="mb-3 block w-full overflow-hidden rounded-xl bg-surface text-left"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.location}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="h-auto w-full"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {active !== null ? (
        <Lightbox
          photos={photos}
          index={active}
          onClose={() => setActive(null)}
          onMove={setActive}
        />
      ) : null}
    </>
  );
}
