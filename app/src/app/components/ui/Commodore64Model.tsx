'use client';

import * as THREE from 'three';
import { Suspense, useEffect } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { AdaptiveDpr, Environment, Html, OrbitControls, useGLTF, useVideoTexture } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh;
    Object_5: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_8: THREE.Mesh;
    Object_10: THREE.Mesh;
    Object_12: THREE.Mesh;
    Object_14: THREE.Mesh;
    Object_15: THREE.Mesh;
    Object_17: THREE.Mesh;
    Object_18: THREE.Mesh;
    Object_19: THREE.Mesh;
    Object_21: THREE.Mesh;
    Object_23: THREE.Mesh;
  };
  materials: {
    computer_details: THREE.MeshStandardMaterial;
    computer_keyboard: THREE.MeshStandardMaterial;
    computer_main_body: THREE.MeshStandardMaterial;
    peripherals: THREE.MeshStandardMaterial;
    cable: THREE.MeshStandardMaterial;
    connector: THREE.MeshStandardMaterial;
    monitor_white: THREE.MeshStandardMaterial;
    monitor_black: THREE.MeshStandardMaterial;
    monitor_screen: THREE.MeshPhysicalMaterial;
    monitor_plug: THREE.MeshStandardMaterial;
  };
};

function Commodore64(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/commodore_64__computer_full_pack.glb') as unknown as GLTFResult;
  const videoTexture = useVideoTexture('/mechiu-gameplay.mp4', {
    loop: true,
    muted: true,
    playsInline: true,
    start: true,
    crossOrigin: 'anonymous',
  });

  useEffect(() => {
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.flipY = false;

    // --- TEXTURE FIXES: ROTATION & MIRRORING ---
    // 1. Pivot from the center
    videoTexture.center.set(0.5, 0.5); 
    // 2. Rotate 90 degrees to fix the upside-down rendering
    videoTexture.rotation = Math.PI / 2; 
    // 3. Enable wrapping and invert the X-axis to fix the mirroring
    videoTexture.wrapS = THREE.RepeatWrapping; 
    videoTexture.repeat.x = -1;
    // -------------------------------------------

    // Playback is managed by useVideoTexture with start: true.
  }, [videoTexture]);

  return (
    <group {...props} dispose={null}>
      <group position={[-1.258, 0.195, 2.2]}>
        <mesh geometry={nodes.Object_4.geometry} material={materials.computer_details} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.computer_keyboard} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.computer_main_body} />
      </group>
      <group position={[0.542, -0.111, -4.23]}>
        <mesh geometry={nodes.Object_14.geometry} material={materials.cable} />
        <mesh geometry={nodes.Object_15.geometry} material={materials.connector} />
      </group>
      <group position={[0, 0.368, -2.43]}>
        <mesh geometry={nodes.Object_17.geometry} material={materials.monitor_black} />
        <mesh geometry={nodes.Object_18.geometry} material={materials.monitor_white} />
        
        {/* SCREEN MESH */}
        <mesh geometry={nodes.Object_19.geometry}>
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>
        
        <mesh
          geometry={nodes.Object_21.geometry}
          material={materials.monitor_white}
          position={[1.265, -0.148, 2.24]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
      <mesh geometry={nodes.Object_8.geometry} material={materials.peripherals} position={[3.182, 0.071, -2.601]} />
      <mesh
        geometry={nodes.Object_10.geometry}
        material={materials.peripherals}
        position={[4.297, 0.478, 1.302]}
        rotation={[0, 0.602, 0]}
      />
      <mesh geometry={nodes.Object_12.geometry} material={materials.peripherals} position={[-4.423, 1.212, -1.111]} />
      <mesh geometry={nodes.Object_23.geometry} material={materials.monitor_plug} position={[0.003, 2.252, -2.083]} />
    </group>
  );
}

useGLTF.preload('/commodore_64__computer_full_pack.glb');

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
        dpr={[1, 1.35]}
        camera={{ position: [5.2, 2.6, 8.6], fov: 30 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        performance={{ min: 0.55 }}
      >
        <ambientLight intensity={0.58} />
        <directionalLight position={[5, 6, 3]} intensity={1.08} />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <AdaptiveDpr />
        <Suspense fallback={<ModelLoadingFallback />}>
          <Commodore64 position={[0, -1.05, 0]} rotation={[0, -0.58, 0]} scale={0.48} />
          <Environment preset="city" resolution={64} />
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