// ============================================
// KULLANICI EKLEME / DÜZENLEME MODAL
// ============================================
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const API = '/api';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'super_user' | 'store';
  storeCodes: string[] | null;
  allowedPages: string[];
  password?: string;
}

interface Store {
  StoreCode: string;
  StoreDescription: string;
}

interface Props {
  user: User | null; // null = ekleme, dolu = düzenleme
  currentUserEmail: string;
  onClose: (refresh: boolean) => void;
}

const PAGES = [
  { key: 'dashboard', label: 'Genel Bakış' },
  { key: 'daily', label: 'Günlük Satış' },
  { key: 'monthly', label: 'Aylık Satış' },
  { key: 'consultants', label: 'Satış Danışmanları' },
];
function UserModal({ user, currentUserEmail, onClose }: Props) {
  const isEdit = user !== null;
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || '');
  const [role, setRole] = useState<'admin' | 'super_user' | 'store'>(user?.role || 'store');
  const [storeCodes, setStoreCodes] = useState<string[]>(user?.storeCodes || []);
  const [allowedPages, setAllowedPages] = useState<string[]>(
    user?.allowedPages || ['dashboard', 'daily', 'monthly', 'consultants']
  );
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mağaza listesini çek
const [storesLoading, setStoresLoading] = useState(true);
const [storesError, setStoresError] = useState<string | null>(null);

useEffect(() => {
  const fetchStores = async () => {
    try {
      setStoresLoading(true);
      setStoresError(null);

      const res = await fetch(`${API}/admin/stores`, {
        headers: { 'x-admin-email': currentUserEmail },
      });

      const data = await res.json();

      if (data.success) {
        setAllStores(data.stores || []);
      } else {
        setStoresError(data.error || 'Mağazalar alınamadı');
      }
    } catch (err: any) {
      setStoresError(err.message || 'Sunucu hatası');
    } finally {
      setStoresLoading(false);
    }
  };

  fetchStores();
}, [currentUserEmail]);

  const toggleStore = (code: string) => {
    setStoreCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const togglePage = (page: string) => {
    setAllowedPages(prev =>
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError('Ad ve email zorunludur');
      return;
    }
    if (!isEdit && !password) {
      setError('Yeni kullanıcı için şifre zorunludur');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name,
        email,
        role,
        storeCodes: role === 'admin' ? null : storeCodes,
        allowedPages,
      };
      if (password) payload.password = password;

      const url = isEdit
        ? `${API}/admin/users/${encodeURIComponent(user!.email)}`
        : `${API}/admin/users`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUserEmail,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        onClose(true);
      } else {
        setError(data.error || 'İşlem başarısız');
      }
    } catch (err: any) {
      setError(err.message || 'Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#5d0024]">
            {isEdit ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Ad */}
          <div>
            <label className="block text-sm font-medium text-[#2a0010] mb-1">
              Ad / Mağaza Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024]"
              placeholder="Örn: Director of Retail Sales"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#2a0010] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024] disabled:bg-gray-100"
              placeholder="ornek@zsazsazsu.com.tr"
              required
            />
            {isEdit && <p className="text-xs text-gray-400 mt-1">Email düzenlenemez</p>}
          </div>

          {/* Şifre */}
          <div>
           <label className="block text-sm font-medium text-[#2a0010] mb-1">
              Şifre
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024]"
              placeholder={isEdit ? 'Yeni şifre (opsiyonel)' : 'Şifre'}
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-[#2a0010] mb-1">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024]"
            >
              <option value="admin">Yönetici (Tüm mağazalar)</option>
              <option value="super_user">Bölge Müdürü (Birkaç mağaza)</option>
              <option value="store">Mağaza Çalışanı (Tek mağaza)</option>
            </select>
          </div>

          {/* Mağaza seçimi (admin değilse) */}
{/* Mağaza seçimi (admin değilse) */}
          {role !== 'admin' && (
            <div>
              <label className="block text-sm font-medium text-[#2a0010] mb-2">
                Mağazalar
              </label>

              {/* Dropdown - mağaza ekle */}
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value && !storeCodes.includes(e.target.value)) {
                    toggleStore(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024]"
              >
                <option value="">+ Mağaza ekle...</option>
                {allStores
                  .filter((s) => !storeCodes.includes(s.StoreCode))
                  .map((s) => (
                    <option key={s.StoreCode} value={s.StoreCode}>
                      {s.StoreCode} — {s.StoreDescription}
                    </option>
                  ))}
              </select>

              {/* Seçilen mağazaları etiket olarak göster */}
              {storeCodes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {storeCodes.map((code) => {
                    const store = allStores.find((s) => s.StoreCode === code);
                    return (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#5d0024]/10 text-[#5d0024] rounded-full text-xs font-medium"
                      >
                        {code} — {store?.StoreDescription || ''}
                        <button
                          type="button"
                          onClick={() => toggleStore(code)}
                          className="ml-1 hover:bg-[#5d0024]/20 rounded-full w-4 h-4 flex items-center justify-center"
                          title="Kaldır"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-1">
                {storeCodes.length} mağaza seçili
              </p>
            </div>
          )}

          {/* Sayfa erişim seçimi */}
          <div>
            <label className="block text-sm font-medium text-[#2a0010] mb-2">
              Erişebileceği Sayfalar ({allowedPages.length} seçili)
            </label>
            <div className="border border-gray-300 rounded-lg p-3 grid grid-cols-2 gap-2">
              {PAGES.map((page) => (
                <label key={page.key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={allowedPages.includes(page.key)}
                    onChange={() => togglePage(page.key)}
                    className="accent-[#5d0024]"
                  />
                  <span>{page.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              En az bir sayfa seçmelisiniz
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Butonlar */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#5d0024] text-white rounded-lg hover:bg-[#2a0010] font-medium disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;