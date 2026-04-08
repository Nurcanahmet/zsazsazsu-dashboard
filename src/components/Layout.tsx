// ============================================
// LAYOUT BİLEŞENİ — GÜNCEL
// ============================================
// Sidebar sabit (fixed), sayfa kaydırılınca sidebar yerinde kalır.
// Sidebar artık storeName prop'u almıyor, kullanıcı bilgisini kendi okuyor.

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — sabit (fixed), kaydırılmaz */}
      <div className="w-60 fixed top-0 left-0 h-screen z-10">
        <Sidebar />
      </div>

      {/* İçerik alanı — sidebar genişliği kadar sola boşluk bırakır */}
<main className="flex-1 ml-60 bg-[#d7d2cb] overflow-y-auto min-h-screen">        <Outlet />
      </main>
    </div>
  );
}

export default Layout;