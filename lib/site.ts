export const site = {
  name: "Derek Yu",
  title: "Derek Yu — Projects",
  description:
    "Aerospace engineer building augmented-reality tools, trading systems, and games — plus drone photography. Selected work by Derek Yu.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://derekyu.ai",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  github: "https://github.com/dereky925",
  x: "https://x.com/dyu925",
  linkedin: "https://www.linkedin.com/in/dereky925/",
  locale: "en_US",
} as const;

export const socials = [
  { label: "GitHub", href: site.github },
  { label: "X", href: site.x },
  { label: "LinkedIn", href: site.linkedin },
] as const;

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
