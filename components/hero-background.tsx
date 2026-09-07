"use client";

import { useLayoutEffect, useState } from "react";
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

/** Stable for this JS realm so Strict Mode remounts keep the same pick. */
let clientPick: HeroBackgroundId | null = null;

function getClientPick(): HeroBackgroundId {
  if (heroBackgroundMode !== "random") return heroBackgroundMode;
  if (!clientPick) clientPick = pickBackground();
  return clientPick;
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
  // Locked modes can render immediately; random resolves before first paint.
  const [id, setId] = useState<HeroBackgroundId | null>(
    heroBackgroundMode === "random" ? null : heroBackgroundMode,
  );

  useLayoutEffect(() => {
    setId(getClientPick());
  }, []);

  if (!id) {
    return <div className="absolute inset-0 bg-[#050505]" aria-hidden />;
  }

  return <Backdrop id={id} />;
}
