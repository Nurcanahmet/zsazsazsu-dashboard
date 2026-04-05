// ============================================
// APP — ANA BİLEŞEN + ROUTER
// ============================================
// Login sayfası Sidebar olmadan gösterilir.
// Dashboard sayfaları Layout içinde (Sidebar ile) gösterilir.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailySales from './pages/DailySales';
import MonthlySales from './pages/MonthlySales';
import Consultants from './pages/Consultants';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login sayfası — Sidebar YOK, tam ekran */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard sayfaları — Sidebar VAR */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gunluk-satis" element={<DailySales />} />
          <Route path="/aylik-satis" element={<MonthlySales />} />
          <Route path="/danismanlar" element={<Consultants />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;