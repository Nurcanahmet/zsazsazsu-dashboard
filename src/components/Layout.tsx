// ============================================
// LAYOUT BİLEŞENİ
// ============================================
// Tüm sayfaların ortak iskeleti.
// Sol tarafta Sidebar, sağ tarafta sayfa içeriği gösterilir.
// Outlet = React Router'ın "aktif sayfayı buraya koy" dediği yer.
// Mesela /gunluk-satis adresine gidersen, Outlet yerine DailySales sayfası gelir.

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    // flex: Sidebar ve içerik yan yana durur
    // min-h-screen: sayfa en az ekran yüksekliğinde olur
    <div className="flex min-h-screen">
      {/* Sol taraf — Sidebar (bordo menü) */}
      <Sidebar storeName="İstanbul Emaar AVM" />

      {/* Sağ taraf — Sayfa içeriği */}
      {/* flex-1: kalan tüm alanı kaplar */}
      {/* bg-[#d7d2cb]: bej arka plan */}
      {/* overflow-y-auto: içerik uzunsa scroll çıkar */}
      <main className="flex-1 bg-[#d7d2cb] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
