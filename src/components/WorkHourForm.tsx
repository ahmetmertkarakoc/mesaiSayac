import { useState } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { Clock, Plus, Minus } from 'lucide-react';

interface WorkHourFormProps {
  onSuccess: () => void;
}

const QUICK_HOURS = [4, 8, 12];
const HOUR_STEP = 0.5;

const WorkHourForm: React.FC<WorkHourFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('8');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickHourSelect = (value: number) => {
    setHours(value.toString());
  };

  const handleHourAdjust = (increment: boolean) => {
    const currentValue = parseFloat(hours) || 0;
    const newValue = increment 
      ? currentValue + HOUR_STEP 
      : Math.max(HOUR_STEP, currentValue - HOUR_STEP);
    setHours(newValue.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const parsedHours = parseFloat(hours);
      
      if (isNaN(parsedHours) || parsedHours <= 0) {
        throw new Error('Geçerli bir saat değeri giriniz');
      }
      
      const { error } = await supabase.from('work_hours').insert({
        user_id: user.id,
        date,
        hours: parsedHours,
        description: description || null,
      });
      
      if (error) throw error;
      
      // Reset form
      setHours('8');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      onSuccess();
      
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tarih
        </label>
        <div className="relative">
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 dark:bg-gray-800 dark:text-white px-4 py-2"
          />
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formatDate(date)}
          </div>
        </div>
      </div>
      
      {/* Hours Input with Quick Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Çalışma Saati
        </label>
        
        {/* Quick Hour Selection */}
        <div className="flex gap-2 mb-3">
          {QUICK_HOURS.map(hour => (
            <button
              key={hour}
              type="button"
              onClick={() => handleQuickHourSelect(hour)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                ${hours === hour.toString()
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {hour} saat
            </button>
          ))}
        </div>
        
        {/* Custom Hour Input with Increment/Decrement */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleHourAdjust(false)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Minus size={16} />
          </button>
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              step={HOUR_STEP}
              min={HOUR_STEP}
              required
              className="block w-full pl-10 pr-12 py-2 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 dark:bg-gray-800 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 text-sm">saat</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => handleHourAdjust(true)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      {/* Description Input */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Açıklama (İsteğe Bağlı)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Yapılan işler hakkında kısa bir açıklama..."
          className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 dark:bg-gray-800 dark:text-white px-4 py-2"
        />
      </div>
      
      {error && (
        <div className="bg-error-50 dark:bg-error-900/20 border-l-4 border-error-500 p-4">
          <p className="text-sm text-error-700 dark:text-error-400">
            {error}
          </p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            Kaydediliyor...
          </>
        ) : (
          'Mesai Saati Ekle'
        )}
      </button>
    </form>
  );
};

export default WorkHourForm;