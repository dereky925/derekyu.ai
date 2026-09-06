export type SiteModel = {
  title: string;
  detail: string;
  src: string;
  rotation?: [number, number, number];
};

/** Nest export needs a 180° X flip after the upright bake. */
const nestUpright: [number, number, number] = [Math.PI, 0, 0];

export const siteModels: SiteModel[] = [
  {
    title: "NST Assembly",
    detail: "Nest-style assembly from Onshape.",
    src: "/media/models/nst-assembly-v2.glb",
    rotation: nestUpright,
  },
  {
    title: "B500",
    detail: "From Onshape.",
    src: "/media/models/b500-v2.glb",
  },
];
