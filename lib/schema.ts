import { projects } from "./projects";
import { absoluteUrl, site } from "./site";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: "Aerospace Engineer",
    description: site.description,
    sameAs: [site.github],
    ...(site.email ? { email: site.email } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    author: { "@type": "Person", name: site.name },
  };
}

export function projectJsonLd(slug: string) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return null;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.summary,
    dateCreated: project.year,
    url: absoluteUrl(`/projects/${project.slug}`),
    image: absoluteUrl(project.poster),
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    keywords: project.stack.join(", "),
  };
}
