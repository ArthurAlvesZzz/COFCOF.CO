import React, { useState, useEffect } from 'react';
import { stockService } from '../../../services/stockService';
import { StockMovement } from '../../../types/admin';
import { History, Search, Filter, ArrowDownLeft, ArrowUpRight, Flame, Package, Zap, User, Clock, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function GlobalMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    setLoading(true);
    try {
      const m = await stockService.getMovements();
      setMovements(m);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entrada_lote_cru': return { icon: ArrowDownLeft, color: 'text-indigo-600', bg: 'bg-indigo-50' };
      case 'torra_consumo_cru': return { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' };
      case 'torra_entrada_torrado': return { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-50' };
      case 'empacotamento_entrada_produto': return { icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'venda_confirmada': return { icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'ajuste_manual': return { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' };
      default: return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-50' };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1A17]">Linha do Tempo de Operações</h3>
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Filtrar histórico..." 
                 className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-[11px] font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#B06A32]/10 transition-all w-56"
               />
            </div>
            <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-[#1C1A17] transition-all">
               <Filter size={16} />
            </button>
         </div>
      </div>

      <div className="relative">
        {/* Timeline Path */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-100 -z-0" />

        <div className="space-y-6">
          {movements.map((mov, idx) => {
            const config = getMovementIcon(mov.type);
            return (
              <div key={mov.id} className="relative z-10 flex items-start gap-6 group">
                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${config.bg} ${config.color}`}>
                   <config.icon size={20} />
                </div>
                
                <div className="flex-1 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-gray-200 transition-all">
                   <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B06A32]">{mov.type.replace(/_/g, ' ')}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{format(new Date(mov.createdAt!), "HH:mm '•' dd/MM/yyyy")}</p>
                   </div>
                   
                   <h4 className="text-sm font-black text-[#1C1A17] mb-2">{mov.reason}</h4>
                   
                   <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                            <User size={12} />
                         </div>
                         <p className="text-[10px] font-bold text-gray-500 uppercase">{mov.userName || mov.userId}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-auto">
                        {mov.quantityKg !== undefined && (
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${mov.quantityKg > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {mov.quantityKg > 0 ? '+' : ''}{mov.quantityKg}kg
                          </div>
                        )}
                        {mov.quantityUnits !== undefined && (
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${mov.quantityUnits > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {mov.quantityUnits > 0 ? '+' : ''}{mov.quantityUnits}un
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              </div>
            );
          })}

          {movements.length === 0 && (
            <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
               <History size={40} className="mx-auto text-gray-300 mb-4" />
               <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Nenhuma movimentação registrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
