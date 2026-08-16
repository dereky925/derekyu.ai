"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FadeIn } from "@/components/fade-in";
import { SilentClip } from "@/components/silent-clip";
import { SilentYouTube, useInViewPlay } from "@/components/silent-youtube";
import { photoClips } from "@/lib/photos";
import { grokeyeYouTube, streamClips, streamPoster } from "@/lib/stream";

function TileFrame({
  label,
  detail,
  children,
}: {
  label: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black">
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
        <p className="text-sm text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{detail}</p>
      </div>
    </div>
  );
}

function Tile({
  href,
  label,
  detail,
  children,
  external,
}: {
  href: string;
  label: string;
  detail: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className = "group block min-w-0";
  const frame = (
    <TileFrame label={label} detail={detail}>
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
  detail,
  clipId,
  poster,
  external,
}: {
  href: string;
  label: string;
  detail: string;
  clipId: string;
  poster: string;
  external?: boolean;
}) {
  const { ref, active } = useInViewPlay();
  return (
    <div ref={ref}>
      <Tile href={href} label={label} detail={detail} external={external}>
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

function YouTubeTile({
  href,
  label,
  detail,
  youtubeId,
}: {
  href: string;
  label: string;
  detail: string;
  youtubeId: string;
}) {
  const { ref, active } = useInViewPlay();
  return (
    <div ref={ref}>
      <Tile href={href} label={label} detail={detail}>
        <SilentYouTube
          id={youtubeId}
          title={label}
          poster={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
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

export function HighlightRows() {
  return (
    <>
      <Row kicker="Work" title="Where the days go." href="/work">
        <div className="grid gap-3 md:grid-cols-2">
          <StreamTile
            href="/work"
            label="Anduril"
            detail="Modeling, simulation & analysis"
            clipId={streamClips.anduril}
            poster={streamPoster(streamClips.anduril)}
          />
          <StreamTile
            href="/work"
            label="Northrop Grumman"
            detail="GNC, RF, sensors"
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
            detail="xAI Hackathon 2026 · Top 5"
            clipId={streamClips.grokeye}
            poster={streamPoster(streamClips.grokeye)}
          />
          <YouTubeTile
            href="/work"
            label="Hunter Drone"
            detail="UB · net-capture quadcopter"
            youtubeId="nB1vAQlGqa4"
          />
        </div>
      </Row>

      <Row kicker="Photography" title="From the air." href="/photography">
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
      </Row>
    </>
  );
}
