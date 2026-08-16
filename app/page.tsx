import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { HomeClipCard, HomeClipStrip } from "@/components/home-clips";
import { HomeHero } from "@/components/home-hero";
import { photoClips } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: site.name,
  },
  description:
    "Derek Yu is a modeling and simulation engineer at Anduril, with drone photography, AR, and public software projects.",
  alternates: { canonical: "/" },
};

const now = [
  { label: "Now", value: "Modeling & simulation at Anduril" },
  { label: "Where", value: "Costa Mesa, California" },
  { label: "Before", value: "Northrop Grumman" },
  { label: "Air", value: "Part 107 · Mavic · Avata" },
];

const stripClips = [photoClips[1]!, photoClips[7]!, photoClips[8]!];
const photographyClip = photoClips[6]!;

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <HomeHero />

      <FadeIn distance={28} duration={0.8}>
        <dl className="mt-20 grid gap-8 border-y border-border py-10 sm:grid-cols-2 lg:grid-cols-4">
          {now.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed">{item.value}</dd>
            </div>
          ))}
        </dl>
      </FadeIn>

      <FadeIn distance={28} duration={0.8}>
        <p className="mt-16 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Days are modeling and simulation for Air Dominance &amp; Strike.
          The public set is GrokEye, a live trading bot, two canvas games,
          and drone footage from Arizona to the California coast.
        </p>
      </FadeIn>

      <section className="mt-24 grid gap-10 md:grid-cols-2 md:gap-8">
        <FadeIn distance={32} duration={0.85}>
          <Link href="/work" className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface">
              <Image
                src="/media/projects/grokeye/poster.jpg"
                alt="GrokEye overlay on an espresso bar"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
            <h2 className="mt-4 text-lg tracking-tight">Work</h2>
            <p className="mt-1 text-sm text-muted">
              Anduril, Northrop, and the public projects.
            </p>
          </Link>
        </FadeIn>
        <HomeClipCard
          href="/photography"
          title="Photography"
          detail="Aerial stills and clips from Arizona and California."
          clip={photographyClip}
        />
      </section>

      <section className="mt-24">
        <FadeIn>
          <div className="mb-6 flex items-end justify-between gap-6">
            <p className="text-sm text-muted">From the air</p>
            <Link
              href="/photography"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              All photography
            </Link>
          </div>
        </FadeIn>
        <HomeClipStrip clips={stripClips} />
      </section>
    </main>
  );
}
