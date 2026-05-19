import React, { useState } from 'react';
import { useB2BLeads } from '../../hooks/useB2BLeads';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { AdminEmptyState } from './AdminEmptyState';
import { Briefcase, Search, Filter, Eye, Download, Users, TrendingUp, AlertCircle, Building2 } from 'lucide-react';
import { B2BLead } from '../../types/admin';

import { B2BLeadDetailDrawer } from './B2BLeadDetailDrawer';
import { B2BLeadFormDrawer } from './B2BLeadFormDrawer';

export function B2BLeadsTab() {
  const { leads, loading, createLead, updateLead, updateStatus, addFollowUp, createProposal, convertToCustomer, markLost, exportCSV } = useB2BLeads();
  const [selectedLead, setSelectedLead] = useState<B2BLead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando leads B2B...</div>;

  const newLeads = leads.filter(l => l.status === 'new');
  const negotiationLeads = leads.filter(l => l.status === 'negotiation' || l.status === 'proposal_sent' || l.status === 'qualified');
  const convertedLeads = leads.filter(l => l.status === 'converted');
  const totalPotentialKg = leads.filter(l => l.status !== 'lost' && l.status !== 'converted').reduce((acc, l) => acc + (l.estimatedConsumption?.monthlyKg || 0), 0);

  const filteredLeads = leads.filter(l => {
    const q = (filterQuery || '').toLowerCase();
    const matchQ = 
       (l.contactName && l.contactName.toLowerCase().includes(q)) ||
       (l.companyName && l.companyName.toLowerCase().includes(q)) ||
       (l.email && l.email.toLowerCase().includes(q));
    const matchS = filterStatus === 'all' || l.status === filterStatus;
    return matchQ && matchS;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'proposal_sent': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-amber-100 text-amber-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'no_response': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (t: string) => ({ 
     new: 'Novo', contacted: 'Em Contato', qualified: 'Qualificado', 
     proposal_sent: 'Proposta Enviada', negotiation: 'Em Negociação', 
     converted: 'Convertido', lost: 'Perdido', no_response: 'Sem Resposta' 
  }[t] || t);

  const getTempColor = (t?: string) => ({
    cold: 'bg-gray-300', warm: 'bg-yellow-400', hot: 'bg-red-500'
  }[t || 'cold']);

  return (
    <div>
       <AdminPageHeader
          title="Leads B2B"
          subtitle="Acompanhe empresas interessadas, consumo estimado e conversões."
          action={{
            label: "Novo Lead Manual",
            onClick: () => setIsFormOpen(true)
          }}
       >
         <button 
           onClick={exportCSV}
           className="bg-white border border-gray-200 text-[#1C1A17] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
         >
           <Download size={16} /> Exportar CSV
         </button>
       </AdminPageHeader>

       {leads.length > 0 && (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <AdminStatCard title="Leads Novos" value={newLeads.length} alert={newLeads.length > 0} />
           <AdminStatCard title="Em Negociação" value={negotiationLeads.length} />
           <AdminStatCard title="Convertidos" value={convertedLeads.length} />
           <AdminStatCard title="Potencial" value={totalPotentialKg} unit="Kg/mês" highlight={true} />
         </div>
       )}

       {leads.length === 0 ? (
          <AdminEmptyState 
            title="Nenhum Lead B2B"
            description="Leads recebidos pelo formulário Empresas e Simulador B2B aparecerão aqui automaticamente."
            icon={<Building2 size={32} />}
          />
       ) : (
          <div className="bg-white border text-sm max-w-full border-gray-100 rounded-2xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por contato ou empresa..." 
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#C89B5A]"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#C89B5A]"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="new">Novos</option>
                  <option value="contacted">Em Contato / Qualificado</option>
                  <option value="negotiation">Em Negociação / Proposta</option>
                  <option value="converted">Convertidos</option>
                  <option value="lost">Perdidos</option>
                </select>
             </div>

             <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                  <thead className="bg-[#F6F1EB] border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-medium text-[#2A160E] w-2">T</th>
                      <th className="px-6 py-4 font-medium text-[#2A160E]">Empresa / Contato</th>
                      <th className="px-6 py-4 font-medium text-[#2A160E]">Origem</th>
                      <th className="px-6 py-4 font-medium text-[#2A160E]">Consumo Est.</th>
                      <th className="px-6 py-4 font-medium text-[#2A160E]">Status</th>
                      <th className="px-6 py-4 font-medium text-[#2A160E]">Atualizado Em</th>
                      <th className="px-6 py-4 font-medium text-[#2A160E] text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedLead(l)}>
                        <td className="px-6 py-4">
                           <div className={`w-3 h-3 rounded-full ${getTempColor(l.temperature)}`} title={`Temperatura: ${l.temperature}`}></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#1C1A17]">{l.companyName || l.contactName}</div>
                          {l.companyName && <div className="text-xs text-gray-500 mt-1">{l.contactName}</div>}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs font-bold uppercase">{l.source.replace('_', ' ')}</td>
                        <td className="px-6 py-4 font-medium text-amber-700">{l.estimatedConsumption?.monthlyKg ? `${l.estimatedConsumption.monthlyKg} Kg/mês` : '-'}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getStatusColor(l.status)}`}>
                             {getStatusLabel(l.status)}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(l.updatedAt || l.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={(e) => { e.stopPropagation(); setSelectedLead(l); }} className="p-2 text-gray-400 hover:text-[#B06A32] transition-colors tooltip-trigger" title="Ver Detalhes">
                             <Eye size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>

             <div className="md:hidden divide-y divide-gray-100">
                 {filteredLeads.map(l => (
                   <div key={l.id} className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex justify-between" onClick={() => setSelectedLead(l)}>
                      <div>
                        <div className="font-bold text-[#1C1A17] flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getTempColor(l.temperature)}`}></div>
                          {l.companyName || l.contactName}
                        </div>
                        {l.companyName && <div className="text-xs text-gray-500 mt-0.5">{l.contactName}</div>}
                        <div className="mt-2 text-amber-700 font-medium text-sm">
                          {l.estimatedConsumption?.monthlyKg ? `${l.estimatedConsumption.monthlyKg} Kg` : '-'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${getStatusColor(l.status)}`}>
                          {getStatusLabel(l.status)}
                        </span>
                      </div>
                   </div>
                 ))}
             </div>
          </div>
       )}

       <B2BLeadDetailDrawer
          isOpen={selectedLead !== null}
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={updateLead}
          onUpdateStatus={updateStatus}
          onAddFollowUp={addFollowUp}
          onCreateProposal={createProposal}
          onConvertToCustomer={convertToCustomer}
          onMarkLost={markLost}
       />
       <B2BLeadFormDrawer 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={createLead as any}
       />
    </div>
  );
}
