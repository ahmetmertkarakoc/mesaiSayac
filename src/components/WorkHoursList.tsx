import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit } from 'lucide-react';

interface WorkHour {
  id: string;
  date: string;
  hours: number;
  description: string | null;
  created_at: string;
}

interface WorkHoursListProps {
  refresh: number;
}

const WorkHoursList: React.FC<WorkHoursListProps> = ({ refresh }) => {
  const { user } = useAuth();
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHours, setEditHours] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchWorkHours = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('work_hours')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (!error && data) {
        setWorkHours(data as WorkHour[]);
      }
      
      setLoading(false);
    };
    
    fetchWorkHours();
  }, [user, refresh]);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const handleEdit = (workHour: WorkHour) => {
    setEditingId(workHour.id);
    setEditHours(workHour.hours.toString());
    setEditDescription(workHour.description || '');
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  const handleSaveEdit = async (id: string) => {
    try {
      const parsedHours = parseFloat(editHours);
      
      if (isNaN(parsedHours) || parsedHours <= 0) {
        alert('Geçerli bir saat değeri giriniz');
        return;
      }
      
      const { error } = await supabase
        .from('work_hours')
        .update({
          hours: parsedHours,
          description: editDescription || null
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setWorkHours(workHours.map(wh => 
        wh.id === id 
          ? { ...wh, hours: parsedHours, description: editDescription || null } 
          : wh
      ));
      
      setEditingId(null);
      
    } catch (error) {
      console.error('Error updating work hour:', error);
      alert('Güncelleme sırasında bir hata oluştu');
    }
  };
  
  const handleConfirmDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('work_hours')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setWorkHours(workHours.filter(wh => wh.id !== id));
      setDeletingId(null);
      
    } catch (error) {
      console.error('Error deleting work hour:', error);
      alert('Silme sırasında bir hata oluştu');
    }
  };
  
  const handleDelete = (id: string) => {
    setDeletingId(id);
  };
  
  const handleCancelDelete = () => {
    setDeletingId(null);
  };
  
  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>;
  }
  
  if (workHours.length === 0) {
    return <div className="text-center py-4 text-gray-500 dark:text-gray-400">Henüz mesai kaydı bulunmamaktadır.</div>;
  }
  
  return (
    <div className="space-y-4">
      {workHours.map(workHour => (
        <div 
          key={workHour.id} 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {editingId === workHour.id ? (
            // Edit mode
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Çalışma Saati
                </label>
                <input
                  type="number"
                  value={editHours}
                  onChange={(e) => setEditHours(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-2 dark:text-white"
                  step="0.5"
                  min="0.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Açıklama
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-2 dark:text-white"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSaveEdit(workHour.id)}
                  className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                >
                  Kaydet
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <>
              <div className="flex justify-between">
                <div className="font-medium">{formatDate(workHour.date)}</div>
                <div className="font-bold">{workHour.hours} saat</div>
              </div>
              
              {workHour.description && (
                <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                  {workHour.description}
                </div>
              )}
              
              {deletingId === workHour.id ? (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-700 dark:text-red-400 text-sm mb-2">Bu kaydı silmek istediğinize emin misiniz?</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleConfirmDelete(workHour.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                    >
                      Evet, Sil
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(workHour)}
                    className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                    aria-label="Düzenle"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(workHour.id)}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    aria-label="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkHoursList;