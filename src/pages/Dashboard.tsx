// ============================================
// GENEL BAKIŞ SAYFASI (Dashboard.tsx) — API BAĞLANTILI
// ============================================
// Artık sabit veri yok — veriler backend'den (localhost:3001) geliyor.
// Backend SOLIDV3 veritabanına bağlanıp gerçek Nebim verilerini döner.

import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import KPICard from '../components/KPICard';

// API adresi — backend'in çalıştığı adres
const API = 'http://localhost:3001/api';

function Dashboard() {
  // ---------- STATE ----------
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [period, setPeriod] = useState('custom');
  const [loading, setLoading] = useState(false);

  // KPI verileri — başlangıçta boş, API'den dolacak
  const [kpis, setKpis] = useState({ toplamCiro: 0, ortSepet: 0, ziyaretci: 0, kritikStok: 0 });
  const [salesTrend, setSalesTrend] = useState([]);
  const [hourlyTraffic, setHourlyTraffic] = useState([]);
  const [stockItems, setStockItems] = useState([]);

  // ---------- VERİ ÇEKME FONKSİYONLARI ----------
  // useEffect: sayfa açıldığında otomatik veri çeker
  // fetchData: Filtrele butonuna basılınca da çalışır

  const fetchData = async (start: string, end: string) => {
    setLoading(true);
    try {
      // Tüm API çağrılarını aynı anda at (Promise.all = hepsi paralel çalışır)
      const [kpiRes, trendRes, trafficRes, stockRes] = await Promise.all([
        fetch(`${API}/dashboard/kpis?startDate=${start}&endDate=${end}`),
        fetch(`${API}/dashboard/sales-trend?startDate=${start}&endDate=${end}`),
        fetch(`${API}/dashboard/hourly-traffic?startDate=${start}&endDate=${end}`),
        fetch(`${API}/dashboard/critical-stock`),
      ]);

      // JSON'a çevir
      const kpiData = await kpiRes.json();
      const trendData = await trendRes.json();
      const trafficData = await trafficRes.json();
      const stockData = await stockRes.json();

      // State'leri güncelle — ekran otomatik yenilenir
      setKpis(kpiData);
      setSalesTrend(trendData);
      setHourlyTraffic(trafficData);
      setStockItems(stockData);
    } catch (err) {
      console.error('Veri çekme hatası:', err);
    }
    setLoading(false);
  };

  // Sayfa ilk açıldığında veri çek
  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);

  // Filtrele butonuna basılınca
  const handleFilter = () => {
    fetchData(startDate, endDate);
  };

  // Stok durumuna göre renk
  const stockColor = (status: string) => {
    if (status === 'critical') return 'bg-[#e41e2d]/20 text-[#e41e2d]';
    if (status === 'warning') return 'bg-[#c4a11b]/20 text-[#c4a11b]';
    return 'bg-[#004f59]/20 text-[#004f59]';
  };

  return (
    <div className="p-6">
      {/* ===== SAYFA BAŞLIĞI ===== */}
      <h1 className="text-2xl font-bold text-[#5d0024]">İstanbul Emaar AVM</h1>
      <p className="text-[#5d0024]/60 mb-4">Genel Bakış</p>

      {/* ===== TARİH FİLTRESİ ===== */}
      <div className="flex items-end gap-3 mb-6">
        <div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#5d0024] outline-none"
          >
            <option value="today">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="custom">Özel Tarih</option>
          </select>
        </div>

        {period === 'custom' && (
          <>
            <div>
              <label className="text-xs text-[#5d0024]/60 block mb-1">Başlangıç</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#5d0024] outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#5d0024]/60 block mb-1">Bitiş</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#5d0024] outline-none"
              />
            </div>
            <button
              onClick={handleFilter}
              className="bg-[#5d0024] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#7a0030] transition-colors"
            >
              {loading ? 'Yükleniyor...' : 'Filtrele'}
            </button>
          </>
        )}
      </div>

      {/* ===== KPI KARTLARI ===== */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Toplam Ciro"
          value={`₺${kpis.toplamCiro.toLocaleString('tr-TR')}`}
          subtitle={`${startDate} - ${endDate}`}
        />
        <KPICard
          title="Ort. Sepet Tutarı"
          value={`₺${kpis.ortSepet.toLocaleString('tr-TR')}`}
          subtitle={`${startDate} - ${endDate}`}
        />
        <KPICard
          title="Ziyaretçi Sayısı"
          value={kpis.ziyaretci.toLocaleString('tr-TR')}
          subtitle={`${startDate} - ${endDate}`}
        />
        <KPICard
          title="Kritik Stok"
          value={`${kpis.kritikStok} ürün`}
          badge="Dikkat"
          badgeColor="yellow"
        />
      </div>

      {/* ===== GRAFİKLER ===== */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Satış Trendi */}
        <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">Satış Trendi</h3>
          {salesTrend.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-gray-400">Veri yok</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₺${v / 1000}K`} />
                <Tooltip formatter={(v: any) => [`₺${Number(v).toLocaleString('tr-TR')}`, 'Satış']} />
                <Line type="monotone" dataKey="amount" stroke="#5d0024" strokeWidth={2} dot={{ fill: '#5d0024', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Kategori Dağılımı — ileride eklenecek */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">Kategori Dağılımı</h3>
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            Veri yok
          </div>
        </div>
      </div>

      {/* ===== ALT KISIM ===== */}
      <div className="grid grid-cols-2 gap-4">
        {/* Saatlik Müşteri Trafiği */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">Saatlik Müşteri Trafiği (Seçili Dönem)</h3>
          {hourlyTraffic.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-gray-400">Veri yok</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#825dc7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stok Durumu */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">Stok Durumu</h3>
          {stockItems.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-gray-400">Veri yok</div>
          ) : (
            <div className="space-y-2">
              {stockItems.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-[#2a0010]">{item.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockColor(item.status)}`}>
                    {item.stock} adet
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;