// ============================================
// SATIŞ DANIŞMANLARI SAYFASI (Consultants.tsx)
// ============================================
// Bu dosya nerede? → src/pages/Consultants.tsx
// Ne işe yarıyor? → Sidebar'dan "Satış Danışmanları" tıklayınca açılan sayfa.
// İçinde ne var?
//   - Tarih filtresi (Günlük Satış ile aynı stil)
//   - En iyi danışman highlight kartı
//   - Danışman performans tablosu
//   - Satış Tutarı bar grafiği
//   - Fatura Sayısı bar grafiği
// API bağlantısı: ileride stored procedure'den gelecek.

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Consultants() {
  // ---------- STATE ----------
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState("2026-03-10");
  const [endDate, setEndDate] = useState("2026-03-18");

  // ---------- VERİLER ----------
  // Şimdilik örnek veri — ileride API'den gelecek
  const [consultants] = useState([
    {
      rank: 1,
      name: "Mehmet Demir",
      salesAmount: 106977,
      invoiceCount: 62,
      avgBasket: 1725,
      target: 91792,
      achievement: 117,
    },
    {
      rank: 2,
      name: "Gizem Polat",
      salesAmount: 98237,
      invoiceCount: 71,
      avgBasket: 1384,
      target: 91863,
      achievement: 107,
    },
    {
      rank: 3,
      name: "Fatma Çelik",
      salesAmount: 95376,
      invoiceCount: 55,
      avgBasket: 1734,
      target: 55817,
      achievement: 171,
    },
    {
      rank: 4,
      name: "Ayşe Kaya",
      salesAmount: 93482,
      invoiceCount: 75,
      avgBasket: 1246,
      target: 79141,
      achievement: 118,
    },
  ]);

  // En iyi danışman (ilk sıradaki)
  const bestConsultant = consultants[0];

  // Grafik verileri
  const salesChartData = consultants.map((c) => ({
    name: c.name.split(" ")[0],
    value: c.salesAmount,
  }));

  const invoiceChartData = consultants.map((c) => ({
    name: c.name.split(" ")[0],
    value: c.invoiceCount,
  }));

  // Filtrele
  const handleFilter = () => {
    // TODO: API'den veri çekilecek
    console.log("Danışman filtre:", startDate, endDate);
  };

  return (
    <div className="p-6">
      {/* ===== BAŞLIK + TARİH FİLTRESİ ===== */}
      {/* Günlük Satış ile aynı stil */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">
            Satış Danışmanları
          </h1>
          <p className="text-sm text-[#5d0024]/60">
            Danışman bazlı performans takibi
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label className="text-xs text-[#5d0024]/60 block mb-1">
              Başlangıç
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
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
              className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-white text-[#5d0024] border border-gray-300 px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Filtrele
          </button>
        </div>
      </div>

      {/* ===== EN İYİ DANIŞMAN KARTI ===== */}
      <div className="bg-[#5d0024] rounded-xl p-5 mb-6">
        <p className="text-[#e8b4c0] text-sm">
          Seçilen dönemin en iyi danışmanı
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-3xl">🏆</span>
          <div>
            <h2 className="text-white text-xl font-bold">
              {bestConsultant.name}
            </h2>
            <p className="text-[#e8b4c0] text-sm">
              ₺{bestConsultant.salesAmount.toLocaleString("tr-TR")} —{" "}
              {bestConsultant.invoiceCount} fatura
            </p>
          </div>
        </div>
      </div>

      {/* ===== DANIŞMAN TABLOSU ===== */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">
                Sıra
              </th>
              <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">
                Danışman
              </th>
              <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">
                Satış Tutarı
              </th>
              <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">
                Fatura Sayısı
              </th>
              <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">
                Ort. Sepet
              </th>
              <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">
                Hedef
              </th>
              <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">
                Gerçekleşme
              </th>
            </tr>
          </thead>
          <tbody>
            {consultants.map((c) => (
              <tr
                key={c.rank}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                {/* Sıra numarası — ilk 3 renkli */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      c.rank <= 3
                        ? "bg-[#e8b4c0]/30 text-[#5d0024]"
                        : "text-[#2a0010]"
                    }`}
                  >
                    {c.rank}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[#2a0010]">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-[#2a0010]">
                  ₺{c.salesAmount.toLocaleString("tr-TR")}
                </td>
                <td className="px-4 py-3 text-sm text-[#2a0010]">
                  {c.invoiceCount}
                </td>
                <td className="px-4 py-3 text-sm text-[#2a0010]">
                  ₺{c.avgBasket.toLocaleString("tr-TR")}
                </td>
                <td className="px-4 py-3 text-sm text-[#e8b4c0]">
                  ₺{c.target.toLocaleString("tr-TR")}
                </td>
                {/* Gerçekleşme — progress bar + yüzde */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#004f59] h-2 rounded-full"
                        style={{ width: `${Math.min(c.achievement, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#2a0010]">
                      %{c.achievement}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== GRAFİKLER (Satış Tutarı + Fatura Sayısı) ===== */}
      <div className="grid grid-cols-2 gap-4">
        {/* Satış Tutarı Karşılaştırması */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">
            Satış Tutarı Karşılaştırması
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `₺${v / 1000}K`}
              />
              <Tooltip
                formatter={(v: any) => [
                  `₺${Number(v).toLocaleString("tr-TR")}`,
                  "Satış",
                ]}
              />
              <Bar dataKey="value" fill="#5d0024" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fatura Sayısı Karşılaştırması */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-[#5d0024] mb-4">
            Fatura Sayısı Karşılaştırması
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={invoiceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: any) => [`${v} adet`, "Fatura"]} />
              <Bar dataKey="value" fill="#c4a11b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Consultants;
