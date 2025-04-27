import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_master: boolean;
  created_at: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setUsers(data as User[]);
      }
      
      setLoading(false);
    };
    
    fetchUsers();
  }, []);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const handleDelete = (id: string) => {
    setDeletingId(id);
  };
  
  const handleCancelDelete = () => {
    setDeletingId(null);
  };
  
  const handleConfirmDelete = async (id: string) => {
    try {
      // First delete auth user (which will cascade delete the profile due to our DB constraint)
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.filter(user => user.id !== id));
      setDeletingId(null);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Kullanıcı silme sırasında bir hata oluştu');
    }
  };
  
  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Kullanıcı Yönetimi</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Kullanıcı bulunmamaktadır.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  E-posta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Yetki
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{user.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_master ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        Standart
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!user.is_master && (
                      deletingId === user.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleConfirmDelete(user.id)}
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                          >
                            Evet, Sil
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;