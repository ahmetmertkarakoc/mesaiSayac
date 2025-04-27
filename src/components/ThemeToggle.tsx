import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    toggleTheme();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`relative flex items-center p-1 w-16 h-8 rounded-full transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-700' 
            : 'bg-primary-100'
        }`}
        aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
      >
        <motion.div
          layout
          animate={{ x: theme === 'dark' ? 0 : 32 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute w-6 h-6 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-primary-400'
          }`}
        >
          {theme === 'dark' ? (
            <Moon size={16} className="text-gray-200" />
          ) : (
            <Sun size={16} className="text-yellow-50" />
          )}
        </motion.div>
      </button>
      
      {/* Sun shine animation */}
      {theme === 'light' && isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-full h-full"
        >
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5 }}
            className="absolute right-2 top-0 w-8 h-8 rounded-full bg-yellow-200 opacity-40 blur-md"
          />
          <div className="absolute right-3 top-1 w-1 h-1 rounded-full bg-yellow-100 animate-pulse" />
          <div className="absolute right-5 top-2 w-1 h-1 rounded-full bg-yellow-100 animate-pulse" />
        </motion.div>
      )}
      
      {/* Stars animation for dark theme */}
      {theme === 'dark' && isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
        >
          {/* Fixed stars */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1, 0] }}
              transition={{ 
                duration: 2, 
                delay: i * 0.3,
                repeat: 1,
                repeatType: 'reverse'
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
          
          {/* Shooting star */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-white"
            initial={{ top: '10%', left: '100%', opacity: 0 }}
            animate={{ 
              top: '90%', 
              left: '0%',
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <motion.div 
              className="w-4 h-0.5 bg-white absolute right-1 rounded-full opacity-50"
              initial={{ width: 0 }}
              animate={{ width: 10 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ThemeToggle;
