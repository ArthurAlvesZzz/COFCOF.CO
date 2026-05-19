import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, PackageCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart on successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-[#F6F1EB] min-h-[calc(100vh-88px)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl text-center">
        <div className="w-20 h-20 bg-[#F6F1EB] rounded-3xl flex items-center justify-center text-[#B06A32] mx-auto mb-8 relative">
           <PackageCheck size={40} />
           <CheckCircle2 size={24} className="absolute -bottom-2 -right-2 text-green-600 bg-white rounded-full border-2 border-white" />
        </div>
        
        <h1 className="text-3xl font-serif text-[#1C1A17] mb-4">Pedido recebido!</h1>
        <p className="text-[#2A160E]/60 text-sm leading-relaxed mb-8">
          Seu pagamento foi confirmado com sucesso. Estamos preparando seus cafés com o máximo de frescor.
        </p>
        
        {orderId && (
          <div className="bg-[#F6F1EB]/50 p-4 rounded-2xl mb-8 flex items-center justify-between">
            <span className="text-[#2A160E]/60 text-xs uppercase font-bold tracking-widest">Pedido</span>
            <span className="font-mono text-[#1C1A17] font-bold">{orderId}</span>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            to="/cafes"
            className="w-full block bg-[#1C1A17] text-[#F6F1EB] py-4 rounded-xl font-bold hover:bg-[#B06A32] shadow-lg shadow-[#1C1A17]/10 transition-colors"
          >
            Continuar comprando
          </Link>
          <a 
            href="https://wa.me/5531999999999" target="_blank" rel="noreferrer"
            className="w-full block bg-transparent text-[#2A160E] py-4 rounded-xl border border-[#2A160E]/10 hover:bg-[#F6F1EB] transition-colors font-medium text-sm"
          >
            Acompanhar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
