
import React, { useState } from 'react';
import { UserSession } from '../types';

interface LoginProps {
  onLogin: (session: UserSession) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated Authentication
    setTimeout(() => {
      if (email && password.length >= 6) {
        onLogin({
          uid: '123',
          email: email,
          role: email.includes('admin') ? 'admin' : 'employee'
        });
      } else {
        setError("Email yoki parol noto'g'ri (Parol kamida 6 ta belgi)");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-blue-600 text-white text-center">
          <h1 className="text-3xl font-bold italic">JIZPI BAZA</h1>
          <p className="mt-2 text-blue-100 opacity-80">Elektron tizimga xush kelibsiz</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email manzil</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="xodim@jizpi.uz"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Kirilmoqda...' : 'Tizimga Kirish'}
          </button>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Faqat vakolatli xodimlar uchun. <br/>
              Muammo yuzaga kelsa, IT bo'limiga murojaat qiling.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
