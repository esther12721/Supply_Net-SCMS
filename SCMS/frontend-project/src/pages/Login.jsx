import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Truck, Eye, EyeOff, Sun, Moon, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error('Please fill all fields');
    const result = await login(form.username, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-500 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-700 blur-3xl"></div>
      </div>

      {/* Theme toggle */}
      <button onClick={toggle} className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all">
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 shadow-2xl shadow-brand-600/40 mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">SupplyNet</h1>
          <p className="text-slate-400 mt-1 text-sm font-mono">Supply Chain Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Username or Email</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-brand-600/30 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          SupplyNet Ltd · Musanze District, Rwanda
        </p>
      </div>
    </div>
  );
}
