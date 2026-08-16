import Link from "next/link";
import { site, socials } from "@/lib/site";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/photography", label: "Photo" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          {site.name}
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-sm text-muted">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {socials.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
