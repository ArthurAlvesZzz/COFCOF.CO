import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Coffee, 
  Bed, 
  Laptop, 
  Store, 
  UsersRound, 
  CheckCircle2, 
  Minus, 
  Plus, 
  ArrowRight, 
  MessageSquare,
  Star,
  MapPin,
  TrendingUp,
  Package,
  ChevronDown,
  Globe,
  Quote,
  ShieldCheck,
  Flame,
  Award,
  Truck,
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { b2bLeadService } from '../services/b2bLeadService';

export default function B2B() {
  const [calcData, setCalcData] = useState({
    type: 'escritorio',
    people: 20,
    cupsPerPerson: 2,
    daysPerMonth: 22
  });

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    whatsapp: '',
    city: '',
    segment: '',
    consumption: '',
    notes: ''
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const businessTypes = [
    { id: 'escritorio', name: 'Escritórios', icon: Building2 },
    { id: 'cafeteria', name: 'Cafeterias', icon: Coffee },
    { id: 'restaurante', name: 'Restaurantes', icon: Coffee },
    { id: 'hotel', name: 'Hotéis', icon: Bed },
    { id: 'coworking', name: 'Coworkings', icon: Laptop },
    { id: 'revenda', name: 'Revenda', icon: Store },
  ];

  const estimatedCups = calcData.people * calcData.cupsPerPerson * calcData.daysPerMonth;
  const estimatedKg = Math.ceil((estimatedCups * 10) / 1000);

  let recommendedPackage = '';
  let activeProfile = 'Alta aceitação e notas doces';
  if (estimatedKg <= 5) recommendedPackage = 'B2B Essencial 5kg';
  else if (estimatedKg <= 10) recommendedPackage = 'B2B Elevado 10kg';
  else if (estimatedKg <= 20) recommendedPackage = 'B2B Premium 20kg';
  else if (estimatedKg <= 50) recommendedPackage = 'B2B Volume 50kg';
  else {
    recommendedPackage = 'Volume Personalizado';
    activeProfile = 'Perfil sob medida pelo Mestre de Torra';
  }

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      consumption: `${estimatedKg} kg/mês (Aprox. ${estimatedCups} xícaras)`
    }));
  }, [estimatedKg, estimatedCups]);

  const updatePeople = (amount: number) => {
    setCalcData(prev => {
      const newVal = prev.people + amount;
      if (newVal < 1) return { ...prev, people: 1 };
      if (newVal > 500) return { ...prev, people: 500 };
      return { ...prev, people: newVal };
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleWhatsAppClick = (context: string) => {
    const text = `Olá! Gostaria de conversar com o comercial B2B. Assunto: ${context}`;
    window.open(`https://wa.me/5534998728882?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await b2bLeadService.createLead({
         contactName: formData.name,
         companyName: formData.company,
         whatsapp: formData.whatsapp,
         segment: formData.segment as any,
         city: formData.city,
         source: 'empresas_page',
         status: 'new',
         estimatedConsumption: {
           businessType: calcData.type,
           peoplePerDay: calcData.people,
           cupsPerPerson: calcData.cupsPerPerson,
           daysPerMonth: calcData.daysPerMonth,
           gramsPerCup: 10,
           monthlyKg: estimatedKg,
           monthlyCups: estimatedCups,
           recommendedPackage,
           recommendedFrequency: "Mensal"
         },
         notes: formData.notes ? [{
           id: "n1",
           text: formData.notes,
           userId: "system",
           userName: "Site",
           createdAt: new Date().toISOString()
         }] : []
      });
      setFormSuccess(true);
    } catch (err: any) {
      alert("Erro ao enviar contato: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const segmentsStrip = [
    "Cafeterias", "Escritórios", "Clínicas", "Hotéis", "Restaurantes", 
    "Coworkings", "Revenda", "Presentes corporativos", "Exportação"
  ];

  const faqItems = [
    { q: "Qual o pedido mínimo?", a: "O pedido B2B mínimo padrão é a partir de 10kg, mas trabalhamos com diferentes faixas de volume ajustadas." },
    { q: "Vocês vendem com nota fiscal?", a: "Sim, todos os volumes corporativos incluem emissão de nota fiscal obrigatória, resguardando sua contabilidade." },
    { q: "O café é torrado quando?", a: "Sempre na semana do envio (Torra sob demanda). Não temos estoque parado de café torrado para clientes B2B." },
    { q: "Posso escolher o lote?", a: "Para volumes definidos, você pode criar um perfil fixo. Para baixo volume ou modelo assinatura B2B, enviamos lotes da curadoria mensal." },
    { q: "Vocês entregam fora de Uberlândia/Minas/Brasil?", a: "Sim, enviamos para todo o Brasil via transportadora. Exportação é sob consulta da documentação." },
    { q: "Atendem cafeterias?", a: "Sim, é um dos nossos focos. Auxiliamos inclusive na narrativa sensorial do cardápio." },
    { q: "Atendem hotéis e restaurantes?", a: "Sim, com formatos flexíveis de grão e possibilidade de pacotes de 1kg a fardos de 5kg." },
    { q: "Tem preço por kg?", a: "Cada faixa (10-20kg, 20-50kg) possui valores gradativos melhores. O consumo afeta diretamente o custo/xícara." },
    { q: "Posso ajustar o volume mensal?", a: "Sim, sem burocracia. O plano pode crescer junto com seu negócio ou encolher nos meses de férias." },
    { q: "Como funciona exportação?", a: "Operamos envio direto do Cerrado Mineiro. Preço FOB ou CIF a avaliar; fale direto com a equipe comercial." }
  ];

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen font-sans overflow-x-hidden pt-32">
      
      {/* 1. HERO ALTO PADRÃO ESCURO */}
      <section className="bg-[#111111] text-white pt-10 pb-24 px-6 relative border-b border-[#a3a3a3]/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Café B2B CofCof" 
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
              B2B · Empresas · Revenda · Hotelaria
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-6 leading-[1.1] tracking-tight">
              Sirva um café que comunica cuidado{" "}
              <span className="text-[#c9a263] italic font-light drop-shadow-sm">antes da primeira reunião.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#a3a3a3] mx-auto mb-10 leading-relaxed font-light max-w-3xl">
              Cafeterias, escritórios, clínicas, hotéis, coworkings e restaurantes com cafés premiados, torrados sob demanda e fornecimento recorrente.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button 
                onClick={() => scrollToSection('b2b-form')}
                className="w-full sm:w-auto bg-[#c9a263] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold hover:bg-[#e0b875] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-sm"
              >
                Solicitar proposta B2B
              </button>
              <button 
                onClick={() => handleWhatsAppClick('Dúvida sobre proposta comercial/B2B')}
                className="w-full sm:w-auto border border-[#a3a3a3]/30 text-white bg-white/5 backdrop-blur-md px-8 py-4 rounded-xl font-medium hover:bg-white/10 hover:border-[#a3a3a3]/50 transition-colors uppercase text-sm flex items-center justify-center gap-2"
               >
                Falar com comercial no WhatsApp
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-6 border-t border-white/10 mx-auto w-fit">
              <span className="flex items-center gap-2">86+ SCA</span>
              <span className="flex items-center gap-2">Cup of Excellence</span>
              <span className="flex items-center gap-2">Cerrado Mineiro D.O.</span>
              <span className="flex items-center gap-2">Torra sob demanda</span>
              <span className="flex items-center gap-2 text-[#c9a263]">A partir de 10kg/mês</span>
              <span className="flex items-center gap-2">Rastreabilidade QR</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FAIXA DE SEGMENTOS */}
      <div className="bg-[#111111] overflow-hidden border-b border-[#a3a3a3]/10 py-4">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {[...segmentsStrip, ...segmentsStrip, ...segmentsStrip].map((item, idx) => (
            <div key={idx} className="flex items-center mx-6 text-xs text-white uppercase tracking-widest font-medium">
              {item}
              <span className="mx-6 text-[#c9a263] opacity-50">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SEÇÃO "PARA QUEM É" */}
      <section className="bg-[#F6F1EB] py-24 px-6 text-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-5xl font-serif text-[#111111] mb-6 leading-tight">Uma solução de café especial para cada tipo de operação.</h2>
             <p className="text-[#111111]/70 text-lg font-light">Cada negócio serve café por um motivo diferente. A CofCof ajusta lote, volume e frequência para a experiência que você quer entregar.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 flex flex-col hover:border-[#c9a263]/30 transition-all">
              <Coffee className="text-[#B06A32] mb-6" size={32} strokeWidth={1.5}/>
              <h3 className="font-serif font-bold text-xl mb-3 text-[#111111]">Cafeterias</h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 flex-1">Diferencie seu menu com microlotes premiados, origem rastreável e perfil sensorial claro.</p>
              <button onClick={() => scrollToSection('b2b-form')} className="text-xs uppercase font-bold text-[#B06A32] hover:text-[#111111] transition-colors text-left tracking-widest">
                Quero revender CofCof <ArrowRight size={14} className="inline ml-1"/>
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 flex flex-col hover:border-[#c9a263]/30 transition-all">
              <Building2 className="text-[#B06A32] mb-6" size={32} strokeWidth={1.5}/>
              <h3 className="font-serif font-bold text-xl mb-3 text-[#111111]">Escritórios</h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 flex-1">Transforme o café da equipe e das reuniões em uma experiência de marca.</p>
              <button onClick={() => scrollToSection('b2b-form')} className="text-xs uppercase font-bold text-[#B06A32] hover:text-[#111111] transition-colors text-left tracking-widest">
                Montar plano para escritório <ArrowRight size={14} className="inline ml-1"/>
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 flex flex-col hover:border-[#c9a263]/30 transition-all">
              <ShieldCheck className="text-[#B06A32] mb-6" size={32} strokeWidth={1.5}/>
              <h3 className="font-serif font-bold text-xl mb-3 text-[#111111]">Clínicas premium</h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 flex-1">Um café melhor muda a percepção do atendimento antes da consulta começar.</p>
              <button onClick={() => scrollToSection('b2b-form')} className="text-xs uppercase font-bold text-[#B06A32] hover:text-[#111111] transition-colors text-left tracking-widest">
                Solicitar proposta para clínica <ArrowRight size={14} className="inline ml-1"/>
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 flex flex-col hover:border-[#c9a263]/30 transition-all">
              <Bed className="text-[#B06A32] mb-6" size={32} strokeWidth={1.5}/>
              <h3 className="font-serif font-bold text-xl mb-3 text-[#111111]">Hotéis e restaurantes</h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 flex-1">Entregue uma experiência memorável no café da manhã, sobremesa ou pós-refeição.</p>
              <button onClick={() => scrollToSection('b2b-form')} className="text-xs uppercase font-bold text-[#B06A32] hover:text-[#111111] transition-colors text-left tracking-widest">
                Quero CofCof no meu menu <ArrowRight size={14} className="inline ml-1"/>
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 flex flex-col hover:border-[#c9a263]/30 transition-all">
              <Laptop className="text-[#B06A32] mb-6" size={32} strokeWidth={1.5}/>
              <h3 className="font-serif font-bold text-xl mb-3 text-[#111111]">Coworkings</h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 flex-1">Use café especial como diferencial de retenção e experiência para membros.</p>
              <button onClick={() => scrollToSection('b2b-form')} className="text-xs uppercase font-bold text-[#B06A32] hover:text-[#111111] transition-colors text-left tracking-widest">
                Montar plano para coworking <ArrowRight size={14} className="inline ml-1"/>
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 flex flex-col hover:border-[#c9a263]/30 transition-all">
              <Package className="text-[#B06A32] mb-6" size={32} strokeWidth={1.5}/>
              <h3 className="font-serif font-bold text-xl mb-3 text-[#111111]">Presentes corporativos</h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 flex-1">Kits premium para clientes, parceiros e datas comemorativas.</p>
              <button onClick={() => scrollToSection('b2b-form')} className="text-xs uppercase font-bold text-[#B06A32] hover:text-[#111111] transition-colors text-left tracking-widest">
                Ver kits corporativos <ArrowRight size={14} className="inline ml-1"/>
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 flex flex-col hover:border-[#c9a263]/30 transition-all">
              <Store className="text-[#B06A32] mb-6" size={32} strokeWidth={1.5}/>
              <h3 className="font-serif font-bold text-xl mb-3 text-[#111111]">Revendas e empórios</h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 flex-1">Produto premium com história, origem e margem para uma gôndola mais forte.</p>
              <button onClick={() => scrollToSection('b2b-form')} className="text-xs uppercase font-bold text-[#B06A32] hover:text-[#111111] transition-colors text-left tracking-widest">
                Quero revender <ArrowRight size={14} className="inline ml-1"/>
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 flex flex-col hover:border-[#c9a263]/30 transition-all">
              <Globe className="text-[#B06A32] mb-6" size={32} strokeWidth={1.5}/>
              <h3 className="font-serif font-bold text-xl mb-3 text-[#111111]">Exportação e grandes volumes</h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 flex-1">Fornecimento recorrente para operações maiores, revenda e pedidos sob consulta.</p>
              <button onClick={() => scrollToSection('export-section')} className="text-xs uppercase font-bold text-[#B06A32] hover:text-[#111111] transition-colors text-left tracking-widest">
                Falar sobre grandes volumes <ArrowRight size={14} className="inline ml-1"/>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PROBLEMA DO FORNECEDOR ATUAL (Comparação) */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Seu café atual representa o padrão da sua empresa?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
               <div className="bg-[#111111] rounded-3xl p-8 border border-[#a3a3a3]/10 opacity-70">
                 <h3 className="text-2xl font-serif text-[#a3a3a3] mb-8 pb-4 border-b border-[#a3a3a3]/20">Fornecedor comum</h3>
                 <ul className="space-y-5">
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Origem genérica</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Torra antiga</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Sem rastreabilidade</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Atendimento padronizado</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50 shrink-0" /> Pouca diferenciação</li>
                 </ul>
               </div>

               <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#c9a263]/30 shadow-[0_0_40px_rgba(201,162,99,0.1)] relative">
                 <div className="absolute -top-4 -right-4 bg-[#c9a263] text-[#0a0a0a] rounded-full p-3 shadow-xl"><CheckCircle2 size={24}/></div>
                 <h3 className="text-2xl font-serif text-white mb-8 pb-4 border-b border-[#c9a263]/30">CofCof B2B</h3>
                 <ul className="space-y-5">
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Origem rastreada</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Torra sob demanda</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Perfil sensorial real</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Atendimento dedicado</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Proposta por volume</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> QR com origem e lote</li>
                 </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 5. COMO FUNCIONA */}
      <section className="bg-[#111111] border-y border-[#a3a3a3]/10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Como funciona</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col">
               <div className="text-[#c9a263] font-serif text-4xl mb-4 text-left">01</div>
               <h3 className="text-white font-bold mb-2">Conte sobre sua operação</h3>
               <p className="text-[#a3a3a3] text-sm leading-relaxed">Tipo de empresa, cidade, consumo mensal, preparo e objetivo.</p>
            </div>
            <div className="flex flex-col">
               <div className="text-[#c9a263] font-serif text-4xl mb-4 text-left">02</div>
               <h3 className="text-white font-bold mb-2">Receba uma proposta sob medida</h3>
               <p className="text-[#a3a3a3] text-sm leading-relaxed">Preço por kg, lote ideal, frequência, volume, pagamento e entrega.</p>
            </div>
            <div className="flex flex-col">
               <div className="text-[#c9a263] font-serif text-4xl mb-4 text-left">03</div>
               <h3 className="text-white font-bold mb-2">Receba café torrado sob demanda</h3>
               <p className="text-[#a3a3a3] text-sm leading-relaxed">Envios recorrentes, emissão de nota fiscal, lote rastreável e suporte.</p>
            </div>
            <div className="flex flex-col">
               <div className="text-[#c9a263] font-serif text-4xl mb-4 text-left">04</div>
               <h3 className="text-white font-bold mb-2">Ajuste conforme sua rotina</h3>
               <p className="text-[#a3a3a3] text-sm leading-relaxed">Aumente volume, troque lote, pause ou ajuste frequência.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DIFERENCIAIS B2B */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
         <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-2xl font-serif text-white mb-8 pb-4 border-b border-[#a3a3a3]/20 flex items-center gap-3">
                    <Award className="text-[#c9a263]" strokeWidth={1.5} size={28}/> Qualidade percebida
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> 86+ SCA</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Cup of Excellence</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Cerrado Mineiro D.O.</li>
                  </ul>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-white mb-8 pb-4 border-b border-[#a3a3a3]/20 flex items-center gap-3">
                    <Flame className="text-[#c9a263]" strokeWidth={1.5} size={28}/> Frescor e experiência
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Torra sob demanda</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Torra na semana do envio</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Perfil sensorial real</li>
                  </ul>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-white mb-8 pb-4 border-b border-[#a3a3a3]/20 flex items-center gap-3">
                    <Building2 className="text-[#c9a263]" strokeWidth={1.5} size={28}/> Operação B2B
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Emissão de nota fiscal</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Recorrência</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Atendimento dedicado</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Ajuste de volume</li>
                  </ul>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-white mb-8 pb-4 border-b border-[#a3a3a3]/20 flex items-center gap-3">
                    <ScanLine className="text-[#c9a263]" strokeWidth={1.5} size={28}/> Rastreabilidade
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> QR de origem</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Produtor e fazenda</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/> Lote, safra, processo</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 7. CALCULATOR & 9. FORMS */}
      <section id="calculator" className="py-24 px-6 bg-[#111111] border-y border-[#a3a3a3]/10 relative">
        <div className="absolute inset-0 bg-[#c9a263]/5 opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16">
            
            {/* Calculadora */}
            <div>
               <div className="mb-10">
                 <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Não sabe quanto sua empresa consome?</h2>
               </div>
               
               <div className="space-y-6">
                 <div>
                   <label className="block text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mb-3">Tipo de negócio</label>
                   <div className="flex flex-wrap gap-2">
                     {businessTypes.map((b) => (
                       <button
                         key={b.id}
                         onClick={() => setCalcData({...calcData, type: b.id})}
                         className={`px-4 py-2 border rounded-xl text-sm transition-all ${
                           calcData.type === b.id 
                             ? 'bg-[#c9a263] text-[#0a0a0a] border-[#c9a263] font-bold' 
                             : 'bg-[#1a1a1a] text-[#a3a3a3] border-[#a3a3a3]/10 hover:border-[#c9a263]/30'
                         }`}
                       >
                         {b.name}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="bg-[#1a1a1a] border border-[#a3a3a3]/10 p-6 rounded-2xl">
                     <div className="flex items-center justify-between mb-4">
                       <label className="block text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold">Pessoas/Clientes por dia</label>
                       <div className="flex items-center gap-3">
                         <button onClick={() => updatePeople(-5)} className="w-8 h-8 rounded-full border border-[#a3a3a3]/20 flex justify-center items-center text-[#a3a3a3] hover:text-[#c9a263]"><Minus size={14}/></button>
                         <span className="text-xl font-serif text-white w-10 text-center">{calcData.people}</span>
                         <button onClick={() => updatePeople(5)} className="w-8 h-8 rounded-full border border-[#a3a3a3]/20 flex justify-center items-center text-[#a3a3a3] hover:text-[#c9a263]"><Plus size={14}/></button>
                       </div>
                     </div>
                     <input type="range" min="1" max="500" value={calcData.people} onChange={(e) => setCalcData({...calcData, people: Number(e.target.value)})} className="w-full h-1 bg-[#a3a3a3]/20 rounded-lg appearance-none cursor-pointer accent-[#c9a263]" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1a1a1a] border border-[#a3a3a3]/10 p-6 rounded-2xl">
                        <label className="block text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mb-4">Xícaras por pessoa</label>
                        <select 
                          value={calcData.cupsPerPerson} 
                          onChange={(e) => setCalcData({...calcData, cupsPerPerson: Number(e.target.value)})}
                          className="w-full bg-[#111111] text-white border border-[#a3a3a3]/20 rounded-xl px-3 py-2 outline-none focus:border-[#c9a263] text-sm"
                        >
                            {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#a3a3a3]/10 p-6 rounded-2xl">
                        <label className="block text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mb-4">Dias úteis/Mês</label>
                        <select 
                          value={calcData.daysPerMonth} 
                          onChange={(e) => setCalcData({...calcData, daysPerMonth: Number(e.target.value)})}
                          className="w-full bg-[#111111] text-white border border-[#a3a3a3]/20 rounded-xl px-3 py-2 outline-none focus:border-[#c9a263] text-sm"
                        >
                            {[15,20,22,26,30].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                 </div>

                 <div className="bg-[#1a1a1a] border border-[#c9a263]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(201,162,99,0.05)] mt-4 flex items-center justify-between">
                     <div>
                       <span className="block text-[10px] uppercase tracking-widest text-[#c9a263] font-bold mb-1">Consumo Estimado</span>
                       <div className="flex items-baseline gap-2">
                         <span className="text-4xl font-serif text-white">{estimatedKg}kg</span>
                         <span className="text-[#a3a3a3] text-xs">/ mês</span>
                       </div>
                       <p className="text-[11px] text-[#a3a3a3] mt-2">({estimatedCups} xícara(s) de 10g)</p>
                     </div>
                     <div className="text-right">
                       <span className="block text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mb-1">Faixa</span>
                       <span className="block text-white font-medium text-sm">
                          {estimatedKg <= 20 ? '10–20kg' : estimatedKg <= 50 ? '20–50kg' : '50kg+'}
                       </span>
                     </div>
                 </div>
                 
                 <button onClick={() => scrollToSection('b2b-form')} className="w-full text-center border border-[#a3a3a3]/30 text-white hover:bg-[#1a1a1a] py-4 rounded-xl uppercase text-xs font-bold tracking-wider transition-colors pt-4 pb-4">
                    Usar este consumo na proposta
                 </button>
               </div>
            </div>
            
            {/* 9. Formulário B2B */}
            <div id="b2b-form" className="bg-[#1a1a1a] p-8 md:p-10 rounded-[2rem] border border-[#a3a3a3]/10 h-fit">
               {formSuccess ? (
                  <div className="text-center py-16 px-6">
                     <div className="w-16 h-16 bg-[#c9a263]/10 text-[#c9a263] border border-[#c9a263]/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8" />
                     </div>
                     <h3 className="text-2xl font-serif text-white mb-3">Recebemos sua solicitação.</h3>
                     <p className="text-[#a3a3a3] text-sm mb-8 leading-relaxed">A equipe CofCof vai montar uma proposta de fornecimento para seu perfil.</p>
                     <button onClick={() => handleWhatsAppClick('Dúvida pós envio do form B2B')} className="w-full border border-[#c9a263] text-[#c9a263] bg-transparent hover:bg-[#c9a263] hover:text-[#0a0a0a] transition-all py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-wider">
                       <MessageSquare size={16} /> Falar agora no WhatsApp
                     </button>
                  </div>
               ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-8 items-start">
                     <h3 className="text-2xl font-serif text-white mb-2">Monte uma proposta para sua empresa.</h3>
                     <p className="text-[#a3a3a3] text-sm">Informe seu segmento, cidade e consumo estimado. A equipe CofCof indica lote, volume e frequência ideal.</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                     <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} placeholder="Nome" className="bg-[#111111] text-white text-sm border border-[#a3a3a3]/10 rounded-xl px-4 py-3 outline-none focus:border-[#c9a263] w-full"/>
                     <input required type="text" value={formData.company} onChange={(e)=>setFormData({...formData, company: e.target.value})} placeholder="Empresa" className="bg-[#111111] text-white text-sm border border-[#a3a3a3]/10 rounded-xl px-4 py-3 outline-none focus:border-[#c9a263] w-full"/>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <select required value={formData.segment} onChange={(e)=>setFormData({...formData, segment: e.target.value})} className="bg-[#111111] text-[#a3a3a3] focus:text-white text-sm border border-[#a3a3a3]/10 rounded-xl px-4 py-3 outline-none focus:border-[#c9a263] w-full">
                        <option value="" disabled>Segmento principal</option>
                        <option value="coffee_shop">Cafeteria / Empório</option>
                        <option value="office">Escritório Corporativo</option>
                        <option value="clinic">Clínica / Recepção</option>
                        <option value="restaurant">Restaurante / Hotel</option>
                        <option value="other">Outro</option>
                     </select>
                     <input required type="text" value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} placeholder="Cidade e Estado" className="bg-[#111111] text-white text-sm border border-[#a3a3a3]/10 rounded-xl px-4 py-3 outline-none focus:border-[#c9a263] w-full"/>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <input required type="tel" value={formData.whatsapp} onChange={(e)=>setFormData({...formData, whatsapp: e.target.value})} placeholder="WhatsApp" className="bg-[#111111] text-white text-sm border border-[#a3a3a3]/10 rounded-xl px-4 py-3 outline-none focus:border-[#c9a263] w-full"/>
                     <input required type="text" value={formData.consumption} onChange={(e)=>setFormData({...formData, consumption: e.target.value})} placeholder="Consumo mensal estimado (kg)" className="bg-[#111111] text-[#c9a263] font-medium text-sm border border-[#c9a263]/30 rounded-xl px-4 py-3 outline-none focus:border-[#c9a263] w-full"/>
                  </div>
                  <textarea rows={2} value={formData.notes} onChange={(e)=>setFormData({...formData, notes: e.target.value})} placeholder="Observação (opcional)." className="bg-[#111111] text-white text-sm border border-[#a3a3a3]/10 rounded-xl px-4 py-3 outline-none focus:border-[#c9a263] w-full resize-none"></textarea>
                  
                  <div className="pt-2">
                     <button disabled={formLoading} type="submit" className="w-full bg-[#c9a263] text-[#0a0a0a] py-4 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-[#e0b875] transition-colors shadow-[0_5px_15px_rgba(201,162,99,0.3)] disabled:opacity-70">
                       {formLoading ? 'Enviando...' : 'Receber proposta com esse consumo'}
                     </button>
                     <p className="text-center text-[#a3a3a3] text-[10px] mt-3 uppercase tracking-widest">Resposta personalizada. Sem compromisso.</p>
                  </div>
                </form>
               )}
            </div>
        </div>
      </section>

      {/* 8. FAIXAS B2B */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Faixa 1 */}
           <div className="bg-[#111111] border border-[#a3a3a3]/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#c9a263]/30 transition-all">
              <div>
                <h3 className="font-serif text-3xl text-white mb-2">10–20kg</h3>
                <span className="text-[#c9a263] font-bold text-xs uppercase tracking-widest block mb-4">/ mês</span>
                <p className="text-[#a3a3a3] text-sm">Escritórios, clínicas e recepções premium.</p>
              </div>
              <button onClick={() => scrollToSection('b2b-form')} className="mt-8 text-xs font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#c9a263] text-left">Solicitar proposta <ArrowRight size={14} className="inline ml-1"/></button>
           </div>
           
           {/* Faixa 2 */}
           <div className="bg-[#111111] border border-[#c9a263]/20 p-8 rounded-2xl flex flex-col justify-between hover:border-[#c9a263] transition-all relative">
              <div>
                <h3 className="font-serif text-3xl text-white mb-2 mt-2">20–50kg</h3>
                <span className="text-[#c9a263] font-bold text-xs uppercase tracking-widest block mb-4">/ mês</span>
                <p className="text-[#a3a3a3] text-sm mt-4">Restaurantes, cafeterias, coworkings e operações recorrentes.</p>
              </div>
              <button onClick={() => scrollToSection('b2b-form')} className="mt-8 text-xs font-bold uppercase tracking-widest text-[#c9a263] hover:text-white text-left">Solicitar proposta <ArrowRight size={14} className="inline ml-1"/></button>
           </div>
           
           {/* Faixa 3 */}
           <div className="bg-[#111111] border border-[#a3a3a3]/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#c9a263]/30 transition-all">
              <div>
                <h3 className="font-serif text-3xl text-white mb-2">50kg+</h3>
                <span className="text-[#c9a263] font-bold text-xs uppercase tracking-widest block mb-4">/ mês</span>
                <p className="text-[#a3a3a3] text-sm">Hotéis, redes e revenda.</p>
              </div>
              <button onClick={() => scrollToSection('b2b-form')} className="mt-8 text-xs font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#c9a263] text-left">Solicitar proposta <ArrowRight size={14} className="inline ml-1"/></button>
           </div>
           
           {/* Faixa Exportação */}
           <div className="bg-[#1a1a1a] border border-[#a3a3a3]/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#c9a263]/30 transition-all">
              <div>
                <Globe className="text-[#a3a3a3] mb-4" size={24}/>
                <h3 className="font-serif text-3xl text-white mb-2">Exportação</h3>
                <p className="text-[#a3a3a3] text-sm">Grandes volumes e operações sob consulta.</p>
              </div>
               <button onClick={() => scrollToSection('export-section')} className="mt-8 text-xs font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#c9a263] text-left">Solicitar proposta <ArrowRight size={14} className="inline ml-1"/></button>
           </div>
        </div>
      </section>

      {/* 10. EXPORTAÇÃO */}
      <section id="export-section" className="bg-[#111111] py-16 px-6 border-y border-[#a3a3a3]/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between">
           <div className="flex-1">
             <div className="flex items-center gap-3 mb-4">
                <Globe className="text-[#c9a263]" size={24}/>
                <h3 className="text-2xl font-serif text-white">Exportação e grandes volumes</h3>
             </div>
             <p className="text-[#a3a3a3] text-sm leading-relaxed">
               Para revenda, recorrência e operações acima de alto volume, fale com a equipe comercial para avaliar disponibilidade, documentação e logística.
             </p>
           </div>
           <div className="shrink-0">
             <button onClick={() => handleWhatsAppClick('Mercado Internacional / Grandes Volumes Gerais')} className="border border-[#c9a263] text-[#c9a263] hover:bg-[#c9a263] hover:text-[#0a0a0a] transition-all px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                Falar com a equipe
             </button>
           </div>
        </div>
      </section>

      {/* 11. FAQ B2B */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <div key={idx} className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden transition-all duration-300 shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#111111] transition-colors"
                  aria-expanded={openFaq === idx}
                >
                  <h3 className="font-serif text-lg text-white pr-8">{faq.q}</h3>
                  <ChevronDown size={20} className={`text-[#c9a263] transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="p-6 pt-0 text-[#a3a3a3] font-light leading-relaxed border-t border-[#a3a3a3]/10 mt-2 pt-4 bg-[#111111]/50">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. CTA FINAL */}
      <section className="bg-[#111111] text-white py-32 px-6 text-center relative overflow-hidden font-sans border-t border-[#a3a3a3]/10">
        <div className="absolute inset-0 bg-[#c9a263]/5 opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 tracking-tight">
            Pronto para servir um café <br/>
            <span className="text-[#c9a263] italic font-light drop-shadow-sm">à altura da sua marca?</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 mt-12">
            <button onClick={() => scrollToSection('b2b-form')} className="bg-[#c9a263] text-[#0a0a0a] px-10 py-5 rounded-xl font-bold hover:bg-[#e0b875] transition-all shadow-[0_10px_25px_rgba(201,162,99,0.3)] hover:scale-[1.02] active:scale-[0.98] uppercase text-sm tracking-wider">
               Solicitar proposta B2B
            </button>
            <button onClick={() => handleWhatsAppClick('Desejo iniciar volume B2B')} className="bg-transparent text-white border border-[#c9a263]/30 bg-white/5 backdrop-blur-md px-10 py-5 rounded-xl font-bold hover:bg-white/10 hover:border-[#c9a263]/50 transition-colors uppercase text-sm tracking-wider">
               Falar no WhatsApp
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mx-auto w-fit">
              <span className="flex items-center gap-1">86+ SCA</span>
              <span className="flex items-center gap-1">•</span>
              <span className="flex items-center gap-1">Cup of Excellence</span>
              <span className="flex items-center gap-1">•</span>
              <span className="flex items-center gap-1">Torra sob demanda</span>
              <span className="flex items-center gap-1">•</span>
              <span className="flex items-center gap-1">Rastreabilidade QR</span>
              <span className="flex items-center gap-1">•</span>
              <span className="flex items-center gap-1 text-[#c9a263]">A partir de 10kg/mês</span>
          </div>
        </div>
      </section>

    </div>
  );
}
