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
import { allLandmarks } from '../data/projects';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
];

// Distant water plane
function WaterPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.0, 0]} receiveShadow>
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

// Distant fog hills — silhouetted low-poly mountain rings
function FogHills() {
  const positions = [
    [60, 0, 0], [-60, 0, 0], [0, 0, 60], [0, 0, -60],
    [45, 0, 45], [-45, 0, 45], [45, 0, -45], [-45, 0, -45],
  ];
  return (
    <group>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, -1.5 + Math.sin(i) * 2, z]} castShadow>
          <coneGeometry args={[8 + (i % 3) * 3, 10 + (i % 4) * 5, 5]} />
          <meshStandardMaterial color="#2d4a3e" fog transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// Stone path connecting landmarks
function StonePath() {
  // Simple path segments from origin toward key landmarks
  const segments = [
    { pos: [0, 0.05, -6], rot: [0, 0, 0], scale: [1.2, 0.1, 4] },
    { pos: [4, 0.05, -12], rot: [0, 0.4, 0], scale: [1.0, 0.1, 4] },
    { pos: [-4, 0.05, -10], rot: [0, -0.3, 0], scale: [1.0, 0.1, 4] },
    { pos: [8, 0.05, 5], rot: [0, 0.8, 0], scale: [1.0, 0.1, 5] },
    { pos: [-8, 0.05, 4], rot: [0, -0.7, 0], scale: [1.0, 0.1, 5] },
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

const GameScene = () => {
  const ecctrlRef = useRef();

  return (
    <div className="w-screen h-screen">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 55 }}
          gl={{ antialias: true }}
          dpr={[1, 1.5]}
        >
          {/* Background & fog */}
          <color attach="background" args={['#c8b99a']} />
          <fog attach="fog" args={['#d4c4a0', 25, 70]} />

          {/* Lighting — golden hour atmosphere */}
          <hemisphereLight skyColor="#f4d9a8" groundColor="#4a6035" intensity={0.6} />
          <ambientLight intensity={0.3} color="#ffe0b0" />
          <directionalLight
            castShadow
            position={[20, 30, 15]}
            intensity={2.0}
            color="#ffcc77"
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={120}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
          />
          {/* Soft fill light from opposite side */}
          <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#a0c0e0" />

          {/* Sky */}
          <Sky sunPosition={[12, 2, 8]} turbidity={0.4} rayleigh={2.5} mieCoefficient={0.005} />
          <Stars radius={80} depth={30} count={2000} factor={2} saturation={0} fade />

          {/* Clouds */}
          <Cloud position={[10, 20, -40]} speed={0.15} opacity={0.25} segments={20} />
          <Cloud position={[-20, 18, -30]} speed={0.1} opacity={0.2} segments={15} />
          <Cloud position={[30, 22, 10]} speed={0.12} opacity={0.18} segments={12} />

          <Suspense fallback={null}>
            <Physics gravity={[0, -25, 0]}>
              {/* Player tracker (no visual — updates store) */}
              <PlayerTracker ecctrlRef={ecctrlRef} />

              {/* Cinematic camera rig */}
              <CameraRig characterRef={ecctrlRef} />

              {/* Playable character — stylized capsule traveler */}
              <Ecctrl
                ref={ecctrlRef}
                camInitDis={-6}
                camMaxDis={-12}
                maxVelLimit={6}
                sprintMult={1.8}
                jumpVel={5}
                position={[0, 3, 0]}
                floatHeight={0.2}
              >
                {/* Body */}
                <mesh castShadow position={[0, 0.3, 0]}>
                  <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
                  <meshStandardMaterial color="#2d3748" roughness={0.6} metalness={0.2} />
                </mesh>
                {/* Head */}
                <mesh castShadow position={[0, 1.0, 0]}>
                  <sphereGeometry args={[0.25, 8, 8]} />
                  <meshStandardMaterial color="#f0c090" roughness={0.8} />
                </mesh>
                {/* Cloak accent */}
                <mesh castShadow position={[0, 0.4, -0.1]}>
                  <coneGeometry args={[0.38, 0.9, 6]} />
                  <meshStandardMaterial color="#4a3a2a" roughness={0.9} side={2} />
                </mesh>
              </Ecctrl>

              {/* Terrain */}
              <Terrain />

              {/* Water */}
              <WaterPlane />

              {/* Distant fog hills */}
              <FogHills />

              {/* Stone path */}
              <StonePath />

              {/* All landmarks (projects + special zones) */}
              {allLandmarks.map((landmark) => (
                <Landmark key={landmark.id} project={landmark} />
              ))}
            </Physics>

            {/* Particle effects */}
            <ParticleField />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default GameScene;