// ============================================
// AYLIK SATIŞ SAYFASI (MonthlySales.tsx)
// ============================================
// Bu dosya nerede? → src/pages/MonthlySales.tsx
// Ne işe yarıyor? → Sidebar'dan "Aylık Satış" tıklayınca açılan sayfa.
// Günlük Satış ile aynı stil ve düzende.
// Fark: filtre kısmında tarih yerine yıl ve ay seçici var.
// API bağlantısı: ileride stored procedure'den gelecek.

import { useState } from "react";

function MonthlySales() {
  // ---------- STATE ----------
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  // Ay isimleri
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  // ---------- VERİLER ----------
  // Şimdilik boş — ileride API'den gelecek
  const [data] = useState({
    hedef: 80000,
    toplamSatis: 0,
    hedefGerclesme: 0,
    ortBrutKar: 70,
    birimFiyat: 0,
    sepetTutar: 0,
    sepetAdet: 1,
    toplamKisi: 0,
    ortDonusum: 0,
    toplamMiktar: 1,
    gecenYilSatis: 0,
    yillikDegisim: 0,
  });

  return (
    <div className="p-6">
      {/* ===== BAŞLIK + YIL/AY FİLTRESİ ===== */}
      {/* Günlük Satış ile aynı layout: sol başlık, sağ filtre */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">
            Aylık Satış
          </h1>
          <p className="text-sm text-[#5d0024]/60">
            Dönem: {selectedYear} {months[selectedMonth - 1]}
          </p>
        </div>
        <div className="flex items-end gap-3">
          {/* Yıl seçici */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
          {/* Ay seçici */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-[#5d0024] text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== MAĞAZA BÖLÜMÜ ===== */}
      {/* Günlük Satış ile birebir aynı stil */}
      <div className="bg-[#5d0024] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Mağaza</h2>
          <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
            %{data.hedefGerclesme}
          </span>
        </div>

        {/* KPI KARTLARI — Satır 1 (5 adet) */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Aylık Hedef</p>
            <p className="text-xl font-bold text-white mt-1">
              ₺{data.hedef.toLocaleString("tr-TR")}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">
              Toplam Satış (VH)
            </p>
            <p className="text-xl font-bold text-white mt-1">
              ₺{data.toplamSatis.toLocaleString("tr-TR")}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">H. Gerç. Oranı</p>
            <p className="text-xl font-bold text-white mt-1">
              %{data.hedefGerclesme}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Ort. Brüt Kar %</p>
            <p className="text-xl font-bold text-white mt-1">
              %{data.ortBrutKar}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Birim Fiyat</p>
            <p className="text-xl font-bold text-white mt-1">
              ₺{data.birimFiyat.toLocaleString("tr-TR")}
            </p>
          </div>
        </div>

        {/* KPI KARTLARI — Satır 2 (5 adet) */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">
              Sepet Büyüklüğü Tutar
            </p>
            <p className="text-xl font-bold text-white mt-1">
              ₺{data.sepetTutar.toLocaleString("tr-TR")}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">
              Sepet Büyüklüğü Adet
            </p>
            <p className="text-xl font-bold text-white mt-1">
              {data.sepetAdet}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Toplam Kişi</p>
            <p className="text-xl font-bold text-white mt-1">
              {data.toplamKisi}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Ort. Dönüşüm</p>
            <p className="text-xl font-bold text-white mt-1">
              %{data.ortDonusum}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-[#e8b4c0] uppercase">Toplam Miktar</p>
            <p className="text-xl font-bold text-white mt-1">
              {data.toplamMiktar}
            </p>
          </div>
        </div>
      </div>

      {/* ===== HEDEF GERÇEKLEŞME BAR ===== */}
      {/* Günlük Satış ile birebir aynı stil */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#2a0010]">
            Hedef Gerçekleşme
          </h3>
          <span className="text-sm text-[#5d0024] font-medium">
            %{data.hedefGerclesme}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#e8b4c0] h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(data.hedefGerclesme, 100)}%` }}
          />
        </div>
      </div>

      {/* ===== YoY KARŞILAŞTIRMA ===== */}
      {/* Günlük Satış ile birebir aynı stil */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#2a0010]">
              Toplam Satış vs Geçen Seneki Satış
            </h3>
            <p className="text-xs text-gray-400">
              Seçilen ayın geçen yıl aynı ayı ile karşılaştırması
            </p>
          </div>
          <span className="bg-gray-100 text-[#5d0024] text-xs px-3 py-1 rounded-full font-medium">
            YoY Artış
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
            <p className="text-xs text-[#e8b4c0]">Bu Ay Satış</p>
            <p className="text-2xl font-bold text-[#2a0010] mt-1">
              ₺{data.toplamSatis.toLocaleString("tr-TR")}
            </p>
          </div>
          <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
            <p className="text-xs text-[#e8b4c0]">Geçen Yıl Aynı Ay</p>
            <p className="text-2xl font-bold text-[#2a0010] mt-1">
              ₺{data.gecenYilSatis?.toLocaleString("tr-TR")}
            </p>
          </div>
          <div className="bg-[#004f59]/10 rounded-lg p-4 text-center">
            <p className="text-xs text-[#004f59]">Yıllık Değişim</p>
            <p className="text-3xl font-bold text-[#004f59] mt-1">
              +{data.yillikDegisim}%
            </p>
            <p className="text-xs text-[#004f59]/60 mt-1">
              Geçen yılın aynı dönemine göre toplam satışta artış.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlySales;
