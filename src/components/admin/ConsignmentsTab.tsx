import React, { useState } from 'react';
import { useConsignments } from '../../hooks/useConsignments';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { Search, Filter, Download, Plus, Handshake, AlertTriangle, MessageCircle } from 'lucide-react';
import { Consignment } from '../../types/admin';
import { ConsignmentFormDrawer } from './ConsignmentFormDrawer';
import { exportToCSV } from '../../lib/export';
import { openWhatsApp } from '../../lib/whatsapp';
import toast from 'react-hot-toast';

export function ConsignmentsTab() {
  const { consignments, stats, loading, createConsignment, registerSettlement, registerPayment } = useConsignments();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  if (loading) return <div className="p-8 text-center text-gray-500">Carregando consignações...</div>;

  const filteredConsignments = consignments.filter(c => 
    (c.recipientName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    (c.code || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  ).sort((a,b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

  const handleExportCSV = () => {
    const headers = ['Código', 'Destinatário', 'Status', 'Valor Total', 'Pendente', 'Vencimento'];
    const rows = filteredConsignments.map(c => [
       c.code, c.recipientName, c.status, 
       c.totalValue?.toFixed(2) || '0', 
       c.pendingValue?.toFixed(2) || '0',
       c.dueDate ? new Date(c.dueDate).toLocaleDateString('pt-BR') : ''
    ]);
    exportToCSV('consignacoes.csv', headers, rows);
    toast.success('CSV exportado com sucesso!');
  };

  return (
    <div className="pb-24">
       <AdminPageHeader
          title="Consignações"
          subtitle="Controle produtos entregues, vendidos, retornados, pagos e pendentes com parceiros e clientes."
          action={{
            label: "Nova Consignação",
            onClick: () => setIsDrawerOpen(true)
          }}
       >
         <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-[#1C1A17] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Download size={16} /> Exportar
         </button>
       </AdminPageHeader>

       {consignments.length === 0 ? (
         <div className="bg-white border text-center p-12 rounded-2xl shadow-sm my-6">
            <Handshake size={48} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-serif text-[#1C1A17] mb-2">Nenhuma consignação registrada</h3>
            <p className="text-gray-500 mb-8">
              Crie a primeira consignação para controlar produtos entregues, vendidos, retornados e pagos.
            </p>
         </div>
       ) : (
         <>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <AdminStatCard title="Em Aberto" value={stats?.open} />
             <AdminStatCard title="Vencidas" value={stats?.overdue} alert={stats?.overdue > 0} />
             <AdminStatCard title="Valor Consignado" value={`R$ ${stats?.totalConsigned?.toFixed(2) || '0.00'}`} />
             <AdminStatCard title="Valor Pendente" value={`R$ ${stats?.pendingValue?.toFixed(2) || '0.00'}`} alert={stats?.pendingValue > 0} />
           </div>

           <div className="bg-white border text-sm max-w-full overflow-x-auto border-gray-100 rounded-2xl shadow-sm mb-6">
              <table className="w-full text-left whitespace-nowrap min-w-[900px]">
                 <thead className="bg-[#F6F1EB] border-b border-gray-200">
                    <tr>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Código / Data</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Destinatário</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Vencimento</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Status</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E] text-right">Total</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E] text-right">Pendente</th>
                       <th className="px-6 py-4 font-medium text-[#2A160E]">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {filteredConsignments.map(c => (
                       <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                             <p className="font-bold text-[#1C1A17]">{c.code}</p>
                             <p className="text-xs text-gray-500">{new Date(c.startDate).toLocaleDateString('pt-BR')}</p>
                          </td>
                          <td className="px-6 py-4 font-medium text-[#1C1A17]">{c.recipientName}</td>
                          <td className={`px-6 py-4 font-medium ${c.status === 'overdue' ? 'text-red-600' : 'text-gray-600'}`}>
                             {c.dueDate ? new Date(c.dueDate).toLocaleDateString('pt-BR') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 uppercase text-xs font-bold">
                             <span className={`px-2 py-1 rounded-full ${c.status === 'open' ? 'bg-blue-50 text-blue-800' : c.status === 'overdue' ? 'bg-red-50 text-red-800' : c.status === 'paid' ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                               {c.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium">R$ {c.totalValue?.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-medium text-amber-600">R$ {c.pendingValue?.toFixed(2)}</td>
                          <td className="px-6 py-4 flex gap-3">
                             <button onClick={() => {
                                registerSettlement(c.id, {
                                  items: c.items.map(i => ({ itemId: i.id, quantitySold: i.quantityPending, quantityReturned: 0, quantityLost: 0 }))
                                });
                                toast.success("Acerto registrado");
                             }} className="text-[#B06A32] font-bold text-xs hover:underline uppercase">Acerto</button>
                             <button onClick={() => {
                                registerPayment(c.id, {
                                   value: c.pendingValue,
                                   method: 'pix'
                                });
                                toast.success("Pagamento registrado");
                             }} className="text-[#B06A32] font-bold text-xs hover:underline uppercase">Pgto Total</button>
                             <button onClick={() => {
                               if (c.recipientWhatsapp) {
                                 openWhatsApp(c.recipientWhatsapp, `Olá ${c.recipientName}, tudo bem? Passando para alinharmos os cafés...`);
                               } else {
                                 toast.error("Sem número de WhatsApp cadastrado");
                               }
                             }} className="text-green-600 hover:text-green-700">
                                <MessageCircle size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                    {filteredConsignments.length === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Nenhuma consignação encontrada para esta busca.</td></tr>}
                 </tbody>
              </table>
           </div>
         </>
       )}

       <ConsignmentFormDrawer 
         isOpen={isDrawerOpen} 
         onClose={() => setIsDrawerOpen(false)} 
         onSave={async (data) => {
           await createConsignment({
             ...data,
             items: [
               { 
                 id: 'item1', productId: 'p1', productName: 'Cerrado Premium 250g',
                 quantitySent: 10, quantitySold: 0, quantityReturned: 0, quantityPending: 10,
                 unitPrice: 35, totalValue: 350, soldValue: 0, pendingValue: 350
               }
             ]
           } as any);
         }} 
       />
    </div>
  );
}
