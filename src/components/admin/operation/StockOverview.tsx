import React, { useState, useEffect } from 'react';
import { stockService } from '../../../services/stockService';
import { rawCoffeeLotService } from '../../../services/rawCoffeeLotService';
import { StockItem, RawCoffeeLot } from '../../../types/admin';
import { Layers, Package, Target, Flame, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { OperationEmptyState } from './OperationEmptyState';

interface StockOverviewProps {
  onAction?: (action: string) => void;
}

export function StockOverview({ onAction }: StockOverviewProps) {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [lots, setLots] = useState<RawCoffeeLot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [s, l] = await Promise.all([
      stockService.listStockItems(),
      rawCoffeeLotService.listRawCoffeeLots()
    ]);
    setStockItems(s);
    setLots(l);
    setLoading(false);
  };

  const rawStock = stockItems.filter(i => i.type === 'raw');
  const roastedStock = stockItems.filter(i => i.type === 'roasted');
  const finishedStock = stockItems.filter(i => i.type === 'finished');

  return (
    <div className="space-y-12">
      {/* 1. Raw Lots Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Target size={18} />
             </div>
             <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1A17]">Café Cru (Lotes)</h3>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lots.length} lotes ativos</span>
        </div>

        {lots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {lots.map(lot => (
               <div key={lot.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                     <div className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:bg-[#1C1A17] group-hover:text-white transition-colors">
                       {lot.code}
                     </div>
                     {lot.availableKg < (lot.lowStockThresholdKg || 50) && (
                       <div className="flex items-center gap-1 text-amber-600 animate-pulse">
                          <AlertTriangle size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Baixo Estoque</span>
                       </div>
                     )}
                  </div>
                  <h4 className="text-sm font-black text-[#1C1A17] mb-1">{lot.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{lot.supplier || 'Fornecedor não informado'}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-50">
                     <div className="flex justify-between items-end">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Disponível</p>
                        <p className="text-xl font-black text-[#1C1A17]">{lot.availableKg}<span className="text-xs text-gray-400 ml-1">kg</span></p>
                     </div>
                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${lot.availableKg < 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${Math.min(100, (lot.availableKg / lot.purchasedKg) * 100)}%` }}
                        ></div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <OperationEmptyState 
            icon={Target}
            title="Nenhum lote ativo"
            description="Sem lotes cru listados. Comece lançando um lote com origem, custo e pontuação."
            actionLabel="Lançar Novo Lote"
            onAction={() => onAction?.('launch_lot')}
          />
        )}
      </section>

      {/* 2. Roasted & Finished Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Roasted */}
         <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                  <Flame size={18} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1A17]">Café Torrado (Aguardando)</h3>
            </div>
            
            <div className="space-y-3">
               {roastedStock.length > 0 ? roastedStock.map(item => (
                 <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-orange-200 transition-all">
                    <div>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-0.5">Lote Torra {item.roastBatchId}</p>
                      <p className="text-sm font-black text-[#1C1A17]">Torra Industrial #104</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-[#1C1A17]">{item.availableKg}kg</p>
                       <p className="text-[9px] font-bold text-gray-400 uppercase">Pronto p/ Empacotar</p>
                    </div>
                 </div>
               )) : (
                 <OperationEmptyState 
                   icon={Flame}
                   title="Nenhum café aguardando"
                   description="Não há saldo de produto torrado esperando para ser empacotado."
                   actionLabel="Registrar Torra"
                   onAction={() => onAction?.('register_roast')}
                 />
               )}
            </div>
         </section>

         {/* Finished */}
         <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                  <Package size={18} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1A17]">Produto Acabado (Venda)</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {finishedStock.length > 0 ? ['200g', '250g', '500g', '1kg'].map(format => {
                 const itemsInFormat = finishedStock.filter(i => i.format === format);
                 if (itemsInFormat.length === 0) return null;
                 
                 const available = itemsInFormat.reduce((acc, i) => acc + (i.availableUnits || 0), 0);
                 const consigned = itemsInFormat.reduce((acc, i) => acc + (i.consignedUnits || 0), 0);
                 const reserved = itemsInFormat.reduce((acc, i) => acc + (i.reservedUnits || 0), 0);
                 
                 return (
                 <div key={format} className="bg-white p-5 rounded-3xl border border-gray-100 group hover:shadow-md transition-all flex flex-col justify-between hover:border-amber-200">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-black text-[#1C1A17] uppercase tracking-widest">{format}</p>
                            <span className="text-[10px] bg-gray-50 px-2 py-1 rounded text-gray-500 font-bold uppercase tracking-widest">{itemsInFormat.length} tipos</span>
                        </div>
                        
                        <div className="space-y-2 mb-4 mt-2">
                           <div className="flex justify-between items-center text-xs">
                               <span className="font-bold text-gray-500">Disponível</span>
                               <span className="font-black text-[#1C1A17] text-sm">{available}</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                               <span className="font-bold text-emerald-600">Consignado</span>
                               <span className="font-black text-emerald-600">{consigned}</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                               <span className="font-bold text-gray-400">Reservado</span>
                               <span className="font-black text-gray-400">{reserved}</span>
                           </div>
                        </div>
                    </div>
                 </div>
                 );
               }) : (
                  <div className="col-span-1 sm:col-span-2">
                     <OperationEmptyState 
                       icon={Package}
                       title="Nenhum pacote pronto"
                       description="Nenhum café embalado no momento."
                       actionLabel="Empacotar Café"
                       onAction={() => onAction?.('package_coffee')}
                     />
                  </div>
               )}
            </div>
         </section>
      </div>
    </div>
  );
}
