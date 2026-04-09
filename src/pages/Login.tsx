// ============================================
// LOGIN SAYFASI (Login.tsx) — GLASSMORPHISM
// ============================================
// Tam ekran arkaplan fotoğrafı + ortada cam efektli (blur + saydam) form
// Backend /api/login endpoint'ine gerçek istek atar.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = '/api';

function Login() {
  const navigate = useNavigate();

  // ---------- STATE ----------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sayfa açılınca: önceden 'beni hatırla' işaretliyse maili otomatik doldur
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ---------- GİRİŞ FONKSİYONU ----------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Giriş başarısız');
        setLoading(false);
        return;
      }

      // Başarılı: localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/');
    } catch (err: any) {
      setError('Sunucuya bağlanılamadı. Backend çalışıyor mu?');
      setLoading(false);
    }
  };

  return (
    // Tam ekran arkaplan fotoğrafı
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
      }}
    >
      {/* Hafif karartma overlay — formu okunur yapmak için */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* ===== CAM EFEKTLİ FORM ===== */}
      <div
        className="relative z-10 w-full max-w-md mx-4 p-10 rounded-2xl border border-white/30 shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* ===== LOGO ===== */}
        <div className="text-center mb-6">
          <h2 className="text-white font-bold text-2xl italic tracking-wider drop-shadow-lg">
            zsa·zsa·zsu
          </h2>
        </div>

        {/* ===== BAŞLIK ===== */}
        <h1 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">
          Hoş Geldiniz
        </h1>
        <p className="text-white/80 text-center text-sm mb-8 drop-shadow">
          Devam etmek için giriş yapın
        </p>

        {/* ===== FORM ===== */}
        <form onSubmit={handleLogin}>
          {/* E-posta */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2 drop-shadow">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-lg outline-none focus:bg-white/30 focus:border-white transition-all text-white placeholder-white/60 text-sm backdrop-blur-sm"
            />
          </div>

          {/* Şifre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2 drop-shadow">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-10 bg-white/20 border border-white/40 rounded-lg outline-none focus:bg-white/30 focus:border-white transition-all text-white placeholder-white/60 text-sm backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-lg"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Beni hatırla */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-white"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-white drop-shadow">
              Beni hatırla
            </label>
          </div>

          {/* Hata mesajı */}
          {error && (
            <div className="bg-red-500/30 backdrop-blur-sm border border-red-300/50 rounded-lg p-3 mb-4">
              <p className="text-white text-sm text-center drop-shadow">{error}</p>
            </div>
          )}

          {/* Giriş butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#5d0024] py-3 rounded-lg font-bold hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* ===== ALT YAZISI ===== */}
        <p className="text-center text-xs text-white/70 mt-8 drop-shadow">
          © 2026 Zsa Zsa Zsu. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}

export default Login;