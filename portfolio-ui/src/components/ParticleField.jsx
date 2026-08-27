import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { allLandmarks } from '../data/projects';

// ─── Cherry Blossom Petals ───────────────────────────────
function Petals({ count = 120 }) {
  const meshRef = useRef();

  const { positions, velocities, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 10 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = -Math.random() * 0.005 - 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, velocities, phases };
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    return g;
  }, [positions]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    const t = performance.now() * 0.001;

    for (let i = 0; i < count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Wind drift + sine wave swirl
      x += velocities[i * 3] + Math.sin(t * 0.3 + phases[i]) * 0.003;
      y += velocities[i * 3 + 1];
      z += velocities[i * 3 + 2] + Math.cos(t * 0.4 + phases[i]) * 0.003;

      // Reset when below ground
      if (y < -1) {
        y = Math.random() * 8 + 4;
        x = (Math.random() - 0.5) * 80;
        z = (Math.random() - 0.5) * 80;
      }

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        color="#f9c4d0"
        size={0.12}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Fireflies near landmarks ─────────────────────────────
function Fireflies({ count = 60 }) {
  const meshRef = useRef();

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    // Cluster fireflies near landmark positions
    const landmarkPositions = allLandmarks.map((l) => l.position);

    for (let i = 0; i < count; i++) {
      const landmark = landmarkPositions[i % landmarkPositions.length];
      positions[i * 3] = landmark[0] + (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 3 + 0.5;
      positions[i * 3 + 2] = landmark[2] + (Math.random() - 0.5) * 6;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, phases };
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const baseX = positions[i * 3];
      const baseY = positions[i * 3 + 1];
      const baseZ = positions[i * 3 + 2];

      pos.setXYZ(
        i,
        baseX + Math.sin(t * 0.5 + phases[i]) * 0.4,
        baseY + Math.sin(t * 0.8 + phases[i] * 1.3) * 0.3,
        baseZ + Math.cos(t * 0.6 + phases[i]) * 0.4
      );
    }
    pos.needsUpdate = true;

    // Pulse opacity
    meshRef.current.material.opacity = 0.4 + Math.sin(t * 2) * 0.2;
  });

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        color="#ffe666"
        size={0.08}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Floating Embers (near shrines) ──────────────────────
function Embers({ count = 40 }) {
  const meshRef = useRef();

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 25;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.random() * 1.5;
      positions[i * 3 + 2] = Math.sin(angle) * r;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, phases };
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      let y = pos.getY(i);
      y += 0.005;
      if (y > 4) {
        y = 0;
        pos.setX(i, (Math.random() - 0.5) * 50);
        pos.setZ(i, (Math.random() - 0.5) * 50);
      }
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        color="#ff8844"
        size={0.05}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <group>
      <Petals count={100} />
      <Fireflies count={60} />
      <Embers count={30} />
    </group>
  );
}
