import { useRef, useEffect, useCallback } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * Touch joystick for mobile — detects touch and renders a
 * virtual joystick overlay on the left half of the screen.
 * Only shown on touch-capable devices.
 */
const VirtualJoystick = ({ onMove }) => {
  const containerRef = useRef();
  const knobRef = useRef();
  const touchIdRef = useRef(null);
  const centerRef = useRef({ x: 0, y: 0 });

  const RADIUS = 50;
  const KNOB_RADIUS = 22;

  const handleTouchStart = useCallback((e) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    centerRef.current = { x: touch.clientX, y: touch.clientY };

    if (containerRef.current) {
      containerRef.current.style.left = `${touch.clientX - RADIUS}px`;
      containerRef.current.style.top = `${touch.clientY - RADIUS}px`;
      containerRef.current.style.opacity = '0.75';
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchIdRef.current === null) return;
    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === touchIdRef.current
    );
    if (!touch) return;

    const dx = touch.clientX - centerRef.current.x;
    const dy = touch.clientY - centerRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamp = Math.min(dist, RADIUS);
    const angle = Math.atan2(dy, dx);

    const kx = Math.cos(angle) * clamp;
    const ky = Math.sin(angle) * clamp;

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${kx}px, ${ky}px)`;
    }

    // Normalize to -1..1 and emit
    const nx = kx / RADIUS;
    const ny = ky / RADIUS;
    onMove?.({ x: nx, y: ny });
  }, [onMove]);

  const handleTouchEnd = useCallback((e) => {
    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === touchIdRef.current
    );
    if (!touch) return;
    touchIdRef.current = null;

    if (knobRef.current) knobRef.current.style.transform = 'translate(0,0)';
    if (containerRef.current) containerRef.current.style.opacity = '0';

    onMove?.({ x: 0, y: 0 });
  }, [onMove]);

  useEffect(() => {
    const el = document.getElementById('joystick-zone');
    if (!el) return;
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Only show on touch devices
  if (!('ontouchstart' in window)) return null;

  return (
    <>
      {/* Joystick touch zone — left half */}
      <div
        id="joystick-zone"
        className="absolute left-0 bottom-0 z-20"
        style={{ width: '50%', height: '50%' }}
      />

      {/* Joystick visual */}
      <div
        ref={containerRef}
        className="absolute z-30 pointer-events-none"
        style={{
          width: RADIUS * 2,
          height: RADIUS * 2,
          borderRadius: '50%',
          background: 'rgba(200,160,80,0.1)',
          border: '2px solid rgba(200,160,80,0.4)',
          opacity: 0,
          transition: 'opacity 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          ref={knobRef}
          style={{
            width: KNOB_RADIUS * 2,
            height: KNOB_RADIUS * 2,
            borderRadius: '50%',
            background: 'rgba(200,160,80,0.6)',
            border: '2px solid rgba(200,160,80,0.9)',
            transition: 'transform 0.05s',
          }}
        />
      </div>

      {/* Sprint button — bottom right mobile */}
      <button
        className="absolute bottom-8 right-8 z-30 rounded-full w-14 h-14 flex items-center justify-center text-xl"
        style={{
          background: 'rgba(200,160,80,0.15)',
          border: '2px solid rgba(200,160,80,0.5)',
          backdropFilter: 'blur(8px)',
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          // Simulate Shift key for sprint
          window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft', bubbles: true }));
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft', bubbles: true }));
        }}
      >
        💨
      </button>
    </>
  );
};

export default VirtualJoystick;
