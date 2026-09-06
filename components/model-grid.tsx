"use client";

import dynamic from "next/dynamic";
import { FadeIn } from "@/components/fade-in";
import { siteModels } from "@/lib/models";

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
};

export function ModelGrid({ compact = false }: ModelGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
      {siteModels.map((model, index) => (
        <FadeIn
          key={model.src}
          distance={24}
          duration={0.7}
          delay={Math.min(index * 0.05, 0.1)}
        >
          <div className={compact ? "mb-3" : "mb-4"}>
            <div className="flex items-baseline justify-between gap-3">
              <h3
                className={
                  compact
                    ? "text-[15px] tracking-tight"
                    : "text-xl tracking-tight sm:text-2xl"
                }
              >
                {model.title}
              </h3>
              <p className="shrink-0 text-xs text-muted">Drag to orbit</p>
            </div>
            <p className="mt-1 text-sm text-muted">{model.detail}</p>
          </div>
          <ModelViewer
            src={model.src}
            rotation={model.rotation ?? [0, 0, 0]}
            className={
              compact
                ? "aspect-[4/3] w-full rounded-2xl sm:aspect-[16/10]"
                : "aspect-[4/3] w-full rounded-2xl sm:aspect-[16/10]"
            }
          />
        </FadeIn>
      ))}
    </div>
  );
}
