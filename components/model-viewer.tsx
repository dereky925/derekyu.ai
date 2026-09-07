"use client";

import {
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box3,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";

export type ModelAppearance =
  | "default"
  | "matte-black"
  | "matte-dim"
  | "matte-lift"
  | "soft-cad"
  | "soft-dim";

type ModelViewerProps = {
  src: string;
  className?: string;
  autoRotate?: boolean;
  /** Euler radians applied before auto-framing (CAD exports are often sideways). */
  rotation?: [number, number, number];
  /** >1 frames closer. Default 1. */
  zoom?: number;
  appearance?: ModelAppearance;
  /** When false, auto-rotate only — clicks pass through to the parent. */
  enableOrbit?: boolean;
  /** Keep the canvas running even when offscreen (inspector overlay). */
  forceActive?: boolean;
};

function colorNear(
  mat: MeshStandardMaterial,
  r: number,
  g: number,
  b: number,
  eps = 0.02,
) {
  return (
    Math.abs(mat.color.r - r) < eps &&
    Math.abs(mat.color.g - g) < eps &&
    Math.abs(mat.color.b - b) < eps
  );
}

/** Remap Onshape export greys that read as white/brown under PBR lights. */
function applyMatteBlack(root: Object3D) {
  root.traverse((obj) => {
    if (!(obj as Mesh).isMesh) return;
    const materials = Array.isArray((obj as Mesh).material)
      ? ((obj as Mesh).material as MeshStandardMaterial[])
      : [(obj as Mesh).material as MeshStandardMaterial];

    for (const mat of materials) {
      if (!(mat instanceof MeshStandardMaterial)) continue;

      // Primary body: warm taupe → matte charcoal black
      if (
        colorNear(mat, 0.301961, 0.290196, 0.262745) ||
        colorNear(mat, 0.4, 0.388235, 0.34902) ||
        colorNear(mat, 0.501961, 0.486275, 0.439216)
      ) {
        mat.color.setRGB(0.035, 0.035, 0.038);
        mat.roughness = Math.max(mat.roughness ?? 0.5, 0.78);
        mat.metalness = Math.min(mat.metalness ?? 0, 0.12);
        mat.envMapIntensity = 0.35;
      }
      // Mid / dark CAD greys → charcoal
      else if (
        colorNear(mat, 0.647059, 0.647059, 0.647059) ||
        colorNear(mat, 0.160784, 0.160784, 0.160784) ||
        colorNear(mat, 0.301961, 0.301961, 0.301961)
      ) {
        mat.color.setRGB(0.1, 0.1, 0.105);
        mat.roughness = Math.max(mat.roughness ?? 0.5, 0.7);
        mat.envMapIntensity = 0.35;
      }
      // Near-white fasteners → soft metal grey
      else if (
        colorNear(mat, 0.901961, 0.901961, 0.901961) ||
        colorNear(mat, 0.917647, 0.917647, 0.917647) ||
        colorNear(mat, 0.8, 0.8, 0.8)
      ) {
        mat.color.setRGB(0.22, 0.22, 0.23);
        mat.metalness = Math.max(mat.metalness ?? 0, 0.45);
        mat.roughness = Math.min(mat.roughness ?? 0.5, 0.45);
      }
      // Onshape “red” that reads orange under studio lights → true red
      else if (colorNear(mat, 1, 0.266667, 0.043137, 0.04)) {
        mat.color.setRGB(0.9, 0.04, 0.06);
        mat.roughness = Math.max(mat.roughness ?? 0.5, 0.55);
        mat.metalness = Math.min(mat.metalness ?? 0, 0.1);
        mat.envMapIntensity = 0.25;
      }
      // Hot yellow-green accents (Roadrunner) — keep hue, cut glare
      else if (mat.color.r > 0.75 && mat.color.g > 0.85 && mat.color.b < 0.15) {
        mat.roughness = Math.max(mat.roughness ?? 0.5, 0.65);
        mat.envMapIntensity = 0.2;
      }
    }
  });
}

/** Soften CAD greys so light panels don’t blow out under studio HDR. */
function applySoftCad(root: Object3D) {
  root.traverse((obj) => {
    if (!(obj as Mesh).isMesh) return;
    const materials = Array.isArray((obj as Mesh).material)
      ? ((obj as Mesh).material as MeshStandardMaterial[])
      : [(obj as Mesh).material as MeshStandardMaterial];

    for (const mat of materials) {
      if (!(mat instanceof MeshStandardMaterial)) continue;
      mat.metalness = Math.min(mat.metalness ?? 0, 0.08);
      mat.roughness = Math.max(mat.roughness ?? 0.5, 0.72);
      mat.envMapIntensity = 0.15;
      // Pull near-white Onshape greys down so they stay readable
      if (mat.color.r > 0.85 && mat.color.g > 0.85 && mat.color.b > 0.85) {
        mat.color.multiplyScalar(0.72);
      }
    }
  });
}

function Model({
  src,
  rotation = [0, 0, 0],
  zoom = 1,
  appearance = "default",
}: {
  src: string;
  rotation?: [number, number, number];
  zoom?: number;
  appearance?: ModelAppearance;
}) {
  // Second arg enables the Draco decoder for compressed GLBs.
  const { scene } = useGLTF(src, true);
  const root = useMemo(() => {
    const cloned = scene.clone(true);
    // Clone materials so remaps don't mutate the useGLTF cache.
    cloned.traverse((obj) => {
      if (!(obj as Mesh).isMesh) return;
      const mesh = obj as Mesh;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();
    });
    if (appearance === "matte-black" || appearance === "matte-dim" || appearance === "matte-lift") {
      applyMatteBlack(cloned);
    }
    if (appearance === "soft-cad" || appearance === "soft-dim") {
      applySoftCad(cloned);
    }
    return cloned;
  }, [appearance, scene]);
  const { camera, controls } = useThree();

  useLayoutEffect(() => {
    root.rotation.set(rotation[0], rotation[1], rotation[2]);
    root.scale.set(1, 1, 1);
    root.position.set(0, 0, 0);
    root.updateMatrixWorld(true);

    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const longest = Math.max(size.x, size.y, size.z, 0.001);
    // Keep model size fixed; zoom only pulls the camera in (scaling both cancels out).
    root.scale.setScalar(2.35 / longest);

    const scaled = new Box3().setFromObject(root);
    const center = scaled.getCenter(new Vector3());
    root.position.sub(center);

    // Sit the base near the shadow plane
    const grounded = new Box3().setFromObject(root);
    root.position.y -= grounded.min.y + 0.02;

    const fit = new Box3().setFromObject(root).getSize(new Vector3());
    const radius = Math.max(fit.x, fit.y, fit.z) * 0.75;
    const dist = 1 / Math.max(zoom, 0.01);
    camera.position.set(
      radius * 0.95 * dist,
      radius * 0.5 * dist,
      radius * 1.15 * dist,
    );
    camera.near = (radius * dist) / 100;
    camera.far = radius * 100;
    camera.lookAt(0, fit.y * 0.4, 0);
    camera.updateProjectionMatrix();

    const orbit = controls as { target?: Vector3; update?: () => void } | null;
    if (orbit?.target) {
      orbit.target.set(0, fit.y * 0.4, 0);
      orbit.update?.();
    }
  }, [camera, controls, root, rotation, zoom]);

  return <primitive object={root} />;
}

function useInView(rootMargin = "120px", enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setInView(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0.05 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [enabled, rootMargin]);

  return { ref, inView: enabled ? inView : true };
}

export function ModelViewer({
  src,
  className = "",
  autoRotate = true,
  rotation = [0, 0, 0],
  zoom = 1,
  appearance = "default",
  enableOrbit = true,
  forceActive = false,
}: ModelViewerProps) {
  const matte = appearance === "matte-black";
  const matteDim = appearance === "matte-dim";
  const matteLift = appearance === "matte-lift";
  const soft = appearance === "soft-cad";
  const softDim = appearance === "soft-dim";
  const dim = softDim || matteDim;
  const cool = matte || matteDim || matteLift || soft || softDim;
  const { ref, inView } = useInView("120px", !forceActive);
  const active = forceActive || inView;
  // Mount once visible so scroll-away can freeze the loop without remounting.
  const [mounted, setMounted] = useState(forceActive);
  useEffect(() => {
    if (active) setMounted(true);
  }, [active]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-black ${className}`}
    >
      {mounted ? (
        <Canvas
          dpr={forceActive ? [1, 1.5] : [1, 1.25]}
          frameloop={active ? "always" : "never"}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          performance={{ min: 0.5 }}
          style={enableOrbit ? undefined : { pointerEvents: "none" }}
        >
          <color attach="background" args={["#050505"]} />
          <ambientLight
            intensity={
              matteLift
                ? 0.28
                : matteDim
                  ? 0.16
                  : softDim
                    ? 0.14
                    : soft
                      ? 0.2
                      : matte
                        ? 0.22
                        : 0.4
            }
          />
          <directionalLight
            position={[3.5, 5, 2.5]}
            intensity={
              matteLift
                ? 1.35
                : matteDim
                  ? 0.7
                  : softDim
                    ? 0.22
                    : soft
                      ? 0.32
                      : matte
                        ? 1.15
                        : 1.55
            }
            color={cool ? "#f2f4f7" : "#fff4e8"}
          />
          <directionalLight
            position={[-2.5, 2, -1.5]}
            intensity={
              matteLift
                ? 0.5
                : matteDim
                  ? 0.25
                  : softDim
                    ? 0.1
                    : soft
                      ? 0.14
                      : matte
                        ? 0.4
                        : 0.55
            }
            color={cool ? "#d8dde8" : "#c8d4e8"}
          />
          <Suspense fallback={null}>
            <Model
              src={src}
              rotation={rotation}
              zoom={zoom}
              appearance={appearance}
            />
            <Environment
              preset={cool ? "studio" : "warehouse"}
              environmentIntensity={
                matteLift
                  ? 0.3
                  : matteDim
                    ? 0.12
                    : softDim
                      ? 0.04
                      : soft
                        ? 0.07
                        : matte
                          ? 0.22
                          : 0.55
              }
            />
          </Suspense>
          <OrbitControls
            makeDefault
            autoRotate={autoRotate && active}
            autoRotateSpeed={0.85}
            enablePan={false}
            enableRotate={enableOrbit}
            enableZoom={enableOrbit}
          />
        </Canvas>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-[#0a0a0a]" />
      )}
    </div>
  );
}
