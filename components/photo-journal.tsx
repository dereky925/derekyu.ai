"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { MediaLoader } from "@/components/media-loader";
import { clipDateLabel } from "@/lib/photos";
import type { Photo, PhotoAlbum } from "@/lib/stills";

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      {dir === "prev" ? (
        <path d="M14.5 5 8 12l6.5 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9.5 5 16 12l-6.5 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

const navBtn =
  "absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-white/10";

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
  const fullRef = useRef<HTMLImageElement>(null);
  const [fullReady, setFullReady] = useState(false);

  useEffect(() => {
    setFullReady(false);
    const node = fullRef.current;
    if (node?.complete && node.naturalWidth > 0) {
      setFullReady(true);
    }
  }, [photo?.id]);

  useEffect(() => {
    if (photos.length < 2) return;
    const neighbors = [
      photos[(index + 1) % photos.length],
      photos[(index - 1 + photos.length) % photos.length],
    ];
    for (const next of neighbors) {
      if (!next) continue;
      const probe = document.createElement("img");
      probe.src = next.fullSrc;
    }
  }, [index, photos]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
    >
      <div className="relative z-20 flex h-16 shrink-0 items-center justify-end px-6 sm:px-10">
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <button
          type="button"
          className="absolute inset-0"
          aria-label="Close photograph"
          onClick={onClose}
        />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-20 sm:px-28">
          <div className="pointer-events-auto relative flex h-full max-h-full w-full items-center justify-center">
            {!fullReady ? (
              <>
                <img
                  src={photo.src}
                  alt=""
                  className="max-h-full max-w-full object-contain opacity-40"
                />
                <MediaLoader className="absolute inset-0" size="lg" />
              </>
            ) : null}
            <img
              ref={fullRef}
              src={photo.fullSrc}
              alt={photo.location}
              onLoad={() => setFullReady(true)}
              className={`max-h-full max-w-full object-contain ${
                fullReady ? "relative opacity-100" : "absolute opacity-0"
              }`}
            />
          </div>
        </div>

        {photos.length > 1 ? (
          <>
            <button
              type="button"
              className={`${navBtn} left-6 sm:left-10`}
              aria-label="Previous photograph"
              onClick={(event) => {
                event.stopPropagation();
                onMove((index - 1 + photos.length) % photos.length);
              }}
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              className={`${navBtn} right-6 sm:right-10`}
              aria-label="Next photograph"
              onClick={(event) => {
                event.stopPropagation();
                onMove((index + 1) % photos.length);
              }}
            >
              <Chevron dir="next" />
            </button>
          </>
        ) : null}
      </div>

      <p className="relative z-20 flex h-16 shrink-0 items-center justify-center px-6 text-sm text-white/70">
        {[clipDateLabel(photo), photo.location].filter(Boolean).join(" · ")}
      </p>
    </div>
  );
}

const GAP = 12;
const TARGET_HEIGHT = 280;

type Row = { photos: Photo[]; height: number; widths: number[] };

function aspectOf(photo: Photo) {
  return photo.width / photo.height || 1.5;
}

function makeRow(photos: Photo[], containerWidth: number): Row {
  const aspects = photos.map(aspectOf);
  const gaps = GAP * Math.max(0, photos.length - 1);
  const sum = aspects.reduce((total, aspect) => total + aspect, 0);
  const height = (containerWidth - gaps) / sum;
  const widths = aspects.map((aspect) => aspect * height);
  if (photos.length > 1) {
    const used = widths.reduce((total, width) => total + width, 0) + gaps;
    widths[widths.length - 1]! += containerWidth - used;
  }
  return { photos, height, widths };
}

function packJustified(photos: Photo[], containerWidth: number) {
  if (containerWidth <= 0) return [];

  const rows: Row[] = [];
  let current: Photo[] = [];

  const fits = (next: Photo[]) => {
    const aspects = next.map(aspectOf);
    const width =
      aspects.reduce((sum, aspect) => sum + aspect * TARGET_HEIGHT, 0) +
      GAP * Math.max(0, next.length - 1);
    return width <= containerWidth;
  };

  for (const photo of photos) {
    if (current.length && !fits([...current, photo])) {
      rows.push(makeRow(current, containerWidth));
      current = [];
    }
    current.push(photo);
  }
  if (current.length) {
    rows.push(makeRow(current, containerWidth));
  }

  const last = rows[rows.length - 1];
  const prev = rows[rows.length - 2];
  if (last && prev && last.photos.length === 1) {
    rows.splice(
      rows.length - 2,
      2,
      makeRow([...prev.photos, ...last.photos], containerWidth),
    );
  }

  return rows;
}

function StillThumb({
  photo,
  width,
  height,
  onOpen,
}: {
  photo: Photo;
  width: number;
  height: number;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ width, height }}
      className="relative shrink-0 overflow-hidden rounded-xl bg-surface"
    >
      {!loaded ? <MediaLoader className="absolute inset-0" /> : null}
      <Image
        src={photo.src}
        alt={photo.location}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        unoptimized
        onLoad={() => setLoaded(true)}
      />
    </button>
  );
}

function AlbumStrip({
  photos,
  start,
  onOpen,
}: {
  photos: Photo[];
  start: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(node);
    setWidth(Math.floor(node.getBoundingClientRect().width));
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => packJustified(photos, width), [photos, width]);

  let offset = 0;

  return (
    <div ref={ref} className="space-y-3">
      {rows.map((row) => {
        const rowStart = offset;
        offset += row.photos.length;
        return (
          <div
            key={row.photos.map((photo) => photo.id).join("-")}
            className="flex items-stretch gap-3"
          >
            {row.photos.map((photo, i) => (
              <StillThumb
                key={photo.id}
                photo={photo}
                width={row.widths[i]!}
                height={row.height}
                onOpen={() => onOpen(start + rowStart + i)}
              />
            ))}
          </div>
        );
      })}
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
          className="absolute bottom-4 left-[0.3rem] top-4 w-px bg-border"
          aria-hidden
        />
        {albums.map((album) => {
          const start = cursor;
          cursor += album.photos.length;
          return (
            <section
              key={`${album.year}-${album.month}-${album.location}-${start}`}
              className="relative grid gap-6 pl-7 sm:grid-cols-[9.5rem_1fr] sm:gap-10 sm:pl-0"
            >
              <div>
                <span
                  className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-foreground"
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
              <div className="min-w-0">
                <AlbumStrip
                  photos={album.photos}
                  start={start}
                  onOpen={setActive}
                />
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
