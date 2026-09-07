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

/**
 * Renders the configured About hero backdrop.
 * Set `heroBackgroundMode` in `lib/hero-background.ts` to `"damascus"`,
 * `"paths"`, or `"random"`.
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

  // Avoid flashing the wrong backdrop before the random pick.
  if (!id) {
    return <div className="absolute inset-0 bg-[#050505]" aria-hidden />;
  }

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
