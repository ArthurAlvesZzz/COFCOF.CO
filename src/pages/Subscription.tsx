import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  Package, 
  PauseCircle, 
  Star,
  MapPin,
  Settings2,
  ChevronDown,
  Flame,
  Coffee,
  RotateCw,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { usePublicSubscriptions } from '../hooks/usePublicSubscriptions';

export default function Subscription() {
  const { plans, submitInterest } = usePublicSubscriptions();
  const [selectedPlan, setSelectedPlan] = useState('explorador');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', whatsapp: '', planId: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const planName = plans.find(p => p.slug === formData.planId)?.name || formData.planId;
    const success = await submitInterest({
      name: formData.name,
      whatsapp: formData.whatsapp,
      planId: formData.planId,
      planName: planName,
    });
    setIsSubmitting(false);
    if (success) {
      setFormSuccess(true);
      setFormData({ name: '', whatsapp: '', planId: '' });
    }
  };

  const scrollToPlanos = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToComoFunciona = () => {
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlanClick = (planSlug: string) => {
    setFormData(prev => ({ ...prev, planId: planSlug }));
    document.getElementById('form-interesse')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsAppClick = (planName: string) => {
    const text = `Olá, quero saber mais sobre a assinatura CofCof. Tenho interesse no plano ${planName}.`;
    window.open(`https://wa.me/5534998728882?text=${encodeURIComponent(text)}`, '_blank');
  };

  const faqs = [
    { question: "Posso pausar minha assinatura?", answer: "Sim. Vá viajar ou espere acabar o estoque da despensa. Você pode pausar ou pular a próxima entrega quando quiser direto pelo seu painel, sem taxas." },
    { question: "Posso trocar o café ou perfil sensorial?", answer: "Com certeza. Durante a assinatura, você tem flexibilidade total para alternar perfis e descobrir novos lotes da nossa curadoria rotativa." },
    { question: "Posso mudar a frequência?", answer: "Sim. A maioria das pessoas prefere entregas mensais para não acumular café, mas oferecemos freqüência quinzenal caso o consumo seja mais alto." },
    { question: "Os cafés são torrados quando?", answer: "Nunca despachamos lotes de prateleira. O seu café entra na programação de torra assim que o pedido do mês é faturado, garantindo um frescor excepcional na xícara." },
    { question: "A assinatura serve para empresas?", answer: "Temos o Clube Escritório, desenhado para repassar qualidade premium para a sua equipe e seus clientes, com entrega previsível e facilidade de gestão." },
    { question: "Existe taxa de adesão?", answer: "Nenhuma taxa. Você paga exclusivamente pelos pacotes de café e frete. O cancelamento também é isento de multas ou fidelidade travada." },
    { question: "Posso cancelar a assinatura caso não goste?", answer: "A qualquer momento, com total autonomia no nosso painel. Sem complicações e sem precisar enviar e-mails." },
    { question: "Como recebo os cafés?", answer: "Entregamos via transportadora com acompanhamento ponta a ponta. O seu lote virá lacrado de fábrica com o QR Code de certificação do Cerrado." }
  ];

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen font-sans">
      
      {/* 1. HERO ASSINATURA */}
      <section className="bg-[#111111] text-white pt-16 md:pt-28 pb-32 px-6 relative overflow-hidden border-b border-[#a3a3a3]/10">
        <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
            <img 
              src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Café fresco CofCof" 
              className="w-full h-full object-cover opacity-20 mix-blend-lighten" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 mb-8 text-[11px] font-bold tracking-widest uppercase bg-[#c9a263]/10 backdrop-blur-md shadow-xl">
              <Package size={14} /> Clube CofCof
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-[1.05] tracking-tight hover:drop-shadow-[0_0_15px_rgba(197,160,89,0.5)] transition-all">
              Seu café favorito,<br/>
              <span className="text-[#c9a263] italic font-light drop-shadow-sm">sempre fresco na porta.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#a3a3a3] mb-10 leading-relaxed font-light">
               Receba cafés CofCof com torra programada, curadoria de lotes selecionados e flexibilidade para ajustar sua recorrência quando quiser.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={scrollToPlanos}
                className="w-full sm:w-auto bg-[#c9a263] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold text-center hover:bg-[#e0b875] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_25px_rgba(201,162,99,0.3)] uppercase text-sm"
              >
                Escolher minha assinatura
              </button>
              <button 
                onClick={scrollToComoFunciona}
                className="w-full sm:w-auto border border-[#a3a3a3]/30 text-white bg-white/5 backdrop-blur-md px-8 py-4 rounded-xl font-medium text-center hover:bg-white/10 hover:border-[#a3a3a3]/50 transition-colors uppercase text-sm"
               >
                Entender como funciona
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-6 border-t border-white/10">
              <span className="flex items-center gap-2"><Flame size={14} className="text-[#c9a263]"/> Torra programada</span>
              <span className="flex items-center gap-2"><Star size={14} className="text-[#c9a263]"/> Lotes selecionados</span>
              <span className="flex items-center gap-2"><PauseCircle size={14} className="text-[#c9a263]"/> Pausa flexível</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-end relative h-full items-center"
          >
             <div className="relative aspect-square w-full max-w-[500px]">
                <div className="absolute inset-0 border border-[#c9a263]/30 rounded-full animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-4 border border-[#a3a3a3]/20 rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Embalagem CofCof" className="w-[300px] h-[400px] object-cover rounded-3xl shadow-2xl border border-white/10 -rotate-6 transition-transform hover:rotate-0 duration-500 opacity-90 mix-blend-lighten" />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-[20%] left-[5%] bg-[#1a1a1a]/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-2xl border border-[#a3a3a3]/10 text-white">
                   <Package size={14} className="text-[#c9a263]"/> 1x ao Mês
                </div>
                <div className="absolute bottom-[20%] right-[5%] bg-[#1a1a1a]/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-2xl border border-[#a3a3a3]/10">
                   <Flame size={14} className="text-[#c9a263]"/> Torra Recente
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA (JOURNEY) */}
      <section id="como-funciona" className="py-24 md:py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Como funciona sua assinatura CofCof</h2>
            <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto font-light">
               Você escolhe o perfil. A CofCof cuida da curadoria, torra e recorrência. Sem prender sua rotina.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-[#c9a263]/40 to-transparent z-0" />
            
            {/* Step 1 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 flex flex-col items-center text-center group">
               <div className="w-24 h-24 bg-[#1a1a1a] border border-[#c9a263]/20 shadow-[0_0_15px_rgba(197,160,89,0.1)] rounded-3xl flex items-center justify-center text-[#c9a263] mb-6 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(197,160,89,0.3)] transition-all duration-300">
                  <Coffee size={36} strokeWidth={1.5} />
               </div>
               <h3 className="font-serif text-xl text-white mb-3">1. Escolha seu perfil</h3>
               <p className="text-sm text-[#a3a3a3] leading-relaxed font-light px-4">Selecione se prefere cafés mais doces, equilibrados, intensos ou descubra coisas novas na linha exploratória.</p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative z-10 flex flex-col items-center text-center group">
               <div className="w-24 h-24 bg-[#1a1a1a] border border-[#c9a263]/20 shadow-[0_0_15px_rgba(197,160,89,0.1)] rounded-3xl flex items-center justify-center text-[#c9a263] mb-6 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(197,160,89,0.3)] transition-all duration-300">
                  <Flame size={36} strokeWidth={1.5} />
               </div>
               <h3 className="font-serif text-xl text-white mb-3">2. Receba torra fresca</h3>
               <p className="text-sm text-[#a3a3a3] leading-relaxed font-light px-4">Os lotes são despachados após a confirmação da recorrência, garantindo que você beba na fase mais vibrante da torra.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative z-10 flex flex-col items-center text-center group">
               <div className="w-24 h-24 bg-[#1a1a1a] border border-[#c9a263]/20 shadow-[0_0_15px_rgba(197,160,89,0.1)] rounded-3xl flex items-center justify-center text-[#c9a263] mb-6 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(197,160,89,0.3)] transition-all duration-300">
                  <Settings2 size={36} strokeWidth={1.5} />
               </div>
               <h3 className="font-serif text-xl text-white mb-3">3. Ajuste quando quiser</h3>
               <p className="text-sm text-[#a3a3a3] leading-relaxed font-light px-4">Tem flexibilidade para pausar, alterar a frequência ou mudar de plano confortavelmente na sua conta.</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="relative z-10 flex flex-col items-center text-center group">
               <div className="w-24 h-24 bg-[#1a1a1a] border border-[#c9a263]/40 shadow-[0_0_15px_rgba(197,160,89,0.3)] rounded-3xl flex items-center justify-center text-[#c9a263] mb-6 group-hover:scale-110 transition-all duration-300">
                  <RotateCw size={36} strokeWidth={1.5} />
               </div>
               <h3 className="font-serif text-xl text-white mb-3">4. Descubra novos lotes</h3>
               <p className="text-sm text-[#a3a3a3] leading-relaxed font-light px-4">Receba curadorias rotativas e suba o nível da sua experiência, provando safras selecionadas da melhor região brasileira.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. BLOCO DE PERSONALIZAÇÃO / FLEXIBILIDADE */}
      <section className="py-20 px-6 bg-[#111111] border-y border-[#a3a3a3]/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
           <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/3">
             <div className="inline-flex items-center gap-2 text-[#c9a263] font-bold uppercase tracking-widest text-[10px] mb-4">
                Flexibilidade garantida
             </div>
             <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight">Assinatura sem engessar sua rotina.</h2>
             <p className="text-[#a3a3a3] text-lg leading-relaxed font-light mb-8">
               A proposta não é empurrar pacotes, e sim que você tenha tranquilidade de nunca ficar sem aquele café que melhora seu dia. A gestão é 100% pensada na sua facilidade.
             </p>
           </motion.div>
           
           <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] p-6 rounded-3xl flex gap-4 border border-[#a3a3a3]/10">
                 <div className="w-10 h-10 shrink-0 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-[#c9a263] border border-[#a3a3a3]/10 shadow-sm">
                   <RotateCw size={20} />
                 </div>
                 <div>
                   <h4 className="font-serif text-xl text-white mb-2">Mude o perfil</h4>
                   <p className="text-sm text-[#a3a3a3]">Cansou do doce e quer algo fermentado? Altere em um clique no próximo envio.</p>
                 </div>
              </div>
              <div className="bg-[#1a1a1a] p-6 rounded-3xl flex gap-4 border border-[#a3a3a3]/10">
                 <div className="w-10 h-10 shrink-0 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-[#c9a263] border border-[#a3a3a3]/10 shadow-sm">
                   <PauseCircle size={20} />
                 </div>
                 <div>
                   <h4 className="font-serif text-xl text-white mb-2">Pause quando quiser</h4>
                   <p className="text-sm text-[#a3a3a3]">Sem "travar" cartão e sem multas para o cancelamento ou pausas pontuais.</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* 4. PLANOS */}
      <section id="planos" className="py-24 md:py-32 px-6 relative bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">Escolha o clube que combina com sua rotina</h2>
            <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto font-light">
              Planos pensados para quem quer café fresco em casa, descobrir novos lotes premium ou abastecer pequenas operações e escritórios.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-stretch pt-4">
            {/* PLANO 1 - EXPLORADOR */}
            <div 
              className={`flex flex-col bg-[#111111] rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group hover:border-[#c9a263]/40 ${
                selectedPlan === 'explorador' ? 'border-[#c9a263] shadow-[0_0_20px_rgba(197,160,89,0.15)] xl:scale-[1.02] z-10' : 'border-[#a3a3a3]/10 shadow-sm'
              }`}
              onClick={() => setSelectedPlan('explorador')}
            >
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div className="mb-2 text-[#a3a3a3] font-bold uppercase tracking-widest text-[10px]">Para iniciantes</div>
                <h3 className="text-3xl font-serif text-white mb-3">Clube Explorador</h3>
                <p className="text-[#a3a3a3] text-sm mb-6 leading-relaxed flex-1">Receba 1 pacote por mês (250g). Comece a descobrir novos perfis sensoriais rotativos a cada mês.</p>
                
                <div className="mb-8 pt-4 border-t border-[#a3a3a3]/10">
                  <div className="text-[10px] uppercase font-bold text-[#c9a263] tracking-wider mb-1">A partir de</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-white">R$ 55</span>
                    <span className="text-[#a3a3a3] font-medium">/mês</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm font-medium text-white">1 super lote rotativo por mês</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm font-medium text-white">Torra exclusivamente sob demanda</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm text-[#a3a3a3]">Opção em grãos ou moído</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm text-[#a3a3a3]">Zero dor de cabeça para pausar</span></li>
                </ul>
                
                <button 
                  onClick={() => handlePlanClick('explorador')}
                  className={`w-full py-4 rounded-xl font-bold transition-all mt-auto border border-[#c9a263]/30 ${
                    selectedPlan === 'explorador' 
                      ? 'bg-[#c9a263] text-[#0a0a0a] border-transparent hover:bg-[#e0b875] hover:shadow-[0_0_15px_rgba(201,162,99,0.3)] text-sm uppercase' 
                      : 'bg-transparent text-[#c9a263] hover:bg-[#c9a263] hover:text-[#0a0a0a] text-sm uppercase'
                  }`}
                >
                  Entrar neste clube
                </button>
              </div>
            </div>

            {/* PLANO 2 - ENTUSIASTA (RECOMMENDED) */}
            <div 
              className={`flex flex-col rounded-[2.5rem] border-2 transition-all duration-300 relative group overflow-hidden bg-[#1a1a1a] ${
                selectedPlan === 'entusiasta' ? 'border-[#c9a263] shadow-[0_0_30px_rgba(197,160,89,0.2)] xl:scale-[1.05] z-20' : 'border-[#c9a263]/50 shadow-xl'
              }`}
              onClick={() => setSelectedPlan('entusiasta')}
            >
              <div className="absolute top-0 right-0 left-0 bg-[#c9a263] text-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest py-1.5 text-center shadow-sm">Mais Escolhido</div>
              
              <div className="p-8 md:p-10 flex-1 flex flex-col mt-4">
                <div className="mb-2 text-[#c9a263] font-bold uppercase tracking-widest text-[10px]">O Ponto Ideal</div>
                <h3 className="text-3xl font-serif text-white mb-3">Clube Entusiasta</h3>
                <p className="text-[#a3a3a3] text-sm mb-6 leading-relaxed flex-1">Receba 2 pacotes por mês (500g tot). Para quem bebe café todos os dias e não quer abrir mão de qualidade.</p>
                
                <div className="mb-8 pt-4 border-t border-white/10">
                  <div className="text-[10px] uppercase font-bold text-[#c9a263] tracking-wider mb-1">A partir de</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-white">R$ 95</span>
                    <span className="text-white/40 font-medium">/mês</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-10 text-white">
                  <li className="flex items-start gap-3"><Star className="text-[#c9a263] shrink-0 mt-0.5 fill-[#c9a263]/20" size={18}/><span className="text-sm font-medium text-white">Lotes distintos na mesma caixa</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm font-medium text-white">Frete muito mais atrativo (ou grátis*)</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm text-[#a3a3a3]">Ficha técnica detalhada para degustação</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm text-[#a3a3a3]">Acesso a microlotes super selecionados</span></li>
                </ul>
                
                <button 
                  onClick={() => handlePlanClick('entusiasta')}
                  className={`w-full py-4 rounded-xl font-bold transition-all mt-auto border border-[#c9a263] ${
                    selectedPlan === 'entusiasta' 
                      ? 'bg-[#c9a263] text-[#0a0a0a] hover:bg-[#e0b875] shadow-[0_0_15px_rgba(201,162,99,0.3)] text-sm uppercase' 
                      : 'bg-transparent text-[#c9a263] hover:bg-[#c9a263] hover:text-[#0a0a0a] text-sm uppercase'
                  }`}
                >
                  Assinar Entusiasta
                </button>
              </div>
            </div>

            {/* PLANO 3 - COLECIONADOR */}
            <div 
              className={`flex flex-col bg-[#111111] rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group hover:border-[#c9a263]/40 ${
                selectedPlan === 'colecionador' ? 'border-[#c9a263] shadow-[0_0_20px_rgba(197,160,89,0.15)] xl:scale-[1.02] z-10' : 'border-[#a3a3a3]/10 shadow-sm'
              }`}
              onClick={() => setSelectedPlan('colecionador')}
            >
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div className="mb-2 text-[#a3a3a3] font-bold uppercase tracking-widest text-[10px]">Experiência Máxima</div>
                <h3 className="text-3xl font-serif text-white mb-3">O Colecionador</h3>
                <p className="text-[#a3a3a3] text-sm mb-6 leading-relaxed flex-1">2 pacotes/mês + 1 Presente Exclusivo a cada 6 meses (ex: Caneca de Cerâmica Premium Artesanal). Seu ritual elevado.</p>
                
                <div className="mb-8 pt-4 border-t border-[#a3a3a3]/10">
                  <div className="text-[10px] uppercase font-bold text-[#c9a263] tracking-wider mb-1">A partir de</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-white">R$ 139</span>
                    <span className="text-[#a3a3a3] font-medium">/mês</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm font-medium text-white">Presentes surpresa premium (acessórios)</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm font-medium text-white">Mimos ao longo da jornada (amostras)</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm text-[#a3a3a3]">Lotes de pontuação altíssima garantidos</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-[#c9a263] shrink-0 mt-0.5" size={18}/><span className="text-sm text-[#a3a3a3]">Status de cliente Founder</span></li>
                </ul>
                
                <button 
                  onClick={() => handlePlanClick('colecionador')}
                  className={`w-full py-4 rounded-xl font-bold transition-all mt-auto border border-[#c9a263]/30 ${
                    selectedPlan === 'colecionador' 
                      ? 'bg-[#c9a263] text-[#0a0a0a] border-transparent hover:bg-[#e0b875] hover:shadow-[0_0_15px_rgba(201,162,99,0.3)] text-sm uppercase' 
                      : 'bg-transparent text-[#c9a263] hover:bg-[#c9a263] hover:text-[#0a0a0a] text-sm uppercase'
                  }`}
                >
                  Ser um Colecionador
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WAITING LIST / MONTE SUA ASSINATURA */}
      <section className="py-24 px-6 bg-[#111111] border-y border-[#a3a3a3]/10" id="form-interesse">
        <div className="max-w-4xl mx-auto rounded-[3rem] overflow-hidden relative shadow-2xl bg-[#1a1a1a] border border-[#a3a3a3]/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#c9a263]/10 to-[#c9a263]/5" />
            <div className="p-10 md:p-16 text-center relative z-10">
               <div className="w-16 h-16 bg-[#c9a263]/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#c9a263] mx-auto mb-6">
                 <ShieldCheck size={32} />
               </div>
               <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Monte sua recorrência CofCof</h2>
               <p className="text-[#a3a3a3] text-lg mb-10 max-w-xl mx-auto font-light">
                 Escolha seu perfil de preferência, defina a quantia e defina a data ideal para os envios mensais. 
               </p>
               
               {formSuccess ? (
                  <div className="bg-green-500/20 text-green-300 p-8 rounded-2xl border border-green-500/30">
                     <CheckCircle2 size={48} className="mx-auto mb-4" />
                     <h3 className="text-2xl font-serif mb-2 text-white">Recebemos seu interesse!</h3>
                     <p className="text-green-100/80">A CofCof vai te ajudar a escolher o plano ideal para sua rotina. Faremos contato pelo WhatsApp em breve.</p>
                     <button onClick={() => setFormSuccess(false)} className="mt-6 uppercase text-xs font-bold text-green-300 hover:text-white transition-colors tracking-widest">
                        Voltar
                     </button>
                  </div>
               ) : (
                 <form className="max-w-md mx-auto space-y-4" onSubmit={handleFormSubmit}>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome Completo" 
                      className="w-full px-6 py-4 rounded-xl bg-[#0a0a0a] text-white placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#c9a263] border border-[#a3a3a3]/10" 
                      required
                    />
                    <input 
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="Seu WhatsApp" 
                      className="w-full px-6 py-4 rounded-xl bg-[#0a0a0a] text-white placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#c9a263] border border-[#a3a3a3]/10" 
                      required
                    />
                    <div className="relative">
                      <select 
                        name="planId"
                        value={formData.planId}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-xl bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#c9a263] border border-[#a3a3a3]/10 appearance-none cursor-pointer" 
                        required
                      >
                        <option value="" disabled className="text-[#a3a3a3]">Tenho interesse no clube...</option>
                        {plans.length > 0 ? (
                          plans.map(p => (
                             <option key={p.id} value={p.slug} className="text-black">{p.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="explorador" className="text-black">Clube Explorador (1 pct)</option>
                            <option value="entusiasta" className="text-black">Clube Entusiasta (2 pcts)</option>
                            <option value="colecionador" className="text-black">O Colecionador (+Presente)</option>
                          </>
                        )}
                      </select>
                      <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full mt-2 bg-[#c9a263] text-[#0a0a0a] py-4 rounded-xl font-bold hover:bg-[#e0b875] transition-colors shadow-[0_10px_25px_rgba(201,162,99,0.2)] text-sm uppercase ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                       {isSubmitting ? 'Enviando...' : 'Assinar agora'}
                    </button>
                 </form>
               )}
            </div>
        </div>
      </section>

      {/* 6. FAQ ESPECÍFICO */}
      <section className="py-24 md:py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Dúvidas sobre a assinatura</h2>
            <p className="text-[#a3a3a3] text-lg font-light">Se ainda ficou alguma incerteza, nossa flexibilidade é a resposta.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#111111] transition-colors"
                  aria-expanded={openFaq === idx}
                >
                  <h3 className="font-serif text-lg text-white pr-8">{faq.question}</h3>
                  <ChevronDown 
                    size={20} 
                    className={`text-[#c9a263] transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="p-6 pt-0 text-[#a3a3a3] font-light leading-relaxed border-t border-[#a3a3a3]/10 mt-2 pt-4 bg-[#111111]/50">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA FINAL FORTE */}
      <section className="bg-[#111111] text-white py-32 px-6 text-center relative overflow-hidden font-sans border-y border-[#a3a3a3]/10 shadow-2xl">
        <div className="absolute inset-0 bg-[#c9a263]/5 opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 tracking-tight">
            Seu café não precisa acabar para você <span className="text-[#c9a263] italic font-light drop-shadow-sm">lembrar de comprar.</span>
          </h2>
          <p className="text-lg md:text-xl font-light text-[#a3a3a3] mb-12 max-w-2xl mx-auto leading-relaxed">
            Entre para a assinatura CofCof e receba lotes selecionados com mais frescor, previsibilidade e praticidade na sua casa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button onClick={scrollToPlanos} className="bg-[#c9a263] text-[#0a0a0a] px-10 py-5 rounded-xl font-bold hover:bg-[#e0b875] transition-all shadow-[0_10px_25px_rgba(201,162,99,0.3)] hover:scale-[1.02] active:scale-[0.98] uppercase text-sm">
               Escolher minha assinatura
            </button>
            <button onClick={() => handleWhatsAppClick('Geral sobre a assinatura')} className="bg-transparent text-white border border-[#a3a3a3]/30 bg-white/5 backdrop-blur-md px-10 py-5 rounded-xl font-bold hover:bg-white/10 hover:border-[#a3a3a3]/50 transition-colors uppercase text-sm">
               Falar com a CofCof
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[10px] sm:text-xs font-bold text-[#a3a3a3] uppercase tracking-widest pt-8 border-t border-white/10 w-fit mx-auto">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-[#c9a263]"/> Entregamos no Brasil</span>
            <span className="hidden sm:inline text-[#a3a3a3]/20">•</span>
            <span className="flex items-center gap-2"><Settings2 size={14} className="text-[#c9a263]"/> Cancele quando quiser</span>
          </div>
        </div>
      </section>

    </div>
  );
}
