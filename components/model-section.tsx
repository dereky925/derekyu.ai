"use client";

import dynamic from "next/dynamic";
import { FadeIn } from "@/components/fade-in";

const ModelViewer = dynamic(
  () =>
    import("@/components/model-viewer").then((mod) => mod.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[16/10] animate-pulse rounded-2xl bg-surface" />
    ),
  },
);

export function ModelSection() {
  return (
    <section className="mt-24">
      <FadeIn>
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm text-muted">Models</p>
            <h2 className="mt-2 max-w-xl text-2xl tracking-tight sm:text-3xl">
              A first 3D piece on the site.
            </h2>
          </div>
          <p className="shrink-0 text-xs text-muted">Drag to orbit</p>
        </div>
      </FadeIn>
      <FadeIn distance={24} duration={0.7}>
        <ModelViewer
          src="/media/models/box.glb"
          className="aspect-[16/10] w-full rounded-2xl"
        />
      </FadeIn>
    </section>
  );
}
