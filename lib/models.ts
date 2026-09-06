export type SiteModel = {
  title: string;
  src: string;
  rotation?: [number, number, number];
  /** >1 frames closer. Default 1. */
  zoom?: number;
  /**
   * Onshape “black” often exports as warm taupe; matte-black remaps that
   * and uses cooler studio lighting so it reads black in the viewer.
   */
  appearance?: "default" | "matte-black";
};

/** Nest export needs a 180° X flip after the upright bake. */
const nestUpright: [number, number, number] = [Math.PI, 0, 0];

export const siteModels: SiteModel[] = [
  {
    title: "Nest",
    src: "/media/models/nst-assembly-v2.glb",
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
    src: "/media/models/omen-v1.glb",
    // Onshape export lies flat; pitch -90° stands it up.
    rotation: [-Math.PI / 2, 0, 0],
  },
];
