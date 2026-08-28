import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Environment, Float, Stars, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { projects, specialLandmarks } from './data/projects';

// Extract the 'about' and 'skills' from specialLandmarks
const aboutData = specialLandmarks.find(lm => lm.id === 'about');
const skillsData = specialLandmarks.find(lm => lm.id === 'skills');
const contactData = specialLandmarks.find(lm => lm.id === 'contact');

// Scene Background elements that react to scroll
const BackgroundShapes = () => {
  const scroll = useScroll();
  const groupRef = useRef();

  useFrame((state, delta) => {
    // Rotate the whole group slightly based on scroll
    const offset = scroll.offset;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      offset * Math.PI * 2,
      0.1
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      offset * Math.PI,
      0.1
    );
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[4, 2, -5]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#6366f1" wireframe />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-5, -1, -8]}>
          <icosahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#14b8a6" wireframe opacity={0.5} transparent />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={1.5} floatIntensity={1}>
        <mesh position={[3, -4, -6]}>
          <torusGeometry args={[1.2, 0.4, 16, 32]} />
          <meshStandardMaterial color="#f43f5e" wireframe opacity={0.3} transparent />
        </mesh>
      </Float>
    </group>
  );
};

// 3D Text Headers that appear in space
const Title3D = () => {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        position={[0, 0, -3]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        Mohamed SharShar
      </Text>
      <Text
        position={[0, -0.8, -3]}
        fontSize={0.3}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        FULL-STACK DEVELOPER & AI ENTHUSIAST
      </Text>
    </Float>
  );
};

const HTMLContent = () => {
  return (
    <div className="w-screen flex flex-col text-white font-sans selection:bg-indigo-500/30">
      
      {/* 1. Hero Section */}
      <section className="h-screen w-full flex flex-col items-center justify-end pb-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            {aboutData.description}
          </p>
          <div className="mt-8 animate-bounce opacity-50">
            ↓ Scroll to explore
          </div>
        </div>
      </section>

      {/* 2. Skills Section */}
      <section className="h-screen w-full flex items-center justify-start px-12 md:px-32">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">
            Expertise
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {skillsData.description.split('·')[0]}
            <br/><br/>
            {skillsData.description.split('·')[1]}
            <br/><br/>
            {skillsData.description.split('·')[2]}
          </p>
          <div className="flex flex-wrap gap-4">
            {skillsData.skills.map(skill => (
              <div key={skill.name} className="px-4 py-2 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm flex items-center gap-2">
                <span>{skill.icon}</span>
                <span className="text-sm font-medium">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Projects */}
      {projects.map((project, idx) => (
        <section key={project.id} className={`h-screen w-full flex items-center ${idx % 2 === 0 ? 'justify-end pr-12 md:pr-32' : 'justify-start pl-12 md:pl-32'}`}>
          <div className="max-w-xl bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-2xl transition-transform hover:scale-105 duration-300">
            <h3 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              {project.name}
            </h3>
            <p className="text-indigo-400 font-medium mb-6">{project.subtitle}</p>
            <p className="text-gray-300 leading-relaxed mb-8">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map(t => (
                <span key={t} className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            {project.link !== '#' && (
              <a href={project.link} target="_blank" rel="noreferrer" className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                View Project ↗
              </a>
            )}
          </div>
        </section>
      ))}

      {/* 4. Contact Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Let's Connect
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
          {contactData.description}
        </p>
        <div className="flex gap-6">
          <a href={`mailto:${contactData.contact.email}`} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-all hover:-translate-y-1">
            Email Me
          </a>
          <a href={contactData.contact.github} target="_blank" rel="noreferrer" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-all hover:-translate-y-1">
            GitHub
          </a>
          <a href={contactData.contact.linkedin} target="_blank" rel="noreferrer" className="px-8 py-4 bg-blue-700 hover:bg-blue-600 rounded-xl font-bold transition-all hover:-translate-y-1">
            LinkedIn
          </a>
        </div>
      </section>

    </div>
  );
};

export default function App() {
  // Total pages = Hero(1) + Skills(1) + Projects(projects.length) + Contact(1)
  const pages = 1 + 1 + projects.length + 1;

  return (
    <div className="w-screen h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} scale={15} size={2} speed={0.4} opacity={0.2} color="#ffffff" />

        <ScrollControls pages={pages} damping={0.25} distance={1.2}>
          <Scroll>
            <Title3D />
            <BackgroundShapes />
          </Scroll>
          <Scroll html>
            <HTMLContent />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}