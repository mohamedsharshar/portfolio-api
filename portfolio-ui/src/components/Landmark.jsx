import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { usePlayerStore } from '../store/usePlayerStore';

const TRIGGER_DISTANCE = 5;

// ─── Torii Shrine (Masarat / educational) ─────────────────
function ToriiShrine({ color, isDiscovered }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.04;
  });
  return (
    <group ref={ref}>
      {/* Two pillars */}
      <mesh castShadow position={[-0.9, 1.5, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 3, 8]} />
        <meshStandardMaterial color="#8b6344" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.9, 1.5, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 3, 8]} />
        <meshStandardMaterial color="#8b6344" roughness={0.8} />
      </mesh>
      {/* Upper crossbeam */}
      <mesh castShadow position={[0, 3.2, 0]}>
        <boxGeometry args={[2.6, 0.22, 0.28]} />
        <meshStandardMaterial color={color} emissive={isDiscovered ? color : '#000'} emissiveIntensity={isDiscovered ? 0.4 : 0} roughness={0.6} />
      </mesh>
      {/* Lower crossbeam */}
      <mesh castShadow position={[0, 2.6, 0]}>
        <boxGeometry args={[2.2, 0.16, 0.24]} />
        <meshStandardMaterial color="#6b4d2e" roughness={0.7} />
      </mesh>
      {/* Hanging charm */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <octahedronGeometry args={[0.12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
      {/* Base stone */}
      <mesh receiveShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[3, 0.16, 0.8]} />
        <meshStandardMaterial color="#7a6a5a" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Lantern Hearth (HR Genie / people-focused) ───────────
function LanternHearth({ color, isDiscovered }) {
  const lanternRef = useRef();
  useFrame((state) => {
    if (lanternRef.current) {
      lanternRef.current.position.y = 2.5 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    }
  });
  return (
    <group>
      {/* Stone platform */}
      <mesh receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 0.3, 8]} />
        <meshStandardMaterial color="#7a6a5a" roughness={1} />
      </mesh>
      {/* Pillar */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 2.2, 8]} />
        <meshStandardMaterial color="#8b7a6a" roughness={0.9} />
      </mesh>
      {/* Pagoda cap */}
      <mesh castShadow position={[0, 2.6, 0]}>
        <coneGeometry args={[1.0, 0.5, 8]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
      </mesh>
      {/* Main lantern body */}
      <group ref={lanternRef} position={[0, 2.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.9, 0.7]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isDiscovered ? 1.5 : 0.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
      {/* Side lanterns */}
      {[[-1, 0], [1, 0], [0, -1], [0, 1]].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x * 1.0, 0.6, z * 1.0]}>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Crystal Obelisk (data/API project) ───────────────────
function CrystalObelisk({ color, isDiscovered }) {
  const crystalRef = useRef();
  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += 0.005;
    }
  });
  return (
    <group ref={crystalRef}>
      {/* Base */}
      <mesh receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <meshStandardMaterial color="#4a4a5a" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Main obelisk shaft */}
      <mesh castShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 3.5, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isDiscovered ? 0.8 : 0.2}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Tip crystal */}
      <mesh castShadow position={[0, 4.0, 0]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isDiscovered ? 2 : 0.5}
          roughness={0}
          metalness={0.6}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Orbiting crystal shards */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[
          Math.cos((i / 3) * Math.PI * 2) * 0.7,
          2.0,
          Math.sin((i / 3) * Math.PI * 2) * 0.7,
        ]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Ruined Tower (Coming Soon) ───────────────────────────
function RuinedTower({ color, isDiscovered }) {
  return (
    <group>
      {/* Base */}
      <mesh receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.4, 8]} />
        <meshStandardMaterial color="#6a5a4a" roughness={1} />
      </mesh>
      {/* Tower segments — crumbled effect */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.9, 1.0, 2.0, 8, 1, true]} />
        <meshStandardMaterial color="#7a6a5a" roughness={1} side={2} />
      </mesh>
      <mesh castShadow position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 1.2, 8, 1, true]} />
        <meshStandardMaterial color="#6a5a4a" roughness={1} side={2} />
      </mesh>
      {/* Broken top section — tilted */}
      <mesh castShadow position={[0.3, 3.8, 0.2]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.5, 0.7, 0.8, 8, 1, true]} />
        <meshStandardMaterial color="#5a4a3a" roughness={1} side={2} />
      </mesh>
      {/* Vine/moss accent */}
      <mesh position={[0, 1.5, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 1.2]} />
        <meshStandardMaterial color="#4a7a4a" roughness={1} transparent opacity={0.7} side={2} />
      </mesh>
      {/* Glow rune at base */}
      <mesh position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.0, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDiscovered ? 0.8 : 0.1} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ─── Starting Camp (About Me) ─────────────────────────────
function StartingCamp({ color, isDiscovered }) {
  const bannerRef = useRef();
  useFrame((state) => {
    if (bannerRef.current) bannerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
  });
  return (
    <group>
      {/* Stone inscription base */}
      <mesh receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[2.0, 0.6, 0.4]} />
        <meshStandardMaterial color="#8a7a6a" roughness={1} />
      </mesh>
      {/* Carved text face */}
      <mesh position={[0, 0.3, 0.21]}>
        <planeGeometry args={[1.8, 0.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDiscovered ? 0.6 : 0.15} roughness={0.8} />
      </mesh>
      {/* Flag pole */}
      <mesh castShadow position={[-1.5, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 2.4, 6]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.8} />
      </mesh>
      {/* Banner */}
      <group ref={bannerRef} position={[-1.1, 2.0, 0]}>
        <mesh castShadow>
          <planeGeometry args={[0.9, 0.5]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} side={2} roughness={0.7} />
        </mesh>
      </group>
      {/* Campfire pit */}
      <mesh receiveShadow position={[1.5, 0.05, 0.5]}>
        <cylinderGeometry args={[0.35, 0.4, 0.1, 8]} />
        <meshStandardMaterial color="#4a3a2a" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Training Ground (Skills) ─────────────────────────────
function TrainingGround({ color, isDiscovered }) {
  return (
    <group>
      {/* Stone circle base */}
      <mesh receiveShadow position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.0, 12]} />
        <meshStandardMaterial color="#7a6a5a" roughness={1} />
      </mesh>
      {/* Central totem */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[0.5, 3.0, 0.5]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 3.2, 0]}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDiscovered ? 1.2 : 0.3} />
      </mesh>
      {/* Surrounding totems */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 2.7;
        const z = Math.sin(angle) * 2.7;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh castShadow position={[0, 0.8, 0]}>
              <boxGeometry args={[0.2, 1.6, 0.2]} />
              <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[0.35, 0.25, 0.1]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── Lighthouse (Contact) ──────────────────────────────────
function Lighthouse({ color, isDiscovered }) {
  const beamRef = useRef();
  useFrame((state) => {
    if (beamRef.current) beamRef.current.rotation.y += 0.02;
  });
  return (
    <group>
      {/* Base platform */}
      <mesh receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.4, 10]} />
        <meshStandardMaterial color="#8a8a9a" roughness={0.8} />
      </mesh>
      {/* Tower */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 4.5, 10]} />
        <meshStandardMaterial color="#aaaabc" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Stripe band */}
      <mesh castShadow position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.4, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Lantern room */}
      <mesh castShadow position={[0, 5.0, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.9, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDiscovered ? 2 : 0.5} transparent opacity={0.85} />
      </mesh>
      {/* Dome cap */}
      <mesh castShadow position={[0, 5.7, 0]}>
        <coneGeometry args={[0.65, 0.7, 10]} />
        <meshStandardMaterial color="#5a5a6a" roughness={0.6} />
      </mesh>
      {/* Rotating search beam */}
      <group ref={beamRef} position={[0, 5.0, 0]}>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.3, 6, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.25} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Ground Glyph Indicator ───────────────────────────────
function GroundGlyph({ color, isDiscovered, glowIntensity }) {
  return (
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.8, 2.2, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={glowIntensity * 1.5 + (isDiscovered ? 0.3 : 0)}
        transparent
        opacity={0.4 + glowIntensity * 0.4}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Main Landmark Component ──────────────────────────────
const Landmark = ({ project }) => {
  const glowRef = useRef();
  const glowIntensityRef = useRef(0);

  const playerPosition = usePlayerStore((s) => s.playerPosition);
  const setActiveQuest = usePlayerStore((s) => s.setActiveQuest);
  const discoverQuest = usePlayerStore((s) => s.discoverQuest);
  const discoveredQuests = usePlayerStore((s) => s.discoveredQuests);
  const setQuestCooldown = usePlayerStore((s) => s.setQuestCooldown);
  const isQuestOnCooldown = usePlayerStore((s) => s.isQuestOnCooldown);
  const activeQuest = usePlayerStore((s) => s.activeQuest);

  const isDiscovered = discoveredQuests.includes(project.id);

  useFrame(() => {
    const landmarkPos = new THREE.Vector3(...project.position);
    const playerPos = new THREE.Vector3(...playerPosition);
    const distance = landmarkPos.distanceTo(playerPos);

    // Smooth glow ramp-up as player approaches
    const targetGlow = Math.max(0, 1 - distance / 10);
    glowIntensityRef.current += (targetGlow - glowIntensityRef.current) * 0.05;

    if (glowRef.current) {
      glowRef.current.intensity = glowIntensityRef.current * 3;
    }

    // Trigger quest when close enough
    if (distance < TRIGGER_DISTANCE && !activeQuest && !isQuestOnCooldown(project.id)) {
      setActiveQuest(project);
      discoverQuest(project.id);
    }
  });

  const renderLandmark = () => {
    const props = { color: project.color, isDiscovered };
    switch (project.landmarkType) {
      case 'shrine': return <ToriiShrine {...props} />;
      case 'hearth': return <LanternHearth {...props} />;
      case 'obelisk': return <CrystalObelisk {...props} />;
      case 'tower': return <RuinedTower {...props} />;
      case 'camp': return <StartingCamp {...props} />;
      case 'training_ground': return <TrainingGround {...props} />;
      case 'lighthouse': return <Lighthouse {...props} />;
      default: return <ToriiShrine {...props} />;
    }
  };

  return (
    <group position={project.position}>
      <RigidBody type="fixed" colliders="cuboid">
        <CuboidCollider args={[1.5, 3, 1.5]} position={[0, 1.5, 0]} />
      </RigidBody>

      {/* The 3D landmark geometry */}
      {renderLandmark()}

      {/* Ground glyph indicator */}
      <GroundGlyph
        color={project.color}
        isDiscovered={isDiscovered}
        glowIntensity={glowIntensityRef.current}
      />

      {/* Point light that grows on approach */}
      <pointLight
        ref={glowRef}
        position={[0, 2.5, 0]}
        color={project.color}
        intensity={0}
        distance={12}
        decay={2}
      />

      {/* Torch/fire emitter for warm-themed landmarks */}
      {(project.theme === 'warm') && (
        <pointLight
          position={[0, 1.5, 0]}
          color="#ff8844"
          intensity={isDiscovered ? 1.5 : 0.5}
          distance={6}
        />
      )}
    </group>
  );
};

export default Landmark;