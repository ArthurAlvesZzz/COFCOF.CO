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
         <div className="bg-[#111111] border border-[#c9a263]/20 p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(201,162,99,0.05)] text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a263]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="relative z-10">
               <Clock className="text-[#c9a263] mb-4" size={24} />
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Horas Pendentes</p>
               <p className="text-4xl font-serif mt-2 text-[#c9a263]">{pendingHours}<span className="text-xl font-sans text-white/50 ml-2">h</span></p>
            </div>
            <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest mt-8 relative z-10">
              Previsão Financeira: <span className="text-white">R$ {(pendingHours * 50).toLocaleString('pt-BR')}</span>
            </p>
         </div>

         <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#a3a3a3]/10 flex flex-col justify-between">
            <div>
                <Calendar className="text-[#a3a3a3] mb-4" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Próximo Fechamento</p>
                <p className="text-2xl font-serif text-white mt-2">Sexta-feira</p>
            </div>
            <p className="text-[9px] font-bold text-[#c9a263] bg-[#c9a263]/10 border border-[#c9a263]/20 px-3 py-1.5 rounded-lg uppercase tracking-widest mt-4 w-max">
              Conciliação Automática
            </p>
         </div>

         <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#a3a3a3]/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
               <AlertCircle className={pendingEntries.length > 0 ? "text-[#c9a263]" : "text-emerald-500"} size={24} />
               <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${pendingEntries.length > 0 ? 'bg-[#c9a263]/10 text-[#c9a263] border-[#c9a263]/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                 {pendingEntries.length > 0 ? 'Ação Necessária' : 'Fechado'}
               </div>
            </div>
            <div>
               <p className="text-xl font-serif text-white mb-4">{pendingEntries.length} registros à revisar</p>
               <button 
                 disabled={pendingEntries.length === 0}
                 onClick={() => setIsConfirmOpen(true)} 
                 className={`w-full py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${pendingEntries.length === 0 ? 'bg-[#1a1a1a] text-[#a3a3a3] cursor-not-allowed border border-[#a3a3a3]/10' : 'bg-[#c9a263] text-black hover:bg-white border border-[#c9a263] shadow-[0_0_15px_rgba(201,162,99,0.2)]'}`}
               >
                 {pendingEntries.length > 0 ? 'Aprovar todos agora' : 'Tudo em dia'}
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-6">
         {/* Table of Entries */}
         <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
               <h3 className="text-sm font-serif text-white">Registros de Atividade</h3>
               <div className="flex items-center gap-1 p-1 bg-[#111111] rounded-xl border border-[#a3a3a3]/10">
                  {['pending', 'approved', 'paid', 'all'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFilter(s as any)}
                      className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-[#1a1a1a] text-[#c9a263] border border-[#c9a263]/30 shadow-sm' : 'text-[#a3a3a3] hover:text-white'}`}
                    >
                      {s === 'pending' ? 'Pendente' : s === 'approved' ? 'Aprovado' : s === 'paid' ? 'Pago' : 'Todos'}
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-[#111111] rounded-[24px] border border-[#a3a3a3]/10 overflow-x-auto hide-scrollbar">
               <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#1a1a1a]/50 border-b border-[#a3a3a3]/10">
                      <th className="px-6 py-5 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest whitespace-nowrap">Data e Hora</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest">Colaborador</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest">Atividade</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest text-center">Horas</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#a3a3a3]/5">
                    {filteredEntries.map(entry => (
                      <tr key={entry.id} className="group hover:bg-[#1a1a1a]/50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                           <p className="text-sm font-medium text-white">{format(new Date(entry.date), 'dd/MM/yyyy')}</p>
                           <p className="text-[10px] font-bold text-[#a3a3a3] uppercase">{entry.startTime} - {entry.endTime}</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-white">{entry.roasterName}</td>
                        <td className="px-6 py-5">
                           <span className="px-3 py-1 bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-lg text-[9px] font-bold text-[#c9a263] uppercase tracking-widest">
                             {entry.activity}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <p className="text-base font-serif text-white">{entry.totalHours} <span className="text-[#a3a3a3] text-sm font-sans">h</span></p>
                        </td>
                        <td className="px-6 py-5 text-right w-32">
                           {entry.status === 'pending' && (
                             <div className="flex justify-end gap-2">
                                <button onClick={() => approveEntry(entry.id)} className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                   <Check size={16} />
                                </button>
                                <button className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                   <X size={16} />
                                </button>
                             </div>
                           )}
                           {entry.status === 'approved' && <CheckCircle2 size={18} className="text-[#c9a263] ml-auto" title="Aprovado" />}
                           {entry.status === 'paid' && <CheckCircle2 size={18} className="text-emerald-500 ml-auto" title="Pago" />}
                        </td>
                      </tr>
                    ))}
                    {filteredEntries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-0">
                           <div className="py-16 flex justify-center">
                              <OperationEmptyState
                                icon={Clock}
                                title="Nenhum Registro"
                                description="Não há registros de atividade para este filtro."
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
            <h3 className="text-sm font-serif text-white">Fechamentos Concluídos</h3>
            <div className="space-y-4">
               {payrolls.map(pay => (
                 <div key={pay.id} className="bg-[#111111] p-6 rounded-[24px] border border-[#a3a3a3]/10 cursor-pointer hover:border-[#c9a263]/30 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                       <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${pay.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : pay.status === 'approved' ? 'bg-[#c9a263]/10 text-[#c9a263] border-[#c9a263]/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                         {pay.status === 'paid' ? 'PAGO' : pay.status === 'approved' ? 'APROVADO' : 'PENDENTE'}
                       </span>
                    </div>
                    
                    <div className="mb-6 mt-1">
                       <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-1">Período de Apuração</p>
                       <p className="text-sm font-medium text-white">{format(new Date(pay.startDate), 'dd/MM/yyyy')} — {format(new Date(pay.endDate), 'dd/MM/yyyy')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 bg-[#1a1a1a] p-4 rounded-xl border border-[#a3a3a3]/5">
                       <div>
                          <p className="text-[9px] font-bold text-[#a3a3a3] uppercase mb-1">Total</p>
                          <p className="text-base font-serif text-white">{pay.totalHours} <span className="text-xs font-sans text-[#a3a3a3]">h</span></p>
                       </div>
                       <div>
                          <p className="text-[9px] font-bold text-[#a3a3a3] uppercase mb-1">Repasse Base</p>
                          <p className="text-base font-serif text-[#c9a263]">R$ {pay.totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                       </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2">
                       <button onClick={() => copySummaryWhatsApp(pay)} className="flex-1 px-4 py-3 bg-[#1a1a1a] hover:bg-[#c9a263] hover:text-black border border-[#a3a3a3]/10 hover:border-[#c9a263] rounded-xl text-[9px] font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2">
                          <MessageCircle size={14} /> WhatsApp
                       </button>
                       <button className="px-4 py-3 bg-[#1a1a1a] hover:bg-white hover:text-black border border-[#a3a3a3]/10 rounded-xl text-[#a3a3a3] transition-all">
                          <Printer size={14} />
                       </button>
                    </div>
                 </div>
               ))}
               {payrolls.length === 0 && (
                 <div className="p-10 text-center bg-[#111111] rounded-[24px] border border-dashed border-[#a3a3a3]/20">
                    <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest">Nenhum fechamento gerado</p>
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
