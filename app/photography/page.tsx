import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { PhotoClips } from "@/components/photo-clips";
import { PhotoJournal } from "@/components/photo-journal";
import { photoClips } from "@/lib/photos";
import { photoAlbums } from "@/lib/stills";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Drone photography by Derek Yu — stills and clips from a DJI Mavic 3 Pro, Avata 1, and Avata 2.",
  alternates: { canonical: "/photography" },
};

export default function PhotographyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-20 sm:pt-28">
      <FadeIn>
        <p className="text-sm text-muted">Photography</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
          Aerial stills and clips.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          Drone photography with a DJI Mavic 3 Pro, Avata 1, and Avata 2.
        </p>
      </FadeIn>

      <FadeIn delay={0.06} className="mt-16">
        <h2 className="mb-8 text-2xl tracking-tight sm:text-3xl">Clips</h2>
        <PhotoClips clips={photoClips} />
      </FadeIn>

      <FadeIn delay={0.1} className="mt-20">
        <h2 className="mb-8 text-2xl tracking-tight sm:text-3xl">Stills</h2>
        <PhotoJournal albums={photoAlbums} />
      </FadeIn>
    </main>
  );
}
