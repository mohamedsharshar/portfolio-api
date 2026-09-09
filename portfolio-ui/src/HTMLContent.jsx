import { useState, Suspense, lazy } from 'react';
import ParticleText from './ParticleText';
import GlowCard from './GlowCard';
import ProjectShowcase from './ProjectShowcase';

const CertificatesGallery = lazy(() => import('./CertificatesGallery'));

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
        className="mt-2 w-full px-4 md:px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-mono font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 flex justify-center items-center gap-2"
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
export default function HTMLContent({ tier, prefersReducedMotion, isMobile }) {
  return (
    <div className="w-screen flex flex-col text-white font-sans selection:bg-indigo-500/30">
      
      {/* 1. Hero Section */}
      <section id="hero" className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-6 pt-10 pb-20 relative">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center drop-shadow-2xl z-10">
          <div className="font-mono text-indigo-400 mb-4 tracking-widest text-sm">
            <span className="text-teal-400">const</span> <span className="text-white">developer</span> = 
          </div>
          
          <div className="w-full h-auto min-h-[6rem] sm:h-32 md:h-48 mb-4 flex items-center justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {prefersReducedMotion || tier === 'low' || isMobile ? (
               <h1 className="text-4xl min-[400px]:text-5xl sm:text-6xl md:text-7xl font-bold font-mono text-white text-center leading-tight">
                 <span className="block sm:inline">Mohamed </span>
                 <span className="block sm:inline">SharShar;</span>
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

          <h2 className="text-[10px] sm:text-xs md:text-sm font-mono tracking-widest sm:tracking-[0.4em] text-teal-300 mb-8 uppercase text-center w-full px-2">
            &lt; Laravel Backend Developer /&gt;
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-xl leading-relaxed max-w-3xl font-light border-l-2 border-indigo-500/50 pl-4 sm:pl-6 text-left bg-black/20 p-4 rounded-r-xl backdrop-blur-sm">
            <span className="text-indigo-400 font-mono text-sm block mb-2">// PROFESSIONAL SUMMARY</span>
            A skilled full stack developer specializing in Laravel and PHP, with experience building HRMS, payroll, e-commerce, and SaaS platforms for real clients. Demonstrated abilities in system design, database optimization, and integrating AI-powered automation using n8n, AI agents, and RAG workflows. Recognized for problem-solving, clean architecture, and delivering reliable systems that support complex business needs. Also experienced with Docker and Oracle SQL.
          </p>
          
          <a 
            href="/Mohamed_SharShar.pdf" 
            download 
            className="mt-10 px-4 sm:px-8 py-3 sm:py-4 bg-indigo-600/20 border border-indigo-500/50 backdrop-blur-md rounded-lg font-mono text-white text-[11px] sm:text-sm hover:bg-indigo-600/40 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-2 sm:gap-3 group"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            execute_download("CV.pdf")
          </a>

          <div className="absolute bottom-10 flex flex-col items-center animate-bounce opacity-50 font-mono text-xs text-gray-400 hidden md:flex">
            <span>System.out.println("Scroll")</span>
            <svg className="w-4 h-4 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </div>
        </div>
      </section>

      {/* 2. Experience Section */}
      <section id="experience" className="min-h-screen w-full flex items-center justify-start px-4 md:px-32 py-20">
        <GlowCard glowColor="99, 102, 241" className="max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-4 sm:p-6 md:p-10 rounded-2xl shadow-2xl transition-transform hover:-translate-y-2 duration-300">
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
      <section id="skills" className="min-h-screen w-full flex flex-col justify-center items-end px-4 md:px-32 py-20">
        <GlowCard glowColor="20, 184, 166" className="max-w-3xl bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-4 sm:p-6 md:p-10 rounded-2xl shadow-2xl transition-transform hover:-translate-y-2 duration-300">
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
      <section id="projects" className="py-20 w-full min-h-screen">
        <ProjectShowcase />
      </section>

      {/* 4.5 Certificates Section */}
      <section id="certificates" className="min-h-screen w-full relative py-20">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-teal-400 text-sm animate-pulse">Loading Certificates...</div>}>
          <CertificatesGallery />
        </Suspense>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-8 py-20 pb-32">
        <GlowCard glowColor="59, 130, 246" className="w-full max-w-[95%] xl:max-w-[85rem] bg-gray-900/40 backdrop-blur-xl border border-gray-700 p-4 sm:p-6 md:p-14 lg:p-16 rounded-3xl shadow-2xl border-t-4 border-t-blue-500">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-16">
            {/* Left Info Side */}
            <div className="flex flex-col justify-center text-left min-w-0 w-full">
              <h2 className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-lg break-words">
                Initialize.Contact()
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg mb-8 font-mono leading-relaxed">
                &gt; Open to collaboration, freelance work, and full-time opportunities. <br/> 
                &gt; Whether you have a project in mind or just want to talk code — my terminal is ready. <span className="animate-pulse text-indigo-400">_</span>
              </p>
              
              <div className="flex flex-col gap-3 sm:gap-4 mt-auto">
                <a href="mailto:mohamedsharshar624@gmail.com" className="flex items-center justify-center gap-3 px-4 sm:px-4 md:px-6 py-3 sm:py-4 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-xl font-mono text-sm font-bold text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  execute(Email)
                </a>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mohamedsharshaar" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/80 border border-gray-600 rounded-xl font-mono text-[10px] sm:text-xs font-bold text-white transition-all hover:scale-105">
                    GitHub.Repo
                  </a>
                  <a href="https://linkedin.com/in/mohamedsharshaar" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0a66c2]/20 hover:bg-[#0a66c2]/40 border border-[#0a66c2]/50 rounded-xl font-mono text-[10px] sm:text-xs font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(10,102,194,0.3)]">
                    LinkedIn.Connect()
                  </a>
                </div>
              </div>
            </div>

            {/* Right Form Side */}
            <div className="bg-black/50 p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-800 shadow-inner backdrop-blur-sm relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              <ContactForm />
            </div>
          </div>
        </GlowCard>
      </section>

    </div>
  );
}
