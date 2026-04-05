// ============================================
// TİP TANIMLARI
// ============================================
// Bu dosya projedeki tüm veri yapılarını tanımlar.
// TypeScript bu tipleri kullanarak hataları kod yazarken yakalar.
// Mesela "amount" sayı olmalı dersen, yanlışlıkla yazı atayamazsın.

// --- KPI Kartı ---
// Dashboard'daki küçük bilgi kartlarının veri yapısı
// Örnek: "Toplam Ciro - ₺45.000 - Bu hafta"
export interface KPIData {
  title: string; // Kartın başlığı (örn: "Toplam Ciro")
  value: string; // Gösterilen değer (örn: "₺45.000")
  subtitle?: string; // Alt yazı, opsiyonel (örn: "Bu hafta")
  badge?: string; // Uyarı rozeti, opsiyonel (örn: "Dikkat")
  badgeColor?: string; // Rozet rengi (örn: "yellow")
}

// --- Satış Verisi ---
// Günlük veya aylık satış sayfalarındaki KPI verileri
export interface SalesData {
  hedef: number; // Hedef tutar (örn: 80000)
  toplamSatis: number; // Toplam satış tutarı
  magazaGirenKisi: number; // Mağazaya giren müşteri sayısı
  ortDonusum: number; // Dönüşüm oranı (%)
  toplamMiktar: number; // Satılan toplam ürün adedi
  hedefGerclesme: number; // Hedef gerçekleşme oranı (%)
  ortBrutKar: number; // Ortalama brüt kar (%)
  birimFiyat: number; // Ortalama birim fiyat
  sepetTutar: number; // Ortalama sepet tutarı
  sepetAdet: number; // Ortalama sepet adedi
  // YoY (Year over Year) karşılaştırma
  gecenYilSatis?: number; // Geçen yıl aynı dönem satışı
  yillikDegisim?: number; // Yıllık değişim (%)
}

// --- Satış Trendi ---
// Çizgi grafikteki her bir nokta
export interface SalesTrend {
  date: string; // Tarih (örn: "06/04")
  amount: number; // Satış tutarı
}

// --- Kategori Dağılımı ---
// Bar veya pasta grafikteki her bir dilim
export interface CategoryData {
  name: string; // Kategori adı (örn: "Yatak Odası")
  value: number; // Satış tutarı veya adedi
}

// --- Saatlik Trafik ---
// Saatlik müşteri trafiği grafiği
export interface HourlyTraffic {
  hour: string; // Saat (örn: "09:00")
  count: number; // Ziyaretçi sayısı
}

// --- Stok Durumu ---
// Stok listesindeki her bir ürün
export interface StockItem {
  name: string; // Ürün adı (örn: "Mermer Desenli Tepsi")
  stock: number; // Mevcut stok adedi
  status: "critical" | "warning" | "normal"; // Stok durumu
}

// --- Satış Danışmanı ---
// Danışman tablosundaki her bir satır
export interface Consultant {
  rank: number; // Sıralama (1, 2, 3...)
  name: string; // Danışman adı
  salesAmount: number; // Toplam satış tutarı
  invoiceCount: number; // Fatura sayısı
  avgBasket: number; // Ortalama sepet tutarı
  target: number; // Hedef tutar
  achievement: number; // Gerçekleşme oranı (%)
}
