import React, { useState } from 'react';
import { useCommissions } from '../../hooks/useCommissions';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { AdminEmptyState } from './AdminEmptyState';
import { DollarSign, Search, CheckCircle, XCircle, Download } from 'lucide-react';
import { exportToCSV } from '../../lib/export';
import toast from 'react-hot-toast';
import { Commission } from '../../types/admin';

export function CommissionsTab() {
  const { commissions, stats, loading, approveCommission, markAsPaid, cancelCommission, createManualCommission } = useCommissions();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando comissões...</div>;

  const filteredCommissions = commissions.filter(c => 
    (c.sellerName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    (c.customerName && c.customerName.toLowerCase().includes((searchTerm || '').toLowerCase()))
  ).sort((a,b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

  const handleExportCSV = () => {
    const headers = ['Vendedor', 'Origem', 'Cliente/Parceiro', 'Valor Base', 'Comissão', 'Status', 'Criado em', 'Pago em'];
    const rows = filteredCommissions.map(c => [
       c.sellerName, c.sourceType, c.customerName || c.partnerName || '-',
       c.baseValue?.toFixed(2) || '0', c.finalValue?.toFixed(2) || '0',
       c.status, new Date(c.createdAt!).toLocaleDateString('pt-BR'), c.paidAt ? new Date(c.paidAt).toLocaleDateString('pt-BR') : '-'
    ]);
    exportToCSV('comissoes_cofcof.csv', headers, rows);
    toast.success('Comissões exportadas!');
  };

  return (
    <div className="pb-24">
       <AdminPageHeader
          title="Comissões"
          subtitle="Controle comissões geradas, pendentes, aprovadas, pagas e canceladas por vendedor."
          action={{
             label: "Nova Comissão Manual",
             onClick: () => {
                createManualCommission({
                   sellerId: 'seller_1',
                   sellerName: 'João Silva',
                   sourceType: 'manualAdjustment',
                   sourceId: 'manual_1',
                   baseValue: 1000,
                   calculationBase: 'fixed',
                   ruleSnapshot: { type: 'fixed', fixedValue: 50 },
                   commissionValue: 50,
                   finalValue: 50,
                   status: 'pending'
                });
                toast.success('Comissão manual adicionada para João Silva!');
             }
          }}
       >
         <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-[#1C1A17] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Download size={16} /> Exportar CSV
         </button>
       </AdminPageHeader>

       {commissions.length === 0 ? (
          <AdminEmptyState 
            title="Nenhuma comissão gerada ainda"
            description="As comissões aparecerão aqui quando pedidos, vendas ou consignações forem vinculados a vendedores."
            icon={<DollarSign size={32} />}
          />
       ) : (
         <>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <AdminStatCard title="Pendentes" value={`R$ ${stats?.pendingValue?.toFixed(2) || '0.00'}`} alert={stats?.pending > 0} />
             <AdminStatCard title="Aprovadas" value={`R$ ${stats?.approvedValue?.toFixed(2) || '0.00'}`} />
             <AdminStatCard title="Pagas" value={`R$ ${stats?.paidValue?.toFixed(2) || '0.00'}`} />
             <AdminStatCard title="Qtd Pendentes" value={stats?.pending} />
           </div>

           <div className="bg-white border text-sm max-w-full overflow-x-auto border-gray-100 rounded-2xl shadow-sm mb-6">
              <table className="w-full text-left whitespace-nowrap min-w-[900px]">
                 <thead className="bg-[#F6F1EB] border-b border-gray-200">
                    <tr>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Vendedor</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Origem</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Base Calc.</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Comissão</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Status</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {filteredCommissions.map(c => (
                       <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-[#1C1A17]">{c.sellerName}</td>
                          <td className="px-6 py-4">
                             <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase text-gray-600 font-bold mr-2">{c.sourceType}</span>
                             <span className="text-gray-500">{c.sourceId}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">R$ {c.baseValue?.toFixed(2)}</td>
                          <td className="px-6 py-4 font-bold text-[#B06A32]">R$ {c.finalValue?.toFixed(2)}</td>
                          <td className="px-6 py-4 uppercase text-xs font-bold">
                             <span className={`px-2 py-1 rounded-full ${c.status === 'pending' ? 'bg-amber-50 text-amber-800' : c.status === 'approved' ? 'bg-blue-50 text-blue-800' : c.status === 'paid' ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                               {c.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 flex gap-3">
                             {c.status === 'pending' && <button onClick={() => approveCommission(c.id)} className="text-blue-600 font-bold text-xs hover:underline uppercase flex items-center gap-1"><CheckCircle size={14}/> Aprovar</button>}
                             {c.status === 'approved' && <button onClick={() => markAsPaid(c.id, { method: 'pix' })} className="text-green-600 font-bold text-xs hover:underline uppercase flex items-center gap-1"><CheckCircle size={14}/> Pagar</button>}
                             {(c.status === 'pending' || c.status === 'approved') && <button onClick={() => cancelCommission(c.id, 'Cancelado manualmente')} className="text-red-500 font-bold text-xs hover:underline uppercase flex items-center gap-1"><XCircle size={14}/> Cancelar</button>}
                             <button className="text-[#1C1A17] font-bold text-xs hover:underline uppercase ml-2">Ver</button>
                          </td>
                       </tr>
                    ))}
                    {filteredCommissions.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhuma comissão encontrada para esta busca.</td></tr>}
                 </tbody>
              </table>
           </div>
         </>
       )}
    </div>
  );
}
