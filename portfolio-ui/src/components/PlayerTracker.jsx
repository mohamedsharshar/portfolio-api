import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

const THROTTLE_FRAMES = 4;
let frameCount = 0;

const PlayerTracker = ({ ecctrlRef }) => {
  const setPlayerPosition = usePlayerStore((s) => s.setPlayerPosition);
  const setIsMoving = usePlayerStore((s) => s.setIsMoving);
  const prevPos = useRef([0, 5, 0]);

  useFrame(() => {
    frameCount++;
    // Throttle position updates to every N frames for performance
    if (frameCount % THROTTLE_FRAMES !== 0) return;
    if (!ecctrlRef.current) return;

    try {
      const pos = ecctrlRef.current.currPos;
      if (!pos) return;

      const newPos = [pos.x, pos.y, pos.z];
      setPlayerPosition(newPos);

      // Detect movement for footstep audio / animation state
      const dx = newPos[0] - prevPos.current[0];
      const dz = newPos[2] - prevPos.current[2];
      const speed = Math.sqrt(dx * dx + dz * dz);
      setIsMoving(speed > 0.01);

      prevPos.current = newPos;
    } catch (e) {
      // silently ignore if physics body not yet ready
    }
  });

  return null;
};

export default PlayerTracker;