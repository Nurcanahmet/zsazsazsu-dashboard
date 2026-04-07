// ============================================
// SATIŞ DANIŞMANLARI SAYFASI (Consultants.tsx) — API BAĞLANTILI
// ============================================

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const API = 'http://localhost:3001/api';

function Consultants() {
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-31');
  const [loading, setLoading] = useState(false);
  const [consultants, setConsultants] = useState<any[]>([]);

  const fetchData = async (start: string, end: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/consultants?startDate=${start}&endDate=${end}`);
      const result = await res.json();
      setConsultants(result);
    } catch (err) {
      console.error('Danışman verisi alınamadı:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);

  const handleFilter = () => {
    fetchData(startDate, endDate);
  };

  const bestConsultant = consultants.length > 0 ? consultants[0] : null;

  const salesChartData = consultants.map(c => ({
    name: c.name.split(' ')[0],
    value: c.salesAmount,
  }));

  const invoiceChartData = consultants.map(c => ({
    name: c.name.split(' ')[0],
    value: c.invoiceCount,
  }));

  return (
    <div className="p-6">
      {/* ===== BAŞLIK + TARİH FİLTRESİ ===== */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5d0024] italic">Satış Danışmanları</h1>
          <p className="text-sm text-[#5d0024]/60">Danışman bazlı performans takibi</p>
        </div>
        <div className="flex items-end gap-3">
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
            className="bg-white text-[#5d0024] border border-gray-300 px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            {loading ? 'Yükleniyor...' : 'Filtrele'}
          </button>
        </div>
      </div>

      {/* ===== EN İYİ DANIŞMAN ===== */}
      {bestConsultant && (
        <div className="bg-[#5d0024] rounded-xl p-5 mb-6">
          <p className="text-[#e8b4c0] text-sm">Seçilen dönemin en iyi danışmanı</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl">🏆</span>
            <div>
              <h2 className="text-white text-xl font-bold">{bestConsultant.name}</h2>
              <p className="text-[#e8b4c0] text-sm">
                ₺{bestConsultant.salesAmount.toLocaleString('tr-TR')} — {bestConsultant.invoiceCount} fatura
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== DANIŞMAN TABLOSU ===== */}
      {consultants.length === 0 ? (
        <div className="bg-white rounded-xl p-10 border border-gray-200 text-center text-gray-400 mb-6">
          {loading ? 'Yükleniyor...' : 'Bu dönemde danışman verisi bulunamadı'}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Sıra</th>
                <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Danışman</th>
                <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Satış Tutarı</th>
                <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Fatura Sayısı</th>
                <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Ort. Sepet</th>
                <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Hedef</th>
                <th className="text-left text-xs text-[#5d0024]/60 font-medium px-4 py-3">Gerçekleşme</th>
              </tr>
            </thead>
            <tbody>
              {consultants.map((c: any) => (
                <tr key={c.rank} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      c.rank <= 3 ? 'bg-[#e8b4c0]/30 text-[#5d0024]' : 'text-[#2a0010]'
                    }`}>
                      {c.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#2a0010]">{c.name}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#2a0010]">₺{c.salesAmount.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 text-sm text-[#2a0010]">{c.invoiceCount}</td>
                  <td className="px-4 py-3 text-sm text-[#2a0010]">₺{c.avgBasket.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 text-sm text-[#e8b4c0]">₺{c.target.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-[#004f59] h-2 rounded-full" style={{ width: `${Math.min(c.achievement, 100)}%` }} />
                      </div>
                      <span className="text-xs font-medium text-[#2a0010]">%{c.achievement}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== GRAFİKLER ===== */}
      {consultants.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-[#5d0024] mb-4">Satış Tutarı Karşılaştırması</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₺${v / 1000}K`} />
                <Tooltip formatter={(v: any) => [`₺${Number(v).toLocaleString('tr-TR')}`, 'Satış']} />
                <Bar dataKey="value" fill="#5d0024" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-[#5d0024] mb-4">Fatura Sayısı Karşılaştırması</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={invoiceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => [`${v} adet`, 'Fatura']} />
                <Bar dataKey="value" fill="#c4a11b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Consultants;