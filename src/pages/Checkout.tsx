import React, { useState, useRef } from 'react';
import { useCartStore } from '../store/cartStore';
import { couponService } from '../services/couponService';
import { Coupon } from '../types/admin';
import { ShieldCheck, Lock, MapPin, Truck, ChevronRight, X, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

type CepAddress = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
};

const cleanCep = (cep: string) => cep.replace(/\D/g, '').slice(0, 8);

const maskCep = (cep: string) => {
  const cleaned = cleanCep(cep);
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};

export default function Checkout() {
  const { items, getCartTotal } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [cepSuccessMsg, setCepSuccessMsg] = useState<string | null>(null);
  const [lastSearchedCep, setLastSearchedCep] = useState<string | null>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    deliveryType: 'entrega', // entrega, retirada
    notes: ''
  });

  const subtotal = getCartTotal();
  const baseShipping = formData.deliveryType === 'entrega' ? (subtotal > 200 ? 0 : 25) : 0;
  
  let discountAmount = 0;
  let discountShipping = 0;

  if (appliedCoupon) {
      const discounts = couponService.calculateCouponDiscount(appliedCoupon, subtotal, baseShipping);
      discountAmount = discounts.discountAmount;
      discountShipping = discounts.discountShipping;
  }

  const shipping = baseShipping - discountShipping;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setValidatingCoupon(true);
    setCouponError(null);
    setCouponSuccess(null);
    try {
      const result = await couponService.validateCouponForCart(couponCodeInput, subtotal);
      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon);
        setCouponSuccess('Cupom aplicado com sucesso.');
      } else {
        setAppliedCoupon(null);
        setCouponError(result.error || 'Cupom inválido.');
      }
    } catch (e) {
       setCouponError('Erro ao validar cupom.');
       setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
     setAppliedCoupon(null);
     setCouponCodeInput('');
     setCouponError(null);
     setCouponSuccess(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchAddress = async (cleanedCep: string, formattedCep: string) => {
    setCepLoading(true);
    setCepError(null);
    setCepSuccessMsg(null);
    setLastSearchedCep(cleanedCep);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await res.json();

      if (data.erro) {
         const resBrasil = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanedCep}`);
         if (!resBrasil.ok) {
           setCepError("Não encontramos esse CEP. Confira os números ou preencha manualmente.");
           return;
         }
         const dataBrasil = await resBrasil.json();
         setFormData(prev => ({
           ...prev,
           street: dataBrasil.street || prev.street,
           neighborhood: dataBrasil.neighborhood || prev.neighborhood,
           city: dataBrasil.city || prev.city,
           state: dataBrasil.state || prev.state
         }));
         setCepSuccessMsg("Endereço encontrado. Agora informe o número.");
         numberInputRef.current?.focus();
         return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state
      }));
      
      setCepSuccessMsg("Endereço encontrado. Agora informe o número.");
      numberInputRef.current?.focus();
    } catch (err) {
      setCepError("Não foi possível buscar o endereço agora. Você pode preencher manualmente.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formattedCep = maskCep(rawVal);
    const cleanedCep = cleanCep(rawVal);
    
    setFormData(prev => ({ ...prev, cep: formattedCep }));
    
    if (cleanedCep.length < 8) {
       setCepError(null);
       setCepSuccessMsg(null);
       return;
    }
    
    if (cleanedCep.length === 8 && cleanedCep !== lastSearchedCep) {
       await fetchAddress(cleanedCep, formattedCep);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Seu carrinho está vazio");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderId = `COF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          couponId: appliedCoupon?.id,
          couponCode: appliedCoupon?.code,
          subtotalBeforeDiscount: subtotal,
          discountAmount: discountAmount,
          totalAfterDiscount: total,
          items: items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            format: item.format,
            unitPrice: item.product.price,
            quantity: item.quantity
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            cpf: formData.cpf
          },
          shipping: {
            type: formData.deliveryType,
            cep: formData.cep,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            notes: formData.notes
          },
          total
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar checkout");
      }

      // Save order locally for admin mock
      try {
        const { orderService } = await import('../services/orderService');
        await orderService.createOrder({
          id: orderId,
          orderNumber: orderId,
          customer: {
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            cpf: formData.cpf
          },
          shipping: {
            type: formData.deliveryType as any,
            cep: formData.cep,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            notes: formData.notes
          },
          items: items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            format: item.format,
            unitPrice: item.product.price,
            quantity: item.quantity,
            totalPrice: item.product.price * item.quantity
          })),
          subtotal: subtotal,
          discount: 0,
          shippingPrice: shipping,
          total: total,
          currency: 'BRL',
          payment: {
            status: 'pending',
            providerPreferenceId: data.preferenceId
          },
          status: 'awaiting_payment',
          source: 'checkout'
        });
      } catch (err) {
        console.warn("Could not save mock order locally", err);
      }

      if (data.checkoutUrl) {
        // Redirect to gateway
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Link de pagamento não gerado");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
        <header className="bg-[#111111] border-b border-[#a3a3a3]/10 py-6 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
          <Link to="/" className="text-2xl font-serif text-white tracking-widest uppercase hover:text-[#c9a263] transition-colors">
            CofCof
          </Link>
          <div className="flex items-center gap-2 text-[#a3a3a3] text-xs font-bold tracking-widest uppercase">
            <Lock size={14} className="text-[#c9a263]"/> Checkout Seguro
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md w-full premium-card p-12">
            <div className="w-16 h-16 bg-[#c9a263]/10 rounded-2xl flex items-center justify-center text-[#c9a263] mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-serif text-white mb-4">Seu carrinho está vazio</h2>
            <p className="text-[#a3a3a3] mb-8">Adicione pacotes de café para prosseguir com a finalização.</p>
            <Link to="/cafes" className="premium-cta block w-full py-4 text-center">
              Conhecer cafés
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Minimal Header */}
      <header className="bg-[#111111] border-b border-[#a3a3a3]/10 py-6 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="text-2xl font-serif text-white tracking-widest uppercase hover:text-[#c9a263] transition-colors">
          CofCof
        </Link>
        <div className="flex items-center gap-2 text-[#a3a3a3] text-xs font-bold tracking-widest uppercase">
          <Lock size={14} className="text-[#c9a263]"/> Checkout Seguro
        </div>
      </header>

      <div className="pt-12 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Formulário - Coluna Esquerda */}
          <div className="flex-1 w-full lg:sticky lg:top-32 h-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">Finalize sua compra CofCof</h1>
              <p className="text-[#a3a3a3] text-lg font-light">Informe seus dados para receber seu café com segurança.</p>
            </div>

            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              
              {error && (
                <div className="bg-red-900/20 text-red-500 border border-red-900/50 p-4 rounded-xl flex items-center gap-3 text-sm">
                   <AlertCircle size={18} /> {error}
                </div>
              )}

              {/* Dados Pessoais */}
              <div className="premium-card p-6 md:p-8">
                <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#c9a263]/10 flex items-center justify-center text-[#c9a263] text-xs font-bold">1</span> 
                  Dados Pessoais
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">Nome Completo *</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">E-mail *</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">WhatsApp *</label>
                    <input required name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} type="tel" placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">CPF (Opcional para NF)</label>
                    <input name="cpf" value={formData.cpf} onChange={handleInputChange} type="text" placeholder="000.000.000-00" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                  </div>
                </div>
              </div>

              {/* Entrega */}
              <div className="premium-card p-6 md:p-8 flex flex-col gap-6">
                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#c9a263]/10 flex items-center justify-center text-[#c9a263] text-xs font-bold">2</span> 
                  Forma de Entrega
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer border p-4 rounded-xl flex items-start gap-3 transition-colors ${formData.deliveryType === 'entrega' ? 'border-[#c9a263] bg-[#c9a263]/10' : 'border-[#a3a3a3]/10 hover:border-[#c9a263]/30 bg-[#111111]'}`}>
                    <input type="radio" name="deliveryType" value="entrega" checked={formData.deliveryType === 'entrega'} onChange={handleInputChange} className="mt-1 accent-[#c9a263]" />
                    <div>
                       <div className="font-bold text-white text-sm flex items-center gap-2"><Truck size={16}/> Receber em casa</div>
                       <div className="text-xs text-[#a3a3a3] mt-1">Correios ou transportadora</div>
                    </div>
                  </label>
                  <label className={`cursor-pointer border p-4 rounded-xl flex items-start gap-3 transition-colors ${formData.deliveryType === 'retirada' ? 'border-[#c9a263] bg-[#c9a263]/10' : 'border-[#a3a3a3]/10 hover:border-[#c9a263]/30 bg-[#111111]'}`}>
                    <input type="radio" name="deliveryType" value="retirada" checked={formData.deliveryType === 'retirada'} onChange={handleInputChange} className="mt-1 accent-[#c9a263]" />
                    <div>
                       <div className="font-bold text-white text-sm flex items-center gap-2"><MapPin size={16}/> Retirar na torrefação</div>
                       <div className="text-xs text-[#a3a3a3] mt-1">Combine a retirada conosco</div>
                    </div>
                  </label>
                </div>

                {formData.deliveryType === 'entrega' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#a3a3a3]/10">
                     <div className="sm:col-span-1">
                       <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">CEP *</label>
                       <div className="relative">
                         <input required name="cep" value={formData.cep} onChange={handleCepChange} type="text" maxLength={9} aria-invalid={!!cepError} placeholder="00000-000" className={`w-full px-4 py-3 rounded-xl bg-[#111111] border ${cepError ? 'border-red-400' : 'border-[#a3a3a3]/10'} focus:outline-none focus:border-[#c9a263] text-white transition-all`} />
                         {cepLoading && <Loader2 className="absolute right-3 top-3.5 animate-spin text-[#c9a263]" size={18} />}
                       </div>
                       {cepError && <span className="text-xs text-red-500 mt-1 block">{cepError}</span>}
                       {cepSuccessMsg && <span className="text-xs text-[#c9a263] mt-1 block">{cepSuccessMsg}</span>}
                       {!cepError && !cepSuccessMsg && <span className="text-[10px] text-[#a3a3a3]/60 mt-1 block uppercase tracking-widest">Digite o CEP para autocompletar</span>}
                     </div>
                     <div className="sm:col-span-1">
                       <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">Rua *</label>
                       <input required name="street" value={formData.street} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                     </div>
                     <div className="sm:col-span-1">
                       <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">Número *</label>
                       <input ref={numberInputRef} required name="number" value={formData.number} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                     </div>
                     <div className="sm:col-span-1">
                       <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">Complemento</label>
                       <input name="complement" value={formData.complement} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                     </div>
                     <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="sm:col-span-1">
                         <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">Bairro *</label>
                         <input required name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                       </div>
                       <div className="sm:col-span-1">
                         <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">Cidade *</label>
                         <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all" />
                       </div>
                       <div className="sm:col-span-1">
                         <label className="text-[10px] font-bold text-[#a3a3a3] tracking-widest uppercase mb-2 block">UF *</label>
                         <input required name="state" value={formData.state} onChange={handleInputChange} type="text" maxLength={2} className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#a3a3a3]/10 focus:outline-none focus:border-[#c9a263] text-white transition-all text-transform: uppercase" />
                       </div>
                     </div>
                  </div>
                )}
              </div>
              
            </form>
          </div>

          {/* Resumo - Coluna Direita */}
          <div className="w-full lg:w-[420px] shrink-0">
             <div className="premium-card p-6 md:p-8 sticky top-32 shadow-[0_20px_50px_rgba(201,162,99,0.05)] border-[#c9a263]/20 bg-[#111111]/80 backdrop-blur-md">
                <h3 className="text-2xl font-serif mb-6 text-white">Resumo do pedido</h3>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {items.map(item => (
                     <div key={`${item.product.id}-${item.format}`} className="flex gap-4">
                       <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0 border border-[#a3a3a3]/10">
                         <img src={item.product.image} className="w-full h-full object-cover mix-blend-lighten opacity-80" alt={item.product.name} />
                       </div>
                       <div className="flex-1">
                         <h4 className="text-sm font-medium text-white">{item.product.name}</h4>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">{item.format}</p>
                         <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-[#a3a3a3]">{item.quantity}x</span>
                            <span className="text-sm font-bold text-white">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                         </div>
                       </div>
                     </div>
                   ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-[#a3a3a3]/10 text-sm mb-6">
                   <div className="mb-6 flex flex-wrap gap-2">
                      <input 
                        type="text" 
                        placeholder="Cupom de desconto" 
                        className="flex-1 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-xl px-4 py-3 placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#c9a263] uppercase text-white font-mono min-w-[200px]"
                        value={couponCodeInput}
                        onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                        disabled={!!appliedCoupon || validatingCoupon}
                      />
                      {!appliedCoupon ? (
                        <button 
                           onClick={handleApplyCoupon}
                           disabled={!couponCodeInput.trim() || validatingCoupon}
                           className="px-6 py-3 bg-[#1a1a1a] text-[#a3a3a3] border border-[#a3a3a3]/10 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:border-[#c9a263] hover:text-[#c9a263] transition-colors disabled:opacity-50 min-w-24 whitespace-nowrap"
                        >
                           {validatingCoupon ? <Loader2 size={16} className="animate-spin" /> : 'Aplicar'}
                        </button>
                      ) : (
                        <button 
                           onClick={handleRemoveCoupon}
                           className="px-6 py-3 bg-red-900/10 text-red-400 border border-red-900/20 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-900/20 transition-colors min-w-24 whitespace-nowrap"
                        >
                           Remover
                        </button>
                      )}
                   </div>
                   {couponError && <p className="text-red-400 text-xs mb-2 bg-red-900/10 p-2 rounded-lg">{couponError}</p>}
                   {couponSuccess && <p className="text-green-400 text-xs mb-2 bg-[#c9a263]/10 p-2 rounded-lg border border-[#c9a263]/20 text-[#c9a263] font-bold">{couponSuccess}</p>}

                   <div className="flex justify-between text-[#a3a3a3]">
                     <span>Subtotal</span>
                     <span className="text-white">R$ {subtotal.toFixed(2)}</span>
                   </div>
                   {appliedCoupon && (
                     <div className="flex justify-between text-[#c9a263]">
                       <span className="opacity-80">Desconto ({appliedCoupon.code})</span>
                       <span className="font-bold">- R$ {discountAmount.toFixed(2)}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-[#a3a3a3]">
                     <span>Frete {formData.deliveryType === 'retirada' ? '(Retirada)' : ''}</span>
                     <span className={shipping === 0 ? 'text-[#c9a263] font-bold uppercase tracking-wide text-xs mt-0.5' : 'text-white'}>{shipping === 0 ? (formData.deliveryType === 'retirada' ? 'Grátis' : (baseShipping === 0 ? 'Grátis' : 'Grátis (Cupom)')) : `R$ ${shipping.toFixed(2)}`}</span>
                   </div>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-[#a3a3a3]/10 mb-8">
                   <span className="text-[#a3a3a3] font-bold uppercase tracking-widest text-xs">Total</span>
                   <span className="text-3xl font-serif text-[#c9a263]">R$ {total.toFixed(2)}</span>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={loading}
                  className="premium-cta w-full flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><Lock size={18}/> Ir para pagamento seguro</>}
                </button>

                <div className="mt-8 flex flex-col items-center gap-3">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">
                     <ShieldCheck size={14} className="text-[#c9a263]"/> Ambiente Seguro e Criptografado
                   </div>
                   <p className="text-[10px] text-white/70 text-center max-w-[250px] leading-relaxed">
                     Crie sua conta depois para acompanhar pedidos e assinatura.
                   </p>
                   <a 
                     href="https://wa.me/5531999999999" 
                     target="_blank" rel="noreferrer"
                     className="text-[10px] text-[#a3a3a3] hover:text-[#c9a263] uppercase tracking-widest font-bold transition-colors mt-2"
                   >
                     Dúvidas? Fale direto no WhatsApp
                   </a>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
