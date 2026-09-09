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

export default function ProjectCard({ project, onClick, isActive, style, width = 320, height = 420 }) {
  // Compute style scaling or opacity modifiers based on isActive state
  // We use the independent CSS 'scale' property here which works alongside 'transform'
  const activeStyle = isActive
    ? { opacity: 1, scale: '1.15', filter: 'blur(0px)', zIndex: 10 }
    : { opacity: 0.5, scale: '0.85', filter: 'blur(2px)', zIndex: 0 };

  return (
    <div 
      className="absolute cursor-pointer group will-change-transform"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
        top: `calc(50% - ${height / 2}px)`,
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
        <div className={`h-44 w-full relative overflow-hidden ${project.image ? 'bg-gray-900' : `bg-gradient-to-br ${project.visualColor}`} flex items-center justify-center`}>
          <div className={`absolute inset-0 ${project.image ? '' : 'bg-black/30 group-hover:bg-transparent'} transition-colors duration-300`}></div>
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            iconMap[project.iconName] || <TbCode className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform duration-500" />
          )}
          {project.featured && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono text-teal-300 border border-teal-500/30">
              FEATURED
            </div>
          )}
        </div>
        
        <div className="p-6">
          <p className="text-teal-400 font-mono text-xs tracking-widest uppercase mb-2 font-semibold">
            {project.categories?.[0] || 'Project'}
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4 font-light">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.slice(0, 3).map(tech => (
              <span key={tech} className="text-xs px-2.5 py-1 bg-black/60 border border-gray-600 text-gray-200 rounded font-mono">
                {tech}
              </span>
            ))}
            {project.technologies?.length > 3 && (
              <span className="text-xs px-2.5 py-1 bg-black/60 border border-gray-600 text-gray-400 rounded font-mono">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
