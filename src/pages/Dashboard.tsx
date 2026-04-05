// ============================================
// GENEL BAKIŞ SAYFASI (Dashboard.tsx)
// ============================================
// Bu dosya nerede? → src/pages/Dashboard.tsx
// Ne işe yarıyor? → Sidebar'dan "Genel Bakış" tıklayınca açılan ana sayfa.
// İçinde ne var?
//   - Tarih filtresi (dönem seçici + başlangıç/bitiş)
//   - 4 KPI kartı (Toplam Ciro, Ort. Sepet, Ziyaretçi, Kritik Stok)
//   - Satış Trendi çizgi grafiği
//   - Kategori Dağılımı bar grafiği
//   - Saatlik Müşteri Trafiği bar grafiği
//   - Stok Durumu listesi
// API bağlantısı: şimdilik boş veri, ileride stored procedure'den gelecek.

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import KPICard from "../components/KPICard";

function Dashboard() {
  // ---------- STATE (Sayfa durumları) ----------
  // Tarih filtresi için state'ler
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [period, setPeriod] = useState("custom");

  // ---------- VERİLER ----------
  // Şimdilik boş — ileride API'den gelecek
  // KPI değerleri
  const [toplamCiro] = useState(0);
  const [ortSepet] = useState(0);
  const [ziyaretci] = useState(0);
  const [kritikStok] = useState(4);

  // Satış trendi grafiği verisi
  const [salesTrend] = useState([
    { date: "06/04", amount: 0 },
    { date: "05/04", amount: 0 },
    { date: "04/04", amount: 0 },
    { date: "03/04", amount: 0 },
    { date: "02/04", amount: 0 },
    { date: "01/04", amount: 0 },
    { date: "31/03", amount: 0 },
  ]);

  // Kategori dağılımı verisi
  const [categories] = useState([
    { name: "Yatak Odası", value: 0 },
    { name: "Sofra & Mutfak", value: 0 },
    { name: "Banyo", value: 0 },
    { name: "Dekorasyon", value: 0 },
    { name: "Kozmetik", value: 0 },
  ]);

  // Saatlik trafik verisi
  const [hourlyTraffic] = useState([
    { hour: "09:00", count: 0 },
    { hour: "10:00", count: 0 },
    { hour: "11:00", count: 0 },
    { hour: "12:00", count: 0 },
    { hour: "13:00", count: 0 },
    { hour: "14:00", count: 0 },
    { hour: "15:00", count: 0 },
    { hour: "16:00", count: 0 },
    { hour: "17:00", count: 0 },
    { hour: "18:00", count: 0 },
    { hour: "19:00", count: 0 },
    { hour: "20:00", count: 0 },
    { hour: "21:00", count: 0 },
  ]);

  // Stok durumu listesi
  const [stockItems] = useState([
    { name: "Mermer Desenli Tepsi", stock: 1, status: "critical" as const },
    { name: "Kadife Yastık Kılıfı", stock: 2, status: "critical" as const },
    { name: "Seramik Kahve Fincanı", stock: 2, status: "critical" as const },
    { name: "Bambu Banyo Seti", stock: 5, status: "warning" as const },
    { name: "Çizgili Sofra Bezi", stock: 6, status: "warning" as const },
    { name: "Pamuklu Nevresim Seti", stock: 6, status: "warning" as const },
    { name: "Dekoratif Vazo", stock: 10, status: "normal" as const },
  ]);

  // Stok durumuna göre renk belirle
  const stockColor = (status: string) => {
    if (status === "critical") return "bg-[#e41e2d]/20 text-[#e41e2d]";
    if (status === "warning") return "bg-[#c4a11b]/20 text-[#c4a11b]";
    return "bg-[#004f59]/20 text-[#004f59]";
  };

  // Filtrele butonuna basılınca
  const handleFilter = () => {
    // TODO: API'den veri çekilecek
    console.log("Filtre:", startDate, endDate);
  };

  return (
    <div className="p-6">
      {/* ===== SAYFA BAŞLIĞI ===== */}
      <h1 className="text-2xl font-bold text-[#5d0024]">İstanbul Emaar AVM</h1>
      <p className="text-[#5d0024]/60 mb-4">Genel Bakış</p>

      {/* ===== TARİH FİLTRESİ ===== */}
      <div className="flex items-end gap-3 mb-6">
        {/* Dönem seçici */}
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

        {/* Özel tarih seçiliyse başlangıç/bitiş göster */}
        {period === "custom" && (
          <>
            <div>
              <label className="text-xs text-[#5d0024]/60 block mb-1">
                Başlangıç
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#5d0024] outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#5d0024]/60 block mb-1">
                Bitiş
              </label>
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
              Filtrele
            </button>
          </>
        )}
      </div>

      {/* ===== KPI KARTLARI (4 adet, yan yana) ===== */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Toplam Ciro"
          value={`₺${toplamCiro.toLocaleString("tr-TR")}`}
          subtitle={`${startDate} - ${endDate}`}
        />
        <KPICard
          title="Ort. Sepet Tutarı"
          value={`₺${ortSepet.toLocaleString("tr-TR")}`}
          subtitle={`${startDate} - ${endDate}`}
        />
        <KPICard
          title="Ziyaretçi Sayısı"
          value={ziyaretci.toLocaleString("tr-TR")}
          subtitle={`${startDate} - ${endDate}`}
        />
        <KPICard
          title="Kritik Stok"
          value={`${kritikStok} ürün`}
          badge="Dikkat"
          badgeColor="yellow"
        />
      </div>

      {/* ===== GRAFİKLER (Satış Trendi + Kategori Dağılımı) ===== */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Satış Trendi — 2/3 genişlik */}
        <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">
            Satış Trendi
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `₺${v / 1000}K`}
              />
              <Tooltip
               formatter={(v: any) => [`₺${Number(v).toLocaleString('tr-TR')}`, 'Satış']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#5d0024"
                strokeWidth={2}
                dot={{ fill: "#5d0024", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Kategori Dağılımı — 1/3 genişlik */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">
            Kategori Dağılımı
          </h3>
          {categories.every((c) => c.value === 0) ? (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              Veri yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categories} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={90}
                />
                <Tooltip
                formatter={(v: any) => [`₺${Number(v).toLocaleString('tr-TR')}`, 'Satış']}
                />
                <Bar dataKey="value" fill="#5d0024" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ===== ALT KISIM (Saatlik Trafik + Stok Durumu) ===== */}
      <div className="grid grid-cols-2 gap-4">
        {/* Saatlik Müşteri Trafiği */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">
            Saatlik Müşteri Trafiği (Seçili Dönem)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyTraffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#825dc7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stok Durumu */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">
            Stok Durumu
          </h3>
          <div className="space-y-2">
            {stockItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-[#2a0010]">{item.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockColor(item.status)}`}
                >
                  {item.stock} adet
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
