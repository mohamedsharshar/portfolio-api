import { motion } from 'framer-motion';
const HeroSection = () => {
  return (
    // استخدام Tailwind لعمل خلفية غامقة مع تأثير إضاءة بسيط
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] overflow-hidden rounded-2xl mb-12 bg-slate-900/50 border border-slate-800 shadow-2xl">
      
      {/* تأثير الدخول لاسمك */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 drop-shadow-lg">
          محمد شرشر
        </h1>
        
        {/* تأثير الدخول للوصف مع تأخير بسيط */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-xl md:text-2xl text-gray-300 font-light tracking-wide"
        >
          Full-Stack Developer | حاسبات وذكاء اصطناعي
        </motion.p>
      </motion.div>

      {/* دوائر متحركة في الخلفية تدي عمق للتصميم */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl z-0"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0"
      />
    </div>
  );
};

export default HeroSection;