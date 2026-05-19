import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockProducts } from '../data/seed';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, ChevronDown, Filter, X, Coffee, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Product } from '../types';

const FILTER_FORMATOS = [
  { value: 'all', label: 'Todos' },
  { value: 'grão', label: 'Grão' },
  { value: 'moído', label: 'Moído' },
  { value: 'cápsula', label: 'Cápsula' },
  { value: 'b2b', label: 'Empresas' }
];

const FILTER_TORRAS = [
  { value: 'all', label: 'Todas' },
  { value: 'clara', label: 'Clara' },
  { value: 'média', label: 'Média' },
  { value: 'escura', label: 'Escura' }
];

const FILTER_SABORES = [
  { value: 'all', label: 'Todos' },
  { value: 'doce', label: 'Mais doce' },
  { value: 'menos-amargo', label: 'Menos amargo' },
  { value: 'frutado', label: 'Frutado' },
  { value: 'chocolate', label: 'Chocolate/Caramelo' },
  { value: 'encorpado', label: 'Encorpado' },
  { value: 'baixa-acidez', label: 'Baixa acidez' },
  { value: 'exotico', label: 'Mais premiado' }
];

const FILTER_OCASIAO = [
  { value: 'all', label: 'Todos' },
  { value: 'iniciante', label: 'Primeira compra' },
  { value: 'coado', label: 'Para coado' },
  { value: 'espresso', label: 'Para espresso' },
  { value: 'presente', label: 'Para presente' },
  { value: 'escritorio', label: 'Escritório' },
  { value: 'revenda', label: 'Revenda/B2B' }
];

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void, isSmall?: boolean }> = ({ label, active, onClick, isSmall }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "rounded-full font-medium transition-all duration-200 border whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#c9a263]/50",
      active 
        ? "bg-[#c9a263] text-[#0a0a0a] border-[#c9a263] shadow-[0_4px_10px_rgba(201,162,99,0.3)]"
        : "bg-[#111111] text-[#a3a3a3] border-[#a3a3a3]/10 hover:border-[#c9a263]/50 hover:bg-[#1a1a1a] hover:text-white",
      isSmall ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm"
    )}
  >
    {label}
  </button>
);

const ProductImageWithFallback = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div className={cn("bg-[#111111] flex flex-col items-center justify-center p-8 text-[#a3a3a3] border-b border-[#a3a3a3]/10", className)}>
         <Coffee size={40} className="mb-3 opacity-50 text-[#c9a263]" />
         <span className="text-[10px] uppercase tracking-widest font-bold text-[#a3a3a3]/40">Lote CofCof</span>
      </div>
    );
  }
  
  return <img src={src} alt={alt} onError={() => setError(true)} className={className} />;
};

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('c') || 'all';
  
  const [category, setCategory] = useState<string>(initialCategory);
  const [roast, setRoast] = useState<string>('all');
  const [flavorProfile, setFlavorProfile] = useState<string>('all');
  const [idealFor, setIdealFor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('destaques');
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileFiltersOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileFiltersOpen]);

  const activeFiltersCount = 
    (category !== 'all' ? 1 : 0) + 
    (roast !== 'all' ? 1 : 0) + 
    (flavorProfile !== 'all' ? 1 : 0) + 
    (idealFor !== 'all' ? 1 : 0);

  const getActiveFilterLabels = () => {
    const active = [];
    if (category !== 'all') active.push(FILTER_FORMATOS.find(f => f.value === category)?.label);
    if (roast !== 'all') active.push(FILTER_TORRAS.find(f => f.value === roast)?.label);
    if (flavorProfile !== 'all') active.push(FILTER_SABORES.find(f => f.value === flavorProfile)?.label);
    if (idealFor !== 'all') active.push(FILTER_OCASIAO.find(f => f.value === idealFor)?.label);
    return active.filter(Boolean) as string[];
  };
  
  const activeLabels = getActiveFilterLabels();

  const clearFilters = () => {
    setCategory('all');
    setRoast('all');
    setFlavorProfile('all');
    setIdealFor('all');
  };

  const filteredProducts = mockProducts.filter(p => {
    // FORMATO
    if (category !== 'all') {
      if (category === 'b2b' && !p.category.includes('b2b')) return false;
      if (category !== 'b2b' && p.category !== category) return false;
    }
    
    // TORRA
    if (roast !== 'all' && p.roastLevel !== roast) return false;
    
    // SABOR (Mock Logic)
    if (flavorProfile !== 'all') {
       const text = (((p.sensoryNotes || []).join(' ')) + ' ' + (p.shortDescription || '')).toLowerCase();
       if (flavorProfile === 'doce' && !text.includes('mel') && !text.includes('doce') && !text.includes('caramelo')) return false;
       if (flavorProfile === 'frutado' && !text.includes('frut') && !text.includes('cítric') && !text.includes('laranja') && !text.includes('morango')) return false;
       if (flavorProfile === 'chocolate' && !text.includes('chocolat') && !text.includes('cacau') && !text.includes('caramel')) return false;
       if (flavorProfile === 'encorpado' && !text.includes('corpo')) return false;
       if (flavorProfile === 'baixa-acidez' && text.includes('acidez brilhante')) return false;
       if (flavorProfile === 'exotico' && !p.isAwardWinning && !text.includes('raro') && !text.includes('exótico')) return false;
    }

    // OCASIÃO (Mock Logic)
    if (idealFor !== 'all') {
       if (idealFor === 'iniciante' && p.roastLevel === 'clara') return false; 
       if (idealFor === 'presente' && p.price < 60 && !p.isAwardWinning) return false;
       if (idealFor === 'espresso' && p.roastLevel === 'clara') return false;
       if (idealFor === 'coado' && p.roastLevel === 'escura') return false;
       if (idealFor === 'escritorio' && p.price > 80) return false;
       if (idealFor === 'revenda' && !p.category.includes('b2b')) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'menor_preco') return a.price - b.price;
    if (sortBy === 'maior_preco') return b.price - a.price;
    if (sortBy === 'mais_premiados') return (b.isAwardWinning ? 1 : 0) - (a.isAwardWinning ? 1 : 0);
    return 0; // destaques
  });

  const renderFilters = () => (
    <div className="space-y-8">
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-4">Formato</h4>
        <div className="flex flex-wrap gap-2">
          {FILTER_FORMATOS.map(f => (
            <FilterChip key={f.value} label={f.label} active={category === f.value} onClick={() => setCategory(f.value)} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-4">Torra</h4>
        <div className="flex flex-wrap gap-2">
          {FILTER_TORRAS.map(f => (
            <FilterChip key={f.value} label={f.label} active={roast === f.value} onClick={() => setRoast(f.value)} />
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-4">Perfil de Sabor</h4>
        <div className="flex flex-wrap gap-2">
          {FILTER_SABORES.map(f => (
            <FilterChip key={f.value} label={f.label} active={flavorProfile === f.value} onClick={() => setFlavorProfile(f.value)} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-4">Ideal Para</h4>
        <div className="flex flex-wrap gap-2">
          {FILTER_OCASIAO.map(f => (
            <FilterChip key={f.value} label={f.label} active={idealFor === f.value} onClick={() => setIdealFor(f.value)} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen pb-24 pt-32">
      {/* HEADER */}
      <section className="premium-container mt-0 mb-12 border-none">
        
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left py-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl font-serif mb-6 leading-tight text-white"
          >
            Cafés <span className="text-[#c9a263] italic font-light">CofCof</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-[#a3a3a3] max-w-2xl font-light mb-4"
          >
            Escolha por origem, torra, perfil sensorial ou ocasião.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-sm text-[#a3a3a3]/70 max-w-2xl"
          >
             Lotes selecionados, torra sob demanda e curadoria para diferentes momentos de consumo.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex flex-col gap-4 mb-8">
          <div className="flex justify-between items-center premium-card !p-4">
            <span className="font-medium text-white">{sortedProducts.length} cafés</span>
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 bg-[#c9a263] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-bold shadow-[0_4px_10px_rgba(201,162,99,0.3)]"
            >
              <Filter size={16} /> Filtrar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
          
          <div className="relative">
             <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-[#111111] border border-[#a3a3a3]/10 rounded-2xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#c9a263]/30 font-medium text-[#a3a3a3] shadow-sm"
                aria-label="Ordenar produtos"
              >
                <option value="destaques">Ordenar por: Destaques</option>
                <option value="menor_preco">Menor Preço</option>
                <option value="maior_preco">Maior Preço</option>
                <option value="mais_premiados">Mais Premiados</option>
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a3a3a3]" size={16} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-14 items-start">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block w-80 shrink-0 sticky top-28">
            <div className="premium-card p-8 mb-6 border-[#c9a263]/30 bg-[#1a1a1a]">
               <h3 className="font-serif text-xl mb-2 text-white text-center">Não sabe qual escolher?</h3>
               <p className="text-sm text-[#a3a3a3] leading-relaxed text-center mb-6">Descubra seu café ideal em 30 segundos.</p>
               <button 
                  onClick={() => { setIdealFor('iniciante'); setFlavorProfile('doce'); setCategory('moído') }}
                  className="premium-cta w-full flex justify-center uppercase text-[10px] tracking-widest py-3"
               >
                  Ver cafés indicados
               </button>
            </div>
            
            <div className="premium-card p-8">
              <div className="mb-8">
                <h3 className="font-serif text-2xl mb-2 text-white">Encontre seu café</h3>
                <p className="text-sm text-[#a3a3a3] leading-relaxed">Filtre por preparo, torra, sabor e ocasião.</p>
              </div>

              {activeLabels.length > 0 && (
                <div className="mb-8 pb-6 border-b border-[#a3a3a3]/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3]">Filtros ativos</span>
                    <button 
                      onClick={clearFilters}
                      className="text-xs font-bold uppercase tracking-widest text-[#c9a263] hover:text-white transition-colors"
                    >
                      Limpar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeLabels.map(label => (
                       <span key={label} className="bg-[#1a1a1a] text-white px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1 shadow-sm border border-[#a3a3a3]/10">
                          {label}
                       </span>
                    ))}
                  </div>
                </div>
              )}

              {renderFilters()}
            </div>
          </aside>

          {/* CATALOG GRID */}
          <div className="flex-1 w-full relative">
            
            {/* Desktop Top Bar */}
            <div className="hidden md:flex justify-between items-center mb-8 pb-6 border-b border-transparent">
               <span className="text-sm font-medium text-[#a3a3a3]">{sortedProducts.length} cafés encontrados</span>
               <div className="relative">
                 <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-[#111111] border border-[#a3a3a3]/10 rounded-full px-6 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#c9a263]/30 font-medium text-sm text-[#a3a3a3] shadow-sm cursor-pointer hover:border-[#a3a3a3]/30 transition-colors"
                    aria-label="Ordenar produtos"
                  >
                    <option value="destaques">Ordenar por: Destaques</option>
                    <option value="menor_preco">Menor Preço</option>
                    <option value="maior_preco">Maior Preço</option>
                    <option value="mais_premiados">Mais Premiados</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a3a3a3]" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {sortedProducts.map(product => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group premium-card !p-0 overflow-hidden flex flex-col h-full hover:shadow-[0_15px_30px_rgba(201,162,99,0.1)] hover:border-[#c9a263]/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link to={`/cafes/${product.slug}`} className="block relative aspect-[4/5] sm:aspect-square overflow-hidden bg-[#111111] flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/30 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500" />
                      
                      <ProductImageWithFallback 
                         src={product.image} 
                         alt={product.name} 
                         className="w-full h-full object-cover mix-blend-lighten group-hover:scale-110 group-hover:opacity-60 opacity-80 transition-all duration-700"
                      />
                      
                      <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2 max-w-[80%]">
                        {product.isAwardWinning && (
                             <span className="premium-badge">
                               Lote Premiado
                             </span>
                        )}
                        {product.roastLevel === 'clara' && (
                            <span className="premium-badge bg-white text-[#0a0a0a] border-white">
                              Torra Clara
                            </span>
                        )}
                        {product.category.includes('b2b') && (
                            <span className="premium-badge bg-[#111111] text-[#a3a3a3]">
                              B2B
                            </span>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-6 md:p-8 flex flex-col flex-1 bg-[#111111]">
                      <div className="text-[10px] text-[#c9a263] font-bold uppercase tracking-widest mb-2">{product.region}</div>
                      <h3 className="font-serif text-2xl font-medium mb-3 leading-tight group-hover:text-[#c9a263] transition-colors text-white">{product.name}</h3>
                      
                      <p className="text-[#a3a3a3] text-sm leading-relaxed mb-4 line-clamp-2">
                        {product.sensoryNotes.join(' • ')}. {product.shortDescription}
                      </p>

                      <div className="text-[10px] font-bold text-[#a3a3a3]/50 mb-6 uppercase tracking-widest">
                        Ideal para: <span className="text-[#a3a3a3]">{product.category.includes('b2b') ? 'Escritório & Revenda' : product.roastLevel === 'clara' ? 'Coado Especial' : 'Espresso & Dia a dia'}</span>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-[#a3a3a3]/10 flex flex-col gap-4">
                         <div className="flex items-center justify-between">
                             <div className="flex flex-col">
                                <span className="text-[10px] text-[#a3a3a3]/50 font-bold uppercase tracking-widest mb-1">A PARTIR DE</span>
                                <span className="font-medium text-xl md:text-2xl tracking-tight text-white">R$ {product.price.toFixed(2)}</span>
                             </div>
                         </div>
                         
                         <div className="mt-2 grid w-full grid-cols-1 gap-2.5 lg:grid-cols-2">
                           <button 
                             onClick={(e) => { e.preventDefault(); addItem(product, product.formats[0], 1); }}
                             className="premium-cta !py-3 lg:order-2 flex items-center justify-center gap-2"
                             aria-label="Adicionar ao carrinho"
                           >
                             <ShoppingBag size={16} className="shrink-0" />
                             <span className="truncate">Experimentar</span>
                           </button>
                           <Link 
                             to={`/cafes/${product.slug}`}
                             className="premium-cta-ghost !py-3 lg:order-1 flex items-center justify-center"
                           >
                              <span className="truncate">Ver lote</span>
                           </Link>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {sortedProducts.length === 0 && (
                <div className="col-span-full py-24 text-center premium-card">
                  <Coffee size={48} className="mx-auto mb-6 text-[#c9a263]/50" />
                  <h3 className="text-2xl font-serif mb-4 text-white">Não encontramos cafés com esses filtros.</h3>
                  <p className="text-[#a3a3a3] mb-8 max-w-md mx-auto leading-relaxed">
                    Tente remover algum filtro ou falar com a CofCof para uma recomendação personalizada.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={clearFilters}
                      className="premium-cta"
                    >
                      Limpar filtros
                    </button>
                    <a 
                      href="https://wa.me/5531999999999"
                      target="_blank"
                      rel="noreferrer"
                      className="premium-cta-ghost"
                    >
                      Falar no WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE FILTERS BOTTOM SHEET */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#111111] rounded-t-[2rem] z-50 flex flex-col md:hidden shadow-2xl border-t border-[#c9a263]/20"
            >
              <div className="flex justify-between items-center p-6 border-b border-[#a3a3a3]/10 shrink-0">
                <div>
                  <h3 className="font-serif text-2xl text-white">Filtros</h3>
                  <p className="text-sm text-[#a3a3a3]">{filteredProducts.length} cafés encontrados</p>
                </div>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-[#1a1a1a] rounded-full text-[#a3a3a3]" aria-label="Fechar filtros">
                   <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pb-32">
                <div className="bg-[#1a1a1a] border border-[#c9a263]/30 rounded-2xl p-6 mb-8 text-center flex flex-col items-center">
                   <h3 className="font-serif text-xl mb-2 text-white">Não sabe qual escolher?</h3>
                   <p className="text-sm text-[#a3a3a3] leading-relaxed mb-6">Descubra seu café ideal em 30 segundos.</p>
                   <button 
                      onClick={() => { setIdealFor('iniciante'); setFlavorProfile('doce'); setCategory('moído'); setIsMobileFiltersOpen(false); }}
                      className="premium-cta w-full"
                   >
                      Ver cafés indicados
                   </button>
                </div>
                {renderFilters()}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#111111] border-t border-[#a3a3a3]/10 flex gap-4 w-full">
                <button 
                  onClick={clearFilters}
                  className="premium-cta-ghost w-1/3 text-center"
                >
                  Limpar
                </button>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="premium-cta w-2/3 text-center"
                >
                  Ver {filteredProducts.length} Cafés
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
