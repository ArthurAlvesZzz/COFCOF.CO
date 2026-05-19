import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockProducts } from '../data/seed';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, ChevronDown, Filter, X, Coffee, ArrowRight, Award, ScanLine, Flame, CheckCircle2, ChevronRight, MapPin, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { Product } from '../types';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('c') || 'all';
  
  const [method, setMethod] = useState('');
  const [taste, setTaste] = useState('');
  
  const { addItem } = useCartStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const clearGuidedChoice = () => {
    setMethod('');
    setTaste('');
  };

  const getFilteredProducts = () => {
    let filtered = [...mockProducts].filter(p => p.id !== 'kit-1'); // Exclude kit from grid as it has a dedicated section
    
    if (method === 'coado') {
      filtered = filtered.filter(p => !p.bestPreparation?.toLowerCase().includes('espresso') || p.cuppingScore! >= 87.5);
    } else if (method === 'espresso' || method === 'moka') {
      filtered = filtered.filter(p => p.roastLevel === 'média');
    }

    if (taste === 'doce') {
      filtered = filtered.filter(p => p.shortDescription.toLowerCase().includes('doce') || p.sensoryNotes.join(' ').toLowerCase().includes('doce'));
    } else if (taste === 'frutado' || taste === 'floral') {
      filtered = filtered.filter(p => p.roastLevel === 'clara' || p.cuppingScore! >= 88);
    } else if (taste === 'equilibrado' || taste === 'intenso') {
      filtered = filtered.filter(p => p.roastLevel === 'média');
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const kitProduct = mockProducts.find(p => p.id === 'kit-1');

  const scrollToCatalog = () => {
    document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqItems = [
    { q: "Qual café escolher na primeira compra?", a: "Sugerimos o Kit Primeira Xícara, que traz o Lote 01 e o Lote 05, cobrindo o clássico e o exótico para você comparar." },
    { q: "Qual a diferença entre os lotes?", a: "Eles vêm de produtores, altitudes e variedades diferentes. Tudo isso muda a doçura, o corpo e as notas que você sente na xícara." },
    { q: "O que significa SCA?", a: "É a pontuação da Specialty Coffee Association. Acima de 80 é especial. Nossos lotes vão de 86 a 88.5, o patamar dos melhores cafés do mundo." },
    { q: "O café vem em grão ou moído?", a: "Você pode escolher no momento da compra. Moemos no tamanho ideal para o seu método de preparo." },
    { q: "Quando o café é torrado?", a: "Na semana do envio. Não mantemos estoque antigo na prateleira. Você sempre recebe café fresco." },
    { q: "Qual é melhor para coado?", a: "Os lotes de torra clara (como o 01, 06, 07, 08) entregam muita complexidade no coado, mas todos os nossos lotes ficam excelentes." },
    { q: "Qual é melhor para espresso?", a: "Recomendamos os lotes de torra média (como o 03 e 04), que trazem mais corpo, doçura e crema." },
    { q: "Posso comprar um lote sem assinar?", a: "Sim, os cafés estão disponíveis para compra avulsa." },
    { q: "Como funciona a rastreabilidade QR?", a: "Todo pacote vem com um QR que leva você à história do produtor, pontuação do laudo e detalhes orgânicos daquele lote." },
  ];

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen font-sans overflow-x-hidden pt-32">
      
      {/* 1. HERO PREMIUM */}
      <section className="bg-[#111111] text-white pt-10 pb-24 px-6 relative border-b border-[#a3a3a3]/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Cafés Especiais CofCof" 
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
              Curadoria · Safra 25 · Cerrado Mineiro
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-6 leading-[1.1] tracking-tight">
              8 lotes premiados. <br />
              <span className="text-[#a3a3a3] italic font-light drop-shadow-sm">8 produtores do Cerrado.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#a3a3a3] mx-auto mb-10 leading-relaxed font-light max-w-3xl">
              Uma curadoria para escolher seu próximo café. Lotes selecionados pela Cup of Excellence, com origem rastreável, pontuação SCA, notas sensoriais reais e torra sob demanda.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button 
                onClick={scrollToCatalog}
                className="w-full sm:w-auto bg-[#c9a263] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold hover:bg-[#e0b875] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-sm"
              >
                Comprar cafés
              </button>
              <Link 
                to="/assinatura"
                className="w-full sm:w-auto border border-[#a3a3a3]/30 text-white bg-white/5 backdrop-blur-md px-8 py-4 rounded-xl font-medium hover:bg-white/10 hover:border-[#a3a3a3]/50 transition-colors uppercase text-sm flex items-center justify-center gap-2"
               >
                Entrar para o Clube
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-6 border-t border-white/10 mx-auto w-fit">
              <span className="flex items-center gap-2 text-[#c9a263]">86–88.5 SCA</span>
              <span className="flex items-center gap-2">Cup of Excellence</span>
              <span className="flex items-center gap-2">Cerrado Mineiro D.O.</span>
              <span className="flex items-center gap-2">Torra sob demanda</span>
              <span className="flex items-center gap-2">Rastreabilidade QR</span>
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
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><CheckCircle2 size={14} className="text-[#c9a263] mr-2"/> 86+ pts SCA</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><MapPin size={14} className="text-[#c9a263] mr-2"/> Cerrado Mineiro D.O.</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><Flame size={14} className="text-[#c9a263] mr-2"/> Torra sob demanda</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><ScanLine size={14} className="text-[#c9a263] mr-2"/> Rastreabilidade QR</div>
                <div className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium"><Coffee size={14} className="text-[#c9a263] mr-2"/> 8 produtores</div>
             </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. KIT PRIMEIRA XÍCARA */}
      {kitProduct && (
      <section className="bg-[#111111] py-24 px-6 border-b border-[#a3a3a3]/10 relative">
        <div className="absolute inset-0 bg-[#c9a263]/5 opacity-10 mix-blend-overlay"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
           <div className="order-2 md:order-1 relative aspect-[4/3] sm:aspect-square rounded-[2rem] overflow-hidden bg-[#1a1a1a] border border-[#a3a3a3]/10 group">
              <img src={kitProduct.image} alt={kitProduct.name} className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white z-20">
                 <span className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Best Seller</span>
                 <p className="text-xl md:text-2xl font-serif text-white">Lote 01 + Lote 05 + Guia</p>
              </div>
           </div>
           
           <div className="order-1 md:order-2">
             <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                Não sabe qual escolher?<br/>
                <span className="text-[#c9a263] italic font-light drop-shadow-sm">Comece pelo Kit Primeira Xícara.</span>
             </h2>
             <p className="text-[#a3a3a3] text-lg mb-8 leading-relaxed font-light">
               Uma seleção guiada para quem quer sentir a diferença do café especial sem precisar entender termos técnicos.
             </p>
             
             <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18}/> 2 pacotes de perfis diferentes (Frutado vs Clássico)</li>
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18}/> Guia rápido de notas sensoriais</li>
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18}/> Dicas para não errar no preparo</li>
             </ul>
             
             <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={(e) => { e.preventDefault(); addItem(kitProduct, kitProduct.formats[0], 1); }}
                  className="w-full sm:w-auto bg-[#c9a263] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold hover:bg-[#e0b875] transition-all uppercase text-sm tracking-wider"
                >
                  Começar pelo Kit — R$ {kitProduct.price.toFixed(2)}
                </button>
             </div>
           </div>
        </div>
      </section>
      )}

      {/* 4. ESCOLHA GUIADA & 5/6. ÍNDICE / GRADE */}
      <section id="catalog-grid" className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
           
           <aside className="w-full md:w-80 shrink-0 sticky top-28 space-y-8">
              
              {/* Me ajude a escolher */}
              <div className="bg-[#111111] border border-[#c9a263]/30 p-8 rounded-[2rem] shadow-[0_0_20px_rgba(201,162,99,0.05)]">
                 <h3 className="font-serif text-2xl text-white mb-2">Me ajude a escolher</h3>
                 <p className="text-sm text-[#a3a3a3] mb-6">Filtraremos os 8 lotes da curadoria para você.</p>
                 
                 <div className="space-y-6">
                    <div>
                       <label className="block text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mb-3">1. Como você prepara?</label>
                       <div className="flex flex-wrap gap-2">
                          {['coado', 'espresso', 'moka'].map(m => (
                             <button key={m} onClick={() => setMethod(method === m ? '' : m)} className={cn("px-4 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", method === m ? 'bg-[#c9a263] text-[#0a0a0a] border-[#c9a263]' : 'bg-[#1a1a1a] text-[#a3a3a3] border-[#a3a3a3]/10 hover:border-[#c9a263]/30')}>
                                {m}
                             </button>
                          ))}
                       </div>
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mb-3">2. O que você prefere?</label>
                       <div className="flex flex-wrap gap-2">
                          {['doce', 'frutado', 'floral', 'equilibrado', 'intenso'].map(t => (
                             <button key={t} onClick={() => setTaste(taste === t ? '' : t)} className={cn("px-4 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", taste === t ? 'bg-[#c9a263] text-[#0a0a0a] border-[#c9a263]' : 'bg-[#1a1a1a] text-[#a3a3a3] border-[#a3a3a3]/10 hover:border-[#c9a263]/30')}>
                                {t}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 {(method || taste) && (
                   <button onClick={clearGuidedChoice} className="w-full text-center text-xs uppercase font-bold text-[#a3a3a3] hover:text-white transition-colors mt-6 tracking-widest">Limpar escolha</button>
                 )}
              </div>

              {/* Índice Visual */}
              <div className="bg-[#111111] border border-[#a3a3a3]/10 p-8 rounded-[2rem]">
                 <h3 className="font-serif text-xl text-white mb-6 flex items-center gap-2"><Filter size={20} className="text-[#c9a263]"/> Índice de Lotes</h3>
                 <div className="space-y-3">
                    {mockProducts.filter(p=>p.id !== 'kit-1').map(p => (
                       <Link key={p.id} to={`/cafes/${p.slug}`} className="flex items-center gap-4 p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors group">
                          <span className="text-[#c9a263] font-serif text-lg w-6">{p.lot}</span>
                          <div className="flex-1">
                             <div className="text-white text-sm font-medium group-hover:text-[#c9a263] transition-colors">{p.variety}</div>
                             <div className="text-[#a3a3a3] text-[10px] uppercase tracking-widest">{p.cuppingScore} SCA</div>
                          </div>
                       </Link>
                    ))}
                 </div>
              </div>
           </aside>

           <div className="flex-1 w-full">
              
              <div className="mb-10 flex items-center justify-between pb-4 border-b border-[#a3a3a3]/10">
                 <h2 className="text-2xl font-serif text-white">
                   {method || taste ? 'Cafés indicados para você' : 'A Curadoria completa'}
                 </h2>
                 <span className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3]">{filteredProducts.length} lotes</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                 {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} addItem={addItem} />
                 ))}
                 
                 {filteredProducts.length === 0 && (
                    <div className="col-span-full py-24 text-center border border-[#a3a3a3]/10 rounded-3xl bg-[#111111]">
                       <Coffee className="mx-auto mb-6 text-[#a3a3a3]/30" size={48}/>
                       <h3 className="text-2xl font-serif text-white mb-4">Nenhum lote exato</h3>
                       <p className="text-sm text-[#a3a3a3] mb-8 max-w-sm mx-auto">Tente outra combinação de preparo e sabor ou fale conosco.</p>
                       <button onClick={clearGuidedChoice} className="bg-[#1a1a1a] border border-[#a3a3a3]/20 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-[#c9a263] transition-colors">Limpar filtros</button>
                    </div>
                 )}
              </div>
           </div>

        </div>
      </section>

      {/* 11. COMPARAÇÃO */}
      <section className="py-24 px-6 bg-[#111111] border-y border-[#a3a3a3]/10">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Não é só outro café na prateleira.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
               <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#a3a3a3]/10 opacity-70">
                 <h3 className="text-2xl font-serif text-[#a3a3a3] mb-8 pb-4 border-b border-[#a3a3a3]/20">Café comum</h3>
                 <ul className="space-y-6">
                    <li className="flex items-center gap-4 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Origem genérica ou "misturas"</li>
                    <li className="flex items-center gap-4 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Torra muito escura (esconde defeitos)</li>
                    <li className="flex items-center gap-4 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Meses envelhecendo na prateleira</li>
                    <li className="flex items-center gap-4 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Sem rastreabilidade</li>
                    <li className="flex items-center gap-4 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Amargor forte e adstringência</li>
                 </ul>
               </div>

               <div className="bg-[#0a0a0a] rounded-3xl p-8 lg:p-10 border border-[#c9a263]/30 shadow-[0_0_40px_rgba(201,162,99,0.05)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                     <Award size={100} className="text-[#c9a263]"/>
                 </div>
                 <h3 className="text-2xl font-serif text-white mb-8 pb-4 border-b border-[#c9a263]/30 text-[#c9a263] relative z-10">Lotes CofCof</h3>
                 <ul className="space-y-6 relative z-10">
                    <li className="flex items-center gap-4 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={20} /> Origem identificada (Produtor e Fazenda)</li>
                    <li className="flex items-center gap-4 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={20} /> Torra média-clara (Realça notas reais)</li>
                    <li className="flex items-center gap-4 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={20} /> Torrado na semana do envio</li>
                    <li className="flex items-center gap-4 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={20} /> Lote rastreável via QR Code</li>
                    <li className="flex items-center gap-4 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={20} /> 86 a 88.5 Pontos SCA (Doçura extrema)</li>
                 </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 12. TORRA SOB DEMANDA */}
      <section className="bg-[#0a0a0a] py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <Flame size={48} className="text-[#c9a263] mx-auto mb-8" strokeWidth={1} />
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">Café fresco muda tudo. <br/><span className="text-[#a3a3a3] font-light italic">Conheça a torra sob demanda.</span></h2>
            <p className="text-[#a3a3a3] text-lg lg:text-xl mb-16 font-light leading-relaxed">
               Na CofCof, o café não fica parado em estoque velho. Nosso Mestre de Torra acompanha os pedidos e torra os lotes sempre na semana do envio. A embalagem com válvula mantém o frescor e garante o descanso ideal no trajeto até a sua xícara.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-4 text-left md:text-center text-[#a3a3a3]">
               <div className="flex flex-col items-start md:items-center">
                  <span className="text-[#c9a263] font-serif text-4xl mb-4 block">1</span>
                  <p className="text-sm text-white font-bold uppercase tracking-widest mb-2">Pedido feito</p>
                  <p className="text-xs font-medium">Você escolhe ou recebe pelo Clube.</p>
               </div>
               <div className="flex flex-col items-start md:items-center">
                  <span className="text-[#c9a263] font-serif text-4xl mb-4 block">2</span>
                  <p className="text-sm text-white font-bold uppercase tracking-widest mb-2">Torras semanais</p>
                  <p className="text-xs font-medium">Lotes torrados toda semana.</p>
               </div>
               <div className="flex flex-col items-start md:items-center">
                  <span className="text-[#c9a263] font-serif text-4xl mb-4 block">3</span>
                  <p className="text-sm text-white font-bold uppercase tracking-widest mb-2">Descanso</p>
                  <p className="text-xs font-medium">O café "respira" (degassing) no pacote com válvula.</p>
               </div>
               <div className="flex flex-col items-start md:items-center">
                  <span className="text-[#c9a263] font-serif text-4xl mb-4 block">4</span>
                  <p className="text-sm text-white font-bold uppercase tracking-widest mb-2">Envio fresco</p>
                  <p className="text-xs font-medium">Chega no pico da qualidade sensorial.</p>
               </div>
            </div>
        </div>
      </section>

      {/* 13. CLUBE UPSELL */}
      <section className="bg-[#111111] border-y border-[#a3a3a3]/10 py-32 px-6 relative">
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <Package size={48} className="text-[#c9a263] mx-auto mb-8" strokeWidth={1} />
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-6">Quer receber a curadoria sem escolher todo mês?</h2>
            <p className="text-[#a3a3a3] text-lg mb-12 font-light leading-relaxed max-w-2xl mx-auto">
               O Clube CofCof entrega lotes selecionados, torrados sob demanda, com origem rastreável e notas sensoriais reais direto na sua casa. Pause ou cancele quando quiser.
            </p>
            <Link to="/assinatura" className="inline-flex items-center justify-center gap-3 bg-[#c9a263] text-[#0a0a0a] px-10 py-5 rounded-xl font-bold hover:bg-[#e0b875] transition-all shadow-[0_10px_25px_rgba(201,162,99,0.3)] hover:scale-[1.02] active:scale-[0.98] uppercase text-sm tracking-wider w-full sm:w-auto">
               Entrar para o Clube <ArrowRight size={18}/>
            </Link>
         </div>
      </section>

      {/* 14. FAQ */}
      <section className="py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Dúvidas sobre os Cafés</h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <div key={idx} className="bg-[#111111] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 lg:p-8 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <h3 className="font-serif text-lg text-white pr-8">{faq.q}</h3>
                  <ChevronDown size={20} className={`text-[#c9a263] transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="p-6 lg:p-8 pt-0 text-[#a3a3a3] font-light leading-relaxed border-t border-[#a3a3a3]/10 mt-2 bg-[#111111]/50">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        
        {/* 15. CTA FINAL */}
        <div className="max-w-4xl mx-auto text-center border-t border-[#a3a3a3]/10 pt-24">
           <h2 className="text-4xl md:text-6xl font-serif text-white mb-10 leading-tight">
              Escolha seu próximo café com <span className="text-[#c9a263] italic font-light drop-shadow-sm">origem, torra e história.</span>
           </h2>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={scrollToCatalog} className="bg-[#c9a263] text-[#0a0a0a] px-10 py-5 rounded-xl font-bold hover:bg-[#e0b875] uppercase text-sm tracking-wider transition-all hover:scale-[1.02]">Comprar cafés</button>
              <Link to="/assinatura" className="border border-[#a3a3a3]/30 bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-xl font-bold hover:bg-white/10 uppercase text-sm tracking-wider transition-colors">Entrar para o Clube</Link>
           </div>
        </div>
      </section>

    </div>
  );
}

// Subcomponents
const ProductCard: React.FC<{ product: Product, addItem: any }> = ({ product, addItem }) => {
   if(product.id === 'kit-1') return null;

   const flavorSummaryMessage = product.shortDescription;

   return (
      <div className="group bg-[#111111] border border-[#a3a3a3]/10 rounded-3xl overflow-hidden hover:border-[#c9a263]/30 hover:shadow-[0_15px_30px_rgba(201,162,99,0.1)] transition-all duration-300 flex flex-col items-start hover:-translate-y-1">
         <Link to={`/cafes/${product.slug}`} className="block relative w-full aspect-[4/3] bg-[#0a0a0a] overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent"></div>
            
            <div className="absolute top-6 left-6 z-20 flex flex-col items-start gap-2 max-w-[80%]">
               {product.isAwardWinning && <span className="bg-[#c9a263] text-[#0a0a0a] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Lote Premiado</span>}
               {product.cuppingScore && <span className="bg-[#0a0a0a]/80 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{product.cuppingScore} SCA</span>}
            </div>
         </Link>

         <div className="p-8 flex flex-col flex-1 w-full bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
            {/* Camada simples vs técnica */}
            <div className="mb-6">
               <div className="text-[#c9a263] text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>Lote {product.lot || '00'}</span>
                  <span className="w-1 h-1 bg-[#c9a263]/50 rounded-full"></span>
                  <span className="truncate">{product.variety}</span>
               </div>
               <h3 className="font-serif text-3xl text-white mb-3 leading-tight group-hover:text-[#c9a263] transition-colors">{product.name}</h3>
               
               {/* Camada Simples */}
               <p className="text-[#a3a3a3] text-sm mb-6 leading-relaxed line-clamp-2 font-light">{flavorSummaryMessage}</p>

               {/* Camada Técnica (mini) */}
               <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#a3a3a3]/10">
                  <ul className="grid grid-cols-2 gap-y-4 gap-x-2 text-[10px] text-[#a3a3a3] uppercase tracking-widest">
                     <li><span className="font-bold text-white block mb-1">SCA</span> {product.cuppingScore || '-'}</li>
                     <li><span className="font-bold text-white block mb-1">Processo</span> <span className="truncate block font-medium text-[#c9a263]">{product.process || '-'}</span></li>
                     <li><span className="font-bold text-white block mb-1">Produtor</span> <span className="truncate block font-medium">{product.producer || '-'}</span></li>
                     <li><span className="font-bold text-white block mb-1">Torra</span> <span className="truncate block font-medium">{product.roastLevel || '-'}</span></li>
                  </ul>
               </div>
            </div>

            <div className="mt-auto border-t border-[#a3a3a3]/10 pt-6 flex flex-col gap-5 w-full">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#a3a3a3] text-[10px] bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-[#a3a3a3]/10">
                     <ScanLine size={12} className="text-[#c9a263]"/>
                     <span className="uppercase tracking-widest font-bold">Rastreável</span>
                  </div>
                  <div className="text-2xl font-serif text-white">R$ {product.price.toFixed(2)}</div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <button 
                     onClick={(e) => { e.preventDefault(); addItem(product, product.formats[0], 1); }}
                     className="bg-[#c9a263] text-[#0a0a0a] py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#e0b875] transition-all flex justify-center items-center gap-2"
                  >
                     <ShoppingBag size={16}/> Comprar
                  </button>
                  <Link 
                     to={`/cafes/${product.slug}`}
                     className="bg-transparent border border-[#a3a3a3]/30 text-white py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-[#c9a263] hover:text-[#c9a263] transition-all flex justify-center items-center"
                  >
                     Ver dossiê
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
