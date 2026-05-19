import React, { useState } from 'react';
import { Calendar, DollarSign, Package, TrendingUp, ChevronDown, ChevronUp, Clock, History, Target, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OperationEmptyState } from './OperationEmptyState';

interface DailyOverviewProps {
  dates: {start: Date, end: Date};
  stats: any;
  onAction?: (action: string) => void;
}

export function DailyOverview({ dates, stats, onAction }: DailyOverviewProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  
  // In a real scenario we'd query events grouped by day from the DB.
  // Here we'll simulate the daily view structural layout required.
  const todayStr = format(dates.start, "dd/MM/yyyy");
  const mockDayStr = todayStr;
  
  const hasEvents = stats?.operationalEventsCount > 0 || (stats?.roastedKgInPeriod > 0) || (stats?.rawLotsLaunchedInPeriod > 0);

  if (!hasEvents) {
    return (
      <OperationEmptyState
        icon={History}
        title="Sem eventos registrados"
        description="Nenhuma operação foi lançada no período selecionado."
        actionLabel="Lançar Operação"
        onAction={() => onAction?.('launch_lot')}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
         <div>
            <h2 className="text-xl font-black tracking-tight text-[#1C1A17]">Diário Operacional</h2>
            <p className="text-xs text-gray-500 font-medium">Acompanhamento diário da operação</p>
         </div>
         <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
             <Calendar size={16} className="text-gray-400" />
             <span className="text-xs font-black text-[#1C1A17]">Período selecionado</span>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm transition-all hover:border-[#B06A32]/30 hover:shadow-lg">
         
         {/* CABEÇALHO DO DIA (Clicável para expandir) */}
         <div 
            className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            onClick={() => setExpandedDate(expandedDate === mockDayStr ? null : mockDayStr)}
         >
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Calendar size={20} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-[#1C1A17]">{mockDayStr}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">{stats?.operationalEventsCount || 0} eventos registrados</p>
                 </div>
             </div>
             
             <div className="flex flex-wrap items-center gap-3">
                 <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Flame size={12} className="text-orange-500"/>
                    <span className="text-[10px] font-black text-gray-700">{stats?.roastedKgInPeriod || 0}kg</span>
                 </div>
                 <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Package size={12} className="text-amber-500"/>
                    <span className="text-[10px] font-black text-gray-700">{stats?.packagedUnitsInPeriod || 0} un</span>
                 </div>
                 <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    <DollarSign size={12} className="text-emerald-600"/>
                    <span className="text-[10px] font-black text-emerald-700">R$ {((stats?.packagedUnitsInPeriod || 0) * 45).toLocaleString('pt-BR')}</span>
                 </div>
                 <button className="w-8 h-8 flex flex-shrink-0 items-center justify-center bg-gray-50 rounded-full text-gray-500">
                     {expandedDate === mockDayStr ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                 </button>
             </div>
         </div>

         {/* ÁREA EXPANDIDA (Timeline e Detalhes do Dia) */}
         {expandedDate === mockDayStr && (
             <div className="border-t border-gray-100 bg-gray-50/50 p-6 sm:p-8 animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Coluna Esquerda: Métricas do Dia */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#1C1A17] mb-6">Métricas do Dia</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-gray-200">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Café Cru Entrou</p>
                                <p className="text-lg font-black text-[#1C1A17]">{stats?.rawKgPurchasedInPeriod || 0}kg</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-orange-100">
                                <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-1">Café Torrado</p>
                                <p className="text-lg font-black text-orange-600">{stats?.roastedKgInPeriod || 0}kg</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-amber-100">
                                <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1">200g / 1kg Pct</p>
                                <p className="text-lg font-black text-amber-600">{stats?.packagedByFormat?.['200g'] || 0} / {stats?.packagedByFormat?.['1kg'] || 0}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Consignações / Vendas</p>
                                <p className="text-lg font-black text-emerald-600">R$ {stats?.pendingConsignmentValue?.toLocaleString('pt-BR') || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Timeline do Dia */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#1C1A17] mb-6 flex items-center gap-2">
                           <History size={14} className="text-gray-400" /> Timeline Operacional
                        </h4>
                        
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                            {/* Dummy Timeline Items */}
                            <div className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                </span>
                                <div className="text-[10px] font-bold text-gray-400 mb-1">08:12</div>
                                <p className="text-sm font-black text-[#1C1A17]">Arthur lançou lote <span className="text-indigo-600">Cerrado Doce Misto</span></p>
                                <p className="text-xs font-medium text-gray-500">200kg • R$ 38,00/kg</p>
                            </div>
                            
                            <div className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                </span>
                                <div className="text-[10px] font-bold text-gray-400 mb-1">10:30</div>
                                <p className="text-sm font-black text-[#1C1A17]">Torra registrada <span className="text-orange-600">(18kg fluidos)</span></p>
                                <p className="text-xs font-medium text-gray-500">Perfil: Espresso Base • Mestre: João</p>
                            </div>
                            
                            <div className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                </span>
                                <div className="text-[10px] font-bold text-gray-400 mb-1">13:50</div>
                                <p className="text-sm font-black text-[#1C1A17]">Empacotamento <span className="text-amber-600">84 pacotes 200g</span></p>
                                <p className="text-xs font-medium text-gray-500">Origem: Torra #452</p>
                            </div>

                            <div className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                </span>
                                <div className="text-[10px] font-bold text-gray-400 mb-1">15:20</div>
                                <p className="text-sm font-black text-[#1C1A17]">Mestre João encerrou turno</p>
                                <p className="text-xs font-medium text-gray-500">4h trabalhadas aprovadas</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
         )}
      </div>
    </div>
  );
}
