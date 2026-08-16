import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { site, socials } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: site.name,
  },
  description:
    "Derek Yu is an aerospace engineer working on augmented reality, trading systems, games, and drone photography.",
  alternates: { canonical: "/" },
};

const experience = [
  {
    period: "2026",
    title: "GrokEye",
    href: "/projects/grokeye",
    detail:
      "AR coaching with Grok vision, voice, and on-frame overlays. Grokathon 2026.",
  },
  {
    period: "2026",
    title: "Claude Coin",
    href: "/projects/claudecode",
    detail:
      "Alpaca momentum bot with an optional Gemini + Tavily news layer and Telegram control.",
  },
  {
    period: "2025",
    title: "Games",
    href: "/work",
    detail: "Browser canvases: To Mars and Beyond, Flappy Fury.",
  },
  {
    period: "—",
    title: "Drone photography",
    href: "/photography",
    detail: "Mavic 3 Pro, Avata 1, and Avata 2 stills and clips.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-24 pt-20 sm:pt-28">
      <FadeIn>
        <p className="text-sm text-muted">About</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
          {site.name}
        </h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Aerospace engineer. I like systems that have to work in the
            real world: a camera pointed at a bench, a strategy that only
            fires in market hours, a game that still runs at 60fps on a
            phone, a drone frame that has to hold still.
          </p>
          <p>
            Recent work sits at the overlap of vision models, trading
            infrastructure, small interactive worlds, and aerial
            photography. This site is the public set.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <h2 className="mt-16 text-sm text-muted">Selected work</h2>
        <ul className="mt-6 divide-y divide-border">
          {experience.map((item) => (
            <li
              key={item.title}
              className="grid grid-cols-[4.5rem_1fr] gap-6 py-5 sm:grid-cols-[6rem_1fr]"
            >
              <p className="text-sm text-muted">{item.period}</p>
              <div>
                <Link
                  href={item.href}
                  className="text-foreground transition-opacity hover:opacity-70"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn delay={0.12}>
        <h2 className="mt-16 text-sm text-muted">Contact</h2>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <a
            href={`mailto:${site.email}`}
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {site.email}
          </a>
          {socials.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </FadeIn>
    </main>
  );
}
