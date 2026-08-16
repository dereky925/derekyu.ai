"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FadeIn } from "@/components/fade-in";
import { DamascusField } from "@/components/damascus-field";
import { SilentClip } from "@/components/silent-clip";
import { SilentYouTube, useInViewPlay } from "@/components/silent-youtube";
import { photoClips } from "@/lib/photos";

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

function PlayTile({
  label,
  detail,
  children,
}: {
  label: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <TileFrame label={label} detail={detail}>
        {children}
      </TileFrame>
    </div>
  );
}

function Tile({
  href,
  label,
  detail,
  children,
}: {
  href: string;
  label: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="group block min-w-0">
      <TileFrame label={label} detail={detail}>
        {children}
      </TileFrame>
    </Link>
  );
}

function StreamTile({
  href,
  label,
  detail,
  clipId,
  poster,
}: {
  href: string;
  label: string;
  detail: string;
  clipId: string;
  poster: string;
}) {
  const { ref, active } = useInViewPlay();
  return (
    <div ref={ref}>
      <Tile href={href} label={label} detail={detail}>
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
          <PlayTile label="Anduril" detail="Modeling, simulation & analysis">
            <DamascusField
              theme="anduril"
              className="absolute inset-0 h-full w-full"
            />
          </PlayTile>
          <PlayTile label="Northrop Grumman" detail="GNC, RF, sensors">
            <DamascusField
              theme="northrop"
              className="absolute inset-0 h-full w-full"
            />
          </PlayTile>
        </div>
      </Row>

      <Row kicker="Projects" title="The public set." href="/work">
        <div className="grid gap-3 md:grid-cols-2">
          <YouTubeTile
            href="/projects/grokeye"
            label="GrokEye"
            detail="xAI Hackathon 2026 · Top 5"
            youtubeId="lC4oP8kb9KE"
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
