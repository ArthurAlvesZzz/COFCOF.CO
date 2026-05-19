import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Star, 
  Coffee, 
  ChevronRight, 
  Award, 
  Sprout, 
  QrCode, 
  Flame, 
  ShieldCheck, 
  CheckCircle2,
  Package,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { publicContentService } from '../services/publicContentService';
import { ContentBlock } from '../types/admin';

export default function Origin() {
  const [activeRoast, setActiveRoast] = useState<'clara' | 'media' | 'escura'>('media');
  const [content, setContent] = useState<Record<string, Partial<ContentBlock>>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      const blocks = await publicContentService.getPageContent('origem');
      const contentMap: Record<string, Partial<ContentBlock>> = {};
      blocks.forEach(b => {
        contentMap[b.key] = b;
      });
      setContent(contentMap);
    };
    fetchContent();
  }, []);

  const heroBlock = content['origem_hero'];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen pt-32">
      {/* 1. HERO ORIGEM */}
      <section className="premium-container mt-0 mb-12 border-none">
        <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Fazenda de café no Cerrado Mineiro" 
              className="w-full h-full object-cover opacity-20 mix-blend-lighten" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent z-0" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-20 pt-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="premium-badge mb-8 mx-auto">
              <MapPin size={14} /> Origem e Processo
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-6 leading-[1.1] max-w-4xl mx-auto whitespace-pre-line" dangerouslySetInnerHTML={{__html: heroBlock?.title || 'Do pé de café<br/>ao <span class="text-[#c9a263] italic font-light drop-shadow-sm">ponto de torra.</span>'}}>
            </h1>
            <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {heroBlock?.subtitle || 'Cada lote CofCof nasce de uma origem rastreável, passa por curadoria sensorial e recebe uma torra pensada para revelar o melhor do grão.'}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link 
                to={heroBlock?.ctas?.[0]?.url || "/cafes"}
                className="premium-cta w-full sm:w-auto"
              >
                {heroBlock?.ctas?.[0]?.label || 'Ver cafés rastreáveis'}
              </Link>
              <button 
                onClick={() => scrollToSection('jornada')}
                className="premium-cta-ghost w-full sm:w-auto"
               >
                Entender a curadoria
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-8 border-t border-[#a3a3a3]/10 w-fit mx-auto">
              <span className="flex items-center gap-1.5 sm:gap-2"><MapPin size={14} className="text-[#c9a263]"/> Cerrado Mineiro D.O.</span>
              <span className="flex items-center gap-1.5 sm:gap-2"><Star size={14} className="text-[#c9a263]"/> Lotes Premiados</span>
              <span className="flex items-center gap-1.5 sm:gap-2"><Flame size={14} className="text-[#c9a263]"/> Torra Sob Demanda</span>
              <span className="flex items-center gap-1.5 sm:gap-2"><QrCode size={14} className="text-[#c9a263]"/> Rastreabilidade</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. JORNADA VISUAL DO PÉ À XÍCARA */}
      <section id="jornada" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Jornada que começa antes da torra</h2>
            <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto font-light">Origem, prova, torra e rastreabilidade entregando um café com história real.</p>
          </div>

          <div className="relative">
            {/* Timeline Line (Desktop only) */}
            <div className="hidden lg:block absolute top-[50%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a263]/40 to-transparent -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl flex items-center justify-center text-[#c9a263] mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[#c9a263]/10 transition-all duration-300">
                  <Sprout size={28} />
                </div>
                <div className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest mb-3">01</div>
                <h3 className="font-serif text-lg text-white mb-3">Origem no Cerrado</h3>
                <p className="text-xs text-[#a3a3a3] leading-relaxed font-light">Clima, altitude e consistência de safra definidos.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl flex items-center justify-center text-[#c9a263] mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[#c9a263]/10 transition-all duration-300">
                  <Search size={28} />
                </div>
                <div className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest mb-3">02</div>
                <h3 className="font-serif text-lg text-white mb-3">Seleção do Lote</h3>
                <p className="text-xs text-[#a3a3a3] leading-relaxed font-light">Potencial comprovado, mais que um discurso.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl flex items-center justify-center text-[#c9a263] mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[#c9a263]/10 transition-all duration-300">
                  <Droplets size={28} />
                </div>
                <div className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest mb-3">03</div>
                <h3 className="font-serif text-lg text-white mb-3">Prova e Curadoria</h3>
                <p className="text-xs text-[#a3a3a3] leading-relaxed font-light">Catálogos formados por rigorosa análise da xícara.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl flex items-center justify-center text-[#c9a263] mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[#c9a263]/10 transition-all duration-300">
                  <Flame size={28} />
                </div>
                <div className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest mb-3">04</div>
                <h3 className="font-serif text-lg text-white mb-3">Torra sob Demanda</h3>
                <p className="text-xs text-[#a3a3a3] leading-relaxed font-light">Não esconde defeitos, revela doçura e aroma.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-2xl flex items-center justify-center text-[#c9a263] mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[#c9a263]/10 transition-all duration-300">
                  <QrCode size={28} />
                </div>
                 <div className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest mb-3">05</div>
                <h3 className="font-serif text-lg text-white mb-3">Rastreabilidade</h3>
                <p className="text-xs text-[#a3a3a3] leading-relaxed font-light">Documentamos origem e torra do grão em QR.</p>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-[#c9a263]/20 border border-[#c9a263]/30 rounded-2xl flex items-center justify-center text-[#c9a263] mb-6 group-hover:scale-110 transition-all duration-300 backdrop-blur-md">
                  <Coffee size={28} />
                </div>
                 <div className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest mb-3">06</div>
                <h3 className="font-serif text-lg text-white mb-3">Café na Xícara</h3>
                <p className="text-xs text-[#a3a3a3] leading-relaxed font-light">Experiência impecável para paladares exigentes.</p>
              </motion.div>
            </div>
          </div>
      </section>

      {/* 3. CERRADO MINEIRO D.O. */}
      <section className="py-24 px-6 border-t border-[#a3a3a3]/10 mt-12 bg-gradient-to-b from-[#111111]/50 to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
           <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">Origem que não é genérica.</h2>
             <p className="text-[#a3a3a3] text-lg mb-8 leading-relaxed font-light">
               O Cerrado Mineiro é reconhecido pela consistência de clima, altitude e identidade sensorial. Isso proporciona a cada lote alta previsibilidade, rastreabilidade e muita história.
             </p>
             <div className="premium-card p-8 mb-10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2 font-serif text-xl"><MapPin size={18} className="text-[#c9a263]"/> Denominação de Origem</h4>
                <p className="text-sm text-[#a3a3a3] leading-relaxed">
                  (D.O.) é uma forma de reconhecer internacionalmente que aquele café vem de uma região geográfica comprovada e controlada.
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-[#111111] border border-[#a3a3a3]/10 px-4 py-3 rounded-xl shadow-sm text-sm text-[#a3a3a3] font-medium">
                  <CheckCircle2 size={16} className="text-[#c9a263]" /> Clima Definido
                </div>
                <div className="flex items-center gap-3 bg-[#111111] border border-[#a3a3a3]/10 px-4 py-3 rounded-xl shadow-sm text-sm text-[#a3a3a3] font-medium">
                  <CheckCircle2 size={16} className="text-[#c9a263]" /> Altitude Favorável
                </div>
                <div className="flex items-center gap-3 bg-[#111111] border border-[#a3a3a3]/10 px-4 py-3 rounded-xl shadow-sm text-sm text-[#a3a3a3] font-medium">
                  <CheckCircle2 size={16} className="text-[#c9a263]" /> Safra Rastreável
                </div>
                <div className="flex items-center gap-3 bg-[#111111] border border-[#a3a3a3]/10 px-4 py-3 rounded-xl shadow-sm text-sm text-[#a3a3a3] font-medium">
                  <CheckCircle2 size={16} className="text-[#c9a263]" /> Região Protegida
                </div>
             </div>
             
             <Link to="/cafes" className="premium-cta gap-2 inline-flex">
                Comprar cafés dessa origem <ChevronRight size={18} />
             </Link>
           </motion.div>
           
           <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative h-full">
             <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-[#a3a3a3]/10 premium-card">
               <img src="https://images.unsplash.com/photo-1542618210-9426fcdbef16?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Cerrado Mineiro" className="w-full h-full object-cover opacity-60 mix-blend-lighten" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/20 to-transparent" />
               <div className="absolute bottom-10 left-10 p-6 bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-[#c9a263]/30 text-white max-w-[280px]">
                  <Award size={32} className="text-[#c9a263] mb-4" />
                  <div className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80 text-[#c9a263]">Selo Autêntico</div>
                  <div className="font-serif text-xl">Denominação de Origem Controlada</div>
               </div>
             </div>
           </motion.div>
        </div>
      </section>

      {/* 4. CURADORIA E PROVA CEGA */}
      <section className="py-24 px-6 border-t border-[#a3a3a3]/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="order-2 lg:order-1 relative">
            <div className="relative rounded-[3rem] overflow-hidden premium-card w-full lg:w-4/5 ml-auto border border-[#c9a263]/20">
              <img src="https://images.unsplash.com/photo-1589123053646-4e96fc3a6e9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Prova Cega Cupping" className="w-full aspect-[4/5] object-cover opacity-30 mix-blend-lighten group-hover:scale-105 transition-transform duration-[1.5s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                 <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-[#c9a263]" />
                    <div className="flex justify-between items-start mb-6 border-b border-[#a3a3a3]/10 pb-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263] mb-1">Status: Aprovado</div>
                        <div className="font-serif text-xl text-white">Catuaí Amarelo Doce</div>
                      </div>
                       <div className="text-right">
                         <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-1">SCA Score</div>
                         <div className="font-serif text-2xl text-[#c9a263]">88.5</div>
                       </div>
                    </div>
                    
                    <div className="space-y-3 text-xs mb-6 font-mono font-medium tracking-wide">
                      <div className="flex justify-between"><span className="text-[#a3a3a3]">Corpo</span><span className="text-white">Licoroso</span></div>
                      <div className="flex justify-between"><span className="text-[#a3a3a3]">Acidez</span><span className="text-white">Cítrica Brilhante</span></div>
                      <div className="flex justify-between"><span className="text-[#a3a3a3]">Doçura</span><span className="text-white">Intensa e Mel</span></div>
                      <div className="flex justify-between"><span className="text-[#a3a3a3]">Finalização</span><span className="text-white">Longa</span></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-widest">
                       <span className="premium-badge">Melaço</span>
                       <span className="premium-badge">Florais</span >
                       <span className="premium-badge">Pêssego</span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
             <div className="premium-badge mb-6">
              <Search size={14} /> Curadoria CofCof
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-white">Antes de virar CofCof, o lote passa pela xícara.</h2>
            <p className="text-[#a3a3a3] text-lg mb-8 leading-relaxed font-light">
               A seleção não começa pela embalagem. Começa pela prova cega. Analisamos potencial sensorial, consistência e capacidade de entregar algo extraordinário.
            </p>
            <div className="bg-[#111111] p-6 border-l-2 border-[#c9a263] rounded-r-2xl border-y border-r border-[#a3a3a3]/10 mb-8">
               <span className="font-serif text-xl italic text-white block">"Selo D.O. chama atenção.<br/> A xícara é que confirma."</span>
            </div>
            <Link to="/cafes" className="premium-cta gap-2 inline-flex">
               Ver cafés curados por nós <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. PERFIL DE TORRA */}
      <section className="py-24 px-6 premium-container sm:!my-20 sm:!w-[calc(100%-2rem)]">
        <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">A torra certa não esconde.<br/><span className="text-[#c9a263] italic">Ela revela.</span></h2>
          <p className="text-[#a3a3a3] text-lg mx-auto leading-relaxed font-light">
            Todo café recebe um perfil de torra pensado para preservar aromas, doçura e acidez particular da origem. Não padronizamos, valorizamos o limite das particularidades.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
           {/* Régua Interativa */}
           <div className="grid md:grid-cols-3 gap-4 mb-8">
              {(['clara', 'media', 'escura'] as const).map((roast) => (
                <button
                  key={roast}
                  onClick={() => setActiveRoast(roast)}
                  onMouseEnter={() => setActiveRoast(roast)}
                  className={`premium-card relative p-6 text-left border ${
                    activeRoast === roast 
                      ? 'border-[#c9a263] shadow-[0_5px_20px_rgba(201,162,99,0.2)]' 
                      : 'border-[#a3a3a3]/10 hover:border-[#c9a263]/30'
                  }`}
                >
                   <div className={`absolute top-0 right-0 bottom-0 w-2 transition-colors duration-500 ${
                      roast === 'clara' ? 'bg-[#c9a263]' : roast === 'media' ? 'bg-[#a67a3f]' : 'bg-[#5e4321]'
                   }`} />
                   
                   <div className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Perfil</div>
                   <div className="text-xl font-serif text-white capitalize mb-1">Torra {roast}</div>
                   <div className={`text-xs font-bold uppercase tracking-widest mt-4 transition-colors ${activeRoast === roast ? 'text-[#c9a263]' : 'text-transparent'}`}>Ver perfil &rarr;</div>
                </button>
              ))}
           </div>

           {/* Detalhe do Perfil Selecionado */}
           <div className="bg-[#111111] border border-[#a3a3a3]/10 p-8 md:p-10 rounded-3xl min-h-[220px] flex items-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {activeRoast === 'clara' && (
                  <motion.div key="clara" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                    <h4 className="text-2xl font-serif text-white mb-3 flex items-center gap-2"><Flame className="text-[#c9a263]" size={24}/> Torra Clara</h4>
                    <p className="text-[#a3a3a3] leading-relaxed font-light mb-6">Foco total em preservar os aromas voláteis originais do grão. Destaca a acidez cítrica, notas florais e frutadas, além do corpo que se assemelha a um chá denso.</p>
                    <div className="flex items-center gap-3 flex-wrap">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263]">Ideal para:</span>
                       <span className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-[#a3a3a3]/10">Coado V60</span>
                       <span className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-[#a3a3a3]/10">Chemex</span>
                    </div>
                  </motion.div>
                )}
                {activeRoast === 'media' && (
                  <motion.div key="media" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                    <h4 className="text-2xl font-serif text-white mb-3 flex items-center gap-2"><Flame className="text-[#a67a3f]" size={24}/> Torra Média</h4>
                    <p className="text-[#a3a3a3] leading-relaxed font-light mb-6">Ponto de equilíbrio (nossa especialidade). Evidencia a doçura do caramelo e chocolate sem perder a acidez típica do microlote. Oferece um corpo aveludado e finalização longa.</p>
                    <div className="flex items-center gap-3 flex-wrap">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263]">Ideal para:</span>
                       <span className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-[#a3a3a3]/10">Espresso</span>
                       <span className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-[#a3a3a3]/10">Prensa Francesa</span>
                    </div>
                  </motion.div>
                )}
                {activeRoast === 'escura' && (
                  <motion.div key="escura" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                    <h4 className="text-2xl font-serif text-white mb-3 flex items-center gap-2"><Flame className="text-[#5e4321]" size={24}/> Torra Escura</h4>
                    <p className="text-[#a3a3a3] leading-relaxed font-light mb-6">Construída para os fãs da potência: desenvolve notas acentuadas de cacau intenso e especiarias. A acidez praticamente desaparece, dando lugar ao corpo bem presente.</p>
                    <div className="flex items-center gap-3 flex-wrap">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263]">Ideal para:</span>
                       <span className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-[#a3a3a3]/10">Moka (Italiana)</span>
                       <span className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-[#a3a3a3]/10">Bebidas com Leite</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
           
           <div className="mt-12 text-center relative z-10 w-full mb-12">
             <Link to="/cafes" className="premium-cta inline-flex gap-2 mx-auto">
               Escolher café torrado sob demanda <ChevronRight size={18} />
             </Link>
           </div>
        </div>
      </section>

      {/* 6. RASTREABILIDADE TOTAL */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
           <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">Um QR Code que justifica a xícara.</h2>
             <p className="text-[#a3a3a3] text-lg mb-8 leading-relaxed font-light">
               Sabe aquela nota de mel que você acabou de sentir? No nosso passaporte sensorial validado via smartphone, você entende o processo e os prêmios da fazenda de origem que a originaram.
             </p>
             <Link to="/cafes" className="premium-cta gap-2 inline-flex">
              Ver lote disponível agora <ChevronRight size={18} />
             </Link>
           </motion.div>

           <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative flex justify-center lg:justify-end">
             {/* Mockup do Cartão de Rastreabilidade */}
             <div className="w-full max-w-[420px] bg-[#111111] rounded-[2.5rem] border border-[#a3a3a3]/10 p-8 shadow-2xl relative premium-card">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
                  <QrCode size={100} strokeWidth={1} />
                </div>
                
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263] mb-1">Passaporte Sensorial</h4>
                <div className="font-serif text-2xl text-white mb-6">Geisha Processado Natural</div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex border-b border-[#a3a3a3]/10 pb-3">
                    <span className="w-1/3 text-xs uppercase font-bold text-[#a3a3a3] tracking-wider">Origem</span>
                    <span className="w-2/3 text-sm font-medium text-white text-right">Cerrado D.O.</span>
                  </div>
                  <div className="flex border-b border-[#a3a3a3]/10 pb-3">
                    <span className="w-1/3 text-xs uppercase font-bold text-[#a3a3a3] tracking-wider">Produtor</span>
                    <span className="w-2/3 text-sm font-medium text-white text-right">Fazenda Primavera</span>
                  </div>
                  <div className="flex border-b border-[#a3a3a3]/10 pb-3">
                    <span className="w-1/3 text-xs uppercase font-bold text-[#a3a3a3] tracking-wider">Altitude</span>
                    <span className="w-2/3 text-sm font-medium text-white text-right">1.250 metros</span>
                  </div>
                  <div className="flex border-b border-[#a3a3a3]/10 pb-3">
                     <span className="w-1/3 text-xs uppercase font-bold text-[#a3a3a3] tracking-wider">Torra</span>
                     <span className="w-2/3 text-sm font-medium text-white text-right">Sob Demanda</span>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#a3a3a3]/10 shadow-sm flex items-center justify-between">
                   <div className="w-[80px] h-[80px] bg-[#0a0a0a] rounded-xl flex items-center justify-center text-[#c9a263] border border-[#a3a3a3]/10">
                      <QrCode size={48} />
                   </div>
                   <div className="text-right pl-4">
                     <h5 className="font-serif text-white mb-1 leading-tight text-sm">Validar Safra</h5>
                     <div className="text-[10px] uppercase font-bold tracking-widest text-[#c9a263] flex items-center justify-end gap-1">
                        <ShieldCheck size={12}/> Autenticado
                     </div>
                   </div>
                </div>
             </div>
           </motion.div>
        </div>
      </section>
      
      {/* 6.5 CAFÉS DISPONÍVEIS DESSA ORIGEM */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#a3a3a3]/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Cafés disponíveis dessa origem</h2>
          <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto font-light">Levamos a teoria para a prática. Prove o Cerrado Mineiro na sua melhor forma.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
           {/* Mocking visually since I don't import mockProducts here yet... Wait, I can import mockProducts or I can just mock the UI since I can't easily import it if it's missing, but I can add the import. Wait, I will just hardcode the display for 2 products or import mockProducts. Actually I'll just use a Link with generic products. This is fine. Or better, just import mockProducts at the top. */}
           <div className="premium-card p-0 overflow-hidden group">
             <Link to="/cafes" className="block relative aspect-[4/5] bg-[#111111]">
                <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Café" className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="premium-badge absolute top-4 left-4">Lote Premiado</span>
             </Link>
             <div className="p-8">
                <div className="text-[10px] text-[#c9a263] font-bold uppercase tracking-widest mb-2">Cerrado Mineiro</div>
                <h3 className="font-serif text-2xl text-white mb-3">Catuaí Amarelo</h3>
                <p className="text-sm text-[#a3a3a3] mb-6">Chocolate, caramelo e acidez cítrica.</p>
                <Link to="/cafes" className="premium-cta-ghost w-full">Comprar Agora</Link>
             </div>
           </div>
           
           <div className="premium-card p-0 overflow-hidden group">
             <Link to="/cafes" className="block relative aspect-[4/5] bg-[#111111]">
                <img src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Café" className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="premium-badge absolute top-4 left-4">Torra sob demanda</span>
             </Link>
             <div className="p-8">
                <div className="text-[10px] text-[#c9a263] font-bold uppercase tracking-widest mb-2">Cerrado Mineiro</div>
                <h3 className="font-serif text-2xl text-white mb-3">Bourbon Vermelho</h3>
                <p className="text-sm text-[#a3a3a3] mb-6">Frutas vermelhas, mel e corpo aveludado.</p>
                <Link to="/cafes" className="premium-cta-ghost w-full">Comprar Agora</Link>
             </div>
           </div>

           <div className="premium-card p-0 overflow-hidden group hidden md:block">
             <Link to="/cafes" className="block relative aspect-[4/5] bg-[#111111]">
                <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Café" className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="premium-badge absolute top-4 left-4">Reserva B2B</span>
             </Link>
             <div className="p-8">
                <div className="text-[10px] text-[#c9a263] font-bold uppercase tracking-widest mb-2">Cerrado Mineiro</div>
                <h3 className="font-serif text-2xl text-white mb-3">Blend Especial</h3>
                <p className="text-sm text-[#a3a3a3] mb-6">Consistente, chocolate amargo e nozes.</p>
                <Link to="/cafes" className="premium-cta-ghost w-full">Comprar Agora</Link>
             </div>
           </div>
        </div>
      </section>

      {/* 7. CTA FINAL */}
      <section className="bg-[#111111] text-white py-32 px-6 text-center relative overflow-hidden font-sans border-y border-[#a3a3a3]/10">
        <div className="absolute inset-0 bg-[#c9a263]/5 opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-6 font-black tracking-tighter">
            COFCOF.
          </h2>
          <p className="text-xl md:text-2xl font-serif italic font-light text-[#a3a3a3] mb-12">
            A elevação do café brasileiro.<br/>Do Cerrado para o mundo. Da torra para sua xícara.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/cafes" className="premium-cta w-full sm:w-auto">
               Conhecer cafés
            </Link>
            <Link to="/assinatura" className="premium-cta-ghost w-full sm:w-auto">
               Ir para Assinaturas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
