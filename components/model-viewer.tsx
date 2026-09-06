"use client";

import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect } from "react";
import { Box3, Vector3 } from "three";

type ModelViewerProps = {
  src: string;
  className?: string;
  autoRotate?: boolean;
};

function Model({ src }: { src: string }) {
  // Second arg enables the Draco decoder for compressed GLBs.
  const { scene } = useGLTF(src, true);
  const { camera, controls } = useThree();

  useLayoutEffect(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const longest = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 1.6 / longest;
    scene.scale.setScalar(scale);

    const scaled = new Box3().setFromObject(scene);
    const center = scaled.getCenter(new Vector3());
    scene.position.sub(center);

    const fit = new Box3().setFromObject(scene).getSize(new Vector3());
    const radius = Math.max(fit.x, fit.y, fit.z) * 0.75;
    camera.position.set(radius * 1.6, radius * 1.05, radius * 1.85);
    camera.near = radius / 100;
    camera.far = radius * 100;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const orbit = controls as { target?: Vector3; update?: () => void } | null;
    if (orbit?.target) {
      orbit.target.set(0, 0, 0);
      orbit.update?.();
    }
  }, [camera, controls, scene]);

  return <primitive object={scene} />;
}

export function ModelViewer({
  src,
  className = "",
  autoRotate = true,
}: ModelViewerProps) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 2]} intensity={1.4} />
        <directionalLight position={[-2, 1, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <Model src={src} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.4}
            scale={6}
            blur={2.4}
            far={3}
          />
        </Suspense>
        <OrbitControls
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={0.7}
          enablePan={false}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 1.85}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/media/models/box.glb", true);
