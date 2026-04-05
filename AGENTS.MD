# AGENTS.md — Zsa Zsa Zsu Dashboard Projesi

Bu dosya projenin tüm kurallarını, teknoloji seçimlerini ve yapısını içerir.

---

## 📌 Proje Özeti

**Marka:** Zsa Zsa Zsu (zsazsazsu.com.tr)
**Sektör:** Perakende — ev tekstili, dekorasyon, kozmetik, mobilya, gifting
**Kapsam:** 19 fiziksel mağaza + 1 Café = 20 lokasyon
**Amaç:** Mağaza bazlı satış, stok ve performans takibi yapan web dashboard
**GitHub:** github.com/Nurcanahmet/zsazsazsu-dashboard

---

## 🛠 Teknolojiler ve Neden Seçildiler

| Teknoloji | Ne İşe Yarıyor | Neden Seçtik |
|---|---|---|
| **React** | Kullanıcı arayüzü (UI) oluşturur | Sayfayı parçalara (bileşenlere) böler, her parça kendi işini yapar. En popüler UI kütüphanesi. |
| **TypeScript** | JavaScript'e tip güvenliği ekler | Hataları kod yazarken yakalar, çalışırken değil. "Bu değişken sayı olacak" dersen yanlışlıkla yazı atayamazsın. |
| **Tailwind CSS** | Stil vermek için | Ayrı CSS dosyası yazmana gerek kalmaz. `className="bg-red-500 p-4"` yazarsın, kırmızı arka plan + boşluk verir. |
| **Recharts** | Grafik çizmek için | Satış trendi (çizgi grafik), kategori dağılımı (bar grafik), danışman karşılaştırması hep bununla çizilir. |
| **React Router** | Sayfalar arası geçiş | Sidebar'dan "Günlük Satış" tıklayınca sayfa değişir ama uygulama yeniden yüklenmez, hızlı geçiş sağlar. |
| **mssql** *(ileride)* | SQL Server'a bağlanmak için | Backend'den Nebim veritabanına bağlanıp stored procedure çağırmak için kullanılacak. |

---

## 🏗 Klasör Yapısı ve Açıklamaları

```
zsazsazsu-dashboard/
├── public/                  ← Tarayıcıya doğrudan sunulan dosyalar
│   └── index.html           ← React tüm uygulamayı bu HTML'in içine yerleştirir
│
├── src/                     ← TÜM KODLAR BURADA
│   ├── components/          ← Tekrar kullanılan UI parçaları
│   │   ├── Layout.tsx       ← Sidebar + içerik alanı iskeleti (her sayfada ortak)
│   │   ├── Sidebar.tsx      ← Sol menü (bordo, marka logosu, menü linkleri)
│   │   ├── KPICard.tsx      ← KPI kartı bileşeni (Toplam Ciro, Ort. Sepet vb.)
│   │   └── DateFilter.tsx   ← Tarih filtresi (Başlangıç-Bitiş + Filtrele butonu)
│   │
│   ├── pages/               ← Her menü öğesi = 1 sayfa dosyası
│   │   ├── Dashboard.tsx    ← Genel Bakış (KPI kartları + grafikler + stok)
│   │   ├── DailySales.tsx   ← Günlük Satış (10 KPI + hedef bar + YoY karşılaştırma)
│   │   ├── MonthlySales.tsx ← Aylık Satış (10 KPI + hedef bar + YoY karşılaştırma)
│   │   └── Consultants.tsx  ← Satış Danışmanları (tablo + grafikler)
│   │
│   ├── services/            ← API bağlantıları (veri nereden geliyorsa burada)
│   │   └── api.ts           ← Tüm API çağrıları tek dosyada
│   │                           Şimdi: stored procedure'lere hazır yapı
│   │                           Sonra: backend URL'leri buraya yazılacak
│   │
│   ├── types/               ← TypeScript tip tanımları
│   │   └── index.ts         ← Veri yapıları (Sale, Consultant, KPI vb.)
│   │                           "Satış verisi şu alanlardan oluşur" gibi tanımlar
│   │
│   ├── App.tsx              ← Ana bileşen + Router (hangi URL = hangi sayfa)
│   ├── index.tsx            ← Giriş noktası (React'i başlatır, dokunmuyoruz)
│   └── index.css            ← Tailwind CSS import edildiği yer
│
├── package.json             ← Projenin kimlik kartı (kütüphaneler, komutlar)
├── tsconfig.json            ← TypeScript ayarları
├── AGENTS.md                ← Bu dosya (proje kuralları)
└── .gitignore               ← GitHub'a yüklenmeyecek dosyalar (node_modules vb.)
```

### Klasör Mantığı

- **components/** → Bir kere yaz, her yerde kullan. KPICard hem Dashboard'da hem DailySales'de var.
- **pages/** → Her sayfa bağımsız. Birini düzenlersen diğerini bozmazsın.
- **services/** → API çağrıları tek yerde. Nebim'e bağlanırken sadece bu dosyayı değiştirirsin.
- **types/** → Verinin şekli burada. TypeScript hataları yakalar.

---

## 📄 Sayfalar ve İçerikleri

### 1. Genel Bakış (Dashboard.tsx)
- **Filtre:** Dönem seçici (Özel Tarih + Başlangıç/Bitiş)
- **KPI Kartları (4 adet):** Toplam Ciro, Ort. Sepet Tutarı, Ziyaretçi Sayısı, Kritik Stok
- **Grafikler:** Satış Trendi (çizgi), Kategori Dağılımı
- **Alt Kısım:** Saatlik Müşteri Trafiği (bar), Stok Durumu (renkli liste)

### 2. Günlük Satış (DailySales.tsx)
- **Filtre:** Başlangıç-Bitiş tarih + Filtrele butonu
- **KPI Kartları (10 adet — 2 satır):**
  - Satır 1: Günlük Hedef, Toplam Satış (VH), Mağazaya Giren Kişi, Ort. Dönüşüm, Toplam Miktar
  - Satır 2: H. Gerç. Oranı, Ort. Brüt Kar %, Birim Fiyat, Sepet Büyüklüğü Tutar, Sepet Büyüklüğü Adet
- **Hedef Gerçekleşme:** Progress bar
- **YoY Karşılaştırma:** Toplam Satış vs Geçen Seneki Satış + Yıllık Değişim

### 3. Aylık Satış (MonthlySales.tsx)
- **Filtre:** Yıl ve Ay seçici (dropdown)
- **KPI Kartları (10 adet — 2 satır):**
  - Satır 1: Aylık Hedef, Toplam Satış (VH), H. Gerç. Oranı, Ort. Brüt Kar %, Birim Fiyat
  - Satır 2: Sepet Büyüklüğü Tutar, Sepet Büyüklüğü Adet, Toplam Kişi, Ort. Dönüşüm, Toplam Miktar
- **Hedef Gerçekleşme:** Progress bar
- **YoY Karşılaştırma:** Bu Ay vs Geçen Yıl Aynı Ay + Yıllık Değişim

### 4. Satış Danışmanları (Consultants.tsx)
- **Filtre:** Başlangıç-Bitiş tarih + Filtrele butonu
- **En İyi Danışman:** Highlight kartı (isim + tutar + fatura sayısı)
- **Danışman Tablosu:** Sıra, Danışman, Satış Tutarı, Fatura Sayısı, Ort. Sepet, Hedef, Gerçekleşme (progress bar + %)
- **Grafikler:** Satış Tutarı Karşılaştırması (bar), Fatura Sayısı Karşılaştırması (bar)

---

## 🎨 Marka Renk Paleti

| Renk | Hex | Kullanım |
|---|---|---|
| Bordo | `#5d0024` | Sidebar, ana butonlar, başlıklar, bordo kartlar |
| Bej | `#d7d2cb` | Sayfa arka planı |
| Yeşil | `#004f59` | Pozitif değerler, hedef gerçekleşme barları |
| Pembe | `#e41e2d` | Vurgular, negatif değerler, uyarılar |
| Mor | `#825dc7` | Grafikler, ikincil veri rengi |
| Sarı | `#c4a11b` | Uyarı badge'leri, kritik stok |

Tüm bileşenlerde bu renkler kullanılır. Tailwind config'de tanımlanır.

---

## 🔌 API Yapısı (Stored Procedure'lere Hazır)

### Bağlantı Bilgileri
```
Server: NURCAN\SQLEXPRESS01
Authentication: SQL Server Authentication
Database: (staj yerinden alınacak)
```

### API Çağrı Yapısı (services/api.ts)
Tüm API çağrıları bu dosyada toplanır. Backend hazır olduğunda sadece URL'ler değiştirilir.

```typescript
// Örnek yapı
const API_BASE_URL = 'http://localhost:3001/api';

export const fetchDailySales = async (startDate: string, endDate: string) => {
  const response = await fetch(`${API_BASE_URL}/daily-sales?start=${startDate}&end=${endDate}`);
  return response.json();
};
```

### Backend → SQL Server Akışı
```
Dashboard (React) → Backend (Node.js + Express) → MSSQL (Stored Procedure) → Sonuç → JSON → Dashboard
```

---

## 🏬 Mağaza Listesi (20 Lokasyon)

| # | Lokasyon | Şehir | Tür |
|---|---|---|---|
| 1 | Adana Turgut Özal | Adana | Cadde |
| 2 | Ankara Gordion AVM | Ankara | AVM |
| 3 | Antalya Manavgat Novamall AVM | Antalya | AVM |
| 4 | İstanbul Marmara Forum AVM | İstanbul | AVM |
| 5 | İstanbul Bahçeşehir Cadde | İstanbul | Cadde |
| 6 | İstanbul Mall of İstanbul AVM | İstanbul | AVM |
| 7 | İstanbul Göktürk Cadde | İstanbul | Cadde |
| 8 | İstanbul Küçükyalı Cadde | İstanbul | Cadde |
| 9 | İstanbul Zekeriyaköy | İstanbul | Cadde |
| 10 | İstanbul Citys Nişantaşı AVM | İstanbul | AVM |
| 11 | İstanbul Çengelköy Cadde | İstanbul | Cadde |
| 12 | İstanbul Emaar AVM | İstanbul | AVM |
| 13 | İzmir İstinyePark AVM | İzmir | AVM |
| 14 | İzmir Çeşme Ilıca Cadde | İzmir | Cadde |
| 15 | İzmir Mavibahçe AVM | İzmir | AVM |
| 16 | Konya Entepe AVM | Konya | AVM |
| 17 | Muğla Bodrum Avenue AVM | Muğla | AVM |
| 18 | Muğla Bodrum Yalıkavak | Muğla | Cadde |
| 19 | Trabzon Yomra Cadde | Trabzon | Cadde |
| 20 | İstanbul Göktürk Café | İstanbul | Café |

---

## 📋 Sidebar Menü Yapısı

```
zsa·zsa·zsu
[Mağaza Adı]

📊 Genel Bakış

MAĞAZA
📅 Günlük Satış
📋 Aylık Satış
👥 Satış Danışmanları

[Kullanıcı] — Çıkış Yap
```

---

## ✅ Geliştirme Aşamaları ve Git Commit Planı

| Adım | İş | Git Commit Mesajı |
|---|---|---|
| 1 | Proje kurulumu | ✅ `Proje kurulumu: React + TypeScript + Tailwind + Recharts` |
| 2 | Tailwind config + temizlik | `Tailwind yapılandırması ve gereksiz dosyalar temizlendi` |
| 3 | Sidebar + Layout | `Sidebar ve Layout bileşeni eklendi` |
| 4 | Genel Bakış sayfası | `Genel Bakış sayfası eklendi` |
| 5 | Günlük Satış sayfası | `Günlük Satış sayfası eklendi` |
| 6 | Aylık Satış sayfası | `Aylık Satış sayfası eklendi` |
| 7 | Satış Danışmanları sayfası | `Satış Danışmanları sayfası eklendi` |
| 8 | API servisi | `API servis katmanı eklendi` |
| 9 | Backend bağlantısı | `Backend MSSQL bağlantısı eklendi` |

---

## 🚫 Yasaklar

- `any` tipi kullanmak (TypeScript'in amacını yok eder)
- Ayrı CSS dosyası yazmak (Tailwind kullan)
- API key veya şifre koda gömmek (.env dosyasına yaz)
- node_modules'u GitHub'a yüklemek (.gitignore halleder)
- Tek dosyaya tüm kodu yazmak (bileşenlere böl)

---

## 📝 Notlar

- **Versiyon:** 1.0.0
- **Son güncelleme:** 2026-04-05
- **Proje başlangıcı:** Faz 1 — Proje kurulumu tamamlandı
