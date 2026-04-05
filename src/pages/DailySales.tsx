// ============================================
// GÜNLÜK SATIŞ SAYFASI (DailySales.tsx)
// ============================================
// Bu dosya nerede? → src/pages/DailySales.tsx
// Ne işe yarıyor? → Sidebar'dan "Günlük Satış" tıklayınca açılan sayfa.
// İçinde ne var?
//   - Tarih filtresi (Başlangıç + Bitiş + Filtrele butonu)
//   - "Mağaza" başlığı + sağ üstte yüzde badge
//   - 10 KPI kartı (2 satır, 5'erli)
//   - Hedef Gerçekleşme progress bar
//   - Toplam Satış vs Geçen Seneki Satış (YoY karşılaştırma)
// API bağlantısı: ileride stored procedure'den gelecek.

import { useState } from "react";

function DailySales() {
  // ---------- STATE ----------
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // ---------- VERİLER ----------
  // Şimdilik boş — ileride API'den gelecek
  const [data] = useState({
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

  // Filtrele
  const handleFilter = () => {
    // TODO: API'den veri çekilecek
    console.log("Günlük filtre:", startDate, endDate);
  };

  return (
    <div className="p-6">
      {/* ===== BAŞLIK + TARİH FİLTRESİ ===== */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">
            Günlük Satış
          </h1>
          <p className="text-sm text-[#5d0024]/60">
            Satış performansı ve kanal analizi
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

      {/* ===== MAĞAZA BÖLÜMÜ ===== */}
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
            <p className="text-xs text-[#e8b4c0] uppercase">Günlük Hedef</p>
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
            <p className="text-xs text-[#e8b4c0] uppercase">
              Mağazaya Giren Kişi
            </p>
            <p className="text-xl font-bold text-white mt-1">
              {data.magazaGirenKisi}
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

        {/* KPI KARTLARI — Satır 2 (5 adet) */}
        <div className="grid grid-cols-5 gap-3">
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
        </div>
      </div>

      {/* ===== HEDEF GERÇEKLEŞME BAR ===== */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#2a0010]">
            Hedef Gerçekleşme
          </h3>
          <span className="text-sm text-[#5d0024] font-medium">
            %{data.hedefGerclesme}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#e8b4c0] h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(data.hedefGerclesme, 100)}%` }}
          />
        </div>
      </div>

      {/* ===== YoY KARŞILAŞTIRMA ===== */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#2a0010]">
              Toplam Satış vs Geçen Seneki Satış
            </h3>
            <p className="text-xs text-gray-400">
              Seçilen dönemin geçen yıl aynı dönemle karşılaştırması
            </p>
          </div>
          <span className="bg-gray-100 text-[#5d0024] text-xs px-3 py-1 rounded-full font-medium">
            YoY Artış
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Toplam Satış */}
          <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
            <p className="text-xs text-[#e8b4c0]">Toplam Satış</p>
            <p className="text-2xl font-bold text-[#2a0010] mt-1">
              ₺{data.toplamSatis.toLocaleString("tr-TR")}
            </p>
          </div>
          {/* Geçen Yıl Satış */}
          <div className="bg-[#e8b4c0]/10 rounded-lg p-4">
            <p className="text-xs text-[#e8b4c0]">Geçen Yıl Satış</p>
            <p className="text-2xl font-bold text-[#2a0010] mt-1">
              ₺{data.gecenYilSatis?.toLocaleString("tr-TR")}
            </p>
          </div>
          {/* Yıllık Değişim */}
          <div className="bg-[#004f59]/10 rounded-lg p-4 text-center">
            <p className="text-xs text-[#004f59]">Yıllık Değişim (Toplam)</p>
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

export default DailySales;
