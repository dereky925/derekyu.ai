"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FadeIn } from "@/components/fade-in";
import { ModelSection } from "@/components/model-section";
import { SilentClip } from "@/components/silent-clip";
import { useInViewPlay } from "@/components/silent-youtube";
import { clipDateLabel, clipPlaceDetail, photoClips } from "@/lib/photos";
import {
  grokeyeYouTube,
  hunterYouTube,
  streamClipAspect,
  streamClips,
  streamPoster,
} from "@/lib/stream";

function TileFrame({
  label,
  role,
  detail,
  children,
  dense,
}: {
  label: string;
  role?: string;
  detail: string;
  children: ReactNode;
  dense?: boolean;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      {children}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent ${
          dense ? "px-3 pb-2.5 pt-12 sm:px-4 sm:pb-3 sm:pt-16" : "px-4 pb-3 pt-16"
        }`}
      >
        <p
          className={
            dense
              ? "text-[11px] leading-snug text-foreground sm:text-sm"
              : "text-sm text-foreground"
          }
        >
          {label}
        </p>
        {role ? (
          <p
            className={
              dense
                ? "mt-0.5 text-[10px] text-muted sm:text-xs"
                : "mt-0.5 text-xs text-muted"
            }
          >
            {role}
          </p>
        ) : null}
        {detail ? (
          <p
            className={
              dense
                ? "mt-0.5 text-[10px] text-muted sm:text-xs"
                : "mt-0.5 text-xs text-muted"
            }
          >
            {detail}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Tile({
  href,
  label,
  role,
  detail,
  children,
  external,
  dense,
}: {
  href: string;
  label: string;
  role?: string;
  detail: string;
  children: ReactNode;
  external?: boolean;
  dense?: boolean;
}) {
  const className = "group block min-w-0";
  const frame = (
    <TileFrame label={label} role={role} detail={detail} dense={dense}>
      {children}
    </TileFrame>
  );
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {frame}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {frame}
    </Link>
  );
}

function StreamTile({
  href,
  label,
  role,
  detail,
  clipId,
  poster,
  external,
  mediaAspect,
  dense,
}: {
  href: string;
  label: string;
  role?: string;
  detail: string;
  clipId: string;
  poster: string;
  external?: boolean;
  mediaAspect?: number;
  dense?: boolean;
}) {
  const { ref, active } = useInViewPlay();
  return (
    <div ref={ref}>
      <Tile
        href={href}
        label={label}
        role={role}
        detail={detail}
        external={external}
        dense={dense}
      >
        <SilentClip
          id={clipId}
          poster={poster}
          title={label}
          active={active}
          mediaAspect={mediaAspect}
          className="absolute inset-0"
        />
      </Tile>
    </div>
  );
}

function Row({
  kicker,
  title,
  href,
  children,
}: {
  kicker: string;
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-24">
      <FadeIn>
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm text-muted">{kicker}</p>
            <h2 className="mt-2 text-2xl tracking-tight sm:text-3xl">{title}</h2>
          </div>
          <Link
            href={href}
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            View
          </Link>
        </div>
      </FadeIn>
      <FadeIn distance={24} duration={0.7}>
        {children}
      </FadeIn>
    </section>
  );
}

const canyon = photoClips.find((clip) => clip.title === "Grand Canyon")!;
const sedona = photoClips.find((clip) => clip.title === "Sedona")!;
const sedonaZion = photoClips.find((clip) => clip.title === "Sedona to Zion")!;
const cove = photoClips.find((clip) => clip.title === "Crystal Cove")!;
const la = photoClips.find((clip) => clip.title === "Los Angeles")!;
const fireworks = photoClips.find((clip) => clip.title === "LA fireworks")!;
const sanDiego = photoClips.find((clip) => clip.title === "San Diego")!;
const scottsdale = photoClips.find((clip) => clip.title === "Scottsdale")!;

function PhotoStreamTile({
  clip,
  label,
  detail,
}: {
  clip: (typeof photoClips)[number];
  label?: string;
  detail?: string;
}) {
  return (
    <StreamTile
      href="/photography"
      label={label ?? clip.title}
      detail={detail ?? clipPlaceDetail(clip)}
      clipId={clip.id}
      poster={clip.poster}
      dense
    />
  );
}

export function HighlightRows() {
  return (
    <>
      <Row kicker="Work" title="Where the days go." href="/work">
        <div className="grid gap-3 md:grid-cols-2">
          <StreamTile
            href="/work"
            label="Anduril Industries"
            role="Modeling & Simulation Engineer"
            detail="2025 – Present"
            clipId={streamClips.anduril}
            poster={streamPoster(streamClips.anduril)}
          />
          <StreamTile
            href="/work"
            label="Northrop Grumman"
            role="Guidance Navigation & Control Engineer"
            detail="2022–2025"
            clipId={streamClips.northrop}
            poster={streamPoster(streamClips.northrop)}
          />
        </div>
      </Row>

      <Row kicker="Projects" title="The public set." href="/work">
        <div className="grid gap-3 md:grid-cols-3">
          <StreamTile
            href={grokeyeYouTube}
            external
            label="GrokEye"
            detail="xAI Hackathon 2026 · Top 5 Finalist"
            clipId={streamClips.grokeye}
            poster="/media/projects/grokeye/poster.jpg"
          />
          <StreamTile
            href="/projects/to-mars-and-beyond"
            label="To Mars and Beyond"
            detail="8-bit Starship run · Starbase to Voyager 1"
            clipId={streamClips.mars}
            poster="/media/projects/mars/poster.jpg"
            mediaAspect={streamClipAspect[streamClips.mars]}
          />
          <StreamTile
            href={hunterYouTube}
            external
            label="Hunter Drone"
            detail="UB · net-capture quadcopter"
            clipId={streamClips.hunter}
            poster={streamPoster(streamClips.hunter)}
          />
        </div>
      </Row>

      <ModelSection />

      <Row kicker="Photography" title="From the air." href="/photography">
        {/* Mobile: 2 · 1 · 2 · 1 · 2 */}
        <div className="space-y-3 sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            <PhotoStreamTile clip={cove} />
            <PhotoStreamTile clip={canyon} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <PhotoStreamTile clip={sedona} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PhotoStreamTile clip={la} />
            <PhotoStreamTile clip={fireworks} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <PhotoStreamTile clip={sanDiego} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PhotoStreamTile clip={scottsdale} />
            <PhotoStreamTile
              clip={sedonaZion}
              label="Sedona, Arizona"
              detail={clipDateLabel(sedonaZion)}
            />
          </div>
        </div>

        {/* Desktop: 3 · 2 · 3 */}
        <div className="hidden space-y-3 sm:block">
          <div className="grid gap-3 sm:grid-cols-3">
            <PhotoStreamTile clip={cove} />
            <PhotoStreamTile clip={canyon} />
            <PhotoStreamTile clip={sedona} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PhotoStreamTile clip={la} />
            <PhotoStreamTile clip={fireworks} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <PhotoStreamTile clip={sanDiego} />
            <PhotoStreamTile clip={scottsdale} />
            <PhotoStreamTile
              clip={sedonaZion}
              label="Sedona, Arizona"
              detail={clipDateLabel(sedonaZion)}
            />
          </div>
        </div>
      </Row>
    </>
  );
}
