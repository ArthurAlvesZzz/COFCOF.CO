import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { Lock, AlertCircle, Mail, KeyRound, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/cofcof-secure';
  // @ts-ignore
  const enableDevLogin = import.meta.env.VITE_ENABLE_DEV_ADMIN_LOGIN === 'true' || true;

  useEffect(() => {
    if (user && user.role !== 'customer' && user.active) {
      navigate('/admin/cofcof-secure', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas ou usuário sem permissão.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevFill = () => {
    setEmail('admin@cofcof.local');
    setPassword('CofcofAdmin@2026');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="max-w-md w-full bg-[#111111] p-6 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(26,15,10,0.08)] border border-[#a3a3a3]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Lock size={150} className="text-[#c9a263]" />
        </div>
        <div className="flex flex-col items-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-white mb-6 rotate-3 border border-[#c9a263]/20 shadow-sm">
            <ShieldCheck size={32} strokeWidth={1.5} className="text-[#c9a263]" />
          </div>
          <h1 className="text-3xl font-serif text-white leading-tight text-center">Acesso Administrativo CofCof</h1>
          <p className="text-[#a3a3a3] text-sm mt-3 text-center max-w-xs mx-auto leading-relaxed">
            Entre para gerenciar operação, vendas, estoque e rastreabilidade.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 text-red-400 rounded-2xl border border-red-900/50 flex items-center gap-3 text-sm animate-shake relative z-10">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="group">
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#a3a3a3] mb-2 transition-colors group-focus-within:text-[#c9a263]">E-mail Corporativo</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] group-focus-within:text-[#c9a263] transition-colors">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#c9a263]/20 focus:border-[#c9a263] outline-none transition-all text-white placeholder:text-[#a3a3a3]/50"
                placeholder="seu@e-mail.com"
              />
            </div>
          </div>
          
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#a3a3a3] transition-colors group-focus-within:text-[#c9a263]">Senha de Acesso</label>
              <button type="button" className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] hover:text-[#c9a263] transition-colors">Esqueci</button>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] group-focus-within:text-[#c9a263] transition-colors">
                <KeyRound size={18} strokeWidth={1.5} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#c9a263]/20 focus:border-[#c9a263] outline-none transition-all text-white placeholder:text-[#a3a3a3]/50 tracking-wider"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a263] text-[#0a0a0a] py-5 rounded-2xl font-bold hover:bg-white transition-all disabled:opacity-70 mt-4 shadow-[0_10px_30px_rgba(201,162,99,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                Acessando...
              </span>
            ) : (
              <>Entrar no Painel <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {enableDevLogin && (
          <div className="mt-10 pt-8 border-t border-dashed border-[#a3a3a3]/10 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-[#a3a3a3]/10" />
              <p className="text-[10px] text-center text-[#a3a3a3] tracking-[0.2em] uppercase font-bold px-4">DEV MODE</p>
              <div className="h-px flex-1 bg-[#a3a3a3]/10" />
            </div>
            <button
              type="button"
              onClick={handleDevFill}
              className="w-full py-3.5 bg-[#1a1a1a] text-[#a3a3a3] text-xs font-bold tracking-widest uppercase rounded-2xl hover:bg-[#1a1a1a] hover:border-[#c9a263] hover:text-[#c9a263] transition-all border border-[#a3a3a3]/10"
            >
              Preencher Teste
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
