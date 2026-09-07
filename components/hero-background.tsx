"use client";

import { useEffect, useState } from "react";
import { HeroField } from "@/components/hero-field";
import { HeroPaths } from "@/components/hero-paths";
import {
  heroBackgroundMode,
  heroBackgroundOptions,
  type HeroBackgroundId,
} from "@/lib/hero-background";

function pickBackground(): HeroBackgroundId {
  if (heroBackgroundMode === "random") {
    const i = Math.floor(Math.random() * heroBackgroundOptions.length);
    return heroBackgroundOptions[i]!;
  }
  return heroBackgroundMode;
}

function Backdrop({ id }: { id: HeroBackgroundId }) {
  switch (id) {
    case "damascus":
      return <HeroField />;
    case "paths":
      return <HeroPaths />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

/**
 * Renders the About hero backdrop.
 * Mode is set in `lib/hero-background.ts` (`"random"` | `"damascus"` | `"paths"`).
 */
export function HeroBackground() {
  const [id, setId] = useState<HeroBackgroundId | null>(
    heroBackgroundMode === "random" ? null : heroBackgroundMode,
  );

  useEffect(() => {
    if (heroBackgroundMode === "random") {
      setId(pickBackground());
    }
  }, []);

  // Avoid SSR/client mismatch when randomizing — solid fill until chosen.
  if (!id) {
    return <div className="absolute inset-0 bg-[#050505]" aria-hidden />;
  }

  return <Backdrop id={id} />;
}
