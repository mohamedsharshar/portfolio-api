import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';

const GameScene = () => {
  return (
    // ده الغلاف اللي بيشيل الـ Canvas وبياخد حجم الشاشة بالكامل
    <div className="w-screen h-screen">
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }}>
        
        {/* 1. الإضاءة المحيطة وإضاءة الشمس */}
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[10, 20, 10]} intensity={1.5} />

        {/* 2. سماء العالم المفتوح */}
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />

        {/* 3. محرك الفيزياء (أي حاجة جواه بتتأثر بالجاذبية والاصطدام) */}
        <Physics>
          
          {/* الأرضية (ثابتة عشان منقعش في الفراغ) */}
          <RigidBody type="fixed">
            <mesh receiveShadow position={[0, -1, 0]}>
              <boxGeometry args={[50, 1, 50]} />
              <meshStandardMaterial color="#2d4c1e" /> {/* لون أخضر عشبي */}
            </mesh>
          </RigidBody>

          {/* بطل اللعبة (مكعب أحمر مؤقتاً بيقع من فوق) */}
          <RigidBody position={[0, 10, 0]} colliders="cuboid">
            <mesh castShadow>
              <boxGeometry args={[1, 2, 1]} />
              <meshStandardMaterial color="#8b0000" />
            </mesh>
          </RigidBody>

        </Physics>

        {/* أداة التحكم بالكاميرا بالماوس مؤقتاً */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default GameScene;