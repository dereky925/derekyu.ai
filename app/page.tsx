import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";

export default function Home() {
  const [featured, ...rest] = projects;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <FadeIn>
        <section className="flex min-h-[58vh] flex-col justify-end gap-6 pb-16 pt-28 sm:pt-36">
          <p className="text-sm text-muted">Aerospace engineer</p>
          <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-foreground sm:text-6xl">
            Projects in AR, systems, and games.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            I build things you can see, trade, or play—selected work from
            Grokathon, live trading, and browser games.
          </p>
        </section>
      </FadeIn>

      <section id="work" className="space-y-16 scroll-mt-24">
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
    </main>
  );
}
