// ============================================
// AYLIK SATIŞ SAYFASI (MonthlySales.tsx) — PROCEDURE BAĞLI
// ============================================
// Backend'den sp_solid_dashboard_gunluk procedure'ünden veri çeker.
// Seçilen ayın 1. ile son gününü gönderir, böylece o ayın toplamını alır.
// Kullanıcı rolüne göre mağaza filtreleme yapar.

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const API = '/api';

interface StoreData {
  StoreCode: string;
  StoreDescription: string;
  Qty1: number;
  SMM: number;
  SATISVH: number;
  Kar: number;
  'Brüt KAR %': number;
  mf: number;
  'Fatura Sayısı': number;
  'Giren Kişi Sayısı': number;
  'Dönüşüm Oranı': number;
  'LFL Satış (VH)': number;
  'LFL Satış (VH) % Değişim': number | null;
  SepetBüyüklüğüAdet: number;
  SepetBüyüklüğüTutar: number;
  BirimFiyatı: number;
  HedefGerçekleşenYüzde: number;
  GünlükHedef: number;
  Invoicedate: string;
}

type DisplayData = {
  toplamSatis: number;
  toplamKisi: number;
  ortDonusum: number;
  toplamMiktar: number;
  hedefGerclesme: number;
  ortBrutKar: number;
  birimFiyat: number;
  sepetTutar: number;
  sepetAdet: number;
  hedef: number;
  gecenYilSatis: number;
  yillikDegisim: number;
  faturaSayisi: number;
};

const emptyData: DisplayData = {
  toplamSatis: 0, toplamKisi: 0, ortDonusum: 0, toplamMiktar: 0,
  hedefGerclesme: 0, ortBrutKar: 0, birimFiyat: 0, sepetTutar: 0,
  sepetAdet: 0, hedef: 0, gecenYilSatis: 0, yillikDegisim: 0, faturaSayisi: 0,
};

function MonthlySales() {
  // ---------- KULLANICI BİLGİSİ ----------
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || 'admin';
  const userStoreCodes: string[] | null = user?.storeCodes || null;

  // ---------- STATE ----------
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allStores, setAllStores] = useState<StoreData[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>(
    userRole === 'store' && userStoreCodes && userStoreCodes.length > 0
      ? userStoreCodes[0]
      : ''
  );

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // ---------- VERİ ÇEKME ----------
  // Seçilen ayın 1. günü ile son gününü hesapla, procedure'e gönder
const fetchData = async (year: number, month: number) => {
    setLoading(true);
    setError(null);

    // Ayın ilk günü: YYYY-MM-01
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    // Ayın son günü: bir sonraki ayın 0. günü = bu ayın son günü
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    // Kullanıcı rolüne göre storeCode gönder
    let storeParam = '';
    if (userStoreCodes && userStoreCodes.length > 0) {
      storeParam = `&storeCode=${userStoreCodes.join(',')}`;
    }

    try {
      // PARALEL İKİ API ÇAĞRISI: Satış verisi (günlük procedure) + Hedef verisi
      const [salesRes, hedefRes] = await Promise.all([
        fetch(`${API}/dashboard/gunluk?startDate=${startDate}&endDate=${endDate}${storeParam}`),
        fetch(`${API}/dashboard/hedefler?startDate=${startDate}&endDate=${endDate}${storeParam}`),
      ]);

      if (!salesRes.ok) {
        const errData = await salesRes.json().catch(() => null);
        throw new Error(errData?.error || `Sunucu hatası: ${salesRes.status}`);
      }

      const salesData = await salesRes.json();
      const hedefData = hedefRes.ok ? await hedefRes.json() : [];

      // Hedefleri mağaza koduna göre map'e koy
      const hedefMap: Record<string, number> = {};
      hedefData.forEach((h: any) => {
        hedefMap[h.StoreCode] = h.GunlukHedef || 0;
      });

      // Satış verisine hedef ve hesaplanmış alanları ekle
      const enriched = (Array.isArray(salesData) ? salesData : []).map((store: any) => {
        const hedef = hedefMap[store.StoreCode] || 0;
        const satis = store.SATISVH || 0;
        const miktar = store.Qty1 || 0;
        const fatura = store['Fatura Sayısı'] || 0;
        const ziyaretci = store['Giren Kişi Sayısı'] || 0;
        const kar = store.Kar || 0;

        return {
          ...store,
          GünlükHedef: hedef,
          HedefGerçekleşenYüzde: hedef > 0 ? (satis / hedef) * 100 : 0,
          'Dönüşüm Oranı': ziyaretci > 0 ? (fatura / ziyaretci) * 100 : 0,
          BirimFiyatı: miktar > 0 ? satis / miktar : 0,
          SepetBüyüklüğüTutar: fatura > 0 ? satis / fatura : 0,
          SepetBüyüklüğüAdet: fatura > 0 ? miktar / fatura : 0,
          ortBrutKar_calc: satis > 0 ? (kar / satis) * 100 : 0,
        };
      });

      setAllStores(enriched);
    } catch (err: any) {
      setError(err.message || 'Veri alınamadı');
      setAllStores([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // ---------- KULLANICI YETKİSİ KONTROLÜ ----------
  const visibleStores = userStoreCodes
    ? allStores.filter(s => userStoreCodes.includes(s.StoreCode))
    : allStores;

  // ---------- HESAPLAMA ----------
  const data: DisplayData = useMemo(() => {
    if (allStores.length === 0) return emptyData;

    if (selectedStore) {
      const store = allStores.find(s => s.StoreCode === selectedStore);
      if (!store) return emptyData;
      return {
        toplamSatis: store.SATISVH || 0,
        toplamKisi: store['Giren Kişi Sayısı'] || 0,
        ortDonusum: store['Dönüşüm Oranı'] || 0,
        toplamMiktar: store.Qty1 || 0,
        hedefGerclesme: store.HedefGerçekleşenYüzde || 0,
        ortBrutKar: (store as any).ortBrutKar_calc || (store['Brüt KAR %'] || 0) * 100,        birimFiyat: store.BirimFiyatı || 0,
        sepetTutar: store.SepetBüyüklüğüTutar || 0,
        sepetAdet: store.SepetBüyüklüğüAdet || 0,
        hedef: store.GünlükHedef || 0,
        gecenYilSatis: store['LFL Satış (VH)'] || 0,
        yillikDegisim: store['LFL Satış (VH) % Değişim'] || 0,
        faturaSayisi: store['Fatura Sayısı'] || 0,
      };
    }

    // Tüm mağazaların toplamı
    const total = allStores.reduce(
      (acc, s) => ({
        SATISVH: acc.SATISVH + (s.SATISVH || 0),
        Qty1: acc.Qty1 + (s.Qty1 || 0),
        Kar: acc.Kar + (s.Kar || 0),
        Fatura: acc.Fatura + (s['Fatura Sayısı'] || 0),
        Ziyaretci: acc.Ziyaretci + (s['Giren Kişi Sayısı'] || 0),
        Hedef: acc.Hedef + (s.GünlükHedef || 0),
        LFL: acc.LFL + (s['LFL Satış (VH)'] || 0),
      }),
      { SATISVH: 0, Qty1: 0, Kar: 0, Fatura: 0, Ziyaretci: 0, Hedef: 0, LFL: 0 }
    );

    return {
      toplamSatis: total.SATISVH,
      toplamKisi: total.Ziyaretci,
      ortDonusum: total.Ziyaretci > 0 ? (total.Fatura / total.Ziyaretci) * 100 : 0,
      toplamMiktar: total.Qty1,
      hedefGerclesme: total.Hedef > 0 ? (total.SATISVH / total.Hedef) * 100 : 0,
      ortBrutKar: total.SATISVH > 0 ? (total.Kar / total.SATISVH) * 100 : 0,
      birimFiyat: total.Qty1 > 0 ? total.SATISVH / total.Qty1 : 0,
      sepetTutar: total.Fatura > 0 ? total.SATISVH / total.Fatura : 0,
      sepetAdet: total.Fatura > 0 ? total.Qty1 / total.Fatura : 0,
      hedef: total.Hedef,
      gecenYilSatis: total.LFL,
      yillikDegisim: total.LFL > 0 ? ((total.SATISVH - total.LFL) / total.LFL) * 100 : 0,
      faturaSayisi: total.Fatura,
    };
  }, [allStores, selectedStore]);

  const fmt = (n: number) => Math.round(n).toLocaleString('tr-TR');
  const fmtPct = (n: number) => n.toFixed(1);

  return (
    <div className="p-6">
      {/* ===== BAŞLIK + FİLTRELER ===== */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">Aylık Satış</h1>
          <p className="text-sm text-[#5d0024]/60">
            {loading ? 'Yükleniyor...' : `Dönem: ${selectedYear} ${months[selectedMonth - 1]}`}
          </p>
        </div>
        <div className="flex items-end gap-3 flex-wrap">
          {/* Mağaza seçici — sadece admin/super_user için */}
          {userRole !== 'store' && (
            <div>
              <label className="text-xs text-[#5d0024]/60 block mb-1">Mağaza</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none min-w-[200px]"
              >
                {userRole === 'admin' && (
                  <option value="">Tüm Mağazalar (Toplam)</option>
                )}
                {visibleStores.map((s) => (
                  <option key={s.StoreCode} value={s.StoreCode}>
                    {s.StoreDescription}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-[#5d0024]/60 block mb-1">Yıl</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#5d0024]/60 block mb-1">Ay</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-[#5d0024]">
          <div className="w-10 h-10 border-4 border-[#5d0024]/20 border-t-[#5d0024] rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Veriler yükleniyor, lütfen bekleyin...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 font-medium text-sm">Hata: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ===== MAĞAZA BÖLÜMÜ ===== */}
          <div className="bg-[#5d0024] rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">
                {selectedStore
                  ? allStores.find(s => s.StoreCode === selectedStore)?.StoreDescription
                  : 'Tüm Mağazalar (Toplam)'}
              </h2>
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                %{fmtPct(data.hedefGerclesme)}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-3">
              {[
                { label: 'Aylık Hedef', value: `₺${fmt(data.hedef)}` },
                { label: 'Toplam Satış (VH)', value: `₺${fmt(data.toplamSatis)}` },
                { label: 'H. Gerç. Oranı', value: `%${fmtPct(data.hedefGerclesme)}` },
                { label: 'Ort. Brüt Kar %', value: `%${fmtPct(data.ortBrutKar)}` },
                { label: 'Birim Fiyat', value: `₺${fmt(data.birimFiyat)}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-[#e8b4c0] uppercase">{label}</p>
                  <p className="text-xl font-bold text-white mt-1">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'Sepet Büyüklüğü Tutar', value: `₺${fmt(data.sepetTutar)}` },
                { label: 'Sepet Büyüklüğü Adet', value: fmtPct(data.sepetAdet) },
                { label: 'Toplam Kişi', value: fmt(data.toplamKisi) },
                { label: 'Ort. Dönüşüm', value: `%${fmtPct(data.ortDonusum)}` },
                { label: 'Toplam Miktar', value: fmt(data.toplamMiktar) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-[#e8b4c0] uppercase">{label}</p>
                  <p className="text-xl font-bold text-white mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== HEDEF GERÇEKLEŞME BAR ===== */}
          <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#2a0010]">Hedef Gerçekleşme</h3>
              <span className="text-sm text-[#5d0024] font-medium">%{fmtPct(data.hedefGerclesme)}</span>
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
                <h3 className="text-sm font-bold text-[#2a0010]">Toplam Satış vs Geçen Seneki Satış (LFL)</h3>
                <p className="text-xs text-gray-400">Like-For-Like karşılaştırma</p>
              </div>
              <span className="bg-gray-100 text-[#5d0024] text-xs px-3 py-1 rounded-full font-medium">YoY</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
                <p className="text-xs text-[#e8b4c0]">Bu Ay Satış</p>
                <p className="text-2xl font-bold text-[#2a0010] mt-1">₺{fmt(data.toplamSatis)}</p>
              </div>
              <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
                <p className="text-xs text-[#e8b4c0]">Geçen Yıl Aynı Ay</p>
                <p className="text-2xl font-bold text-[#2a0010] mt-1">₺{fmt(data.gecenYilSatis)}</p>
              </div>
              <div className={`${data.yillikDegisim >= 0 ? 'bg-[#004f59]/10' : 'bg-[#e41e2d]/10'} rounded-lg p-4 text-center`}>
                <p className={`text-xs ${data.yillikDegisim >= 0 ? 'text-[#004f59]' : 'text-[#e41e2d]'}`}>Yıllık Değişim</p>
                <p className={`text-3xl font-bold mt-1 ${data.yillikDegisim >= 0 ? 'text-[#004f59]' : 'text-[#e41e2d]'}`}>
                  {data.yillikDegisim >= 0 ? '+' : ''}{fmtPct(data.yillikDegisim)}%
                </p>
              </div>
            </div>
          </div>

          {/* ===== MAĞAZA KARŞILAŞTIRMA GRAFİĞİ ===== */}
          {!selectedStore && visibleStores.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Mağaza Bazında Aylık Satış</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={visibleStores.map(s => ({
                  name: s.StoreCode,
                  satis: s.SATISVH,
                  hedef: s.GünlükHedef,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₺${v / 1000}K`} />
                  <Tooltip formatter={(v: any) => `₺${Number(v).toLocaleString('tr-TR')}`} />
                  <Legend />
                  <Bar dataKey="satis" name="Satış" fill="#5d0024" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hedef" name="Hedef" fill="#e8b4c0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MonthlySales;