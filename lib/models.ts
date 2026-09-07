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
   */
  appearance?: "default" | "matte-black" | "soft-cad";
};

/** Nest export needs a 180° X flip after the upright bake. */
const nestUpright: [number, number, number] = [Math.PI, 0, 0];

export const siteModels: SiteModel[] = [
  {
    title: "Nest",
    src: "/media/models/nst-assembly-v3.glb",
    rotation: nestUpright,
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
    src: "/media/models/fury-v1.glb",
    // Same flying framing as Omen.
    rotation: [-Math.PI, Math.PI, 0],
    zoom: 2.5,
    appearance: "soft-cad",
  },
];
