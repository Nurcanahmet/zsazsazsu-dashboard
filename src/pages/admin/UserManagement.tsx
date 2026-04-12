// ============================================
// KULLANICI YÖNETİMİ SAYFASI (Admin)
// ============================================
import { useState, useEffect } from 'react';
import { UserPlus, Pencil, Trash2, Search, ShieldCheck, Store, Users as UsersIcon } from 'lucide-react';
import UserModal from '../../components/UserModal';

const API = '/api';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'super_user' | 'store';
  storeCodes: string[] | null;
  allowedPages: string[];
}

function UserManagement() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/users`, {
        headers: { 'x-admin-email': currentUser.email },
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
      else setError(data.error || 'Kullanıcılar yüklenemedi');
    } catch (err: any) {
      setError(err.message || 'Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (email: string, name: string) => {
    if (!window.confirm(`"${name}" kullanıcısını silmek istediğinizden emin misiniz?`)) return;
    try {
      const res = await fetch(`${API}/admin/users/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': currentUser.email },
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || 'Silme başarısız');
      }
    } catch (err: any) {
      alert(err.message || 'Sunucu hatası');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleModalClose = (refresh: boolean) => {
    setModalOpen(false);
    setEditingUser(null);
    if (refresh) fetchUsers();
  };

  // Filtreleme
  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleLabels: Record<string, { label: string; color: string; icon: any }> = {
    admin: { label: 'Yönetici', color: 'bg-[#5d0024] text-white', icon: ShieldCheck },
    super_user: { label: 'Bölge Müdürü', color: 'bg-[#825dc7] text-white', icon: UsersIcon },
    store: { label: 'Mağaza', color: 'bg-[#004f59] text-white', icon: Store },
  };

  return (
    <div className="p-6">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-[#5d0024]/60">Toplam {users.length} kullanıcı</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#5d0024] text-white px-4 py-2 rounded-lg hover:bg-[#2a0010] transition-all shadow-md font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Yeni Kullanıcı Ekle
        </button>
      </div>

      {/* Arama ve filtre */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="İsim veya email ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024]"
        >
          <option value="all">Tüm Roller</option>
          <option value="admin">Yönetici</option>
          <option value="super_user">Bölge Müdürü</option>
          <option value="store">Mağaza</option>
        </select>
      </div>

      {loading && <p className="text-center text-[#5d0024] py-10">Yükleniyor...</p>}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">{error}</div>}

      {/* Tablo */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-[#5d0024] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Ad / Mağaza</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Mağazalar</th>
                <th className="px-4 py-3 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const r = roleLabels[user.role];
                const Icon = r.icon;
                return (
                  <tr key={user.email} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#2a0010]">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${r.color}`}>
                        <Icon className="w-3 h-3" />
                        {r.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {user.storeCodes === null ? (
                        <span className="text-[#5d0024] font-semibold">Tüm Mağazalar</span>
                      ) : user.storeCodes.length === 0 ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        user.storeCodes.join(', ')
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1.5 text-[#5d0024] hover:bg-[#5d0024]/10 rounded transition"
                          title="Düzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.email, user.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Kullanıcı bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <UserModal
          user={editingUser}
          currentUserEmail={currentUser.email}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default UserManagement;