import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TbUsers, TbBulb, TbBrain, TbMessages, TbApi, TbRobot, TbX, TbExternalLink, TbBrandGithub, TbCode } from 'react-icons/tb';

const iconMap = {
  TbUsers: <TbUsers className="w-24 h-24 opacity-30" />,
  TbBulb: <TbBulb className="w-24 h-24 opacity-30" />,
  TbBrain: <TbBrain className="w-24 h-24 opacity-30" />,
  TbMessages: <TbMessages className="w-24 h-24 opacity-30" />,
  TbApi: <TbApi className="w-24 h-24 opacity-30" />,
  TbRobot: <TbRobot className="w-24 h-24 opacity-30" />
};

export default function ProjectModal({ project, onClose }) {
  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-gray-700 rounded-2xl overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header Visual */}
        <div className={`w-full h-48 md:h-64 relative bg-gradient-to-br ${project.visualColor} flex items-center justify-center shrink-0 overflow-hidden`}>
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
          ) : (
            iconMap[project.iconName] || <TbCode className="w-24 h-24 opacity-30" />
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors backdrop-blur-md border border-white/10"
            aria-label="Close modal"
          >
            <TbX className="w-6 h-6" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <p className="text-teal-400 font-mono text-xs tracking-widest uppercase mb-2">
                {project.categories?.[0] || 'Project'}
              </p>
              <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-white mb-4">
                {project.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map(tech => (
                  <span key={tech} className="text-xs px-3 py-1 bg-black border border-gray-700 text-gray-300 rounded font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 shrink-0">
              {project.demoLink && (
                <a 
                  href={project.demoLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-lg text-indigo-300 text-sm font-mono flex items-center gap-2 transition-colors"
                >
                  <TbExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
              {project.github && (
                <a 
                  href={project.github} 
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
                  {project.description}
                </p>
              </div>
              {project.problem && (
                <div>
                  <h4 className="text-white font-mono text-sm mb-2 border-b border-gray-800 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-red-500"></span> // THE PROBLEM
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed font-light">
                    {project.problem}
                  </p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h4 className="text-white font-mono text-sm mb-2 border-b border-gray-800 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-teal-500"></span> // THE SOLUTION
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed font-light">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
            
            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="text-white font-mono text-sm mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-yellow-500"></span> // KEY FEATURES
                </h4>
                <ul className="space-y-3">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-light">
                      <span className="text-teal-500 mt-0.5">▹</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
