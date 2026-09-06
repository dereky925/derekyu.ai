import type { Metadata } from "next";
import { HighlightRows } from "@/components/highlight-rows";
import { HomeHero } from "@/components/home-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: site.name,
  },
  description: "Aerospace Engineering, Aerial Photography, Coding Projects",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <HomeHero />
      <HighlightRows />
    </main>
  );
}
