import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { projects, categories } from './data/projects';
import { TbUsers, TbBulb, TbBrain, TbMessages, TbApi, TbRobot, TbX, TbExternalLink, TbBrandGithub, TbCode } from 'react-icons/tb';
import GlowCard from './GlowCard';

const iconMap = {
  TbUsers: <TbUsers className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbBulb: <TbBulb className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbBrain: <TbBrain className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbMessages: <TbMessages className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbApi: <TbApi className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbRobot: <TbRobot className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />
};

export default function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projects.filter(p => 
    activeCategory === "All" ? true :
    activeCategory === "Featured" ? p.featured :
    p.categories.includes(activeCategory)
  );

  const renderProjectCard = (project) => (
    <div 
      key={project.id} 
      className="group relative cursor-pointer"
      onClick={() => setSelectedProject(project)}
    >
      <GlowCard glowColor="99, 102, 241" className="h-full bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.2)]">
        {/* Abstract Visual Fallback */}
        <div className={`h-40 w-full relative overflow-hidden bg-gradient-to-br ${project.visualColor} flex items-center justify-center`}>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
          {iconMap[project.iconName] || <TbCode className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />}
          {project.featured && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-mono text-teal-300 border border-teal-500/30">
              FEATURED
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-6">
          <p className="text-teal-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            {project.categories[0]}
          </p>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4 font-light">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map(tech => (
              <span key={tech} className="text-[10px] px-2 py-1 bg-black/50 border border-gray-700 text-gray-300 rounded font-mono">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] px-2 py-1 bg-black/50 border border-gray-700 text-gray-400 rounded font-mono">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </GlowCard>
    </div>
  );

  return (
    <section className="min-h-screen w-full py-24 px-6 md:px-20 lg:px-32 flex flex-col justify-start relative z-10" id="projects-showcase">
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(renderProjectCard)}
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
      {selectedProject && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
          
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-gray-700 rounded-2xl overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Visual */}
            <div className={`w-full h-48 md:h-64 relative bg-gradient-to-br ${selectedProject.visualColor} flex items-center justify-center shrink-0`}>
              {iconMap[selectedProject.iconName] || <TbCode className="w-24 h-24 opacity-30" />}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors backdrop-blur-md border border-white/10"
              >
                <TbX className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <p className="text-teal-400 font-mono text-xs tracking-widest uppercase mb-2">
                    {selectedProject.subtitle}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {selectedProject.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map(tech => (
                      <span key={tech} className="text-xs px-3 py-1 bg-black border border-gray-700 text-gray-300 rounded font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 shrink-0">
                  {selectedProject.demoLink && (
                    <a 
                      href={selectedProject.demoLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-lg text-indigo-300 text-sm font-mono flex items-center gap-2 transition-colors"
                    >
                      <TbExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                  {selectedProject.github && (
                    <a 
                      href={selectedProject.github} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white text-sm font-mono flex items-center gap-2 transition-colors"
                    >
                      <TbBrandGithub className="w-4 h-4" /> GitHub
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-mono text-sm mb-2 border-b border-gray-800 pb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded bg-indigo-500"></span> // OVERVIEW
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                      {selectedProject.description}
                    </p>
                  </div>
                  {selectedProject.problem && (
                    <div>
                      <h4 className="text-white font-mono text-sm mb-2 border-b border-gray-800 pb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded bg-red-500"></span> // THE PROBLEM
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {selectedProject.problem}
                      </p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div>
                      <h4 className="text-white font-mono text-sm mb-2 border-b border-gray-800 pb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded bg-teal-500"></span> // THE SOLUTION
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-white font-mono text-sm mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-yellow-500"></span> // KEY FEATURES
                  </h4>
                  <ul className="space-y-3">
                    {selectedProject.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-light">
                        <span className="text-teal-500 mt-0.5">▹</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
