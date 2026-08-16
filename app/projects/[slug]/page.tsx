import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/fade-in";
import { JsonLd } from "@/components/json-ld";
import { VideoPlayer } from "@/components/video-player";
import { getProject, getProjectSlugs, projects } from "@/lib/projects";
import { projectJsonLd } from "@/lib/schema";
import { absoluteUrl, site } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const url = absoluteUrl(`/projects/${project.slug}`);

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} · ${site.name}`,
      description: project.summary,
      images: [{ url: project.poster }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · ${site.name}`,
      description: project.summary,
      images: [project.poster],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const jsonLd = projectJsonLd(project.slug);
  const more = projects.filter((item) => item.slug !== project.slug).slice(0, 2);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-16 sm:pt-24">
      {jsonLd ? <JsonLd data={jsonLd} /> : null}

      <FadeIn>
        <p className="text-sm text-muted">
          {project.year} · {project.role}
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          {project.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.06} className="mt-12">
        <VideoPlayer
          poster={project.poster}
          title={project.title}
          video={project.video}
        />
      </FadeIn>

      <FadeIn delay={0.08}>
        <dl className="mt-16 grid gap-10 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted">Problem</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-foreground/90">
              {project.problem}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Approach</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-foreground/90">
              {project.approach}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Outcome</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-foreground/90">
              {project.outcome}
            </dd>
          </div>
        </dl>
      </FadeIn>

      {project.gallery.length > 0 ? (
        <FadeIn delay={0.1}>
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface"
              >
                <Image
                  src={src}
                  alt={`${project.title} still`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.12}>
        <p className="mt-12 text-sm text-muted">Stack</p>
        <p className="mt-2 text-sm text-foreground/80">{project.stack.join(" · ")}</p>
      </FadeIn>

      {more.length > 0 ? (
        <nav className="mt-20 border-t border-border pt-10">
          <p className="text-sm text-muted">More work</p>
          <ul className="mt-4 space-y-3">
            {more.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/projects/${item.slug}`}
                  className="text-foreground transition-opacity hover:opacity-70"
                >
                  {item.title}
                  <span className="ml-2 text-sm text-muted">{item.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </main>
  );
}
