import React from 'react';
import { Target, Flame, Package, Layers, ArrowUpRight, Plus, Zap, AlertTriangle, Handshake, Clock } from 'lucide-react';

interface ProductionFlowProps {
  stats: any;
  onAction: (type: string) => void;
}

export function ProductionFlow({ stats, onAction }: ProductionFlowProps) {
  const steps = [
    { 
      id: 'lots', 
      label: 'Café Cru', 
      sub: `${stats?.rawKgAvailable || 0}kg em silo`, 
      icon: Target, 
      actions: ['Lançar Novo Lote', 'Ver Lotes'],
      state: (stats?.activeLotsCount || 0) > 0 || (stats?.rawKgAvailable || 0) > 0 ? 'active' : 'empty'
    },
    { 
      id: 'roast', 
      label: 'Torra', 
      sub: `${stats?.roastedKgInPeriod || 0}kg neste período`, 
      icon: Flame, 
      actions: ['Nova Torra', 'Histórico'],
      state: ((stats?.activeLotsCount || 0) === 0 && (stats?.rawKgAvailable || 0) === 0) ? 'locked' : ((stats?.roastedKgInPeriod || 0) > 0 ? 'active' : 'empty')
    },
    { 
      id: 'pack', 
      label: 'Empacotamento', 
      sub: ((stats?.roastedKgInPeriod || 0) > 0) ? 'Pronto para empacotar' : 'Aguardando torra', 
      icon: Package, 
      actions: ['Empacotar', 'Lotes Prontos'],
      state: ((stats?.roastedKgInPeriod || 0) <= 0) ? 'locked' : 'active'
    },
    { 
      id: 'stock', 
      label: 'Estoque Final', 
      sub: `${stats?.finishedStockUnits || 0} un. prontas`, 
      icon: Layers, 
      actions: ['Ajustar', 'Ver Itens'], // Re-ordered to match handler keys if needed, but not strictly necessary
      state: ((stats?.finishedStockUnits || 0) <= 0) ? 'empty' : 'active'
    },
    { 
      id: 'out', 
      label: 'Saída/Consig.', 
      sub: `${stats?.consignedUnits || 0} un. fora`, 
      icon: Handshake, 
      actions: ['Nova Guia', 'Acertos'],
      state: ((stats?.finishedStockUnits || 0) <= 0 && (stats?.consignedUnits || 0) === 0) ? 'locked' : ((stats?.consignedUnits || 0) > 0 ? 'active' : 'empty')
    },
  ];

  return (
    <div className="space-y-12 py-10">
      <div className="flex flex-wrap lg:grid lg:grid-cols-5 gap-8 items-start relative">
        {/* Step Line (hidden on small) */}
        <div className="hidden lg:block absolute top-[44px] left-10 right-10 h-0.5 bg-gray-100 -z-0" />
        
        {steps.map((step, idx) => (
          <div key={step.id} className={`flex-1 min-w-[200px] relative z-10 group cursor-pointer ${step.state === 'locked' ? 'opacity-60' : ''}`} onClick={() => {
              if (idx === 0) onAction('view_raw_stock');
              if (idx === 1) onAction('view_roasted');
              if (idx === 2) onAction('view_packaged');
              if (idx === 3) onAction('view_stock');
              if (idx === 4) onAction('view_consigned');
          }}>
            <div className={`w-20 h-20 mx-auto rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-sm border border-gray-100 group-hover:scale-110 group-hover:rotate-3 
              ${step.state === 'locked' ? 'bg-gray-100 text-gray-400' :
                step.state === 'empty' ? 'bg-white text-gray-400 border-dashed' :
                idx === 0 ? 'bg-white text-indigo-600' : 
                idx === 1 ? 'bg-white text-orange-600' : 
                idx === 2 ? 'bg-white text-amber-600' : 
                idx === 3 ? 'bg-white text-blue-600' : 'bg-white text-purple-600'}`}>
              <step.icon size={32} />
              {step.state === 'locked' && (
                  <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm border border-gray-100 translate-x-2 -translate-y-2">
                      <AlertTriangle size={12} />
                  </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-sm font-black text-[#1C1A17] uppercase tracking-widest flex items-center justify-center gap-1">
                 {step.label}
                 {step.state === 'locked' && <span className="text-[9px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded">Block</span>}
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${step.state === 'locked' ? 'text-red-400' : 'text-gray-400'}`}>{step.sub}</p>
              
              <div className="mt-6 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {step.actions.map(act => (
                  <button 
                    key={act} 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (act === 'Lançar Novo Lote') onAction('launch_lot');
                        else if (act === 'Nova Torra') onAction('register_roast');
                        else if (act === 'Empacotar') onAction('package_coffee');
                        else if (act === 'Ver Itens') onAction('filter_lotes');
                        else if (act === 'Ajustar') onAction('adjust_stock');
                        else if (act === 'Nova Guia') onAction('create_consignment');
                        else if (act === 'Acertos') onAction('settle_consignment');
                        else if (act === 'Ver Lotes') onAction('filter_lotes');
                        else if (act === 'Histórico') onAction('filter_torra');
                        else if (act === 'Lotes Prontos') onAction('filter_lotes');
                        else onAction('coming_soon');
                    }}
                    className="px-4 py-2 hover:bg-gray-50 text-[9px] font-black uppercase tracking-widest text-[#B06A32] transform hover:scale-105 transition-transform"
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Painéis Operacionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-gray-50">
          {/* Lotes */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl"><Target size={20} /></div>
                  <div>
                      <h4 className="text-sm font-black text-[#1C1A17]">Lotes de Café Cru</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stats?.activeLotsCount || 0} lotes ativos</p>
                  </div>
              </div>
              <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Lançados (Período)</span>
                      <span className="font-black text-[#1C1A17]">{stats?.rawLotsLaunchedInPeriod || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Comprados</span>
                      <span className="font-black text-[#1C1A17]">{stats?.rawKgPurchasedInPeriod || 0}kg</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Custo Médio</span>
                      <span className="font-black text-[#1C1A17]">R$ {stats?.averageRawCostPerKg?.toFixed(2) || '0.00'}/kg</span>
                  </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); onAction('launch_lot'); }} className="flex-1 bg-gray-50 hover:bg-gray-100 text-xs font-black text-[#1C1A17] py-2 rounded-xl transition-colors">Lançar</button>
                 <button onClick={(e) => { e.stopPropagation(); onAction('filter_lotes'); }} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 py-2 rounded-xl transition-colors">Ver Todos</button>
              </div>
          </div>

          {/* Torras */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 flex items-center justify-center rounded-xl"><Flame size={20} /></div>
                  <div>
                      <h4 className="text-sm font-black text-[#1C1A17]">Processo de Torra</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stats?.roastsCountInPeriod || 0} registradas</p>
                  </div>
              </div>
              <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Cru Consumido</span>
                      <span className="font-black text-[#1C1A17]">{stats?.rawKgUsedInPeriod || 0}kg</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Torrado Final</span>
                      <span className="font-black text-[#1C1A17]">{stats?.roastedKgInPeriod || 0}kg</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Perda Média</span>
                      <span className="font-black text-[#1C1A17]">{stats?.averageRoastLossPercent?.toFixed(1) || 0}%</span>
                  </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); onAction('register_roast'); }} className="flex-1 bg-orange-50 hover:bg-orange-100 text-xs font-black text-orange-600 py-2 rounded-xl transition-colors">Registrar Torra</button>
                 <button onClick={(e) => { e.stopPropagation(); onAction('filter_torra'); }} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 py-2 rounded-xl transition-colors">Histórico</button>
              </div>
          </div>

          {/* Empacotamento */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center rounded-xl"><Package size={20} /></div>
                  <div>
                      <h4 className="text-sm font-black text-[#1C1A17]">Empacotamento</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stats?.packagedUnitsInPeriod || 0} unidades geradas</p>
                  </div>
              </div>
              <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Peso Total</span>
                      <span className="font-black text-[#1C1A17]">{stats?.packagedKgInPeriod || 0}kg</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Formato 200g</span>
                      <span className="font-black text-[#1C1A17]">{stats?.packagedByFormat?.['200g'] || 0} un.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Formato 1kg</span>
                      <span className="font-black text-[#1C1A17]">{stats?.packagedByFormat?.['1kg'] || 0} un.</span>
                  </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); onAction('package_coffee'); }} className="flex-1 bg-amber-50 hover:bg-amber-100 text-xs font-black text-amber-700 py-2 rounded-xl transition-colors">Empacotar</button>
                 <button onClick={(e) => { e.stopPropagation(); onAction('filter_lotes'); }} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 py-2 rounded-xl transition-colors">Listar Lotes</button>
              </div>
          </div>

          {/* Estoque */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl"><Layers size={20} /></div>
                  <div>
                      <h4 className="text-sm font-black text-[#1C1A17]">Estoque Final</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stats?.finishedStockUnits || 0} un. disponíveis</p>
                  </div>
              </div>
              <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Pacotes 200g</span>
                      <span className="font-black text-[#1C1A17]">{stats?.finishedStockByFormat?.['200g'] || 0} un.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Pacotes 1kg</span>
                      <span className="font-black text-[#1C1A17]">{stats?.finishedStockByFormat?.['1kg'] || 0} un.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-gray-50">
                      <span className="font-bold text-red-500">Abaixo do Mínimo</span>
                      <span className="font-black text-red-600">{stats?.lowStockItemsCount || 0} itens</span>
                  </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); onAction('adjust_stock'); }} className="flex-1 bg-blue-50 hover:bg-blue-100 text-xs font-black text-blue-700 py-2 rounded-xl transition-colors">Ajustar</button>
                 <button onClick={(e) => { e.stopPropagation(); onAction('view_stock'); }} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 py-2 rounded-xl transition-colors">Ver Analítico</button>
              </div>
          </div>

          {/* Consignação */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 flex items-center justify-center rounded-xl"><Handshake size={20} /></div>
                  <div>
                      <h4 className="text-sm font-black text-[#1C1A17]">Consignação</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stats?.consignedUnits || 0} un. alocadas</p>
                  </div>
              </div>
              <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Valor na Rua</span>
                      <span className="font-black text-[#1C1A17]">R$ {stats?.pendingConsignmentValue?.toLocaleString('pt-BR') || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Pacotes 200g</span>
                      <span className="font-black text-[#1C1A17]">{stats?.consignedByFormat?.['200g'] || 0} un.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-gray-50">
                      <span className="font-bold text-red-500">Atrasadas</span>
                      <span className="font-black text-red-600">{stats?.overdueConsignmentsCount || 0} guias</span>
                  </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); onAction('create_consignment'); }} className="flex-1 bg-purple-50 hover:bg-purple-100 text-xs font-black text-purple-700 py-2 rounded-xl transition-colors">Nova Guia</button>
                 <button onClick={(e) => { e.stopPropagation(); onAction('view_consigned'); }} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 py-2 rounded-xl transition-colors">Cobrar</button>
              </div>
          </div>

          {/* Horas */}
          <div className="p-6 bg-[#1C1A17] border border-gray-800 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                  <div className="w-10 h-10 bg-pink-500/20 text-pink-400 flex items-center justify-center rounded-xl"><Clock size={20} /></div>
                  <div>
                      <h4 className="text-sm font-black text-white">Horas do Mestre</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stats?.roasterHoursInPeriod || 0}h no período</p>
                  </div>
              </div>
              <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-400">Pendentes de Pgto.</span>
                      <span className="font-black text-white">{stats?.pendingRoasterHours || 0}h</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-400">Aprovadas</span>
                      <span className="font-black text-white">{stats?.approvedRoasterHours || 0}h</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-gray-800">
                      <span className="font-bold text-pink-400">Previsão Fechamento</span>
                      <span className="font-black text-pink-500">R$ {stats?.estimatedPayrollValue || 0}</span>
                  </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); onAction('close_period'); }} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs font-black py-2 rounded-xl transition-colors">Aprovar / Pgto.</button>
                 <button onClick={(e) => { e.stopPropagation(); onAction('view_hours'); }} className="flex-1 bg-transparent border border-gray-700 text-white hover:bg-gray-800 text-xs font-bold py-2 rounded-xl transition-colors">Relatório</button>
              </div>
          </div>
      </div>
    </div>
  );
}
