import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { WorkHistory } from "@/components/work-history";
import { featuredPhotos } from "@/lib/photos";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Aerospace engineering at Anduril and Northrop Grumman, plus selected AR, trading, and game projects by Derek Yu.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const [featured, ...rest] = projects;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <FadeIn>
        <section className="flex flex-col gap-6 pb-16 pt-20 sm:pt-28">
          <p className="text-sm text-muted">Work</p>
          <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-foreground sm:text-6xl">
            Aerospace work, plus things you can see, trade, or play.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            Modeling and simulation at Anduril, earlier rotations at
            Northrop Grumman, and selected personal projects.
          </p>
        </section>
      </FadeIn>

      <section id="experience" className="pb-28">
        <WorkHistory />
      </section>

      <section id="work" className="space-y-16">
        <FadeIn>
          <p className="text-sm text-muted">Projects</p>
          <h2 className="mt-2 text-2xl tracking-tight sm:text-3xl">
            Selected work
          </h2>
        </FadeIn>
        {featured ? (
          <FadeIn>
            <ProjectCard project={featured} featured priority />
          </FadeIn>
        ) : null}

        <div className="grid gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
          {rest.map((project, index) => (
            <FadeIn key={project.slug} delay={Math.min(index * 0.06, 0.18)}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mt-28" id="photo">
        <FadeIn>
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm text-muted">Photography</p>
              <h2 className="mt-2 text-2xl tracking-tight sm:text-3xl">
                Drone stills
              </h2>
            </div>
            <Link
              href="/photography"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {featuredPhotos.map((photo) => (
              <Link
                key={photo.src}
                href="/photography"
                className="relative overflow-hidden rounded-xl bg-surface"
              >
                <Image
                  src={photo.src}
                  alt="Drone photograph by Derek Yu"
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="h-auto w-full"
                />
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
