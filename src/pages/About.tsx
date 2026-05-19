import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, Award, Search, Sparkles, Building2, MapPin, ArrowRight, ScanLine, Flame, CheckCircle2, ChevronRight, Fingerprint } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen font-sans overflow-x-hidden pt-32">
      
      {/* 1. HERO MANIFESTO */}
      <section className="bg-[#111111] text-white pt-10 pb-24 px-6 relative border-b border-[#a3a3a3]/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="CofCof Manifesto" 
              className="w-full h-full object-cover opacity-10 mix-blend-lighten" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 mb-8 text-[11px] font-bold tracking-widest uppercase bg-[#c9a263]/10 backdrop-blur-md">
              Quem somos · Origem · Propósito
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-6 leading-[1.1] tracking-tight">
              O Brasil produz cafés extraordinários. <br />
              <span className="text-[#a3a3a3] italic font-light drop-shadow-sm">A CofCof nasceu para colocar essa qualidade na sua xícara.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#a3a3a3] mx-auto mb-10 leading-relaxed font-light max-w-3xl">
              Selecionamos microlotes premiados do Cerrado Mineiro, com origem rastreável, pontuação SCA, torra sob demanda e relação direta com produtores.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/cafes')}
                className="w-full sm:w-auto bg-[#c9a263] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold hover:bg-[#e0b875] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-sm"
              >
                Ver cafés
              </button>
              <button 
                onClick={() => document.getElementById('resposta')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto border border-[#a3a3a3]/30 text-white bg-white/5 backdrop-blur-md px-8 py-4 rounded-xl font-medium hover:bg-white/10 hover:border-[#a3a3a3]/50 transition-colors uppercase text-sm flex items-center justify-center gap-2"
               >
                Conhecer a curadoria
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FAIXA DE PROVAS */}
      <div className="bg-[#0a0a0a] overflow-hidden border-b border-[#a3a3a3]/10 py-4">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] min-w-max">
          {[...Array(3)].map((_, i) => (
             <React.Fragment key={i}>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><Award size={14} className="text-[#c9a263] mr-2"/> Cup of Excellence</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><MapPin size={14} className="text-[#c9a263] mr-2"/> Cerrado Mineiro D.O.</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><CheckCircle2 size={14} className="text-[#c9a263] mr-2"/> 86+ pts SCA</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><Sparkles size={14} className="text-[#c9a263] mr-2"/> Nascida em 2023 no Cerrado Mineiro</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><MapPin size={14} className="text-[#c9a263] mr-2"/> Patrocínio/MG</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><Coffee size={14} className="text-[#c9a263] mr-2"/> 8 produtores</div>
             </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. CAPÍTULO 01 - O PROBLEMA */}
      <section className="py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-10 leading-tight">
               O problema não é falta de café. <br/>
               <span className="text-[#c9a263] italic font-light">É falta de origem clara.</span>
            </h2>
            <div className="prose prose-invert prose-lg mx-auto text-left md:text-center">
               <p className="text-[#a3a3a3] font-light leading-relaxed mb-8">
                  O Brasil produz cafés extraordinários, mas grande parte do consumidor ainda compra sem saber origem, safra, produtor, torra ou rastreabilidade.
               </p>
               <p className="text-[#a3a3a3] font-light leading-relaxed">
                  Dados públicos e fiscalizações recentes mostram que o mercado ainda enfrenta problemas de adulteração e falta de transparência. A CofCof nasceu para seguir o caminho oposto: <strong>origem, lote, produtor e rastreio.</strong>
               </p>
            </div>
        </div>
      </section>

      {/* 4. CAPÍTULO 02 - A RESPOSTA COFCOF */}
      <section id="resposta" className="py-32 px-6 bg-[#F6F1EB] text-[#160F0A]">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Café com nome, sobrenome,<br/> <span className="italic font-light">fazenda e rastreio.</span></h2>
               <p className="text-lg md:text-xl font-light max-w-3xl mx-auto opacity-80 leading-relaxed">
                  Cada lote CofCof nasce de uma escolha: mostrar de onde vem, quem produziu, como foi avaliado e quando foi torrado.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               
               <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#160F0A]/5 hover:-translate-y-1 transition-transform">
                  <Fingerprint size={32} className="text-[#B06A32] mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-serif mb-4">Produtor identificado</h3>
                  <p className="opacity-80 leading-relaxed text-sm">Cada lote tem produtor, fazenda e origem rastreável.</p>
               </div>

               <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#160F0A]/5 hover:-translate-y-1 transition-transform">
                  <Award size={32} className="text-[#B06A32] mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-serif mb-4">Pontuação SCA</h3>
                  <p className="opacity-80 leading-relaxed text-sm">Cafés acima de 86 pontos, avaliados por critérios internacionais.</p>
               </div>

               <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#160F0A]/5 hover:-translate-y-1 transition-transform">
                  <Flame size={32} className="text-[#B06A32] mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-serif mb-4">Torra sob demanda</h3>
                  <p className="opacity-80 leading-relaxed text-sm">Torra feita na semana do envio para preservar aroma, doçura e complexidade.</p>
               </div>

               <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#160F0A]/5 hover:-translate-y-1 transition-transform">
                  <ScanLine size={32} className="text-[#B06A32] mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-serif mb-4">Rastreabilidade QR</h3>
                  <p className="opacity-80 leading-relaxed text-sm">Origem, safra, processo e lote disponíveis para consulta.</p>
               </div>

               <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#160F0A]/5 hover:-translate-y-1 transition-transform">
                  <MapPin size={32} className="text-[#B06A32] mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-serif mb-4">Cerrado Mineiro D.O.</h3>
                  <p className="opacity-80 leading-relaxed text-sm">Uma região reconhecida por identidade, origem e qualidade.</p>
               </div>

               <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#160F0A]/5 hover:-translate-y-1 transition-transform">
                  <Sparkles size={32} className="text-[#B06A32] mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-serif mb-4">Cup of Excellence</h3>
                  <p className="opacity-80 leading-relaxed text-sm">Microlotes selecionados entre produtores premiados.</p>
               </div>

            </div>
         </div>
      </section>

      {/* 5. BLOCO DE NÚMEROS / PROVAS */}
      <section className="py-24 bg-[#111111] border-b border-[#a3a3a3]/10 px-6">
         <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 text-center">
               
               <div>
                  <div className="font-serif text-5xl md:text-6xl text-[#c9a263] mb-4">86+</div>
                  <div className="text-white text-sm font-bold uppercase tracking-widest mb-2">Pontuação SCA</div>
                  <div className="text-[#a3a3a3] text-xs font-light">Mínima dos lotes selecionados.</div>
               </div>

               <div>
                  <div className="font-serif text-5xl md:text-6xl text-[#c9a263] mb-4">8</div>
                  <div className="text-white text-sm font-bold uppercase tracking-widest mb-2">Microlotes</div>
                  <div className="text-[#a3a3a3] text-xs font-light">Por curadoria sazonal.</div>
               </div>

               <div>
                  <div className="font-serif text-5xl md:text-6xl text-[#c9a263] mb-4">COE</div>
                  <div className="text-white text-sm font-bold uppercase tracking-widest mb-2">Premiados</div>
                  <div className="text-[#a3a3a3] text-xs font-light">Produtores Cup of Excellence.</div>
               </div>

               <div>
                  <div className="font-serif text-5xl md:text-6xl text-[#c9a263] mb-4">D.O.</div>
                  <div className="text-white text-sm font-bold uppercase tracking-widest mb-2">Cerrado</div>
                  <div className="text-[#a3a3a3] text-xs font-light">Denominação de Origem.</div>
               </div>
               
               <div>
                  <div className="font-serif text-5xl md:text-6xl text-[#c9a263] mb-4">100%</div>
                  <div className="text-white text-sm font-bold uppercase tracking-widest mb-2">Arábica</div>
                  <div className="text-[#a3a3a3] text-xs font-light">Puro e sem misturas.</div>
               </div>

               <div>
                  <div className="font-serif text-5xl md:text-6xl text-[#c9a263] mb-4">7 <span className="text-3xl">dias</span></div>
                  <div className="text-white text-sm font-bold uppercase tracking-widest mb-2">Torra sob demanda</div>
                  <div className="text-[#a3a3a3] text-xs font-light">Janela de torra e envio.</div>
               </div>

               <div>
                  <div className="font-serif text-5xl md:text-6xl text-[#c9a263] mb-4">QR</div>
                  <div className="text-white text-sm font-bold uppercase tracking-widest mb-2">Rastreio</div>
                  <div className="text-[#a3a3a3] text-xs font-light">Dados por lote.</div>
               </div>

               <div>
                  <div className="font-serif text-5xl md:text-6xl text-[#c9a263] mb-4">2023</div>
                  <div className="text-white text-sm font-bold uppercase tracking-widest mb-2">Patrocínio</div>
                  <div className="text-[#a3a3a3] text-xs font-light">Início da marca em MG.</div>
               </div>

            </div>
         </div>
      </section>

      {/* 6. NOSSA HISTÓRIA (Timeline) */}
      <section className="py-32 px-6 bg-[#0a0a0a]">
         <div className="max-w-3xl mx-auto">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Nossa história</h2>
               <p className="text-xl text-[#a3a3a3] font-light italic">Do Cerrado Mineiro para a sua xícara.</p>
            </div>

            <div className="relative border-l border-[#c9a263]/30 ml-4 md:ml-0 md:mx-auto">
               
               {/* 2020 */}
               <div className="relative pl-10 md:pl-0 mb-16 md:w-1/2 md:-left-[1px] md:pr-12 md:text-right md:ml-0 group">
                  <div className="hidden md:block absolute top-0 -right-[7px] w-3 h-3 bg-[#0a0a0a] border-2 border-[#c9a263] rounded-full group-hover:bg-[#c9a263] transition-colors z-10" />
                  <div className="md:hidden absolute top-0 -left-[7px] w-3 h-3 bg-[#0a0a0a] border-2 border-[#c9a263] rounded-full group-hover:bg-[#c9a263] transition-colors z-10" />
                  <div className="text-[#c9a263] font-serif text-3xl mb-4">2020</div>
                  <h3 className="text-xl text-white font-serif mb-4">O despertar</h3>
                  <p className="text-[#a3a3a3] font-light leading-relaxed text-sm">O retorno ao Brasil trouxe uma inquietação: por que o país que produz café excepcional consome tão pouco café rastreável?</p>
               </div>

               {/* 2021-2022 */}
               <div className="relative pl-10 md:pl-12 mb-16 md:w-1/2 md:ml-auto group">
                  <div className="absolute top-0 -left-[7px] w-3 h-3 bg-[#0a0a0a] border-2 border-[#c9a263] rounded-full group-hover:bg-[#c9a263] transition-colors z-10" />
                  <div className="text-[#c9a263] font-serif text-3xl mb-4">2021–2022</div>
                  <h3 className="text-xl text-white font-serif mb-4">Imersão no café especial</h3>
                  <p className="text-[#a3a3a3] font-light leading-relaxed text-sm">Treinamentos, visitas a fazendas e intenso relacionamento com produtores do Cerrado Mineiro.</p>
               </div>

               {/* 2023 */}
               <div className="relative pl-10 md:pl-0 mb-16 md:w-1/2 md:-left-[1px] md:pr-12 md:text-right md:ml-0 group">
                  <div className="hidden md:block absolute top-0 -right-[7px] w-3 h-3 bg-[#0a0a0a] border-2 border-[#c9a263] rounded-full group-hover:bg-[#c9a263] transition-colors z-10" />
                  <div className="md:hidden absolute top-0 -left-[7px] w-3 h-3 bg-[#0a0a0a] border-2 border-[#c9a263] rounded-full group-hover:bg-[#c9a263] transition-colors z-10" />
                  <div className="text-[#c9a263] font-serif text-3xl mb-4">2023</div>
                  <h3 className="text-xl text-white font-serif mb-4">Nasce a CofCof</h3>
                  <p className="text-[#a3a3a3] font-light leading-relaxed text-sm">Primeiros lotes selecionados e início estrutural da operação de curadoria e assinatura.</p>
               </div>

               {/* 2024 */}
               <div className="relative pl-10 md:pl-12 mb-16 md:w-1/2 md:ml-auto group">
                  <div className="absolute top-0 -left-[7px] w-3 h-3 bg-[#0a0a0a] border-2 border-[#c9a263] rounded-full group-hover:bg-[#c9a263] transition-colors z-10" />
                  <div className="text-[#c9a263] font-serif text-3xl mb-4">2024</div>
                  <h3 className="text-xl text-white font-serif mb-4">Transparência como missão</h3>
                  <p className="text-[#a3a3a3] font-light leading-relaxed text-sm">O debate sobre adulteração e rastreabilidade reforça a nossa necessidade de manter uma origem limpa e clara.</p>
               </div>

               {/* 2025 */}
               <div className="relative pl-10 md:pl-0 md:w-1/2 md:-left-[1px] md:pr-12 md:text-right md:ml-0 group">
                  <div className="hidden md:block absolute top-0 -right-[7px] w-3 h-3 bg-[#0a0a0a] border-2 border-[#c9a263] rounded-full group-hover:bg-[#c9a263] transition-colors z-10" />
                  <div className="md:hidden absolute top-0 -left-[7px] w-3 h-3 bg-[#0a0a0a] border-2 border-[#c9a263] rounded-full group-hover:bg-[#c9a263] transition-colors z-10" />
                  <div className="text-[#c9a263] font-serif text-3xl mb-4">2025</div>
                  <h3 className="text-xl text-white font-serif mb-4">Plataforma e expansão</h3>
                  <p className="text-[#a3a3a3] font-light leading-relaxed text-sm">Lançamento digital robusto, parceiros e a rastreabilidade QR consolidada como a base da nossa experiência.</p>
               </div>

            </div>
         </div>
      </section>

      {/* 7. PRINCÍPIOS */}
      <section className="py-32 px-6 bg-[#111111] border-y border-[#a3a3a3]/10">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">O que guia cada decisão da CofCof.</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               
               <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#a3a3a3]/10">
                  <h3 className="font-serif text-xl text-white mb-4">Transparência radical</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed font-light">Cada lote informa produtor, fazenda, altitude, processo, safra, pontuação e rastreio.</p>
               </div>

               <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#a3a3a3]/10">
                  <h3 className="font-serif text-xl text-white mb-4">Qualidade sem concessão</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed font-light">Selecionamos cafés especiais com pontuação SCA elevada e origem reconhecida.</p>
               </div>

               <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#a3a3a3]/10">
                  <h3 className="font-serif text-xl text-white mb-4">Frescor como regra</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed font-light">A torra acontece sob demanda, para preservar aroma, doçura e complexidade.</p>
               </div>

               <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#a3a3a3]/10">
                  <h3 className="font-serif text-xl text-white mb-4">Produtor valorizado</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed font-light">Relação direta com quem cultiva cafés premiados no Cerrado Mineiro.</p>
               </div>

               <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#a3a3a3]/10">
                  <h3 className="font-serif text-xl text-white mb-4">Café puro e rastreável</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed font-light">Café arábica de verdade, origem clara e composição transparente.</p>
               </div>

               <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#a3a3a3]/10">
                  <h3 className="font-serif text-xl text-white mb-4">Cerrado Mineiro</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed font-light">Nossa identidade nasce de um terroir com forte Denominação de Origem.</p>
               </div>

            </div>
         </div>
      </section>

      {/* 8. ORIGEM CERRADO MINEIRO */}
      <section className="py-32 bg-[#0a0a0a] px-6 relative overflow-hidden">
         <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2">
               <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                  Cerrado Mineiro:<br/>
                  <span className="text-[#c9a263] italic font-light">a origem que assina nossos cafés.</span>
               </h2>
               <p className="text-lg text-[#a3a3a3] mb-12 font-light leading-relaxed">
                  Uma região de altitude, inverno seco, verão chuvoso e Denominação de Origem reconhecida mundialmente pela qualidade dos grãos.
               </p>

               <div className="grid grid-cols-2 gap-4 mb-12">
                  <div className="bg-[#111111] border border-[#a3a3a3]/10 p-5 rounded-2xl">
                     <span className="block text-[10px] text-[#a3a3a3] uppercase tracking-widest font-bold mb-2">Altitude</span>
                     <span className="text-white font-medium">800–1.300m</span>
                  </div>
                  <div className="bg-[#111111] border border-[#a3a3a3]/10 p-5 rounded-2xl">
                     <span className="block text-[10px] text-[#a3a3a3] uppercase tracking-widest font-bold mb-2">Clima</span>
                     <span className="text-white font-medium">Verão chuvoso, Inverno seco</span>
                  </div>
                  <div className="bg-[#111111] border border-[#a3a3a3]/10 p-5 rounded-2xl">
                     <span className="block text-[10px] text-[#a3a3a3] uppercase tracking-widest font-bold mb-2">Certificação</span>
                     <span className="text-white font-medium">D.O. Cerrado Mineiro</span>
                  </div>
                  <div className="bg-[#111111] border border-[#a3a3a3]/10 p-5 rounded-2xl">
                     <span className="block text-[10px] text-[#a3a3a3] uppercase tracking-widest font-bold mb-2">Perfil</span>
                     <span className="text-white font-medium">Doçura natural e corpo aveludado</span>
                  </div>
               </div>

               <p className="text-[#a3a3a3] font-light mb-10 italic">
                  Todos os lotes CofCof são selecionados dentro dessa lógica: origem clara, produtor identificado e rastreabilidade.
               </p>

               <button onClick={() => navigate('/origem')} className="inline-flex items-center gap-3 bg-[#1a1a1a] text-white border border-[#a3a3a3]/20 px-8 py-4 rounded-xl font-bold hover:border-[#c9a263] hover:text-[#c9a263] transition-colors uppercase text-sm tracking-wider">
                  Conhecer o Cerrado Mineiro <ChevronRight size={18} />
               </button>
            </div>

            <div className="lg:w-1/2 w-full mt-12 lg:mt-0 relative">
               <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-[#111111] border border-[#a3a3a3]/10">
                   <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80" alt="Cerrado Mineiro" className="w-full h-full object-cover opacity-80 mix-blend-lighten" />
               </div>
               <div className="absolute -bottom-8 -left-8 bg-[#111111] border border-[#c9a263]/30 p-8 rounded-3xl max-w-xs shadow-2xl">
                  <MapPin size={32} className="text-[#c9a263] mb-4" />
                  <p className="text-white font-serif text-lg leading-snug">O primeiro terroir protegido do Brasil.</p>
               </div>
            </div>

         </div>
      </section>

      {/* 9. CTA FINAL */}
      <section className="py-32 px-6 bg-[#111111] text-center border-t border-[#a3a3a3]/10">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
               Agora que você conhece a origem,<br/> <span className="text-[#c9a263] italic font-light">escolha o próximo café.</span>
            </h2>
            <p className="text-lg text-[#a3a3a3] mb-12 font-light">
               Oito produtores, microlotes premiados, torra sob demanda e rastreio por lote.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/cafes')}
                className="bg-[#c9a263] text-[#0a0a0a] px-10 py-5 rounded-xl font-bold hover:bg-[#e0b875] hover:scale-[1.02] transition-all uppercase text-sm tracking-wider"
              >
                Ver cafés
              </button>
              <button 
                onClick={() => navigate('/assinatura')}
                className="border border-[#a3a3a3]/30 bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-xl font-bold hover:bg-white/10 transition-colors uppercase text-sm tracking-wider"
               >
                Entrar para o Clube
              </button>
            </div>
         </div>
      </section>

    </div>
  );
}
