import { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Stars, Sparkles } from '@react-three/drei';
import { Color } from 'three';
import ClickSpark from './ClickSpark';
import GooeyNav from './GooeyNav';
import ParticleText from './ParticleText';
import { useDevicePerformance } from './useDevicePerformance';
import GlowCard from './GlowCard';
import CertificatesGallery from './CertificatesGallery';
import ProjectShowcase from './ProjectShowcase';

// Icons
import { SiPhp, SiLaravel, SiMysql, SiGithub, SiDocker, SiReact, SiNextdotjs, SiTailwindcss, SiPython, SiN8N, SiNodedotjs, SiMongodb, SiHtml5, SiCss, SiJavascript, SiBootstrap } from 'react-icons/si';
import { TbApi, TbRobot, TbBrain, TbMessages, TbBug, TbUsers, TbBulb, TbDatabase } from 'react-icons/tb';

// ==========================================
// DATA: CV & Portfolio Content
// ==========================================
const SKILLS = [
  {
    category: "Backend Development",
    items: [
      { name: 'PHP', icon: <SiPhp className="text-[#777BB4]" /> },
      { name: 'Laravel', icon: <SiLaravel className="text-[#FF2D20]" /> },
      { name: 'Node.js', icon: <SiNodedotjs className="text-[#339933]" /> },
      { name: 'Python', icon: <SiPython className="text-[#3776AB]" /> },
    ]
  },
  {
    category: "Frontend Development",
    items: [
      { name: 'HTML', icon: <SiHtml5 className="text-[#E34F26]" /> },
      { name: 'CSS', icon: <SiCss className="text-[#1572B6]" /> },
      { name: 'JS', icon: <SiJavascript className="text-[#F7DF1E]" /> },
      { name: 'React.js', icon: <SiReact className="text-[#61DAFB]" /> },
      { name: 'Next.js', icon: <SiNextdotjs className="text-white" /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-[#06B6D4]" /> },
      { name: 'Bootstrap', icon: <SiBootstrap className="text-[#7952B3]" /> },
    ]
  },
  {
    category: "APIs & Integration",
    items: [
      { name: 'RESTful APIs', icon: <TbApi className="text-gray-300" /> },
      { name: 'Third-Party Integration', icon: <TbApi className="text-indigo-400" /> },
    ]
  },
  {
    category: "Databases",
    items: [
      { name: 'MySQL', icon: <SiMysql className="text-[#4479A1]" /> },
      { name: 'MongoDB', icon: <SiMongodb className="text-[#47A248]" /> },
      { name: 'Oracle SQL', icon: <TbDatabase className="text-[#F80000]" /> },
      { name: 'Query Optimization', icon: <SiMysql className="text-gray-400" /> },
    ]
  },
  {
    category: "AI & Automation",
    items: [
      { name: 'n8n Automation', icon: <SiN8N className="text-[#FF6D5A]" /> },
      { name: 'AI Agents', icon: <TbRobot className="text-teal-400" /> },
      { name: 'RAG', icon: <TbBrain className="text-purple-400" /> },
      { name: 'Machine Learning', icon: <SiPython className="text-[#3776AB]" /> },
    ]
  },
  {
    category: "DevOps & Tools",
    items: [
      { name: 'Docker', icon: <SiDocker className="text-[#2496ED]" /> },
      { name: 'Git & GitHub', icon: <SiGithub className="text-white" /> },
    ]
  },
  {
    category: "Soft Skills",
    items: [
      { name: 'Problem Solving', icon: <TbBulb className="text-yellow-400" /> },
      { name: 'Debugging', icon: <TbBug className="text-red-400" /> },
      { name: 'Team Collaboration', icon: <TbUsers className="text-blue-400" /> },
      { name: 'Agile Basics', icon: <TbMessages className="text-green-400" /> },
    ]
  }
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

// ==========================================


// ==========================================
// Contact Form Component
// ==========================================
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus({ loading: true, message: '', type: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ loading: false, message: 'Message sent successfully!', type: 'success' });
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        setStatus({ loading: false, message: data.error || 'Failed to send message.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, message: 'Network error. Please try again.', type: 'error' });
    }
    
    // Clear status message after 5 seconds
    setTimeout(() => {
      setStatus({ loading: false, message: '', type: '' });
    }, 5000);
  };

  return (
    <form className="flex flex-col gap-4 md:gap-5 relative z-10" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-2 text-left">
        <label className="text-xs font-mono text-gray-400 ml-1">const name =</label>
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="'Enter your name'" 
          className={`w-full bg-gray-900/80 border ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'} rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors`}
        />
        {errors.name && <span className="text-xs font-mono text-red-400 ml-1">// {errors.name}</span>}
      </div>
      <div className="flex flex-col gap-2 text-left">
        <label className="text-xs font-mono text-gray-400 ml-1">const email =</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="'Enter your email'" 
          className={`w-full bg-gray-900/80 border ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'} rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors`}
        />
        {errors.email && <span className="text-xs font-mono text-red-400 ml-1">// {errors.email}</span>}
      </div>
      <div className="flex flex-col gap-2 text-left">
        <label className="text-xs font-mono text-gray-400 ml-1">const message =</label>
        <textarea 
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="'How can we help each other?'" 
          rows="3" 
          className={`w-full bg-gray-900/80 border ${errors.message ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'} rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors resize-none`}
        ></textarea>
        {errors.message && <span className="text-xs font-mono text-red-400 ml-1">// {errors.message}</span>}
      </div>
      
      {status.message && (
        <div className={`text-sm font-mono p-2 rounded-md ${status.type === 'success' ? 'text-teal-400 bg-teal-900/20 border border-teal-500/30' : 'text-red-400 bg-red-900/20 border border-red-500/30'}`}>
          {status.type === 'success' ? '/* ' + status.message + ' */' : '// Error: ' + status.message}
        </div>
      )}

      <button 
        type="submit" 
        disabled={status.loading}
        className="mt-2 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-mono font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 flex justify-center items-center gap-2"
      >
        <span>await</span> {status.loading ? 'sending...' : 'sendMessage()'}
        {!status.loading && <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
      </button>
    </form>
  );
};

// ==========================================
// HTML Overlay Content
// ==========================================
const HTMLContent = ({ tier, prefersReducedMotion }) => {
  return (
    <div className="w-screen flex flex-col text-white font-sans selection:bg-indigo-500/30">
      
      {/* 1. Hero Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-6 pt-10 relative">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center drop-shadow-2xl z-10">
          <div className="font-mono text-indigo-400 mb-4 tracking-widest text-sm">
            <span className="text-teal-400">const</span> <span className="text-white">developer</span> = 
          </div>
          
          <div className="w-full h-24 sm:h-32 md:h-48 mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {prefersReducedMotion || tier === 'low' ? (
               <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-mono text-white text-center">
                 Mohamed SharShar;
               </h1>
            ) : (
              <ParticleText
                text="Mohamed SharShar;"
                particleSize={tier === 'high' ? 3.5 : 4.5}
                density={tier === 'high' ? 3 : 5}
                color="#ffffff"
                highlightColor="#6366f1"
                scatter={190}
                gatherDuration={1600}
                stagger={420}
                pointerRepel={42}
                repelRadius={120}
                idleDrift={0.8}
                trigger="mount"
                fontSize="clamp(1.2rem, 7vw, 7rem)"
              fontWeight={900}
              fontFamily="inherit"
              glow={true}
            />
            )}
          </div>

          <h2 className="text-xs md:text-sm font-mono tracking-[0.4em] text-teal-300 mb-8 uppercase">
            &lt; Laravel Backend Developer /&gt;
          </h2>
          <p className="text-gray-300 text-base md:text-xl leading-relaxed max-w-3xl font-light border-l-2 border-indigo-500/50 pl-6 text-left bg-black/20 p-4 rounded-r-xl backdrop-blur-sm">
            <span className="text-indigo-400 font-mono text-sm block mb-2">// PROFESSIONAL SUMMARY</span>
            A skilled full stack developer specializing in Laravel and PHP, with experience building HRMS, payroll, e-commerce, and SaaS platforms for real clients. Demonstrated abilities in system design, database optimization, and integrating AI-powered automation using n8n, AI agents, and RAG workflows. Recognized for problem-solving, clean architecture, and delivering reliable systems that support complex business needs. Also experienced with Docker and Oracle SQL.
          </p>
          
          <a 
            href="/Mohamed_SharShar.pdf" 
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
      <section className="h-screen w-full flex items-center justify-start px-6 md:px-32">
        <GlowCard glowColor="99, 102, 241" className="max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-6 md:p-10 rounded-2xl shadow-2xl transition-transform hover:-translate-y-2 duration-300">
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
      <section className="h-screen w-full flex flex-col justify-center items-end px-6 md:px-32">
        <GlowCard glowColor="20, 184, 166" className="max-w-3xl bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-6 md:p-10 rounded-2xl shadow-2xl transition-transform hover:-translate-y-2 duration-300">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 text-right">
            &lt;CoreSkills /&gt;
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8 w-full">
            {SKILLS.map(category => (
              <div key={category.category} className="flex flex-col items-end">
                <h3 className="text-sm font-mono text-indigo-400 mb-3">// {category.category}</h3>
                <div className="flex flex-wrap justify-end gap-2">
                  {category.items.map(skill => (
                    <div key={skill.name} className="px-3 py-2 rounded-lg border border-gray-700 bg-black/50 flex items-center gap-2 hover:border-teal-500/50 hover:bg-teal-900/20 transition-all duration-300 cursor-default group">
                      <span className="text-lg group-hover:scale-110 transition-transform">{skill.icon}</span>
                      <span className="text-xs font-medium text-gray-300 group-hover:text-white font-mono whitespace-nowrap">{skill.name}</span>
                    </div>
                  ))}
                </div>
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

      {/* 4. Projects Showcase */}
      <ProjectShowcase />

      {/* 4.5 Certificates Section */}
      <section className="h-screen w-full relative">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-teal-400 text-sm animate-pulse">Loading Certificates...</div>}>
          <CertificatesGallery />
        </Suspense>
      </section>

      {/* 5. Contact Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-4 md:px-8">
        <GlowCard glowColor="59, 130, 246" className="w-full max-w-[95%] xl:max-w-[85rem] bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-6 md:p-14 lg:p-16 rounded-3xl shadow-2xl border-t-4 border-t-blue-500">
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
              <ContactForm />
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          else if (activePage === 3) setActiveIdx(3);
          else if (activePage === 4) setActiveIdx(4);
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
    setIsMobileMenuOpen(false);
    isNavigating.current = true;
    
    const scrollDiv = Array.from(document.querySelectorAll('div')).find(d => d.style.overflowY === 'auto' || d.style.overflow === 'auto');
    if (scrollDiv) {
      const targetPage = idx;
      const scrollPos = targetPage * window.innerHeight * 1.2;
      scrollDiv.scrollTo({ top: scrollPos, behavior: 'smooth' });
      
      setTimeout(() => {
        isNavigating.current = false;
      }, 1000);
    }
  };

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-full max-w-6xl px-4" style={{ perspective: '1000px' }}>
        <nav 
          className="flex justify-between items-center px-6 md:px-8 py-3 md:py-2 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Logo */}
          <div className="font-mono text-xl font-black text-white">
            <span className="text-indigo-500">~/</span>MS<span className="animate-pulse text-teal-400">_</span>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="block md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-white focus:outline-none flex flex-col justify-center items-center w-8 h-8 z-50 relative group"
            >
              <span className={`bg-teal-400 h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[6px]' : '-translate-y-1'}`} />
              <span className={`bg-teal-400 h-0.5 w-6 rounded-sm transition-all duration-300 ease-out my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`bg-teal-400 h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : 'translate-y-1'}`} />
            </button>
          </div>

          {/* Links (Desktop) */}
          <div className="hidden md:block mx-auto md:mx-0">
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl transition-all duration-500 ease-in-out md:hidden flex flex-col items-center justify-center ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        style={{ perspective: '1000px' }}
      >
        <div className="flex flex-col gap-6 items-center w-full px-8">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={`w-full py-4 text-2xl font-mono font-bold transition-all duration-500 flex items-center justify-center gap-4 ${isMobileMenuOpen ? 'opacity-100 translate-y-0 rotateX-0' : 'opacity-0 translate-y-12 rotate-x-90'} ${activeIdx === idx ? 'text-teal-400 bg-white/5 rounded-2xl shadow-[inset_0_0_20px_rgba(45,212,191,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl'}`}
              style={{ transitionDelay: `${isMobileMenuOpen ? idx * 100 : 0}ms`, transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
            >
              {activeIdx === idx && <span className="text-indigo-500 text-lg">&gt;</span>}
              {item.label}
              {activeIdx === idx && <span className="text-teal-400 animate-pulse">_</span>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

// ==========================================
// Main App Component
// ==============================================================
export default function App() {
  const pages = 6.5; // Hero + Exp + Skills + Projects + Certificates + Contact
  
  const { tier, prefersReducedMotion } = useDevicePerformance();

  // Adapt Canvas DPR based on tier
  const dpr = tier === 'high' ? [1, 1.5] : tier === 'mid' ? [0.75, 1] : [0.5, 0.75];

  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkSize={20}
      sparkRadius={15}
      sparkCount={tier === 'low' ? 0 : tier === 'mid' ? 4 : 8}
      duration={400}
    >
      <div className="w-screen h-screen bg-[#050505] overflow-hidden relative font-sans">
      <Navbar3D />
      
      <Suspense fallback={<div className="absolute inset-0 z-10 flex items-center justify-center font-mono text-teal-400 bg-[#050505] text-sm animate-pulse">Initializing System...</div>}>
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
      </Suspense>
    </div>
    </ClickSpark>
  );
}