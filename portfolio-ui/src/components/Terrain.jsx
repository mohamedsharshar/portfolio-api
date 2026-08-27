import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// Simple noise function (no external dep needed for this)
function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return a + t * (b - a);
}

const GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

function dot(g, x, y) {
  return g[0] * x + g[1] * y;
}

// Simple Perlin noise
function perlin2(px, py) {
  const X = Math.floor(px) & 255;
  const Y = Math.floor(py) & 255;
  const x = px - Math.floor(px);
  const y = py - Math.floor(py);
  const u = fade(x);
  const v = fade(y);
  // Simple pseudo-random
  const h = (X * 1619 + Y * 31337) | 0;
  const h1 = (h ^ (h >> 16)) & 11;
  const h2 = ((h + 1) ^ ((h + 1) >> 16)) & 11;
  const h3 = ((h + 1619) ^ ((h + 1619) >> 16)) & 11;
  const h4 = ((h + 1620) ^ ((h + 1620) >> 16)) & 11;
  return lerp(
    lerp(dot(GRAD3[h1], x, y), dot(GRAD3[h2], x - 1, y), u),
    lerp(dot(GRAD3[h3], x, y - 1), dot(GRAD3[h4], x - 1, y - 1), u),
    v
  );
}

function getHeight(x, z) {
  // Keep center flat (spawn area)
  const distFromCenter = Math.sqrt(x * x + z * z);
  const centerFlat = Math.max(0, 1 - distFromCenter / 8);

  // Multi-octave noise for rolling hills
  let h = 0;
  h += perlin2(x * 0.05, z * 0.05) * 3.0;
  h += perlin2(x * 0.12, z * 0.12) * 1.2;
  h += perlin2(x * 0.3, z * 0.3) * 0.4;

  // Flatten spawn area
  h = lerp(h, 0, centerFlat * centerFlat);

  // Ocean edges — drop below sea level at island boundary
  const islandRadius = 45;
  const edgeFade = Math.max(0, 1 - distFromCenter / islandRadius);
  h = h * edgeFade * edgeFade - (1 - edgeFade * edgeFade) * 1.5;

  return h;
}

const SEGMENTS = 120;
const SIZE = 100;

export default function Terrain() {
  const meshRef = useRef();

  const { geometry, colors } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position;
    const colorArray = new Float32Array(positions.count * 3);

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y = getHeight(x, z);
      positions.setY(i, y);

      // Vertex colors based on height
      const color = new THREE.Color();
      if (y < -0.5) {
        // Water / sand at very low
        color.set('#c4a882');
      } else if (y < 0.3) {
        // Path-level / low grass
        color.set('#8a9b6e');
      } else if (y < 1.5) {
        // Mid grass
        color.set('#7a9060');
      } else {
        // High ground / hilltop
        color.set('#6a8050');
      }

      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    positions.needsUpdate = true;
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    return { geometry: geo, colors: colorArray };
  }, []);

  return (
    <RigidBody type="fixed" friction={1.5} colliders="trimesh">
      <mesh
        ref={meshRef}
        geometry={geometry}
        receiveShadow
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
    </RigidBody>
  );
}
