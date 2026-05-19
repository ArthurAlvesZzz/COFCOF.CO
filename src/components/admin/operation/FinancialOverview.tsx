import React from 'react';
import { DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

interface FinancialOverviewProps {
  stats: any;
  onAction?: (action: string) => void;
}

export function FinancialOverview({ stats, onAction }: FinancialOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
         <h2 className="text-xl font-black tracking-tight text-[#1C1A17]">Financeiro e Pendências</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Pending Receivables */}
         <div className="col-span-1 md:col-span-2 bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-indigo-600 flex items-center justify-center">
                     <DollarSign size={24} />
                 </div>
                 <div>
                     <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Total a Receber</p>
                     <p className="text-3xl font-black text-indigo-900">R$ {stats?.totalPendingValue?.toLocaleString('pt-BR') || '0,00'}</p>
                 </div>
             </div>

             <div className="space-y-3">
                 <div className="flex items-center justify-between bg-white/50 px-4 py-3 rounded-2xl">
                     <span className="text-xs font-bold text-indigo-800">Pedidos B2B Pendentes</span>
                     <span className="text-sm font-black text-indigo-900">R$ {stats?.pendingOrdersValue || '0,00'}</span>
                 </div>
                 <div className="flex items-center justify-between bg-white/50 px-4 py-3 rounded-2xl">
                     <span className="text-xs font-bold text-indigo-800">Consignações em Aberto</span>
                     <span className="text-sm font-black text-indigo-900">R$ {stats?.pendingConsignmentValue || '0,00'}</span>
                 </div>
                 <div className="flex items-center justify-between bg-white/50 px-4 py-3 rounded-2xl">
                     <span className="text-xs font-bold text-red-600 flex items-center gap-2"><AlertCircle size={14}/> Atrasadas</span>
                     <span className="text-sm font-black text-red-600">R$ {stats?.overdueConsignmentsValue || '0,00'}</span>
                 </div>
             </div>
         </div>

         {/* Payables */}
         <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
             <div>
                 <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm text-red-500 flex items-center justify-center">
                         <Briefcase size={20} />
                     </div>
                     <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">A Pagar (Mestre)</p>
                 </div>
                 <p className="text-3xl font-black text-red-900 mb-2">R$ {stats?.estimatedPayrollValue?.toLocaleString('pt-BR') || '0,00'}</p>
                 <p className="text-xs font-medium text-red-600">Estimativa baseada nas {stats?.pendingRoasterHours || 0} horas não pagas do período.</p>
             </div>
             <button onClick={() => onAction?.('log_hours')} className="w-full bg-red-600 text-white font-black text-xs uppercase tracking-widest py-3/5 rounded-xl shadow-sm hover:bg-red-700 transition-colors mt-6 h-12">
                 Fechar Semana
             </button>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
             <h3 className="text-sm font-black text-[#1C1A17] mb-4">Investido em Lotes no Período</h3>
             <div className="text-3xl font-black text-[#B06A32]">R$ {stats?.rawInvestmentInPeriod?.toLocaleString('pt-BR') || '0,00'}</div>
             <p className="text-xs font-medium text-gray-500 mt-2">Custo médio: R$ {(stats?.averageRawCostPerKg || 0).toFixed(2)}/kg</p>
          </div>
          <div className="p-6 bg-[#1C1A17] border border-gray-800 rounded-[2rem] shadow-sm">
             <h3 className="text-sm font-black text-white mb-4">Valor Estimado em Estoque Final</h3>
             <div className="text-3xl font-black text-[#B06A32]">R$ {((stats?.finishedStockUnits || 0) * 45).toLocaleString('pt-BR')}</div>
             <p className="text-xs font-medium text-gray-400 mt-2">Baseado em preço sugerido B2B</p>
          </div>
      </div>
    </div>
  );
}
