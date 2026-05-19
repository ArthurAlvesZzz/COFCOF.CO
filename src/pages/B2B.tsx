import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Coffee, 
  Users, 
  CupSoda, 
  Package, 
  CheckCircle2,
  Bed,
  Laptop,
  Store,
  UsersRound,
  Minus,
  Plus,
  ArrowRight,
  Calculator,
  MessageSquare,
  ChevronRight,
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { publicContentService } from '../services/publicContentService';
import { ContentBlock } from '../types/admin';

const businessTypes = [
  { id: 'escritorio', name: 'Escritório', icon: Building2 },
  { id: 'cafeteria', name: 'Cafeteria', icon: Coffee },
  { id: 'restaurante', name: 'Restaurante', icon: CupSoda },
  { id: 'hotel', name: 'Hotel', icon: Bed },
  { id: 'coworking', name: 'Coworking', icon: Laptop },
  { id: 'revenda', name: 'Revenda', icon: Store },
  { id: 'evento', name: 'Evento', icon: UsersRound },
];

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
  const [content, setContent] = useState<Record<string, Partial<ContentBlock>>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      const blocks = await publicContentService.getPageContent('empresas');
      const contentMap: Record<string, Partial<ContentBlock>> = {};
      blocks.forEach(b => {
        contentMap[b.key] = b;
      });
      setContent(contentMap);
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { b2bLeadService } = await import('../services/b2bLeadService');
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

  const handleCalcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeName = businessTypes.find(t => t.id === calcData.type)?.name || calcData.type;
    const text = `Olá! Gostaria de uma cotação comercial da CofCof. Fizemos uma simulação:\n\n*Operação:* ${typeName}\n*Pessoas:* ${calcData.people}/dia\n*Xícaras:* ${calcData.cupsPerPerson}/pessoa\n*Dias úteis:* ${calcData.daysPerMonth}/mês\n\n*Consumo Estimado:* ${estimatedKg}kg/mês\n*Pacote:* ${recommendedPackage}\n\nPodemos conversar?`;
    window.open(`https://wa.me/5531999999999?text=${encodeURIComponent(text)}`, '_blank');
  };

  const updatePeople = (amount: number) => {
    setCalcData(prev => {
      const newVal = prev.people + amount;
      if (newVal < 1) return { ...prev, people: 1 };
      if (newVal > 500) return { ...prev, people: 500 };
      return { ...prev, people: newVal };
    });
  };

  const updateCups = (amount: number) => {
    setCalcData(prev => {
      const newVal = prev.cupsPerPerson + amount;
      if (newVal < 1) return { ...prev, cupsPerPerson: 1 };
      if (newVal > 6) return { ...prev, cupsPerPerson: 6 };
      return { ...prev, cupsPerPerson: newVal };
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen pt-32">
      {/* 1. HERO */}
      <section className="premium-container mt-0 mb-12 border-none">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Café Corporativo CofCof" className="w-full h-full object-cover opacity-20 mix-blend-lighten" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent z-0" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-20 pt-8 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="premium-badge mb-8 mx-auto">
              <Building2 size={14} /> Soluções B2B Premium
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 max-w-4xl mx-auto text-white">
              O café da sua empresa <span className="text-[#c9a263] italic font-light drop-shadow-sm">comunica cuidado</span> antes da primeira conversa.
            </h1>
            <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Surpreenda clientes e equipe com lotes premiados, rastreáveis e torrados sob demanda para a rotina da sua operação.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                onClick={() => scrollToSection('b2b-form')}
                className="premium-cta w-full sm:w-auto"
              >
                Solicitar Proposta B2B
              </button>
              <button 
                onClick={() => scrollToSection('calculator')}
                className="premium-cta-ghost w-full sm:w-auto"
               >
                Calcular consumo
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-8 border-t border-white/10 mx-auto w-fit">
              <span className="flex items-center gap-2"><Star size={14} className="text-[#c9a263]"/> Lotes Premiados</span>
              <span className="flex items-center gap-2"><Package size={14} className="text-[#c9a263]"/> Fardos Atacado</span>
              <span className="flex items-center gap-2"><MapPin size={14} className="text-[#c9a263]"/> Torra Sob Demanda</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SEGMENTS - PARA QUEM */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Para quem é a CofCof B2B?</h2>
            <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto font-light">Soluções modulares para cada tipo de operação, projetadas para encantar quem bebe e otimizar quem compra.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="premium-card p-8 group flex flex-col justify-between">
              <div>
                <Building2 className="text-[#c9a263] mb-6 transition-transform group-hover:scale-110" size={32} />
                <h3 className="font-serif text-2xl text-white mb-3">Escritórios</h3>
                <p className="text-[#a3a3a3] mb-6 text-sm leading-relaxed font-light">Transforme reuniões, recepção e a rotina da sua equipe em uma experiência de cuidado absoluto.</p>
              </div>
              <div className="pt-4 border-t border-[#a3a3a3]/10 text-[11px] font-bold text-[#c9a263] uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} className="text-[#c9a263]" /> Pacotes volumosos</div>
            </div>

            <div className="premium-card p-8 group flex flex-col justify-between">
              <div>
                <Coffee className="text-[#c9a263] mb-6 transition-transform group-hover:scale-110" size={32} />
                <h3 className="font-serif text-2xl text-white mb-3">Cafeterias</h3>
                <p className="text-[#a3a3a3] mb-6 text-sm leading-relaxed font-light">Lotes de especialidade com história e rastreabilidade para elevar percepção e ticket médio.</p>
              </div>
              <div className="pt-4 border-t border-[#a3a3a3]/10 text-[11px] font-bold text-[#c9a263] uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} className="text-[#c9a263]" /> Curadoria e Treino</div>
            </div>

            <div className="premium-card p-8 group flex flex-col justify-between">
              <div>
                <CupSoda className="text-[#c9a263] mb-6 transition-transform group-hover:scale-110" size={32} />
                <h3 className="font-serif text-2xl text-white mb-3">Restaurantes</h3>
                <p className="text-[#a3a3a3] mb-6 text-sm leading-relaxed font-light">Finalize a experiência gastronômica dos seus clientes com um café à altura dos seus melhores pratos.</p>
              </div>
              <div className="pt-4 border-t border-[#a3a3a3]/10 text-[11px] font-bold text-[#c9a263] uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} className="text-[#c9a263]" /> Alta doçura</div>
            </div>

            <div className="premium-card p-8 group flex flex-col justify-between">
              <div>
                <Bed className="text-[#c9a263] mb-6 transition-transform group-hover:scale-110" size={32} />
                <h3 className="font-serif text-2xl text-white mb-3">Hotéis</h3>
                <p className="text-[#a3a3a3] mb-6 text-sm leading-relaxed font-light">A hospitalidade começa nos menores detalhes. Inclusive no café servido no desjejum e no quarto.</p>
              </div>
              <div className="pt-4 border-t border-[#a3a3a3]/10 text-[11px] font-bold text-[#c9a263] uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} className="text-[#c9a263]" /> Experiência premium</div>
            </div>

            <div className="premium-card p-8 group flex flex-col justify-between lg:col-span-2 relative overflow-hidden bg-[#111111]">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-700 group-hover:scale-110">
                <Store size={150} />
              </div>
              <div className="relative z-10 w-full h-full flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="mb-2 text-[#c9a263] font-bold uppercase tracking-widest text-[10px]">Expansão</div>
                  <h3 className="font-serif text-3xl text-white mb-4">Revendedores</h3>
                  <p className="text-[#a3a3a3] mb-6 leading-relaxed font-light max-w-sm">Produto premium com narrativa forte, embalagem magnética e marca reconhecida para vender com melhor margem na sua gôndola.</p>
                </div>
                <div className="sm:border-l sm:border-[#a3a3a3]/10 sm:pl-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-white font-medium mb-3">
                    <CheckCircle2 size={18} className="text-[#c9a263]" /> Display Retail
                  </div>
                  <div className="flex items-center gap-3 text-white font-medium mb-3">
                    <CheckCircle2 size={18} className="text-[#c9a263]" /> Mkt Kits
                  </div>
                  <div className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 size={18} className="text-[#c9a263]" /> Margem B2B
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* 3. BENEFITS PILLARS */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#a3a3a3]/10">
           <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              <div className="flex flex-col">
                <div className="text-[#c9a263] mb-6">
                  <Star size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">1. Café comunica marca</h3>
                <p className="text-[#a3a3a3] leading-relaxed font-light text-sm">
                  Cada xícara servida reforça cuidado. Servir um café amargo depõe contra o nível do seu próprio serviço.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="text-[#c9a263] mb-6">
                  <TrendingUp size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">2. Previsibilidade</h3>
                <p className="text-[#a3a3a3] leading-relaxed font-light text-sm">
                  Pacotes recorrentes B2B e fornecimento ajustado ao consumo real, sem faltar e sem sobrar perdendo frescor.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="text-[#c9a263] mb-6">
                  <MapPin size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">3. Lotes com história</h3>
                <p className="text-[#a3a3a3] leading-relaxed font-light text-sm">
                  Cafés premiados, origem D.O. Cerrado Mineiro e rastreabilidade para que seu cliente saiba o privilégio do que bebe.
                </p>
              </div>
           </div>
      </section>

      {/* 4. CALCULATOR - SIMULADOR */}
      <section id="calculator" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto premium-container !my-0 !rounded-[2rem] border-x-0 border-y sm:border">
          <div className="text-center mb-16">
            <div className="premium-badge mb-6">
              <Calculator size={14} /> Simulador B2B CofCof
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Calcule o volume ideal</h2>
            <p className="text-lg text-[#a3a3a3] max-w-xl mx-auto font-light">
              Receba uma estimativa precisa de consumo mensal para sua operação.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
            {/* Left: Controls */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Type Selection */}
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#a3a3a3] mb-3">Que tipo de negócio?</label>
                <div className="flex flex-wrap gap-2">
                  {businessTypes.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setCalcData({...calcData, type: b.id})}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
                        calcData.type === b.id 
                          ? 'bg-[#c9a263] text-[#0a0a0a] border-[#c9a263] font-bold shadow-md' 
                          : 'bg-[#1a1a1a] text-[#a3a3a3] border-[#a3a3a3]/10 hover:border-[#c9a263]/30 font-medium'
                      }`}
                    >
                      <b.icon size={14} className={calcData.type === b.id ? 'text-[#0a0a0a]' : 'text-[#c9a263]'} />
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* People Stepper & Slider */}
              <div className="premium-card p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-[#a3a3a3] mb-1">Pessoas Atendidas / Dia</label>
                  </div>
                  
                  <div className="flex items-center bg-[#111111] rounded-xl p-1 border border-[#a3a3a3]/10 w-fit">
                    <button onClick={() => updatePeople(-5)} className="w-10 h-10 flex items-center justify-center text-white hover:text-[#c9a263] transition-colors"><Minus size={16} /></button>
                    <div className="w-20 text-center font-serif text-2xl text-white">{calcData.people}</div>
                    <button onClick={() => updatePeople(5)} className="w-10 h-10 flex items-center justify-center text-white hover:text-[#c9a263] transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={calcData.people}
                  onChange={(e) => setCalcData({...calcData, people: Number(e.target.value)})}
                  className="w-full h-1 bg-[#a3a3a3]/20 rounded-lg appearance-none cursor-pointer accent-[#c9a263]"
                />
              </div>

              {/* Cups & Days */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="premium-card p-6">
                   <label className="block text-[11px] font-bold tracking-widest uppercase text-[#a3a3a3] mb-4">Xícaras / Pessoa / Dia</label>
                   <div className="grid grid-cols-4 gap-2 bg-[#111111] p-1.5 rounded-xl border border-[#a3a3a3]/10">
                     {[1, 2, 3, 4].map((cup) => (
                       <button
                         key={cup}
                         onClick={() => setCalcData({...calcData, cupsPerPerson: cup})}
                         className={`py-2 rounded-lg font-medium text-sm transition-all ${
                           calcData.cupsPerPerson === cup
                             ? 'bg-[#c9a263] text-[#0a0a0a]'
                             : 'text-[#a3a3a3] hover:text-white'
                         }`}
                       >
                         {cup}{cup === 4 ? '+' : ''}
                       </button>
                     ))}
                   </div>
                </div>
                
                <div className="premium-card p-6">
                   <label className="block text-[11px] font-bold tracking-widest uppercase text-[#a3a3a3] mb-4">Dias Úteis / Mês</label>
                   <div className="grid grid-cols-4 gap-2 bg-[#111111] p-1.5 rounded-xl border border-[#a3a3a3]/10">
                     {[20, 22, 26, 30].map((days) => (
                       <button
                         key={days}
                         onClick={() => setCalcData({...calcData, daysPerMonth: days})}
                         className={`py-2 rounded-lg font-medium text-sm transition-all ${
                           calcData.daysPerMonth === days
                             ? 'bg-[#c9a263] text-[#0a0a0a]'
                             : 'text-[#a3a3a3] hover:text-white'
                         }`}
                       >
                         {days}d
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Consultative Result */}
            <div className="lg:col-span-5 sticky top-32">
              <div className="premium-card bg-[#1a1a1a]/80 backdrop-blur-md p-8 rounded-[2rem] border border-[#c9a263]/20 shadow-[0_10px_30px_rgba(201,162,99,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Coffee size={150} />
                </div>
                <h3 className="text-[#c9a263] text-[10px] font-bold uppercase tracking-widest mb-6 relative z-10">Diagnóstico</h3>
                
                <div className="mb-8 relative z-10">
                  <span className="text-[#a3a3a3] text-sm font-medium">Demanda mensal estimada</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-6xl font-serif text-white tracking-tight">{estimatedKg}</span>
                    <span className="text-2xl text-[#a3a3a3] font-serif">Kg</span>
                  </div>
                  <p className="text-[#a3a3a3] mt-2 font-mono text-xs tracking-widest">≈ {estimatedCups.toLocaleString('pt-BR')} XÍCARAS</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#a3a3a3]/10 mb-8 relative z-10">
                  <div>
                    <span className="block text-[10px] text-[#a3a3a3] uppercase tracking-widest font-bold mb-1">Lote Recomendado</span>
                    <span className="block text-white font-medium">{recommendedPackage}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#a3a3a3] uppercase tracking-widest font-bold mb-1">Perfil Sensorial</span>
                    <span className="block text-white italic font-light">{activeProfile}</span>
                  </div>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <button onClick={handleCalcSubmit} className="premium-cta w-full gap-2">
                    <MessageSquare size={16} /> Cotação no WhatsApp
                  </button>
                  <button onClick={() => scrollToSection('b2b-form')} className="w-full text-center text-xs font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-white py-2 transition-colors">
                    Ou preencha o formulário
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FORMULÁRIO B2B - PROPOSTA */}
      <section id="b2b-form" className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Proposta Comercial</h2>
            <p className="text-[#a3a3a3] text-lg max-w-xl mx-auto font-light">Informe seus dados e retornaremos em até 24h úteis.</p>
          </div>
          
          <div className="premium-card p-8 md:p-12">
            {formSuccess ? (
              <div className="text-center py-12 px-6">
                 <div className="w-16 h-16 bg-[#c9a263]/10 text-[#c9a263] border border-[#c9a263]/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-serif text-white mb-3">Recebemos seus dados.</h3>
                 <p className="text-[#a3a3a3] text-sm mb-8">Vamos te chamar com uma sugestão de fornecimento.</p>
                 <button onClick={handleCalcSubmit} className="premium-cta mx-auto inline-flex items-center gap-2">
                   <MessageSquare size={16} /> Falar agora no WhatsApp
                 </button>
              </div>
            ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#a3a3a3]">Seu Nome</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm" placeholder="Como devemos te chamar" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#a3a3a3]">Empresa</label>
                  <input required type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm" placeholder="Nome do seu negócio" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#a3a3a3]">WhatsApp</label>
                  <input required type="tel" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#a3a3a3]">Cidade ou Estado</label>
                  <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm" placeholder="Ex: Belo Horizonte / MG" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#a3a3a3]">Segmento Principal</label>
                  <select value={formData.segment} onChange={(e) => setFormData({...formData, segment: e.target.value})} className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm" required>
                    <option value="" disabled>Selecione um segmento</option>
                    <option value="coffee_shop">Cafeteria / Empório</option>
                    <option value="restaurant">Restaurante</option>
                    <option value="office">Escritório Corporativo</option>
                    <option value="hotel">Hotelaria</option>
                    <option value="other">Outro Modelo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#a3a3a3]">Volume Estimado</label>
                  <input type="text" value={formData.consumption || `${estimatedKg}kg por mês`} onChange={(e) => setFormData({...formData, consumption: e.target.value})} className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm font-medium" />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="block text-[10px] font-bold tracking-widest uppercase text-[#a3a3a3]">Instruções adicionais</label>
                 <textarea rows={2} value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263] outline-none rounded-xl px-5 py-4 text-white text-sm resize-none" placeholder="Opcional. Ex: Já temos máquina de espresso, precisamos de moinhos..." />
              </div>
              
              <button disabled={formLoading} type="submit" className="premium-cta w-full mt-4 disabled:opacity-50 gap-2 text-center">
                {formLoading ? 'Calculando melhor opção...' : 'Solicitar Proposta'} {!formLoading && <ArrowRight size={16} />}
              </button>
            </form>
            )}
          </div>
      </section>
      {/* 6. FAQ ESPECÍFICO */}
      <section className="py-24 md:py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Perguntas Frequentes (B2B)</h2>
            <p className="text-[#a3a3a3] text-lg font-light">Tudo o que sua equipe precisa saber antes de fechar parceria.</p>
          </div>

          <div className="space-y-4">
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Faturam por CNPJ?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Sim. Emitimos nota fiscal eletrônica de todos os pedidos corporativos, garantindo a conformidade da sua contabilidade de insumos.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">A torra também é sob demanda para parceiros B2B?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Sim, o princípio do frescor não muda. Nós montamos uma programação de torra mensal para sua operação, assim o café chega no ápice sensorial no fim do tempo de descanso.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden shadow-sm p-6">
                 <h3 className="font-serif text-lg text-white mb-2">Comodato: Fornecem máquinas e moinhos?</h3>
                 <p className="text-[#a3a3a3] font-light text-sm">Nosso foco é exclusivamente o grão. Porém, dependendo do volume estimado, indicamos parceiros diretos experientes em maquinário (La Spaziale, Fiamma, Mahlkönig) para atender sua necessidade.</p>
              </div>
          </div>
        </div>
      </section>

    </div>
  );
}
