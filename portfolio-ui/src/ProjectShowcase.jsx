import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { projects, categories } from './data/projects';
import { useDevicePerformance } from './useDevicePerformance';
import ProjectCarousel from './ProjectCarousel';
import ProjectModal from './ProjectModal';



export default function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const { prefersReducedMotion } = useDevicePerformance();

  const filteredProjects = projects.filter(p => 
    activeCategory === "All" ? true :
    activeCategory === "Featured" ? p.featured :
    p.categories.includes(activeCategory)
  );



  return (
    <section className="min-h-screen w-full py-24 px-4 md:px-20 lg:px-32 flex flex-col justify-start relative z-10" id="projects-showcase">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-4">
            const <span className="text-white">Projects</span> = [
          </h2>
          <p className="text-gray-400 max-w-2xl text-sm md:text-base font-light border-l-2 border-indigo-500/50 pl-4 bg-black/20 py-2 rounded-r">
            Explore a curated selection of HRMS, EdTech, and E-commerce platforms built with scalable architectures and modern tools.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar snap-x">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-mono transition-all duration-300 border ${
                activeCategory === category 
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                  : 'bg-black/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Carousel */}
        <div className="w-full mt-10">
          <ProjectCarousel 
            projects={filteredProjects} 
            onProjectClick={setSelectedProject} 
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="w-full py-20 text-center font-mono text-gray-500 text-sm">
            // No projects found in this category
          </div>
        )}
        
        <h2 className="text-3xl md:text-5xl font-bold font-mono text-gray-600 mt-12">
          ];
        </h2>
      </div>

      {/* Project Details Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}
