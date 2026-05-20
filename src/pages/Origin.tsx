import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Award, 
  Sprout, 
  QrCode, 
  Flame, 
  CheckCircle2,
  Droplets,
  Mountain,
  Sun,
  Coffee,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { publicContentService } from '../services/publicContentService';
import { ContentBlock } from '../types/admin';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { mockOriginFarms, mockProducts } from '../data/seed';
import { OriginFarm } from '../types';

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      animate: true,
      duration: 1.2
    });
  }, [center[0], center[1], zoom, map]);
  return null;
}

const getPinSvg = (featured: boolean) => {
   const path = '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>';
   return `<svg xmlns="http://www.w3.org/2000/svg" width="${featured ? '24' : '20'}" height="${featured ? '24' : '20'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
};

const createFarmIcon = (farm: OriginFarm, isActive: boolean) => {
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `
      <div class="custom-pin-marker" style="
        background-color: ${isActive ? '#c9a263' : '#111111'};
        width: ${isActive ? '40px' : '32px'};
        height: ${isActive ? '40px' : '32px'};
        border-radius: 50%;
        border: 2px solid ${isActive ? '#0a0a0a' : '#c9a263'};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${isActive ? '#0a0a0a' : '#c9a263'};
        transition: all 0.3s ease;
        transform: ${isActive ? 'scale(1.1) translateY(-4px)' : 'scale(1)'};
      ">
        ${getPinSvg(farm.featured)}
      </div>
    `,
    iconSize: isActive ? [40, 40] : [32, 32],
    iconAnchor: isActive ? [20, 20] : [16, 16],
  });
};

export default function Origin() {
  const [content, setContent] = useState<Record<string, Partial<ContentBlock>>>({});
  const [activeFarm, setActiveFarm] = useState<OriginFarm | null>(null);
  const [mapFilter, setMapFilter] = useState('Todos');

  const filterOptions = [
    { id: 'Todos', label: 'Todos', test: (f: OriginFarm) => true },
    { id: '86+ SCA', label: '86+ SCA', test: (f: OriginFarm) => (f.scaScore || 0) >= 86 },
    { id: 'Natural', label: 'Natural', test: (f: OriginFarm) => f.process.toLowerCase().includes('natural') },
    { id: 'Fermentado', label: 'Fermentado', test: (f: OriginFarm) => f.process.toLowerCase().includes('fermentado') },
    { id: 'Disponível agora', label: 'Disponível agora', test: (f: OriginFarm) => f.active && !!f.linkedProductSlug }
  ];

  const filteredFarms = mockOriginFarms.filter(farm => {
    const opt = filterOptions.find(o => o.id === mapFilter);
    return opt ? opt.test(farm) : true;
  });

  // Set default farm and handle filter active sync
  useEffect(() => {
    if (filteredFarms.length === 1) {
      if (activeFarm?.id !== filteredFarms[0].id) {
        setActiveFarm(filteredFarms[0]);
      }
    } else if (filteredFarms.length > 0 && (!activeFarm || !filteredFarms.find(f => f.id === activeFarm.id))) {
      // Find featured or available or first
      const defaultFarm = filteredFarms.find(f => f.featured) || filteredFarms.find(f => f.active) || filteredFarms[0];
      setActiveFarm(defaultFarm);
    } else if (filteredFarms.length === 0) {
      setActiveFarm(null);
    }
  }, [mapFilter]); // Deliberately only on mapFilter change to not override user clicks unless filtered out

  // Initial load default
  useEffect(() => {
    if (!activeFarm && filteredFarms.length > 0) {
      const defaultFarm = filteredFarms.find(f => f.featured) || filteredFarms.find(f => f.active) || filteredFarms[0];
      setActiveFarm(defaultFarm);
    }
  }, []);

  const getPinProps = (farm: OriginFarm) => {
    if (farm.featured) return { fill: '#c9a263', stroke: '#0a0a0a', hasLot: true };
    if (farm.active && farm.linkedProductSlug) return { fill: '#c9a263', stroke: '#0a0a0a', hasLot: true };
    return { fill: 'transparent', stroke: '#c9a263', hasLot: false };
  };

  const createFarmIcon = (farm: OriginFarm, isActive: boolean) => {
    const props = getPinProps(farm);
    return L.divIcon({
      className: 'bg-transparent border-0',
      html: `
        <div class="custom-pin-marker group relative" style="
          background-color: ${props.fill};
          width: ${isActive ? '40px' : '32px'};
          height: ${isActive ? '40px' : '32px'};
          border-radius: 50%;
          border: 2px solid ${isActive ? '#fff' : props.stroke};
          box-shadow: ${isActive ? '0 0 0 4px rgba(201,162,99,0.3), 0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.5)'};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${props.hasLot ? '#0a0a0a' : props.stroke};
          transition: all 0.3s ease;
          transform: ${isActive ? 'scale(1.1) translateY(-4px)' : 'scale(1)'};
        ">
          ${farm.featured 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'
          }
          <div class="absolute opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#111111] text-white text-[10px] px-2 py-1 rounded border border-white/10 -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-50">Localização aproximada da região produtora</div>
        </div>
      `,
      iconSize: isActive ? [40, 40] : [32, 32],
      iconAnchor: isActive ? [20, 20] : [16, 16],
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Origem | CofCof.co";
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
    <div className="w-full bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      
      {/* 1. HERO ORIGEM */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-16">
        <div className="absolute inset-x-0 top-0 h-full z-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Fazenda de café no Cerrado Mineiro" 
              className="w-full h-full object-cover opacity-30 mix-blend-lighten" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a] mix-blend-multiply opacity-80" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="premium-badge mb-8 mx-auto flex items-center gap-2 max-w-fit">
              Origem · Cerrado Mineiro · Rastreabilidade
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-6 leading-tight max-w-4xl mx-auto">
              A origem que assina <span className="text-[#c9a263] italic">cada café</span> CofCof.
            </h1>
            <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto leading-relaxed font-light mb-8">
              Do Cerrado Mineiro à sua xícara, cada lote carrega produtor, fazenda, altitude, safra, processo, pontuação sensorial e rastreabilidade.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-[10px] sm:text-xs font-bold text-[#c9a263] uppercase tracking-widest mb-10 max-w-3xl mx-auto">
               <span className="flex items-center gap-1.5"><MapPin size={12} /> Cerrado Mineiro D.O.</span>
               <span className="flex items-center gap-1.5"><Award size={12} /> 86+ SCA</span>
               <span className="flex items-center gap-1.5"><Mountain size={12} /> Cup of Excellence</span>
               <span className="flex items-center gap-1.5"><QrCode size={12} /> QR por lote</span>
               <span className="flex items-center gap-1.5"><Flame size={12} /> Torra sob demanda</span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => scrollToSection('fazendas')}
                className="premium-cta w-full sm:w-auto border-transparent bg-[#1a1a1a] text-[#a3a3a3] hover:text-white"
              >
                Explorar mapa da origem
              </button>
              <Link 
                to="/cafes"
                className="premium-cta w-full sm:w-auto border-transparent bg-[#c9a263] text-black"
               >
                Comprar cafés do Cerrado
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. ESPAÇAMENTO */}

      {/* 3. DOSSIÊ VISUAL & SENSORIAL */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <div className="premium-badge mb-6 mx-auto inline-flex">Por que o Cerrado?</div>
           <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">O que a origem muda no sabor?</h2>
           <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto font-light">Origem não é decoração. É o que explica o sabor, a rastreabilidade e o valor de cada lote. Entenda como o terroir se prova na xícara.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
           <div className="premium-card bg-[#111111] p-8 aspect-square flex flex-col justify-center">
             <Mountain size={24} className="text-[#c9a263] mb-4" />
             <h4 className="font-serif text-2xl text-white mb-3">Altitude</h4>
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-4 pb-4 border-b border-white/10">800–1.300m</div>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Ajuda na maturação lenta e resulta em maior complexidade e doçura celular.</p>
           </div>
           
           <div className="premium-card bg-[#111111] p-8 aspect-square flex flex-col justify-center">
             <Sun size={24} className="text-[#c9a263] mb-4" />
             <h4 className="font-serif text-2xl text-white mb-3">Estações</h4>
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-4 pb-4 border-b border-white/10">Inverno seco</div>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Favorece uma secagem homogênea, sem fungos, garantindo uma xícara puríssima e limpa.</p>
           </div>
           
           <div className="premium-card bg-[#111111] p-8 aspect-square flex flex-col justify-center">
             <Sprout size={24} className="text-[#c9a263] mb-4" />
             <h4 className="font-serif text-2xl text-white mb-3">Solo</h4>
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-4 pb-4 border-b border-white/10">Basalto nutritivo</div>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Contribui para doçura alta, estrutura encorpada e notas de caramelo e chocolate inerentes ao bioma.</p>
           </div>
           
           <div className="premium-card bg-[#111111] p-8 aspect-square flex flex-col justify-center">
             <Coffee size={24} className="text-[#c9a263] mb-4" />
             <h4 className="font-serif text-2xl text-white mb-3">Processos</h4>
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-4 pb-4 border-b border-white/10">Naturais & Fermentados</div>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Intensifica frutas, corpo aveludado e a doçura extrema que define os melhores lotes da região.</p>
           </div>
        </div>
        
        <div className="text-center">
          <button onClick={() => scrollToSection('fazendas')} className="premium-cta gap-2 inline-flex">
            Explorar origens no mapa <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* 4. MAPA DA ORIGEM */}
      <section id="fazendas" className="py-24 px-6 border-t border-[#a3a3a3]/10 bg-gradient-to-b from-[#111111]/30 to-[#0a0a0a] scroll-mt-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
           
           {/* Painel Esquerdo */}
           <div className="lg:w-[45%] flex flex-col">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Mapa da Origem CofCof</h2>
              <p className="text-[#a3a3a3] text-base mb-8 leading-relaxed font-light">
                Explore as fazendas por trás dos nossos lotes. Cada ponto representa uma origem selecionada: produtores, microlotes e cafés rastreáveis que compõem a curadoria CofCof.
              </p>
              <p className="text-white text-xs lg:text-sm font-medium mb-6">Clique em uma fazenda no mapa para ver produtor, lote, pontuação e café disponível.</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {filterOptions.map(option => {
                   const count = mockOriginFarms.filter(option.test).length;
                   return (
                     <button 
                       key={option.id}
                       onClick={() => setMapFilter(option.id)}
                       className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 ${
                         mapFilter === option.id 
                           ? 'bg-[#c9a263] text-[#0a0a0a]' 
                           : 'bg-[#111111] text-[#a3a3a3] border border-[#a3a3a3]/20 hover:border-[#c9a263]/50 hover:text-white'
                       }`}
                     >
                       {option.label}
                       <span className={`px-1.5 py-0.5 rounded text-[8px] bg-black/20 ${mapFilter === option.id ? 'text-black' : 'text-[#a3a3a3]'}`}>{count}</span>
                     </button>
                   );
                })}
              </div>
              
              {mapFilter !== 'Todos' && (
                 <div className="flex justify-between items-center mb-4">
                    <div className="text-[10px] uppercase font-bold text-[#c9a263] tracking-widest">
                       {filteredFarms.length} origens com o filtro "{filterOptions.find(o => o.id === mapFilter)?.label}"
                    </div>
                    <button onClick={() => setMapFilter('Todos')} className="text-[10px] uppercase text-[#a3a3a3] hover:text-white font-bold tracking-widest underline decoration-[#a3a3a3]/50">Limpar filtros</button>
                 </div>
              )}

              {/* Mobile Selected Card ou Lista */}
              <div className="lg:hidden">
                 {activeFarm ? (
                    <div className="premium-card p-6 border-[#c9a263]/30 mb-8 bg-[#111111]">
                       <div className="flex justify-between items-start mb-4">
                         <div>
                           <h3 className="font-serif text-xl text-white">{activeFarm.farmName}</h3>
                           <p className="text-xs text-[#a3a3a3]">Produtor: {activeFarm.producer}</p>
                         </div>
                         <button onClick={() => setActiveFarm(null)} className="text-[#a3a3a3] hover:text-white">
                           <X size={20} />
                         </button>
                       </div>
                       
                       <div className="space-y-2 mb-6">
                         <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                           <span className="text-[#a3a3a3]">Altitude</span>
                           <span className="text-white font-medium">{activeFarm.altitude}</span>
                         </div>
                         <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                           <span className="text-[#a3a3a3]">Lote da Origem</span>
                           <span className="text-white font-medium">{activeFarm.lotName}</span>
                         </div>
                         <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                           <span className="text-[#a3a3a3]">Pontuação</span>
                           <span className="text-[#c9a263] font-bold">{activeFarm.scaScore} SCA</span>
                         </div>
                         <div className="flex justify-between text-xs pb-2 pt-2">
                           <span className="text-[#a3a3a3]">Notas Sensoriais</span>
                           <span className="text-white text-right max-w-[60%]">{activeFarm.sensoryNotes}</span>
                         </div>
                       </div>
                       
                       <div className="flex gap-2">
                          <Link to={`/cafes/${activeFarm.linkedProductSlug}`} className="premium-cta text-xs flex-1 text-center py-3">Ver Café</Link>
                       </div>
                    </div>
                 ) : (
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar mb-8">
                       {filteredFarms.map(farm => (
                         <button 
                            key={farm.id} 
                            onClick={() => setActiveFarm(farm)} 
                            className="bg-[#111111] border border-[#a3a3a3]/10 rounded-2xl p-4 shrink-0 w-[240px] text-left hover:border-[#c9a263]/30 transition-colors"
                         >
                           <h4 className="font-serif text-base text-white truncate">{farm.farmName}</h4>
                           <span className="text-xs text-[#a3a3a3] block mb-2">{farm.city}</span>
                           <span className="text-[10px] px-2 py-1 bg-[#1a1a1a] text-[#c9a263] font-bold uppercase tracking-widest rounded border border-[#a3a3a3]/10">{farm.lotName}</span>
                         </button>
                       ))}
                    </div>
                 )}
              </div>

              {/* Desktop Selected Card */}
              <div className="hidden lg:block relative flex-1 min-h-[300px]">
                 <AnimatePresence mode="wait">
                    {activeFarm && (
                       <motion.div 
                          key={activeFarm.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute inset-0 bg-[#111111] border border-[#a3a3a3]/10 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between"
                       >
                          <div>
                             <div className="flex items-center gap-2 mb-4">
                               <span className="premium-badge text-[10px]">Origem CofCof</span>
                               {activeFarm.scaScore && activeFarm.scaScore >= 86 && <span className="premium-badge text-[10px] bg-[#c9a263]/10 text-[#c9a263] border-[#c9a263]/30">{activeFarm.scaScore}+ SCA</span>}
                               {activeFarm.approximateLocation && (
                                <span className="inline-block px-2 py-0.5 rounded border border-blue-500/30 text-[9px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/5">
                                   Aproximada
                                </span>
                               )}
                             </div>
                             
                             <h3 className="font-serif text-3xl text-white mb-1">{activeFarm.farmName}</h3>
                             <p className="text-sm text-[#a3a3a3] mb-4 text-white">Produtor: {activeFarm.producer}</p>
                             
                             <p className="text-xs text-[#a3a3a3] mb-6">Cerrado Mineiro · {activeFarm.altitude} · {activeFarm.process}</p>

                             <div className="mb-6">
                               <p className="text-white text-sm font-light italic border-l-2 border-[#c9a263] pl-4 py-1 leading-relaxed">
                                  {activeFarm.traceabilitySummary || activeFarm.description || `Um lote rastreável e doce, para quem quer entender o caminho do café antes da primeira xícara. Notas sensoriais de ${activeFarm.sensoryNotes}.`}
                               </p>
                             </div>
                          </div>
                          
                          <div className="flex flex-col gap-3 mt-auto">
                             <Link to={activeFarm.linkedProductSlug ? `/cafes/${activeFarm.linkedProductSlug}` : '/cafes'} className="premium-cta w-full justify-center py-4 bg-[#c9a263] text-black">Ver café deste lote</Link>
                             <div className="flex gap-3">
                                <button onClick={() => scrollToSection('produtores')} className="premium-cta-ghost flex-1 justify-center border-transparent bg-[#1a1a1a] text-[#a3a3a3] hover:text-white py-3 text-xs">Conhecer produtor</button>
                                <button onClick={() => scrollToSection('rastreabilidade')} className="premium-cta-ghost flex-1 justify-center border-transparent bg-[#1a1a1a] text-[#a3a3a3] hover:text-white py-3 text-xs">Ver rastreabilidade</button>
                             </div>
                          </div>
                       </motion.div>
                    )}
                    {!activeFarm && (
                       <motion.div 
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 border border-dashed border-[#a3a3a3]/20 rounded-[2rem] flex flex-col items-center justify-center text-center p-8 text-[#a3a3a3]"
                       >
                          {filteredFarms.length === 0 ? (
                            <>
                              <MapPin size={32} className="opacity-50 mb-4" />
                              <p className="text-sm font-bold text-white mb-2">Nenhuma fazenda encontrada com esse filtro.</p>
                              <p className="text-sm mb-6">Hoje não temos lote ativo nesse perfil. Veja todos os produtores ou explore outro processo.</p>
                              <button onClick={() => setMapFilter('Todos')} className="premium-cta">Limpar filtros</button>
                            </>
                          ) : (
                            <>
                              <MapPin size={32} className="opacity-50 mb-4" />
                              <p className="text-sm">Selecione uma fazenda no mapa para ver todas as informações de rastreabilidade, produtor e lote CofCof vinculado.</p>
                            </>
                          )}
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* Mapa */}
           <div className="lg:w-[55%] h-[420px] md:h-[560px] bg-[#111111] rounded-[2rem] overflow-hidden border border-[#a3a3a3]/10 relative z-0">
             <style>{`
                .leaflet-container { background: #0a0a0a; font-family: inherit; }
                .custom-pin-marker:hover { transform: scale(1.15) translateY(-4px) !important; background-color: #c9a263 !important; color: #0a0a0a !important; border-color: #0a0a0a !important;}
                .leaflet-control-zoom { border: none !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important; border-radius: 8px !important; overflow: hidden; margin-bottom: 24px !important; margin-right: 24px !important; }
                .leaflet-control-zoom a { background-color: rgba(17, 17, 17, 0.9) !important; color: #a3a3a3 !important; transition: all 0.2s !important; border: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important;}
                .leaflet-control-zoom a:hover { background-color: #1a1a1a !important; color: #c9a263 !important; }
              `}</style>
              <MapContainer 
                center={[-18.9, -46.9]} 
                zoom={7} 
                scrollWheelZoom={false} 
                className="w-full h-full"
                zoomControl={false}
              >
                <ZoomControl position="bottomright" />
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                
                {activeFarm && (
                  <ChangeView center={[activeFarm.lat, activeFarm.lng]} zoom={11} />
                )}

                {filteredFarms.map(farm => (
                  <Marker 
                    key={farm.id} 
                    position={[farm.lat, farm.lng]}
                    icon={createFarmIcon(farm, activeFarm?.id === farm.id)}
                    zIndexOffset={activeFarm?.id === farm.id ? 1000 : 0}
                    eventHandlers={{ click: () => setActiveFarm(farm) }}
                  />
                ))}
              </MapContainer>
           </div>
           
        </div>
      </section>

      {/* 5. LISTA PRODUTORES SEÇÃO */}
      <section id="produtores" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#a3a3a3]/10 scroll-mt-24">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-12">Produtores por trás dos lotes CofCof</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
           {mockOriginFarms.filter(f => f.active).slice(0,3).map(farm => (
              <div key={farm.id} className="premium-card p-0 overflow-hidden flex flex-col relative group">
                 {/* Fallback image strategy */}
                 <div className="aspect-[4/3] bg-[#111111] overflow-hidden relative">
                    {farm.producerImage || farm.image ? (
                        <img src={farm.producerImage || farm.image} alt={farm.producer} className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    ) : (
                        <div className="w-full h-full bg-[#160f0a] flex items-center justify-center text-[#c9a263]/20 relative overflow-hidden">
                           <Mountain size={120} strokeWidth={1} className="absolute rotate-12 scale-150 opacity-10" />
                           <div className="text-center relative z-10 p-6">
                              <span className="premium-badge inline-flex mb-2">Produtor CofCof</span>
                              <div className="text-xs uppercase tracking-widest">{farm.farmName}</div>
                           </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                 </div>
                 <div className="p-8 flex-1 flex flex-col bg-[#111111]">
                    <div className="text-[10px] text-[#c9a263] uppercase tracking-widest font-bold mb-2">{farm.farmName}</div>
                    <h3 className="font-serif text-2xl text-white mb-2">{farm.producer}</h3>
                    <p className="text-xs text-[#a3a3a3] mb-6">{farm.city}, {farm.region}</p>
                    
                    <div className="space-y-3 mb-8 text-xs font-medium border-t border-[#a3a3a3]/10 pt-6">
                       <div className="flex justify-between">
                          <span className="text-[#a3a3a3]">Lote:</span>
                          <span className="text-white max-w-[50%] text-right truncate bg-[#1a1a1a] px-2 py-0.5 rounded border border-white/5">{farm.lotName}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[#a3a3a3]">SCA:</span>
                          <span className="text-[#c9a263]">{farm.scaScore || 'TBD'}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[#a3a3a3]">Processo:</span>
                          <span className="text-white truncate max-w-[60%] text-right">{farm.process}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[#a3a3a3] mt-1 shrink-0">Notas:</span>
                          <span className="text-white text-right break-words">{farm.sensoryNotes}</span>
                       </div>
                    </div>
                    
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <Link to={farm.linkedProductSlug ? `/cafes/${farm.linkedProductSlug}` : '/cafes'} className="premium-cta w-full justify-center px-0 text-xs py-3 border-transparent bg-[#c9a263] text-black">Ver Café</Link>
                      <button onClick={() => {
                          setActiveFarm(farm);
                          scrollToSection('fazendas');
                      }} className="premium-cta-ghost w-full justify-center px-0 text-xs py-3 border-transparent bg-[#1a1a1a] hover:bg-white text-[#a3a3a3]">Ver no mapa</button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* 6. TIMELINE: DA FAZENDA À XÍCARA */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-y border-[#a3a3a3]/10 relative overflow-hidden">
         <div className="absolute inset-x-0  top-0 h-px bg-gradient-to-r from-transparent via-[#c9a263]/20 to-transparent"></div>
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Da origem até você</h2>
              <p className="text-[#a3a3a3] md:text-lg font-light">Uma cadeia curta, rastreável e focada em preservar a qualidade e o frescor de cada gota.</p>
            </div>
            
            <div className="relative">
               <div className="hidden md:block absolute top-[45px] left-[5%] right-[5%] h-px bg-gradient-to-r from-[#c9a263]/10 via-[#c9a263]/40 to-[#c9a263]/10 border-t border-dashed border-[#c9a263]/30"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 gap-x-6 relative text-center">
                  <div className="group relative">
                     <div className="w-24 h-24 mx-auto bg-[#111111] border-2 border-[#1a1a1a] group-hover:border-[#c9a263] rounded-full flex items-center justify-center mb-6 transition-colors shadow-xl relative z-10">
                        <Mountain size={32} className="text-[#a3a3a3] group-hover:text-[#c9a263] transition-colors" />
                     </div>
                     <h4 className="font-serif text-xl text-white mb-2">1. Fazenda</h4>
                     <p className="text-xs text-[#a3a3a3] leading-relaxed">Seleção de produtores focados em microlotes e manejo cuidadoso do terroir.</p>
                  </div>
                  
                  <div className="group relative">
                     <div className="w-24 h-24 mx-auto bg-[#111111] border-2 border-[#1a1a1a] group-hover:border-[#c9a263] rounded-full flex items-center justify-center mb-6 transition-colors shadow-xl relative z-10">
                        <Award size={32} className="text-[#a3a3a3] group-hover:text-[#c9a263] transition-colors" />
                     </div>
                     <h4 className="font-serif text-xl text-white mb-2">2. Avaliação SCA</h4>
                     <p className="text-xs text-[#a3a3a3] leading-relaxed">Apenas lotes acima de 86 pontos, com doçura extrema, entram na curadoria.</p>
                  </div>
                  
                  <div className="group relative">
                     <div className="w-24 h-24 mx-auto bg-[#111111] border-2 border-[#1a1a1a] group-hover:border-[#c9a263] rounded-full flex items-center justify-center mb-6 transition-colors shadow-xl relative z-10">
                        <Flame size={32} className="text-[#a3a3a3] group-hover:text-[#c9a263] transition-colors" />
                     </div>
                     <h4 className="font-serif text-xl text-white mb-2">3. Torra sob demanda</h4>
                     <p className="text-xs text-[#a3a3a3] leading-relaxed">Grãos torrados apenas após seu pedido. Frescor garante o pico do sabor.</p>
                  </div>
                  
                  <div className="group relative">
                     <div className="w-24 h-24 mx-auto bg-[#111111] border-2 border-[#1a1a1a] group-hover:border-[#c9a263] rounded-full flex items-center justify-center mb-6 transition-colors shadow-xl relative z-10">
                        <QrCode size={32} className="text-[#a3a3a3] group-hover:text-[#c9a263] transition-colors" />
                     </div>
                     <h4 className="font-serif text-xl text-white mb-2">4. QR Code do Lote</h4>
                     <p className="text-xs text-[#a3a3a3] leading-relaxed">O pacote leva você de volta à origem: produtor, pontuação e notas do dossiê.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. DO QR AO PRODUTOR */}
      <section id="rastreabilidade" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row items-center gap-16">
           <div className="md:w-1/2">
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Do QR ao produtor</h2>
             <p className="text-lg text-[#a3a3a3] font-light leading-relaxed mb-8">
               Você não compra um café genérico. Você conhece o caminho dele. Do produtor ao pacote, cada lote CofCof pode carregar dados de origem, safra, torra e perfil sensorial na palma da sua mão.
             </p>
             <Link to="/cafes" className="premium-cta inline-flex items-center gap-2">
                 Ver cafés rastreáveis <ChevronRight size={18} />
             </Link>
           </div>
           
           <div className="md:w-1/2 w-full flex justify-center">
              <div className="w-full max-w-[340px] bg-[#111111] rounded-[3rem] p-4 border-[6px] border-[#1a1a1a] shadow-2xl relative shadow-[#c9a263]/5">
                  <div className="w-32 h-6 bg-[#1a1a1a] rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                  
                  <div className="bg-[#0a0a0a] rounded-[2rem] h-[600px] overflow-y-auto no-scrollbar border border-white/5 relative bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
                     <div className="p-6 pb-20">
                         <div className="flex justify-center mb-6 pt-6">
                            <span className="premium-badge text-[10px] bg-[#c9a263]/10 text-[#c9a263] border-none">Origem Validada</span>
                         </div>
                         <div className="text-center mb-8">
                            <h4 className="font-serif text-3xl text-white mb-1">Alto da Serra</h4>
                            <p className="text-xs text-[#a3a3a3]">Eliane Garcia · Cerrado Mineiro</p>
                         </div>
                         
                         <div className="space-y-3">
                            <div className="bg-[#111111] p-4 rounded-xl border border-white/5">
                               <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1">Processo & SCA</div>
                               <div className="flex justify-between items-center">
                                  <span className="text-sm text-white font-medium">Fermentado Natural</span>
                                  <span className="text-sm text-[#c9a263] font-bold">88.5 pt</span>
                               </div>
                            </div>
                            <div className="bg-[#111111] p-4 rounded-xl border border-white/5">
                               <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1">Notas Sensoriais</div>
                               <div className="text-sm text-white font-medium break-words">Melaço de cana, frutas vermelhas maduras e licor.</div>
                            </div>
                            <div className="bg-[#111111] p-4 rounded-xl border border-white/5">
                               <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1">Altitude & Safra</div>
                               <div className="flex justify-between items-center">
                                  <span className="text-sm text-white font-medium">1.250m</span>
                                  <span className="text-sm text-white font-medium">2024</span>
                               </div>
                            </div>
                            <div className="bg-[#111111] p-4 rounded-xl border border-[#c9a263]/30 bg-gradient-to-r from-[#111111] to-[#c9a263]/5">
                               <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1 flex justify-between">
                                  <span>Data da Torra</span>
                                  <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={10} /> Fresca</span>
                               </div>
                               <div className="text-sm text-white font-medium">Hoje</div>
                            </div>
                            
                            <button className="w-full bg-[#c9a263] text-black text-xs font-bold uppercase tracking-widest py-3 mt-4 rounded-lg">Comprar Novamente</button>
                         </div>
                     </div>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* 8. CAFÉS DISPONÍVEIS */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#a3a3a3]/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Cafés disponíveis dessa origem</h2>
          <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto font-light">Agora que você sabe de onde vem, escolha um lote rastreável do Cerrado Mineiro.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {mockProducts.filter(p => p.category === 'grão' && p.stock > 0).slice(0, 4).map(product => (
              <div key={product.id} className="premium-card p-0 overflow-hidden group flex flex-col">
                 <Link to={`/cafes/${product.slug}`} className="block relative aspect-[4/5] bg-[#111111]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 transition-opacity" />
                    {product.isAwardWinning && <span className="premium-badge absolute top-4 left-4">Lote Premiado</span>}
                 </Link>
                 <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[10px] text-[#c9a263] font-bold uppercase tracking-widest mb-1">{product.farm || product.region}</div>
                    <h3 className="font-serif text-xl text-white mb-2">{product.name}</h3>
                    
                    <div className="flex flex-wrap gap-1 mb-4 mt-2">
                       {product.sensoryNotes.map((note, i) => (
                         <span key={i} className="text-[9px] uppercase font-bold tracking-widest text-[#a3a3a3] bg-[#111111] px-2 py-1 rounded border border-white/5">{note}</span>
                       ))}
                    </div>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                       <span className="text-lg text-white font-medium">R$ {product.price}</span>
                       <span className="text-xs text-[#a3a3a3]">250g</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Link to={`/cafes/${product.slug}`} className="premium-cta-ghost py-2 text-xs flex justify-center border-transparent">Ver dossiê</Link>
                      <button className="premium-cta py-2 text-xs flex justify-center bg-[#c9a263] text-black border-none">Comprar</button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* 9. CTA FINAL */}
      <section className="bg-[#111111] text-white py-32 px-6 text-center relative overflow-hidden border-y border-[#a3a3a3]/10">
        <div className="absolute inset-0 z-0">
           <Mountain size={400} className="text-[#a3a3a3]/5 absolute -right-20 -top-20" />
           <Coffee size={300} className="text-[#a3a3a3]/5 absolute -left-10 bottom-0" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white leading-tight">
            Agora que você sabe de onde vem, escolha seu próximo café.
          </h2>
          <p className="text-lg font-light text-[#a3a3a3] mb-12 max-w-2xl mx-auto">
            Microlotes do Cerrado Mineiro, com produtor, fazenda, processo, pontuação sensorial e torra sob demanda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/cafes" className="premium-cta w-full sm:w-auto text-center border-transparent bg-[#c9a263] text-black hover:bg-white transition-colors">
               Comprar cafés do Cerrado
            </Link>
            <Link to="/assinatura" className="premium-cta-ghost w-full sm:w-auto text-center border-transparent bg-[#1a1a1a] hover:bg-white text-[#a3a3a3] hover:text-black">
               Entrar para o Clube
            </Link>
            <button onClick={() => scrollToSection('fazendas')} className="premium-cta-ghost w-full sm:w-auto text-center border-transparent bg-transparent hover:text-white text-[#a3a3a3]">
               Ver mapa da origem novamente
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
