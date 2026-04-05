// ============================================
// AYLIK SATIŞ SAYFASI (MonthlySales.tsx) — GÜNCEL
// ============================================

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function MonthlySales() {
  // ---------- STATE ----------
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // ---------- VERİLER ----------
  const [data] = useState({
    hedef: 80000,
    toplamSatis: 0,
    hedefGerclesme: 0,
    ortBrutKar: 69.7,
    birimFiyat: 0,
    sepetTutar: 0,
    sepetAdet: 1,
    toplamKisi: 0,
    ortDonusum: 0,
    toplamMiktar: 1,
    gecenYilSatis: 0,
    yillikDegisim: 0,
  });

  // Kategori Bazında Satış
  const [categories] = useState([
    { name: 'Yaşam Alanı', amount: 144995, percent: 46.7 },
    { name: 'Yatak Odası', amount: 58632, percent: 18.9 },
    { name: 'Banyo', amount: 54907, percent: 17.7 },
    { name: 'Sofra & Mutfak', amount: 41960, percent: 13.5 },
    { name: 'Giyim', amount: 9403, percent: 3 },
    { name: 'Ev Kozmetiği', amount: 694, percent: 0.2 },
  ]);

  // Top 10 Alt Grup Bazında Satış
  const [topAltGrup] = useState([
    { rank: 1, name: 'Yaşam Alanı', amount: 144995, percent: 46.7 },
    { rank: 2, name: 'Yatak Odası', amount: 58632, percent: 18.9 },
    { rank: 3, name: 'Banyo', amount: 54907, percent: 17.7 },
    { rank: 4, name: 'Sofra & Mutfak', amount: 41960, percent: 13.5 },
    { rank: 5, name: 'Giyim', amount: 9403, percent: 3 },
    { rank: 6, name: 'Ev Kozmetiği', amount: 694, percent: 0.2 },
    { rank: 7, name: 'Mobilya', amount: 32500, percent: 10.5 },
    { rank: 8, name: 'Dekorasyon', amount: 28900, percent: 9.3 },
    { rank: 9, name: 'Aydınlatma', amount: 15600, percent: 5 },
    { rank: 10, name: 'Tekstil', amount: 12300, percent: 4 },
  ]);

  // Aylık Satış Karşılaştırması (12 ay — 2025 vs 2026)
  const [aylikKarsilastirma] = useState([
    { month: 'Ocak', y2025: 12000, y2026: 55000 },
    { month: 'Şubat', y2025: 10000, y2026: 52000 },
    { month: 'Mart', y2025: 8000, y2026: 48000 },
    { month: 'Nisan', y2025: 5000, y2026: 15000 },
    { month: 'Mayıs', y2025: 0, y2026: 25000 },
    { month: 'Haziran', y2025: 0, y2026: 30000 },
    { month: 'Temmuz', y2025: 0, y2026: 35000 },
    { month: 'Ağustos', y2025: 0, y2026: 40000 },
    { month: 'Eylül', y2025: 0, y2026: 38000 },
    { month: 'Ekim', y2025: 0, y2026: 42000 },
    { month: 'Kasım', y2025: 0, y2026: 45000 },
    { month: 'Aralık', y2025: 0, y2026: 50000 },
  ]);

  const maxCategoryAmount = Math.max(...categories.map(c => c.amount), 1);
  const maxAltGrupAmount = Math.max(...topAltGrup.map(c => c.amount), 1);

  return (
    <div className="p-6">
      {/* ===== BAŞLIK + YIL/AY FİLTRESİ ===== */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">Aylık Satış</h1>
          <p className="text-sm text-[#5d0024]/60">Dönem: {selectedYear} {months[selectedMonth - 1]}</p>
        </div>
        <div className="flex items-end gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
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

      {/* ===== MAĞAZA BÖLÜMÜ ===== */}
      <div className="bg-[#5d0024] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Mağaza</h2>
          <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
            %{data.hedefGerclesme}
          </span>
        </div>

        {/* KPI Satır 1 */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Aylık Hedef</p>
            <p className="text-xl font-bold text-white mt-1">₺{data.hedef.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Toplam Satış (VH)</p>
            <p className="text-xl font-bold text-white mt-1">₺{data.toplamSatis.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">H. Gerç. Oranı</p>
            <p className="text-xl font-bold text-white mt-1">%{data.hedefGerclesme}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Ort. Brüt Kar %</p>
            <p className="text-xl font-bold text-white mt-1">%{data.ortBrutKar}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Birim Fiyat</p>
            <p className="text-xl font-bold text-white mt-1">₺{data.birimFiyat.toLocaleString('tr-TR')}</p>
          </div>
        </div>

        {/* KPI Satır 2 */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Sepet Büyüklüğü Tutar</p>
            <p className="text-xl font-bold text-white mt-1">₺{data.sepetTutar.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Sepet Büyüklüğü Adet</p>
            <p className="text-xl font-bold text-white mt-1">{data.sepetAdet}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Toplam Kişi</p>
            <p className="text-xl font-bold text-white mt-1">{data.toplamKisi}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Ort. Dönüşüm</p>
            <p className="text-xl font-bold text-white mt-1">%{data.ortDonusum}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Toplam Miktar</p>
            <p className="text-xl font-bold text-white mt-1">{data.toplamMiktar}</p>
          </div>
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
            <p className="text-xs text-gray-400">Seçilen ayın geçen yıl aynı ayı ile karşılaştırması</p>
          </div>
          <span className="bg-gray-100 text-[#5d0024] text-xs px-3 py-1 rounded-full font-medium">
            YoY Artış
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
            <p className="text-xs text-[#e8b4c0]">Bu Ay Satış</p>
            <p className="text-2xl font-bold text-[#2a0010] mt-1">₺{data.toplamSatis.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
            <p className="text-xs text-[#e8b4c0]">Geçen Yıl Aynı Ay</p>
            <p className="text-2xl font-bold text-[#2a0010] mt-1">₺{data.gecenYilSatis?.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-[#004f59]/10 rounded-lg p-4 text-center">
            <p className="text-xs text-[#004f59]">Yıllık Değişim</p>
            <p className="text-3xl font-bold text-[#004f59] mt-1">+{data.yillikDegisim}%</p>
            <p className="text-xs text-[#004f59]/60 mt-1">Geçen yılın aynı dönemine göre toplam satışta artış.</p>
          </div>
        </div>
      </div>

      {/* ===== KATEGORİ BAZINDA SATIŞ + TOP 10 ALT GRUP ===== */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Kategori Bazında Satış */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Kategori Bazında Satış</h3>
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#2a0010]">{cat.name}</span>
                  <span className="text-sm font-medium text-[#5d0024]">
                    ₺{cat.amount.toLocaleString('tr-TR')} (%{cat.percent})
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#5d0024] h-2 rounded-full"
                    style={{ width: `${(cat.amount / maxCategoryAmount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Alt Grup Bazında Satış */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Top 10 Alt Grup Bazında Satış</h3>
          <div className="space-y-3">
            {topAltGrup.map((item) => (
              <div key={item.rank}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#5d0024] text-white text-xs font-bold">
                      {item.rank}
                    </span>
                    <span className="text-sm text-[#2a0010]">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-[#5d0024]">
                    ₺{item.amount.toLocaleString('tr-TR')} (%{item.percent})
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 ml-8">
                  <div
                    className="bg-[#5d0024] h-2 rounded-full"
                    style={{ width: `${(item.amount / maxAltGrupAmount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== AYLIK SATIŞ KARŞILAŞTIRMASI (2025 vs 2026) ===== */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="text-sm font-bold text-[#2a0010] uppercase mb-4">📊 Aylık Satış Karşılaştırması</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aylikKarsilastirma}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
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

export default MonthlySales;