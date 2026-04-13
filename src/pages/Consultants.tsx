// ============================================
// SATIŞ DANIŞMANLARI SAYFASI (Consultants.tsx) — YETKİLİ
// ============================================
// Kullanıcı rolüne göre danışman listesi filtreleniyor:
// - admin: tüm mağazaların danışmanları
// - super_user: izinli mağazaların danışmanları
// - store: sadece kendi mağazasının danışmanları

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Award } from 'lucide-react';

const API = '/api';
function Consultants() {
  // ---------- KULLANICI BİLGİSİ ----------
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || 'admin';
  const userStoreCodes: string[] | null = user?.storeCodes || null;

  // ---------- STATE ----------
  const [startDate, setStartDate] = useState('2025-09-01');
  const [endDate, setEndDate] = useState('2025-09-07');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [salespersons, setSalespersons] = useState<any[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>(
    userRole === 'store' && userStoreCodes && userStoreCodes.length > 0
      ? userStoreCodes[0]
      : ''
  );

  // ---------- VERİ ÇEKME ----------
  const fetchData = async (start: string, end: string) => {
    setLoading(true);
    setError(null);

    // Eğer kullanıcı admin değilse, kendi mağazalarını URL'e ekle
    let storeParam = '';
    if (userStoreCodes && userStoreCodes.length > 0) {
      storeParam = `&storeCode=${userStoreCodes.join(',')}`;
    }

    try {
      const res = await fetch(
        `${API}/consultants?startDate=${start}&endDate=${end}${storeParam}`
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Sunucu hatası: ${res.status}`);
      }

      const result = await res.json();
      setConsultants(Array.isArray(result) ? result : []);
    } catch (err: any) {
      setError(err.message || 'Veri alınamadı');
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- DANIŞMAN LİSTESİ (sp_Akinon_SalesPerson) ----------
  const fetchSalespersons = async () => {
    try {
      let storeParam = '';
      if (userStoreCodes && userStoreCodes.length > 0) {
        storeParam = `?storeCode=${userStoreCodes.join(',')}`;
      }
      const res = await fetch(`${API}/salespersons${storeParam}`);
      if (res.ok) {
        const result = await res.json();
        setSalespersons(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      console.error('Danışman listesi alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
    fetchSalespersons();
  }, []);

  const handleFilter = () => {
    fetchData(startDate, endDate);
  };

  // Mağaza listesi (sp_Akinon_SalesPerson'dan)
  const storeDescMap = new Map<string, string>();
  salespersons.forEach((s: any) => {
    if (s.storeCode && s.storeDescription) {
      storeDescMap.set(s.storeCode, s.storeDescription);
    }
  });
  const availableStores = Array.from(storeDescMap.keys()).sort();

  // Seçili mağazaya ait danışman listesi (sp_Akinon_SalesPerson'dan)
  const availableConsultants = salespersons
    .filter((s: any) => !selectedStore || s.storeCode === selectedStore)
    .map((s: any) => s.name)
    .filter((name: string, i: number, arr: string[]) => arr.indexOf(name) === i)
    .sort((a: string, b: string) => a.localeCompare(b, 'tr'));

  // Seçili danışman varsa sadece onu göster, yoksa tümünü
  // Hem mağaza hem danışman filtresine göre filtrele
  // Hem mağaza hem danışman filtresine göre filtrele
  const displayConsultants = consultants.filter((c: any) => {
    const matchStore = !selectedStore || c.storeCode === selectedStore;
    const matchConsultant = !selectedConsultant || c.name === selectedConsultant;
    return matchStore && matchConsultant;
  });
  const bestConsultant = displayConsultants.length > 0 ? displayConsultants[0] : null;

  const salesChartData = displayConsultants.map(c => ({
    name: c.name.split(' ')[0],
    value: c.salesAmount,
  }));

  const invoiceChartData = displayConsultants.map(c => ({
    name: c.name.split(' ')[0],
    value: c.invoiceCount,
  }));

  return (
    <div className="p-6">
      {/* ===== BAŞLIK + TARİH FİLTRESİ ===== */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">Satış Danışmanları</h1>
          <p className="text-sm text-[#5d0024]/60">
            {userRole === 'store'
              ? `${user?.name} - Danışman performansı`
              : 'Danışman bazlı performans takibi'}
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label className="text-xs text-[#5d0024]/60 block mb-1">Başlangıç</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[#5d0024]/60 block mb-1">Bitiş</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
            />
          </div>
          <button
            onClick={handleFilter}
            disabled={loading}
            className="bg-white text-[#5d0024] border border-gray-300 px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Yükleniyor...' : 'Filtrele'}
          </button>

          {/* Danışman seçici */}
          <div>
            <label className="text-xs text-[#5d0024]/60 block mb-1">Danışman</label>
            <select
              value={selectedConsultant}
              onChange={(e) => setSelectedConsultant(e.target.value)}
              className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none min-w-[200px]"
            >
              <option value="">Tüm Danışmanlar</option>
              {availableConsultants.map((name: string) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Mağaza seçici - sadece admin/super_user için */}
          {userRole !== 'store' && (
            <div>
              <label className="text-xs text-[#5d0024]/60 block mb-1">Mağaza</label>
              <select
                value={selectedStore}
                onChange={(e) => {
                  setSelectedStore(e.target.value);
                  setSelectedConsultant('');
                }}
                className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none min-w-[200px]"
              >
                <option value="">Tüm Mağazalar</option>
                {availableStores.map((code: string) => (
                  <option key={code} value={code}>{storeDescMap.get(code) || code}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-[#5d0024]">
          <div className="w-10 h-10 border-4 border-[#5d0024]/20 border-t-[#5d0024] rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Danışmanlar yükleniyor...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 font-medium text-sm">Hata: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ===== EN İYİ DANIŞMAN ===== */}
          {bestConsultant && (
            <div className="bg-[#5d0024] rounded-xl p-5 mb-6">
              <p className="text-[#e8b4c0] text-sm">Seçilen dönemin en iyi danışmanı</p>
              <div className="flex items-center gap-4 mt-2">
                <Award size={36} className="text-[#c4a11b]" />
                <div>
                  <h2 className="text-white text-xl font-bold">{bestConsultant.name}</h2>
                  <p className="text-[#e8b4c0] text-sm">
                    ₺{bestConsultant.salesAmount.toLocaleString('tr-TR')} — {bestConsultant.invoiceCount} fatura
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===== DANIŞMAN TABLOSU ===== */}
          {displayConsultants.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-gray-200 text-center text-gray-400 mb-6">
              Bu dönemde danışman verisi bulunamadı
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Sıra</th>
                    <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Danışman</th>
                    <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Satış Tutarı</th>
                    <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Fatura Sayısı</th>
                    <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Ort. Sepet</th>
                    <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">İade Adedi</th>
                    <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">İade Tutarı (VH)</th>
                  </tr>
                </thead>
                <tbody>
                  {displayConsultants.map((c: any, index: number) => (
                    <tr key={c.rank} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${index < 3 ? 'bg-[#e8b4c0]/30 text-[#5d0024]' : 'text-[#2a0010]'
                          }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[#2a0010]">{c.name}</td>
                      <td className="px-4 py-3 text-sm font-bold text-[#2a0010]">₺{c.salesAmount.toLocaleString('tr-TR')}</td>
                      <td className="px-4 py-3 text-sm text-[#2a0010]">{c.invoiceCount}</td>
                      <td className="px-4 py-3 text-sm text-[#2a0010]">₺{c.avgBasket.toLocaleString('tr-TR')}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#e41e2d]">
                        {c.returnQty > 0 ? c.returnQty : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[#e41e2d]">
                        {c.returnAmount > 0 ? `₺${c.returnAmount.toLocaleString('tr-TR')}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== GRAFİKLER ===== */}
          {displayConsultants.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <h3 className="text-sm font-medium text-[#5d0024] mb-2">Satış Tutarı Karşılaştırması</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₺${v / 1000}K`} />
                    <Tooltip formatter={(v: any) => [`₺${Number(v).toLocaleString('tr-TR')}`, 'Satış']} />
                    <Bar dataKey="value" fill="#5d0024" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <h3 className="text-sm font-medium text-[#5d0024] mb-2">Fatura Sayısı Karşılaştırması</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={invoiceChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: any) => [`${v} adet`, 'Fatura']} />
                    <Bar dataKey="value" fill="#c4a11b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Consultants;