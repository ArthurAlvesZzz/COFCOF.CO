import React from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { Flame } from 'lucide-react';
import { AdminEmptyState } from './AdminEmptyState';
import toast from 'react-hot-toast';

export function RoastsTab() {
  return (
    <div className="pb-24">
      <AdminPageHeader
        title="Torras"
        subtitle="Controle do lote torrado e rendimento."
        action={{
          label: "Registrar Torra",
          onClick: () => toast.error('Integração com torrador pendente.')
        }}
      />
      <div className="bg-white border text-sm max-w-full overflow-x-auto border-gray-100 rounded-2xl shadow-sm">
        <table className="w-full text-left whitespace-nowrap min-w-[800px]">
           <thead className="bg-[#F6F1EB] border-b border-gray-200">
              <tr>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Data</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Lote Usado</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Cru (kg)</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Torrado (kg)</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Perda</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Perfil</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 font-medium">17/05/2026</td>
                 <td className="px-6 py-4 font-medium text-[#1C1A17]">CR-01: Cerrado Doce</td>
                 <td className="px-6 py-4">30</td>
                 <td className="px-6 py-4">25.5</td>
                 <td className="px-6 py-4 text-red-500 font-medium tracking-tight">15%</td>
                 <td className="px-6 py-4"><span className="px-3 py-1 bg-[#F6F1EB] border border-[#2A160E]/20 text-[#2A160E] rounded-full text-xs font-bold uppercase">Média</span></td>
              </tr>
           </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-4 font-medium flex items-center gap-2"><Flame size={14} className="text-[#B06A32]" /> * Perda calculada automaticamente (Cru - Torrado)</p>
    </div>
  );
}
