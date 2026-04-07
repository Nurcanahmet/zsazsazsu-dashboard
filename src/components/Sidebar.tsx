// ============================================
// SIDEBAR BİLEŞENİ
// ============================================
// Sol taraftaki bordo menü. Her sayfada görünür.
// Kullanıcı bilgisini localStorage'dan otomatik okur.

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  // ---------- KULLANICI BİLGİSİ ----------
  // localStorage'dan giriş yapan kullanıcıyı oku
  // user şöyle bir obje: { email, name, role, storeCodes }
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const displayName = user?.name || 'Misafir';

  // ---------- ÇIKIŞ FONKSİYONU ----------
  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const menuItems = [{ path: "/", label: "Genel Bakış", icon: "📊" }];

  const storeMenuItems = [
    { path: "/gunluk-satis", label: "Günlük Satış", icon: "📅" },
    { path: "/aylik-satis", label: "Aylık Satış", icon: "📋" },
    { path: "/danismanlar", label: "Satış Danışmanları", icon: "👥" },
  ];

  return (
    <aside className="w-56 min-h-screen bg-[#5d0024] text-white flex flex-col">
      {/* Marka logosu ve kullanıcı adı */}
      <div className="p-4 border-b border-white/20">
        <h1 className="text-lg font-bold tracking-wider">zsa·zsa·zsu</h1>
        <p className="text-sm text-[#e8b4c0] mt-1">{displayName}</p>
      </div>

      {/* Menü linkleri */}
      <nav className="flex-1 p-3">
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

      {/* Alt kısım — Çıkış butonu */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#e8b4c0] hover:bg-white/10 hover:text-white hover:shadow-lg transition-all duration-200"
        >
          <span>🚪</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;