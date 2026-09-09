import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Stars, Sparkles } from '@react-three/drei';
import { Color } from 'three';
import HTMLContent from './HTMLContent';

// ==========================================
// 3D Programming Shapes
// ==========================================

const AINode = ({ tier, ...props }) => (
  <mesh {...props}>
    <torusKnotGeometry args={[1.5, 0.4, tier === 'high' ? 64 : 32, tier === 'high' ? 10 : 6]} />
    <meshStandardMaterial color="#3b82f6" wireframe />
  </mesh>
);

const DatabaseShape = ({ tier, ...props }) => (
  <group {...props}>
    {[1.5, 0, -1.5].map((y, i) => (
      <mesh key={i} position={[0, y, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 1.2, tier === 'high' ? 8 : 6]} />
        <meshStandardMaterial color="#14b8a6" wireframe />
      </mesh>
    ))}
  </group>
);

const CodeBrackets = (props) => (
  <group {...props} scale={0.6}>
    {/* Left Bracket < */}
    <mesh rotation={[0, 0, -Math.PI/4]} position={[-4, 1.05, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 3, 6]} />
      <meshStandardMaterial color="#f43f5e" wireframe />
    </mesh>
    <mesh rotation={[0, 0, Math.PI/4]} position={[-4, -1.05, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 3, 6]} />
      <meshStandardMaterial color="#f43f5e" wireframe />
    </mesh>
    
    {/* Slash / */}
    <mesh rotation={[0, 0, -0.4]} position={[0, 0, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 6.5, 6]} />
      <meshStandardMaterial color="#f43f5e" wireframe />
    </mesh>

    {/* Right Bracket > */}
    <mesh rotation={[0, 0, Math.PI/4]} position={[4, 1.05, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 3, 6]} />
      <meshStandardMaterial color="#f43f5e" wireframe />
    </mesh>
    <mesh rotation={[0, 0, -Math.PI/4]} position={[4, -1.05, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 3, 6]} />
      <meshStandardMaterial color="#f43f5e" wireframe />
    </mesh>
  </group>
);

const sectionColors = ['#6366f1', '#14b8a6', '#f43f5e', '#3b82f6', '#8b5cf6'];

const AmbientColorShift = () => {
  const scroll = useScroll();
  const light1 = useRef();
  const light2 = useRef();
  const color = useRef(new Color(sectionColors[0]));
  const c1 = useRef(new Color());
  const c2 = useRef(new Color());

  useFrame(() => {
    const offset = scroll.offset; // 0 -> 1
    const sectionIndex = offset * (sectionColors.length - 1);
    const idx = Math.floor(sectionIndex);
    const t = sectionIndex - idx;
    c1.current.set(sectionColors[idx]);
    c2.current.set(sectionColors[Math.min(idx + 1, sectionColors.length - 1)]);
    color.current.lerpColors(c1.current, c2.current, t);

    if (light2.current) light2.current.color.copy(color.current);
    if (light1.current) light1.current.intensity = 0.35 + Math.sin(offset * Math.PI * 4) * 0.1;
  });

  return (
    <>
      <ambientLight ref={light1} intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight ref={light2} position={[-10, -10, -5]} intensity={0.6} />
    </>
  );
};

const FixedBackground = ({ tier, prefersReducedMotion }) => {
  const farStars = useRef();
  const nearStars = useRef();
  const nebula = useRef();

  useFrame((state, delta) => {
    if (prefersReducedMotion) return; // disable background rotation on reduced motion
    
    if (farStars.current) farStars.current.rotation.y += delta * 0.015;
    if (nearStars.current) {
      nearStars.current.rotation.y -= delta * 0.04;
      nearStars.current.rotation.x += delta * 0.01;
    }
    if (nebula.current) nebula.current.rotation.z += delta * 0.008;
  });

  const getStarCount = (base) => tier === 'high' ? base : tier === 'mid' ? Math.floor(base * 0.5) : Math.floor(base * 0.2);
  const getSparkleCount = (base) => tier === 'high' ? base : tier === 'mid' ? Math.floor(base * 0.5) : 0; // Disable sparkles on low-end entirely

  return (
    <group>
      <group ref={farStars}>
        <Stars radius={150} depth={80} count={getStarCount(600)} factor={2} saturation={0} fade speed={prefersReducedMotion ? 0 : 1} />
      </group>
      <group ref={nearStars}>
        <Stars radius={60} depth={30} count={getStarCount(200)} factor={3} saturation={0.2} fade speed={prefersReducedMotion ? 0 : 3} />
      </group>
      {tier !== 'low' && (
        <group ref={nebula}>
          <Sparkles count={getSparkleCount(30)} scale={20} size={3} speed={prefersReducedMotion ? 0 : 0.3} opacity={0.25} color="#6366f1" />
          <Sparkles count={getSparkleCount(30)} scale={18} size={2} speed={prefersReducedMotion ? 0 : 0.5} opacity={0.2} color="#14b8a6" position={[0, -8, -5]} />
          <Sparkles count={getSparkleCount(30)} scale={12} size={4} speed={prefersReducedMotion ? 0 : 0.2} opacity={0.15} color="#f43f5e" position={[0, -16, -3]} />
        </group>
      )}
    </group>
  );
};

const SceneElements = ({ tier, prefersReducedMotion }) => {
  const scroll = useScroll();
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  
  const groupRef = useRef();
  const aiNodeRef = useRef();
  const dbRef = useRef();
  const codeRef = useRef();

  useFrame((state) => {
    const offset = scroll.offset; // 0 to 1
    const elapsedTime = state.clock.elapsedTime;
    
    // Only apply constant rotation if not reduced motion
    if (!prefersReducedMotion) {
      // 1. AINode
      if (aiNodeRef.current) {
        aiNodeRef.current.rotation.x += 0.002;
        aiNodeRef.current.rotation.y += 0.003;
      }

      // 2. DatabaseShape
      if (dbRef.current) {
        dbRef.current.rotation.y = elapsedTime * 0.2;
        dbRef.current.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
      }

      // 3. CodeBrackets
      if (codeRef.current) {
        codeRef.current.rotation.x += 0.002;
        codeRef.current.rotation.y += 0.003;
        codeRef.current.rotation.z += 0.001;
      }
    }

    // Parallax logic (Mouse + Scroll)
    const mouseX = state.pointer.x; 
    const mouseY = state.pointer.y; 

    // Rotate group based on scroll and mouse X
    const parallaxFactor = (tier === 'low' || isMobile || prefersReducedMotion) ? 0.05 : 0.15;
    const targetRotationY = (offset * Math.PI) + (mouseX * parallaxFactor);
    const targetRotationX = (mouseY * parallaxFactor);
    
    if (groupRef.current) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      
      // Slight vertical movement to make them feel alive with scroll, but not disappear
      const targetY = offset * 2; 
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={isMobile ? 0.45 : 0.7} position={isMobile ? [0, 1, 0] : [0, 0, 0]}>
      <group ref={aiNodeRef} position={[4, 3, -1]}>
        <AINode tier={tier} />
      </group>

      <group ref={dbRef} position={[-5, 0, -2]}>
        <DatabaseShape tier={tier} />
      </group>

      <group ref={codeRef} position={[4, -3, -1]}>
        <CodeBrackets />
      </group>
    </group>
  );
};


export default function DesktopCanvas({ tier, prefersReducedMotion, pages }) {
  const dpr = tier === 'high' ? [1, 1.5] : tier === 'mid' ? [0.75, 1] : [0.5, 0.75];

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={dpr} performance={{ min: 0.5 }}>
      <color attach="background" args={['#050505']} />
      
      <FixedBackground tier={tier} prefersReducedMotion={prefersReducedMotion} />

      <ScrollControls pages={pages} damping={0.25} distance={1.2}>
        <AmbientColorShift />
        <SceneElements tier={tier} prefersReducedMotion={prefersReducedMotion} />
        
        <Scroll html>
          <HTMLContent tier={tier} prefersReducedMotion={prefersReducedMotion} />
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
}
