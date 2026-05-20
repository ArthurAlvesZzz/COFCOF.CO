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

  const filteredFarms = mockOriginFarms.filter(farm => {
    if (mapFilter === 'Todos') return true;
    if (mapFilter === '86+ SCA') return (farm.scaScore || 0) >= 86;
    if (mapFilter === 'Disponível agora') return farm.active;
    if (farm.process.toLowerCase().includes(mapFilter.toLowerCase())) return true;
    if (farm.varieties.some(v => v.toLowerCase().includes(mapFilter.toLowerCase()))) return true;
    return false;
  });

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
            <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Do Cerrado Mineiro à sua xícara, cada lote carrega produtor, fazenda, altitude, safra, processo, pontuação sensorial e rastreabilidade.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => scrollToSection('fazendas')}
                className="premium-cta w-full sm:w-auto"
              >
                Ver fazendas e produtores
              </button>
              <Link 
                to="/cafes"
                className="premium-cta-ghost w-full sm:w-auto"
               >
                Comprar cafés dessa origem
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FAIXA DE PROVA */}
      <section className="bg-[#111111] border-y border-[#a3a3a3]/10 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-12 gap-y-4 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest text-center">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-[#c9a263]" /> Cerrado Mineiro D.O.</span>
            <span className="flex items-center gap-2"><Mountain size={14} className="text-[#c9a263]" /> 800–1.300m</span>
            <span className="flex items-center gap-2"><Award size={14} className="text-[#c9a263]" /> 86+ SCA</span>
            <span className="flex items-center gap-2"><Flame size={14} className="text-[#c9a263]" /> Cup of Excellence</span>
            <span className="flex items-center gap-2"><QrCode size={14} className="text-[#c9a263]" /> QR por lote</span>
          </div>
        </div>
      </section>

      {/* 3. DOSSIÊ VISUAL */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Cerrado Mineiro: terroir que se prova na xícara.</h2>
          <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto font-light">Não é só uma região. É uma assinatura sensorial: altitude, clima definido, solo e produtores que entregam cafés mais doces, limpos e complexos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
           <div className="premium-card bg-[#111111] p-8">
             <Mountain size={24} className="text-[#c9a263] mb-4" />
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-1">Altitude</div>
             <h4 className="font-serif text-2xl text-white mb-3">800–1.300m</h4>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Garante noites mais frias e maturação lenta dos grãos, resultando em mais densidade, doçura e complexidade celular.</p>
           </div>
           
           <div className="premium-card bg-[#111111] p-8">
             <Sprout size={24} className="text-[#c9a263] mb-4" />
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-1">Solo</div>
             <h4 className="font-serif text-2xl text-white mb-3">Basalto</h4>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Solo rico em nutrientes que, aliado ao manejo cuidadoso, favorece o acúmulo de açúcares no fruto.</p>
           </div>
           
           <div className="premium-card bg-[#111111] p-8">
             <Sun size={24} className="text-[#c9a263] mb-4" />
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-1">Clima</div>
             <h4 className="font-serif text-2xl text-white mb-3">Estações Definidas</h4>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Verão chuvoso para o crescimento. Inverno seco perfeito para uma colheita sem fungos e secagem homogênea.</p>
           </div>
           
           <div className="premium-card bg-[#111111] p-8">
             <Coffee size={24} className="text-[#c9a263] mb-4" />
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-1">Variedades Elevadas</div>
             <h4 className="font-serif text-xl tracking-wide text-white mb-3">Paraíso · Topázio · Arara</h4>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Cultivares que encontraram no Cerrado o ambiente perfeito para expressar notas florais e frutadas intensas.</p>
           </div>
           
           <div className="premium-card bg-[#111111] p-8">
             <Award size={24} className="text-[#c9a263] mb-4" />
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-1">Certificação</div>
             <h4 className="font-serif text-2xl text-white mb-3">Denominação D.O.</h4>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">A primeira região do Brasil com selo de Denominação de Origem. Onde a origem não é só uma promessa, é rastreável.</p>
           </div>
           
           <div className="premium-card bg-[#111111] p-8">
             <Flame size={24} className="text-[#c9a263] mb-4" />
             <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3] mb-1">Perfil Sensorial Clássico</div>
             <h4 className="font-serif text-2xl text-white mb-3">Doçura Extrema</h4>
             <p className="text-sm text-[#a3a3a3] leading-relaxed">Doçura natural alta, corpo aveludado e finalização achocolatada, com microlotes que chegam a jasmim e melaço.</p>
           </div>
        </div>
        
        <div className="text-center">
          <Link to="/cafes" className="premium-cta gap-2 inline-flex">
            Ver cafés do Cerrado Mineiro <ChevronRight size={18} />
          </Link>
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
              
              <div className="flex flex-wrap gap-2 mb-8">
                {['Todos', '86+ SCA', 'Natural', 'Fermentado', 'Paraíso', 'Disponível agora'].map(filter => (
                  <button 
                    key={filter}
                    onClick={() => {
                        setMapFilter(filter);
                        setActiveFarm(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      mapFilter === filter 
                        ? 'bg-[#c9a263] text-[#0a0a0a]' 
                        : 'bg-[#111111] text-[#a3a3a3] border border-[#a3a3a3]/20 hover:border-[#c9a263]/50 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              
              <div className="text-[10px] uppercase font-bold text-[#c9a263] tracking-widest mb-4">
                 {filteredFarms.length} origens encontradas
              </div>

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
                             {activeFarm.approximateLocation && (
                                <span className="inline-block px-2 py-1 mb-4 rounded border border-blue-500/30 text-[9px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/5">
                                   Localização aproximada
                                </span>
                             )}
                             <h3 className="font-serif text-3xl text-white mb-1">{activeFarm.farmName}</h3>
                             <p className="text-sm text-[#a3a3a3] mb-6">Produtor: {activeFarm.producer} · {activeFarm.city}, {activeFarm.state}</p>
                             
                             <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                   <span className="block text-[10px] uppercase text-[#a3a3a3] font-bold mb-1">Processo</span>
                                   <span className="text-white">{activeFarm.process}</span>
                                </div>
                                <div>
                                   <span className="block text-[10px] uppercase text-[#a3a3a3] font-bold mb-1">Altitude</span>
                                   <span className="text-white">{activeFarm.altitude}</span>
                                </div>
                                <div>
                                   <span className="block text-[10px] uppercase text-[#a3a3a3] font-bold mb-1">Safra</span>
                                   <span className="text-white">{activeFarm.harvest}</span>
                                </div>
                                <div>
                                   <span className="block text-[10px] uppercase text-[#a3a3a3] font-bold mb-1">Lote CofCof</span>
                                   <span className="text-[#c9a263] border border-[#c9a263]/30 px-1 py-0.5 rounded bg-[#c9a263]/5 inline-block truncate max-w-full">{activeFarm.lotName}</span>
                                </div>
                             </div>
                             
                             <div className="mt-6 bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3]">Notas Sensoriais</span>
                                   <span className="text-sm font-serif text-[#c9a263]">{activeFarm.scaScore} SCA</span>
                                </div>
                                <p className="text-white text-xs">{activeFarm.sensoryNotes}</p>
                             </div>
                          </div>
                          
                          <div className="flex gap-3 mt-6">
                             <Link to={activeFarm.linkedProductSlug ? `/cafes/${activeFarm.linkedProductSlug}` : '/cafes'} className="premium-cta flex-1 justify-center py-3 text-xs">Ver Café</Link>
                             <button onClick={() => setActiveFarm(null)} className="premium-cta-ghost border-transparent px-4">Fechar</button>
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
                          <MapPin size={32} className="opacity-50 mb-4" />
                          <p className="text-sm">Selecione uma fazenda no mapa para ver todas as informações de rastreabilidade, produtor e lote CofCof vinculado.</p>
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
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#a3a3a3]/10">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-12">Produtores por trás dos lotes CofCof</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
           {mockOriginFarms.filter(f => f.active).slice(0,3).map(farm => (
              <div key={farm.id} className="premium-card p-0 overflow-hidden flex flex-col">
                 <div className="aspect-[4/3] bg-[#111111] overflow-hidden relative">
                    <img src={farm.producerImage || farm.image} alt={farm.producer} className="w-full h-full object-cover mix-blend-lighten opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
                 </div>
                 <div className="p-8 flex-1 flex flex-col">
                    <div className="text-[10px] text-[#c9a263] uppercase tracking-widest font-bold mb-2">{farm.farmName}</div>
                    <h3 className="font-serif text-2xl text-white mb-2">{farm.producer}</h3>
                    <p className="text-xs text-[#a3a3a3] mb-6">{farm.city}, {farm.region}</p>
                    
                    <div className="space-y-3 mb-8 text-xs font-medium border-t border-[#a3a3a3]/10 pt-6">
                       <div className="flex justify-between">
                          <span className="text-[#a3a3a3]">Lote:</span>
                          <span className="text-white">{farm.lotName}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[#a3a3a3]">SCA:</span>
                          <span className="text-[#c9a263]">{farm.scaScore}</span>
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
                    
                    <div className="mt-auto">
                      <Link to={farm.linkedProductSlug ? `/cafes/${farm.linkedProductSlug}` : '/cafes'} className="premium-cta-ghost w-full justify-center">Ver Café</Link>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* 6. TIMELINE: DA FAZENDA À XÍCARA */}
      <section className="py-24 px-6 bg-[#111111] border-y border-[#a3a3a3]/10">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Da fazenda à sua xícara</h2>
              <p className="text-[#a3a3a3] md:text-lg font-light">Uma cadeia curta, transparente e focada em preservar a qualidade e o frescor.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6">
               <div className="text-center group">
                 <div className="text-3xl font-serif text-[#c9a263]/30 mb-2 group-hover:text-[#c9a263] transition-colors">1.</div>
                 <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-2">Seleção do Produtor</h4>
                 <p className="text-xs md:text-sm text-[#a3a3a3]">Parceria direta com fazendas voltadas para microlotes.</p>
               </div>
               <div className="text-center group">
                 <div className="text-3xl font-serif text-[#c9a263]/30 mb-2 group-hover:text-[#c9a263] transition-colors">2.</div>
                 <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-2">Colheita e Processo</h4>
                 <p className="text-xs md:text-sm text-[#a3a3a3]">Manejo cuidadoso, secagem lenta e fermentações impecáveis.</p>
               </div>
               <div className="text-center group">
                 <div className="text-3xl font-serif text-[#c9a263]/30 mb-2 group-hover:text-[#c9a263] transition-colors">3.</div>
                 <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-2">Avaliação Sensorial</h4>
                 <p className="text-xs md:text-sm text-[#a3a3a3]">Aprovação apenas de lotes com mais de 86 pontos SCA.</p>
               </div>
               <div className="text-center group">
                 <div className="text-3xl font-serif text-[#c9a263]/30 mb-2 group-hover:text-[#c9a263] transition-colors">4.</div>
                 <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-2">Torra sob demanda</h4>
                 <p className="text-xs md:text-sm text-[#a3a3a3]">Grãos torrados apenas após seu pedido, garantindo frescor.</p>
               </div>
               <div className="text-center group">
                 <div className="text-3xl font-serif text-[#c9a263]/30 mb-2 group-hover:text-[#c9a263] transition-colors">5.</div>
                 <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-2">Embalagem Rastreável</h4>
                 <p className="text-xs md:text-sm text-[#a3a3a3]">Todos os pacotes contam com QR Code e dados da origem.</p>
               </div>
               <div className="text-center group">
                 <div className="text-3xl font-serif text-[#c9a263]/30 mb-2 group-hover:text-[#c9a263] transition-colors">6.</div>
                 <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-2">Sua Entrega</h4>
                 <p className="text-xs md:text-sm text-[#a3a3a3]">Despacho rápido para você provar o café no pico do sabor.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 7. DO QR AO PRODUTOR */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
           <div className="md:w-1/2">
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Do QR ao produtor</h2>
             <p className="text-lg text-[#a3a3a3] font-light leading-relaxed mb-8">
               Você não compra um café genérico. Você conhece o caminho dele. Do produtor ao pacote, cada lote CofCof pode carregar dados de origem, safra, torra e perfil sensorial.
             </p>
             <Link to="/cafes" className="premium-cta inline-flex items-center gap-2">
                 Ver exemplo de rastreabilidade <ChevronRight size={18} />
             </Link>
           </div>
           
           <div className="md:w-1/2 w-full flex justify-center">
              <div className="w-full max-w-[340px] bg-[#111111] rounded-[3rem] p-6 border-4 border-[#1a1a1a] shadow-2xl relative">
                  <div className="w-40 h-6 bg-[#1a1a1a] rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2" />
                  
                  <div className="bg-[#0a0a0a] rounded-2xl h-[600px] mt-6 overflow-y-auto no-scrollbar border border-white/5 relative p-6">
                     <div className="text-center mb-8 pt-4">
                        <QrCode size={40} className="text-[#c9a263] mx-auto mb-4" />
                        <h4 className="font-serif text-2xl text-white mb-2">Origem Validada</h4>
                        <p className="text-xs text-[#a3a3a3]">Este pacote é rastreável.</p>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="bg-[#111111] p-4 rounded-xl">
                           <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1">Fazenda</div>
                           <div className="text-sm text-white font-medium">Alto da Serra</div>
                        </div>
                        <div className="bg-[#111111] p-4 rounded-xl">
                           <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1">Produtor</div>
                           <div className="text-sm text-white font-medium">Eliane Garcia</div>
                        </div>
                        <div className="bg-[#111111] p-4 rounded-xl grid grid-cols-2 gap-4">
                           <div>
                             <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1">Processo</div>
                             <div className="text-sm text-white font-medium">Fermentado</div>
                           </div>
                           <div>
                             <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1">SCA</div>
                             <div className="text-sm text-[#c9a263] font-bold">88.5 pt</div>
                           </div>
                        </div>
                        <div className="bg-[#111111] p-4 rounded-xl">
                           <div className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-1">Data da Torra</div>
                           <div className="text-sm text-white font-medium">Hoje</div>
                           <div className="text-[10px] text-green-500 mt-2">Torra fresca verificada</div>
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
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white leading-tight">
            Agora que você sabe de onde vem, escolha seu próximo café.
          </h2>
          <p className="text-lg font-light text-[#a3a3a3] mb-12 max-w-2xl mx-auto">
            Microlotes do Cerrado Mineiro, com produtor, fazenda, processo, pontuação sensorial e torra sob demanda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/cafes" className="premium-cta w-full sm:w-auto text-center">
               Ver cafés
            </Link>
            <Link to="/assinatura" className="premium-cta-ghost w-full sm:w-auto text-center">
               Entrar para o Clube
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
