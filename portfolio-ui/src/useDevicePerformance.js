import { useState, useEffect } from 'react';

export function useDevicePerformance() {
  const [tier, setTier] = useState('high'); // 'high' | 'mid' | 'low'
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Reduced Motion Preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    // 2. Mobile Detection
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mobileQuery.matches);
    const mobileHandler = (e) => setIsMobile(e.matches);
    mobileQuery.addEventListener('change', mobileHandler);

    // 3. Hardware Capability Detection
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // in GB
    
    // Connection quality
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowNetwork = connection && (
      connection.effectiveType === '2g' || 
      connection.effectiveType === '3g' || 
      connection.saveData
    );

    let calculatedTier = 'high';

    // Mid-range criteria
    if (cores <= 4 || memory <= 4 || isSlowNetwork || mobileQuery.matches) {
      calculatedTier = 'mid';
    }

    // Low-end criteria
    if (cores <= 2 || memory <= 2 || (mobileQuery.matches && memory <= 3)) {
      calculatedTier = 'low';
    }

    setTier(calculatedTier);

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      mobileQuery.removeEventListener('change', mobileHandler);
    };
  }, []);

  return { tier, prefersReducedMotion, isMobile };
}
