// ============================================
// GÜNLÜK SATIŞ SAYFASI (DailySales.tsx) — BACKEND BAĞLANTILI
// ============================================

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { fetchDailySales, fetchCategoryDistribution } from '../services/api';

// Tip tanımları
interface DailySalesData {
  hedef: number;
  toplamSatis: number;
  magazaGirenKisi: number;
  ortDonusum: number;
  toplamMiktar: number;
  hedefGerclesme: number;
  ortBrutKar: number;
  birimFiyat: number;
  sepetTutar: number;
  sepetAdet: number;
  gecenYilSatis: number;
  yillikDegisim: number;
}

interface CategoryItem {
  name: string;
  value: number;
  percent?: number;
  amount?: number;
}

function DailySales() {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [data, setData] = useState<DailySalesData>({
    hedef: 80000,
    toplamSatis: 0,
    magazaGirenKisi: 0,
    ortDonusum: 0,
    toplamMiktar: 0,
    hedefGerclesme: 0,
    ortBrutKar: 72,
    birimFiyat: 0,
    sepetTutar: 0,
    sepetAdet: 0,
    gecenYilSatis: 0,
    yillikDegisim: 0,
  });

  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Static veriler (henüz backend endpoint'i yok)
  const haftalikCiro = {
    gecenHafta: 3528857,
    buHafta: 3329446,
    fark: -199410,
    degisim: -5.65,
  };
  const gunlukHaftalikCiro = {
    gecenHafta: 250914,
    buHafta: 216462,
    fark: -34452,
    degisim: -13.73,
  };
  const gunlukKarsilastirma = [
    { day: 'Pazartesi', y2025: 28000, y2026: 32000 },
    { day: 'Salı', y2025: 35000, y2026: 45000 },
    { day: 'Çarşamba', y2025: 30000, y2026: 42000 },
    { day: 'Perşembe', y2025: 38000, y2026: 40000 },
    { day: 'Cuma', y2025: 42000, y2026: 55000 },
    { day: 'Cumartesi', y2025: 50000, y2026: 72000 },
    { day: 'Pazar', y2025: 35000, y2026: 48000 },
  ];

  // ============================================
  // VERİ ÇEKME FONKSİYONU
  // ============================================
  const loadData = async (start: string, end: string) => {
    setLoading(true);
    setError('');
    try {
      // Ana KPI verileri + kategori verileri aynı anda çekiliyor
      const [salesData, categoryData] = await Promise.all([
        fetchDailySales(start, end),
        fetchCategoryDistribution(start, end),
      ]);

      setData(salesData);

      // Kategori verilerini yüzde ile zenginleştir
      const total = categoryData.reduce((sum: number, c: CategoryItem) => sum + c.value, 0);
      const enriched = categoryData.map((c: CategoryItem) => ({
        ...c,
        amount: c.value,
        percent: total > 0 ? Math.round((c.value / total) * 1000) / 10 : 0,
      }));
      setCategories(enriched);

    } catch (err: any) {
      setError('Veriler yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa ilk açıldığında bugünün verisini çek
  useEffect(() => {
    loadData(today, today);
  }, []);

  // Filtrele butonuna basılınca
  const handleFilter = () => {
    loadData(startDate, endDate);
  };

  const maxCategoryAmount = Math.max(...categories.map(c => c.amount || c.value), 1);

  return (
    <div className="p-6">
      {/* ===== BAŞLIK + TARİH FİLTRESİ ===== */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">Günlük Satış</h1>
          <p className="text-sm text-[#5d0024]/60">Satış performansı ve kanal analizi</p>
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
        </div>
      </div>

      {/* ===== HATA MESAJI ===== */}
      {error && (
        <div className="bg-[#e41e2d]/10 border border-[#e41e2d]/30 text-[#e41e2d] rounded-lg px-4 py-3 text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* ===== MAĞAZA BÖLÜMÜ ===== */}
      <div className={`bg-[#5d0024] rounded-xl p-5 mb-6 transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Mağaza</h2>
          <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
            %{data.hedefGerclesme}
          </span>
        </div>

        {/* KPI Satır 1 */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          {[
            { label: 'Günlük Hedef', value: `₺${data.hedef.toLocaleString('tr-TR')}` },
            { label: 'Toplam Satış (VH)', value: `₺${data.toplamSatis.toLocaleString('tr-TR')}` },
            { label: 'Mağazaya Giren Kişi', value: data.magazaGirenKisi.toLocaleString('tr-TR') },
            { label: 'Ort. Dönüşüm', value: `%${data.ortDonusum}` },
            { label: 'Toplam Miktar', value: data.toplamMiktar.toLocaleString('tr-TR') },
          ].map((kpi, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-xs text-[#e8b4c0] uppercase">{kpi.label}</p>
              <p className="text-xl font-bold text-white mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* KPI Satır 2 */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'H. Gerç. Oranı', value: `%${data.hedefGerclesme}` },
            { label: 'Ort. Brüt Kar %', value: `%${data.ortBrutKar}` },
            { label: 'Birim Fiyat', value: `₺${data.birimFiyat.toLocaleString('tr-TR')}` },
            { label: 'Sepet Büyüklüğü Tutar', value: `₺${data.sepetTutar.toLocaleString('tr-TR')}` },
            { label: 'Sepet Büyüklüğü Adet', value: data.sepetAdet.toString() },
          ].map((kpi, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-xs text-[#e8b4c0] uppercase">{kpi.label}</p>
              <p className="text-xl font-bold text-white mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== HEDEF GERÇEKLEŞME BAR ===== */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#2a0010]">Hedef Gerçekleşme</h3>
          <span className="text-sm text-[#5d0024] font-medium">%{data.hedefGerclesme}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#e8b4c0] h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(data.hedefGerclesme, 100)}%` }}
          />
        </div>
      </div>

      {/* ===== YoY KARŞILAŞTIRMA ===== */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#2a0010]">Toplam Satış vs Geçen Seneki Satış</h3>
            <p className="text-xs text-gray-400">Seçilen dönemin geçen yıl aynı dönemle karşılaştırması</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${data.yillikDegisim >= 0 ? 'bg-[#004f59]/10 text-[#004f59]' : 'bg-[#e41e2d]/10 text-[#e41e2d]'}`}>
            YoY {data.yillikDegisim >= 0 ? '▲' : '▼'} %{Math.abs(data.yillikDegisim)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
            <p className="text-xs text-[#e8b4c0]">Toplam Satış</p>
            <p className="text-2xl font-bold text-[#2a0010] mt-1">₺{data.toplamSatis.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
            <p className="text-xs text-[#e8b4c0]">Geçen Yıl Satış</p>
            <p className="text-2xl font-bold text-[#2a0010] mt-1">₺{data.gecenYilSatis.toLocaleString('tr-TR')}</p>
          </div>
          <div className={`rounded-lg p-4 text-center ${data.yillikDegisim >= 0 ? 'bg-[#004f59]/10' : 'bg-[#e41e2d]/10'}`}>
            <p className={`text-xs ${data.yillikDegisim >= 0 ? 'text-[#004f59]' : 'text-[#e41e2d]'}`}>Yıllık Değişim</p>
            <p className={`text-3xl font-bold mt-1 ${data.yillikDegisim >= 0 ? 'text-[#004f59]' : 'text-[#e41e2d]'}`}>
              {data.yillikDegisim >= 0 ? '+' : ''}{data.yillikDegisim}%
            </p>
            <p className={`text-xs mt-1 opacity-60 ${data.yillikDegisim >= 0 ? 'text-[#004f59]' : 'text-[#e41e2d]'}`}>
              Geçen yılın aynı dönemine göre.
            </p>
          </div>
        </div>
      </div>

      {/* ===== HAFTALIK CİRO DEĞİŞİMİ ===== */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📉 Haftalık Ciro Değişimi</h3>
          <div className="bg-[#004f59]/10 rounded-lg p-4 border-l-4 border-[#004f59]">
            <p className="text-sm font-bold text-[#004f59]">OFFLINE</p>
            <p className="text-lg font-bold text-[#e41e2d] mt-1">↓ {haftalikCiro.degisim}%</p>
            <p className="text-xs text-[#e8b4c0] uppercase mt-2">Geçen Hafta</p>
            <p className="text-lg font-bold text-[#2a0010]">₺{haftalikCiro.gecenHafta.toLocaleString('tr-TR')}</p>
            <div className="bg-[#004f59] text-white text-center py-2 rounded-lg mt-3 font-bold text-sm">BU HAFTA</div>
            <p className="text-lg font-bold text-[#2a0010] mt-2">₺{haftalikCiro.buHafta.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-[#e8b4c0] mt-2">Fark: <span className="text-[#2a0010] font-medium">₺{Math.abs(haftalikCiro.fark).toLocaleString('tr-TR')}</span></p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Günlük Haftalık Ciro Değişimi</h3>
          <div className="bg-[#004f59]/10 rounded-lg p-4 border-l-4 border-[#004f59]">
            <p className="text-sm font-bold text-[#004f59]">OFFLINE</p>
            <p className="text-lg font-bold text-[#e41e2d] mt-1">↓ {gunlukHaftalikCiro.degisim}%</p>
            <p className="text-xs text-[#e8b4c0] uppercase mt-2">Geçen Hafta</p>
            <p className="text-lg font-bold text-[#2a0010]">₺{gunlukHaftalikCiro.gecenHafta.toLocaleString('tr-TR')}</p>
            <div className="bg-[#004f59] text-white text-center py-2 rounded-lg mt-3 font-bold text-sm">
              BU HAFTA: ₺{gunlukHaftalikCiro.buHafta.toLocaleString('tr-TR')}
            </div>
          </div>
        </div>
      </div>

      {/* ===== KATEGORİ BAZINDA SATIŞ ===== */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Kategori Bazında Satış</h3>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Veri yok</p>
          ) : (
            <div className="space-y-3">
              {categories.map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#2a0010]">{cat.name}</span>
                    <span className="text-sm font-medium text-[#5d0024]">
                      ₺{(cat.amount || cat.value).toLocaleString('tr-TR')} ({cat.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#5d0024] h-2 rounded-full"
                      style={{ width: `${((cat.amount || cat.value) / maxCategoryAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top 10 Alt Grup — şimdilik static */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Top 10 Alt Grup Bazında Satış</h3>
          <p className="text-sm text-gray-400 text-center py-8">
            Backend endpoint'i henüz eklenmedi
          </p>
        </div>
      </div>

      {/* ===== GÜNLÜK SATIŞ KARŞILAŞTIRMASI ===== */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Günlük Satış Karşılaştırması</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gunlukKarsilastirma}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₺${v / 1000}K`} />
            <Tooltip formatter={(v: any) => [`₺${Number(v).toLocaleString('tr-TR')}`, '']} />
            <Legend />
            <Bar dataKey="y2025" name="2025" fill="#d7d2cb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="y2026" name="2026" fill="#5d0024" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DailySales;