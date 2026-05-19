import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Package, CheckCircle2, ChevronRight, Instagram, Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-32 pb-16 px-6 border-t border-[#a3a3a3]/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80')] opacity-[0.03] mix-blend-lighten bg-cover pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Massive Branding Logotype */}
        <div className="mb-24 flex flex-col items-center md:items-start text-center md:text-left border-b border-[#a3a3a3]/10 pb-16">
          <Link to="/" className="text-7xl md:text-9xl font-serif font-black tracking-tighter mb-6 block drop-shadow-sm hover:opacity-90 transition-opacity">
            COFCOF<span className="text-[#c9a263]">.</span>
          </Link>
          <p className="text-xl md:text-3xl font-serif text-[#a3a3a3] leading-snug max-w-4xl font-light">
             A elevação do café brasileiro.<br className="hidden md:block"/> 
             <span className="italic text-[#c9a263]">Do Cerrado Mineiro para a sua xícara.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-20 lg:mb-32">
          {/* Links 1 - Comprar */}
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263] mb-8">Comprar</h4>
            <ul className="space-y-4 text-sm text-[#a3a3a3] font-medium">
              <li><Link to="/cafes" className="hover:text-white transition-colors">Cafés</Link></li>
              <li><Link to="/assinatura" className="hover:text-white transition-colors">Clube</Link></li>
              <li><Link to="/cafes" className="hover:text-white transition-colors">Presentes</Link></li>
              <li><Link to="/cafes" className="hover:text-white transition-colors">Kits</Link></li>
            </ul>
          </div>

          {/* Links 2 - CofCof */}
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263] mb-8">CofCof</h4>
            <ul className="space-y-4 text-sm text-[#a3a3a3] font-medium">
              <li><Link to="/origem" className="hover:text-white transition-colors">Origem</Link></li>
              <li><Link to="/sobre" className="hover:text-white transition-colors">Curadoria</Link></li>
              <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre</Link></li>
              <li><Link to="/origem" className="hover:text-white transition-colors">Rastreabilidade</Link></li>
            </ul>
          </div>

          {/* Links 3 - Empresas */}
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263] mb-8">Empresas</h4>
            <ul className="space-y-4 text-sm text-[#a3a3a3] font-medium">
              <li><Link to="/empresas" className="hover:text-white transition-colors">B2B</Link></li>
              <li><Link to="/parceiros" className="hover:text-white transition-colors">Parceiros</Link></li>
              <li><Link to="/atacado" className="hover:text-white transition-colors">Revenda</Link></li>
              <li><Link to="/empresas" className="hover:text-white transition-colors">Presentes corporativos</Link></li>
            </ul>
          </div>
          
          {/* Links 4 - Suporte */}
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263] mb-8">Suporte</h4>
            <ul className="space-y-4 text-sm text-[#a3a3a3] font-medium">
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Entrega</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trocas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pagamento</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="lg:col-span-1 h-full">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263] mb-8">Newsletter</h4>
            <p className="text-sm text-[#a3a3a3] mb-6 font-medium">Receba alertas de novos lotes.</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
               <input type="email" placeholder="Seu e-mail" className="w-full bg-[#111111] border border-[#a3a3a3]/10 px-4 py-3 rounded-l-xl text-sm focus:outline-none focus:border-[#c9a263] text-white" />
               <button type="submit" className="bg-[#c9a263] text-[#0a0a0a] px-4 py-3 rounded-r-xl font-bold hover:bg-white transition-colors">
                  <ChevronRight size={18} />
               </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-[#a3a3a3]/10">
               <span className="block text-xs uppercase tracking-widest font-bold text-[#a3a3a3]/50 mb-2">CNPJ</span>
               <span className="block text-sm font-mono text-[#a3a3a3]">50.000.000/0001-00</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Metadata */}
        <div className="pt-8 border-t border-[#a3a3a3]/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3]/50 gap-6">
          <p>&copy; {new Date().getFullYear()} COFCOF.CO. ALL RIGHTS RESERVED. EXCELLENCE IN CERRADO MINEIRO - BRASIL.</p>
          <div className="flex items-center gap-8">
            <Link to="/termos" className="hover:text-white transition-colors">Termos & Cookies</Link>
            <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <a href="https://instagram.com/cofcof.co" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-[#c9a263] flex items-center gap-2"><Instagram size={14}/> @cofcof.co</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

