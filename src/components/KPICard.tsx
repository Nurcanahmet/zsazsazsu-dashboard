// ============================================
// KPI KART BİLEŞENİ
// ============================================
// Dashboard'daki küçük bilgi kartları.
// Örnek: "Toplam Ciro - ₺45.000 - Bu hafta"
// Bu bileşen birçok sayfada tekrar kullanılır:
// Genel Bakış, Günlük Satış, Aylık Satış hepsinde var.
// Props ile farklı veriler gösterilir.

interface KPICardProps {
  title: string; // Kartın başlığı (örn: "Toplam Ciro")
  value: string; // Gösterilen değer (örn: "₺45.000")
  subtitle?: string; // Alt yazı, opsiyonel (örn: "2026-04-05")
  badge?: string; // Rozet yazısı, opsiyonel (örn: "Dikkat")
  badgeColor?: string; // Rozet rengi (örn: "yellow", "red", "green")
}

function KPICard({
  title,
  value,
  subtitle,
  badge,
  badgeColor = "yellow",
}: KPICardProps) {
  // Rozet renk sınıflarını belirle
  const badgeClasses: Record<string, string> = {
    yellow: "bg-[#c4a11b]/20 text-[#c4a11b]",
    red: "bg-[#e41e2d]/20 text-[#e41e2d]",
    green: "bg-[#004f59]/20 text-[#004f59]",
  };

  return (
    // Kart: beyaz arka plan, yuvarlatılmış köşeler, hafif gölge
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      {/* Başlık */}
      <p className="text-sm text-[#5d0024]/70">{title}</p>

      {/* Değer — büyük ve kalın */}
      <p className="text-2xl font-bold text-[#2a0010] mt-1">{value}</p>

      {/* Alt kısım: ya subtitle ya badge gösterilir */}
      <div className="mt-2 flex items-center gap-2">
        {subtitle && <p className="text-xs text-[#e8b4c0]">{subtitle}</p>}
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClasses[badgeColor] || badgeClasses.yellow}`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export default KPICard;
