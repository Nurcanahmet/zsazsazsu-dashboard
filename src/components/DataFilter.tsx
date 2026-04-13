// ============================================
// TARİH FİLTRESİ BİLEŞENİ
// ============================================
// Başlangıç ve bitiş tarihi seçip "Filtrele" butonuna basılan bileşen.
// Günlük Satış ve Satış Danışmanları sayfalarında kullanılır.
// onFilter: kullanıcı "Filtrele"ye basınca çağrılır, seçilen tarihleri döner.
import { useState } from "react";

interface DateFilterProps {
  onFilter: (startDate: string, endDate: string) => void;
}

function DateFilter({ onFilter }: DateFilterProps) {
  // Bugünün tarihini al (YYYY-MM-DD formatında)
  const today = new Date().toISOString().split("T")[0];

  // State: kullanıcının seçtiği tarihler
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Filtrele butonuna basılınca
  const handleFilter = () => {
    onFilter(startDate, endDate);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Başlangıç tarihi */}
      <div>
        <label className="text-xs text-[#d7d2cb] block mb-1">Başlangıç</label>
        <input
          type="date"
          max="2099-12-31"
          value={startDate}
          onChange={(e) => {
            const val = e.target.value;
            const year = val.split('-')[0];
            if (year.length <= 4) setStartDate(val);
          }}
          className="bg-white/15 text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
        />
      </div>

      {/* Bitiş tarihi */}
      <div>
        <label className="text-xs text-[#d7d2cb] block mb-1">Bitiş</label>
        <input
          type="date"
          max="2099-12-31"
          value={endDate}
          onChange={(e) => {
            const val = e.target.value;
            const year = val.split('-')[0];
            if (year.length <= 4) setEndDate(val);
          }}
          className="bg-white/15 text-[#d7d2cb] border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none"
        />
      </div>

      {/* Filtrele butonu */}
      <button
        onClick={handleFilter}
        className="bg-white text-[#5d0024] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors mt-4"
      >
        Filtrele
      </button>
    </div>
  );
}

export default DateFilter;
