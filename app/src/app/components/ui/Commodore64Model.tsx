'use client';

import * as THREE from 'three';
import { Suspense, useEffect, useMemo } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { AdaptiveDpr, Environment, Html, OrbitControls, useGLTF, useVideoTexture } from '@react-three/drei';

const SCREEN_INCLUDE_PATTERNS = ['screen', 'monitor_screen', 'object_19'];
const SCREEN_EXCLUDE_PATTERNS = ['frame', 'white', 'black', 'body', 'keyboard', 'detail', 'cable', 'connector', 'plug'];

const getMaterialLabel = (material: THREE.Material | THREE.Material[] | null | undefined) => {
  if (!material) {
    return '';
  }

  if (Array.isArray(material)) {
    return material.map((item) => item.name.toLowerCase()).join(' ');
  }

  return material.name.toLowerCase();
};

const isLikelyFlatScreenGeometry = (geometry: THREE.BufferGeometry) => {
  geometry.computeBoundingBox();

  if (!geometry.boundingBox) {
    return false;
  }

  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  const dims = [size.x, size.y, size.z].sort((a, b) => b - a);

  if (dims[0] <= 0 || dims[1] <= 0) {
    return false;
  }

  const thicknessRatio = dims[2] / dims[0];
  const aspectRatio = dims[1] / dims[0];

  return thicknessRatio < 0.08 && aspectRatio > 0.45 && aspectRatio < 0.9;
};

function SceneModel(props: ThreeElements['group']) {
  const { scene } = useGLTF('/scene.glb');
  const videoTexture = useVideoTexture('/mechiu-gameplay.mp4', {
    loop: true,
    muted: true,
    playsInline: true,
    start: true,
    crossOrigin: 'anonymous',
  });

  const modelScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.flipY = false;
    videoTexture.center.set(0.5, 0.5);
    videoTexture.rotation = Math.PI / 2;
    videoTexture.wrapS = THREE.RepeatWrapping;
    videoTexture.repeat.x = -1;

    const strongCandidates: THREE.Mesh[] = [];
    const fallbackCandidates: Array<{ mesh: THREE.Mesh; area: number }> = [];

    modelScene.traverse((child) => {
      if (!('isMesh' in child) || !child.isMesh) {
        return;
      }

      const mesh = child as THREE.Mesh;
      const meshName = mesh.name.toLowerCase();
      const materialName = getMaterialLabel(mesh.material);
      const combinedLabel = `${meshName} ${materialName}`;
      const hasStrongInclude = SCREEN_INCLUDE_PATTERNS.some((pattern) => combinedLabel.includes(pattern));
      const hasExclude = SCREEN_EXCLUDE_PATTERNS.some((pattern) => combinedLabel.includes(pattern));

      if (hasStrongInclude && !hasExclude) {
        strongCandidates.push(mesh);
        return;
      }

      if (isLikelyFlatScreenGeometry(mesh.geometry)) {
        mesh.geometry.computeBoundingBox();
        const size = new THREE.Vector3();
        mesh.geometry.boundingBox?.getSize(size);
        fallbackCandidates.push({ mesh, area: size.x * size.y });
      }
    });

    const targetMesh =
      strongCandidates[0] ??
      fallbackCandidates.sort((a, b) => b.area - a.area)[0]?.mesh;

    if (!targetMesh) {
      return;
    }

    targetMesh.material = new THREE.MeshBasicMaterial({ map: videoTexture, toneMapped: false });
  }, [modelScene, videoTexture]);

  return (
    <group {...props} dispose={null}>
      <primitive object={modelScene} />
    </group>
  );
}

useGLTF.preload('/scene.glb');

function ModelLoadingFallback() {
  return (
    <Html center>
      <div className="pointer-events-none w-64 rounded-2xl border border-slate-300/70 bg-white/85 p-4 text-center shadow-xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/85">
        <p className="font-heading text-sm font-semibold tracking-[0.08em] text-slate-800 dark:text-slate-100">
          Loading 3D Model
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500 dark:bg-red-400" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500 [animation-delay:140ms] dark:bg-red-400" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500 [animation-delay:280ms] dark:bg-red-400" />
        </div>
        <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">Preparing scene...</p>
      </div>
    </Html>
  );
}

const Commodore64Model = () => {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-white/75 bg-slate-100/80 shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/50">
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [5.2, 2.6, 8.6], fov: 30 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        performance={{ min: 0.55 }}
      >
        <ambientLight intensity={0.58} />
        <directionalLight position={[5, 6, 3]} intensity={1.08} />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <AdaptiveDpr />
        <Suspense fallback={<ModelLoadingFallback />}>
          <SceneModel position={[0, -1.2, 0]} rotation={[0, 0, 0]} scale={0.7} />
          <Environment preset="city" resolution={48} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={6}
          maxDistance={10}
          minPolarAngle={0.7}
          maxPolarAngle={1.6}
        />
      </Canvas>
    </div>
  );
};

export default Commodore64Model;