"use client";

import { FadeIn } from "@/components/fade-in";
import { ModelGrid } from "@/components/model-grid";

export function ModelsPageContent() {
  return (
    <>
      <FadeIn>
        <p className="text-sm text-muted">Models</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
          Onshape models, no AI used.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          Drag to orbit.
        </p>
      </FadeIn>

      <div className="mt-14">
        <ModelGrid />
      </div>
    </>
  );
}
