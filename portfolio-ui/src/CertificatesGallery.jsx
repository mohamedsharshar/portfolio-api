
import React, { useState, useEffect } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

const CERTS = [
  "certificate_page-0001.jpg", "img103.jpg", "img110.jpg", "img117.jpg", "img124.jpg", "img131.jpg", 
  "img138.jpg", "img145.jpg", "img152.jpg", "img159.jpg", "img170.jpg", "img177.jpg", "img184.jpg", 
  "img191.jpg", "img227.jpg", "img236.jpg", "img243.jpg", "img96.jpg", "mhara_tech_page-0001.jpg", 
  "oracle.png", "python_tech_page-0001.jpg"
];

export default function CertificatesGallery() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(CERTS.length / 2));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, CERTS.length - 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      // Open in full if clicking the center active card
      window.open(`/certifications/${CERTS[index]}`, '_blank');
    } else {
      // Bring it to center
      setActiveIndex(index);
    }
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ perspective: '1500px' }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="absolute top-16 md:top-24 text-center z-50 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
          &lt;Certifications /&gt;
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm md:text-base animate-pulse">
          /* Select a certificate to view */
        </p>
      </div>

      <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center mt-20" style={{ transformStyle: 'preserve-3d' }}>
        {CERTS.map((cert, index) => {
          const diff = index - activeIndex;
          const absDiff = Math.abs(diff);
          
          // Don't render items too far away for performance and visual clarity
          if (absDiff > 5) return null;

          const zIndex = 50 - absDiff;
          const opacity = absDiff > 3 ? 0 : 1 - (absDiff * 0.2);
          
          // Calculations for Coverflow effect
          const translateX = diff * (isMobile ? 70 : 160);
          const rotateY = diff === 0 ? 0 : diff > 0 ? -40 : 40;
          const translateZ = diff === 0 ? 150 : -absDiff * 120;
          
          const isCenter = diff === 0;

          return (
            <div 
              key={index}
              className={`absolute rounded-xl border-2 overflow-hidden shadow-2xl transition-all duration-500 ease-out cursor-pointer select-none
                ${isCenter ? 'border-teal-400 shadow-[0_0_40px_rgba(45,212,191,0.4)]' : 'border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:border-indigo-400'}`}
              style={{
                width: isMobile ? '220px' : '380px',
                height: isMobile ? '160px' : '280px',
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                pointerEvents: opacity === 0 ? 'none' : 'auto',
              }}
              onClick={() => handleCardClick(index)}
            >
              <div className={`absolute inset-0 bg-indigo-900/30 transition-opacity duration-300 ${isCenter ? 'opacity-0' : 'opacity-100 group-hover:opacity-50'}`} />
              <img 
                src={`/certifications/${cert}`} 
                alt={`Certificate ${index}`}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
              
              {isCenter && (
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-500/50 text-teal-300 font-mono text-xs opacity-0 hover:opacity-100 transition-opacity flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  View Full
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 flex items-center gap-8 z-50">
        <button 
          onClick={handlePrev} 
          disabled={activeIndex === 0}
          className="p-3 rounded-full bg-black/50 border border-gray-700 text-white backdrop-blur-md hover:bg-indigo-600/50 hover:border-indigo-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <TbChevronLeft size={28} />
        </button>
        
        <div className="font-mono text-indigo-300 bg-black/50 px-6 py-2 rounded-full border border-gray-700 backdrop-blur-md">
          {activeIndex + 1} <span className="text-gray-500">/</span> {CERTS.length}
        </div>

        <button 
          onClick={handleNext} 
          disabled={activeIndex === CERTS.length - 1}
          className="p-3 rounded-full bg-black/50 border border-gray-700 text-white backdrop-blur-md hover:bg-indigo-600/50 hover:border-indigo-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <TbChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
