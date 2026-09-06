"use client";

import dynamic from "next/dynamic";
import { FadeIn } from "@/components/fade-in";

const ModelViewer = dynamic(
  () =>
    import("@/components/model-viewer").then((mod) => mod.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[55vh] animate-pulse rounded-2xl bg-surface sm:aspect-[16/10] sm:min-h-0" />
    ),
  },
);

const nestUpright: [number, number, number] = [Math.PI, 0, 0];

const models = [
  {
    title: "NST Assembly",
    detail: "Nest-style assembly from Onshape.",
    src: "/media/models/nst-assembly-v2.glb",
    rotation: nestUpright,
  },
  {
    title: "B500",
    detail: "From Onshape.",
    src: "/media/models/b500.glb",
  },
] as const;

export function ModelsPageContent() {
  return (
    <>
      <FadeIn>
        <p className="text-sm text-muted">Models</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
          CAD you can spin.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          Assemblies from Onshape, in the browser. Drag any direction to orbit —
          top, sides, and underside.
        </p>
      </FadeIn>

      <div className="mt-14 space-y-16">
        {models.map((model, index) => (
          <FadeIn key={model.src} distance={24} duration={0.7} delay={index * 0.04}>
            <div className="mb-4 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-xl tracking-tight sm:text-2xl">{model.title}</h2>
                <p className="mt-1 text-sm text-muted">{model.detail}</p>
              </div>
              <p className="shrink-0 text-xs text-muted">Drag to orbit</p>
            </div>
            <ModelViewer
              src={model.src}
              rotation={"rotation" in model ? [...model.rotation] : [0, 0, 0]}
              className="min-h-[55vh] w-full rounded-2xl sm:aspect-[16/10] sm:min-h-0"
            />
          </FadeIn>
        ))}
      </div>
    </>
  );
}
