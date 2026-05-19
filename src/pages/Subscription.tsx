import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  Package, 
  PauseCircle, 
  Star,
  MapPin,
  Settings2,
  Flame,
  Coffee,
  RotateCw,
  ShieldCheck,
  Award,
  Leaf,
  ScanLine,
  Truck,
  Droplets,
  ArrowRight,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePublicSubscriptions } from '../hooks/usePublicSubscriptions';

const provas = [
  "Cup of Excellence",
  "86+ pts SCA",
  "Cerrado Mineiro D.O.",
  "Rastreabilidade QR",
  "Torra sob demanda",
  "A p/ de R$ 1,87 por xícara",
  "Cancele quando quiser"
];

const certificacoes = [
  { icon: Award, title: "Cup of Excellence", desc: "Nossos cafés estão entre os melhores do país, validados pela principal competição de qualidade do mundo." },
  { icon: Star, title: "86+ Pontos SCA", desc: "Apenas lotes de excelência entram no clube. Um rigor técnico para garantir complexidade sensorial na xícara." },
  { icon: MapPin, title: "Cerrado Mineiro D.O.", desc: "Origem garantida por Denominação de Origem. O primeiro território de café do Brasil com essa certificação." },
  { icon: Leaf, title: "MAPA", desc: "Regularidade e responsabilidade ambiental atestadas pelo Ministério da Agricultura Brasileiro." },
  { icon: Coffee, title: "Q-Grader", desc: "Curadoria assinada por provadores profissionais certificados, calibrados internacionalmente." }
];

const loteExemplo = {
  sca: "88.5",
  produtor: "Gabriel Alves",
  fazenda: "Fazenda Bom Jardim",
  variedade: "Catuaí Amarelo IAC-62",
  processo: "Fermentação Anaeróbica Escura",
  altitude: "1250m",
  safra: "2025",
  notas: "Melaço, Frutas Vermelhas Maceradas, Vinho do Porto, Acidez Licorosa"
};

const lotes = [
  { id: "01", produtor: "Gabriel Alves", origem: "Faz. Bom Jardim", sca: "88.5", processo: "Termo-Anaeróbico", altitude: "1250m", notas: "Melaço, Frutas Vermelhas" },
  { id: "02", produtor: "Maria Eduarda", origem: "Alto da Serra", sca: "87.0", processo: "Cereja Descascado", altitude: "1200m", notas: "Chocolate, Caramelo" },
  { id: "03", produtor: "João Batista", origem: "Faz. Esperança", sca: "86.5", processo: "Natural", altitude: "1150m", notas: "Castanhas, Cacau" },
  { id: "04", produtor: "Lucas Prado", origem: "Sítio Recanto", sca: "88.0", processo: "Fermentação Lática", altitude: "1220m", notas: "Pêssego, Mel, Jasmim" },
  { id: "05", produtor: "Ana Carolina", origem: "Bela Vista", sca: "87.5", processo: "Honey", altitude: "1180m", notas: "Manga, Maracujá" },
  { id: "06", produtor: "Carlos Eduardo", origem: "Primavera", sca: "86.7", processo: "Natural", altitude: "1100m", notas: "Amendoim, Rapadura" },
  { id: "07", produtor: "Sérgio Dias", origem: "Faz. São João", sca: "87.2", processo: "Natural Fermentado", altitude: "1210m", notas: "Cereja, Morango" },
  { id: "08", produtor: "Pedro Henrique", origem: "Alta Vista", sca: "88.2", processo: "Washed", altitude: "1250m", notas: "Capim Limão, Erva Doce" },
];

const timeline = [
  { title: "Colheita seletiva", icon: Leaf },
  { title: "Seleção do lote", icon: Coffee },
  { title: "Análise SCA", icon: Star },
  { title: "Torra sob demanda", icon: Flame },
  { title: "Embalagem c/ válvula", icon: Package },
  { title: "QR de rastreio", icon: ScanLine },
  { title: "Envio recorrente", icon: Truck },
];

const depoimentos = [
  { text: "Nunca tinha provado um café com notas tão evidentes. O rastreio pelo QR Code faz toda a diferença para quem gosta de entender o que está bebendo.", nome: "Ricardo S.", cidade: "São Paulo, SP", plano: "Plano Clássico" },
  { text: "Assinei achando que seria mais do mesmo. Fui surpreendida pela torra sempre fresca. O cheiro da caixa chegando todo mês é maravilhoso.", nome: "Juliana M.", cidade: "Curitiba, PR", plano: "Plano Essencial" },
  { text: "Levo para a agência. A nossa equipe abandonou o café de mercado no primeiro dia. Serviço sensacional e flexível para pausar nas férias.", nome: "André L.", cidade: "Rio de Janeiro, RJ", plano: "Plano Empresas" }
];

const faqs = [
  { question: "Posso pausar minha assinatura?", answer: "Sim. Pausa flexível a qualquer momento pelo painel, sem multa. Vai viajar? Basta pausar e retomar quando voltar." },
  { question: "Posso cancelar quando quiser?", answer: "Sim. Não há contratos engessados de fidelidade. Você pode cancelar sua assinatura com 1 clique antes do próximo ciclo de cobrança." },
  { question: "O café vem em grão ou moído?", answer: "Você escolhe. No momento da assinatura ou via painel depois, você pode informar se quer em grãos (recomendado) ou escolher a moagem ideal para seu método (V60, Prensa, Espresso, etc)." },
  { question: "Quando ele é torrado?", answer: "Nossos grãos só vão para o torrador após o seu ciclo faturar. Torra sob demanda rigorosa, para você receber o lote na curva ideal de degaseificação e frescor." },
  { question: "Posso trocar de plano?", answer: "Sempre que precisar. Se o consumo aumentar ou diminuir, basta alterar o plano no painel." },
  { question: "Como funciona o envio?", answer: "Enviamos por transportadoras premium. Seu código de rastreio é enviado por e-mail e WhatsApp assim que sai da nossa base no Cerrado Mineiro." },
  { question: "O que vem no primeiro mês?", answer: "Enviaremos o lote mais premiado disponível no período, garantindo que sua primeira impressão seja memorável. Acompanha ficha técnica e um guia de extração." },
  { question: "Qual plano escolher?", answer: "Para 1 pessoa (consumo 1-2 xícaras/dia): Essencial (1kg). Para casais (2-4 xícaras/dia): Clássico (2kg). Família/alto consumo: Família (5kg). Empresas têm acesso à nossa linha corporativa." }
];

export default function Subscription() {
  const { plans, submitInterest } = usePublicSubscriptions();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToPlanos = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsAppClick = (context: string) => {
    const text = `Olá! Tenho interesse no Clube CofCof e gostaria de saber mais sobre: ${context}`;
    window.open(`https://wa.me/5534998728882?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen font-sans overflow-x-hidden">
      
      {/* 1. HERO ALTO PADRÃO ESCURO */}
      <section className="bg-[#111111] text-white pt-32 pb-24 px-6 relative border-b border-[#a3a3a3]/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Café fresco CofCof" 
              className="w-full h-full object-cover opacity-10 mix-blend-lighten" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/90 to-transparent opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 border border-[#c9a263]/30 text-[#c9a263] rounded-full px-4 py-1.5 mb-8 text-[11px] font-bold tracking-widest uppercase bg-[#c9a263]/10 backdrop-blur-md">
              <Package size={14} /> Clube CofCof
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-6 leading-[1.1] tracking-tight">
              Talvez o melhor café do Brasil{" "}
              <span className="text-[#c9a263] italic font-light">ainda não esteja na sua xícara.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#a3a3a3] mb-10 leading-relaxed font-light max-w-lg">
              Oito lotes premiados, torrados sob demanda, rastreáveis do pé à sua casa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={scrollToPlanos}
                className="w-full sm:w-auto bg-[#c9a263] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold hover:bg-[#e0b875] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-sm"
              >
                Assinar agora
              </button>
              <button 
                onClick={() => window.location.href = '/cafes'}
                className="w-full sm:w-auto border border-[#a3a3a3]/30 text-white bg-white/5 backdrop-blur-md px-8 py-4 rounded-xl font-medium hover:bg-white/10 hover:border-[#a3a3a3]/50 transition-colors uppercase text-sm"
               >
                Ver cafés avulsos
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] sm:text-xs font-bold text-[#c9a263] uppercase tracking-widest pt-6 border-t border-white/10">
              <span className="flex items-center gap-2">86–88.5 SCA</span>
              <span className="flex items-center gap-2">Cup of Excellence</span>
              <span className="flex items-center gap-2">Cerrado Mineiro D.O.</span>
              <span className="flex items-center gap-2">Torra sob demanda</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-end"
          >
             <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#a3a3a3]/10">
               <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Experiência Clube CofCof" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
               <div className="absolute bottom-6 left-6 right-6 bg-[#1a1a1a]/90 backdrop-blur-md border border-[#c9a263]/20 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[#a3a3a3] text-[10px] uppercase font-bold tracking-widest mb-1">Lote do Mês</div>
                    <div className="text-white font-serif text-lg">Catuaí Amarelo IAC-62</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-[#c9a263] flex justify-center items-center font-serif text-[#c9a263]">88<span className="text-[10px] mt-2">pt</span></div>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FAIXA DE PROVAS RÁPIDAS (Marquee) */}
      <div className="bg-[#c9a263] text-[#0a0a0a] py-4 overflow-hidden shadow-lg border-b border-[#a3a3a3]/20">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {[...provas, ...provas, ...provas].map((item, idx) => (
            <div key={idx} className="flex items-center mx-8 text-sm font-bold uppercase tracking-widest">
              {item}
              <span className="mx-8 opacity-40">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CERTIFICAÇÕES E RECONHECIMENTO (Off-white) */}
      <section className="bg-[#F6F1EB] py-24 px-6 text-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
             <div className="inline-flex mx-auto items-center gap-2 text-[#B06A32] font-bold uppercase tracking-widest text-[10px] mb-4">
                Assinatura de Qualidade
             </div>
             <h2 className="text-3xl md:text-5xl font-serif text-[#111111] mb-6 leading-tight">Reconhecimentos que sustentam o que está na xícara.</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {certificacoes.map((item, idx) => (
              <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: idx*0.1}} key={idx} className="bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#111111]/5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-all">
                <div className="w-12 h-12 bg-[#F6F1EB] rounded-xl flex items-center justify-center text-[#B06A32] mb-5">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2 text-[#111111]">{item.title}</h3>
                <p className="text-sm text-[#111111]/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMO FUNCIONA (3 PASSOS) */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Como o clube funciona</h2>
             <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto font-light">Uma jornada pensada para que você beba cafés extraordinários com o mínimo de esforço diário.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
             <div className="hidden md:block absolute top-[48px] left-[16%] right-[16%] h-[1px] bg-[#a3a3a3]/20 z-0"></div>
             
             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="relative z-10 flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-[#111111] border border-[#a3a3a3]/20 rounded-full flex items-center justify-center text-white font-serif text-3xl mb-6 shadow-xl">1</div>
               <h3 className="text-2xl font-serif text-white mb-3">Escolha seu plano</h3>
               <p className="text-[#a3a3a3] text-sm leading-relaxed px-4">
                 Essencial, Clássico, Família ou Empresas. Você define a quantidade ideal para o seu mês.
               </p>
             </motion.div>

             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} className="relative z-10 flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-[#111111] border border-[#a3a3a3]/20 rounded-full flex items-center justify-center text-white font-serif text-3xl mb-6 shadow-xl">2</div>
               <h3 className="text-2xl font-serif text-white mb-3">Receba café fresco</h3>
               <p className="text-[#a3a3a3] text-sm leading-relaxed px-4">
                 Torra sob demanda, envio recorrente e escolha por grãos ou a moagem de sua preferência.
               </p>
             </motion.div>

             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} className="relative z-10 flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-[#111111] border border-[#a3a3a3]/20 rounded-full flex items-center justify-center text-[#c9a263] border-[#c9a263]/30 font-serif text-3xl mb-6 shadow-[0_0_20px_rgba(201,162,99,0.15)]">3</div>
               <h3 className="text-2xl font-serif text-white mb-3">Rastreie a origem</h3>
               <p className="text-[#a3a3a3] text-sm leading-relaxed px-4">
                 Escaneie o QR Code do pacote para acessar o produtor, lote, safra, notas sensoriais e pontuação.
               </p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 5. PLANOS DO CLUBE */}
      <section id="planos" className="py-24 md:py-32 px-6 bg-[#111111] border-y border-[#a3a3a3]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">Escolha o plano ideal</h2>
            <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto font-light">
              Pacotes para o seu consumo sob medida. Você pode alterar, pausar ou cancelar a qualquer momento sem taxas.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 items-stretch">
            {/* PLANO 1 - Essencial */}
            <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#a3a3a3]/10 p-8 flex flex-col hover:border-[#c9a263]/40 transition-colors">
              <div className="text-[#a3a3a3] text-[10px] uppercase font-bold tracking-widest mb-2">Para iniciantes</div>
              <h3 className="text-3xl font-serif text-white mb-2">Essencial</h3>
              <p className="text-[#c9a263] font-bold text-sm mb-6">1kg / mês</p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">R$ 169</span>
                <span className="text-[#a3a3a3] text-sm">/mês</span>
              </div>
              <div className="bg-[#111111] rounded-lg p-3 text-center text-xs text-[#a3a3a3] mb-6 border border-[#a3a3a3]/10">
                Aprox. <strong className="text-white">R$ 1,69</strong> por xícara (100x)
              </div>
              <div className="text-[#a3a3a3] text-sm mb-6">Ideal para 1 pessoa, consumo de 2 a 3 xícaras ao dia.</div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-[#a3a3a3]">
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span className="text-white">Qualidade SCA 86+</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span>Torra sob demanda</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span>Pausa flexível garantida</span></li>
              </ul>
              <button onClick={() => handleWhatsAppClick('Plano Essencial 1kg')} className="w-full py-4 text-center rounded-xl font-bold bg-[#c9a263] text-[#0a0a0a] hover:bg-[#e0b875] transition-colors uppercase text-xs tracking-wider">
                Assinar Essencial
              </button>
            </div>

            {/* PLANO 2 - Clássico (Recommended) */}
            <div className="bg-[#1a1a1a] rounded-[2rem] border-2 border-[#c9a263] p-8 flex flex-col relative shadow-[0_0_30px_rgba(201,162,99,0.15)] md:-mt-4 md:mb-4 lg:scale-[1.05] z-10">
              <div className="absolute top-0 right-0 left-0 bg-[#c9a263] text-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest py-1.5 text-center">O Mais Escolhido</div>
              <div className="text-[#c9a263] text-[10px] uppercase font-bold tracking-widest mb-2 mt-4">Para dividir</div>
              <h3 className="text-3xl font-serif text-white mb-2">Clássico</h3>
              <p className="text-[#c9a263] font-bold text-sm mb-6">2kg / mês</p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">R$ 318</span>
                <span className="text-[#a3a3a3] text-sm">/mês</span>
              </div>
              <div className="bg-[#111111] rounded-lg p-3 text-center text-xs text-[#a3a3a3] mb-6 border border-[#c9a263]/20">
                Aprox. <strong className="text-[#c9a263]">R$ 1,59</strong> por xícara (200x)
              </div>
              <div className="text-[#a3a3a3] text-sm mb-6">Para casais ou quem consome várias vezes ao dia.</div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-[#a3a3a3]">
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span className="text-white text-sm">Lotes rotativos exclusivos</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span>Melhor custo-benefício</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span>Pausa & Cancelamento livre</span></li>
              </ul>
              <button onClick={() => handleWhatsAppClick('Plano Clássico 2kg')} className="w-full py-4 text-center rounded-xl font-bold bg-[#c9a263] text-[#0a0a0a] hover:bg-[#e0b875] transition-colors uppercase text-xs tracking-wider shadow-[0_10px_20px_rgba(201,162,99,0.3)]">
                Assinar Clássico
              </button>
            </div>

            {/* PLANO 3 - Família */}
            <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#a3a3a3]/10 p-8 flex flex-col hover:border-[#c9a263]/40 transition-colors">
              <div className="text-[#a3a3a3] text-[10px] uppercase font-bold tracking-widest mb-2">P/ Alto Consumo</div>
              <h3 className="text-3xl font-serif text-white mb-2">Família</h3>
              <p className="text-[#c9a263] font-bold text-sm mb-6">5kg / mês</p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">R$ 745</span>
                <span className="text-[#a3a3a3] text-sm">/mês</span>
              </div>
              <div className="bg-[#111111] rounded-lg p-3 text-center text-xs text-[#a3a3a3] mb-6 border border-[#a3a3a3]/10">
                Aprox. <strong className="text-white">R$ 1,49</strong> por xícara (500x)
              </div>
              <div className="text-[#a3a3a3] text-sm mb-6">Ideal para famílias grandes ou escritórios compactos.</div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-[#a3a3a3]">
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span className="text-white text-sm">Frete otimizado</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span>Possibilidade de envios quinzenais</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span>Pausa flexível garantida</span></li>
              </ul>
              <button onClick={() => handleWhatsAppClick('Plano Família 5kg')} className="w-full py-4 text-center rounded-xl font-bold border border-[#c9a263] text-[#c9a263] hover:bg-[#c9a263] hover:text-[#0a0a0a] transition-colors uppercase text-xs tracking-wider">
                Assinar Família
              </button>
            </div>

            {/* PLANO 4 - Empresas */}
            <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#a3a3a3]/10 p-8 flex flex-col hover:border-[#c9a263]/40 transition-colors">
              <div className="text-[#a3a3a3] text-[10px] uppercase font-bold tracking-widest mb-2">Sob Medida</div>
              <h3 className="text-3xl font-serif text-white mb-2">Empresas</h3>
              <p className="text-[#c9a263] font-bold text-sm mb-6">10kg+ / mês</p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-2xl font-serif text-white">Sob consulta</span>
              </div>
              <div className="bg-[#111111] rounded-lg p-3 text-center text-xs text-[#a3a3a3] mb-6 border border-[#a3a3a3]/10">
                Condições exclusivas para B2B.
              </div>
              <div className="text-[#a3a3a3] text-sm mb-6">Mude a cultura da sua empresa com café premium diário.</div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-[#a3a3a3]">
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span className="text-white text-sm">Volume B2B customizável</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span>Consultoria para método/equipamento</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#c9a263] shrink-0" size={16}/><span>Faturamento via CNPJ</span></li>
              </ul>
              <button onClick={() => handleWhatsAppClick('Assinatura Empresas B2B')} className="w-full py-4 text-center rounded-xl font-bold border border-[#a3a3a3]/30 text-white hover:border-[#a3a3a3] transition-colors uppercase text-xs tracking-wider">
                Falar com consultor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CURADORIA / 8 LOTES PREMIADOS */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Oito lotes. Oito Produtores.</h2>
            <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto font-light">
              Assinar a CofCof não é receber "café aleatório". É provar curadorias restritas e numeradas, mapeadas no Cerrado Mineiro.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lotes.map((lote) => (
              <div key={lote.id} className="bg-[#111111] border border-[#a3a3a3]/10 rounded-2xl p-5 hover:border-[#c9a263]/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[#c9a263] font-serif text-2xl">#{lote.id}</div>
                  <div className="bg-[#1a1a1a] px-2 py-1 rounded text-xs font-bold text-white border border-[#a3a3a3]/10">
                    SCA {lote.sca}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-white font-bold">{lote.produtor}</p>
                  <p className="text-[#a3a3a3] text-xs">{lote.origem} • {lote.altitude}</p>
                  <p className="text-[#a3a3a3] text-xs italic border-b border-[#a3a3a3]/20 pb-2">{lote.processo}</p>
                  <p className="text-[#c9a263] text-xs pt-1">{lote.notas}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DOSSIÊ DE DEGUSTAÇÃO (Destaque Lote) */}
      <section className="bg-[#111111] border-y border-[#a3a3a3]/10 py-0 relative group">
        <div className="grid lg:grid-cols-2">
           <div className="p-12 lg:p-24 flex flex-col justify-center bg-[#111111]">
              <div className="inline-flex items-center gap-2 text-[#c9a263] font-bold uppercase tracking-widest text-[10px] mb-4">
                 Dossiê de Degustação
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">A transparência de saber o que bebe.</h2>
              <p className="text-[#a3a3a3] text-lg font-light mb-10">
                 Todo exemplar entregue aos assinantes possui informações detalhadas para uma experiência rica. Um verdadeiro passaporte sensorial da nossa terra.
              </p>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                 <div>
                    <div className="text-[10px] uppercase font-bold text-[#a3a3a3] tracking-widest mb-1">Produtor</div>
                    <div className="text-white font-medium">{loteExemplo.produtor}</div>
                 </div>
                 <div>
                    <div className="text-[10px] uppercase font-bold text-[#a3a3a3] tracking-widest mb-1">Cereja e Processo</div>
                    <div className="text-white font-medium text-sm">{loteExemplo.variedade} • {loteExemplo.processo}</div>
                 </div>
                 <div>
                    <div className="text-[10px] uppercase font-bold text-[#a3a3a3] tracking-widest mb-1">Origem</div>
                    <div className="text-white font-medium text-sm">{loteExemplo.fazenda} ({loteExemplo.altitude})</div>
                 </div>
                 <div>
                    <div className="text-[10px] uppercase font-bold text-[#a3a3a3] tracking-widest mb-1">Safra Premium</div>
                    <div className="text-white font-medium">{loteExemplo.safra}</div>
                 </div>
                 <div className="col-span-2 bg-[#1a1a1a] p-4 rounded-xl border border-[#c9a263]/20 mt-2">
                    <div className="text-[10px] uppercase font-bold text-[#c9a263] tracking-widest mb-1">Notas Sensoriais Rastreáveis</div>
                    <div className="text-[#c9a263] italic text-sm">{loteExemplo.notas}</div>
                 </div>
              </div>
           </div>
           <div className="hidden lg:block relative min-h-[600px] border-l border-[#a3a3a3]/10">
              <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Dossiê do Café" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111111] to-transparent opacity-80" />
           </div>
        </div>
      </section>

      {/* 8. COMPARAÇÃO HONESTA */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Café comum vs. Clube CofCof</h2>
               <p className="text-[#a3a3a3] text-lg font-light">Uma comparação direta, sem agressividade, apenas fatos sobre a xícara.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
               <div className="bg-[#111111] rounded-3xl p-8 border border-[#a3a3a3]/10 opacity-70">
                 <h3 className="text-2xl font-serif text-[#a3a3a3] mb-8 pb-4 border-b border-[#a3a3a3]/20">Café de Prateleira Comum</h3>
                 <ul className="space-y-5">
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50" /> Origem genérica ou "blend de países" não identificados</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50" /> Torra escura padrão (para mascarar defeitos)</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50" /> Estoque parado por meses nos supermercados</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50" /> Pouca ou nenhuma rastreabilidade do processo</li>
                    <li className="flex items-center gap-3 text-sm text-[#a3a3a3]"><div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]/50" /> Perfil sensorial indefinido ("gosto de café")</li>
                 </ul>
               </div>

               <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#c9a263]/30 shadow-[0_0_40px_rgba(201,162,99,0.1)] relative">
                 <div className="absolute -top-4 -right-4 bg-[#c9a263] text-[#0a0a0a] rounded-full p-3 shadow-xl"><CheckCircle2 size={24}/></div>
                 <h3 className="text-2xl font-serif text-white mb-8 pb-4 border-b border-[#c9a263]/30">Assinatura Clube CofCof</h3>
                 <ul className="space-y-5">
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Origem identificada, fazenda, produtor e safra</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Torra feita apenas sob demanda p/ seu envio</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Lote exclusivíssimo e rastreável</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> QR de origem para transparência total da cadeia</li>
                    <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="text-[#c9a263] shrink-0" size={18} /> Curadoria mensal com nota SCA 86+ e perfil sensorial rico</li>
                 </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 9. DA FAZENDA À SUA CASA (Timeline) */}
      <section className="bg-white text-[#111111] py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-[#111111] mb-6">Da fazenda à sua casa</h2>
            <p className="text-[#111111]/70 text-lg font-light max-w-2xl mx-auto">A jornada transparente que garante frescor inegociável todos os meses.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
             <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-[#111111]/10 z-0"></div>
             {timeline.map((step, idx) => (
               <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-4 relative z-10 w-full md:w-auto mb-6 md:mb-0 group">
                 <div className="w-14 h-14 shrink-0 bg-white border border-[#111111]/10 shadow-sm rounded-2xl flex items-center justify-center text-[#B06A32] group-hover:scale-110 group-hover:shadow-md transition-all z-10">
                    <step.icon size={22} />
                 </div>
                 <div className="text-sm font-bold md:text-center text-[#111111] md:max-w-[100px] leading-tight">
                    {step.title}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 10. DEPOIMENTOS DE ASSINANTES */}
      <section className="py-24 px-6 bg-[#111111] border-y border-[#a3a3a3]/10">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Quem assina não volta atrás</h2>
              <p className="text-[#a3a3a3] text-lg font-light">Os relatos de quem transformou o ritual de beber café em casa.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {depoimentos.map((dep, idx) => (
                <div key={idx} className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#a3a3a3]/10 hover:border-[#c9a263]/30 transition-colors flex flex-col justify-between">
                   <div>
                     <Quote className="text-[#c9a263]/40 mb-4" size={32} />
                     <p className="text-white text-sm leading-relaxed mb-8 italic">"{dep.text}"</p>
                   </div>
                   <div className="pt-6 border-t border-[#a3a3a3]/10 flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-sm">{dep.nome}</p>
                        <p className="text-[#a3a3a3] text-xs">{dep.cidade}</p>
                      </div>
                      <div className="bg-[#c9a263]/10 border border-[#c9a263]/20 px-3 py-1 rounded-full text-xs font-bold text-[#c9a263]">
                        {dep.plano}
                      </div>
                   </div>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* 11. FAQ DA ASSINATURA */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Perguntas Frequentes</h2>
            <p className="text-[#a3a3a3] text-lg font-light">Se ainda ficou alguma dúvida, a transparência resolve.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#1a1a1a] rounded-2xl border border-[#a3a3a3]/10 overflow-hidden transition-all duration-300 shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#111111] transition-colors"
                  aria-expanded={openFaq === idx}
                >
                  <h3 className="font-serif text-lg text-white pr-8">{faq.question}</h3>
                  <ChevronDown size={20} className={`text-[#c9a263] transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
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

      {/* 12. CTA FINAL FORTE */}
      <section className="bg-[#111111] text-white py-32 px-6 text-center relative overflow-hidden font-sans border-y border-[#a3a3a3]/10">
        <div className="absolute inset-0 bg-[#c9a263]/5 opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 tracking-tight">
            Seu próximo mês pode começar com café comum.<br />
            <span className="text-[#c9a263] italic font-light drop-shadow-sm">Ou com um lote que você realmente entende.</span>
          </h2>
          <p className="text-lg md:text-xl font-light text-[#a3a3a3] mb-12 max-w-2xl mx-auto leading-relaxed">
            Abandone os cafés de prateleira. Garanta sofisticação, curadoria e respeito ao produtor na sua primeira xícara do dia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <button onClick={scrollToPlanos} className="bg-[#c9a263] text-[#0a0a0a] px-10 py-5 rounded-xl font-bold hover:bg-[#e0b875] transition-all shadow-[0_10px_25px_rgba(201,162,99,0.3)] hover:scale-[1.02] active:scale-[0.98] uppercase text-sm tracking-wider">
               Assinar agora
            </button>
            <button onClick={() => handleWhatsAppClick('Dúvida final sobre o Clube')} className="bg-transparent text-white border border-[#c9a263]/30 bg-white/5 backdrop-blur-md px-10 py-5 rounded-xl font-bold hover:bg-white/10 hover:border-[#c9a263]/50 transition-colors uppercase text-sm tracking-wider">
               Falar no WhatsApp
            </button>
          </div>
          <div className="mb-12">
            <button onClick={() => window.location.href = '/cafes'} className="text-[#a3a3a3] hover:text-white uppercase text-xs font-bold tracking-widest transition-colors inline-block mt-4">
               Ou ver cafés avulsos
            </button>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 border border-[#a3a3a3]/20 bg-[#1a1a1a]/80 backdrop-blur-md text-[#a3a3a3] rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase">
              <Package size={14} className="text-[#c9a263]" /> Curadoria Premium
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
