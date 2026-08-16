"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FadeIn } from "@/components/fade-in";
import { SilentClip } from "@/components/silent-clip";
import { useInViewPlay } from "@/components/silent-youtube";
import { clipPlaceDetail, photoClips } from "@/lib/photos";
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
  frameAspect = 16 / 9,
  children,
}: {
  label: string;
  role?: string;
  detail: string;
  frameAspect?: number;
  children: ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-black"
      style={{ aspectRatio: frameAspect }}
    >
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-16">
        <p className="text-sm text-foreground">{label}</p>
        {role ? <p className="mt-0.5 text-xs text-muted">{role}</p> : null}
        {detail ? <p className="mt-0.5 text-xs text-muted">{detail}</p> : null}
      </div>
    </div>
  );
}

function Tile({
  href,
  label,
  role,
  detail,
  frameAspect,
  children,
  external,
}: {
  href: string;
  label: string;
  role?: string;
  detail: string;
  frameAspect?: number;
  children: ReactNode;
  external?: boolean;
}) {
  const className = "group block min-w-0";
  const frame = (
    <TileFrame
      label={label}
      role={role}
      detail={detail}
      frameAspect={frameAspect}
    >
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
}: {
  href: string;
  label: string;
  role?: string;
  detail: string;
  clipId: string;
  poster: string;
  external?: boolean;
  mediaAspect?: number;
}) {
  const { ref, active } = useInViewPlay();
  const frameAspect = mediaAspect ?? 16 / 9;
  return (
    <div ref={ref}>
      <Tile
        href={href}
        label={label}
        role={role}
        detail={detail}
        external={external}
        frameAspect={frameAspect}
      >
        <SilentClip
          id={clipId}
          poster={poster}
          title={label}
          active={active}
          mediaAspect={frameAspect}
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
const cove = photoClips.find((clip) => clip.title === "Crystal Cove")!;
const la = photoClips.find((clip) => clip.title === "Los Angeles")!;
const fireworks = photoClips.find((clip) => clip.title === "LA fireworks")!;

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
        <div className="grid items-start gap-3 md:grid-cols-3">
          <StreamTile
            href={grokeyeYouTube}
            external
            label="GrokEye"
            detail="xAI Hackathon 2026 · Top 5 Finalist"
            clipId={streamClips.grokeye}
            poster={streamPoster(streamClips.grokeye)}
          />
          <StreamTile
            href="/projects/to-mars-and-beyond"
            label="To Mars and Beyond"
            detail="8-bit Starship run · Starbase to Voyager 1"
            clipId={streamClips.mars}
            poster={streamPoster(streamClips.mars)}
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

      <Row kicker="Photography" title="From the air." href="/photography">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <StreamTile
              href="/photography"
              label={cove.title}
              detail={clipPlaceDetail(cove)}
              clipId={cove.id}
              poster={cove.poster}
            />
            <StreamTile
              href="/photography"
              label={canyon.title}
              detail={clipPlaceDetail(canyon)}
              clipId={canyon.id}
              poster={canyon.poster}
            />
            <StreamTile
              href="/photography"
              label={sedona.title}
              detail={clipPlaceDetail(sedona)}
              clipId={sedona.id}
              poster={sedona.poster}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <StreamTile
              href="/photography"
              label={la.title}
              detail={clipPlaceDetail(la)}
              clipId={la.id}
              poster={la.poster}
            />
            <StreamTile
              href="/photography"
              label={fireworks.title}
              detail={clipPlaceDetail(fireworks)}
              clipId={fireworks.id}
              poster={fireworks.poster}
            />
          </div>
        </div>
      </Row>
    </>
  );
}
