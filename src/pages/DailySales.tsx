import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const API = 'http://localhost:3001/api';

interface StoreData {
  StoreCode: string;
  StoreDescription: string;
  Qty1: number;
  SMM: number;
  SATISVH: number;
  Kar: number;
  'Brüt KAR %': number;
  mf: number;
  SiparisMiktarı: number;
  Siparis_Tutarı: number;
  'Fatura Sayısı': number;
  'Giren Kişi Sayısı': number;
  'Dönüşüm Oranı': number;
  'LFL Satış (VH)': number;
  'LFL Satış (VH) % Değişim': number | null;
  'LFL Fatura Sayısı': number;
  'LFL Satış Adeti': number;
  SepetBüyüklüğüAdet: number;
  SepetBüyüklüğüTutar: number;
  BirimFiyatı: number;
  HedefGerçekleşenYüzde: number;
  'GünlükHedef': number;
  Invoicedate: string;
  HaftalikDegisim: number;
}

type DisplayData = {
  toplamSatis: number;
  magazaGirenKisi: number;
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
  toplamSatis: 0,
  magazaGirenKisi: 0,
  ortDonusum: 0,
  toplamMiktar: 0,
  hedefGerclesme: 0,
  ortBrutKar: 0,
  birimFiyat: 0,
  sepetTutar: 0,
  sepetAdet: 0,
  hedef: 0,
  gecenYilSatis: 0,
  yillikDegisim: 0,
  faturaSayisi: 0,
};

function DailySales() {
  // localStorage'dan giriş yapan kullanıcıyı oku
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || 'admin'; // admin | super_user | store
  const userStoreCodes: string[] | null = user?.storeCodes || null;
  // store rolü → sadece kendi mağazasını görebilir
  // super_user → sadece izinli mağazaları görebilir
  // admin → tümünü görebilir (storeCodes null)
  const [startDate, setStartDate] = useState('2025-09-07');
  const [endDate, setEndDate] = useState('2025-09-07');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slowLoading, setSlowLoading] = useState(false);
  const [allStores, setAllStores] = useState<StoreData[]>([]);
// Eğer store kullanıcısıysa otomatik olarak kendi mağazası seçili gelir
  const [selectedStore, setSelectedStore] = useState<string>(
    userRole === 'store' && userStoreCodes && userStoreCodes.length > 0
      ? userStoreCodes[0]
      : ''
  );
  const fetchData = async (start: string, end: string) => {
    setLoading(true);
    setError(null);
    setSlowLoading(false);

    const controller = new AbortController();

    const frontendTimeout = setTimeout(() => {
      controller.abort();
    }, 65000);

    const slowTimer = setTimeout(() => {
      setSlowLoading(true);
    }, 15000);

    try {
      const res = await fetch(
        `${API}/dashboard/gunluk?startDate=${start}&endDate=${end}`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Sunucu hatası: ${res.status}`);
      }

      const result = await res.json();
      console.log('🔥 BACKEND DEN GELEN VERI ÖRNEĞİ:', result?.[0]);
      setAllStores(Array.isArray(result) ? result : []);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.');
      } else {
        setError(err.message || 'Veri alınamadı.');
      }
      setAllStores([]);
    } finally {
      clearTimeout(frontendTimeout);
      clearTimeout(slowTimer);
      setLoading(false);
      setSlowLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);

  // ---------- KULLANICI YETKİSİ KONTROLÜ ----------
  // Veri geldikten sonra: store/super_user için sadece izinli mağazaları filtrele
  const visibleStores = userStoreCodes
    ? allStores.filter(s => userStoreCodes.includes(s.StoreCode))
    : allStores;

  const handleFilter = () => fetchData(startDate, endDate);

  const getDisplayData = (): DisplayData => {
    if (allStores.length === 0) return emptyData;

    if (selectedStore) {
      const store = allStores.find((s) => s.StoreCode === selectedStore);
      if (!store) return emptyData;

      return {
        toplamSatis: store.SATISVH || 0,
        magazaGirenKisi: store['Giren Kişi Sayısı'] || 0,
        ortDonusum: store['Dönüşüm Oranı'] || 0,
        toplamMiktar: store.Qty1 || 0,
        hedefGerclesme: store.HedefGerçekleşenYüzde || 0,
        ortBrutKar: (store['Brüt KAR %'] || 0) * 100,
        birimFiyat: store.BirimFiyatı || 0,
        sepetTutar: store.SepetBüyüklüğüTutar || 0,
        sepetAdet: store.SepetBüyüklüğüAdet || 0,
        hedef: store['GünlükHedef'] || 0,
        gecenYilSatis: store['LFL Satış (VH)'] || 0,
        yillikDegisim: store['LFL Satış (VH) % Değişim'] || 0,
        faturaSayisi: store['Fatura Sayısı'] || 0,
      };
    }

    const total = allStores.reduce(
      (acc, s) => ({
        SATISVH: acc.SATISVH + (s.SATISVH || 0),
        Qty1: acc.Qty1 + (s.Qty1 || 0),
        Kar: acc.Kar + (s.Kar || 0),
        Fatura: acc.Fatura + (s['Fatura Sayısı'] || 0),
        Ziyaretci: acc.Ziyaretci + (s['Giren Kişi Sayısı'] || 0),
        Hedef: acc.Hedef + (s['GünlükHedef'] || 0),
        LFL: acc.LFL + (s['LFL Satış (VH)'] || 0),
      }),
      { SATISVH: 0, Qty1: 0, Kar: 0, Fatura: 0, Ziyaretci: 0, Hedef: 0, LFL: 0 }
    );

    return {
      toplamSatis: total.SATISVH,
      magazaGirenKisi: total.Ziyaretci,
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
  };

  const data = getDisplayData();
  const fmt = (n: number) => Math.round(n).toLocaleString('tr-TR');
  const fmtPct = (n: number) => n.toFixed(1);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">Günlük Satış</h1>
          <p className="text-sm text-[#5d0024]/60">Satış performansı ve kanal analizi</p>
        </div>

        <div className="flex items-end gap-3 flex-wrap">
          {/* Mağaza dropdown — sadece admin ve super_user için görünür */}
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

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-[#5d0024]">
          <div className="w-10 h-10 border-4 border-[#5d0024]/20 border-t-[#5d0024] rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Veriler yükleniyor, lütfen bekleyin...</p>
          <p className="text-xs text-[#5d0024]/50 mt-1">Bu işlem 10-15 saniye sürebilir</p>

          {slowLoading && (
            <p className="text-sm text-orange-600 mt-3 font-medium">
              Sorgu uzun sürüyor, lütfen bekleyin...
            </p>
          )}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-red-700 font-medium text-sm">Hata oluştu</p>
            <p className="text-red-500 text-xs mt-1">{error}</p>
          </div>
          <button
            onClick={handleFilter}
            className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm hover:bg-red-200 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-[#5d0024] rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">
                {selectedStore
                  ? allStores.find((s) => s.StoreCode === selectedStore)?.StoreDescription
                  : 'Tüm Mağazalar (Toplam)'}
              </h2>
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                %{fmtPct(data.hedefGerclesme)}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-3">
              {[
                { label: 'GünlükHedef', value: `₺${fmt(data.hedef)}` },
                { label: 'Toplam Satış (VH)', value: `₺${fmt(data.toplamSatis)}` },
                { label: 'Mağazaya Giren Kişi', value: fmt(data.magazaGirenKisi) },
                { label: 'Ort. Dönüşüm', value: `%${fmtPct(data.ortDonusum)}` },
                { label: 'Toplam Miktar', value: fmt(data.toplamMiktar) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-[#e8b4c0] uppercase">{label}</p>
                  <p className="text-xl font-bold text-white mt-1">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'H. Gerç. Oranı', value: `%${fmtPct(data.hedefGerclesme)}` },
                { label: 'Ort. Brüt Kar %', value: `%${fmtPct(data.ortBrutKar)}` },
                { label: 'Birim Fiyat', value: `₺${fmt(data.birimFiyat)}` },
                { label: 'Sepet Büyüklüğü Tutar', value: `₺${fmt(data.sepetTutar)}` },
                { label: 'Sepet Büyüklüğü Adet', value: fmtPct(data.sepetAdet) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-[#e8b4c0] uppercase">{label}</p>
                  <p className="text-xl font-bold text-white mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

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
                <p className="text-xs text-[#e8b4c0]">Toplam Satış</p>
                <p className="text-2xl font-bold text-[#2a0010] mt-1">₺{fmt(data.toplamSatis)}</p>
              </div>
              <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
                <p className="text-xs text-[#e8b4c0]">Geçen Yıl Satış</p>
                <p className="text-2xl font-bold text-[#2a0010] mt-1">₺{fmt(data.gecenYilSatis)}</p>
              </div>
              <div className={`${data.yillikDegisim >= 0 ? 'bg-[#004f59]/10' : 'bg-[#e41e2d]/10'} rounded-lg p-4 text-center`}>
                <p className={`text-xs ${data.yillikDegisim >= 0 ? 'text-[#004f59]' : 'text-[#e41e2d]'}`}>Yıllık Değişim</p>
                <p className={`text-3xl font-bold mt-1 ${data.yillikDegisim >= 0 ? 'text-[#004f59]' : 'text-[#e41e2d]'}`}>
                  {data.yillikDegisim >= 0 ? '+' : ''}
                  {fmtPct(data.yillikDegisim)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">Geçen yıla göre değişim</p>
              </div>
            </div>
          </div>

          {!selectedStore && visibleStores.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Mağaza Bazında Satış Karşılaştırması</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={visibleStores.map((s) => ({
                    name: s.StoreCode,
                    satis: s.SATISVH,
                    hedef: s['GünlükHedef'],
                  }))}
                >
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



export default DailySales;