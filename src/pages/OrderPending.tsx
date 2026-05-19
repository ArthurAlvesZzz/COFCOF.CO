import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, ExternalLink } from 'lucide-react';

export default function OrderPending() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="bg-[#F6F1EB] min-h-[calc(100vh-88px)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl text-center">
        <div className="w-20 h-20 bg-[#F6F1EB] rounded-3xl flex items-center justify-center text-[#B06A32] mx-auto mb-8">
           <Clock size={40} />
        </div>
        
        <h1 className="text-3xl font-serif text-[#1C1A17] mb-4">Pagamento Pendente</h1>
        <p className="text-[#2A160E]/60 text-sm leading-relaxed mb-6">
          Seu pagamento está em análise ou aguardando conclusão (Pix/Boleto). Reservamos seu pedido temporariamente.
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
            className="w-full block bg-[#1C1A17] text-[#F6F1EB] py-4 rounded-xl font-bold hover:bg-[#B06A32] transition-colors"
          >
            Voltar para a loja
          </Link>
          <a 
            href="https://wa.me/5531999999999" target="_blank" rel="noreferrer"
            className="w-full flex justify-center items-center gap-2 bg-transparent text-[#2A160E] py-4 rounded-xl font-medium text-sm hover:text-[#B06A32]"
          >
            Falar no WhatsApp <ExternalLink size={14}/>
          </a>
        </div>
      </div>
    </div>
  );
}
