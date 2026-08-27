import { useEffect, useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { allLandmarks } from '../data/projects';

const HUD = () => {
  const discoveredQuests = usePlayerStore((s) => s.discoveredQuests);
  const toggleMiniMap = usePlayerStore((s) => s.toggleMiniMap);
  const activeQuest = usePlayerStore((s) => s.activeQuest);
  const playerPosition = usePlayerStore((s) => s.playerPosition);

  const [showHint, setShowHint] = useState(true);
  const [hintVisible, setHintVisible] = useState(true);
  const [nearbyLandmark, setNearbyLandmark] = useState(null);

  // Fade out hint after 10 seconds
  useEffect(() => {
    const fadeTimer = setTimeout(() => setHintVisible(false), 8000);
    const removeTimer = setTimeout(() => setShowHint(false), 9200);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  // Toggle minimap on M key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'm' || e.key === 'M') toggleMiniMap(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleMiniMap]);

  // Check for nearby landmarks to show [E] interact prompt
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeQuest) {
        setNearbyLandmark(null);
        return;
      }
      let nearest = null;
      let nearestDist = 8;
      allLandmarks.forEach((lm) => {
        const dist = Math.sqrt(
          (playerPosition[0] - lm.position[0]) ** 2 +
          (playerPosition[2] - lm.position[2]) ** 2
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = lm;
        }
      });
      setNearbyLandmark(nearest);
    }, 300);
    return () => clearInterval(interval);
  }, [playerPosition, activeQuest]);

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
            className="flex items-center gap-3 px-5 py-2.5 rounded-full"
            style={{
              background: 'rgba(10,8,5,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(200,160,80,0.2)',
            }}
          >
            {[
              { key: 'WASD', label: 'Move' },
              { key: 'R-Click', label: 'Camera' },
              { key: 'L-Click', label: 'Interact' },
              { key: 'Scroll', label: 'Zoom' },
              { key: 'E', label: 'Action' },
              { key: 'Q', label: 'Close' },
              { key: 'R', label: 'Reset Cam' },
              { key: 'Shift', label: 'Sprint' },
              { key: 'Space', label: 'Jump' },
              { key: 'M', label: 'Map' },
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

      {/* Nearby landmark interaction prompt */}
      {nearbyLandmark && !activeQuest && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none animate-pulse">
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-lg"
            style={{
              background: 'rgba(10,8,5,0.65)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${nearbyLandmark.color}50`,
              boxShadow: `0 0 20px ${nearbyLandmark.color}30`,
            }}
          >
            <div className="flex items-center gap-2">
              <kbd
                className="px-2.5 py-1 rounded text-sm font-bold"
                style={{
                  background: `${nearbyLandmark.color}25`,
                  border: `1px solid ${nearbyLandmark.color}60`,
                  color: nearbyLandmark.color,
                  fontFamily: 'monospace',
                }}
              >
                E
              </kbd>
              <span
                className="text-sm"
                style={{ color: 'rgba(200,160,80,0.8)', fontFamily: '"Georgia", serif' }}
              >
                or
              </span>
              <kbd
                className="px-2.5 py-1 rounded text-sm font-bold"
                style={{
                  background: `${nearbyLandmark.color}25`,
                  border: `1px solid ${nearbyLandmark.color}60`,
                  color: nearbyLandmark.color,
                  fontFamily: 'monospace',
                }}
              >
                Click
              </kbd>
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: nearbyLandmark.color, fontFamily: '"Georgia", serif' }}
            >
              {nearbyLandmark.name}
            </span>
          </div>
        </div>
      )}

      {/* Crosshair — center screen */}
      <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: 'rgba(200,160,80,0.3)',
            boxShadow: '0 0 4px rgba(200,160,80,0.2)',
          }}
        />
      </div>

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