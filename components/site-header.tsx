"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "About", match: (path: string) => path === "/" },
  {
    href: "/work",
    label: "Work",
    match: (path: string) => path === "/work" || path.startsWith("/projects"),
  },
  {
    href: "/photography",
    label: "Photography",
    match: (path: string) => path === "/photography" || path.startsWith("/photography/"),
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/40 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          {site.name}
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 text-sm">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
