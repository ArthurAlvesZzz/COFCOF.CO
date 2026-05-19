import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-[calc(100vh-88px)] md:min-h-[calc(100vh-104px)] w-full bg-[#0a0a0a]">
      {/* Left Column - Editorial */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Café Editorial" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
        </div>
        <div className="relative z-10 p-20 flex flex-col justify-end h-full mt-auto text-white">
          <div className="inline-block border border-[#c9a263]/30 text-[#c9a263] rounded-full px-3 py-1 mb-6 text-[10px] font-bold tracking-widest uppercase mb-auto mt-0 self-start">
            Acesso Restrito
          </div>
          <h2 className="text-5xl font-serif leading-[1.1] mb-6">
            Sua jornada sensorial<br/><span className="italic font-light opacity-90 text-[#c9a263]">registrada.</span>
          </h2>
          <p className="text-[#a3a3a3] max-w-sm leading-relaxed font-light">
            Acesse seu perfil para gerenciar assinaturas, rastrear lotes adquiridos e descobrir novas curadorias do mestre de torra.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md premium-card"
        >
          <div className="mb-12 text-center lg:text-left">
            <LockKeyhole className="mx-auto lg:mx-0 w-10 h-10 text-[#c9a263] mb-6" strokeWidth={1.5} />
            <h1 className="text-4xl font-serif text-white mb-3 leading-tight">Acesse sua conta CofCof</h1>
            <p className="text-[#a3a3a3]">Veja pedidos, assinatura e preferências.</p>
          </div>

          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="space-y-2">
              <label className="block text-[11px] font-bold tracking-widest uppercase text-[#a3a3a3]">E-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="nome@exemplo.com"
                className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#a3a3a3]">Senha</label>
                <button type="button" className="text-xs text-[#a3a3a3]/50 hover:text-[#c9a263] transition-colors focus:outline-none">
                  Esqueci a senha
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm transition-all tracking-widest font-mono" 
              />
            </div>
            <button className="premium-cta w-full flex items-center justify-center gap-2 mt-4">
              Acessar Perfil <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-12 text-center border-t border-[#a3a3a3]/10 pt-8">
             <p className="text-sm text-[#a3a3a3]">
               Ainda não tem conta?{' '}
               <Link to="/assinatura" className="text-white font-medium border-b border-white/20 hover:border-[#c9a263] hover:text-[#c9a263] transition-all pb-0.5 ml-1">
                 Criar assinatura
               </Link>
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
