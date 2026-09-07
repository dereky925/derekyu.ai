"use client";

import { FadeIn } from "@/components/fade-in";
import { ModelGrid } from "@/components/model-grid";

export function ModelSection() {
  return (
    <section className="mt-24">
      <FadeIn>
        <div className="mb-8">
          <p className="text-sm text-muted">Models</p>
          <h2 className="mt-2 max-w-xl text-2xl tracking-tight sm:text-3xl">
            Onshape models, no AI used.
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Click to inspect.{" "}
            <a
              href="/models"
              className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              See all
            </a>
          </p>
        </div>
      </FadeIn>
      <ModelGrid compact />
    </section>
  );
}
