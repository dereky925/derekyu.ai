"use client";

import { FadeIn } from "@/components/fade-in";
import { ModelGrid } from "@/components/model-grid";

export function ModelsPageContent() {
  return (
    <>
      <FadeIn>
        <p className="text-sm text-muted">Models</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
          Onshape Models, no AI used.
        </h1>
      </FadeIn>

      <div className="mt-14">
        <ModelGrid />
      </div>
    </>
  );
}
