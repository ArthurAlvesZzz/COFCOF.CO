import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, Award, Search, Sparkles, Building2, MapPin, ArrowRight } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-16">
      
      {/* 1. HERO & MANIFESTO */}
      <section className="premium-container mt-0 mb-12">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-lighten" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-8 md:pt-16">
          <div className="premium-badge mb-8 mx-auto">
            <Sparkles size={14} /> CofCof Manifesto
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-[4rem] font-serif text-white mb-8 leading-tight"
          >
            O café que o Brasil produz para o mundo,<br />agora na sua casa.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#a3a3a3] font-light mb-12 leading-relaxed"
          >
            O brasileiro se acostumou com café ruim sem saber.
          </motion.p>
        </div>
      </section>

      {/* 2. A TESE */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <div className="prose prose-invert prose-lg md:prose-xl mx-auto">
          <p className="text-[#a3a3a3] leading-relaxed mb-8">
            Durante décadas, o Brasil assumiu a posição de maior produtor e exportador de café do mundo. Porém, os melhores grãos — os lotes premiados, com 86, 88 ou 90 pontos na escala SCA — sempre embarcaram para fora. Para o mercado interno, restaram os grãos quebrados, as impurezas e as torras extremamente escuras, usadas justamente para esconder defeitos.
          </p>
          <p className="text-white font-medium text-2xl leading-relaxed mb-8 font-serif px-6 border-l-2 border-[#c9a263]">
            Acreditamos que tomar café não deve ser apenas um hábito automatizado ou uma injeção de cafeína. Pode ser um ritual, um momento de pausa real e uma experiência de paladar.
          </p>
          <p className="text-[#a3a3a3] leading-relaxed mb-8">
            A CofCof nasceu para alterar essa rota. Nosso processo é cirúrgico: separamos micro-lotes do Cerrado Mineiro, compramos prêmios direto do produtor e os disponibilizamos apenas sob demanda.
          </p>
        </div>
      </section>

      {/* 3. O QUE NOS TORNA DIFERENTES */}
      <section className="premium-container mb-24">
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Origem, Torra e Rastreabilidade</h2>
            <p className="text-[#a3a3a3]">A diferença não está no marketing, está na xícara.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="premium-card p-8 flex flex-col">
              <MapPin size={32} className="text-[#c9a263] mb-6" />
              <h3 className="text-xl font-serif text-white mb-4">Origem Controlada</h3>
              <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">Trabalhamos focados no Cerrado Mineiro. Alta altitude, estações definidas e rastreabilidade total de qual fazenda gerou cada lote.</p>
            </div>
            <div className="premium-card p-8 flex flex-col">
              <Award size={32} className="text-[#c9a263] mb-6" />
              <h3 className="text-xl font-serif text-white mb-4">Pontuação Comprovada</h3>
              <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">Apenas cafés de especialidade que atingem notas superiores na escala oficial. Naturalmente doces, com notas de chocolate, caramelo ou frutas vermelhas.</p>
            </div>
            <div className="premium-card p-8 flex flex-col">
              <Search size={32} className="text-[#c9a263] mb-6" />
              <h3 className="text-xl font-serif text-white mb-4">Torra sob Demanda</h3>
              <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">O frescor é o maior indicador de qualidade. Não temos café estocado há meses; torramos focado no pedido para máxima expressão aromática.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAMINHOS */}
      <section className="max-w-6xl mx-auto px-6 mb-24 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-16">Como viver essa experiência</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/cafes" className="premium-card p-8 hover:-translate-y-2 group">
            <Coffee className="text-[#c9a263] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider text-sm">Comprar Cafés</h4>
            <span className="text-[#a3a3a3] text-xs">Catálogo sob demanda</span>
          </Link>
          <Link to="/assinatura" className="premium-card p-8 hover:-translate-y-2 group border-[#c9a263]/30">
            <Sparkles className="text-[#c9a263] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider text-sm">Entrar no Clube</h4>
            <span className="text-[#a3a3a3] text-xs">Lotes premiados e inéditos todo mês</span>
          </Link>
          <Link to="/empresas" className="premium-card p-8 hover:-translate-y-2 group">
            <Building2 className="text-[#c9a263] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider text-sm">Empresas e B2B</h4>
            <span className="text-[#a3a3a3] text-xs">Café que comunica valor</span>
          </Link>
          <Link to="/parceiros" className="premium-card p-8 hover:-translate-y-2 group">
            <MapPin className="text-[#c9a263] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider text-sm">Onde Encontrar</h4>
            <span className="text-[#a3a3a3] text-xs">Parceiros e pontos físicos</span>
          </Link>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="text-center max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-serif text-[#c9a263] mb-8">Venha descobrir a diferença hoje.</h2>
        <button onClick={() => navigate('/cafes')} className="premium-cta">
          Comprar meu primeiro CofCof <ArrowRight size={18} className="ml-2" />
        </button>
      </section>

    </div>
  );
}
