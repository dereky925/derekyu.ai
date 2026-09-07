export type SiteModel = {
  title: string;
  src: string;
  rotation?: [number, number, number];
  /** >1 frames closer. Default 1. */
  zoom?: number;
  /**
   * Onshape “black” often exports as warm taupe; matte-black remaps that
   * and uses cooler studio lighting so it reads black in the viewer.
   * soft-cad dials lights down for light-grey CAD that otherwise blows out.
   * soft-dim is darker still — used for Models-page-only extras.
   * dim is a light-only step down from default (Nest) — no material remaps.
   * matte-dim is B500-style materials with softer lights (Roadrunner).
   * matte-lift is the same materials with a touch more fill (B100 / B250).
   */
  appearance?:
    | "default"
    | "dim"
    | "matte-black"
    | "matte-dim"
    | "matte-lift"
    | "soft-cad"
    | "soft-dim";
  /** Keep near-white CAD panels solid white instead of remapping to silver. */
  solidWhite?: boolean;
};

/** Nest export needs a 180° X flip after the upright bake. */
const nestUpright: [number, number, number] = [Math.PI, 0, 0];

/** Shown on the About page (2×2). */
export const aboutModels: SiteModel[] = [
  {
    title: "Nest",
    src: "/media/models/nst-assembly-v3.glb",
    rotation: nestUpright,
    appearance: "dim",
  },
  {
    title: "B500",
    src: "/media/models/b500-v3.glb",
    // Original points nose-down; pitch -90° levels it without flipping.
    rotation: [-Math.PI / 2, 0, 0],
    zoom: 1.5,
    appearance: "matte-black",
  },
  {
    title: "Omen",
    src: "/media/models/omen-v3.glb",
    // Flat export → -180° X into flying pose; +180° Y so the nose faces the camera.
    rotation: [-Math.PI, Math.PI, 0],
    zoom: 2.5,
    // Soft CAD lights — light greys blow out under the B500 studio preset.
    appearance: "soft-cad",
  },
  {
    title: "Fury",
    src: "/media/models/fury-v2.glb",
    // Already Y-up in the export; only yaw so the nose faces the camera.
    rotation: [0, Math.PI, 0],
    zoom: 1.3,
    appearance: "soft-cad",
  },
];

/** Extra models only on /models. */
export const modelsPageOnly: SiteModel[] = [
  {
    title: "Wisp",
    src: "/media/models/wisp-v2.glb",
    // Long axis is Z in the export; -90° X stands it vertical.
    rotation: [-Math.PI / 2, 0, 0],
    zoom: 1.05,
    appearance: "matte-black",
    solidWhite: true,
  },
  {
    title: "B250",
    src: "/media/models/b250-v1.glb",
    rotation: [-Math.PI / 2, 0, 0],
    zoom: 1.5,
    appearance: "matte-lift",
  },
  {
    title: "B100",
    src: "/media/models/b100-v1.glb",
    rotation: [-Math.PI / 2, 0, 0],
    zoom: 1.5,
    appearance: "matte-lift",
  },
  {
    title: "Roadrunner",
    src: "/media/models/roadrunner-v4.glb",
    // Long axis is Z in the export; -90° X stands it vertical.
    rotation: [-Math.PI / 2, 0, 0],
    zoom: 1.1,
    appearance: "matte-dim",
    solidWhite: true,
  },
];

/** Full catalog for the Models page. */
export const siteModels: SiteModel[] = [...aboutModels, ...modelsPageOnly];
