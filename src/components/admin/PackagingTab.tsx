import React from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';

export function PackagingTab() {
  return (
    <div className="pb-24">
      <AdminPageHeader
        title="Empacotamento"
        subtitle="Registro de pacotes de 250g listos para o estoque final."
        action={{
          label: "Registrar Empacotamento",
          onClick: () => toast.loading('Carregando formulário...', { duration: 1000 })
        }}
      />
      <div className="bg-white border text-sm max-w-full overflow-x-auto border-gray-100 rounded-2xl shadow-sm">
        <table className="w-full text-left whitespace-nowrap min-w-[800px]">
           <thead className="bg-[#F6F1EB] border-b border-gray-200">
              <tr>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Data</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Lote Torrado (Origem)</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Qtd (Pacotes 250g)</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Destino</th>
                 <th className="px-6 py-4 font-medium text-[#2A160E]">Lote Impresso (Validade)</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 font-medium">17/05/2026</td>
                 <td className="px-6 py-4 font-medium text-[#1C1A17]">Torra 17/05 - CR-01</td>
                 <td className="px-6 py-4 font-bold text-[#B06A32]">100 un.</td>
                 <td className="px-6 py-4">Estoque Central (E-commerce)</td>
                 <td className="px-6 py-4 font-mono text-xs">V:17/08/26 L:T01CR01</td>
              </tr>
           </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-4 font-medium flex items-center gap-2"><Package size={14} className="text-[#B06A32]"/> * O sistema gera automaticamente os rótulos de Lote/Validade para exportação ou impressão PDF.</p>
    </div>
  );
}
