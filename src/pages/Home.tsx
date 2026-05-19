import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPin, Package, Sprout, Store, Coffee, ChevronRight, Star, ShoppingBag, Gift, Building2, Flame, Award } from 'lucide-react';
import { mockProducts } from '../data/seed';
import { useCartStore } from '../store/cartStore';
import { usePublicContent } from '../hooks/usePublicContent';

const ProofStrip = () => {
  const claims = [
    "86+ pts SCA",
    "Cerrado Mineiro D.O.",
    "Torra sob demanda",
    "Rastreabilidade QR",
    "Cup of Excellence",
    "Lotes selecionados",
    "A partir de R$ 1,87 por xícara"
  ];
  return (
    <div className="w-full bg-[#111111] border-y border-[#1a1a1a] py-5 overflow-hidden flex whitespace-nowrap relative z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.5)] my-4 md:my-8 scale-100">
       <div className="flex px-4 min-w-max items-center animate-marquee">
         {[...claims, ...claims, ...claims, ...claims].map((claim, idx) => (
           <div key={idx} className="flex items-center space-x-6 sm:space-x-12 mr-6 sm:mr-12">
             <span className="text-[10px] md:text-[11px] font-bold text-[#F6F1EB] uppercase tracking-[0.2em]">{claim}</span>
             <span className="text-[#c9a263] opacity-50">✦</span>
           </div>
         ))}
       </div>
    </div>
  );
};

const CertificationsSection = () => {
  return (
    <section className="bg-[#F6F1EB] py-20 md:py-28 px-4 sm:px-6 relative z-10 w-full shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-serif text-[#160F0A] mb-6 leading-tight max-w-3xl">
              Reconhecimentos que sustentam o que está na xícara.
            </h2>
            <p className="text-[#160F0A]/70 text-lg md:text-xl font-light mb-16 max-w-2xl">
              Café especial precisa de origem, avaliação rigorosa e rastreabilidade, não apenas embalagem bonita.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
               <div className="bg-white p-8 rounded-2xl border border-[#160F0A]/5 shadow-[0_5px_15px_rgba(0,0,0,0.03)] text-left flex flex-col justify-center transition-transform hover:-translate-y-1">
                 <h3 className="font-serif text-[#160F0A] text-xl mb-3 flex items-center gap-3">
                    <Award size={20} className="text-[#c9a263]"/> Cup of Excellence
                 </h3>
                 <p className="text-[#160F0A]/70 text-sm leading-relaxed">
                   Reconhecimento de excelência para cafés de qualidade excepcional.
                 </p>
               </div>
               
               <div className="bg-white p-8 rounded-2xl border border-[#160F0A]/5 shadow-[0_5px_15px_rgba(0,0,0,0.03)] text-left flex flex-col justify-center transition-transform hover:-translate-y-1">
                 <h3 className="font-serif text-[#160F0A] text-xl mb-3 flex items-center gap-3">
                    <Star fill="currentColor" size={20} className="text-[#c9a263]"/> Pontuação SCA
                 </h3>
                 <p className="text-[#160F0A]/70 text-sm leading-relaxed">
                   Metodologia internacional usada para classificar cafés especiais.
                 </p>
               </div>
               
               <div className="bg-white p-8 rounded-2xl border border-[#160F0A]/5 shadow-[0_5px_15px_rgba(0,0,0,0.03)] text-left flex flex-col justify-center transition-transform hover:-translate-y-1">
                 <h3 className="font-serif text-[#160F0A] text-xl mb-3 flex items-center gap-3">
                    <MapPin size={20} className="text-[#c9a263]"/> Cerrado Mineiro D.O.
                 </h3>
                 <p className="text-[#160F0A]/70 text-sm leading-relaxed">
                   Origem protegida, rastreável e reconhecida pela identidade do terroir.
                 </p>
               </div>
               
               <div className="bg-white p-8 rounded-2xl border border-[#160F0A]/5 shadow-[0_5px_15px_rgba(0,0,0,0.03)] text-left flex flex-col justify-center transition-transform hover:-translate-y-1 lg:col-span-1">
                 <h3 className="font-serif text-[#160F0A] text-xl mb-3 flex items-center gap-3">
                    <Store size={20} className="text-[#c9a263]"/> Qualidade MAPA
                 </h3>
                 <p className="text-[#160F0A]/70 text-sm leading-relaxed">
                   Referência institucional para fiscalização e segurança no mercado brasileiro.
                 </p>
               </div>
               
               <div className="bg-white p-8 rounded-2xl border border-[#160F0A]/5 shadow-[0_5px_15px_rgba(0,0,0,0.03)] text-left flex flex-col justify-center transition-transform hover:-translate-y-1 lg:col-span-2">
                 <h3 className="font-serif text-[#160F0A] text-xl mb-3 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#c9a263]"/> Q-Grader Certificado
                 </h3>
                 <p className="text-[#160F0A]/70 text-sm leading-relaxed">
                   Avaliação sensorial feita por especialista certificado em qualidade global de café.
                 </p>
               </div>
            </div>
        </div>
    </section>
  );
};

export default function Home() {
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const { getBlock, loading: contentLoading } = usePublicContent('home');

  const kitPrimeiraXicara = mockProducts.find(p => p.slug === 'kit-primeira-xicara') || mockProducts[0];
  const featuredProducts = mockProducts.filter(p => !!p.featured && p.category !== 'kit').slice(0, 4);

  const heroBlock = getBlock('home.hero');
  const dataBarBlock = getBlock('home.dataBar');
  const finalCtaBlock = getBlock('home.finalCta');

  return (
    <div className="w-full pt-6 md:pt-8">
      {/* 1. HERO - Cinematic & Premium */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-4 md:my-8 shadow-2xl bg-[#111111] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
        {/* Hero Background Image overlay */}
        <div className="absolute inset-0 z-0 bg-[image:linear-gradient(to_bottom,rgba(10,10,10,0.9),rgba(10,10,10,0.4)),url('https://lh3.googleusercontent.com/aida-public/AB6AXuBw3hyn7icMTm2DG1DORz-6_pj34D9njJ497ojAHcLknfi71Ksz8kZA2wuQOA6Ryghm14jIX48Y4AAYa8O08yDT-HYCEF0_n6tRXj7x_sVgqhopl_6X1dR1c0lR98-zStNQhNLT-hkksF5YWlAQG_MdBK8D8Vb8whcKrUn0uIbIn2POypGgb_ZJOXHQ7V98ulnSHJlse_8cVyBIh5Ksxir9q3TkRPEmyAntU9Q9akBrJNkoO353SeQp1GbqPHs9yuh5EliG_y0Dwbt_')] bg-cover bg-center rounded-[2rem] md:rounded-[3rem] opacity-70 mix-blend-overlay pointer-events-none"></div>
        
        {/* Floating Beans (Decorative) */}
        <div className="absolute w-10 h-10 rounded-full opacity-80 shadow-[0_10px_25px_rgba(0,0,0,0.5)] bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOZQmzov6DH0_KI8o1h-KnRa36TN6v9yZUXtua5K80tGQV-qXpilTsY7M8J8fA6MkeolQVnYLxkANDZpAn8NzF-xFNo24KIRNbrwg2-u4Pxa0STWiHRPRunwXqFz6IcSOvfPLRYKtV_DF8w2qZVM2cijse2SEhGPcGDd8_AjFNiSoy_2BHYIvSA3LgudBTFOsouSaDZ1eMP-1RalsuA3HWvX1D6b8PwNxYt0tN3g1L85BEnqIKcnqahRrdPI8HuHnaW_-gBVqqwRn0')] bg-cover top-1/4 right-1/4 transform rotate-12 z-0 hidden md:block"></div>
        <div className="absolute w-10 h-10 rounded-full opacity-80 shadow-[0_10px_25px_rgba(0,0,0,0.5)] bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOZQmzov6DH0_KI8o1h-KnRa36TN6v9yZUXtua5K80tGQV-qXpilTsY7M8J8fA6MkeolQVnYLxkANDZpAn8NzF-xFNo24KIRNbrwg2-u4Pxa0STWiHRPRunwXqFz6IcSOvfPLRYKtV_DF8w2qZVM2cijse2SEhGPcGDd8_AjFNiSoy_2BHYIvSA3LgudBTFOsouSaDZ1eMP-1RalsuA3HWvX1D6b8PwNxYt0tN3g1L85BEnqIKcnqahRrdPI8HuHnaW_-gBVqqwRn0')] bg-cover top-1/3 left-1/4 transform -rotate-12 scale-75 z-0 hidden md:block"></div>
        <div className="absolute w-10 h-10 rounded-full opacity-80 shadow-[0_10px_25px_rgba(0,0,0,0.5)] bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOZQmzov6DH0_KI8o1h-KnRa36TN6v9yZUXtua5K80tGQV-qXpilTsY7M8J8fA6MkeolQVnYLxkANDZpAn8NzF-xFNo24KIRNbrwg2-u4Pxa0STWiHRPRunwXqFz6IcSOvfPLRYKtV_DF8w2qZVM2cijse2SEhGPcGDd8_AjFNiSoy_2BHYIvSA3LgudBTFOsouSaDZ1eMP-1RalsuA3HWvX1D6b8PwNxYt0tN3g1L85BEnqIKcnqahRrdPI8HuHnaW_-gBVqqwRn0')] bg-cover bottom-1/3 right-1/3 transform rotate-45 scale-125 z-0 hidden md:block"></div>

        {/* Microcopy Top */}
        <div className="relative z-10 flex justify-center w-full mt-4 md:mt-8 mb-4">
          <div className="inline-flex items-center gap-2 border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-[#c9a263]/10 backdrop-blur-md">
            Lote selecionado da vez
          </div>
        </div>

        {/* Top Stats Bar */}
        <div className="relative z-10 bg-[#1a1a1a]/80 backdrop-blur-md border border-[#a3a3a3]/10 rounded-xl p-6 mb-12 mx-auto max-w-5xl flex flex-wrap justify-between items-center text-sm shadow-xl">
          <div className="px-4 text-center sm:text-left mb-4 sm:mb-0 border-r border-[#a3a3a3]/10 last:border-0 flex-1 hidden sm:block group relative">
            <span className="block text-[#c9a263] mb-1 uppercase text-[10px] tracking-wider font-bold">Edição</span>
            <span className="block text-white font-medium">Nº 01 • 2026</span>
          </div>
          <div className="px-4 text-center sm:text-left mb-4 sm:mb-0 sm:border-r border-[#a3a3a3]/10 last:border-0 flex-1">
            <span className="block text-[#c9a263] mb-1 uppercase text-[10px] tracking-wider font-bold">Origem</span>
            <span className="block text-white font-medium">Cerrado Mineiro</span>
          </div>
          <div className="px-4 text-center sm:text-left mb-4 sm:mb-0 sm:border-r border-[#a3a3a3]/10 last:border-0 flex-1 hidden md:block">
            <span className="block text-[#c9a263] mb-1 uppercase text-[10px] tracking-wider font-bold">Altitude</span>
            <span className="block text-white font-medium">1100 – 1250m</span>
          </div>
          <div className="px-4 text-center sm:text-left mb-4 sm:mb-0 sm:border-r border-[#a3a3a3]/10 last:border-0 flex-1 hidden md:block">
            <span className="block text-[#c9a263] mb-1 uppercase text-[10px] tracking-wider font-bold">Safra</span>
            <span className="block text-white font-medium">Fresco / Arábica</span>
          </div>
          <div className="px-4 text-center sm:text-left mb-4 sm:mb-0 flex-1">
            <span className="block text-[#c9a263] mb-1 uppercase text-[10px] tracking-wider font-bold">Pontuação SCA</span>
            <span className="block text-white font-medium text-lg">86 – 88.5</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mb-16 md:mb-24 px-4 sm:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-serif text-[#c9a263] leading-[1.05] mb-6">
              {heroBlock?.title || "CAFÉS ESPECIAIS PREMIADOS DO BRASIL, TORRADOS SOB DEMANDA."}
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-2xl leading-relaxed mb-10 font-light">
              {heroBlock?.subtitle || "Talvez o melhor café do Brasil ainda não esteja na sua xícara."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button onClick={() => navigate(heroBlock?.ctas?.[0]?.url || '/cafes')} className="bg-[#c9a263] text-[#0a0a0a] px-8 py-5 rounded-xl font-bold text-center hover:bg-[#e0b875] transition-colors shadow-[0_10px_30px_rgba(201,162,99,0.3)] hover:scale-105 active:scale-95 uppercase text-sm">
                {heroBlock?.ctas?.[0]?.label || "Comprar cafés premiados"}
              </button>
              <Link to={heroBlock?.ctas?.[1]?.url || "/assinatura"} className="border border-[#c9a263]/30 text-white px-8 py-5 rounded-xl font-bold text-center hover:bg-white/5 hover:border-[#c9a263]/50 transition-colors backdrop-blur-sm uppercase text-sm">
                {heroBlock?.ctas?.[1]?.label || "Entrar para o Clube"}
              </Link>
            </div>
            
            {/* Microprovas */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-2">
              <span className="flex items-center gap-2"><Award size={14} className="text-[#c9a263]"/> 86–88.5 SCA</span>
              <span className="flex items-center gap-2"><MapPin size={14} className="text-[#c9a263]"/> Cerrado Mineiro</span>
              <span className="flex items-center gap-2"><Flame size={14} className="text-[#c9a263]"/> Torra sob demanda</span>
              <span className="flex items-center gap-2"><Sprout size={14} className="text-[#c9a263]"/> Origem rastreada</span>
            </div>
          </motion.div>
        </div>

        {/* Video Grid Section */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 px-4 sm:px-8">
          {/* Card 1 */}
          <article className="bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl overflow-hidden flex flex-col group cursor-default shadow-lg hover:-translate-y-1 hover:shadow-[#c9a263]/10 transition-all duration-300">
            <div className="relative aspect-video bg-[#0a0a0a]">
              <img alt="Por que esse café é especial?" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity mix-blend-lighten" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLQUsxk_5LqhPjy4zmw2AAhVDerTR_qrH-EYZjSkk90w0vRc1HgqQ12cOvzFRtQ5Yi1MQTUhcUxfl6rFlqNqrtkYAoazavoytXeCfvVGJRokQgj-o0u3m_pYkM1B4lThLC9FDNmesfwRb8isK6mdxxZ9Py3muGc_Uvw8pSEBbK-_n3J9t3_H2BnY7awmv9Y3In9fw5xxytWkd3zRFOdKao9zJc3dNAoEu4B50LVEjG9X8Mxa3YLLwkxeiUWVwEQWL7gv_FwBks305E"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/20 to-transparent"></div>
              <span className="absolute top-4 right-4 bg-[#111111]/80 backdrop-blur-md border border-[#a3a3a3]/20 text-[#a3a3a3] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">Qualidade</span>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-serif text-white mb-3 flex-1 flex items-end">Por que esse café é especial?</h3>
              <p className="text-sm text-[#a3a3a3] mb-6 leading-relaxed flex-1">Pontuação, seleção de lote e diferença real contra café comum.</p>
              <Link to="/sobre" className="inline-flex items-center text-[#c9a263] text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                 Entender a diferença <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          </article>
          {/* Card 2 */}
          <article className="bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl overflow-hidden flex flex-col group cursor-default shadow-lg hover:-translate-y-1 hover:shadow-[#c9a263]/10 transition-all duration-300">
            <div className="relative aspect-video bg-[#0a0a0a]">
              <img alt="Por que custa mais?" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity mix-blend-lighten" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2KqCkpw1B4GssO3fg-tekCqKBRe_oolOZjQBrTVT7cgxWnGE0JetEKl2vlYaPvrzrcp0HuSSDGWnuSiMe_LilwYCn6OkF8h1nFNqo4sSPUhYA39M1-tFexPVEnMlqKbanksE6IL44TY5n0BC3qM_-fIqjBZbR2N-M2FMA4kgtyJc-OFrpesytK2B7Hrp2PrdiJHYO9vzO0qv42QN7KruySAo6ZJCRqz8nWo93CapVFyffHm_djirReatFNFYUYQzNLOMpfoA0Ygii"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/20 to-transparent"></div>
              <span className="absolute top-4 right-4 bg-[#111111]/80 backdrop-blur-md border border-[#a3a3a3]/20 text-[#a3a3a3] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">Valor Justo</span>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-serif text-white mb-3 flex-1 flex items-end">Por que custa mais?</h3>
              <p className="text-sm text-[#a3a3a3] mb-6 leading-relaxed flex-1">Origem, safra, torra sob demanda e rastreabilidade explicados sem complicar.</p>
              <Link to="/sobre" className="inline-flex items-center text-[#c9a263] text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                 Ver o valor do lote <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          </article>
          {/* Card 3 */}
          <article className="bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl overflow-hidden flex flex-col group cursor-default shadow-lg hover:-translate-y-1 hover:shadow-[#c9a263]/10 transition-all duration-300">
            <div className="relative aspect-video bg-[#0a0a0a]">
              <img alt="Como chega até mim?" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity mix-blend-lighten" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpcnfw1r2x5yjy47XwBEHxr9X4xOa2xwDwiM9SwosiYP2_mpztWjrhAVZiAk-Pva0Uw77ddkS8YphEFeO0iQtC3d0GtYelVfNOADDTviRgMvlts7r8MH5rF9mo70DgUKitIZgbrF1LBvnP9jC0UBwE-sJfFL4_YtbwmyMEsaaBZYL7BVVbeCknn5F4ZYqUZuB7MwaJ9qlzEbKhwPLiSMVf6nFQAUFJZ-5LyZgLApOuYd1u9dLy1rIpu-RuYq3uzxjM0lIXq5Bd6gyR"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/20 to-transparent"></div>
              <span className="absolute top-4 right-4 bg-[#111111]/80 backdrop-blur-md border border-[#a3a3a3]/20 text-[#a3a3a3] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">Frescor</span>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-serif text-white mb-3 flex-1 flex items-end">Como chega até mim?</h3>
              <p className="text-sm text-[#a3a3a3] mb-6 leading-relaxed flex-1">Torra, embalagem, envio e frescor até a sua xícara.</p>
              <Link to="/sobre" className="inline-flex items-center text-[#c9a263] text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                 Ver o processo <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          </article>
        </div>
      </div>

      <ProofStrip />
      <CertificationsSection />

      {/* 2. KIT PRIMEIRA XÍCARA */}
      <section className="bg-[#1a1a1a] py-24 px-6 relative z-10 mx-4 md:mx-10 rounded-[3rem] shadow-2xl shadow-black/50 mt-12 md:mt-20 border border-[#a3a3a3]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 w-full order-2 md:order-1">
                <div className="relative aspect-[4/5] md:aspect-[4/3] rounded-[2rem] overflow-hidden group shadow-2xl bg-gradient-to-tr from-[#111111] to-[#2a1b12] flex items-center justify-center">
                    <img 
                      src={kitPrimeiraXicara.image} 
                      alt="Kit Primeira Xícara CofCof" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-80 mix-blend-lighten"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('fallback-mode');
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 [.fallback-mode_&]:opacity-100 transition-opacity">
                      <Coffee size={80} className="text-[#c9a263]/20" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                        <h3 className="font-serif text-3xl mb-2 text-[#c9a263]">{kitPrimeiraXicara.name}</h3>
                        <p className="text-[#a3a3a3] font-medium text-sm">250g Café Premiado + Cards Sensoriais + Guia Rápido</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
                <div className="inline-flex items-center border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest uppercase bg-[#c9a263]/5">
                  Descubra o café que você nunca tomou
                </div>
                <h2 className="text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight">
                  Talvez você não precise gostar mais de café.
                </h2>
                <h3 className="text-2xl text-[#c9a263] font-serif italic mb-8">Talvez só precise provar um café melhor.</h3>
                <p className="text-[#a3a3a3] text-lg mb-8 leading-relaxed">
                  Quebre a barreira da primeira compra. Preparamos um kit especial com nosso melhor lote do Cerrado Mineiro, acompanhado de um card explicativo e um guia simples: <strong className="text-white">Como preparar para não estragar um café premiado</strong>.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                       onClick={() => { navigate('/cafes/kit-primeira-xicara'); }}
                       className="w-full sm:w-auto bg-[#c9a263] text-[#0a0a0a] px-8 py-4.5 rounded-xl font-bold hover:bg-[#e0b875] transition-colors shadow-[0_10px_25px_rgba(201,162,99,0.3)] hover:scale-105 active:scale-95"
                    >
                       Começar pelo Kit
                    </button>
                    <span className="text-sm font-bold text-white">R$ {kitPrimeiraXicara.price.toFixed(2)}</span>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 text-xs font-bold text-[#a3a3a3] uppercase tracking-widest">
                    <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#c9a263]"/> Compra Segura</span>
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-[#c9a263]"/> Origem Controlada</span>
                </div>
            </div>
        </div>
      </section>

      {/* 3. CAFÉS EM DESTAQUE - VITRINE EDITORIAL */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 shadow-2xl bg-[#111111] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none -rotate-12"><Coffee size={400} className="text-[#c9a263]"/></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-[#a3a3a3]/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-white mb-4">Escolhas do Mestre</h2>
            <p className="text-[#a3a3a3] text-lg max-w-xl">Lotes selecionados, torrados sob demanda e enviados no auge do frescor.</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-6">
              <span className="flex items-center gap-2 px-3 py-1.5 border border-[#c9a263]/30 rounded-full text-[#c9a263] bg-[#c9a263]/5 hover:bg-[#c9a263]/20 cursor-pointer transition-colors">Mais premiados</span>
              <span className="flex items-center gap-2 px-3 py-1.5 border border-[#a3a3a3]/30 rounded-full hover:border-[#c9a263]/50 hover:text-white cursor-pointer transition-colors">Para espresso</span>
              <span className="flex items-center gap-2 px-3 py-1.5 border border-[#a3a3a3]/30 rounded-full hover:border-[#c9a263]/50 hover:text-white cursor-pointer transition-colors">Para coado</span>
              <span className="flex items-center gap-2 px-3 py-1.5 border border-[#a3a3a3]/30 rounded-full hover:border-[#c9a263]/50 hover:text-white cursor-pointer transition-colors">Assinatura</span>
            </div>
          </div>
          <Link to="/cafes" className="hidden md:inline-flex items-center gap-2 font-medium bg-[#1a1a1a] px-6 py-3 rounded-xl shadow-sm hover:shadow-md border border-[#a3a3a3]/20 hover:border-[#c9a263]/50 text-white hover:text-[#c9a263] transition-all text-sm uppercase tracking-wider">
            Ver catálogo completo <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.length > 0 ? featuredProducts.map(product => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -6 }}
              className="group flex flex-col bg-[#1a1a1a] rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_rgba(201,162,99,0.15)] transition-all duration-300 border border-[#a3a3a3]/10 h-full"
            >
              <Link to={`/cafes/${product.slug}`} className="block relative aspect-[4/5] bg-[#0a0a0a] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1s]" />
                {product.isAwardWinning ? (
                  <span className="absolute top-4 left-4 z-20 bg-[#c9a263] text-[#0a0a0a] text-[9px] font-extrabold px-3 py-1.5 rounded-lg shadow-lg tracking-widest uppercase">86–88.5 SCA</span>
                ) : (
                  <span className="absolute top-4 left-4 z-20 bg-[#111111]/90 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm border border-[#a3a3a3]/10 tracking-widest uppercase backdrop-blur-md">Torra sob demanda</span>
                )}
              </Link>
              <div className="p-6 md:p-8 flex flex-col flex-1 relative z-20 -mt-8">
                <div className="text-[10px] text-[#c9a263] font-bold uppercase tracking-widest mb-3 bg-[#111111] inline-block px-3 py-1 rounded w-fit border border-[#a3a3a3]/10 shadow-sm">{product.region}</div>
                <h3 className="font-serif text-2xl font-medium mb-3 leading-tight group-hover:text-[#c9a263] text-white transition-colors">{product.name}</h3>
                <p className="text-sm text-[#a3a3a3] mb-5 leading-relaxed">{product.sensoryNotes.join(' • ')}.</p>
                <div className="text-xs text-[#a3a3a3]/80 mb-6 font-medium">{product.formats[0]} 250g</div>
                
                <div className="mt-auto flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-medium text-2xl tracking-tight text-white">R$ {product.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); addItem(product, product.formats[0]); }}
                    className="w-full bg-[#111111] border border-[#a3a3a3]/20 text-white py-3 rounded-xl hover:bg-[#c9a263] hover:text-[#0a0a0a] hover:border-[#c9a263] transition-colors shadow-sm font-bold uppercase text-xs tracking-wider"
                    aria-label="Adicionar ao carrinho"
                  >
                    Adicionar à sacola
                  </button>
                  <Link to={`/cafes/${product.slug}`} className="w-full bg-transparent text-[#a3a3a3] py-2 text-center text-xs uppercase font-bold tracking-wider hover:text-white transition-colors">
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </motion.div>
          )) : <p className="text-[#a3a3a3]">Nenhum produto em destaque.</p>}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Link to="/cafes" className="inline-flex items-center gap-2 font-medium bg-[#1a1a1a] px-6 py-3 rounded-xl shadow-sm hover:shadow-md border border-[#a3a3a3]/20 hover:border-[#c9a263]/50 text-white hover:text-[#c9a263] transition-all text-sm uppercase tracking-wider">
            Ver catálogo completo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 4. COMPARATIVO: Café Comum vs CofCof */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 shadow-2xl bg-[#0a0a0a] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white leading-tight">Não é só outro café na prateleira.</h2>
            <p className="text-xl text-[#a3a3a3] font-light">E a diferença na primeira xícara é inesquecível.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Café comum */}
            <div className="p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 bg-[#111111] flex flex-col relative overflow-hidden">
              <h3 className="text-2xl font-serif text-[#a3a3a3] mb-8 border-b border-[#a3a3a3]/10 pb-6 relative z-10">Café comum</h3>
              <ul className="space-y-6 flex-1 text-[#a3a3a3] font-light relative z-10">
                <li className="flex gap-4"><div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#a3a3a3]/30 shrink-0"/><span>Origem genérica e não identificável</span></li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#a3a3a3]/30 shrink-0"/><span>Torra escura para mascarar defeitos</span></li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#a3a3a3]/30 shrink-0"/><span>Meses esquecido na prateleira</span></li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#a3a3a3]/30 shrink-0"/><span>Pouca ou nenhuma rastreabilidade</span></li>
              </ul>
            </div>
            
            {/* CofCof */}
            <div className="p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-[#c9a263]/40 bg-[#1a1a1a] shadow-[0_10px_40px_rgba(201,162,99,0.05)] flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-[#c9a263]"><Star fill="currentColor" size={120} /></div>
               <h3 className="text-3xl font-serif text-[#c9a263] mb-8 border-b border-[#c9a263]/20 pb-6 flex items-center gap-3 relative z-10">
                 COFCOF.CO
               </h3>
               <ul className="space-y-6 flex-1 text-white font-medium relative z-10">
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Origem 100% identificada e demarcada</span></li>
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Torra sob demanda antes do envio</span></li>
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Lote rastreável até a fazenda (QR Code)</span></li>
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Perfil sensorial real e pontuação SCA</span></li>
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Curadoria rigorosa de cafés especiais</span></li>
               </ul>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <button onClick={() => navigate('/sobre')} className="bg-transparent border border-[#a3a3a3]/30 text-white px-10 py-5 rounded-xl font-bold tracking-wider uppercase text-sm hover:bg-white/5 transition-colors">
               Entender a diferença
             </button>
          </div>
        </div>
      </section>

      {/* 7. PROVAS / O QUE MUDA NA XÍCARA */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 shadow-2xl bg-[#111111] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">O que muda na xícara</h2>
          <p className="text-xl text-[#a3a3a3] font-light">A diferença entre tomar café por hábito e por prazer.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] border border-[#a3a3a3]/10 p-8 rounded-2xl flex flex-col items-start gap-4">
            <div className="flex text-[#c9a263] gap-1"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
            <p className="text-white text-lg font-medium italic leading-relaxed">"Foi o primeiro café que meus clientes perguntaram onde eu comprei."</p>
            <div className="mt-auto pt-6 w-full text-[#a3a3a3] text-sm flex items-center justify-between border-t border-[#a3a3a3]/10">
              <span className="font-bold">Clínica parceira</span>
              <span className="text-xs uppercase tracking-widest text-[#c9a263]">Uberlândia</span>
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#a3a3a3]/10 p-8 rounded-2xl flex flex-col items-start gap-4">
            <div className="flex text-[#c9a263] gap-1"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
            <p className="text-white text-lg font-medium italic leading-relaxed">"Finalmente entendi o que é nota de chocolate e caramelo sem precisar adicionar açúcar."</p>
            <div className="mt-auto pt-6 w-full text-[#a3a3a3] text-sm flex items-center justify-between border-t border-[#a3a3a3]/10">
              <span className="font-bold">Assinante do Clube</span>
              <span className="text-xs uppercase tracking-widest text-[#c9a263]">Lote 01</span>
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#a3a3a3]/10 p-8 rounded-2xl flex flex-col items-start gap-4">
            <div className="flex text-[#c9a263] gap-1"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
            <p className="text-white text-lg font-medium italic leading-relaxed">"O frescor da torra faz toda a diferença. O pacote chega perfumando a caixa do correio."</p>
            <div className="mt-auto pt-6 w-full text-[#a3a3a3] text-sm flex items-center justify-between border-t border-[#a3a3a3]/10">
              <span className="font-bold">Cliente e-commerce</span>
              <span className="text-xs uppercase tracking-widest text-[#c9a263]">Torra sob demanda</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DOSSIÊ DA ORIGEM */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 shadow-2xl bg-[#0a0a0a] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
         <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-lighten" style={{backgroundImage: "url('https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')"}}></div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/20 z-0"></div>
         
         <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest uppercase bg-[#c9a263]/10 backdrop-blur-md">
              <MapPin size={14}/> Dossiê de Origem
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-serif mb-8 text-white leading-tight">
              Do Cerrado Mineiro para sua xícara.
            </h2>
            <p className="text-[#a3a3a3] text-xl font-light mb-12 max-w-xl leading-relaxed">
              Descubra por que a altitude, o solo e o processo de secagem definem a doçura e a qualidade do que você bebe.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
               <div className="bg-[#111111]/80 backdrop-blur-md p-4 rounded-xl border border-[#a3a3a3]/20">
                 <span className="block text-[10px] text-[#c9a263] uppercase tracking-widest font-bold mb-1">Altitude</span>
                 <strong className="text-white text-lg">1.100m+</strong>
               </div>
               <div className="bg-[#111111]/80 backdrop-blur-md p-4 rounded-xl border border-[#a3a3a3]/20">
                 <span className="block text-[10px] text-[#c9a263] uppercase tracking-widest font-bold mb-1">Variedade</span>
                 <strong className="text-white text-lg">Catuaí 144</strong>
               </div>
               <div className="bg-[#111111]/80 backdrop-blur-md p-4 rounded-xl border border-[#a3a3a3]/20">
                 <span className="block text-[10px] text-[#c9a263] uppercase tracking-widest font-bold mb-1">Processo</span>
                 <strong className="text-white text-lg">Natural</strong>
               </div>
               <div className="bg-[#111111]/80 backdrop-blur-md p-4 rounded-xl border border-[#a3a3a3]/20">
                 <span className="block text-[10px] text-[#c9a263] uppercase tracking-widest font-bold mb-1">Safra</span>
                 <strong className="text-white text-lg">Fresco</strong>
               </div>
               <div className="bg-[#111111]/80 backdrop-blur-md p-4 rounded-xl border border-[#a3a3a3]/20">
                 <span className="block text-[10px] text-[#c9a263] uppercase tracking-widest font-bold mb-1">Notas</span>
                 <strong className="text-white text-lg">Chocolate</strong>
               </div>
               <div className="bg-[#111111]/80 backdrop-blur-md p-4 rounded-xl border border-[#a3a3a3]/20">
                 <span className="block text-[10px] text-[#c9a263] uppercase tracking-widest font-bold mb-1">Pontuação</span>
                 <strong className="text-white text-lg">86+ SCA</strong>
               </div>
            </div>
            
            <Link to="/origem" className="inline-flex items-center gap-2 bg-[#c9a263] text-[#0a0a0a] px-8 py-5 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-[#e0b875] transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(201,162,99,0.2)]">
               Ver cafés dessa origem <ArrowRight size={18}/>
            </Link>
         </div>
      </section>

      {/* 5. CLUBE DOS CAFÉS PREMIADOS */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 shadow-2xl bg-[#111111] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative aspect-[4/3] rounded-[2rem] overflow-hidden group shadow-2xl border border-[#a3a3a3]/10">
            <img src="https://images.unsplash.com/photo-1498804103079-a6351b050096?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Mesa com café premium" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2s] mix-blend-lighten" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent" />
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest uppercase bg-[#c9a263]/10 backdrop-blur-md">
              <Star size={14}/> Clube CofCof
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-[1.1]">
              Clube CofCof — cafés premiados antes de todo mundo.
            </h2>
            <p className="text-xl text-[#a3a3a3] mb-10 font-light max-w-xl">
              Todo mês, um lote selecionado, torrado sob demanda e enviado para sua casa.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#a3a3a3]/10">
                <Coffee className="text-[#c9a263] mb-3" size={24} />
                <strong className="block text-white mb-1 font-medium text-sm">Curadoria sensorial</strong>
              </div>
              <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#a3a3a3]/10">
                <MapPin className="text-[#c9a263] mb-3" size={24} />
                <strong className="block text-white mb-1 font-medium text-sm">Rastreabilidade total</strong>
              </div>
              <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#a3a3a3]/10">
                <Flame className="text-[#c9a263] mb-3" size={24} />
                <strong className="block text-white mb-1 font-medium text-sm">Torra sob demanda</strong>
              </div>
              <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#a3a3a3]/10">
                <CheckCircle2 className="text-[#c9a263] mb-3" size={24} />
                <strong className="block text-white mb-1 font-medium text-sm">Flexibilidade para pausar</strong>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3">
              <Link to="/assinatura" className="bg-[#c9a263] text-[#0a0a0a] px-8 py-5 rounded-xl font-bold uppercase text-sm tracking-wider shadow-[0_10px_30px_rgba(201,162,99,0.3)] hover:bg-[#e0b875] hover:scale-105 active:scale-95 transition-all">
                Ver planos do clube
              </Link>
              <span className="text-xs text-[#a3a3a3]">Sem fidelidade. Você controla sua assinatura.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. B2B / EMPRESAS */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 shadow-2xl bg-[#0a0a0a] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest uppercase bg-[#c9a263]/10 backdrop-blur-md">
              <Building2 size={14}/> CofCof B2B
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-[1.1]">
              Sirva um café que comunica cuidado antes da primeira reunião.
            </h2>
            <p className="text-xl text-[#a3a3a3] mb-12 font-light max-w-xl">
              Para clínicas, escritórios, hotéis, restaurantes e empresas que querem transformar café em experiência de marca.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
               <div className="flex bg-[#111111] border border-[#c9a263]/20 p-5 rounded-xl items-center gap-4 hover:border-[#c9a263]/50 transition-colors">
                 <Building2 className="text-[#c9a263] shrink-0" size={24} />
                 <span className="font-medium text-white text-sm">Escritórios premium</span>
               </div>
               <div className="flex bg-[#111111] border border-[#c9a263]/20 p-5 rounded-xl items-center gap-4 hover:border-[#c9a263]/50 transition-colors">
                 <Store className="text-[#c9a263] shrink-0" size={24} />
                 <span className="font-medium text-white text-sm">Clínicas e recepções</span>
               </div>
               <div className="flex bg-[#111111] border border-[#c9a263]/20 p-5 rounded-xl items-center gap-4 hover:border-[#c9a263]/50 transition-colors">
                 <Coffee className="text-[#c9a263] shrink-0" size={24} />
                 <span className="font-medium text-white text-sm">Restaurantes e cafeterias</span>
               </div>
               <div className="flex bg-[#111111] border border-[#c9a263]/20 p-5 rounded-xl items-center gap-4 hover:border-[#c9a263]/50 transition-colors">
                 <Gift className="text-[#c9a263] shrink-0" size={24} />
                 <span className="font-medium text-white text-sm">Presentes corporativos</span>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/empresas" className="w-full sm:w-auto bg-[#c9a263] text-[#0a0a0a] px-8 py-5 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-[#e0b875] transition-all text-center hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(201,162,99,0.3)]">
                Solicitar proposta B2B
              </Link>
              <Link to="/empresas" className="w-full sm:w-auto text-[#a3a3a3] hover:text-white px-8 py-5 text-sm uppercase tracking-wider font-bold transition-colors text-center border border-transparent hover:border-[#a3a3a3]/30 rounded-xl">
                Ver opções para empresas
              </Link>
            </div>
            <p className="text-xs text-[#a3a3a3] mt-6">O café que sua empresa serve também comunica posicionamento.</p>
          </div>
          
          <div className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-[#a3a3a3]/10">
             <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000" alt="Escritório premium servindo café" className="w-full h-full object-cover opacity-70 mix-blend-lighten" />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* 9. PARCEIROS */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 shadow-2xl bg-[#111111] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
          <MapPin size={400} className="text-white" />
        </div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white leading-tight">Onde encontrar CofCof.</h2>
          <p className="text-xl text-[#a3a3a3] font-light max-w-2xl mx-auto">
            Uma rede seleta de cafeterias, restaurantes e empórios servindo e vendendo nossos lotes.
          </p>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 p-8 md:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#c9a263]/10 rounded-full flex items-center justify-center text-[#c9a263] mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Localizador de parceiros em breve</h3>
            <p className="text-[#a3a3a3] mb-8 max-w-md">Estamos mapeando os melhores pontos para você encontrar os cafés CofCof fisicamente mais perto de você.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/parceiros" className="bg-[#111111] border border-[#c9a263]/30 text-[#c9a263] px-8 py-5 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-[#c9a263]/10 transition-colors">
                Indicar um ponto
              </Link>
            </div>
        </div>
      </section>

      {/* 9.5 FAQ HOME */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 bg-[#111111] shadow-2xl w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Dúvidas rápidas</h2>
             <p className="text-[#a3a3a3] text-lg font-light">Para você provar nosso café sem nenhuma objeção.</p>
          </div>
          <div className="space-y-4">
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">O café é enviado em grão ou moído?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Oferecemos ambas as opções. Você pode escolher "Em Grãos" se tiver moedor, ou "Moído" com a granulometria ideal para preparos caseiros como coador, melitta ou V60.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Quando ele é torrado?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Apenas após a confirmação do seu pedido. Nossa torra é sob demanda. Assim, o café chega na sua casa exatamente no auge do frescor (após o período mínimo de descanso).</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Quanto tempo demora para chegar?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Despachamos em até 48 horas úteis após a torra. O tempo de trânsito depende do seu CEP, mas sempre calculamos a melhor rota logística para garantir a entrega rápida.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Qual café escolher para primeira compra?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Recomendamos nosso "Kit Primeira Xícara", projetado exatamente para guiar quem está entrando no mundo dos cafés especiais, com notas equilibradas e fáceis de extrair.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">É muito amargo?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Não! O amargor forte no café comum vem da torra carbonizada. Nossos lotes possuem doçura natural e não recebem torra escura, dispensando até o uso de açúcar.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Posso comprar para presente?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Sim. Durante o checkout, fornecemos opções para adicionar kits de presente e instruções especiais, ideal para surpreender alguém querido.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Como funciona a assinatura?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Todo mês, você recebe um microlote surpresa recém-torrado, acompanhado da história da fazenda e notas sensoriais, diretamente na sua porta, em grão ou moído.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Posso pausar o Clube?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Absolutamente. O Clube CofCof não tem fidelidade. Você entra no seu painel e pode pausar ou pular o mês com um único clique.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Vocês vendem para empresas?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Sim. Temos uma operação B2B com pacotes maiores e torra programada para escritórios, clínicas e cafeterias. Acesse a aba "Empresas" para cotar conosco.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">O que significa pontuação SCA?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">A Specialty Coffee Association avalia os cafés de 0 a 100. Acima de 80, ele é considerado "Especial", atestando ausência de defeitos primários e alta complexidade sensorial.</p>
              </div>
          </div>
        </div>
      </section>

      {/* 10. CTA FINAL */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10 py-24 md:py-32 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[#a3a3a3]/10 my-12 md:my-20 shadow-2xl bg-[#0a0a0a] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] text-center">
        <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOZQmzov6DH0_KI8o1h-KnRa36TN6v9yZUXtua5K80tGQV-qXpilTsY7M8J8fA6MkeolQVnYLxkANDZpAn8NzF-xFNo24KIRNbrwg2-u4Pxa0STWiHRPRunwXqFz6IcSOvfPLRYKtV_DF8w2qZVM2cijse2SEhGPcGDd8_AjFNiSoy_2BHYIvSA3LgudBTFOsouSaDZ1eMP-1RalsuA3HWvX1D6b8PwNxYt0tN3g1L85BEnqIKcnqahRrdPI8HuHnaW_-gBVqqwRn0')] bg-cover opacity-[0.05] mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none -rotate-12"><Coffee size={400} className="text-[#c9a263]"/></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest uppercase bg-[#c9a263]/10 backdrop-blur-md mx-auto">
            <Award size={14}/> CofCof
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.05] mb-12 text-[#c9a263]">
            Seu próximo café pode ser só mais um.<br/> <span className="italic font-light opacity-90 pr-2 pb-2 block text-white mt-4 drop-shadow-md">Ou pode ser o primeiro que você realmente entende.</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button onClick={() => navigate('/cafes')} className="bg-[#c9a263] text-[#0a0a0a] px-8 py-5 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-[#e0b875] transition-all shadow-[0_10px_30px_rgba(201,162,99,0.3)] hover:scale-105 active:scale-95">
              Comprar meu primeiro CofCof
            </button>
            <Link to="/assinatura" className="bg-transparent text-white border border-[#c9a263]/30 px-8 py-5 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-white/5 hover:border-[#c9a263]/50 transition-all backdrop-blur-md">
              Entrar para o Clube
            </Link>
            <Link to="/empresas" className="bg-[#111111] text-[#a3a3a3] hover:text-[#c9a263] border border-[#a3a3a3]/20 px-8 py-5 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-[#1a1a1a] hover:border-[#c9a263]/30 transition-all">
              Quero para minha empresa
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-8 border-t border-[#a3a3a3]/10 w-fit mx-auto">
            <span className="flex items-center gap-2"><Flame size={14} className="text-[#c9a263]"/> Torra sob demanda</span>
            <span className="flex items-center gap-2"><MapPin size={14} className="text-[#c9a263]"/> Origem rastreada</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#c9a263]"/> Lotes selecionados</span>
          </div>
        </div>
      </section>
    </div>
  );
}
