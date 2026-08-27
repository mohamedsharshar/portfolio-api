import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';

// Tech stack sigil badge
const SigilBadge = ({ tech, themeColor }) => (
  <span
    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border"
    style={{
      background: `${themeColor}15`,
      borderColor: `${themeColor}50`,
      color: themeColor,
    }}
  >
    {tech}
  </span>
);

// Contact links component
const ContactLinks = ({ contact }) => (
  <div className="flex flex-col gap-2">
    {contact.email && (
      <a
        href={`mailto:${contact.email}`}
        className="flex items-center gap-2 text-amber-800 hover:text-amber-600 transition-colors text-sm"
      >
        <span>✉️</span> {contact.email}
      </a>
    )}
    {contact.github && (
      <a
        href={contact.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-amber-800 hover:text-amber-600 transition-colors text-sm"
      >
        <span>⚙️</span> GitHub
      </a>
    )}
    {contact.linkedin && (
      <a
        href={contact.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-amber-800 hover:text-amber-600 transition-colors text-sm"
      >
        <span>🔗</span> LinkedIn
      </a>
    )}
  </div>
);

// Parchment scroll panel
const ScrollPanel = ({ quest, onClose }) => {
  const themeColors = {
    warm: '#c9863a',
    cool: '#3a8a7a',
    mystical: '#7a5aaa',
    ancient: '#7a6a4a',
  };
  const accentColor = themeColors[quest.theme] || '#c9863a';

  return (
    <motion.div
      key={quest.id}
      initial={{ opacity: 0, scaleY: 0.3, y: 40 }}
      animate={{ opacity: 1, scaleY: 1, y: 0 }}
      exit={{ opacity: 0, scaleY: 0.3, y: 40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="pointer-events-auto relative max-w-lg w-full mx-4"
      style={{ transformOrigin: 'bottom center' }}
    >
      {/* Parchment texture container */}
      <div
        className="relative rounded-lg shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #f8f0dc 0%, #f0e4c0 40%, #ead8a8 80%, #e0cc98 100%)',
          border: `2px solid ${accentColor}60`,
          boxShadow: `0 0 40px ${accentColor}30, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Aged paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 20% 20%, rgba(180,140,80,0.12) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 80%, rgba(120,90,50,0.12) 0%, transparent 60%)`,
          }}
        />

        {/* Top decorative border */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />

        <div className="p-7 relative">
          {/* Quest Unlocked badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-3"
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-bold px-2 py-0.5 rounded"
              style={{ color: accentColor, background: `${accentColor}15`, border: `1px solid ${accentColor}40` }}
            >
              {quest.subtitle || '⚔ Quest Unlocked'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-3xl font-bold mb-1"
            style={{
              color: '#2a1a0a',
              fontFamily: '"Georgia", "Times New Roman", serif',
              textShadow: '1px 1px 0 rgba(180,140,80,0.3)',
            }}
          >
            {quest.name}
          </motion.h2>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="h-px my-3"
            style={{ background: `linear-gradient(90deg, ${accentColor}80, transparent)` }}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm leading-relaxed mb-5"
            style={{ color: '#4a3020', fontFamily: '"Georgia", serif' }}
          >
            {quest.description}
          </motion.p>

          {/* Tech stack sigils */}
          {quest.tech && quest.tech.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-5"
            >
              {quest.tech.map((t) => (
                <SigilBadge key={t} tech={t} themeColor={accentColor} />
              ))}
            </motion.div>
          )}

          {/* Skills display */}
          {quest.skills && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-4 gap-2 mb-5"
            >
              {quest.skills.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col items-center gap-1 p-2 rounded"
                  style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}30` }}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-[10px] text-amber-900 font-medium">{s.name}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Contact links */}
          {quest.contact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-5"
            >
              <ContactLinks contact={quest.contact} />
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3"
          >
            {quest.link && quest.link !== '#' && (
              <a
                href={quest.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
                  color: '#fff8e8',
                  boxShadow: `0 4px 15px ${accentColor}50`,
                  fontFamily: '"Georgia", serif',
                  letterSpacing: '0.05em',
                }}
              >
                View Project →
              </a>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'transparent',
                border: `1.5px solid ${accentColor}60`,
                color: accentColor,
                fontFamily: '"Georgia", serif',
              }}
            >
              Continue Exploring
            </button>
          </motion.div>
        </div>

        {/* Bottom decorative border */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
      </div>

      {/* Scroll curl effect — bottom shadow */}
      <div
        className="h-3 mx-8 rounded-b-full"
        style={{
          background: 'rgba(0,0,0,0.15)',
          filter: 'blur(6px)',
          transform: 'scaleX(0.9)',
        }}
      />
    </motion.div>
  );
};

// ─── Main QuestPanel ──────────────────────────────────────
const QuestPanel = () => {
  const activeQuest = usePlayerStore((s) => s.activeQuest);
  const setActiveQuest = usePlayerStore((s) => s.setActiveQuest);
  const setQuestCooldown = usePlayerStore((s) => s.setQuestCooldown);

  const handleClose = () => {
    if (activeQuest) setQuestCooldown(activeQuest.id, Date.now());
    setActiveQuest(null);
  };

  // Close on Escape or Q key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeQuest]);

  return (
    <AnimatePresence>
      {activeQuest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ background: 'rgba(10,8,5,0.45)', backdropFilter: 'blur(3px)' }}
        >
          <ScrollPanel quest={activeQuest} onClose={handleClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestPanel;