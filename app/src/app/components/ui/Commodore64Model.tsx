'use client';

import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, ThreeElements, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Environment, Html, OrbitControls, useGLTF, useVideoTexture } from '@react-three/drei';

const SCREEN_INCLUDE_PATTERNS = ['screen', 'monitor_screen', 'object_19'];
const SCREEN_EXCLUDE_PATTERNS = ['frame', 'white', 'black', 'body', 'keyboard', 'detail', 'cable', 'connector', 'plug'];

type QualityTier = 'low' | 'balanced' | 'high';

type Commodore64ModelProps = {
  isActive?: boolean;
};

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
};

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

const resolveQualityTier = (): QualityTier => {
  if (typeof window === 'undefined') {
    return 'balanced';
  }

  const nav = navigator as NavigatorWithHints;
  const connection = nav.connection;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = connection?.saveData ?? false;
  const hasSlowNetwork = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
  const memory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined;
  const cores = nav.hardwareConcurrency ?? 4;

  if (prefersReducedMotion || saveData || hasSlowNetwork) {
    return 'low';
  }

  if (hasCoarsePointer && (cores <= 4 || (typeof memory === 'number' && memory <= 4))) {
    return 'low';
  }

  if (hasCoarsePointer) {
    return 'balanced';
  }

  if (cores >= 8 && (typeof memory !== 'number' || memory >= 8)) {
    return 'high';
  }

  return 'balanced';
};

const useQualityTier = () => {
  const [qualityTier, setQualityTier] = useState<QualityTier>(() => resolveQualityTier());

  useEffect(() => {
    setQualityTier(resolveQualityTier());
  }, []);

  return qualityTier;
};

type SceneModelProps = ThreeElements['group'] & {
  qualityTier: QualityTier;
  isActive: boolean;
};

function SceneControls({ enabled }: { enabled: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  return (
    <OrbitControls
      enablePan={false}
      enableZoom
      minDistance={6}
      maxDistance={10}
      minPolarAngle={0.7}
      maxPolarAngle={1.6}
      enabled={enabled}
      onChange={() => invalidate()}
      onEnd={() => invalidate()}
    />
  );
}

function SceneModel({ qualityTier, isActive, ...props }: SceneModelProps) {
  const { scene } = useGLTF('/scene.glb');
  const invalidate = useThree((state) => state.invalidate);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const videoInvalidationIntervalMs = qualityTier === 'low' ? 96 : qualityTier === 'balanced' ? 50 : 33;
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
    videoTexture.generateMipmaps = false;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
  }, [videoTexture]);

  useEffect(() => {
    let rafId: number | null = null;

    const resolveVideoElement = () => {
      const maybeVideo = videoTexture.image;

      if (maybeVideo instanceof HTMLVideoElement) {
        setVideoElement(maybeVideo);
        return;
      }

      rafId = window.requestAnimationFrame(resolveVideoElement);
    };

    resolveVideoElement();

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [videoTexture]);

  useEffect(() => {
    if (!videoElement) {
      return;
    }

    const video = videoElement;

    video.preload = qualityTier === 'low' ? 'metadata' : 'auto';
    video.disablePictureInPicture = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    let lastPlayPromise: Promise<void> | undefined;

    const tryPlay = () => {
      const playPromise = video.play();

      if (playPromise) {
        lastPlayPromise = playPromise.then(() => undefined).catch(() => undefined);
      }
    };

    if (isActive && !document.hidden) {
      tryPlay();
      invalidate();
    } else {
      video.pause();
    }

    const handleVisibilityChange = () => {
      if (document.hidden || !isActive) {
        video.pause();
        return;
      }

      tryPlay();
      invalidate();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (lastPlayPromise) {
        void lastPlayPromise.finally(() => {
          video.pause();
        });
        return;
      }

      video.pause();
    };
  }, [isActive, invalidate, qualityTier, videoElement]);

  useEffect(() => {
    if (!videoElement || !isActive) {
      return;
    }

    const video = videoElement;
    let rafId: number | null = null;
    let videoFrameId: number | null = null;
    let lastTick = 0;

    const videoWithCallbacks = video as HTMLVideoElement & {
      requestVideoFrameCallback?: (callback: (now: number) => void) => number;
      cancelVideoFrameCallback?: (handle: number) => void;
    };

    if (typeof videoWithCallbacks.requestVideoFrameCallback === 'function') {
      const onVideoFrame = (now: number) => {
        if (now - lastTick >= videoInvalidationIntervalMs) {
          lastTick = now;
          invalidate();
        }

        if (!video.paused && !video.ended) {
          videoFrameId = videoWithCallbacks.requestVideoFrameCallback?.(onVideoFrame) ?? null;
        }
      };

      videoFrameId = videoWithCallbacks.requestVideoFrameCallback(onVideoFrame);
    } else {
      const onAnimationFrame = (now: number) => {
        if (now - lastTick >= videoInvalidationIntervalMs) {
          lastTick = now;
          invalidate();
        }

        if (!video.paused && !video.ended) {
          rafId = window.requestAnimationFrame(onAnimationFrame);
        }
      };

      rafId = window.requestAnimationFrame(onAnimationFrame);
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      if (videoFrameId !== null && typeof videoWithCallbacks.cancelVideoFrameCallback === 'function') {
        videoWithCallbacks.cancelVideoFrameCallback(videoFrameId);
      }
    };
  }, [invalidate, isActive, videoElement, videoInvalidationIntervalMs]);

  useEffect(() => {
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

    const nextMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, toneMapped: false });
    targetMesh.material = nextMaterial;
    invalidate();

    return () => {
      nextMaterial.dispose();
    };
  }, [invalidate, modelScene, videoTexture]);

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

const Commodore64Model = ({ isActive = true }: Commodore64ModelProps) => {
  const qualityTier = useQualityTier();

  const dprRange: [number, number] =
    qualityTier === 'high' ? [1, 1.25] : qualityTier === 'balanced' ? [0.82, 1.05] : [0.65, 0.85];

  const canvasMinPerformance = qualityTier === 'high' ? 0.55 : qualityTier === 'balanced' ? 0.45 : 0.35;
  const environmentResolution = qualityTier === 'high' ? 48 : 24;

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-white/75 bg-slate-100/80 shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/50">
      <Canvas
        frameloop={isActive ? 'demand' : 'never'}
        dpr={dprRange}
        camera={{ position: [5.2, 2.6, 8.6], fov: 30 }}
        gl={{ antialias: qualityTier === 'high', powerPreference: qualityTier === 'low' ? 'low-power' : 'high-performance' }}
        performance={{ min: canvasMinPerformance }}
      >
        {qualityTier === 'low' ? (
          <>
            <ambientLight intensity={0.78} />
            <hemisphereLight args={['#dbeafe', '#111827', 0.56]} />
          </>
        ) : (
          <>
            <ambientLight intensity={0.58} />
            <directionalLight position={[5, 6, 3]} intensity={1.08} />
            <directionalLight position={[-4, 2, -3]} intensity={qualityTier === 'high' ? 0.4 : 0.24} />
          </>
        )}
        <AdaptiveDpr pixelated />
        <Suspense fallback={<ModelLoadingFallback />}>
          <SceneModel qualityTier={qualityTier} isActive={isActive} position={[0, -1.2, 0]} rotation={[0, 0, 0]} scale={0.7} />
          {qualityTier !== 'low' ? <Environment preset="city" resolution={environmentResolution} /> : null}
        </Suspense>
        <SceneControls enabled={isActive} />
      </Canvas>
    </div>
  );
};

export default Commodore64Model;