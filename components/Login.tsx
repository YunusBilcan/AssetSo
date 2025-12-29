
import React, { useState } from 'react';
import { ICONS } from '../constants.tsx';

interface LoginProps {
  onLogin: (email: string, pass: string, name?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('demo@assetpro.com');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !fullName)) {
      alert('Lütfen tüm alanları eksiksiz doldurun.');
      return;
    }

    if (isLogin) {
      onLogin(email, password);
    } else {
      // Kayıt işlemi sonrası doğrudan isimle giriş yapıyoruz
      alert(`Hoş geldiniz ${fullName}! Hesabınız oluşturuldu.`);
      onLogin(email, password, fullName);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden text-gray-900">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-white p-10 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6">
            <ICONS.Package />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">AssetPro <span className="text-indigo-600">PIM</span></h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">SaaS Varlık Yönetim Portalı</p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Giriş Yap
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Ad Soyad</label>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">E-Posta Adresi</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@assetpro.com"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Şifre</label>
              {isLogin && <button type="button" className="text-[10px] font-bold text-indigo-600 hover:underline">Şifremi Unuttum</button>}
            </div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] mt-4"
          >
            {isLogin ? 'Sisteme Eriş' : 'Hemen Kaydol'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Hızlı Erişim (Demo)</p>
          <div className="bg-indigo-50/50 p-3 rounded-xl inline-block border border-indigo-50">
            <p className="text-[11px] text-indigo-700 font-bold">demo@assetpro.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
