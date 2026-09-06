export const navLinks = [
  { href: "/", label: "About", match: (path: string) => path === "/" },
  {
    href: "/work",
    label: "Work",
    match: (path: string) => path === "/work" || path.startsWith("/projects"),
  },
  {
    href: "/models",
    label: "Models",
    match: (path: string) =>
      path === "/models" || path.startsWith("/models/"),
  },
  {
    href: "/photography",
    label: "Photography",
    match: (path: string) =>
      path === "/photography" || path.startsWith("/photography/"),
  },
] as const;
