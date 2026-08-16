"use client";

import Image from "next/image";
import Link from "next/link";
import { SilentClip } from "@/components/silent-clip";
import { useInViewPlay } from "@/components/silent-youtube";
import type { ProjectListing } from "@/lib/projects";
import { streamPoster } from "@/lib/stream";

export function ProjectCard({ project }: { project: ProjectListing }) {
  const { ref, active } = useInViewPlay();
  const poster = project.poster;
  const streamId = project.streamId;

  const media = streamId ? (
    <div
      ref={ref}
      className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black"
    >
      <SilentClip
        id={streamId}
        poster={poster || streamPoster(streamId)}
        title={project.title}
        active={active}
        coverScale={project.coverScale}
        className="absolute inset-0"
      />
    </div>
  ) : poster ? (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface">
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  ) : (
    <div className="rounded-xl border border-border px-4 py-5">
      <p className="text-xs text-muted">
        {project.year} · {project.role}
      </p>
      <h2 className="mt-2 tracking-tight">{project.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
    </div>
  );

  const copy =
    poster || streamId ? (
      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[15px] tracking-tight">{project.title}</h2>
          <p className="shrink-0 text-xs text-muted">{project.year}</p>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted">{project.summary}</p>
      </div>
    ) : null;

  const inner = (
    <>
      {media}
      {copy}
    </>
  );

  const className = "group block min-w-0";

  if (!project.href) {
    return <article className="min-w-0">{inner}</article>;
  }

  if (project.external) {
    return (
      <a
        href={project.href}
        className={className}
        target="_blank"
        rel="noreferrer"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={project.href} className={className}>
      {inner}
    </Link>
  );
}
