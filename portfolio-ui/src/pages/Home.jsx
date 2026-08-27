import GameScene from '../components/GameScene';

const Home = () => {
  return (
    <div className="m-0 p-0 overflow-hidden bg-black">
      {/* هنا بنعرض عالم الـ 3D بالكامل */}
      <GameScene />
      
      {/* دي طبقة UI شفافة فوق اللعبة عشان نكتب فيها اسمك أو تعليمات */}
      <div className="absolute top-5 left-5 text-white z-10 pointer-events-none drop-shadow-md">
        <h1 className="text-3xl font-bold">Mohamed SharShar</h1>
        <p className="text-sm text-gray-300 mt-2">Use the mouse to move the camera</p>
      </div>
    </div>
  );
};

export default Home;