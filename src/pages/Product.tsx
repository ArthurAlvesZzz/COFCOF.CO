import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/seed';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, MapPin, ChevronRight, CheckCircle2, Star, Sprout, ShieldCheck, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

const FAQItem = ({ question, answer }: { question: string, answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#a3a3a3]/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-lg font-serif text-white">{question}</span>
        <ChevronRight size={20} className={`text-[#c9a263] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="text-[#a3a3a3] font-light leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.slug === slug);
  const { addItem } = useCartStore();
  
  const [selectedFormat, setSelectedFormat] = useState(product?.formats[0] || '');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#0a0a0a]">
        <h1 className="text-3xl font-serif mb-4 text-white">Café não encontrado</h1>
        <Link to="/cafes" className="text-[#c9a263] border-b border-[#c9a263]">Voltar aos cafés</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, selectedFormat, quantity);
  };

  return (
    <div className="w-full bg-[#0a0a0a] pt-32">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-sm text-[#a3a3a3] flex items-center gap-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight size={14} className="text-[#c9a263]" />
        <Link to="/cafes" className="hover:text-white">Cafés</Link>
        <ChevronRight size={14} className="text-[#c9a263]" />
        <span className="text-white">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 pb-24">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square md:aspect-[4/5] bg-[#111111] rounded-[3rem] overflow-hidden premium-card border border-[#c9a263]/20 group !p-0">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover mix-blend-lighten transition-transform duration-1000 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent pointer-events-none" />
              {product.isAwardWinning && (
                <div className="absolute top-6 left-6 premium-badge shadow-lg flex items-center gap-2">
                  <Star size={14} fill="currentColor" /> Lote Premiado
                </div>
              )}
            </div>
            
            {/* Curation Quick Proofs */}
            <div className="grid grid-cols-2 gap-4 mt-4">
               <div className="bg-[#111111] p-4 rounded-2xl flex items-center justify-center gap-3 border border-[#a3a3a3]/10 shadow-sm">
                  <ShieldCheck className="text-[#c9a263] shrink-0" size={20}/>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3]">100% Rastreável</span>
               </div>
               <div className="bg-[#111111] p-4 rounded-2xl flex items-center justify-center gap-3 border border-[#a3a3a3]/10 shadow-sm">
                  <Sprout className="text-[#c9a263] shrink-0" size={20}/>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3]">Torra Viva</span>
               </div>
            </div>
        </div>

        {/* Info */}
        <div className="flex flex-col pt-4">
          <div className="inline-flex items-center gap-2 text-[#c9a263] text-[10px] font-bold uppercase tracking-widest mb-4">
            <MapPin size={16} /> {product.region}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 leading-tight text-white">{product.name}</h1>
          <p className="text-xl text-[#a3a3a3] mb-6 leading-relaxed font-light">
             {product.shortDescription}
             <span className="block mt-2 font-medium text-[#c9a263]">Notas Sensoriais: {product.sensoryNotes.join(', ')}.</span>
          </p>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-medium tracking-tight text-white">R$ {product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-[#a3a3a3]/50 line-through">R$ {product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="bg-[#111111] p-8 rounded-3xl border border-[#c9a263]/20 mb-10 shadow-[0_10px_30px_rgba(201,162,99,0.05)] relative overflow-hidden">
             {/* decorative */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#c9a263]/10 to-transparent rounded-bl-full pointer-events-none"/>
             
            <div className="mb-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Formato / Moagem</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.formats.map(format => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`px-5 py-3 rounded-full text-sm font-bold transition-all border shadow-sm ${
                      selectedFormat === format 
                        ? 'bg-[#c9a263] text-[#0a0a0a] border-[#c9a263] shadow-[0_4px_10px_rgba(201,162,99,0.3)]' 
                        : 'bg-[#1a1a1a] border-[#a3a3a3]/10 text-white hover:border-[#c9a263]/50'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-3">Quantidade</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-[#a3a3a3]/10 rounded-full bg-[#1a1a1a] px-4 py-2 w-full sm:w-32 shadow-sm shrink-0 h-[56px]">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#a3a3a3] hover:text-[#c9a263] px-4 font-bold text-lg">-</button>
                  <span className="flex-1 text-center font-bold text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-[#a3a3a3] hover:text-[#c9a263] px-4 font-bold text-lg">+</button>
                </div>
                <div className="flex-1 flex gap-2 w-full">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-transparent text-white border border-[#c9a263]/30 h-[56px] rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:border-[#c9a263] transition-colors shadow-sm"
                  >
                    <ShoppingBag size={18} /> À sacola
                  </button>
                  <button 
                    onClick={() => {
                        handleAddToCart();
                        navigate('/checkout');
                    }}
                    className="flex-1 bg-[#c9a263] text-[#0a0a0a] h-[56px] rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[0_5px_15px_rgba(201,162,99,0.3)]"
                  >
                    Comprar agora
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-[10px] text-[#a3a3a3] uppercase tracking-widest font-bold">
               <Sprout size={14} className="text-[#c9a263]" /> Prazo estimado: Torra em até 48h úteis + Envio
            </div>

            <div className="mt-6 pt-6 border-t border-[#a3a3a3]/10 relative z-10">
               <button onClick={() => navigate('/assinatura')} className="w-full bg-[#1a1a1a] text-[#c9a263] h-[56px] rounded-full font-bold flex items-center justify-center border border-[#c9a263]/30 hover:border-[#c9a263] hover:bg-[#c9a263] hover:text-[#0a0a0a] transition-all shadow-sm">
                  <Star size={16} className="mr-2" /> Adicionar ao Clube (Assinatura Recorrente)
               </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-serif mb-4 text-white">O que você vai sentir na xícara</h3>
              <p className="text-[#a3a3a3] leading-relaxed font-light mb-4">{product.description}</p>
            </div>

            <div>
              <h3 className="text-2xl font-serif mb-4 text-white">Origem e rastreabilidade</h3>
              <p className="text-[#a3a3a3] leading-relaxed font-light">{product.originStory}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm bg-[#111111] p-8 rounded-3xl border border-[#a3a3a3]/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <MapPin size={100} />
              </div>
              <div className="relative z-10"><span className="text-[#a3a3a3] font-bold uppercase tracking-widest text-[10px] block mb-1">Origem e rastreabilidade</span><span className="font-medium text-white block mb-1">{product.farm || "-"} • {product.producer || "-"}</span><span className="text-xs text-[#a3a3a3]/70">Fazenda 100% rastreada e comércio direto.</span></div>
              <div className="relative z-10"><span className="text-[#a3a3a3] font-bold uppercase tracking-widest text-[10px] block mb-1">Região</span><span className="font-medium text-white block mb-1">{product.region || "-"}</span><span className="text-xs text-[#a3a3a3]/70">Terroir reconhecido mundialmente.</span></div>
              <div className="relative z-10"><span className="text-[#a3a3a3] font-bold uppercase tracking-widest text-[10px] block mb-1">Altitude</span><span className="font-medium text-white block mb-1">{product.altitude || "-"}</span><span className="text-xs text-[#a3a3a3]/70">Mais densidade, doçura e complexidade na xícara.</span></div>
              <div className="relative z-10"><span className="text-[#a3a3a3] font-bold uppercase tracking-widest text-[10px] block mb-1">Processo</span><span className="font-medium text-white block mb-1">{product.process || "-"}</span><span className="text-xs text-[#a3a3a3]/70">{product.process?.includes('Natural') ? 'Seco com a casca, trazendo notas frutadas intensas.' : 'Notas limpas e acidez brilhante.'}</span></div>
              <div className="relative z-10 pt-4 border-t border-[#a3a3a3]/10"><span className="text-[#a3a3a3] font-bold uppercase tracking-widest text-[10px] block mb-1">Para quem esse café é ideal</span><span className="font-medium text-white block mb-1">Para paladares exigentes</span><span className="text-xs text-[#a3a3a3]/70">Recomendado para quem busca doçura natural.</span></div>
              <div className="relative z-10 pt-4 border-t border-[#a3a3a3]/10"><span className="text-[#a3a3a3] font-bold uppercase tracking-widest text-[10px] block mb-1">Melhor método de preparo</span><span className="font-medium text-white block mb-1">{product.bestPreparation || "Tire o máximo em métodos filtrados."}</span><span className="text-xs text-[#a3a3a3]/70">Ideal para a moagem selecionada.</span></div>
            </div>

            {/* CURATION / WHY */}
            {(product.whySelected || product.isAwardWinning) && (
               <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-[#c9a263]/20 p-8 md:p-10 rounded-[3rem] text-white shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Star size={100} />
                 </div>
                 <h3 className="text-2xl font-serif mb-6 relative z-10">Por que este café entrou na curadoria da CofCof?</h3>
                 <div className="space-y-6 relative z-10">
                   <div className="flex gap-4 items-start">
                     <Star className="text-[#c9a263] mt-1 shrink-0" size={24}/>
                     <div>
                       <strong className="block text-white font-medium text-lg mb-1">{product.awardName ? "Reconhecimento" : "Seleção Técnica"}</strong>
                       <p className="text-[#a3a3a3] font-light">{product.isAwardWinning ? `${product.awardName} ${product.awardYear ? `(${product.awardYear})` : ''}` : 'Avaliação rigorosa pelo painel interno.'}</p>
                     </div>
                   </div>
                   <div className="flex gap-4 items-start">
                     <CheckCircle2 className="text-[#c9a263] mt-1 shrink-0" size={24}/>
                     <div>
                       <strong className="block text-white font-medium text-lg mb-1">Motivo</strong>
                       <p className="text-[#a3a3a3] leading-relaxed font-light">{product.whySelected || 'Perfil sensorial único e alta consistência do produtor.'}</p>
                     </div>
                   </div>
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPARATIVO ON PRODUCT PAGE */}
      <section className="bg-[#111111] py-32 px-6 border-t border-[#a3a3a3]/10 mt-16 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[#c9a263]/5 opacity-10 mix-blend-overlay"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white leading-tight">Você está prestes a descobrir o que é um café de verdade.</h2>
            <p className="text-xl text-[#a3a3a3] font-light">A diferença não é sutil. É uma mudança de categoria.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Café comum */}
            <div className="p-10 md:p-14 rounded-[3rem] border border-[#a3a3a3]/10 bg-[#1a1a1a]/50 flex flex-col relative overflow-hidden">
              <h3 className="text-2xl font-serif text-[#a3a3a3]/80 mb-8 border-b border-[#a3a3a3]/10 pb-6 relative z-10">Café Comum de Supermercado</h3>
              <ul className="space-y-6 flex-1 text-[#a3a3a3] font-light relative z-10">
                <li className="flex gap-4"><div className="w-2 h-2 mt-2 rounded-full bg-[#a3a3a3]/30 shrink-0"/><span>Torra excessivamente escura para esconder defeitos e impurezas.</span></li>
                <li className="flex gap-4"><div className="w-2 h-2 mt-2 rounded-full bg-[#a3a3a3]/30 shrink-0"/><span>Amargor intenso, necessitando de muito açúcar para mascarar o gosto ruim.</span></li>
                <li className="flex gap-4"><div className="w-2 h-2 mt-2 rounded-full bg-[#a3a3a3]/30 shrink-0"/><span>Origem genérica ("Produzido no Brasil"), sem produtor identificado.</span></li>
                <li className="flex gap-4"><div className="w-2 h-2 mt-2 rounded-full bg-[#a3a3a3]/30 shrink-0"/><span>Meses guardado em prateleiras, perdendo totalmente o frescor.</span></li>
              </ul>
            </div>
            
            {/* Este Lote */}
            <div className="p-10 md:p-14 rounded-[3rem] border border-[#c9a263]/30 bg-gradient-to-b from-[#111111] to-[#1a1a1a] shadow-[0_20px_40px_rgba(201,162,99,0.1)] flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Coffee size={180} className="text-[#c9a263]" /></div>
               <h3 className="text-3xl font-serif text-[#c9a263] mb-8 border-b border-[#c9a263]/20 pb-6 flex items-center gap-3 relative z-10">
                 Este Lote <Star size={20}/>
               </h3>
               <ul className="space-y-6 flex-1 text-white font-light relative z-10">
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Torra meticulosa focada apenas em realçar a doçura natural do grão.</span></li>
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Perfil sensorial complexo: notas reais sem precisar de açúcar.</span></li>
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Origem 100% rastreável até a fazenda e o produtor {product.producer || ''}.</span></li>
                 <li className="flex gap-4"><CheckCircle2 className="text-[#c9a263] shrink-0" size={24}/><span>Torrado sempre sob demanda após o pedido, frescor absoluto.</span></li>
               </ul>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <button 
                onClick={() => {
                   handleAddToCart();
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="premium-cta !px-12 !py-6 text-lg"
             >
               Experimentar este café agora
             </button>
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section className="py-20 px-6 border-t border-[#a3a3a3]/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif text-white">Avaliações</h3>
            <div className="flex items-center gap-2 text-[#c9a263]">
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              <span className="text-white text-sm ml-2">5.0 (24)</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#111111] p-6 rounded-2xl border border-[#a3a3a3]/10">
               <div className="flex items-center justify-between mb-2">
                 <span className="font-bold text-white text-sm">João F. <span className="text-[#a3a3a3] font-normal ml-2">Comprador verificado</span></span>
                 <div className="flex text-[#c9a263]"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
               </div>
               <p className="text-[#a3a3a3] text-sm">Simplesmente espetacular. O cheiro que fica na cozinha é indescritível e na boca o caramelo e o chocolate saltam. Primeira vez bebendo sem açúcar graças a esse grão.</p>
            </div>
            <div className="bg-[#111111] p-6 rounded-2xl border border-[#a3a3a3]/10">
               <div className="flex items-center justify-between mb-2">
                 <span className="font-bold text-white text-sm">Marcos S. <span className="text-[#a3a3a3] font-normal ml-2">Assinante</span></span>
                 <div className="flex text-[#c9a263]"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
               </div>
               <p className="text-[#a3a3a3] text-sm">O cuidado com a embalagem, a torra e o QrCode na frente para saber sobre a fazenda... sensacional. Virou meu café da tarde oficial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0a0a0a] py-32 px-6 border-t border-[#a3a3a3]/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 text-white">Ainda com Dúvidas?</h2>
            <p className="text-[#a3a3a3] font-light">Respostas rápidas para você comprar com tranquilidade.</p>
          </div>
          <div className="bg-[#111111] p-8 md:p-12 rounded-[2rem] border border-[#a3a3a3]/10">
            <FAQItem 
              question="Café especial não amarga?" 
              answer="Não. O amargor do café comum vem da torra excessivamente escura, feita para esconder defeitos. Nossos lotes têm qualidade tão alta que a torra foca apenas em realçar a doçura natural da fruta. Você vai se surpreender bebendo sem açúcar pela primeira vez."
            />
            <FAQItem 
              question="Qual moagem devo escolher?" 
              answer="Depende de como você prepara. Escolha 'Grão' se você tem moedor em casa (garante o máximo de frescor). Escolha 'Moído' para usar na sua cafeteira tradicional, melitta ou v60. Escolha 'Cápsula' se for usar em máquinas compatíveis com Nespresso."
            />
            <FAQItem 
              question="Em quanto tempo chega?" 
              answer="Torramos seu café logo após o pedido para garantir o frescor absoluto. O prazo varia conforme sua região, mas despachamos na transportadora em até 48 horas úteis após a confirmação. O prazo final pode ser visto no momento de digitar seu CEP na finalização."
            />
            <FAQItem 
              question="E se eu não gostar?" 
              answer="Temos a Garantia CofCof. Se for sua primeira compra e você não sentir diferença para o seu café habitual, nós devolvemos o valor do seu primeiro pacote. Confiamos na qualidade do que entregamos."
            />
          </div>
        </div>
      </section>

    </div>
  );
}
