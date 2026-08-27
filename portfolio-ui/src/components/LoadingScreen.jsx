import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('map'); // 'map' → 'title' → 'done'
  const [mapUnfurled, setMapUnfurled] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setPhase('title'), 400);
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, 2800);
      }
      setProgress(Math.min(p, 100));
    }, 120);

    // Map unfurl
    setTimeout(() => setMapUnfurled(true), 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #1a1208 0%, #2a1e0e 60%, #0e0a06 100%)' }}
        >
          {/* Stars background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  background: 'rgba(255,220,140,0.6)',
                  animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Ancient Map */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={mapUnfurled ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mb-10"
            style={{ transformOrigin: 'top center' }}
          >
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                width: 'min(520px, 90vw)',
                background: 'linear-gradient(145deg, #c8a86a 0%, #b89050 30%, #a07840 60%, #906830 100%)',
                border: '3px solid rgba(200,160,80,0.4)',
                boxShadow: '0 0 60px rgba(200,140,40,0.3), inset 0 0 40px rgba(0,0,0,0.3)',
                padding: '2px',
              }}
            >
              {/* Map content */}
              <div
                className="p-8"
                style={{
                  background: 'linear-gradient(145deg, #d4b87a 0%, #c4a060 40%, #b48848 100%)',
                }}
              >
                {/* Decorative corner ornaments */}
                {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute ${pos} text-xs`}
                    style={{ color: 'rgba(100,60,20,0.5)', fontSize: '18px' }}
                  >
                    ✦
                  </div>
                ))}

                {/* Map title */}
                <div className="text-center mb-6">
                  <p
                    className="text-xs uppercase tracking-[0.4em] mb-1"
                    style={{ color: 'rgba(80,40,10,0.6)', fontFamily: '"Georgia", serif' }}
                  >
                    The Realm of
                  </p>
                  <h1
                    className="text-4xl font-bold"
                    style={{
                      color: '#2a1008',
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      textShadow: '1px 1px 0 rgba(200,160,80,0.5)',
                    }}
                  >
                    Mohamed SharShar
                  </h1>
                  <p
                    className="text-sm mt-2"
                    style={{ color: 'rgba(80,40,10,0.7)', fontFamily: '"Georgia", serif', fontStyle: 'italic' }}
                  >
                    Full-Stack Developer · AI Enthusiast
                  </p>
                </div>

                {/* Map sketch */}
                <div className="relative h-36 mb-6">
                  <svg viewBox="0 0 400 140" className="w-full h-full" style={{ opacity: 0.6 }}>
                    {/* Island silhouette */}
                    <ellipse cx="200" cy="80" rx="160" ry="55" fill="rgba(100,70,30,0.3)" stroke="rgba(80,50,20,0.5)" strokeWidth="1.5" />
                    {/* Hills */}
                    <path d="M 100 80 Q 130 55 160 70 Q 190 55 220 65 Q 250 48 280 70 Q 310 60 340 80" fill="none" stroke="rgba(80,50,20,0.4)" strokeWidth="1.5" />
                    {/* Landmarks marks */}
                    {[
                      { x: 200, y: 70, label: '⛩ Home' },
                      { x: 240, y: 65, label: '⬢ Masarat' },
                      { x: 155, y: 68, label: '🏮 HR Genie' },
                      { x: 200, y: 55, label: '◆ API' },
                      { x: 130, y: 60, label: '🗼 Portal' },
                    ].map(({ x, y, label }) => (
                      <g key={label}>
                        <circle cx={x} cy={y} r={2.5} fill="rgba(80,40,10,0.7)" />
                        <text x={x} y={y - 6} textAnchor="middle" fontSize="5.5" fill="rgba(80,40,10,0.7)" fontFamily="Georgia, serif">
                          {label}
                        </text>
                      </g>
                    ))}
                    {/* Compass rose */}
                    <text x="355" y="25" textAnchor="middle" fontSize="8" fill="rgba(80,40,10,0.5)" fontFamily="Georgia, serif">N</text>
                    <line x1="355" y1="28" x2="355" y2="40" stroke="rgba(80,40,10,0.4)" strokeWidth="1" />
                    <text x="355" y="52" textAnchor="middle" fontSize="6" fill="rgba(80,40,10,0.4)" fontFamily="Georgia, serif">S</text>
                  </svg>
                </div>

                {/* Progress bar — ink fill */}
                <div className="relative">
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(80,50,20,0.25)', border: '1px solid rgba(80,50,20,0.3)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #6a3a10, #c97a20)',
                        width: `${progress}%`,
                        boxShadow: '0 0 8px rgba(200,120,30,0.6)',
                      }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>
                  <p
                    className="text-[10px] text-center mt-2 uppercase tracking-widest"
                    style={{ color: 'rgba(80,40,10,0.5)', fontFamily: '"Georgia", serif' }}
                  >
                    {progress < 100 ? 'Unfurling the map…' : 'The world awaits'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Title card — appears after map */}
          <AnimatePresence>
            {phase === 'title' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="text-sm uppercase tracking-[0.5em]"
                style={{
                  color: 'rgba(200,160,80,0.5)',
                  fontFamily: '"Georgia", serif',
                }}
              >
                Enter the realm…
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
