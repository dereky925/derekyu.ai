"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FadeIn } from "@/components/fade-in";
import { ModelInspector } from "@/components/model-inspector";
import { aboutModels, siteModels, type SiteModel } from "@/lib/models";

const ModelViewer = dynamic(
  () =>
    import("@/components/model-viewer").then((mod) => mod.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-surface sm:aspect-[16/10]" />
    ),
  },
);

type ModelGridProps = {
  /** Tighter tiles on About; roomier on the Models page. */
  compact?: boolean;
  /** Defaults: About → aboutModels; Models page → full catalog. */
  models?: SiteModel[];
};

export function ModelGrid({ compact = false, models }: ModelGridProps) {
  const list = models ?? (compact ? aboutModels : siteModels);
  const [inspecting, setInspecting] = useState<SiteModel | null>(null);

  return (
    <>
      <div
        className={
          compact
            ? "grid grid-cols-2 gap-3 sm:gap-6"
            : "grid gap-6 sm:grid-cols-2 sm:gap-8"
        }
      >
        {list.map((model, index) => (
          <FadeIn
            key={model.src}
            distance={24}
            duration={0.7}
            delay={Math.min(index * 0.05, 0.1)}
          >
            <button
              type="button"
              onClick={() => setInspecting(model)}
              className="group w-full cursor-pointer text-left"
              aria-label={`Inspect ${model.title}`}
            >
              <div className={compact ? "mb-2 sm:mb-3" : "mb-4"}>
                <h3
                  className={
                    compact
                      ? "text-[13px] tracking-tight transition-colors group-hover:text-foreground/80 sm:text-[15px]"
                      : "text-xl tracking-tight transition-colors group-hover:text-foreground/80 sm:text-2xl"
                  }
                >
                  {model.title}
                </h3>
              </div>
              <ModelViewer
                src={model.src}
                rotation={model.rotation ?? [0, 0, 0]}
                zoom={model.zoom ?? 1}
                appearance={model.appearance ?? "default"}
                enableOrbit={false}
                className="aspect-[4/3] w-full rounded-2xl sm:aspect-[16/10]"
              />
            </button>
          </FadeIn>
        ))}
      </div>

      {inspecting ? (
        <ModelInspector
          model={inspecting}
          onClose={() => setInspecting(null)}
        />
      ) : null}
    </>
  );
}
