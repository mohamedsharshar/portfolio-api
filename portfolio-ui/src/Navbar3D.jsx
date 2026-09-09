import { useState, useEffect, useRef } from 'react';
import GooeyNav from './GooeyNav';

// ==========================================
// Navbar Component (Interactive 3D Hover & Active State)
// ==========================================
export default function Navbar3D({ isMobileView }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isNavigating = useRef(false);

  useEffect(() => {
    // Find the scroll container
    const interval = setInterval(() => {
      // If we are in mobile view without canvas, the scroll container might be different.
      // We will add an ID 'main-scroll-container' to our wrapper if not using 3D,
      // but if using 3D, @react-three/drei creates a div with overflow.
      const scrollDiv = document.getElementById('main-scroll-container') || 
                        Array.from(document.querySelectorAll('div')).find(d => d.style.overflowY === 'auto' || d.style.overflow === 'auto');
      
      if (scrollDiv) {
        clearInterval(interval);
        
        const handleScroll = () => {
          if (isNavigating.current) return;
          
          // ScrollControls uses 1.2 as distance multiplier per page. Standard is 1.0.
          const multiplier = isMobileView ? 1.0 : 1.2;
          const pageHeight = window.innerHeight * multiplier;
          const currentScroll = scrollDiv.scrollTop;
          
          // On mobile, the height of sections might be different due to content, so it's better to use actual section offsets if possible,
          // but assuming they are roughly 100vh we can use this logic or offsetTop.
          // Let's stick to the multiplier logic for now.
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
  }, [isMobileView]);

  const items = [
    { label: "Home", href: "#hero" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Certificates", href: "#certificates" },
    { label: "Contact", href: "#contact" }
  ];

  const handleItemClick = (idx) => {
    setActiveIdx(idx);
    setIsMobileMenuOpen(false);
    isNavigating.current = true;
    
    const scrollDiv = document.getElementById('main-scroll-container') || 
                      Array.from(document.querySelectorAll('div')).find(d => d.style.overflowY === 'auto' || d.style.overflow === 'auto');
    
    if (scrollDiv) {
      if (isMobileView) {
        // On mobile view (no Canvas), scroll to the element directly by ID
        const targetId = items[idx].href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          scrollDiv.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
        } else {
          // Fallback
          const scrollPos = idx * window.innerHeight;
          scrollDiv.scrollTo({ top: scrollPos, behavior: 'smooth' });
        }
      } else {
        // Desktop 3D view with ScrollControls
        const targetPage = idx;
        const scrollPos = targetPage * window.innerHeight * 1.2;
        scrollDiv.scrollTo({ top: scrollPos, behavior: 'smooth' });
      }
      
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
}
