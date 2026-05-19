import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCcw } from 'lucide-react';

export default function OrderFailure() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="bg-[#F6F1EB] min-h-[calc(100vh-88px)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
           <XCircle size={40} />
        </div>
        
        <h1 className="text-3xl font-serif text-[#1C1A17] mb-4">Pagamento Não Concluído</h1>
        <p className="text-[#2A160E]/60 text-sm leading-relaxed mb-6">
          Houve um problema ao processar seu pagamento. Nenhuma cobrança foi efetivada no momento.
        </p>
        
        {orderId && (
          <div className="bg-[#F6F1EB]/50 p-4 rounded-2xl mb-8 flex items-center justify-between">
            <span className="text-[#2A160E]/60 text-xs uppercase font-bold tracking-widest">Pedido</span>
            <span className="font-mono text-[#1C1A17] font-bold">{orderId}</span>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-[#1C1A17] text-[#F6F1EB] py-4 rounded-xl font-bold hover:bg-[#B06A32] transition-colors"
          >
            <RefreshCcw size={18} /> Tentar novamente
          </Link>
          <a 
            href="https://wa.me/5534998728882" target="_blank" rel="noreferrer"
            className="w-full block bg-transparent text-[#2A160E] py-4 rounded-xl font-medium text-sm hover:text-[#B06A32]"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
