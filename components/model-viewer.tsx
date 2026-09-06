"use client";

import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo } from "react";
import { Box3, Vector3 } from "three";

type ModelViewerProps = {
  src: string;
  className?: string;
  autoRotate?: boolean;
  /** Euler radians applied before auto-framing (CAD exports are often sideways). */
  rotation?: [number, number, number];
};

function Model({
  src,
  rotation = [0, 0, 0],
}: {
  src: string;
  rotation?: [number, number, number];
}) {
  // Second arg enables the Draco decoder for compressed GLBs.
  const { scene } = useGLTF(src, true);
  const root = useMemo(() => scene.clone(true), [scene]);
  const { camera, controls } = useThree();

  useLayoutEffect(() => {
    root.rotation.set(rotation[0], rotation[1], rotation[2]);
    root.scale.set(1, 1, 1);
    root.position.set(0, 0, 0);
    root.updateMatrixWorld(true);

    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const longest = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 2.35 / longest;
    root.scale.setScalar(scale);

    const scaled = new Box3().setFromObject(root);
    const center = scaled.getCenter(new Vector3());
    root.position.sub(center);

    // Sit the base near the shadow plane
    const grounded = new Box3().setFromObject(root);
    root.position.y -= grounded.min.y + 0.02;

    const fit = new Box3().setFromObject(root).getSize(new Vector3());
    const radius = Math.max(fit.x, fit.y, fit.z) * 0.75;
    camera.position.set(radius * 0.95, radius * 0.5, radius * 1.15);
    camera.near = radius / 100;
    camera.far = radius * 100;
    camera.lookAt(0, fit.y * 0.4, 0);
    camera.updateProjectionMatrix();

    const orbit = controls as { target?: Vector3; update?: () => void } | null;
    if (orbit?.target) {
      orbit.target.set(0, fit.y * 0.4, 0);
      orbit.update?.();
    }
  }, [camera, controls, root, rotation]);

  return <primitive object={root} />;
}

export function ModelViewer({
  src,
  className = "",
  autoRotate = true,
  rotation = [0, 0, 0],
}: ModelViewerProps) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[3.5, 5, 2.5]}
          intensity={1.55}
          color="#fff4e8"
        />
        <directionalLight
          position={[-2.5, 2, -1.5]}
          intensity={0.55}
          color="#c8d4e8"
        />
        <Suspense fallback={null}>
          <Model src={src} rotation={rotation} />
          {/* Soft outdoor product look — closer to Nest field photography */}
          <Environment preset="warehouse" environmentIntensity={0.55} />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.45}
            scale={6}
            blur={2.6}
            far={3}
          />
        </Suspense>
        <OrbitControls
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={1.05}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/media/models/nst-assembly.glb", true);
