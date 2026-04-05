 
// ============================================
// LOGIN SAYFASI (Login.tsx)
// ============================================
// Bu dosya nerede? → src/pages/Login.tsx
// Ne işe yarıyor? → Kullanıcı giriş sayfası.
// Sidebar gösterilmez, tam ekran bordo arka plan.
// Kullanıcı e-posta ve şifre girerek sisteme giriş yapar.
// Giriş başarılı olursa dashboard'a yönlendirilir.
//
// Kullanıcı Rolleri:
//   - admin: IT ekibi, tüm yetki
//   - super_user: Bölge müdürü, birden fazla mağaza
//   - store_user: Mağaza çalışanı, sadece kendi mağazası

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // React Router'ın yönlendirme fonksiyonu
  const navigate = useNavigate();

  // Form state'leri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Giriş Yap butonuna basılınca
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Backend'e giriş isteği atacak
      // Şimdilik basit kontrol — ileride API'den doğrulanacak
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('user', JSON.stringify(data.user));
        // Dashboard'a yönlendir
        navigate('/');
      } else {
        setError('E-posta veya şifre hatalı.');
      }
    } catch {
      // Backend çalışmıyorsa geçici giriş (geliştirme amaçlı)
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({
          name: 'Test Kullanıcı',
          email: email,
          role: 'admin',
          storeId: '1',
          storeName: 'İstanbul Emaar AVM',
        }));
        navigate('/');
      } else {
        setError('E-posta ve şifre gerekli.');
      }
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#5d0024' }}
    >
      {/* Arka plan deseni */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #3b0018 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo ve başlık */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold tracking-widest"
            style={{ color: '#d7d2cb', fontFamily: 'Georgia, serif' }}
          >
            zsa·zsa·zsu
          </h1>
          <p className="text-sm mt-2" style={{ color: '#e8b4c0' }}>
            Mağaza Yönetim Paneli
          </p>
        </div>

        {/* Giriş formu */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#d7d2cb' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#5d0024' }}>
            Giriş Yap
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-posta */}
            <div>
              <label className="block text-sm mb-1" style={{ color: '#5d0024' }}>
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="magaza@zsazsazsu.com.tr"
                required
                autoComplete="off"
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition"
                style={{ border: '1px solid #e8b4c0', backgroundColor: '#fff', color: '#2a0010' }}
              />
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm mb-1" style={{ color: '#5d0024' }}>
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition"
                  style={{ border: '1px solid #e8b4c0', backgroundColor: '#fff', color: '#2a0010', paddingRight: '48px' }}
                />
                {/* Şifre göster/gizle butonu */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#5d0024', opacity: 0.7 }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Hata mesajı */}
            {error && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991b1b' }}>
                {error}
              </p>
            )}

            {/* Giriş butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 mt-2"
              style={{ backgroundColor: '#5d0024', color: '#d7d2cb' }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        {/* Alt yazı */}
        <p className="text-center text-xs mt-6" style={{ color: '#e8b4c0' }}>
          © 2026 Zsa Zsa Zsu — IT Departmanı
        </p>
      </div>
    </div>
  );
}

export default Login;