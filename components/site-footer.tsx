import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex gap-5">
          <Link href="/photography" className="transition-colors hover:text-foreground">
            Photo
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
