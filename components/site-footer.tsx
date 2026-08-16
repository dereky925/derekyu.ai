import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex flex-wrap gap-5">
          <Link href="/" className="transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/work" className="transition-colors hover:text-foreground">
            Work
          </Link>
          <Link
            href="/photography"
            className="transition-colors hover:text-foreground"
          >
            Photo
          </Link>
        </div>
      </div>
    </footer>
  );
}
