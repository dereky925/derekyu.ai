"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FadeIn } from "@/components/fade-in";
import { SilentClip } from "@/components/silent-clip";
import { useInViewPlay } from "@/components/silent-youtube";
import { photoClips } from "@/lib/photos";
import {
  grokeyeYouTube,
  hunterYouTube,
  streamClips,
  streamPoster,
} from "@/lib/stream";

function TileFrame({
  label,
  role,
  detail,
  children,
}: {
  label: string;
  role?: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black">
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-16">
        <p className="text-sm text-foreground">{label}</p>
        {role ? <p className="mt-0.5 text-xs text-muted">{role}</p> : null}
        <p className="mt-0.5 text-xs text-muted">{detail}</p>
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
}: {
  href: string;
  label: string;
  role?: string;
  detail: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className = "group block min-w-0";
  const frame = (
    <TileFrame label={label} role={role} detail={detail}>
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
}: {
  href: string;
  label: string;
  role?: string;
  detail: string;
  clipId: string;
  poster: string;
  external?: boolean;
}) {
  const { ref, active } = useInViewPlay();
  return (
    <div ref={ref}>
      <Tile href={href} label={label} role={role} detail={detail} external={external}>
        <SilentClip
          id={clipId}
          poster={poster}
          title={label}
          active={active}
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

const canyon = photoClips[0]!;
const sedona = photoClips[1]!;
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
        <div className="grid gap-3 md:grid-cols-2">
          <StreamTile
            href={grokeyeYouTube}
            external
            label="GrokEye"
            detail="xAI Hackathon 2026 · Top 5 Finalist"
            clipId={streamClips.grokeye}
            poster={streamPoster(streamClips.grokeye)}
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
              detail={cove.location}
              clipId={cove.id}
              poster={cove.poster}
            />
            <StreamTile
              href="/photography"
              label={canyon.title}
              detail={canyon.location}
              clipId={canyon.id}
              poster={canyon.poster}
            />
            <StreamTile
              href="/photography"
              label={sedona.title}
              detail={sedona.location}
              clipId={sedona.id}
              poster={sedona.poster}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <StreamTile
              href="/photography"
              label={la.title}
              detail={la.location}
              clipId={la.id}
              poster={la.poster}
            />
            <StreamTile
              href="/photography"
              label={fireworks.title}
              detail={fireworks.location}
              clipId={fireworks.id}
              poster={fireworks.poster}
            />
          </div>
        </div>
      </Row>
    </>
  );
}
