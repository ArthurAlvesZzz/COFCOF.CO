import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { mockPartners } from '../data/seed';
import L from 'leaflet';
import { Search, Navigation, ExternalLink, X, MapPin, Clock, Coffee, Store, Bed, Fuel, CheckCircle2, Share2, MessageCircle, ShoppingBag, Utensils } from 'lucide-react';
import { Partner } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    const targetPoint = map.project(center, zoom);
    if (isDesktop) {
      targetPoint.x -= 240; // Shift map right relative to container center
    } else {
      targetPoint.y -= 150; 
    }
    const offsetCenter = map.unproject(targetPoint, zoom);
    map.flyTo(offsetCenter, zoom, { animate: true, duration: 1.2 });
  }, [center[0], center[1], zoom, map]);
  return null;
}

export default function MapPartners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activePartner, setActivePartner] = useState<Partner | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Onde encontrar CofCof | Parceiros Oficiais";
  }, []);

  const categories = ['Todos', 'Cafeterias', 'Empórios', 'Restaurantes', 'Padarias', 'Hotéis', 'Postos', 'Conveniência', 'Revendas'];

  const getPartnerCategory = (partner: Partner) => {
    return partner.category || 'Outros';
  };

  const filteredData = useMemo(() => {
    return mockPartners.filter(p => {
      // Exclude pending/inactive
      if (!p.active || p.status === 'pending') return false;

      const term = searchTerm.toLowerCase();
      const matchName = (p.publicName || '').toLowerCase().includes(term);
      const matchCity = (p.city || '').toLowerCase().includes(term);
      const matchNeighborhood = (p.neighborhood || '').toLowerCase().includes(term);
      const matchType = (p.type || '').toLowerCase().includes(term);
      const matchTags = p.tags?.some(tag => tag.toLowerCase().includes(term));
      const matchProducts = p.availableProducts?.some(prod => prod.toLowerCase().includes(term));
      
      const isSearchMatch = !term || matchName || matchCity || matchNeighborhood || matchType || matchTags || matchProducts;
      
      let isCategoryMatch = true;
      if (activeCategory !== 'Todos') {
        const cat = activeCategory.toLowerCase();
        const pCat = getPartnerCategory(p).toLowerCase();
        if (cat === 'cafeterias') isCategoryMatch = pCat === 'cafeteria';
        else if (cat === 'empórios') isCategoryMatch = pCat === 'empório';
        else if (cat === 'restaurantes') isCategoryMatch = pCat === 'restaurante';
        else if (cat === 'padarias') isCategoryMatch = pCat === 'padaria';
        else if (cat === 'hotéis') isCategoryMatch = pCat === 'hotel';
        else if (cat === 'postos') isCategoryMatch = pCat === 'posto';
        else if (cat === 'conveniência') isCategoryMatch = pCat === 'conveniência';
        else if (cat === 'revendas') isCategoryMatch = pCat === 'revenda';
        else isCategoryMatch = false; // Intentionally strict
      }

      return isSearchMatch && isCategoryMatch;
    });
  }, [searchTerm, activeCategory]);

  const getCategoryCount = (catName: string) => {
    if (catName === 'Todos') return mockPartners.filter(p => p.active && p.status !== 'pending').length;
    return mockPartners.filter(p => {
      if (!p.active || p.status === 'pending') return false;
      const cat = catName.toLowerCase();
      const pCat = getPartnerCategory(p).toLowerCase();
      if (cat === 'cafeterias') return pCat === 'cafeteria';
      if (cat === 'empórios') return pCat === 'empório';
      if (cat === 'restaurantes') return pCat === 'restaurante';
      if (cat === 'padarias') return pCat === 'padaria';
      if (cat === 'hotéis') return pCat === 'hotel';
      if (cat === 'postos') return pCat === 'posto';
      if (cat === 'conveniência') return pCat === 'conveniência';
      if (cat === 'revendas') return pCat === 'revenda';
      return false;
    }).length;
  };

  const handleOpenGoogleMaps = (partner: Partner) => {
    if (partner.googleMapsUrl) {
       window.open(partner.googleMapsUrl, '_blank');
    } else {
       const q = `${partner.publicName}, ${partner.address}, ${partner.city}`.replace(/\s/g, '+');
       window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
    }
  };

  const handleShare = async (partner: Partner) => {
    const url = `${window.location.origin}/parceiros/${partner.slug}`;
    const text = `Conheça ${partner.publicName}, parceiro CofCof em ${partner.neighborhood}, ${partner.city}.`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: partner.publicName, text, url });
      } catch (err) {
        console.log('Share error', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado para a área de transferência');
    }
  };

  const getIconSvg = (category: string, isFeatured: boolean) => {
     const cat = category.toLowerCase();
     let path = '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>'; 
     if (cat === 'restaurante') path = '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>';
     else if (cat === 'empório' || cat === 'revenda') path = '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>';
     else if (cat === 'padaria') path = '<path d="M12 2A10 10 0 0 0 2 12c0 2.2.8 4.2 2.2 5.8a2 2 0 0 0 2.6.2l3-2.3a2 2 0 0 1 2.4 0l3 2.3a2 2 0 0 0 2.6-.2A10.1 10.1 0 0 0 22 12 10 10 0 0 0 12 2z"/><path d="M12 2v20"/><path d="M2 12h20"/>';
     else if (cat === 'hotel') path = '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>';
     else if (cat === 'posto') path = '<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>';
     else if (cat === 'conveniência') path = '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>';

     return `<svg xmlns="http://www.w3.org/2000/svg" width="${isFeatured ? '24' : '18'}" height="${isFeatured ? '24' : '18'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  };

  const createCustomIcon = (partner: Partner, isActive: boolean) => {
    const isFeatured = partner.featured;
    return L.divIcon({
      className: 'bg-transparent border-0',
      html: `
        <div class="custom-pin-marker" style="
          background-color: ${isActive ? '#c9a263' : (isFeatured ? '#c9a263' : '#111111')};
          width: ${isActive ? '48px' : (isFeatured ? '40px' : '36px')};
          height: ${isActive ? '48px' : (isFeatured ? '40px' : '36px')};
          border-radius: 50%;
          border: 3px solid ${isActive ? '#0a0a0a' : (isFeatured ? '#0a0a0a' : '#c9a263')};
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${isActive ? '#0a0a0a' : (isFeatured ? '#0a0a0a' : '#c9a263')};
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: ${isActive ? 'scale(1.1) translateY(-6px)' : 'scale(1)'};
          cursor: pointer;
        ">
          ${getIconSvg(partner.category, isFeatured || isActive)}
        </div>
      `,
      iconSize: isActive ? [48, 48] : (isFeatured ? [40, 40] : [36, 36]),
      iconAnchor: isActive ? [24, 24] : (isFeatured ? [20, 20] : [18, 18]),
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden flex flex-col md:flex-row">
      <style>{`
        .leaflet-container { background: #0a0a0a; font-family: inherit; }
        .custom-pin-marker:hover { transform: scale(1.15) translateY(-4px) !important; z-index: 1000 !important; }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important; border-radius: 12px !important; overflow: hidden; margin-bottom: 32px !important; margin-right: 32px !important; }
        .leaflet-control-zoom a { background-color: rgba(17, 17, 17, 0.9) !important; color: #a3a3a3 !important; transition: all 0.2s !important; border: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important;}
        .leaflet-control-zoom a:last-child { border-bottom: none !important; }
        .leaflet-control-zoom a:hover { background-color: #1a1a1a !important; color: #c9a263 !important; }
        .leaflet-control-attribution { opacity: 0.3; }
        @media (max-width: 768px) {
          .leaflet-control-zoom { display: none !important; }
        }
      `}</style>

      {/* Left Panel */}
      <div className="relative z-30 w-full md:w-[480px] h-[55dvh] md:h-full bg-[#0a0a0a] border-b md:border-r border-[#a3a3a3]/10 flex flex-col pt-16 md:pt-24 shrink-0 shadow-2xl">
         
         <div className="px-6 md:px-8 pb-4 shrink-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-transparent z-10">
           <h1 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">Onde encontrar CofCof</h1>
           <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6 font-light">
             Parceiros CofCof são pontos selecionados. Cada local listado aqui aproxima você de cafés com origem, frescor e rastreabilidade.
           </p>
           
           <div className="relative mb-4">
             <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
             <input 
                type="text" 
                placeholder="Busque por cidade, bairro, parceiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111111] border border-[#a3a3a3]/20 pl-12 pr-10 py-3.5 rounded-xl focus:outline-none focus:border-[#c9a263]/50 text-white placeholder:text-[#a3a3a3] text-sm font-medium transition-colors"
             />
             {searchTerm && (
               <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] hover:text-white transition-colors">
                 <X size={18} />
               </button>
             )}
           </div>

           <div className="flex flex-wrap gap-2 overflow-y-auto no-scrollbar pb-2">
             {categories.map((cat) => {
               const count = getCategoryCount(cat);
               if (count === 0 && cat !== 'Todos') return null;
               return (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 ${
                      activeCategory === cat 
                        ? 'bg-[#c9a263] text-[#0a0a0a]' 
                        : 'bg-[#111111] text-[#a3a3a3] hover:border-[#c9a263]/50 border border-[#a3a3a3]/10'
                    }`}
                 >
                   {cat} <span className={activeCategory === cat ? 'text-[#0a0a0a]/70' : 'text-[#a3a3a3]/50'}>({count})</span>
                 </button>
               )
             })}
           </div>
         </div>

         {/* Results List */}
         <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 no-scrollbar pb-32 md:pb-8 pt-0">
            {filteredData.map(partner => (
              <button 
                key={partner.id} 
                onClick={() => {
                   setActivePartner(partner);
                }}
                className={`w-full text-left bg-[#111111] border ${activePartner?.id === partner.id ? 'border-[#c9a263] bg-[#1a1a1a]' : 'border-[#a3a3a3]/10'} rounded-2xl overflow-hidden hover:border-[#c9a263]/50 transition-all flex flex-col group`}
              >
                 <div className="flex items-stretch h-[110px]">
                    <div className="w-[100px] shrink-0 relative">
                       <img src={partner.coverImage} alt={partner.publicName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                       {partner.featured && <span className="absolute top-2 left-2 bg-[#c9a263] text-black text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">Destaque</span>}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-center min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] uppercase tracking-widest font-bold text-[#c9a263] truncate">{partner.category}</span>
                       </div>
                       <h3 className="font-serif text-base text-white mb-1 truncate">{partner.publicName}</h3>
                       <p className="text-[11px] text-[#a3a3a3] truncate mb-1.5">{partner.neighborhood} · {partner.city}</p>
                       <div className="flex items-center gap-2 text-[10px]">
                          {partner.rating && <span className="flex items-center gap-1 text-white"><Store size={10} className="text-[#c9a263]"/> {partner.rating}</span>}
                          {partner.priceRange && <span className="text-[#a3a3a3] border-l border-white/10 pl-2">{partner.priceRange}</span>}
                       </div>
                    </div>
                 </div>
                 <div className="px-4 py-3 border-t border-[#a3a3a3]/10 bg-[#1a1a1a] flex justify-between items-center group-hover:bg-[#c9a263]/5 transition-colors">
                    <span className="text-[10px] text-[#a3a3a3] font-medium truncate flex-1 flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[#c9a263]"/> Parceiro CofCof</span>
                    <span className="text-[10px] text-[#c9a263] font-bold uppercase tracking-widest ml-2 whitespace-nowrap group-hover:underline">Ver no mapa</span>
                 </div>
              </button>
            ))}

            {filteredData.length === 0 && (
               <div className="text-center py-10 px-4 bg-[#111111] rounded-2xl border border-[#a3a3a3]/10">
                 <MapPin className="mx-auto text-[#c9a263] mb-4" size={32} />
                 <h3 className="font-serif text-xl text-white mb-2">Nenhum parceiro encontrado com esse termo.</h3>
                 <p className="text-[#a3a3a3] text-sm mb-6">Você pode buscar por cidade, bairro ou tipo de local.</p>
                 <div className="flex flex-col gap-3">
                   <button onClick={() => { setSearchTerm(''); setActiveCategory('Todos'); }} className="premium-cta-ghost w-full py-3 text-xs justify-center text-center">Limpar busca</button>
                   <Link to="/cafes" className="premium-cta w-full flex justify-center py-3 text-xs">Comprar online</Link>
                 </div>
               </div>
            )}
            
            <div className="pt-8 pb-4">
              <div className="bg-[#1a1a1a] border border-[#c9a263]/20 rounded-2xl p-6 text-center">
                <h4 className="font-serif text-white text-lg mb-2">Quer ser parceiro CofCof?</h4>
                <p className="text-[#a3a3a3] text-xs leading-relaxed mb-4">Entre para uma rede selecionada de lugares que valorizam origem, frescor e experiência na xícara.</p>
                <Link to="/empresas" className="premium-cta w-full flex justify-center py-3 text-[10px]">Quero ser parceiro CofCof</Link>
              </div>
            </div>
         </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-[45dvh] md:h-full z-0 order-last">
        <MapContainer 
          center={[-18.9, -48.2]} 
          zoom={8} 
          scrollWheelZoom={true} 
          className="w-full h-full"
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png" />
          
          {activePartner && (
            <ChangeView center={[activePartner.lat, activePartner.lng]} zoom={15} />
          )}

          {filteredData.map(partner => (
            <Marker 
              key={partner.id} 
              position={[partner.lat, partner.lng]}
              icon={createCustomIcon(partner, activePartner?.id === partner.id)}
              zIndexOffset={activePartner?.id === partner.id ? 1000 : 0}
              eventHandlers={{ click: () => setActivePartner(partner) }}
            />
          ))}
        </MapContainer>

        {/* Preview Bottom Sheet/Floating Panel */}
        <AnimatePresence>
          {activePartner && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-4 left-4 right-4 md:left-auto md:bottom-8 md:right-8 z-40 bg-[#111111] rounded-[2rem] overflow-hidden flex flex-col md:w-[420px] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-[#a3a3a3]/20 max-h-[80vh] md:max-h-[calc(100vh-100px)]"
            >
               {/* Cover Image Header */}
               <div className="h-36 bg-[#0a0a0a] relative w-full overflow-hidden shrink-0 group">
                 <img src={activePartner.coverImage} alt={activePartner.publicName} className="w-full h-full object-cover mix-blend-lighten opacity-80" />
                 <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent" />
                 
                 <button onClick={() => setActivePartner(null)} className="absolute top-4 right-4 bg-[#0a0a0a]/60 hover:bg-[#0a0a0a] backdrop-blur text-white p-2 rounded-full transition-colors border border-white/10 z-10">
                    <X size={16} />
                 </button>
                 
                 <div className="absolute bottom-4 left-6 flex flex-col gap-1 z-10 text-white">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0a0a0a]/80 backdrop-blur border border-[#c9a263]/30 text-[9px] font-bold uppercase tracking-widest text-[#c9a263]">
                        {activePartner.category}
                      </span>
                      {activePartner.isOpen24h && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 backdrop-blur border border-green-500/30 text-[9px] font-bold uppercase tracking-widest text-green-500">24 horas</span>
                      )}
                      {activePartner.isRoutePartner && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1a1a1a]/80 backdrop-blur border border-white/10 text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3]">Rota</span>
                      )}
                   </div>
                   <h2 className="text-2xl font-serif leading-none mt-1">{activePartner.publicName}</h2>
                 </div>
               </div>

               {/* Body Content */}
               <div className="p-6 pt-5 bg-[#111111] overflow-y-auto no-scrollbar min-h-[150px]">
                 <p className="text-sm text-[#a3a3a3] mb-5 leading-relaxed">{activePartner.shortDescription}</p>
                 
                 <div className="space-y-4 mb-6 pt-5 border-t border-[#a3a3a3]/10">
                    <div className="flex items-start gap-4">
                      <MapPin size={18} className="text-[#c9a263] shrink-0 mt-0.5" />
                      <div>
                         <p className="text-xs text-white leading-snug">{activePartner.address}</p>
                         <p className="text-[10px] text-[#a3a3a3] mt-0.5">{activePartner.neighborhood} · {activePartner.city}/{activePartner.state}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock size={18} className="text-[#c9a263] shrink-0 mt-0.5" />
                      <div>
                         <p className="text-xs text-white">{activePartner.openingHours}</p>
                      </div>
                    </div>
                 </div>

                 {activePartner.availableProducts && activePartner.availableProducts.length > 0 && (
                   <div className="mb-2">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-3">Opções CofCof:</div>
                     <div className="flex flex-wrap gap-1.5">
                       {activePartner.availableProducts.map((prod, i) => (
                         <span key={i} className="text-[9px] font-bold uppercase tracking-widest bg-[#1a1a1a] text-[#c9a263] px-2 py-1 rounded border border-[#c9a263]/20">{prod}</span>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               {/* Sticky Footer CTAs */}
               <div className="p-4 bg-[#111111] border-t border-[#a3a3a3]/10 shrink-0">
                  <div className="flex gap-2 mb-3">
                    <button onClick={() => handleOpenGoogleMaps(activePartner)} className="premium-cta w-full justify-center text-xs py-3.5 bg-[#c9a263] text-black border-transparent hover:bg-white hover:text-black">
                       Como chegar
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-1">
                     <Link to={`/parceiros/${activePartner.slug}`} className="text-[#a3a3a3] hover:text-white text-[11px] font-medium underline underline-offset-4 transition-colors">
                       Ver perfil do parceiro
                     </Link>
                     <div className="flex items-center gap-3">
                       {activePartner.instagram && (
                         <a href={`https://instagram.com/${activePartner.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-[#a3a3a3] hover:text-white transition-colors">
                           <ExternalLink size={16} />
                         </a>
                       )}
                       {activePartner.whatsapp && (
                         <a href={`https://wa.me/${activePartner.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-[#a3a3a3] hover:text-white transition-colors">
                           <MessageCircle size={16} />
                         </a>
                       )}
                       <button onClick={() => handleShare(activePartner)} className="text-[#a3a3a3] hover:text-[#c9a263] transition-colors ml-1">
                         <Share2 size={16} />
                       </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
