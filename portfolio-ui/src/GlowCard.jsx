import React, { useRef } from 'react';

// GlowCard Component (Mouse Tracking Border Glow)
// ==========================================
export default function GlowCard({ children, className, glowColor = '99, 102, 241' }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--glow-x', `${x}px`);
    cardRef.current.style.setProperty('--glow-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group ${className}`}
      style={{
        '--glow-color': glowColor,
        '--glow-radius': '300px'
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(var(--glow-radius)_circle_at_var(--glow-x)_var(--glow-y),rgba(var(--glow-color),0.08)_0%,transparent_50%)]" />
      
      <div className="absolute inset-0 z-10 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500
        before:absolute before:inset-0 before:p-[2px] before:rounded-[inherit]
        before:bg-[radial-gradient(var(--glow-radius)_circle_at_var(--glow-x)_var(--glow-y),rgba(var(--glow-color),1)_0%,rgba(var(--glow-color),0.2)_30%,transparent_60%)]
        before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:[mask-composite:exclude] before:[-webkit-mask-composite:xor]"
      />
      
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
}
