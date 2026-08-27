import { useState } from 'react';
import GameScene from '../components/GameScene';
import QuestPanel from '../components/QuestPanel';
import HUD from '../components/HUD';
import MiniMap from '../components/MiniMap';
import LoadingScreen from '../components/LoadingScreen';
import VirtualJoystick from '../components/VirtualJoystick';

const Home = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="m-0 p-0 overflow-hidden bg-black relative w-screen h-screen">
      {/* Loading Screen */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* 3D World */}
      <GameScene />

      {/* HUD Overlays */}
      <HUD />
      <MiniMap />

      {/* Quest Panel */}
      <QuestPanel />

      {/* Mobile Controls */}
      <VirtualJoystick />

      {/* Skip to text version — always accessible */}
      <a
        href="/text"
        className="absolute bottom-5 left-5 z-10 text-[10px] uppercase tracking-widest transition-opacity hover:opacity-100"
        style={{
          color: 'rgba(200,160,80,0.35)',
          fontFamily: '"Georgia", serif',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(200,160,80,0.8)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(200,160,80,0.35)')}
      >
        📜 Text Version
      </a>
    </div>
  );
};

export default Home;