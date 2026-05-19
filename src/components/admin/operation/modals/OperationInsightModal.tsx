import React, { useState, useEffect } from 'react';
import { X, Target, Flame, Package, Layers, Handshake, History, TrendingUp, Users, Clock, AlertTriangle, Download, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { operationService } from '../../../../services/operationService';
import { adminLogService } from '../../../../services/adminLogService';
import { rawCoffeeLotService } from '../../../../services/rawCoffeeLotService';
import { stockService } from '../../../../services/stockService';
import { customerService } from '../../../../services/customerService';
import { consignmentService } from '../../../../services/consignmentService';

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string | null;
  dates: {start: Date, end: Date};
  stats: any; // We receive stats to show summary quickly, while we fetch the grid
  onAction?: (actionId: string) => void;
}

export function OperationInsightModal({ isOpen, onClose, type, dates, stats, onAction }: InsightModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && type) {
      loadData();
    }
  }, [isOpen, type, dates]);

  const loadData = async () => {
    setLoading(true);
    try {
        switch (type) {
            case 'raw_stock': {
                const lots = await rawCoffeeLotService.listRawCoffeeLots();
                setData(lots.filter(l => l.status === 'active'));
                break;
            }
            case 'lots_launched': {
                const lots = await rawCoffeeLotService.listRawCoffeeLots();
                setData(lots.filter(l => new Date(l.createdAt) >= dates.start && new Date(l.createdAt) <= dates.end));
                break;
            }
            case 'roasted': {
                const roasts = await operationService.listRoasts();
                setData(roasts.filter(r => new Date(r.date) >= dates.start && new Date(r.date) <= dates.end));
                break;
            }
            case 'packaged': {
                const packs = await operationService.listPackagingRuns();
                setData(packs.filter(p => new Date(p.date) >= dates.start && new Date(p.date) <= dates.end));
                break;
            }
            case 'finished_stock': {
                const items = await stockService.listStockItems();
                setData(items.filter(i => i.type === 'finished'));
                break;
            }
            case 'consigned': {
                const cons = await consignmentService.listConsignments();
                setData(cons);
                break;
            }
            case 'overdue_consignments': {
                const cons = await consignmentService.listConsignments();
                setData(cons.filter(c => c.status === 'overdue'));
                break;
            }
            case 'pending_values': {
                const cons = await consignmentService.listConsignments();
                setData(cons.filter(c => c.pendingValue && c.pendingValue > 0)); // Very simple pending
                break;
            }
            case 'new_customers': {
                const custs = await customerService.listCustomers();
                setData(custs.filter(c => new Date(c.createdAt) >= dates.start && new Date(c.createdAt) <= dates.end));
                break;
            }
            case 'roaster_hours': {
                const hours = await operationService.getTimeEntries();
                setData(hours.filter(h => new Date(h.date) >= dates.start && new Date(h.date) <= dates.end));
                break;
            }
            case 'movements': {
                const logs = await adminLogService.getLogs(); // Usually we should filter by date, let's just show recent
                setData(logs.filter(l => new Date(l.createdAt) >= dates.start && new Date(l.createdAt) <= dates.end));
                break;
            }
            case 'alerts': {
                setData(stats?.issues || []);
                break;
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen || !type) return null;

  const contentMap: Record<string, any> = {
    'raw_stock': { title: 'Café Cru Disponível', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50', emptyTitle: 'Sem café cru em estoque', emptyDesc: 'Lance a compra de um novo lote cru para ter saldo.', emptyBtn: 'Lançar Novo Lote', emptyAction: 'launch_lot' },
    'lots_launched': { title: 'Lotes Lançados', icon: Target, color: 'text-[#1C1A17]', bg: 'bg-gray-100', emptyTitle: 'Nenhum lote lançado', emptyDesc: 'Não há registros de entrada de lote cru no período.', emptyBtn: 'Lançar Lote', emptyAction: 'launch_lot' },
    'roasted': { title: 'Torrado no Período', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', emptyTitle: 'Nenhuma torra registrada', emptyDesc: 'Ainda não houve registro de torra no período.', emptyBtn: 'Registrar Torra', emptyAction: 'register_roast' },
    'packaged': { title: 'Empacotamento', icon: Package, color: 'text-amber-500', bg: 'bg-amber-50', emptyTitle: 'Nada empacotado', emptyDesc: 'Realize o empacotamento do café torrado disponivel.', emptyBtn: 'Empacotar', emptyAction: 'package_coffee' },
    'finished_stock': { title: 'Estoque Pronto', icon: Layers, color: 'text-blue-500', bg: 'bg-blue-50', emptyTitle: 'Estoque de pronto zerado', emptyDesc: 'Gere produtos acabados no fluxo de empacotar.', emptyBtn: 'Empacotar', emptyAction: 'package_coffee' },
    'consigned': { title: 'Total Consignado', icon: Handshake, color: 'text-purple-500', bg: 'bg-purple-50', emptyTitle: 'Nenhuma consignação', emptyDesc: 'Você ainda não enviou estoque para frente de loja/parceiros.', emptyBtn: 'Nova Guia', emptyAction: 'create_consignment' },
    'overdue_consignments': { title: 'Guias Atrasadas', icon: History, color: 'text-red-500', bg: 'bg-red-50', emptyTitle: 'Nenhum atraso!', emptyDesc: 'Todas as guias estão em dia ou não há consignações ativas.', emptyBtn: null },
    'pending_values': { title: 'A Receber', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50', emptyTitle: 'Nenhum valor pendente', emptyDesc: 'Não existem contas de consignação em aberto a receber.', emptyBtn: null },
    'new_customers': { title: 'Clientes Novos', icon: Users, color: 'text-teal-500', bg: 'bg-teal-50', emptyTitle: 'Nenhum cliente', emptyDesc: 'Nenhum cadastro de cliente comercial efetuado.', emptyBtn: null },
    'roaster_hours': { title: 'Horas Trabalhadas', icon: Clock, color: 'text-pink-500', bg: 'bg-pink-50', emptyTitle: 'Nenhuma hora lançada', emptyDesc: 'Comece a apontar o trabalho do mestre de torra.', emptyBtn: 'Lançar Horas', emptyAction: 'launch_hours' },
    'movements': { title: 'Ações do Sistema', icon: History, color: 'text-gray-500', bg: 'bg-gray-100', emptyTitle: 'Sem movimentação', emptyDesc: 'Nenhum registro encontrado no período.', emptyBtn: null },
    'alerts': { title: 'Status Operação', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', emptyTitle: 'Tudo OK', emptyDesc: 'Sua operação está saudável.', emptyBtn: null }
  };

  const config = contentMap[type] || contentMap['alerts'];
  const Icon = config.icon;

  const exportCSV = () => {
    if (!data.length) return;
    
    // Obter todas as chaves únicas do primeiro nível dos objetos
    const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj)))).filter(k => typeof data[0][k] !== 'object');
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + data.map(e => headers.map(h => {
             let val = (e as any)[h as string];
             if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
             return val !== null && val !== undefined ? val : '';
        }).join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cofcof_${type}_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1C1A17]/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col relative overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
             <div className="flex items-center gap-4">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.bg} ${config.color} shadow-sm border border-white`}>
                     <Icon size={28} />
                 </div>
                 <div>
                     <h2 className="text-2xl font-black text-[#1C1A17] tracking-tight">{config.title}</h2>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                         Visualizando: {format(dates.start, 'dd/MM/yyyy')} até {format(dates.end, 'dd/MM/yyyy')}
                     </p>
                 </div>
             </div>
             
             <button
                onClick={onClose}
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1C1A17] hover:border-gray-300 transition-colors shadow-sm"
             >
                 <X size={20} />
             </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FDFCFB]">
             
             {loading ? (
                <div className="space-y-4">
                   <div className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
                   <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                </div>
             ) : (
                <div className="space-y-8">
                   
                   {/* Special Summaries based on type */}
                   {type === 'raw_stock' && (
                     <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-100">
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kg Total</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.rawKgAvailable || 0}</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantidade de Lotes</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.activeLotsCount || 0}</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custo Médio / Kg</p>
                             <p className="text-xl font-serif text-[#1C1A17]">R$ {stats?.averageRawCostPerKg?.toFixed(2) || 0}</p>
                         </div>
                     </div>
                   )}

                   {type === 'lots_launched' && (
                     <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-100">
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lotes no Período</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.rawLotsLaunchedInPeriod || 0}</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kg Comprados</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.rawKgPurchasedInPeriod || 0}kg</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest">Valor Investido</p>
                             <p className="text-xl font-serif text-[#c9a263]">R$ {stats?.rawInvestmentInPeriod?.toLocaleString('pt-BR') || 0}</p>
                         </div>
                     </div>
                   )}

                   {type === 'roasted' && (
                     <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-100">
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Torrado Total Líquido</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.roastedKgInPeriod || 0}kg</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total de Torras</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.roastsCountInPeriod || 0}</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cru Utilizado</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.rawKgUsedInPeriod || 0}kg</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Perda Média</p>
                             <p className="text-xl font-serif text-orange-600">{stats?.averageRoastLossPercent?.toFixed(1) || 0}%</p>
                         </div>
                     </div>
                   )}
                   
                   {type === 'roaster_hours' && (
                     <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-100">
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total de Horas</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.roasterHoursInPeriod || 0}h</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Horas Pendentes</p>
                             <p className="text-xl font-serif text-[#1C1A17]">{stats?.pendingRoasterHours || 0}h</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200"></div>
                         <div className="flex flex-col">
                             <p className="text-[10px] font-bold text-pink-600 uppercase tracking-widest">Estimativa Folha</p>
                             <p className="text-xl font-serif text-pink-600">R$ {stats?.estimatedPayrollValue?.toLocaleString('pt-BR') || 0}</p>
                         </div>
                     </div>
                   )}

                   {/* Specific List Layout */}
                   {data.length > 0 ? (
                       <div className="grid gap-4">
                           {data.slice(0,30).map((item, i) => (
                               <div key={item.id || i} className={`bg-white border ${type === 'alerts' && item.severity === 'critical' ? 'border-red-200 bg-red-50' : type === 'alerts' && item.severity === 'warning' ? 'border-orange-200 bg-orange-50' : 'border-gray-100'} p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col items-start gap-4`}>
                                   
                                   {type === 'alerts' ? (
                                       <div className="w-full">
                                          <div className={`flex items-center gap-2 mb-2 ${item.severity === 'critical' ? 'text-red-500' : item.severity === 'warning' ? 'text-orange-500' : 'text-blue-500'}`}>
                                              {item.severity === 'critical' ? <AlertTriangle size={16} /> : <Flame size={16} />}
                                              <span className="text-[11px] font-black uppercase tracking-widest">{item.affectedArea}</span>
                                          </div>
                                          <p className="text-lg font-black text-[#1C1A17] mb-1">{item.title}</p>
                                          <p className="text-sm font-medium text-gray-600 mb-4">{item.description}</p>
                                          {item.actionType && (
                                              <button onClick={() => { onClose(); if(onAction) onAction(item.actionType); }} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1 ${item.severity === 'critical' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
                                                  {item.recommendedAction}
                                              </button>
                                          )}
                                       </div>
                                   ) : (
                                       <div className="flex flex-col md:flex-row md:items-center justify-between w-full h-full gap-4">
                                           <div className="flex flex-col gap-1">
                                               <div className="flex items-center gap-2">
                                                   <span className="text-[10px] font-black uppercase tracking-widest text-[#B06A32] bg-[#B06A32]/10 px-2 py-0.5 rounded">
                                                       {item.date ? format(new Date(item.date), 'dd/MM/yyyy HH:mm') : item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm') : 'Hoje'}
                                                   </span>
                                                   {item.status && (
                                                       <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                           item.status === 'overdue' || item.status === 'lost' ? 'bg-red-50 text-red-600' :
                                                           item.status === 'paid' || item.status === 'closed' ? 'bg-green-50 text-green-600' :
                                                           'bg-gray-100 text-gray-500'
                                                       }`}>
                                                           {item.status}
                                                       </span>
                                                   )}
                                               </div>
                                               
                                               <div className="mt-2">
                                                   {/* Conditional rendering based on type */}
                                                   {type === 'raw_stock' && <p className="text-sm font-black text-[#1C1A17]">{item.name} <span className="text-gray-400 font-medium">({item.origin})</span></p>}
                                                   {type === 'roasted' && <p className="text-sm font-black text-[#1C1A17]">Torra de {item.rawKgUsed}kg <span className="text-gray-400 font-medium">({item.lossPercent}% de perda)</span></p>}
                                                   {type === 'packaged' && <p className="text-sm font-black text-[#1C1A17]">{item.quantityUnits} unidades de {item.packageFormat}</p>}
                                                   {type === 'roaster_hours' && <p className="text-sm font-black text-[#1C1A17]">{item.roasterName} <span className="text-gray-400 font-medium">- {item.totalHours}h</span></p>}
                                                   {type === 'lots_launched' && <p className="text-sm font-black text-[#1C1A17]">{item.name} <span className="text-gray-400 font-medium">R$ {item.purchase?.finalTotalCost || 0}</span></p>}
                                                   {type === 'movements' && <p className="text-sm font-black text-[#1C1A17]">{item.action} <span className="text-gray-400 font-medium">em {item.entity}</span></p>}
                                                   {type === 'consigned' && <p className="text-sm font-black text-[#1C1A17]">{item.recipientName}</p>}
                                                   {type === 'overdue_consignments' && <p className="text-sm font-black text-red-600">{item.recipientName} <span className="text-red-400 font-medium">- Vencido</span></p>}
                                                   {type === 'pending_values' && <p className="text-sm font-black text-[#1C1A17]">{item.recipientName} <span className="text-indigo-500 font-bold">- Pendente: R$ {item.pendingValue}</span></p>}
                                                   {type === 'new_customers' && <p className="text-sm font-black text-[#1C1A17]">{item.name} <span className="text-gray-400 font-medium">({item.type || 'B2C'})</span></p>}
                                                   {type === 'finished_stock' && <p className="text-sm font-black text-[#1C1A17]">{item.format} <span className="text-gray-400 font-medium">- {item.availableUnits} disponíveis</span></p>}
                                               </div>
                                           </div>
                                           
                                           <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-transparent border-gray-50">
                                                <div className="flex items-center gap-2 lg:mr-4">
                                                    {/* Sub-info block */}
                                                    {type === 'raw_stock' && <span className="text-lg font-black text-[#1C1A17]">{item.stock?.availableKg || 0}<span className="text-xs text-gray-500 ml-1">kg</span></span>}
                                                    {type === 'roasted' && <span className="text-lg font-black text-[#1C1A17]">{item.roastedKgOutput || 0}<span className="text-xs text-gray-500 ml-1">kg líquidos</span></span>}
                                                    {type === 'packaged' && <span className="text-lg font-black text-[#1C1A17]">{item.totalKg || 0}<span className="text-xs text-gray-500 ml-1">kg total</span></span>}
                                                    {type === 'consigned' && <span className="text-lg font-black text-[#1C1A17]">{item.totalUnitsOut || 0}<span className="text-xs text-gray-500 ml-1">unidades</span></span>}
                                                </div>
                                                
                                                <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-[#1C1A17] px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1">
                                                    Abrir Registro
                                                </button>
                                           </div>
                                       </div>
                                   )}
                               </div>
                           ))}
                           {data.length > 30 && (
                               <div className="p-4 text-center">
                                   <p className="text-xs font-medium text-gray-500">Mostrando 30 de {data.length} registros. Exporte para ver todos.</p>
                               </div>
                           )}
                       </div>
                   ) : (
                       <div className="bg-white border text-center border-gray-100 rounded-3xl p-12 shadow-sm flex flex-col items-center">
                           <Icon size={40} className="text-gray-200 mb-4" />
                           <p className="text-sm font-black text-[#1C1A17] mb-1">{config.emptyTitle || 'Nenhuma operação encontrada no período.'}</p>
                           <p className="text-xs font-medium text-gray-500 mb-6 max-w-xs">{config.emptyDesc || 'Você pode lançar um lote, registrar torra ou alterar o período.'}</p>
                           <div className="flex items-center gap-3">
                               {config.emptyBtn && config.emptyAction && onAction && (
                                   <button 
                                     onClick={() => { onClose(); onAction(config.emptyAction); }} 
                                     className="px-6 py-2.5 bg-[#B06A32] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#965A2A] transition-colors"
                                   >
                                     {config.emptyBtn}
                                   </button>
                               )}
                               <button 
                                 onClick={() => { onClose(); }} 
                                 className="px-6 py-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors"
                               >
                                 Alterar período
                               </button>
                           </div>
                       </div>
                   )}
                </div>
             )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex gap-2 w-full sm:w-auto">
                 <button
                    onClick={exportCSV}
                    disabled={data.length === 0}
                    title={data.length === 0 ? "Disponível quando houver registros" : "Exportar dados para CSV"}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 border border-gray-200"
                 >
                    <Download size={16} /> Exportar CSV
                 </button>

                 {type === 'roaster_hours' && data.length > 0 && (
                 <button
                    onClick={() => {
                        const message = `Resumo de horas CofCof:\nPeríodo: ${format(dates.start, 'dd/MM/yyyy')} até ${format(dates.end, 'dd/MM/yyyy')}\nTotal de horas: ${stats?.roasterHoursInPeriod || 0}h\nTotal previsto: R$ ${stats?.estimatedPayrollValue?.toLocaleString('pt-BR') || 0}`;
                        navigator.clipboard.writeText(message);
                        alert("Resumo copiado para o WhatsApp!");
                    }}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border border-green-200"
                 >
                    Copiar WhatsApp
                 </button>
                 )}
             </div>
             
             <div className="flex items-center w-full sm:w-auto gap-3">
                 <button
                    onClick={onClose}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#1C1A17] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all w-full sm:w-auto active:scale-95"
                 >
                    Fechar
                 </button>
                 {config.emptyBtn && config.emptyAction && onAction && data.length > 0 && (
                     <button
                        onClick={() => { onClose(); onAction(config.emptyAction); }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#2a2723] text-[#c9a263] border border-[#c9a263]/30 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg w-full sm:w-auto active:scale-95"
                     >
                        {config.emptyBtn} <ArrowRight size={16} />
                     </button>
                 )}
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
