import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { mockProducts } from '../../data/seed';
import { X, Minus, Plus, ShoppingBag, Coffee, ArrowRight, ShieldCheck, Truck, PlusCircle } from 'lucide-react';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, items, addItem, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const cartTotal = getCartTotal();
  const freeShippingThreshold = 250;
  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - cartTotal;

  // Upsell Logic
  const upsellProduct = useMemo(() => {
    // try to find first kit or related that isn't in the cart
    const suggested = mockProducts.find(p => p.category === 'kit' && !items.find(i => i.product.id === p.id));
    if (suggested) return suggested;
    
    // Fallback to first non-cart item
    return mockProducts.find(p => !items.find(i => i.product.id === p.id));
  }, [items]);

  const handleCheckoutWhatsApp = () => {
    let text = "Olá! Gostaria de finalizar meu pedido na CofCof:\n\n";
    items.forEach(item => {
      text += `${item.quantity}x ${item.product.name} (${item.format}) - R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    text += `\nTotal: R$ ${cartTotal.toFixed(2)}`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/5531999999999?text=${encodedText}`, '_blank');
  };

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111111] shadow-2xl z-[101] flex flex-col border-l border-[#a3a3a3]/10"
          >
            {/* ... rest of header ... */}
            <div className="flex flex-col border-b border-[#a3a3a3]/10 shrink-0 bg-[#111111]">
              <div className="flex items-center justify-between p-6 md:p-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#c9a263]/10 text-[#c9a263] border border-[#c9a263]/30 rounded-xl flex items-center justify-center">
                      <ShoppingBag size={20} />
                   </div>
                   <h2 className="text-2xl font-serif text-white">Sua sacola</h2>
                </div>
                <button 
                  onClick={toggleCart}
                  className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors border border-transparent hover:border-[#a3a3a3]/10"
                >
                  <X size={20} className="text-[#a3a3a3]" />
                </button>
              </div>
              
              {/* Free Shipping Bar */}
              {items.length > 0 && (
                <div className="px-6 md:px-8 pb-6">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-white font-medium">
                       {remaining > 0 ? (
                         <>Faltam <strong className="text-[#c9a263]">R$ {remaining.toFixed(2)}</strong> para <span className="uppercase tracking-wider font-bold">Frete Grátis</span></>
                       ) : (
                         <span className="text-[#c9a263] font-bold uppercase tracking-wider">Você ganhou frete grátis!</span>
                       )}
                     </span>
                     <Truck size={14} className={remaining > 0 ? 'text-[#a3a3a3]' : 'text-[#c9a263]'}/>
                   </div>
                   <div className="w-full bg-[#1a1a1a] h-2 rounded-full overflow-hidden border border-[#a3a3a3]/10">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${progress}%` }}
                       className="h-full bg-[#c9a263]"
                     />
                   </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#0a0a0a]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-[#111111] border border-[#a3a3a3]/10 rounded-2xl flex items-center justify-center text-[#c9a263]/30 mb-6 mx-auto">
                    <Coffee size={40} />
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-3">Sua sacola está vazia</h3>
                  <p className="text-[#a3a3a3] text-sm mb-8 leading-relaxed max-w-[250px]">
                     Nossos melhores lotes estão esperando por você. Torrados sob demanda.
                  </p>
                  <button 
                    onClick={() => {
                        toggleCart();
                        navigate('/cafes');
                    }}
                    className="premium-cta"
                  >
                    Ver cafés
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.format}`} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-[#111111] border border-[#a3a3a3]/10 rounded-2xl overflow-hidden shrink-0 relative">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover mix-blend-lighten opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent pointer-events-none" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-white text-lg leading-tight">{item.product.name}</h3>
                          <button 
                            onClick={() => removeItem(item.product.id, item.format)}
                            className="text-[#a3a3a3]/50 hover:text-[#c9a263] transition-colors p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-3">
                           {item.format}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-[#111111] border border-[#a3a3a3]/10 rounded-full px-1.5 py-1.5 shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.format, item.quantity - 1)}
                              className="w-7 h-7 flex flex-col items-center justify-center text-[#a3a3a3] hover:text-[#c9a263] bg-[#1a1a1a] rounded-full"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.format, item.quantity + 1)}
                              className="w-7 h-7 flex flex-col items-center justify-center text-[#a3a3a3] hover:text-[#c9a263] bg-[#1a1a1a] rounded-full"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-medium text-white tracking-tight">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {upsellProduct && (
                    <div className="pt-6 border-t border-[#a3a3a3]/10">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-4 text-center">Complete sua experiência</div>
                      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#a3a3a3]/10 flex gap-4 items-center">
                         <div className="w-16 h-16 bg-[#111111] rounded-xl overflow-hidden shrink-0">
                            <img src={upsellProduct.image} alt={upsellProduct.name} className="w-full h-full object-cover mix-blend-lighten opacity-80" />
                         </div>
                         <div className="flex-1">
                           <h4 className="text-white text-sm font-medium mb-1 line-clamp-1">{upsellProduct.name}</h4>
                           <span className="text-[#a3a3a3] text-xs block mb-2">R$ {upsellProduct.price.toFixed(2)}</span>
                           <button 
                             onClick={() => addItem(upsellProduct, upsellProduct.formats[0])}
                             className="text-[10px] font-bold uppercase tracking-widest text-[#0a0a0a] bg-[#c9a263] px-3 py-1.5 rounded-lg flex items-center justify-center w-full gap-1 hover:bg-white transition-colors"
                           >
                             <PlusCircle size={12} /> Adicionar
                           </button>
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-[#a3a3a3]/10 space-y-3">
                     <div className="flex items-center gap-3 text-[#a3a3a3] text-sm font-medium">
                       <Truck size={16} className="text-[#c9a263]" /> Envio com código de rastreio
                     </div>
                     <div className="flex items-center gap-3 text-[#a3a3a3] text-sm font-medium">
                       <ShieldCheck size={16} className="text-[#c9a263]" /> Compra 100% segura
                     </div>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 md:p-8 bg-[#111111] border-t border-[#a3a3a3]/10 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#a3a3a3] text-sm font-medium uppercase tracking-widest text-[11px] font-bold">Subtotal</span>
                  <span className="text-2xl font-serif text-white tracking-tight">R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-[#a3a3a3] mb-6 flex items-center justify-center gap-2">
                   Frete e descontos calculados no checkout.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleCheckout}
                    className="premium-cta w-full flex justify-center !py-4 text-sm"
                  >
                    Finalizar compra <ArrowRight size={16} className="ml-2" />
                  </button>
                  <button 
                    onClick={toggleCart}
                    className="premium-cta-ghost w-full flex justify-center !text-sm"
                  >
                    Continuar comprando
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
