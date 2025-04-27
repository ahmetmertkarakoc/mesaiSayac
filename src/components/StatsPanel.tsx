import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { Clock, CalendarDays, TrendingUp } from 'lucide-react';

interface Stats {
  totalHours: number;
  dailyAverage: number;
  thisWeekHours: number;
  thisMonthHours: number;
}

const StatsPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalHours: 0,
    dailyAverage: 0,
    thisWeekHours: 0,
    thisMonthHours: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      setLoading(true);
      
      try {
        // Get all work hours
        const { data, error } = await supabase
          .from('work_hours')
          .select('date, hours')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setLoading(false);
          return;
        }
        
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as the first day
        startOfWeek.setHours(0, 0, 0, 0);
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Calculate statistics
        let totalHours = 0;
        let thisWeekHours = 0;
        let thisMonthHours = 0;
        const workDays = new Set(); // To count unique work days
        
        data.forEach(entry => {
          const entryDate = new Date(entry.date);
          totalHours += entry.hours;
          workDays.add(entry.date); // Add the date to the set
          
          if (entryDate >= startOfWeek) {
            thisWeekHours += entry.hours;
          }
          
          if (entryDate >= startOfMonth) {
            thisMonthHours += entry.hours;
          }
        });
        
        const dailyAverage = workDays.size > 0 ? totalHours / workDays.size : 0;
        
        setStats({
          totalHours,
          dailyAverage,
          thisWeekHours,
          thisMonthHours,
        });
        
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4">İstatistikler</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <Clock size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Çalışma</p>
            <p className="text-xl font-bold">{stats.totalHours.toFixed(1)} saat</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center">
            <TrendingUp size={20} className="text-secondary-600 dark:text-secondary-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Günlük Ortalama</p>
            <p className="text-xl font-bold">{stats.dailyAverage.toFixed(1)} saat</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center">
            <CalendarDays size={20} className="text-accent-600 dark:text-accent-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Bu Ay</p>
            <p className="text-xl font-bold">{stats.thisMonthHours.toFixed(1)} saat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;