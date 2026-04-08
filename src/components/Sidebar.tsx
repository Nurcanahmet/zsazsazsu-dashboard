// ============================================
// SIDEBAR BİLEŞENİ — MODERN TASARIM
// ============================================

import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Users,
  LogOut,
  Store,
  ShieldCheck,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  // ---------- KULLANICI BİLGİSİ ----------
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const displayName = user?.name || 'Misafir';
  const userRole = user?.role || 'store';

  // Kullanıcının baş harflerini al (avatar için)
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase();

  // Rol badge metni
  const roleBadge = {
    admin: 'Yönetici',
    super_user: 'Bölge Müdürü',
    store: 'Mağaza',
  }[userRole as 'admin' | 'super_user' | 'store'] || 'Kullanıcı';

  // ---------- ÇIKIŞ FONKSİYONU ----------
  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // ---------- MENÜ ÖĞELERİ ----------
  const menuItems = [
    { path: "/", label: "Genel Bakış", icon: LayoutDashboard },
  ];

  const storeMenuItems = [
    { path: "/gunluk-satis", label: "Günlük Satış", icon: CalendarDays },
    { path: "/aylik-satis", label: "Aylık Satış", icon: BarChart3 },
    { path: "/danismanlar", label: "Satış Danışmanları", icon: Users },
  ];

  return (
    <aside className="w-60 min-h-screen bg-gradient-to-b from-[#5d0024] to-[#2a0010] text-white flex flex-col shadow-2xl">
      {/* ===== LOGO ===== */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wider italic text-white">
          zsa·zsa·zsu
        </h1>
        <p className="text-[10px] text-[#e8b4c0]/70 uppercase tracking-widest mt-0.5">
          Retail Dashboard
        </p>
      </div>

      {/* ===== KULLANICI KARTI ===== */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8b4c0] to-[#c4a11b] flex items-center justify-center text-[#2a0010] font-bold text-sm flex-shrink-0">
            {initials}
          </div>

          {/* İsim + rol */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate" title={displayName}>
              {displayName}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {userRole === 'admin' ? (
                <ShieldCheck className="w-3 h-3 text-[#e8b4c0]" />
              ) : (
                <Store className="w-3 h-3 text-[#e8b4c0]" />
              )}
              <span className="text-[10px] text-[#e8b4c0]/80 uppercase tracking-wide">
                {roleBadge}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MENÜ LİNKLERİ ===== */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* Ana menü */}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all duration-200 ${
                isActive
                  ? "bg-white/15 text-white font-medium shadow-lg"
                  : "text-[#e8b4c0] hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Aktif göstergesi — sol tarafta */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#e8b4c0] rounded-r-full" />
                )}
                <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#e8b4c0]' : ''}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Mağaza bölümü */}
        <p className="text-[10px] text-[#e8b4c0]/50 uppercase tracking-widest mt-6 mb-2 px-3 font-semibold">
          Mağaza
        </p>
        {storeMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all duration-200 ${
                isActive
                  ? "bg-white/15 text-white font-medium shadow-lg"
                  : "text-[#e8b4c0] hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#e8b4c0] rounded-r-full" />
                )}
                <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#e8b4c0]' : ''}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ===== ÇIKIŞ BUTONU ===== */}
      <div className="px-3 pb-4 pt-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#e8b4c0] hover:bg-red-500/20 hover:text-white transition-all duration-200 group"
        >
          <LogOut className="w-[18px] h-[18px] group-hover:text-red-200 transition-colors" />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;