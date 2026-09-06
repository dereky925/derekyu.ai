"use client";

import dynamic from "next/dynamic";
import { FadeIn } from "@/components/fade-in";

const ModelViewer = dynamic(
  () =>
    import("@/components/model-viewer").then((mod) => mod.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[70vh] animate-pulse rounded-2xl bg-surface sm:aspect-[16/10] sm:min-h-0" />
    ),
  },
);

export function ModelsPageContent() {
  // Onshape export lands upside-down after the upright bake; flip 180° on X.
  const nestUpright: [number, number, number] = [Math.PI, 0, 0];

  return (
    <>
      <FadeIn>
        <p className="text-sm text-muted">Models</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
          CAD you can spin.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          Nest-style assemblies from Onshape, in the browser. Drag any direction
          to orbit — top, sides, and underside.
        </p>
      </FadeIn>

      <FadeIn distance={24} duration={0.7} className="mt-14">
        <ModelViewer
          src="/media/models/nst-assembly.glb"
          rotation={nestUpright}
          className="min-h-[70vh] w-full rounded-2xl sm:aspect-[16/10] sm:min-h-0"
        />
      </FadeIn>
    </>
  );
}
