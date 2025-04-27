import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const useStars = () =>
  useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      })),
    []
  );

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [anim, setAnim] = useState(false);
  const stars = useStars();

  const handle = () => {
    toggle();
    setAnim(true);
    setTimeout(() => setAnim(false), 1600);
  };

  return (
    <button
      onClick={handle}
      aria-label={theme === 'dark' ? 'Açık tema' : 'Koyu tema'}
      className={`relative w-16 h-8 rounded-full flex items-center transition-colors duration-300
        focus:outline-none ${theme === 'dark' ? 'bg-gray-700' : 'bg-primary-300'}`}
    >
      {/* knob */}
      <motion.span
        layout
        initial={false}
        animate={{ x: theme === 'dark' ? 4 : 36 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center
          shadow ring-1 ring-black/10 dark:bg-gray-800 bg-primary-600"
      >
        {theme === 'dark' ? (
          <Moon size={16} className="text-gray-100" />
        ) : (
          <Sun size={16} className="text-yellow-50" />
        )}
      </motion.span>

      {/* light flash */}
      {theme === 'light' && anim && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            className="absolute right-1 top-1 w-8 h-8 rounded-full bg-yellow-200 opacity-40 blur-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2 }}
          />
        </motion.div>
      )}

      {/* dark stars */}
      {theme === 'dark' && anim && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {stars.map(({ left, top }, i) => (
            <motion.div
              key={i}
              style={{ left, top }}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.6, delay: i * 0.2 }}
            />
          ))}

          {/* shooting star */}
          <motion.div
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{ x: '90%', y: '10%', opacity: 0 }}
            animate={{ x: '-10%', y: '80%', opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <motion.div
              className="absolute -right-8 top-1/2 h-0.5 bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      )}
    </button>
  );
}
