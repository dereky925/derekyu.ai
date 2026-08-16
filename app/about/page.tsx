import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Derek Yu is an aerospace engineer working on augmented reality, trading systems, and games.",
  alternates: { canonical: "/about" },
};

const experience = [
  {
    period: "2026",
    title: "GrokEye",
    detail: "AR coaching with Grok vision, voice, and on-frame overlays. Grokathon 2026.",
  },
  {
    period: "2026",
    title: "Claude Coin",
    detail: "Alpaca momentum bot with an optional Gemini + Tavily news layer and Telegram control.",
  },
  {
    period: "2025",
    title: "Games",
    detail: "Browser canvases: To Mars and Beyond, Flappy Fury.",
  },
];

export default function AboutPage() {
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
            phone.
          </p>
          <p>
            Recent work sits at the overlap of vision models, trading
            infrastructure, and small interactive worlds. This site is
            the public set.
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
                <p className="text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="mt-14 flex flex-wrap gap-6 text-sm">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            GitHub
          </a>
          {site.email ? (
            <a
              href={`mailto:${site.email}`}
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {site.email}
            </a>
          ) : null}
        </div>
      </FadeIn>
    </main>
  );
}
