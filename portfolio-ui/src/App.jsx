import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import ClickSpark from './ClickSpark';
import GooeyNav from './GooeyNav';
import ParticleText from './ParticleText';
import CertificatesGallery from './CertificatesGallery';

// Icons
import { SiPhp, SiLaravel, SiMysql, SiGithub, SiDocker, SiReact, SiNextdotjs, SiTailwindcss, SiPython, SiN8N, SiNodedotjs, SiMongodb } from 'react-icons/si';
import { TbApi } from 'react-icons/tb';

// ==========================================
// DATA: CV & Portfolio Content
// ==========================================
const SKILLS = [
  { name: 'PHP', icon: <SiPhp className="text-[#777BB4]" /> },
  { name: 'Laravel', icon: <SiLaravel className="text-[#FF2D20]" /> },
  { name: 'MySQL', icon: <SiMysql className="text-[#4479A1]" /> },
  { name: 'MongoDB', icon: <SiMongodb className="text-[#47A248]" /> },
  { name: 'RESTful APIs', icon: <TbApi className="text-gray-300" /> },
  { name: 'Node.js', icon: <SiNodedotjs className="text-[#339933]" /> },
  { name: 'React.js', icon: <SiReact className="text-[#61DAFB]" /> },
  { name: 'Next.js', icon: <SiNextdotjs className="text-white" /> },
  { name: 'Python', icon: <SiPython className="text-[#3776AB]" /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-[#06B6D4]" /> },
  { name: 'Git & GitHub', icon: <SiGithub className="text-white" /> },
  { name: 'Docker', icon: <SiDocker className="text-[#2496ED]" /> },
  { name: 'n8n Automation', icon: <SiN8N className="text-[#FF6D5A]" /> },
];

const EXPERIENCES = [
  {
    title: 'Backend Developer',
    company: 'Horizon IT – Satellite Services',
    period: 'Nov 2025 – Present',
    desc: 'Building smart digital solutions for GIS, satellite services, and remote sensing projects using modern web technologies.'
  },
  {
    title: 'Backend Developer',
    company: 'PureSoft',
    period: 'Jul 2025 – Dec 2025',
    desc: 'Designed and developed websites, mobile applications, and custom business systems, including POS solutions, for clients across various industries.'
  }
];

const PROJECTS = [
  {
    name: 'CoreWise',
    subtitle: 'Graduation Project | MNU',
    desc: 'Architected a multi-tenant HR & payroll platform for the MENA region with 52 models, 5-tier RBAC, and full Arabic/English/French localization. Integrated 8 n8n AI workflows (AI ATS, RAG HR chatbot).',
    tech: ['Laravel', 'MySQL', 'n8n AI', 'REST API']
  },
  {
    name: 'Taqawi',
    subtitle: 'Horizon IT - Satellite Services',
    desc: 'Architected a three-tier bilingual platform: a Laravel 12 REST API, a React 19 public site, and a Next.js 16 admin dashboard. Built interactive Chart.js analytics dashboards.',
    tech: ['Laravel 12', 'React 19', 'Next.js 16', 'Chart.js']
  },
  {
    name: 'Anany Audit & Assurance',
    subtitle: 'Corporate CMS',
    desc: 'Architected a bilingual CMS using the Repository-Service pattern across 23 models. Built a dual public/admin REST API integrated with Meilisearch and automated email notifications.',
    tech: ['Laravel', 'Meilisearch', 'REST API']
  },
  {
    name: 'Fsoal (Fosool)',
    subtitle: 'EdTech Platform',
    desc: 'Designed a modular monolith with 16 modules, 85+ models, and 190+ migrations. Built 4 role-based Filament admin panels, an auto-graded quiz engine, and live video via BigBlueButton.',
    tech: ['Laravel', 'Filament', 'BigBlueButton']
  },
  {
    name: 'Afaq Store',
    subtitle: 'Modular E-commerce',
    desc: 'Built a modular e-commerce platform (13 modules, 40 models) with a 30+ endpoint REST API secured via OAuth2. Implemented a 20-resource Filament admin panel.',
    tech: ['Laravel', 'OAuth2', 'Filament', 'OneSignal']
  }
];

// ==========================================
// 3D Programming Shapes
// ==========================================

const AINode = (props) => (
  <mesh {...props}>
    <torusKnotGeometry args={[1.5, 0.4, 100, 16]} />
    <meshStandardMaterial color="#3b82f6" wireframe />
  </mesh>
);

const DatabaseShape = (props) => (
  <group {...props}>
    {[1.5, 0, -1.5].map((y, i) => (
      <mesh key={i} position={[0, y, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 1.2, 12]} />
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
  const color = useRef(new THREE.Color(sectionColors[0]));

  useFrame(() => {
    const offset = scroll.offset; // 0 -> 1
    const sectionIndex = offset * (sectionColors.length - 1);
    const idx = Math.floor(sectionIndex);
    const t = sectionIndex - idx;
    const c1 = new THREE.Color(sectionColors[idx]);
    const c2 = new THREE.Color(sectionColors[Math.min(idx + 1, sectionColors.length - 1)]);
    color.current.lerpColors(c1, c2, t);

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

const FixedBackground = () => {
  const farStars = useRef();
  const nearStars = useRef();
  const nebula = useRef();

  useFrame((state, delta) => {
    if (farStars.current) farStars.current.rotation.y += delta * 0.015;
    if (nearStars.current) {
      nearStars.current.rotation.y -= delta * 0.04;
      nearStars.current.rotation.x += delta * 0.01;
    }
    if (nebula.current) nebula.current.rotation.z += delta * 0.008;
  });

  return (
    <group>
      <group ref={farStars}>
        <Stars radius={150} depth={80} count={3000} factor={2} saturation={0} fade speed={1} />
      </group>
      <group ref={nearStars}>
        <Stars radius={60} depth={30} count={2000} factor={3} saturation={0.2} fade speed={3} />
      </group>
      <group ref={nebula}>
        <Sparkles count={150} scale={20} size={3} speed={0.3} opacity={0.25} color="#6366f1" />
        <Sparkles count={150} scale={18} size={2} speed={0.5} opacity={0.2} color="#14b8a6" position={[0, -8, -5]} />
        <Sparkles count={100} scale={12} size={4} speed={0.2} opacity={0.15} color="#f43f5e" position={[0, -16, -3]} />
      </group>
    </group>
  );
};

const SceneElements = () => {
  const scroll = useScroll();
  const groupRef = useRef();
  const aiNodeRef = useRef();
  const dbRef = useRef();
  const codeRef = useRef();

  useFrame((state) => {
    const offset = scroll.offset; // 0 to 1
    const elapsedTime = state.clock.elapsedTime;
    
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

    // Parallax logic (Mouse + Scroll)
    const mouseX = state.pointer.x; 
    const mouseY = state.pointer.y; 

    // Rotate group based on scroll and mouse X
    const targetRotationY = (offset * Math.PI) + (mouseX * 0.15);
    const targetRotationX = (mouseY * 0.15);
    
    if (groupRef.current) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      
      // Slight vertical movement to make them feel alive with scroll, but not disappear
      const targetY = offset * 2; 
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={0.7}>
      <group ref={aiNodeRef} position={[4, 3, -1]}>
        <AINode />
      </group>

      <group ref={dbRef} position={[-5, 0, -2]}>
        <DatabaseShape />
      </group>

      <group ref={codeRef} position={[4, -3, -1]}>
        <CodeBrackets />
      </group>
    </group>
  );
};

// ==========================================
// GlowCard Component (Mouse Tracking Border Glow)
// ==========================================
const GlowCard = ({ children, className, glowColor = '99, 102, 241' }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--glow-x', `${x}px`);
    cardRef.current.style.setProperty('--glow-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group ${className}`}
      style={{
        '--glow-color': glowColor,
        '--glow-radius': '300px'
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(var(--glow-radius)_circle_at_var(--glow-x)_var(--glow-y),rgba(var(--glow-color),0.08)_0%,transparent_50%)]" />
      
      <div className="absolute inset-0 z-10 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500
        before:absolute before:inset-0 before:p-[2px] before:rounded-[inherit]
        before:bg-[radial-gradient(var(--glow-radius)_circle_at_var(--glow-x)_var(--glow-y),rgba(var(--glow-color),1)_0%,rgba(var(--glow-color),0.2)_30%,transparent_60%)]
        before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:[mask-composite:exclude] before:[-webkit-mask-composite:xor]"
      />
      
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
};

// ==========================================
// HTML Overlay Content
// ==========================================
const HTMLContent = () => {
  return (
    <div className="w-screen flex flex-col text-white font-sans selection:bg-indigo-500/30">
      
      {/* 1. Hero Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-6 pt-10 relative">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center drop-shadow-2xl z-10">
          <div className="font-mono text-indigo-400 mb-4 tracking-widest text-sm">
            <span className="text-teal-400">const</span> <span className="text-white">developer</span> = 
          </div>
          
          <div className="w-full h-32 md:h-48 mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <ParticleText
              text="Mohamed Sharshar;"
              particleSize={2.2}
              density={4}
              color="#ffffff"
              highlightColor="#6366f1"
              scatter={190}
              gatherDuration={1600}
              stagger={420}
              pointerRepel={42}
              repelRadius={120}
              idleDrift={0.8}
              trigger="mount"
              fontSize="clamp(3.5rem, 10vw, 8rem)"
              fontWeight={900}
              fontFamily="inherit"
              glow={true}
            />
          </div>

          <h2 className="text-xs md:text-sm font-mono tracking-[0.4em] text-teal-300 mb-8 uppercase">
            &lt; Laravel Backend Developer /&gt;
          </h2>
          <p className="text-gray-300 text-base md:text-xl leading-relaxed max-w-3xl font-light border-l-2 border-indigo-500/50 pl-6 text-left bg-black/20 p-4 rounded-r-xl backdrop-blur-sm">
            <span className="text-indigo-400 font-mono text-sm block mb-2">// PROFESSIONAL SUMMARY</span>
            Backend Developer specializing in PHP and Laravel, delivering scalable HRMS, payroll, e-commerce, and SaaS platforms with multi-tenancy, RESTful APIs, and AI-powered automation. Focused on clean architecture and building reliable, high-quality systems.
          </p>
          
          <a 
            href="/Mohamed_Sharshar_CV.pdf" 
            download 
            className="mt-10 px-8 py-4 bg-indigo-600/20 border border-indigo-500/50 backdrop-blur-md rounded-lg font-mono text-white text-sm hover:bg-indigo-600/40 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-3 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            execute_download("CV.pdf")
          </a>

          <div className="absolute bottom-10 flex flex-col items-center animate-bounce opacity-50 font-mono text-xs text-gray-400">
            <span>System.out.println("Scroll")</span>
            <svg className="w-4 h-4 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </div>
        </div>
      </section>

      {/* 2. Experience Section */}
      <section className="h-screen w-full flex items-center justify-start px-8 md:px-32">
        <GlowCard glowColor="99, 102, 241" className="max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-8 md:p-10 rounded-2xl shadow-2xl transition-transform hover:-translate-y-2 duration-300">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            class <span className="text-white">Experience</span> {'{'}
          </h2>
          <div className="space-y-8 pl-4 border-l border-gray-700">
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className="relative pl-6">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                <h4 className="text-teal-400 font-mono text-sm mb-1">{exp.company}</h4>
                <p className="text-xs text-gray-500 mb-3 tracking-widest font-mono">/* {exp.period} */</p>
                <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-6 font-mono text-gray-600">
            {'}'}
          </h2>
        </GlowCard>
      </section>

      {/* 3. Skills & Languages Section */}
      <section className="h-screen w-full flex flex-col justify-center items-end px-8 md:px-32">
        <GlowCard glowColor="20, 184, 166" className="max-w-3xl bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-8 md:p-10 rounded-2xl shadow-2xl transition-transform hover:-translate-y-2 duration-300">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 text-right">
            &lt;CoreSkills /&gt;
          </h2>
          <div className="flex flex-wrap justify-end gap-3 md:gap-4 mb-10">
            {SKILLS.map(skill => (
              <div key={skill.name} className="px-5 py-3 rounded-xl border border-gray-700 bg-black/50 flex items-center gap-3 hover:border-teal-500/50 hover:bg-teal-900/20 transition-all duration-300 cursor-default group">
                <span className="text-xl group-hover:scale-110 transition-transform">{skill.icon}</span>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white font-mono">{skill.name}</span>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-mono mb-4 text-indigo-400 text-right">// Languages</h3>
          <div className="flex flex-wrap justify-end gap-4">
            <div className="px-4 py-2 border border-gray-700 rounded-lg bg-black/50 text-sm font-mono flex items-center gap-2">
              <span className="text-lg">🇪🇬</span> <span className="text-gray-300">Arabic (Native)</span>
            </div>
            <div className="px-4 py-2 border border-gray-700 rounded-lg bg-black/50 text-sm font-mono flex items-center gap-2">
              <span className="text-lg">🇺🇸</span> <span className="text-gray-300">English (B2)</span>
            </div>
          </div>
        </GlowCard>
      </section>

      {/* 4. Projects */}
      {PROJECTS.map((project, idx) => (
        <section key={project.name} className={`h-screen w-full flex items-center ${idx % 2 === 0 ? 'justify-start pl-8 md:pl-32' : 'justify-end pr-8 md:pr-32'}`}>
          <GlowCard glowColor="244, 63, 94" className="max-w-xl bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform hover:scale-[1.02] duration-500">
            <div className="text-indigo-400 font-mono text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              0{idx + 1} // EXECUTE
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md group-hover:text-indigo-300 transition-colors">
              {project.name}
            </h3>
            <p className="text-teal-400 font-mono text-xs tracking-widest uppercase mb-6">{project.subtitle}</p>
            <p className="text-gray-300 leading-relaxed mb-8 font-light text-base bg-black/20 p-4 rounded-lg border-l-2 border-teal-500/30">
              {project.description || project.desc}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tech.map(t => (
                <span key={t} className="text-xs px-3 py-1.5 bg-black/80 border border-gray-700 text-gray-300 rounded-md font-mono">
                  {t}
                </span>
              ))}
            </div>
          </GlowCard>
        </section>
      ))}

      {/* 4.5 Certificates Section */}
      <section className="h-screen w-full relative">
        <CertificatesGallery />
      </section>

      {/* 5. Contact Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-4 md:px-8">
        <GlowCard glowColor="59, 130, 246" className="w-full max-w-[95%] xl:max-w-[85rem] bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-8 md:p-14 lg:p-16 rounded-3xl shadow-2xl border-t-4 border-t-blue-500">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-16">
            {/* Left Info Side */}
            <div className="flex flex-col justify-center text-left min-w-0">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-lg break-all">
                Initialize.Contact()
              </h2>
              <p className="text-gray-400 text-sm md:text-base lg:text-lg mb-8 font-mono leading-relaxed">
                &gt; Open to collaboration, freelance work, and full-time opportunities. <br/> 
                &gt; Whether you have a project in mind or just want to talk code — my terminal is ready. <span className="animate-pulse text-indigo-400">_</span>
              </p>
              
              <div className="flex flex-col gap-4 mt-auto">
                <a href="mailto:mohamedsharshar624@gmail.com" className="flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-xl font-mono text-sm font-bold text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  execute(Email)
                </a>
                <div className="flex gap-4">
                  <a href="https://github.com/mohamedsharshaar" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/80 border border-gray-600 rounded-xl font-mono text-xs font-bold text-white transition-all hover:scale-105">
                    GitHub.Repo
                  </a>
                  <a href="https://linkedin.com/in/mohamedsharshaar" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0a66c2]/20 hover:bg-[#0a66c2]/40 border border-[#0a66c2]/50 rounded-xl font-mono text-xs font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(10,102,194,0.3)]">
                    LinkedIn.Connect()
                  </a>
                </div>
              </div>
            </div>

            {/* Right Form Side */}
            <div className="bg-black/50 p-6 md:p-8 rounded-2xl border border-gray-800 shadow-inner backdrop-blur-sm relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              <form className="flex flex-col gap-4 md:gap-5 relative z-10" onSubmit={(e) => { e.preventDefault(); e.target.reset(); }}>
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-xs font-mono text-gray-400 ml-1">const name =</label>
                  <input type="text" placeholder="'Enter your name'" className="w-full bg-gray-900/80 border border-gray-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors" required />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-xs font-mono text-gray-400 ml-1">const email =</label>
                  <input type="email" placeholder="'Enter your email'" className="w-full bg-gray-900/80 border border-gray-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors" required />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-xs font-mono text-gray-400 ml-1">const message =</label>
                  <textarea placeholder="'How can we help each other?'" rows="3" className="w-full bg-gray-900/80 border border-gray-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors resize-none" required></textarea>
                </div>
                <button type="submit" className="mt-2 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 flex justify-center items-center gap-2">
                  <span>await</span> sendMessage()
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </form>
            </div>
          </div>
        </GlowCard>
      </section>

    </div>
  );
};

// ==========================================
// ==========================================
// Navbar Component (Interactive 3D Hover & Active State)
// ==========================================
const Navbar3D = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const isNavigating = useRef(false);

  useEffect(() => {
    // Find the scroll container created by @react-three/drei's ScrollControls
    const interval = setInterval(() => {
      const scrollDiv = Array.from(document.querySelectorAll('div')).find(d => d.style.overflowY === 'auto' || d.style.overflow === 'auto');
      if (scrollDiv) {
        clearInterval(interval);
        
        const handleScroll = () => {
          if (isNavigating.current) return;
          
          // ScrollControls uses 1.2 as distance multiplier per page
          const pageHeight = window.innerHeight * 1.2;
          const currentScroll = scrollDiv.scrollTop;
          const activePage = Math.round(currentScroll / pageHeight);
          
          if (activePage === 0) setActiveIdx(0);
          else if (activePage === 1) setActiveIdx(1);
          else if (activePage === 2) setActiveIdx(2);
          else if (activePage >= 3 && activePage < 3 + PROJECTS.length) setActiveIdx(3);
          else if (activePage === 3 + PROJECTS.length) setActiveIdx(4);
          else setActiveIdx(5);
        };
        
        scrollDiv.addEventListener('scroll', handleScroll);
        handleScroll(); // initialize
        return () => scrollDiv.removeEventListener('scroll', handleScroll);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Home", href: "#" },
    { label: "Experience", href: "#" },
    { label: "Skills", href: "#" },
    { label: "Projects", href: "#" },
    { label: "Certificates", href: "#" },
    { label: "Contact", href: "#" }
  ];

  const handleItemClick = (idx) => {
    setActiveIdx(idx);
    isNavigating.current = true;
    
    const scrollDiv = Array.from(document.querySelectorAll('div')).find(d => d.style.overflowY === 'auto' || d.style.overflow === 'auto');
    if (scrollDiv) {
      const targetPage = idx === 0 ? 0 : idx === 1 ? 1 : idx === 2 ? 2 : idx === 3 ? 3 : idx === 4 ? (3 + PROJECTS.length) : (4 + PROJECTS.length);
      const scrollPos = targetPage * window.innerHeight * 1.2;
      scrollDiv.scrollTo({ top: scrollPos, behavior: 'smooth' });
      
      setTimeout(() => {
        isNavigating.current = false;
      }, 1000);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-full max-w-6xl px-4" style={{ perspective: '1000px' }}>
      <nav 
        className="flex justify-between items-center px-4 md:px-8 py-2 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Logo */}
        <div className="font-mono text-xl font-black text-white hidden md:block">
          <span className="text-indigo-500">~/</span>MS<span className="animate-pulse text-teal-400">_</span>
        </div>

        {/* Links */}
        <div className="mx-auto md:mx-0">
          <GooeyNav
            items={items}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            activeIndex={activeIdx}
            onItemClick={handleItemClick}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
      </nav>
    </div>
  );
};

// ==========================================
// Main App Component
// ==============================================================
export default function App() {
  const pages = 1 + 1 + 1 + PROJECTS.length + 1 + 1; // Hero + Exp + Skills + Projects + Certificates + Contact

  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkSize={20}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="w-screen h-screen bg-[#050505] overflow-hidden relative font-sans">
      <Navbar3D />
      
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        
        <FixedBackground />

        <ScrollControls pages={pages} damping={0.25} distance={1.2}>
          <AmbientColorShift />
          <SceneElements />
          
          <Scroll html>
            <HTMLContent />
          </Scroll>
        </ScrollControls>

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.4} mipmapBlur intensity={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
    </ClickSpark>
  );
}