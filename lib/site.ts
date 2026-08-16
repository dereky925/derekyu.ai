export const site = {
  name: "Derek Yu",
  title: "Derek Yu — Projects",
  description:
    "Aerospace engineer building augmented-reality tools, trading systems, and games. Selected project work by Derek Yu.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://derekyu.ai",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  github: "https://github.com/dereky925",
  locale: "en_US",
} as const;

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
