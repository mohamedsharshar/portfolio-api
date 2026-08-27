import { useMemo } from 'react';
import { RigidBody, HeightfieldCollider } from '@react-three/rapier';
import * as THREE from 'three';

// ─── Noise helpers ────────────────────────────────────────
function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }
const G3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];
function dot2(g, x, y) { return g[0]*x + g[1]*y; }

function perlin2(px, py) {
  const X = Math.floor(px) & 255;
  const Y = Math.floor(py) & 255;
  const x = px - Math.floor(px);
  const y = py - Math.floor(py);
  const u = fade(x); const v = fade(y);
  const h  = ((X*1619  + Y*31337)) & 11;
  const h2 = ((X*1619+1+ Y*31337)) & 11;
  const h3 = ((X*1619  +(Y+1)*31337)) & 11;
  const h4 = ((X*1619+1+(Y+1)*31337)) & 11;
  return lerp(
    lerp(dot2(G3[h],x,y), dot2(G3[h2],x-1,y),u),
    lerp(dot2(G3[h3],x,y-1), dot2(G3[h4],x-1,y-1),u),
    v
  );
}

function getHeight(x, z) {
  const dist = Math.sqrt(x*x + z*z);
  // Flat spawn center
  const centerFlat = Math.max(0, 1 - dist/8);
  // Multi-octave hills
  let h = 0;
  h += perlin2(x*0.05, z*0.05) * 3.0;
  h += perlin2(x*0.12, z*0.12) * 1.2;
  h += perlin2(x*0.3,  z*0.3)  * 0.4;
  h = lerp(h, 0, centerFlat * centerFlat);
  // Island edge dropoff
  const islandR = 45;
  const edge = Math.max(0, 1 - dist/islandR);
  return h * edge * edge - (1 - edge*edge) * 1.5;
}

// ─── Terrain mesh + heightfield collider ─────────────────
const SEGMENTS = 80;   // lower = faster collider build
const SIZE     = 100;

export default function Terrain() {
  const { geometry, heights, nCols, nRows } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colorArr = new Float32Array(pos.count * 3);

    // Heights grid for HeightfieldCollider (row-major, x varies fastest)
    const nRows = SEGMENTS + 1;
    const nCols = SEGMENTS + 1;
    const heights = new Float32Array(nRows * nCols);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getHeight(x, z);
      pos.setY(i, y);

      // Store in height grid
      heights[i] = y;

      // Vertex colors by height
      const c = new THREE.Color();
      if      (y < -0.5) c.set('#c4a882');   // sand / shore
      else if (y <  0.3) c.set('#8a9b6e');   // low grass
      else if (y <  1.5) c.set('#7a9060');   // mid grass
      else               c.set('#6a8050');   // hilltop

      colorArr[i*3]   = c.r;
      colorArr[i*3+1] = c.g;
      colorArr[i*3+2] = c.b;
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3));

    return { geometry: geo, heights, nCols, nRows };
  }, []);

  return (
    <RigidBody type="fixed" friction={1.5}>
      {/*
        HeightfieldCollider — purpose-built for terrain, much faster than trimesh.
        Args: (nRows-1, nCols-1, heights, scale)
        scale maps the grid to world size.
      */}
      <HeightfieldCollider
        args={[
          nRows - 1,
          nCols - 1,
          heights,
          { x: SIZE, y: 1, z: SIZE },
        ]}
        position={[-SIZE / 2, 0, -SIZE / 2]}
      />
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.9} metalness={0.0} />
      </mesh>
    </RigidBody>
  );
}
