export const site = {
  name: "Derek Yu",
  title: "Derek Yu",
  description:
    "Aerospace Engineering, Aerial Photography, Coding Projects",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://derekyu.ai",
  email: process.env.NEXT_PUBLIC_EMAIL || "dereky925@gmail.com",
  github: "https://github.com/dereky925",
  cursor: "https://cursor.com/@dereky925",
  x: "https://x.com/dyu925",
  linkedin: "https://www.linkedin.com/in/dereky925/",
  locale: "en_US",
} as const;

export const socials = [
  { label: "GitHub", href: site.github },
  { label: "Cursor", href: site.cursor },
  { label: "X", href: site.x },
  { label: "LinkedIn", href: site.linkedin },
] as const;

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
