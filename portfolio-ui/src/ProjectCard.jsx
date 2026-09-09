import React from 'react';
import { TbUsers, TbBulb, TbBrain, TbMessages, TbApi, TbRobot, TbCode } from 'react-icons/tb';
import GlowCard from './GlowCard';

const iconMap = {
  TbUsers: <TbUsers className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbBulb: <TbBulb className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbBrain: <TbBrain className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbMessages: <TbMessages className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbApi: <TbApi className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />,
  TbRobot: <TbRobot className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />
};

export default function ProjectCard({ project, onClick, isActive, style }) {
  // Compute style scaling or opacity modifiers based on isActive state
  const activeStyle = isActive
    ? { opacity: 1, scale: 1, filter: 'blur(0px)', zIndex: 10 }
    : { opacity: 0.6, scale: 0.9, filter: 'blur(1px)', zIndex: 0 };

  return (
    <div 
      className="absolute cursor-pointer group will-change-transform"
      style={{
        width: '100%',
        maxWidth: '320px',
        height: '420px',
        left: 'calc(50% - 160px)',
        top: 'calc(50% - 210px)',
        transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
        // Prevent image dragging inside card
        WebkitUserDrag: 'none',
        ...style
      }}
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(project);
      }}
    >
      <GlowCard glowColor="99, 102, 241" className="h-full bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300">
        <div className={`h-40 w-full relative overflow-hidden bg-gradient-to-br ${project.visualColor} flex items-center justify-center`}>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300"></div>
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 mix-blend-overlay group-hover:opacity-100 transition-opacity" />
          ) : (
            iconMap[project.iconName] || <TbCode className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />
          )}
          {project.featured && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono text-teal-300 border border-teal-500/30">
              FEATURED
            </div>
          )}
        </div>
        
        <div className="p-5">
          <p className="text-teal-400 font-mono text-[10px] tracking-widest uppercase mb-1">
            {project.categories?.[0] || 'Project'}
          </p>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-gray-400 text-xs line-clamp-2 mb-3 font-light">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {project.technologies?.slice(0, 3).map(tech => (
              <span key={tech} className="text-[9px] px-2 py-0.5 bg-black/50 border border-gray-700 text-gray-300 rounded font-mono">
                {tech}
              </span>
            ))}
            {project.technologies?.length > 3 && (
              <span className="text-[9px] px-2 py-0.5 bg-black/50 border border-gray-700 text-gray-500 rounded font-mono">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
