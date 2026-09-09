import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import { TbChevronLeft, TbChevronRight, TbHandClick } from 'react-icons/tb';

export default function ProjectCarousel({ projects, onProjectClick, prefersReducedMotion }) {
  const containerRef = useRef(null);
  
  const [radius, setRadius] = useState(0);
  const [currAngle, setCurrAngle] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardHeight, setCardHeight] = useState(420);
  
  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const dragDistance = useRef(0);
  
  // To handle CSS transition toggle during drag
  const [isTransitioning, setIsTransitioning] = useState(true);

  const numProjects = projects.length;
  const theta = numProjects > 0 ? 360 / numProjects : 0;

  // Calculate radius based on container width and number of projects
  useEffect(() => {
    const handleResize = () => {
      if (numProjects === 0) return;
      const width = window.innerWidth;
      
      let newCardWidth = 440;
      let newCardHeight = 560;
      if (width < 640) {
        newCardWidth = 320;
        newCardHeight = 460;
      } else if (width < 1024) {
        newCardWidth = 380;
        newCardHeight = 510;
      }

      // radius = (cardWidth / 2) / Math.tan(Math.PI / numProjects) + gap
      const gap = width < 640 ? 30 : 60; // Increased gap for better spacing
      let calcRadius = Math.round((newCardWidth / 2) / Math.tan(Math.PI / numProjects)) + gap;
      
      // Prevent radius from being too small if there are very few projects
      if (numProjects < 3) {
        calcRadius = newCardWidth;
      }
      
      setCardWidth(newCardWidth);
      setCardHeight(newCardHeight);
      setRadius(calcRadius);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [numProjects]);

  // Reset angle when projects change (e.g. category filter changes)
  useEffect(() => {
    setCurrAngle(0);
  }, [numProjects]);

  // --- Drag Logic ---
  const handleDragStart = useCallback((e) => {
    if (prefersReducedMotion || numProjects === 0) return;
    isDragging.current = true;
    startX.current = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    currentX.current = startX.current;
    dragDistance.current = 0;
    setIsTransitioning(false); // disable transition during drag for 1:1 movement
  }, [prefersReducedMotion, numProjects]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging.current) return;
    const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const deltaX = x - currentX.current;
    currentX.current = x;
    dragDistance.current += Math.abs(deltaX);
    
    // Adjust sensitivity
    setCurrAngle(prev => prev + deltaX * 0.4);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsTransitioning(true); // re-enable smooth transition
    
    // Snap to nearest card
    setCurrAngle(prev => Math.round(prev / theta) * theta);
  }, [theta]);

  // Attach global event listeners for mouse/touch move and end
  useEffect(() => {
    const handleGlobalMove = (e) => handleDragMove(e);
    const handleGlobalEnd = (e) => handleDragEnd(e);

    if (isDragging.current) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('touchmove', handleGlobalMove, { passive: true });
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [handleDragMove, handleDragEnd, isDragging.current]); // Re-bind when dragging state changes


  const rotateTo = (direction) => {
    if (prefersReducedMotion || numProjects === 0) return;
    setIsTransitioning(true);
    setCurrAngle(prev => direction === 'next' ? prev - theta : prev + theta);
  };

  const handleCardClick = (project) => {
    // Prevent click if we were dragging
    if (dragDistance.current > 10) return;
    onProjectClick(project);
  };

  if (numProjects === 0) return null;

  return (
    <div className="relative w-full h-[65vh] md:h-[80vh] flex items-center justify-center overflow-hidden touch-none" ref={containerRef}>
      
      {/* 3D Scene Container */}
      <div 
        className="w-full h-full flex justify-center items-center relative z-10"
        style={{ perspective: '1200px', marginTop: '50px' }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* The rotating carousel cylinder */}
        <div
          className="absolute w-full h-full cursor-grab active:cursor-grabbing"
          style={{
            transformStyle: 'preserve-3d',
            transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
            transform: `translateZ(${-radius}px) rotateY(${currAngle}deg)`,
          }}
        >
          {projects.map((project, index) => {
            const angle = index * theta;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleCardClick}
                width={cardWidth}
                height={cardHeight}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20 pointer-events-auto">
        <button 
          onClick={() => rotateTo('prev')}
          className="p-3 bg-black/50 hover:bg-indigo-600/30 border border-gray-700 hover:border-indigo-500 rounded-full text-white transition-all backdrop-blur-md group"
          aria-label="Previous project"
        >
          <TbChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        
        {/* Swipe Indicator */}
        <div className="flex items-center gap-2 text-gray-400 font-mono text-xs opacity-50 md:opacity-100 select-none">
          <TbHandClick className="w-4 h-4 animate-pulse" />
          <span className="hidden md:inline">Drag to rotate</span>
          <span className="md:hidden">Swipe</span>
        </div>

        <button 
          onClick={() => rotateTo('next')}
          className="p-3 bg-black/50 hover:bg-indigo-600/30 border border-gray-700 hover:border-indigo-500 rounded-full text-white transition-all backdrop-blur-md group"
          aria-label="Next project"
        >
          <TbChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
