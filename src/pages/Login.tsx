// ============================================
// LOGIN SAYFASI (Login.tsx)
// ============================================
// Backend /api/login endpoint'ine istek atar.
// Başarılı olursa kullanıcıyı localStorage'a kaydeder ve Genel Bakış'a yönlendirir.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:3001/api';

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
      // Backend'e istek at
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Hata varsa göster
      if (!data.success) {
        setError(data.error || 'Giriş başarısız');
        setLoading(false);
        return;
      }

      // Başarılı: kullanıcı bilgisini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(data.user));

      // 'Beni hatırla' işaretliyse maili sakla
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Genel Bakış'a yönlendir
      navigate('/');
    } catch (err: any) {
      setError('Sunucuya bağlanılamadı. Backend çalışıyor mu?');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #5d0024 0%, #2a0010 50%, #e8b4c0 100%)',
      }}
    >
      {/* ===== BEYAZ CARD ===== */}
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        {/* ===== LOGO ===== */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#5d0024] px-6 py-3 rounded-lg">
            <span className="text-white font-bold text-lg italic tracking-wider">
              zsa·zsa·zsu
            </span>
          </div>
        </div>

        {/* ===== BAŞLIK ===== */}
        <h1 className="text-3xl font-bold text-[#5d0024] text-center mb-2">
          Hoş Geldiniz
        </h1>
        <p className="text-[#5d0024]/60 text-center text-sm mb-8">
          Devam etmek için giriş yapın
        </p>

        {/* ===== FORM ===== */}
        <form onSubmit={handleLogin}>
          {/* E-posta */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2a0010] mb-2">
              E-posta
            </label>
            <div className="relative">
              {/* Mail icon */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                ✉
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024] transition-colors text-sm"
              />
            </div>
          </div>

          {/* Şifre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2a0010] mb-2">
              Şifre
            </label>
            <div className="relative">
              {/* Kilit icon */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#5d0024] transition-colors text-sm"
              />
              {/* Göster/Gizle butonu */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5d0024]"
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
              className="w-4 h-4 accent-[#5d0024]"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-[#2a0010]">
              Beni hatırla
            </label>
          </div>

          {/* Hata mesajı */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Giriş butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5d0024] text-white py-3 rounded-lg font-medium hover:bg-[#7a0030] transition-colors disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* ===== ALT YAZISI ===== */}
        <p className="text-center text-xs text-[#5d0024]/40 mt-8">
          © 2026 Zsa Zsa Zsu. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}

export default Login;