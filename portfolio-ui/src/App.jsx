import { Suspense, lazy } from 'react';
import { useDevicePerformance } from './useDevicePerformance';
import ClickSpark from './ClickSpark';
import HTMLContent from './HTMLContent';
import Navbar3D from './Navbar3D';

// Lazy load the heavy 3D canvas so it's not even parsed on mobile
const DesktopCanvas = lazy(() => import('./DesktopCanvas'));

// Lightweight wrapper for Mobile
const MobileApp = ({ tier, prefersReducedMotion }) => (
  <div id="main-scroll-container" className="w-screen h-screen bg-[#050505] overflow-y-auto overflow-x-hidden relative font-sans scroll-smooth">
    <HTMLContent tier={tier} prefersReducedMotion={prefersReducedMotion} />
  </div>
);

// Main App Component
export default function App() {
  const pages = 6.5; // Hero + Exp + Skills + Projects + Certificates + Contact
  
  const { tier, prefersReducedMotion, isMobile } = useDevicePerformance();

  // If mobile or very low-end, disable 3D Canvas completely for maximum performance
  const shouldUse3D = !isMobile && tier !== 'low';

  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkSize={20}
      sparkRadius={15}
      sparkCount={shouldUse3D && tier !== 'low' ? (tier === 'mid' ? 4 : 8) : 0}
      duration={400}
    >
      <div className="w-screen h-screen bg-[#050505] overflow-hidden relative font-sans">
        <Navbar3D isMobileView={!shouldUse3D} />
        
        <Suspense fallback={<div className="absolute inset-0 z-10 flex items-center justify-center font-mono text-teal-400 bg-[#050505] text-sm animate-pulse">Initializing System...</div>}>
          {shouldUse3D ? (
            <DesktopCanvas tier={tier} prefersReducedMotion={prefersReducedMotion} pages={pages} />
          ) : (
            <MobileApp tier={tier} prefersReducedMotion={prefersReducedMotion} />
          )}
        </Suspense>
      </div>
    </ClickSpark>
  );
}