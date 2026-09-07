/**
 * About-page hero backdrop.
 *
 * - `"damascus"` — WebGL topo / Damascus isolines (`hero-field.tsx`)
 * - `"paths"` — white animated stroke field (`hero-paths.tsx`)
 * - `"random"` — pick damascus or paths on each page load
 */
export type HeroBackgroundId = "damascus" | "paths";

export type HeroBackgroundMode = HeroBackgroundId | "random";

/** Active About hero backdrop mode. */
export const heroBackgroundMode: HeroBackgroundMode = "random";

export const heroBackgroundOptions: HeroBackgroundId[] = [
  "damascus",
  "paths",
];
