import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { WorkHistory } from "@/components/work-history";
import { projectListings } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Aerospace engineering at Anduril and Northrop Grumman, plus selected AR, trading, and game projects by Derek Yu.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <FadeIn>
        <section className="flex flex-col gap-6 pb-16 pt-20 sm:pt-28">
          <p className="text-sm text-muted">Work</p>
          <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-foreground sm:text-6xl">
            Engineering and selected projects.
          </h1>
        </section>
      </FadeIn>

      <section id="experience" className="pb-24">
        <WorkHistory />
      </section>

      <section id="work" className="space-y-8">
        <FadeIn>
          <h2 className="text-sm text-muted">Projects</h2>
        </FadeIn>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
          {projectListings.map((project, index) => (
            <FadeIn key={project.title} delay={Math.min(index * 0.04, 0.16)}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
