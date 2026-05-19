import React, { useState, useEffect } from 'react';
import { consignmentService } from '../../../services/consignmentService';
import { Consignment } from '../../../types/admin';
import { Handshake, AlertCircle, TrendingUp, DollarSign, Clock, ArrowRight, User, MoreVertical, MessageCircle, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { OperationEmptyState } from './OperationEmptyState';

interface ConsignmentsOverviewProps {
  onAction?: (action: string) => void;
}

export function ConsignmentsOverview({ onAction }: ConsignmentsOverviewProps) {
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const c = await consignmentService.listConsignments();
      setConsignments(c);
    } catch (error) {
      toast.error("Erro ao carregar consignações");
    } finally {
      setLoading(false);
    }
  };

  const activeConsignments = consignments.filter(c => c.status === 'aberta' || c.status === 'vencida');
  const overdueCount = consignments.filter(c => c.status === 'vencida').length;
  const totalPendingValue = activeConsignments.reduce((acc, c) => acc + (c.pendingValue || 0), 0);

  return (
    <div className="space-y-10">
      {/* 1. Dashboard de Consignação */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
               <DollarSign size={20} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Pendente</p>
            <p className="text-2xl font-black text-[#1C1A17]">R$ {totalPendingValue.toLocaleString()}</p>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
               <Handshake size={20} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Guias Ativas</p>
            <p className="text-2xl font-black text-[#1C1A17]">{activeConsignments.length}</p>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm border-l-4 border-l-amber-500">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4">
               <AlertCircle size={20} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vencidas</p>
            <p className="text-2xl font-black text-[#1C1A17]">{overdueCount}</p>
         </div>
         <div className="bg-[#1C1A17] p-6 rounded-[2rem] text-white">
            <div className="w-10 h-10 bg-[#B06A32]/20 text-[#B06A32] rounded-xl flex items-center justify-center mb-4">
               <TrendingUp size={20} />
            </div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Ticket Médio</p>
            <p className="text-2xl font-black text-white">R$ 450</p>
         </div>
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1A17]">Consignações em Aberto</h3>
            <button className="text-[10px] font-black text-[#B06A32] uppercase tracking-widest flex items-center gap-2 hover:underline">
               Ver todas finalizadas <ArrowRight size={14} />
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeConsignments.map(cons => (
              <div key={cons.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-1.5 h-full ${cons.status === 'vencida' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                 
                 <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#1C1A17] group-hover:text-[#B06A32] transition-all">
                          <User size={20} />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-[#1C1A17] uppercase tracking-wider">{cons.recipientName}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Guia #{cons.code}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${cons.status === 'vencida' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                         {cons.status.toUpperCase()}
                       </span>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center justify-end gap-1">
                          <Clock size={10} /> Expira em: {cons.dueDate ? new Date(cons.dueDate).toLocaleDateString() : 'A definir'}
                       </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-50">
                    <div>
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Valor Total</p>
                       <p className="text-lg font-black text-gray-400">R$ {cons.totalValue?.toLocaleString()}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-[#B06A32] uppercase tracking-widest mb-1">Saldo a Receber</p>
                       <p className="text-xl font-black text-[#1C1A17]">R$ {cons.pendingValue?.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <button className="flex-[2] bg-[#1C1A17] text-[#B06A32] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all">
                       Registrar Acerto
                    </button>
                    <button className="flex-1 bg-white border border-gray-100 text-gray-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-[#1C1A17] hover:border-[#1C1A17] transition-all flex items-center justify-center gap-2">
                       <MessageCircle size={14} /> Cobrar
                    </button>
                    <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
                       <MoreVertical size={16} />
                    </button>
                 </div>
              </div>
            ))}

            {activeConsignments.length === 0 && (
              <div className="col-span-1 md:col-span-2">
                 <OperationEmptyState 
                    icon={Handshake}
                    title="Nenhuma consignação ativa"
                    description="Não existem guias de consignação em aberto ou vencidas neste momento."
                    actionLabel="Nova Consignação"
                    onAction={() => onAction?.('consignment')}
                 />
              </div>
            )}
         </div>
      </div>

      {/* BLOCO OBRIGATÓRIO: Consignações Atrasadas */}
      {overdueCount > 0 && (
          <div className="mt-12 space-y-6">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                          <AlertCircle size={20} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1A17]">Consignações Atrasadas ({overdueCount})</h3>
                  </div>
              </div>

              <div className="bg-white border border-red-100 rounded-[2rem] shadow-sm overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                          <tr className="border-b border-gray-50 bg-gray-50">
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Parceiro</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Código</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Data Saída</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Prazo</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Atraso</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Valor Pendente</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Ação</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {consignments.filter(c => c.status === 'vencida').map(cons => {
                              const delayDays = cons.dueDate ? Math.floor((new Date().getTime() - new Date(cons.dueDate).getTime()) / (1000 * 3600 * 24)) : 0;
                              return (
                                  <tr key={cons.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="p-4">
                                          <p className="text-xs font-black text-[#1C1A17]">{cons.recipientName}</p>
                                      </td>
                                      <td className="p-4">
                                          <p className="text-[10px] font-bold text-gray-400">{cons.code}</p>
                                      </td>
                                      <td className="p-4">
                                          <p className="text-xs font-medium text-gray-600">{cons.createdAt ? new Date(cons.createdAt).toLocaleDateString() : '-'}</p>
                                      </td>
                                      <td className="p-4">
                                          <p className="text-xs font-medium text-gray-600">{cons.dueDate ? new Date(cons.dueDate).toLocaleDateString() : '-'}</p>
                                      </td>
                                      <td className="p-4">
                                          <span className="text-[10px] font-black bg-red-50 text-red-600 px-2 py-1 rounded">
                                              {delayDays > 0 ? `${delayDays} dias` : 'Hoje'}
                                          </span>
                                      </td>
                                      <td className="p-4">
                                          <p className="text-sm font-black text-red-600">R$ {cons.pendingValue?.toLocaleString('pt-BR') || '0,00'}</p>
                                      </td>
                                      <td className="p-4 flex gap-2 justify-end">
                                          <button className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1">
                                              Acerto
                                          </button>
                                          <button className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1">
                                              WhastApp
                                          </button>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
}
