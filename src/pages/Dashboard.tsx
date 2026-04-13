import { useState, useEffect, useCallback } from 'react';

const API = '/api';

type StoreRow = {
  StoreCode: string;
  StoreDescription: string;
  Qty1: number;
  SMM: number;
  SATISVH: number;
  Kar: number;
  'Bürüt KAR %': number;
  'Fatura Sayısı': number;
  'Giren Kişi Sayısı': number;
  'Dönüşüm Oranı': number;
  'LFL Satış (VH)': number;
  'LFL Satış (VH) % Değişim': number | null;
  SepetBüyüklügüAdet: number;
  SepetBüyüklügüTutar: number;
  BirimFiyatı: number;
  HedefGerçekleşenYüzde: number;
  GünlükHedef: number;
  HaftalikDegisim: number;
};

const fmt = (v?: number | null) =>
  v == null ? '-' : `₺${Math.round(v).toLocaleString('tr-TR')}`;
const fmtN = (v?: number | null) =>
  v == null ? '-' : Math.round(v).toLocaleString('tr-TR');
const fmtP = (v?: number | null) =>
  v == null ? '-' : `%${Number(v).toFixed(1)}`;

function hedefRenk(pct: number) {
  if (pct >= 100) return 'text-emerald-600';
  if (pct >= 75) return 'text-amber-500';
  return 'text-red-500';
}

function hedefBar(pct: number) {
  const capped = Math.min(pct, 100);
  let color = 'bg-red-400';
  if (pct >= 100) color = 'bg-emerald-500';
  else if (pct >= 75) color = 'bg-amber-400';
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div
        className={`${color} h-1.5 rounded-full transition-all duration-500`}
        style={{ width: `${capped}%` }}
      />
    </div>
  );
}

function KPI({
  title,
  value,
  sub,
  accent = false,
}: {
  title: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        accent
          ? 'bg-[#5d0024] border-[#5d0024] text-white'
          : 'bg-white border-gray-200 text-[#2a0010]'
      }`}
    >
      <p className={`text-xs mb-1 ${accent ? 'text-white/60' : 'text-[#5d0024]/50'}`}>
        {title}
      </p>
      <p className={`text-xl font-bold ${accent ? 'text-white' : 'text-[#5d0024]'}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-0.5 ${accent ? 'text-white/50' : 'text-gray-400'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  // ---------- KULLANICI BİLGİSİ ----------
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || 'admin';
  const userStoreCodes: string[] | null = user?.storeCodes || null;

  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(() => sessionStorage.getItem('dashboard_startDate') || today);
  const [endDate, setEndDate] = useState(() => sessionStorage.getItem('dashboard_endDate') || today);
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState<keyof StoreRow>('SATISVH');
  const [sortAsc, setSortAsc] = useState(false);

const fetchData = useCallback(async (start: string, end: string) => {
    setLoading(true);
    setError('');
    try {
      // Kullanıcı rolüne göre storeCode gönder
      let storeParam = '';
      if (userStoreCodes && userStoreCodes.length > 0) {
        storeParam = `&storeCode=${userStoreCodes.join(',')}`;
      }

      // PARALEL İKİ API ÇAĞRISI: Satış verisi + Hedef verisi
      const [salesRes, hedefRes] = await Promise.all([
        fetch(`${API}/dashboard/gunluk?startDate=${start}&endDate=${end}${storeParam}`),
        fetch(`${API}/dashboard/hedefler?startDate=${start}&endDate=${end}${storeParam}`),
      ]);

      if (!salesRes.ok) throw new Error('API hatası');

      const salesData = await salesRes.json();
      const hedefData = hedefRes.ok ? await hedefRes.json() : [];

      // Hedefleri mağaza koduna göre map'e koy
      const hedefMap: Record<string, number> = {};
      hedefData.forEach((h: any) => {
        hedefMap[h.StoreCode] = h.GunlukHedef || 0;
      });

      // Satış verisine hedef ve hesaplanmış alanları ekle
      const rawStores = Array.isArray(salesData) ? salesData : salesData.stores ?? [];
      const enriched = rawStores.map((s: any) => {
        const hedef = hedefMap[s.StoreCode] || 0;
        const satis = s.SATISVH || 0;
        const miktar = s.Qty1 || 0;
        const fatura = s['Fatura Sayısı'] || 0;
        const ziyaretci = s['Giren Kişi Sayısı'] || 0;

        return {
          ...s,
          GünlükHedef: hedef,
          HedefGerçekleşenYüzde: hedef > 0 ? (satis / hedef) * 100 : 0,
          'Dönüşüm Oranı': ziyaretci > 0 ? (fatura / ziyaretci) * 100 : 0,
          BirimFiyatı: miktar > 0 ? satis / miktar : 0,
          SepetBüyüklügüTutar: fatura > 0 ? satis / fatura : 0,
          SepetBüyüklügüAdet: fatura > 0 ? miktar / fatura : 0,
        };
      });

      setStores(enriched);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userStoreCodes]);

  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);

  console.log('🔥 Dashboard - userRole:', userRole, 'storeCodes:', userStoreCodes);

  // ---------- KULLANICI YETKİSİ FİLTRESİ ----------
  // store/super_user için sadece izinli mağazaları göster
  const visibleStores = userStoreCodes
    ? stores.filter(s => userStoreCodes.includes(s.StoreCode))
    : stores;

  // --- Toplam hesapla (sadece görünür mağazalar üzerinden) ---
  const total = visibleStores.reduce(
    (acc, s) => ({
      satis: acc.satis + (s.SATISVH || 0),
      miktar: acc.miktar + (s.Qty1 || 0),
      kar: acc.kar + (s.Kar || 0),
      hedef: acc.hedef + (s.GünlükHedef || 0),
      fatura: acc.fatura + (s['Fatura Sayısı'] || 0),
      ziyaretci: acc.ziyaretci + (s['Giren Kişi Sayısı'] || 0),
    }),
    { satis: 0, miktar: 0, kar: 0, hedef: 0, fatura: 0, ziyaretci: 0 }
  );

  const ortDonusum =
    total.ziyaretci > 0 ? (total.fatura / total.ziyaretci) * 100 : 0;
  const ortSepet = total.fatura > 0 ? total.satis / total.fatura : 0;
  const birimFiyat = total.miktar > 0 ? total.satis / total.miktar : 0;
  const brutKar = total.satis > 0 ? (total.kar / total.satis) * 100 : 0;
  const hedefPct = total.hedef > 0 ? (total.satis / total.hedef) * 100 : 0;

  // --- Sıralama ---
  const sorted = [...visibleStores].sort((a, b) => {
    const av = a[sortKey] as number;
    const bv = b[sortKey] as number;
    if (av == null) return 1;
    if (bv == null) return -1;
    return sortAsc ? av - bv : bv - av;
  });

  const handleSort = (key: keyof StoreRow) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortTh = ({
    label,
    k,
  }: {
    label: string;
    k: keyof StoreRow;
  }) => (
    <th
      className="py-2 px-3 text-left cursor-pointer select-none whitespace-nowrap hover:text-[#5d0024] transition-colors"
      onClick={() => handleSort(k)}
    >
      {label}
      {sortKey === k && (
        <span className="ml-1 text-[#5d0024]">{sortAsc ? '↑' : '↓'}</span>
      )}
    </th>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#5d0024]">Genel Bakış</h1>
        <p className="text-[#5d0024]/50 text-sm">
          {userRole === 'store'
            ? `${user?.name} - Mağaza Performansı`
            : userRole === 'super_user'
            ? `Bölge Mağazaları (${visibleStores.length})`
            : 'Tüm Mağazalar — Consolidated'}
        </p>
      </div>

      {/* Filtre */}
      <div className="flex items-end gap-3 mb-6 flex-wrap">
        <div>
          <label className="text-xs text-[#5d0024]/60 block mb-1">Başlangıç</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { sessionStorage.setItem('dashboard_startDate', e.target.value); setStartDate(e.target.value); }}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#5d0024] outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-[#5d0024]/60 block mb-1">Bitiş</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { sessionStorage.setItem('dashboard_endDate', e.target.value); setEndDate(e.target.value); }}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#5d0024] outline-none"
          />
        </div>
        <button
          onClick={() => fetchData(startDate, endDate)}
          disabled={loading}
          className="bg-[#5d0024] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#7a0030] transition-colors disabled:opacity-50"
        >
          {loading ? 'Yükleniyor...' : 'Filtrele'}
        </button>

        {/* Hızlı seçimler */}
        {['Bugün', 'Dün', 'Bu Hafta'].map((lbl) => (
          <button
            key={lbl}
            onClick={() => {
              const t = new Date();
              let s = today, e = today;
              if (lbl === 'Dün') {
                const d = new Date(t);
                d.setDate(d.getDate() - 1);
                s = e = d.toISOString().split('T')[0];
              } else if (lbl === 'Bu Hafta') {
                const d = new Date(t);
                d.setDate(d.getDate() - d.getDay() + 1);
                s = d.toISOString().split('T')[0];
              }
              sessionStorage.setItem('dashboard_startDate', s);
              sessionStorage.setItem('dashboard_endDate', e);
              setStartDate(s);
              setEndDate(e);
              fetchData(s, e);
            }}
            className="bg-white border border-gray-300 text-[#5d0024] px-4 py-2 rounded-lg text-sm hover:border-[#5d0024] transition-colors"
          >
            {lbl}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {/* KPI Kartları — Satır 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <KPI title="Toplam Ciro" value={fmt(total.satis)} accent />
        <KPI title="Hedef Gerçekleşme" value={fmtP(hedefPct)} sub={`Hedef: ${fmt(total.hedef)}`} />
        <KPI title="Toplam Miktar" value={fmtN(total.miktar)} sub="adet" />
        <KPI title="Toplam Fatura" value={fmtN(total.fatura)} />
      </div>

      {/* KPI Kartları — Satır 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPI title="Toplam Ziyaretçi" value={fmtN(total.ziyaretci)} />
        <KPI title="Dönüşüm Oranı" value={fmtP(ortDonusum)} />
        <KPI title="Ort. Sepet Tutarı" value={fmt(ortSepet)} />
        <KPI title="Brüt Kâr %" value={fmtP(brutKar)} sub={`Kâr: ${fmt(total.kar)}`} />
      </div>

      {/* Mağaza Tablosu */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#5d0024]">
            {userRole === 'store' ? 'Mağaza Detayları' : 'Mağaza Bazlı Performans'}
          </h3>
          <span className="text-xs text-gray-400">{visibleStores.length} mağaza</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#5d0024]/40 text-sm">
            Yükleniyor...
          </div>
        ) : visibleStores.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            Seçilen tarih aralığında veri bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="py-2 px-3 text-left whitespace-nowrap">Mağaza</th>
                  <SortTh label="Satış (VH)" k="SATISVH" />
                  <SortTh label="Hedef %" k="HedefGerçekleşenYüzde" />
                  <SortTh label="Fatura" k="Fatura Sayısı" />
                  <SortTh label="Miktar" k="Qty1" />
                  <SortTh label="Ziyaretçi" k="Giren Kişi Sayısı" />
                  <SortTh label="Dönüşüm %" k="Dönüşüm Oranı" />
                  <SortTh label="Sepet ₺" k="SepetBüyüklügüTutar" />
                  <SortTh label="Birim ₺" k="BirimFiyatı" />
                  <SortTh label="Brüt Kâr %" k="Bürüt KAR %" />
                  <SortTh label="LFL %" k="LFL Satış (VH) % Değişim" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => {
                  const lfl = s['LFL Satış (VH) % Değişim'];
                  const pct = s.HedefGerçekleşenYüzde || 0;
                  return (
                    <tr
                      key={s.StoreCode}
                      className={`border-b border-gray-50 hover:bg-[#5d0024]/5 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-medium text-[#2a0010] whitespace-nowrap">
                        <span className="text-[10px] text-gray-400 mr-1">{s.StoreCode}</span>
                        {s.StoreDescription}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#5d0024]">
                        {fmt(s.SATISVH)}
                      </td>
                      <td className="py-2.5 px-3 min-w-[90px]">
                        <span className={`font-semibold ${hedefRenk(pct)}`}>
                          %{pct.toFixed(1)}
                        </span>
                        {hedefBar(pct)}
                      </td>
                      <td className="py-2.5 px-3">{s['Fatura Sayısı']}</td>
                      <td className="py-2.5 px-3">{s.Qty1}</td>
                      <td className="py-2.5 px-3">{fmtN(s['Giren Kişi Sayısı'])}</td>
                      <td className="py-2.5 px-3">%{s['Dönüşüm Oranı']?.toFixed(1)}</td>
                      <td className="py-2.5 px-3">{fmt(s.SepetBüyüklügüTutar)}</td>
                      <td className="py-2.5 px-3">{fmt(s.BirimFiyatı)}</td>
                      <td className="py-2.5 px-3">
                        %{((s['Bürüt KAR %'] || 0) * 100).toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3">
                        {lfl == null ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          <span className={lfl >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                            {lfl >= 0 ? '+' : ''}{lfl.toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Toplam satırı — sadece birden fazla mağaza varsa göster */}
              {visibleStores.length > 1 && (
                <tfoot className="bg-[#5d0024]/5 border-t-2 border-[#5d0024]/20 font-semibold text-[#2a0010]">
                  <tr>
                    <td className="py-2.5 px-3">TOPLAM / ORT.</td>
                    <td className="py-2.5 px-3 text-[#5d0024]">{fmt(total.satis)}</td>
                    <td className="py-2.5 px-3">
                      <span className={hedefRenk(hedefPct)}>%{hedefPct.toFixed(1)}</span>
                      {hedefBar(hedefPct)}
                    </td>
                    <td className="py-2.5 px-3">{fmtN(total.fatura)}</td>
                    <td className="py-2.5 px-3">{fmtN(total.miktar)}</td>
                    <td className="py-2.5 px-3">{fmtN(total.ziyaretci)}</td>
                    <td className="py-2.5 px-3">%{ortDonusum.toFixed(1)}</td>
                    <td className="py-2.5 px-3">{fmt(ortSepet)}</td>
                    <td className="py-2.5 px-3">{fmt(birimFiyat)}</td>
                    <td className="py-2.5 px-3">%{brutKar.toFixed(1)}</td>
                    <td className="py-2.5 px-3">—</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}