"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { SiteModel } from "@/lib/models";

const ModelViewer = dynamic(
  () =>
    import("@/components/model-viewer").then((mod) => mod.ModelViewer),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 animate-pulse bg-black" />,
  },
);

type ModelInspectorProps = {
  model: SiteModel;
  onClose: () => void;
};

export function ModelInspector({ model, onClose }: ModelInspectorProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={`${model.title} model viewer`}
    >
      <div className="relative z-20 flex h-16 shrink-0 items-center justify-between px-6 sm:px-10">
        <div>
          <p className="text-sm text-white/50">Models</p>
          <h2 className="text-lg tracking-tight text-white sm:text-xl">
            {model.title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden text-xs text-white/45 sm:block">
            Drag to orbit · Esc to close
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 px-3 pb-3 sm:px-6 sm:pb-6">
        <ModelViewer
          src={model.src}
          rotation={model.rotation ?? [0, 0, 0]}
          zoom={model.zoom ?? 1}
          appearance={model.appearance ?? "default"}
          solidWhite={model.solidWhite}
          forceActive
          enableOrbit
          className="h-full w-full rounded-2xl"
        />
      </div>
    </div>
  );
}
