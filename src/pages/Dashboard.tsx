import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Clock from '../components/Clock';
import WorkHourForm from '../components/WorkHourForm';
import WorkHoursList from '../components/WorkHoursList';
import StatsPanel from '../components/StatsPanel';

const Dashboard = () => {
  const { signOut, profile } = useAuth();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Hide mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mesai Sayaç</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Hoş geldiniz,</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile?.full_name}</p>
              </div>
              
              <ThemeToggle />
              
              {profile?.is_master && (
                <Link 
                  to="/admin"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  title="Yönetici Paneli"
                >
                  <UserCog size={20} />
                </Link>
              )}
              
              <button 
                onClick={signOut}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                title="Çıkış Yap"
              >
                <LogOut size={20} />
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-500 dark:text-gray-400 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hoş geldiniz,</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile?.full_name}</p>
                  </div>
                  <ThemeToggle />
                </div>
                
                <div className="flex space-x-4">
                  {profile?.is_master && (
                    <Link 
                      to="/admin"
                      className="flex items-center space-x-2 py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                    >
                      <UserCog size={20} />
                      <span>Yönetici Paneli</span>
                    </Link>
                  )}
                  
                  <button 
                    onClick={signOut}
                    className="flex items-center space-x-2 py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                  >
                    <LogOut size={20} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Date and Clock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
          <Clock />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Work Hours Section */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mesai Saati Ekle</h2>
              <WorkHourForm onSuccess={handleRefresh} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mesai Kayıtları</h2>
              <WorkHoursList refresh={refreshCounter} />
            </div>
          </div>
          
          {/* Stats Panel */}
          <div className="w-full lg:w-1/3">
            <StatsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;