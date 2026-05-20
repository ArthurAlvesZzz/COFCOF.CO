import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { mockPartners, getPublicPartners, getPartnerRouteUrl, hasConfirmedLocation } from "../data/seed";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Clock,
  ExternalLink,
  Share2,
  MessageCircle,
  ChevronLeft,
  CalendarDays,
  Store,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { SafePartnerImage } from "../components/SafePartnerImage";

export default function PartnerProfile() {
  const { slug } = useParams();
  const [partner, setPartner] = useState(
    mockPartners.find((p) => p.slug === slug),
  );

  useEffect(() => {
    if (partner) {
      document.title =
        partner.seoTitle ||
        `${partner.publicName} serve CofCof em ${partner.city}`;
      window.scrollTo(0, 0);
    }
  }, [partner]);

  if (!partner) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-white mb-4">
            Parceiro não encontrado
          </h1>
          <p className="text-[#a3a3a3] mb-8">
            Não conseguimos localizar a página deste local.
          </p>
          <Link to="/parceiros" className="premium-cta">
            Voltar para o mapa
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Conheça ${partner.publicName}, parceiro CofCof em ${partner.neighborhood}, ${partner.city}.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: partner.publicName, text, url });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    }
  };

  const handleOpenGoogleMaps = () => {
    if (!partner) return;
    const url = getPartnerRouteUrl(partner);
    window.open(url, "_blank");
  };

  const customIcon = L.divIcon({
    className: "bg-transparent border-0",
    html: `
      <div class="custom-pin-marker" style="
        background-color: #c9a263;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #0a0a0a;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      "></div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-[#111111] overflow-hidden">
        <SafePartnerImage
          partner={partner}
          className="w-full h-full object-cover opacity-60 mix-blend-lighten"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="absolute top-24 left-6 z-10">
          <Link
            to="/parceiros"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors bg-[#0a0a0a]/50 backdrop-blur px-3 py-1.5 rounded-full border border-white/10"
          >
            <ChevronLeft size={14} /> Voltar
          </Link>
        </div>

        <div className="absolute bottom-10 left-0 w-full px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#c9a263] text-black text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                  Parceiro CofCof
                </span>
                <span className="text-[10px] text-[#a3a3a3] uppercase font-bold tracking-widest px-2.5 py-1 rounded border border-[#a3a3a3]/30 bg-[#111111]/50 backdrop-blur">
                  {partner.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 leading-tight">
                {partner.publicName}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <p className="text-[#a3a3a3] text-sm md:text-lg font-light">
                  {partner.neighborhood} · {partner.city}, {partner.state}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#a3a3a3]">
                  {partner.rating && (
                    <span className="flex items-center gap-1 text-white">
                      <Store size={12} className="text-[#c9a263]" />{" "}
                      {partner.rating}
                    </span>
                  )}
                  {partner.priceRange && (
                    <span className="border-l border-white/20 pl-2">
                      {partner.priceRange}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          {/* Left Content */}
          <div className="space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-serif text-white mb-6">
                A experiência
              </h2>
              <p className="text-[#a3a3a3] text-base leading-relaxed md:text-lg font-light mb-4 text-justify">
                {partner.longDescription || partner.shortDescription}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {partner.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[#a3a3a3] bg-[#111111] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Products & Methods */}
            <section className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-[#c9a263]/20 p-8 md:p-10 rounded-[2rem] relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c9a263]/5 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-2xl font-serif text-[#c9a263] mb-8 flex items-center gap-3 relative z-10">
                <CheckCircle2 size={24} className="text-[#c9a263]" />
                Padrão de Qualidade CofCof
              </h2>

              <div className="grid sm:grid-cols-2 gap-10 relative z-10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
                    <Store size={14} /> Seleção Disponível
                  </div>
                  <div className="flex flex-col gap-3">
                    {partner.availableProducts.map((prod) => (
                      <div
                        key={prod}
                        className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-[#c9a263] shrink-0"
                        />
                        <span className="text-sm font-medium text-white">
                          {prod}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {partner.consumptionMethods &&
                  partner.consumptionMethods.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
                        <MapPin size={14} /> No Local
                      </div>
                      <div className="flex flex-col gap-3">
                        {partner.consumptionMethods.map((method) => (
                          <div
                            key={method}
                            className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
                          >
                            <CheckCircle2
                              size={16}
                              className="text-[#a3a3a3] shrink-0"
                            />
                            <span className="text-sm font-medium text-white">
                              {method}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="mt-10 pt-8 border-t border-[#c9a263]/10 relative z-10">
                <p className="text-sm text-[#a3a3a3] leading-relaxed mb-6 font-light">
                  Nossos grãos 86+ pontos, recém-torrados sob demanda,
                  preparados com o cuidado que você merece. Garanta o seu café
                  fresco em casa.
                </p>
                <Link
                  to="/cafes"
                  className="premium-cta w-full sm:w-auto inline-flex justify-center text-sm px-8 py-3.5 bg-[#c9a263] text-black hover:bg-white hover:text-black"
                >
                  Gostou? Assine para receber em casa
                </Link>
              </div>
            </section>

            {/* Gallery */}
            {partner.gallery && partner.gallery.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif text-white mb-6">
                  O Espaço
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {partner.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-[#111111] rounded-2xl overflow-hidden border border-white/5"
                    >
                      <SafePartnerImage
                        partner={partner}
                        imageUrl={img}
                        alt="Galeria"
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar - Info */}
          <div className="space-y-6 relative">
            <div className="sticky top-24">
              {/* Address Card */}
              <div className="bg-[#111111] border border-[#a3a3a3]/10 rounded-3xl overflow-hidden mb-6">
                {hasConfirmedLocation(partner) && (
                  <div className="h-[200px] w-full bg-[#1a1a1a]">
                    <style>{` .leaflet-container { background: #0a0a0a; font-family: inherit; } `}</style>
                    <MapContainer
                      center={[partner.lat, partner.lng]}
                      zoom={16}
                      scrollWheelZoom={false}
                      className="w-full h-full"
                      zoomControl={false}
                    >
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png" />
                      <Marker
                        position={[partner.lat, partner.lng]}
                        icon={customIcon}
                      />
                    </MapContainer>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin size={20} className="text-[#c9a263] shrink-0" />
                    <div>
                      <h4 className="text-white text-sm leading-relaxed mb-1">
                        {partner.fullAddress || partner.address}
                      </h4>
                      <p className="text-xs text-[#a3a3a3]">
                        {partner.neighborhood} · {partner.city}/{partner.state}
                      </p>
                    </div>
                  </div>
                  {partner.locationStatus &&
                    partner.locationStatus !== "confirmed" &&
                    !partner.coordinatesConfirmed && (
                      <div className="mb-4 text-[10px] text-yellow-500 bg-yellow-500/10 p-2 rounded flex items-center gap-1.5 border border-yellow-500/20">
                        Endereço pendente de validação. A localização pode ser
                        aproximada.
                      </div>
                    )}
                  <button
                    onClick={handleOpenGoogleMaps}
                    className="premium-cta w-full justify-center bg-[#c9a263] text-black border-none py-3 text-xs"
                    disabled={partner.locationStatus === "invalid"}
                  >
                    Como chegar
                  </button>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-[#111111] border border-[#a3a3a3]/10 rounded-3xl p-6 mb-6 text-sm">
                <div className="flex items-center gap-3 text-white mb-4 pb-4 border-b border-white/5">
                  <Clock size={20} className="text-[#c9a263] shrink-0" />
                  <span className="font-serif text-lg">Horário</span>
                </div>
                <div className="text-[#a3a3a3] leading-relaxed">
                  {partner.openingHours}
                </div>
                {partner.weeklySchedule && (
                  <div className="mt-4 pt-4 border-t border-white/5 text-[#a3a3a3] whitespace-pre-line text-xs">
                    {partner.weeklySchedule}
                  </div>
                )}
                {partner.isOpen24h && (
                  <div className="mt-4 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 inline-block px-2 py-1 rounded inline-flex items-center gap-1.5">
                    <Clock size={12} /> Aberto 24 horas
                  </div>
                )}
              </div>

              {/* Contact Links */}
              <div className="flex flex-col gap-3">
                {partner.instagram && (
                  <a
                    href={`https://instagram.com/${partner.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="premium-cta-ghost w-full justify-center gap-2 border-[#a3a3a3]/20 py-3 text-xs"
                  >
                    <ExternalLink size={14} /> @
                    {partner.instagram.replace("@", "")}
                  </a>
                )}
                {partner.whatsapp && (
                  <a
                    href={`https://wa.me/${partner.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="premium-cta-ghost w-full justify-center gap-2 border-[#a3a3a3]/20 py-3 text-xs"
                  >
                    <MessageCircle size={14} /> Chamar no WhatsApp
                  </a>
                )}
                <button
                  onClick={handleShare}
                  className="premium-cta-ghost w-full justify-center gap-2 border-[#a3a3a3]/20 py-3 text-xs"
                >
                  <Share2 size={14} /> Compartilhar página
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gostou Section */}
        <section className="mt-16 bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-[#a3a3a3]/10 p-10 md:p-14 rounded-[3rem] text-center mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#c9a263]/5" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Gostou desse parceiro?
            </h2>
            <p className="text-[#a3a3a3] mb-8 font-light leading-relaxed">
              Abra a rota para chegar lá, compartilhe com alguém que adora café especial ou explore outros pontos CofCof na sua região.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleOpenGoogleMaps}
                className="premium-cta w-full sm:w-auto justify-center bg-[#c9a263] text-black border-transparent hover:bg-white text-sm py-4 px-8"
              >
                Como chegar
              </button>
              <button
                onClick={handleShare}
                className="premium-cta-ghost w-full sm:w-auto justify-center text-sm py-4 px-8 border-[#a3a3a3]/20 hover:border-[#c9a263]/50"
              >
                <Share2 size={16} className="mr-2" /> Compartilhar parceiro
              </button>
              <Link
                to="/parceiros"
                className="premium-cta-ghost w-full sm:w-auto justify-center text-sm py-4 px-8 border-[#a3a3a3]/20 hover:border-[#c9a263]/50"
              >
                Ver outros parceiros
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
