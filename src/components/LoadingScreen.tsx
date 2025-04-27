import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LoadingScreen = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: "linear" 
          }}
          className="w-16 h-16 mb-6 mx-auto"
        >
          <div className={`w-full h-full rounded-full border-4 border-t-primary-500 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}></div>
        </motion.div>
        <h2 className="text-xl font-semibold mb-2">Mesai Sayaç</h2>
        <p className="text-sm opacity-70">Yükleniyor...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;