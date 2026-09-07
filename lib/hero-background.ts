/**
 * About-page hero backdrop.
 *
 * - `"random"` — pick Damascus or Paths once per page load (client-side)
 * - `"damascus"` — topographic isoline WebGL field
 * - `"paths"` — white animated SVG strokes
 */
export type HeroBackgroundId = "damascus" | "paths";

export type HeroBackgroundMode = "random" | HeroBackgroundId;

/** Active mode. Use `"damascus"` or `"paths"` to lock one; `"random"` to alternate. */
export const heroBackgroundMode: HeroBackgroundMode = "random";

export const heroBackgroundOptions: HeroBackgroundId[] = ["damascus", "paths"];
