// ============================================
// APP — ANA BİLEŞEN + ROUTER
// ============================================
// Login sayfası Sidebar olmadan gösterilir.
// Dashboard sayfaları Layout içinde (Sidebar ile) gösterilir.
// ProtectedRoute: giriş yapmamış kullanıcıları login sayfasına yönlendirir.

import UserManagement from './pages/admin/UserManagement';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailySales from './pages/DailySales';
import MonthlySales from './pages/MonthlySales';
import Consultants from './pages/Consultants';


// ============================================
// PROTECTED ROUTE — Korumalı Sayfa Bileşeni
// ============================================
// Bu bileşen children'ı (içine konan sayfayı) kontrol eder.
// localStorage'da 'user' yoksa = giriş yapmamış = login'e yönlendir.
// Varsa = giriş yapmış = sayfayı göster.
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user');

  if (!user) {
    // Giriş yapmamış, login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  // Giriş yapmış, sayfayı göster
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login sayfası — Sidebar YOK, tam ekran, korumasız */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard sayfaları — Sidebar VAR + KORUMALI */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/gunluk-satis" element={<DailySales />} />
          <Route path="/aylik-satis" element={<MonthlySales />} />
          <Route path="/danismanlar" element={<Consultants />} />
          <Route 
  path="/admin/kullanicilar" 
  element={
    JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' 
      ? <UserManagement /> 
      : <Navigate to="/" replace />
  } 
/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;