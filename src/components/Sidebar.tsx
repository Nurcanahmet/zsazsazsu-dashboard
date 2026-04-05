// ============================================
// SIDEBAR BİLEŞENİ
// ============================================
// Sol taraftaki bordo menü. Her sayfada görünür.
// İçinde marka logosu, mağaza adı ve menü linkleri var.
// React Router'ın NavLink'i ile hangi sayfadaysan o link aktif görünür.

import { NavLink } from "react-router-dom";

// Sidebar bileşeni storeName prop'u alır — giriş yapan kullanıcının mağaza adı
interface SidebarProps {
  storeName: string;
}

function Sidebar({ storeName }: SidebarProps) {
  // Menü öğeleri — her biri bir sayfa
  // path: URL adresi, label: menüde görünen isim
  const menuItems = [{ path: "/", label: "Genel Bakış", icon: "📊" }];

  const storeMenuItems = [
    { path: "/gunluk-satis", label: "Günlük Satış", icon: "📅" },
    { path: "/aylik-satis", label: "Aylık Satış", icon: "📋" },
    { path: "/danismanlar", label: "Satış Danışmanları", icon: "👥" },
  ];

  return (
    // Sidebar: sabit genişlik, tam ekran yükseklik, bordo arka plan
    <aside className="w-56 min-h-screen bg-[#5d0024] text-white flex flex-col">
      {/* Marka logosu ve mağaza adı */}
      <div className="p-4 border-b border-white/20">
        <h1 className="text-lg font-bold tracking-wider">zsa·zsa·zsu</h1>
        <p className="text-sm text-[#e8b4c0] mt-1">{storeName}</p>
      </div>

      {/* Menü linkleri */}
      <nav className="flex-1 p-3">
        {/* Genel Bakış */}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                isActive
                  ? "bg-white/20 text-white font-medium"
                  : "text-[#e8b4c0] hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* MAĞAZA bölümü */}
        <p className="text-xs text-[#e8b4c0]/60 uppercase tracking-wider mt-4 mb-2 px-3">
          Mağaza
        </p>
        {storeMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                isActive
                  ? "bg-white/20 text-white font-medium"
                  : "text-[#e8b4c0] hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Alt kısım — Çıkış */}
      <div className="p-4 border-t border-white/20">
        <button className="flex items-center gap-2 text-sm text-[#e8b4c0] hover:text-white transition-colors">
          <span>🚪</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
