import React from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export function HoursTab() {
  return (
    <div className="pb-24">
      <AdminPageHeader
        title="Horas e Pagamentos"
        subtitle="Registro de horas trabalhadas por prestadores e fechamento semanal."
        action={{
          label: "Registrar Horas",
          onClick: () => toast.success('Módulo de banco de horas abrindo...')
        }}
      >
         <button onClick={() => toast.success('Semana fechada! Relatório enviado ao financeiro.')} className="bg-white border border-gray-200 text-[#1C1A17] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
            Fechar Semana
         </button>
      </AdminPageHeader>
             
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h3 className="font-bold text-[#1C1A17]">Mestre de Torra (Semana Atual)</h3>
            <p className="text-sm text-gray-500">14 a 18 de Maio</p>
         </div>
         <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Horas</p>
              <p className="text-xl font-bold">14h</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Valor (R$/h)</p>
              <p className="text-xl font-bold">R$ 55</p>
            </div>
            <div className="text-center bg-[#F6F1EB] rounded-lg px-4 py-1 border border-[#C89B5A]/20">
              <p className="text-xs text-[#B06A32] uppercase tracking-wider font-bold">Total Parcial</p>
              <p className="text-xl font-bold text-[#B06A32]">R$ 770,00</p>
            </div>
         </div>
      </div>
             
      <div className="bg-white border text-sm max-w-full overflow-x-auto border-gray-100 rounded-2xl shadow-sm">
         <table className="w-full text-left whitespace-nowrap min-w-[800px]">
            <thead className="bg-[#F6F1EB] border-b border-gray-200">
               <tr>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Data</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Prestador / Função</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Entrada</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Saída</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Total</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Aprovação</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1C1A17]">16/05/2026</td>
                  <td className="px-6 py-4">Carlos (Torra)</td>
                  <td className="px-6 py-4 text-gray-500">08:00</td>
                  <td className="px-6 py-4 text-gray-500">15:00</td>
                  <td className="px-6 py-4 font-bold">7h</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">Pendente</span></td>
               </tr>
               <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1C1A17]">17/05/2026</td>
                  <td className="px-6 py-4">Carlos (Torra)</td>
                  <td className="px-6 py-4 text-gray-500">08:00</td>
                  <td className="px-6 py-4 text-gray-500">15:00</td>
                  <td className="px-6 py-4 font-bold">7h</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">Pendente</span></td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  );
}
