import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { allLandmarks } from '../data/projects';

/**
 * Mini 2D top-down map showing:
 *  - All landmark positions as colored dots
 *  - Player position as a pulsing dot
 *  - Toggle with M key
 */
const MAP_SIZE = 180;
const WORLD_RADIUS = 40; // half-world size we care about
const scale = (v) => (v / WORLD_RADIUS) * (MAP_SIZE / 2) + MAP_SIZE / 2;

const MiniMap = () => {
  const showMiniMap = usePlayerStore((s) => s.showMiniMap);
  const playerPosition = usePlayerStore((s) => s.playerPosition);
  const discoveredQuests = usePlayerStore((s) => s.discoveredQuests);
  const canvasRef = useRef();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Map background — parchment
    const grad = ctx.createRadialGradient(MAP_SIZE / 2, MAP_SIZE / 2, 10, MAP_SIZE / 2, MAP_SIZE / 2, MAP_SIZE / 2);
    grad.addColorStop(0, 'rgba(220,190,130,0.95)');
    grad.addColorStop(1, 'rgba(180,145,90,0.95)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(MAP_SIZE / 2, MAP_SIZE / 2, MAP_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Island circle
    ctx.strokeStyle = 'rgba(100,70,30,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(MAP_SIZE / 2, MAP_SIZE / 2, (45 / WORLD_RADIUS) * (MAP_SIZE / 2), 0, Math.PI * 2);
    ctx.stroke();

    // Landmarks
    allLandmarks.forEach((lm) => {
      const x = scale(lm.position[0]);
      const y = scale(lm.position[2]);
      const discovered = discoveredQuests.includes(lm.id);

      ctx.beginPath();
      ctx.arc(x, y, discovered ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = discovered ? lm.color : 'rgba(100,80,50,0.4)';
      ctx.fill();

      if (discovered) {
        ctx.strokeStyle = lm.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Player dot — pulsing handled by CSS
    const px = scale(playerPosition[0]);
    const py = scale(playerPosition[2]);
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,200,80,0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cardinal labels
    ctx.fillStyle = 'rgba(100,70,30,0.5)';
    ctx.font = '7px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', MAP_SIZE / 2, 12);
    ctx.fillText('S', MAP_SIZE / 2, MAP_SIZE - 4);
    ctx.fillText('W', 8, MAP_SIZE / 2 + 3);
    ctx.fillText('E', MAP_SIZE - 6, MAP_SIZE / 2 + 3);
  }, [playerPosition, discoveredQuests]);

  useEffect(() => {
    if (showMiniMap) draw();
  }, [showMiniMap, draw]);

  if (!showMiniMap) return null;

  return (
    <div
      className="absolute bottom-20 right-5 z-10 pointer-events-none"
      style={{
        filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))',
      }}
    >
      <div
        className="relative"
        style={{
          width: MAP_SIZE,
          height: MAP_SIZE,
          borderRadius: '50%',
          border: '2px solid rgba(200,160,80,0.4)',
          overflow: 'hidden',
        }}
      >
        <canvas ref={canvasRef} width={MAP_SIZE} height={MAP_SIZE} />
      </div>
      <p
        className="text-center text-[9px] mt-1 tracking-widest"
        style={{ color: 'rgba(200,160,80,0.5)', fontFamily: '"Georgia", serif' }}
      >
        [M] to hide
      </p>
    </div>
  );
};

export default MiniMap;
