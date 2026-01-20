
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, the password is 'admin123'
    if (password === 'admin123') {
      onLogin(password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[40px] shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔐</div>
        <h2 className="text-2xl font-bold text-slate-800 font-serif">Yönetim Girişi</h2>
        <p className="text-slate-500 text-sm">Devam etmek için yönetici şifresini girin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-4 rounded-2xl border ${error ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200'} focus:ring-2 focus:ring-slate-900 outline-none transition-all text-center tracking-widest`}
            placeholder="••••••••"
            required
          />
          {error && <p className="text-rose-500 text-xs text-center mt-2 font-bold uppercase tracking-widest">Hatalı Şifre!</p>}
        </div>
        <button 
          type="submit"
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          Giriş Yap
        </button>
      </form>
      <p className="text-center text-xs text-slate-400 mt-6 italic">Demo Şifre: admin123</p>
    </div>
  );
};

export default AdminLogin;
