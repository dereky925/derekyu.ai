"use client";

import { FadeIn } from "@/components/fade-in";
import { ModelGrid } from "@/components/model-grid";

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

      <div className="mt-14">
        <ModelGrid />
      </div>
    </>
  );
}
