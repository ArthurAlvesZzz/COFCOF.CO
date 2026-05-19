import React, { useState } from 'react';
import { useSellers } from '../../hooks/useSellers';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { AdminEmptyState } from './AdminEmptyState';
import { Users, Search, Download, MessageCircle } from 'lucide-react';
import { exportToCSV } from '../../lib/export';
import toast from 'react-hot-toast';
import { Seller } from '../../types/admin';

export function SellersTab() {
  const { sellers, loading, createSeller } = useSellers();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando vendedores...</div>;

  const filteredSellers = sellers.filter(s => 
    (s.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    (s.contact?.whatsapp && s.contact.whatsapp.includes(searchTerm))
  ).sort((a,b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

  const activeSellers = sellers.filter(s => s.status === 'active').length;
  const totalRevenue = sellers.reduce((acc, s) => acc + ((s.stats?.totalRevenue) || 0), 0);
  const pendingCommissions = sellers.reduce((acc, s) => acc + ((s.stats?.pendingCommissions) || 0), 0);

  const handleExportCSV = () => {
    const headers = ['Nome', 'Status', 'Tipo', 'WhatsApp', 'Email', 'Receita', 'Comissões Pendentes', 'Comissões Pagas'];
    const rows = filteredSellers.map(s => [
       s.name, s.status, s.type, s.contact?.whatsapp || '', s.contact?.email || '',
       (s.stats?.totalRevenue || 0).toFixed(2), (s.stats?.pendingCommissions || 0).toFixed(2), (s.stats?.paidCommissions || 0).toFixed(2)
    ]);
    exportToCSV('vendedores_cofcof.csv', headers, rows);
    toast.success('Lista de vendedores exportada!');
  };

  return (
    <div className="pb-24">
       <AdminPageHeader
          title="Vendedores"
          subtitle="Gerencie vendedores, metas, clientes, leads, vendas e desempenho comercial."
          action={{
            label: "Novo Vendedor",
            onClick: () => {
              createSeller({
                name: "Novo Vendedor Teste",
                status: "active",
                type: "internal",
                commissionRule: {
                    type: "percentage",
                    percentage: 10,
                    base: "paid_order",
                    releaseOnlyAfterPayment: true
                }
              });
              toast.success('Vendedor criado!');
            }
          }}
       >
         <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-[#1C1A17] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Download size={16} /> Exportar CSV
         </button>
       </AdminPageHeader>

       {sellers.length === 0 ? (
          <AdminEmptyState 
            title="Nenhum vendedor cadastrado"
            description="Cadastre vendedores para atribuir leads, pedidos, consignações e calcular comissões automaticamente."
            icon={<Users size={32} />}
          />
       ) : (
         <>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <AdminStatCard title="Vendedores Ativos" value={activeSellers} />
             <AdminStatCard title="Receita (Total)" value={`R$ ${totalRevenue.toFixed(2)}`} />
             <AdminStatCard title="Comissões Pendentes" value={`R$ ${pendingCommissions.toFixed(2)}`} alert={pendingCommissions > 0} />
           </div>

           <div className="bg-white border text-sm max-w-full overflow-x-auto border-gray-100 rounded-2xl shadow-sm mb-6">
              <table className="w-full text-left whitespace-nowrap min-w-[900px]">
                 <thead className="bg-[#F6F1EB] border-b border-gray-200">
                    <tr>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Nome</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Status</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Regra Comissão</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Receita Gerada</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Comissão Pendente</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {filteredSellers.map(s => (
                       <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                             <p className="font-bold text-[#1C1A17]">{s.name}</p>
                             <p className="text-xs text-gray-500">{s.contact?.whatsapp || 'Sem número'}</p>
                          </td>
                          <td className="px-6 py-4 uppercase text-xs font-bold">
                             <span className={`px-2 py-1 rounded-full ${s.status === 'active' ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                               {s.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                             {s.commissionRule?.type === 'percentage' ? `${s.commissionRule.percentage}%` : 'Outro'}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                             R$ {(s.stats?.totalRevenue || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 font-bold text-amber-600">
                             R$ {(s.stats?.pendingCommissions || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 flex gap-3">
                             <button className="text-[#B06A32] font-bold text-xs hover:underline uppercase">Editar</button>
                             {s.contact?.whatsapp && (
                                <a href={`https://wa.me/${s.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                                   <MessageCircle size={16} />
                                </a>
                             )}
                          </td>
                       </tr>
                    ))}
                    {filteredSellers.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhum vendedor encontrado para esta busca.</td></tr>}
                 </tbody>
              </table>
           </div>
         </>
       )}
    </div>
  );
}
