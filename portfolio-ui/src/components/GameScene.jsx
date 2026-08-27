import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Cloud, KeyboardControls, Stars } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { Ecctrl } from 'ecctrl';
import PlayerTracker from './PlayerTracker';
import Landmark from './Landmark';
import Terrain from './Terrain';
import ParticleField from './ParticleField';
import CameraRig from './CameraRig';
import RightClickCamera from './RightClickCamera';
import ClickInteraction from './ClickInteraction';
import { allLandmarks } from '../data/projects';

const keyboardMap = [
  { name: 'forward',   keys: ['ArrowUp',    'KeyW'] },
  { name: 'backward',  keys: ['ArrowDown',  'KeyS'] },
  { name: 'leftward',  keys: ['ArrowLeft',  'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump',      keys: ['Space'] },
  { name: 'run',       keys: ['ShiftLeft',  'ShiftRight'] },
];

// Distant water plane
function WaterPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.0, 0]}>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial
        color="#3a6b8a"
        roughness={0.1}
        metalness={0.3}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// Distant silhouette hills
function FogHills() {
  const configs = [
    [60, 0, 0, 8, 10], [-60, 0, 0, 10, 12], [0, 0, 60, 7, 9],
    [0, 0, -60, 9, 14], [45, 0, 45, 6, 8],  [-45, 0, 45, 8, 11],
    [45, 0, -45, 7, 10], [-45, 0, -45, 9, 13],
  ];
  return (
    <group>
      {configs.map(([x, y, z, r, h], i) => (
        <mesh key={i} position={[x, -1.5, z]}>
          <coneGeometry args={[r, h, 5]} />
          <meshStandardMaterial color="#2d4a3e" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

// Stone path segments
function StonePath() {
  const segments = [
    { pos: [0, 0.05, -6],   rot: [0, 0,    0], scale: [1.2, 0.08, 4] },
    { pos: [4, 0.05, -12],  rot: [0, 0.4,  0], scale: [1.0, 0.08, 4] },
    { pos: [-4, 0.05, -10], rot: [0, -0.3, 0], scale: [1.0, 0.08, 4] },
    { pos: [8, 0.05, 5],    rot: [0, 0.8,  0], scale: [1.0, 0.08, 5] },
    { pos: [-8, 0.05, 4],   rot: [0, -0.7, 0], scale: [1.0, 0.08, 5] },
  ];
  return (
    <group>
      {segments.map((s, i) => (
        <mesh key={i} receiveShadow position={s.pos} rotation={s.rot}>
          <boxGeometry args={s.scale} />
          <meshStandardMaterial color="#9a8a7a" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

// Simple stylized character (capsule + head + cloak)
function CharacterBody() {
  return (
    <group>
      {/* Body */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshStandardMaterial color="#2d3748" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#f0c090" roughness={0.8} />
      </mesh>
      {/* Cloak back */}
      <mesh castShadow position={[0, 0.4, -0.1]}>
        <coneGeometry args={[0.38, 0.9, 6]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.9} side={2} />
      </mesh>
    </group>
  );
}

/**
 * InteractionIndicator — Shows [E] prompt above nearby landmarks
 */
function InteractionIndicator() {
  return null; // Visual handled in HUD overlay
}

const GameScene = () => {
  const ecctrlRef = useRef();
  const cameraOrbitRef = useRef(null);

  return (
    <div className="w-screen h-screen" style={{ touchAction: 'none' }}>
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 8, 12], fov: 55 }}
          gl={{ antialias: true }}
          dpr={[1, 1.5]}
          style={{ background: '#c8b99a' }}
        >
          {/* Atmosphere */}
          <color attach="background" args={['#c8b99a']} />
          <fog attach="fog" args={['#d4c4a0', 30, 80]} />

          {/* Lighting */}
          <hemisphereLight skyColor="#f4d9a8" groundColor="#4a6035" intensity={0.7} />
          <ambientLight intensity={0.35} color="#ffe0b0" />
          <directionalLight
            castShadow
            position={[20, 35, 15]}
            intensity={2.2}
            color="#ffcc77"
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={130}
            shadow-camera-left={-70}
            shadow-camera-right={70}
            shadow-camera-top={70}
            shadow-camera-bottom={-70}
          />
          <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#a0c0e0" />

          {/* Sky & stars */}
          <Sky sunPosition={[12, 2, 8]} turbidity={0.4} rayleigh={2.5} />
          <Stars radius={80} depth={30} count={1500} factor={2} fade />

          {/* Clouds */}
          <Cloud position={[10, 22, -40]} speed={0.15} opacity={0.25} segments={20} />
          <Cloud position={[-20, 20, -30]} speed={0.1}  opacity={0.2}  segments={15} />

          {/*
            CameraRig lives OUTSIDE Physics — it only fires on quest open/close
            ecctrl handles ALL normal camera movement on its own
          */}
          <CameraRig />

          {/*
            RightClickCamera — our custom camera controller:
              • Right-click drag to orbit camera
              • Mouse wheel to zoom in/out
              • Smooth follow of character
          */}
          <RightClickCamera orbitRef={cameraOrbitRef} />

          {/*
            ClickInteraction — handles:
              • Left-click on landmarks to interact
              • E = interact with nearest landmark
              • Q = close quest panel
              • R = reset camera angle
          */}
          <ClickInteraction cameraOrbitRef={cameraOrbitRef} />

          <Suspense fallback={null}>
            <Physics gravity={[0, -25, 0]}>

              {/* Position tracker (no visuals — updates Zustand) */}
              <PlayerTracker ecctrlRef={ecctrlRef} />

              {/*
                ecctrl — handles:
                  • WASD / arrow key movement
                  • Shift sprint, Space jump
                  • Character physics
                Camera is now handled by RightClickCamera
              */}
              <Ecctrl
                ref={ecctrlRef}
                maxWalkVel={6}
                maxRunVel={10}
                jumpVel={5}
                position={[0, 4, 0]}
                floatHeight={0.3}
                animated={false}
              >
                <CharacterBody />
              </Ecctrl>

              {/* Island terrain with trimesh collider */}
              <Terrain />

              {/* Static world elements */}
              <WaterPlane />
              <FogHills />
              <StonePath />

              {/* All quest landmarks */}
              {allLandmarks.map((landmark) => (
                <Landmark key={landmark.id} project={landmark} />
              ))}

            </Physics>

            {/* Particles outside Physics (they're visual only) */}
            <ParticleField />

          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default GameScene;