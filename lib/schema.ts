import { projects } from "./projects";
import { absoluteUrl, site } from "./site";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: "Modeling, Simulation & Analysis Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Anduril Industries",
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Purdue University" },
      {
        "@type": "CollegeOrUniversity",
        name: "Stevens Institute of Technology",
      },
      { "@type": "CollegeOrUniversity", name: "University at Buffalo" },
    ],
    description: site.description,
    sameAs: [site.github, site.x, site.linkedin],
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
    image: project.poster.startsWith("http")
      ? project.poster
      : absoluteUrl(project.poster),
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    keywords: project.stack.join(", "),
  };
}
