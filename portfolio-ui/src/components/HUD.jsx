import { useEffect, useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { allLandmarks } from '../data/projects';

const HUD = () => {
  const discoveredQuests = usePlayerStore((s) => s.discoveredQuests);
  const toggleMiniMap = usePlayerStore((s) => s.toggleMiniMap);

  const [showHint, setShowHint] = useState(true);
  const [hintVisible, setHintVisible] = useState(true);

  // Fade out hint after 8 seconds
  useEffect(() => {
    const fadeTimer = setTimeout(() => setHintVisible(false), 6000);
    const removeTimer = setTimeout(() => setShowHint(false), 7200);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  // Toggle minimap on M key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'm' || e.key === 'M') toggleMiniMap(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleMiniMap]);

  const total = allLandmarks.length;
  const found = discoveredQuests.length;

  return (
    <>
      {/* Quest counter — torch icons — bottom right */}
      <div className="absolute bottom-5 right-5 z-10 pointer-events-none select-none">
        <div
          className="flex flex-col items-end gap-1 px-4 py-3 rounded-lg"
          style={{
            background: 'rgba(10,8,5,0.55)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(200,160,80,0.2)',
          }}
        >
          <span
            className="text-[10px] uppercase tracking-widest mb-1"
            style={{ color: 'rgba(200,160,80,0.6)', fontFamily: '"Georgia", serif' }}
          >
            Discoveries
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className="text-base transition-all duration-500"
                style={{
                  filter: i < found ? 'drop-shadow(0 0 6px #ffaa44)' : 'grayscale(1) opacity(0.4)',
                  transform: i < found ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                🔥
              </span>
            ))}
          </div>
          <span
            className="text-xs mt-0.5"
            style={{ color: 'rgba(200,160,80,0.7)', fontFamily: '"Georgia", serif' }}
          >
            {found} / {total} sites found
          </span>
        </div>
      </div>

      {/* Controls hint — top center — fades out */}
      {showHint && (
        <div
          className="absolute top-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none transition-opacity duration-1000"
          style={{ opacity: hintVisible ? 1 : 0 }}
        >
          <div
            className="flex items-center gap-4 px-5 py-2.5 rounded-full"
            style={{
              background: 'rgba(10,8,5,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(200,160,80,0.2)',
            }}
          >
            {[
              { key: 'WASD', label: 'Move' },
              { key: 'Mouse', label: 'Look' },
              { key: 'Shift', label: 'Sprint' },
              { key: 'Space', label: 'Jump' },
              { key: 'M', label: 'Map' },
              { key: 'Esc', label: 'Close' },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center gap-0.5">
                <kbd
                  className="px-2 py-0.5 rounded text-[10px] font-bold"
                  style={{
                    background: 'rgba(200,160,80,0.15)',
                    border: '1px solid rgba(200,160,80,0.4)',
                    color: 'rgba(200,160,80,0.9)',
                    fontFamily: 'monospace',
                  }}
                >
                  {key}
                </kbd>
                <span className="text-[9px]" style={{ color: 'rgba(200,160,80,0.5)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compass — top right */}
      <div className="absolute top-5 right-5 z-10 pointer-events-none select-none">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{
            background: 'rgba(10,8,5,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(200,160,80,0.3)',
          }}
          title="Compass"
        >
          🧭
        </div>
      </div>
    </>
  );
};

export default HUD;