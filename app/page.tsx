import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { HighlightRows } from "@/components/highlight-rows";
import { HomeHero } from "@/components/home-hero";
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

      <HighlightRows />
    </main>
  );
}
