import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { mockPartners } from '../data/seed';
import L from 'leaflet';
import { Search, Navigation, ExternalLink, X, MapPin, Clock, Coffee, Plus } from 'lucide-react';
import { Partner } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// Component to dynamically change map view with offset for panel
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    // Calculate new center taking into account the floating panel
    const targetPoint = map.project(center, zoom);
    
    if (isDesktop) {
      targetPoint.x += 180; // Panel is on the right, so shift map center to the right
    } else {
      targetPoint.y += 120; // Panel is on the bottom, so shift map center to the bottom
    }
    
    const offsetCenter = map.unproject(targetPoint, zoom);

    map.flyTo(offsetCenter, zoom, {
      animate: true,
      duration: 1.2
    });
  }, [center[0], center[1], zoom, map]);

  return null;
}

export default function MapPartners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activePartner, setActivePartner] = useState<Partner | null>(null);

  const filterPartners = () => {
    return mockPartners.filter(p => {
      const matchName = (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      const matchCity = (p.city || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      const matchNeighborhood = (p.neighborhood || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      const matchType = selectedType === 'all' || p.type === selectedType;
      return (matchName || matchCity || matchNeighborhood) && matchType;
    });
  };

  const filteredData = filterPartners();

  const handleOpenGoogleMaps = (partner: Partner) => {
    const q = `${partner.name}, ${partner.address}, ${partner.city}`.replace(/\s/g, '+');
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  };

  const createCustomIcon = (isActive: boolean) => {
    return L.divIcon({
      className: 'bg-transparent border-0',
      html: `
        <div class="custom-pin-marker" style="
          background-color: ${isActive ? '#c9a263' : '#111111'};
          width: ${isActive ? '44px' : '36px'};
          height: ${isActive ? '44px' : '36px'};
          border-radius: 50%;
          border: 3px solid ${isActive ? '#0a0a0a' : '#c9a263'};
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${isActive ? '#0a0a0a' : '#c9a263'};
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: ${isActive ? 'scale(1.1) translateY(-6px)' : 'scale(1)'};
          cursor: pointer;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="${isActive ? '22' : '18'}" height="${isActive ? '22' : '18'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            <line x1="6" y1="2" x2="6" y2="4"/>
            <line x1="10" y1="2" x2="10" y2="4"/>
            <line x1="14" y1="2" x2="14" y2="4"/>
          </svg>
        </div>
      `,
      iconSize: isActive ? [44, 44] : [36, 36],
      iconAnchor: isActive ? [22, 22] : [18, 18],
    });
  };

  const types = ['all', ...Array.from(new Set(mockPartners.map(p => p.type)))];

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden">
      
      {/* Global Style injections for leaflet overrides & animations */}
      <style>{`
        .leaflet-container { background: #0a0a0a; font-family: inherit; }
        .custom-pin-marker:hover { transform: scale(1.15) translateY(-4px) !important; background-color: #c9a263 !important; color: #0a0a0a !important; border-color: #0a0a0a !important;}
        .leaflet-control-zoom { border: none !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important; border-radius: 12px !important; overflow: hidden; margin-bottom: 32px !important; margin-right: 32px !important; }
        .leaflet-control-zoom a { background-color: rgba(17, 17, 17, 0.9) !important; color: #a3a3a3 !important; transition: all 0.2s !important; border: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important;}
        .leaflet-control-zoom a:last-child { border-bottom: none !important; }
        .leaflet-control-zoom a:hover { background-color: #1a1a1a !important; color: #c9a263 !important; }
        .leaflet-control-attribution { background: transparent !important; text-shadow: 0 1px 2px rgba(0,0,0,0.8); color: #a3a3a3 !important; opacity: 0.6; font-size: 10px !important; }
        .leaflet-control-attribution a { color: #c9a263 !important; font-weight: 500; }
        
        @media (max-width: 768px) {
          .leaflet-control-zoom { display: none !important; }
        }
      `}</style>

      {/* Map Content - z-0 */}
      <div className="absolute inset-0 z-0 h-full w-full opacity-80 md:flex flex-col">
        <div className="flex-1 w-full h-[50vh] md:h-full relative">
          <MapContainer 
            center={[-19.92, -43.93]} // BH default
            zoom={13} 
            scrollWheelZoom={true} 
            className="w-full h-full"
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {activePartner && (
              <ChangeView center={[activePartner.lat, activePartner.lng]} zoom={15} />
            )}

            {filteredData.map(partner => (
              <Marker 
                key={partner.id} 
                position={[partner.lat, partner.lng]}
                icon={createCustomIcon(activePartner?.id === partner.id)}
                zIndexOffset={activePartner?.id === partner.id ? 1000 : 0}
                eventHandlers={{
                  click: () => setActivePartner(partner)
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Search & Filters - z-30 */}
      <div className="absolute top-[96px] md:top-[128px] left-4 right-4 md:right-auto md:left-8 z-30 pointer-events-none flex flex-col gap-4 max-w-full md:max-w-[400px]">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto bg-[#111111]/90 backdrop-blur-2xl border border-[#c9a263]/20 rounded-3xl shadow-2xl p-2 relative shadow-[#0a0a0a]/50"
        >
           <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
           <input 
              type="text" 
              placeholder="Buscar cidade, bairro ou parceiro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent pl-12 pr-4 py-3 focus:outline-none text-white placeholder:text-[#a3a3a3] text-lg font-medium"
           />
           {searchTerm && (
             <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] hover:text-white">
               <X size={18} />
             </button>
           )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pointer-events-auto flex flex-wrap gap-2 md:max-w-[400px] max-h-[80px] md:max-h-none overflow-y-auto no-scrollbar"
        >
           {types.map((type) => (
             <button 
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-shrink-0 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  selectedType === type 
                    ? 'bg-[#c9a263] text-[#0a0a0a] shadow-lg shadow-[#c9a263]/20 scale-105' 
                    : 'bg-[#1a1a1a]/90 backdrop-blur-md text-[#a3a3a3] border border-[#a3a3a3]/10 hover:bg-[#1a1a1a] hover:text-white'
                }`}
             >
               {type === 'all' ? 'Todos' : type}
             </button>
           ))}
        </motion.div>

        {/* Partners List */}
        {searchTerm && filteredData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto bg-[#111111]/90 backdrop-blur-2xl border border-[#c9a263]/20 rounded-3xl shadow-xl mt-2 max-h-[40vh] overflow-y-auto no-scrollbar md:max-w-[400px]"
          >
            <div className="p-4 border-b border-[#a3a3a3]/10">
              <span className="text-[10px] uppercase font-bold text-[#a3a3a3] tracking-widest">{filteredData.length} resultados</span>
            </div>
            {filteredData.map(partner => (
              <button 
                key={partner.id} 
                onClick={() => setActivePartner(partner)} 
                className="w-full text-left p-4 hover:bg-[#1a1a1a] transition-colors border-b border-[#a3a3a3]/10 last:border-0"
              >
                <div className="font-serif text-white mb-1">{partner.name}</div>
                <div className="text-xs text-[#a3a3a3]">{partner.city}, {partner.state} - {partner.neighborhood}</div>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Empty State */}
      <AnimatePresence>
        {filteredData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <div className="premium-card p-8 text-center max-w-sm pointer-events-auto border-[#c9a263]/20">
               <div className="w-16 h-16 rounded-2xl bg-[#c9a263]/10 border border-[#c9a263]/20 flex justify-center items-center mx-auto mb-4 text-[#c9a263]">
                  <MapPin size={24} />
               </div>
               <h3 className="font-serif text-2xl text-white mb-2">Ainda não temos parceiro aqui.</h3>
               <p className="text-[#a3a3a3] text-sm mb-6 leading-relaxed">
                 Indique um ponto ou compre online.
               </p>
               <div className="space-y-3">
                 <Link to="/cafes" className="premium-cta w-full gap-2 text-[11px]">
                   Comprar online
                 </Link>
                 <div className="flex gap-3">
                   <Link to="/empresas" className="premium-cta-ghost flex-1 justify-center text-[10px] !px-2">
                     Indicar parceiro
                   </Link>
                   <Link to="/empresas" className="bg-[#111111] hover:bg-[#1a1a1a] text-white border border-[#a3a3a3]/20 rounded-xl px-2 py-3 flex-1 flex justify-center items-center font-bold uppercase tracking-widest transition-colors text-[10px]">
                     Quero revender CofCof
                   </Link>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Active Partner Details - z-40 */}
      <AnimatePresence>
        {activePartner && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:top-[128px] md:w-[420px] z-40 pointer-events-auto premium-card !p-0 !rounded-[2.5rem] overflow-hidden flex flex-col max-h-[70dvh] md:max-h-[calc(100dvh-160px)] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-[#c9a263]/20"
          >
             {/* Header Image (Placeholder) */}
             <div className="h-28 md:h-32 bg-[#0a0a0a] relative w-full overflow-hidden shrink-0 border-b border-[#a3a3a3]/10">
               <img 
                 src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Interior" 
                 className="w-full h-full object-cover opacity-60 mix-blend-lighten text-white text-[10px]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
               
               <button 
                  onClick={() => setActivePartner(null)}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-full transition-colors border border-white/10"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0a]/80 backdrop-blur border border-[#c9a263]/30 text-[10px] font-bold uppercase tracking-widest text-[#c9a263]">
                  <Coffee size={12}/> {activePartner.type}
                </div>
             </div>

             {/* Content */}
             <div className="p-6 pt-4 overflow-y-auto no-scrollbar flex-1 bg-[#111111]">
               <h2 className="text-2xl md:text-3xl font-serif text-white mb-4 leading-tight">{activePartner.name}</h2>
               
               <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 text-[#a3a3a3] text-sm font-medium">
                    <MapPin size={18} className="text-[#c9a263] shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      {activePartner.address}<br />
                      <span className="opacity-70">{activePartner.neighborhood}, {activePartner.city}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-[#a3a3a3] text-sm font-medium">
                    <Clock size={18} className="text-[#c9a263] shrink-0 mt-0.5" />
                    <div>{activePartner.openingHours}</div>
                  </div>
               </div>

               {/* Products */}
               <div className="mb-4">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-3 block">Servindo CofCof</div>
                 <div className="flex flex-wrap gap-2">
                   {activePartner.availableProducts.map(prod => (
                     <span key={prod} className="bg-[#1a1a1a] border border-[#a3a3a3]/10 text-white px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-medium shadow-sm">
                       {prod}
                     </span>
                   ))}
                 </div>
               </div>
             </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 bg-[#111111] p-6 pt-2 shrink-0 border-t border-[#a3a3a3]/10 rounded-b-[2.5rem]">
                <button 
                  onClick={() => handleOpenGoogleMaps(activePartner)}
                  className="premium-cta flex-1 flex justify-center items-center gap-2 text-sm !py-3"
                >
                  <Navigation size={18} /> Como chegar
                </button>
                {activePartner.ifoodUrl && (
                  <a 
                    href={activePartner.ifoodUrl}
                    target="_blank" rel="noreferrer"
                    className="flex-1 flex justify-center items-center gap-2 bg-[#ea1d2c] hover:bg-[#c91825] text-white rounded-xl transition-colors text-sm font-bold tracking-wider"
                    title="Pedir no iFood"
                  >
                    Pronto para consumo
                  </a>
                )}
                <a 
                  href={`https://instagram.com/${activePartner.instagram.replace('@', '')}`}
                  target="_blank" rel="noreferrer"
                  className="flex justify-center items-center w-12 premium-cta-ghost !p-0 !py-3 shrink-0"
                  title="Instagram"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
