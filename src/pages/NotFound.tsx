import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
          <h2 className="text-3xl font-semibold mt-4">Sayfa Bulunamadı</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Aradığınız sayfa bulunamadı veya taşınmış olabilir.
          </p>
          <Link 
            to="/"
            className="mt-8 inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;