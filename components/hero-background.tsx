"use client";

import { HeroField } from "@/components/hero-field";
import { heroBackground } from "@/lib/hero-background";

/**
 * Renders the configured About hero backdrop.
 * Damascus lives in `hero-field.tsx` — set `heroBackground` in
 * `lib/hero-background.ts` to `"damascus"` to restore it.
 */
export function HeroBackground() {
  switch (heroBackground) {
    case "damascus":
      return <HeroField />;
    default: {
      const _exhaustive: never = heroBackground;
      return _exhaustive;
    }
  }
}
