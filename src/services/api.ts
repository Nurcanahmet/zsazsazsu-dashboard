// ============================================
// API SERVİS KATMANI (api.ts)
// ============================================
// Bu dosya nerede? → src/services/api.ts
// Ne işe yarıyor? → Tüm API çağrıları tek bu dosyada toplanır.
// Neden önemli? → Backend hazır olduğunda SADECE bu dosyadaki
//                 URL'leri değiştirirsin, sayfalara dokunmazsın.
//
// Akış:
//   Dashboard (React) → bu dosya → Backend (Node.js) → MSSQL (Stored Procedure)
//
// Uzantısı neden .ts? → İçinde HTML/arayüz yok, sadece veri çekme
//                        fonksiyonları var, bu yüzden .tsx değil .ts

// ============================================
// BACKEND URL — İleride değiştirilecek
// ============================================
// Şimdi: localhost'ta çalışan backend'e istek atacak
// Staj yerinde: sunucu IP'si ile değiştirilecek
const API_BASE_URL = "http://localhost:3001/api";

// ============================================
// GENEL BAKIŞ SAYFASI VERİLERİ
// ============================================

// Dashboard KPI verilerini çeker
// Backend'de bu fonksiyon şu stored procedure'ü çağıracak:
// EXEC sp_DashboardKPI @StartDate, @EndDate, @StoreId
export async function fetchDashboardKPIs(startDate: string, endDate: string) {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/kpis?startDate=${startDate}&endDate=${endDate}`,
  );
  if (!response.ok) throw new Error("Dashboard KPI verileri alınamadı");
  return response.json();
}

// Satış trendi verilerini çeker (çizgi grafik için)
// EXEC sp_SalesTrend @StartDate, @EndDate, @StoreId
export async function fetchSalesTrend(startDate: string, endDate: string) {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/sales-trend?startDate=${startDate}&endDate=${endDate}`,
  );
  if (!response.ok) throw new Error("Satış trendi verileri alınamadı");
  return response.json();
}

// Kategori dağılımı verilerini çeker (bar grafik için)
// EXEC sp_CategoryDistribution @StartDate, @EndDate, @StoreId
export async function fetchCategoryDistribution(
  startDate: string,
  endDate: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/categories?startDate=${startDate}&endDate=${endDate}`,
  );
  if (!response.ok) throw new Error("Kategori verileri alınamadı");
  return response.json();
}

// Saatlik müşteri trafiği verilerini çeker
// EXEC sp_HourlyTraffic @StartDate, @EndDate, @StoreId
export async function fetchHourlyTraffic(startDate: string, endDate: string) {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/hourly-traffic?startDate=${startDate}&endDate=${endDate}`,
  );
  if (!response.ok) throw new Error("Trafik verileri alınamadı");
  return response.json();
}

// Kritik stok verilerini çeker
// EXEC sp_CriticalStock @StoreId
export async function fetchCriticalStock() {
  const response = await fetch(`${API_BASE_URL}/dashboard/critical-stock`);
  if (!response.ok) throw new Error("Stok verileri alınamadı");
  return response.json();
}

// ============================================
// GÜNLÜK SATIŞ SAYFASI VERİLERİ
// ============================================

// Günlük satış KPI verilerini çeker (10 KPI kartı + YoY)
// EXEC sp_DailySales @StartDate, @EndDate, @StoreId
export async function fetchDailySales(startDate: string, endDate: string) {
  const response = await fetch(
    `${API_BASE_URL}/reports/daily?startDate=${startDate}&endDate=${endDate}`,
  );
  if (!response.ok) throw new Error("Günlük satış verileri alınamadı");
  return response.json();
}

// ============================================
// AYLIK SATIŞ SAYFASI VERİLERİ
// ============================================

// Aylık satış KPI verilerini çeker (10 KPI kartı + YoY)
// EXEC sp_MonthlySales @Year, @Month, @StoreId
export async function fetchMonthlySales(year: number, month: number) {
  const response = await fetch(
    `${API_BASE_URL}/reports/monthly?year=${year}&month=${month}`,
  );
  if (!response.ok) throw new Error("Aylık satış verileri alınamadı");
  return response.json();
}

// ============================================
// SATIŞ DANIŞMANLARI SAYFASI VERİLERİ
// ============================================

// Danışman performans verilerini çeker (tablo + grafikler)
// EXEC sp_ConsultantPerformance @StartDate, @EndDate, @StoreId
export async function fetchConsultants(startDate: string, endDate: string) {
  const response = await fetch(
    `${API_BASE_URL}/consultants?startDate=${startDate}&endDate=${endDate}`,
  );
  if (!response.ok) throw new Error("Danışman verileri alınamadı");
  return response.json();
}
