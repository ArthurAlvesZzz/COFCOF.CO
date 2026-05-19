import React, { useState, useEffect } from 'react';
import { operationService } from '../../../services/operationService';
import { RoasterTimeEntry, WeeklyPayroll } from '../../../types/admin';
import { Clock, Calendar, DollarSign, CheckCircle2, AlertCircle, Copy, Printer, Check, X, RefreshCcw, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OperationEmptyState } from './OperationEmptyState';
import { OperationConfirmModal } from './modals/OperationFeedbackModals';

interface RoasterHoursControlProps {
  onAction?: (action: string) => void;
}

export function RoasterHoursControl({ onAction }: RoasterHoursControlProps) {
  const [entries, setEntries] = useState<RoasterTimeEntry[]>([]);
  const [payrolls, setPayrolls] = useState<WeeklyPayroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'paid' | 'all'>('pending');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [e, p] = await Promise.all([
        operationService.getTimeEntries(),
        operationService.listPayrolls()
      ]);
      setEntries(e);
      setPayrolls(p);
    } catch (error) {
      toast.error("Erro ao carregar registros");
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(e => filter === 'all' ? true : e.status === filter);
  const pendingEntries = entries.filter(e => e.status === 'pending');
  const pendingHours = pendingEntries.reduce((acc, e) => acc + e.totalHours, 0);

  const approveEntry = async (id: string) => {
    try {
      await operationService.approveTimeEntry(id, 'admin_user'); // simplified sub
      toast.success("Registro aprovado");
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const approveAllPending = async () => {
    try {
      for (const entry of pendingEntries) {
         await operationService.approveTimeEntry(entry.id, 'admin_user');
      }
      toast.success(`${pendingEntries.length} registros aprovados com sucesso.`);
      loadData();
      if(onAction) onAction('reload_stats');
    } catch (error: any) {
      toast.error("Erro ao aprovar em lote: " + error.message);
    }
  };

  const copySummaryWhatsApp = (payroll: WeeklyPayroll) => {
     const text = `*Resumo da semana CofCof* ☕\n\nMestre: ${payroll.roasterName}\nPeríodo: ${format(new Date(payroll.startDate), 'dd/MM')} a ${format(new Date(payroll.endDate), 'dd/MM')}\nTotal de horas: ${payroll.totalHours}h\nValor/hora: R$ ${payroll.hourlyRate}\n\n*Total a pagar: R$ ${payroll.totalValue.toLocaleString()}*\n\nStatus: ${payroll.status.toUpperCase()}`;
     navigator.clipboard.writeText(text);
     toast.success("Resumo copiado para WhatsApp");
  };

  return (
    <div className="space-y-10">
      {/* 1. Statistics & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#1C1A17] p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
            <div>
               <Clock className="text-[#B06A32] mb-4" size={24} />
               <p className="text-[10px] font-black uppercase tracking-widest text-white/40">HorasPendentes</p>
               <p className="text-4xl font-black mt-2">{pendingHours}<span className="text-xl font-medium text-white/40 ml-2">h</span></p>
            </div>
            <p className="text-[9px] font-bold text-[#B06A32] uppercase tracking-widest mt-8">Previsão: R$ {(pendingHours * 50).toLocaleString('pt-BR')}</p>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <Calendar className="text-indigo-600 mb-4" size={24} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Próximo Pagamento</p>
            <p className="text-2xl font-black text-[#1C1A17] mt-2">Sexta-feira</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-4">Automático</p>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
               <AlertCircle className="text-amber-500" size={24} />
               <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest">{pendingEntries.length > 0 ? 'Pendente' : 'Fechado'}</div>
            </div>
            <p className="text-xl font-black text-[#1C1A17]">{pendingEntries.length} registros</p>
            <button 
              disabled={pendingEntries.length === 0}
              onClick={() => setIsConfirmOpen(true)} 
              className={`text-[9px] text-left font-bold underline uppercase tracking-widest mt-4 transition-colors ${pendingEntries.length === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer hover:text-[#1C1A17]'}`}
            >
              {pendingEntries.length > 0 ? 'Aprovar todos agora' : 'Nenhuma hora pendente'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-6">
         {/* Table of Entries */}
         <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1A17]">Registros de Atividade</h3>
               <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                  {['pending', 'approved', 'paid', 'all'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFilter(s as any)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-white text-[#1C1A17] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {s === 'pending' ? 'Pendente' : s === 'approved' ? 'Aprovado' : s === 'paid' ? 'Pago' : 'Todos'}
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mestre</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Atividade</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Horas</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredEntries.map(entry => (
                      <tr key={entry.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="text-xs font-black text-[#1C1A17]">{format(new Date(entry.date), 'dd/MM/yyyy')}</p>
                           <p className="text-[9px] font-bold text-gray-400 uppercase">{entry.startTime} - {entry.endTime}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">{entry.roasterName}</td>
                        <td className="px-6 py-4">
                           <span className="px-2.5 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-[#B06A32] uppercase tracking-widest">
                             {entry.activity}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <p className="text-sm font-black text-[#1C1A17]">{entry.totalHours}h</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                           {entry.status === 'pending' && (
                             <div className="flex justify-end gap-2">
                                <button onClick={() => approveEntry(entry.id)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                   <Check size={16} />
                                </button>
                                <button className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                   <X size={16} />
                                </button>
                             </div>
                           )}
                           {entry.status === 'approved' && <CheckCircle2 size={18} className="text-indigo-500 ml-auto" />}
                           {entry.status === 'paid' && <CheckCircle2 size={18} className="text-emerald-500 ml-auto" />}
                        </td>
                      </tr>
                    ))}
                    {filteredEntries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-0">
                           <div className="py-12 flex justify-center">
                              <OperationEmptyState
                                icon={Clock}
                                title="Nenhuma hora lançada"
                                description="Você ainda não lançou trabalho do mestre de torra."
                                actionLabel="Registrar Horas"
                                onAction={() => onAction?.('log_hours')}
                              />
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Weekly Payrolls Section */}
         <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1A17]">Fechamentos Semanais</h3>
            <div className="space-y-4">
               {payrolls.map(pay => (
                 <div key={pay.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3">
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${pay.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : pay.status === 'approved' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                         {pay.status === 'paid' ? 'PAGO' : pay.status === 'approved' ? 'APROVADO' : 'PENDENTE'}
                       </span>
                    </div>
                    
                    <div className="mb-6">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Período</p>
                       <p className="text-xs font-black text-[#1C1A17] uppercase tracking-wider">{format(new Date(pay.startDate), 'dd/MM')} — {format(new Date(pay.endDate), 'dd/MM')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Total Horas</p>
                          <p className="text-sm font-black text-[#1C1A17]">{pay.totalHours}h</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Valor Final</p>
                          <p className="text-sm font-black text-[#B06A32]">R$ {pay.totalValue.toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center gap-2">
                       <button onClick={() => copySummaryWhatsApp(pay)} className="flex-1 px-4 py-2 bg-gray-50 hover:bg-[#1C1A17] hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-600 transition-all flex items-center justify-center gap-2">
                          <MessageCircle size={14} /> WhatsApp
                       </button>
                       <button className="px-4 py-2 bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-xl text-gray-600 transition-all">
                          <Printer size={14} />
                       </button>
                    </div>
                 </div>
               ))}
               {payrolls.length === 0 && (
                 <div className="p-8 text-center bg-[#FDFCFB] rounded-[2.5rem] border border-dashed border-gray-200">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Nenhum fechamento gerado</p>
                 </div>
               )}
            </div>
         </div>
      </div>
      
      <OperationConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Aprovar Registros"
        description="Você está prestes a aprovar todas as horas pendentes deste período."
        primaryActionLabel="Confirmar Aprovação"
        onConfirm={approveAllPending}
        summary={
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Registros:</span>
              <span className="font-black text-[#1C1A17]">{pendingEntries.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Total de Horas:</span>
              <span className="font-black text-[#1C1A17]">{pendingHours}h</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Valor Estimado:</span>
              <span className="font-black text-[#1C1A17]">R$ {(pendingHours * 50).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        }
      />
    </div>
  );
}
