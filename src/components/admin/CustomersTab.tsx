import React, { useState } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { AdminEmptyState } from './AdminEmptyState';
import { Users, Search, Eye, Filter, Download } from 'lucide-react';
import { CustomerAdmin } from '../../types/admin';
import { CustomerDetailDrawer } from './CustomerDetailDrawer';
import { CustomerFormDrawer } from './CustomerFormDrawer';

export function CustomersTab() {
  const { customers, loading, updateCustomer, createCustomer, addNote, exportCSV } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAdmin | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [filterQuery, setFilterQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando clientes...</div>;
  }

  const activeCustomers = customers.filter(c => c.status === 'active');
  const b2bCustomers = customers.filter(c => c.type === 'b2b');
  const pendingCustomers = customers.filter(c => c.stats.totalPending > 0);
  const avgTicketAll = customers.length > 0 ? customers.reduce((acc, c) => acc + c.stats.averageTicket, 0) / customers.length : 0;

  const filteredCustomers = customers.filter(c => {
    const query = (filterQuery || '').toLowerCase();
    const matchesQuery = 
      (c.name || '').toLowerCase().includes(query) || 
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.whatsapp && c.whatsapp.includes(query)) ||
      (c.company?.name && c.company.name.toLowerCase().includes(query));
      
    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesQuery && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'b2b': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'b2c': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'partner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'subscription': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (t: string) => ({ b2b: 'B2B', b2c: 'B2C', partner: 'Parceiro', subscription: 'Assinante', consignment: 'Consignação', lead_converted: 'Lead Convertido' }[t] || t);

  return (
    <div>
      <AdminPageHeader 
        title="Clientes & CRM" 
        subtitle="Centralize compradores, empresas, leads convertidos e histórico de pedidos."
        action={{
          label: "Novo Cliente",
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

      {customers.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AdminStatCard title="Total Cadastrados" value={customers.length} />
          <AdminStatCard title="Clientes Ativos" value={activeCustomers.length} />
          <AdminStatCard title="Clientes B2B" value={b2bCustomers.length} />
          <AdminStatCard title="Com Pendência" value={pendingCustomers.length} alert={pendingCustomers.length > 0} />
        </div>
      )}

      {customers.length === 0 ? (
         <AdminEmptyState 
           title="Nenhum cliente"
           description="Os clientes do checkout ou B2B aparecerão aqui automaticamente."
           icon={<Users size={32} />}
         />
      ) : (
        <div className="bg-white border text-sm max-w-full border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Buscar por nome, e-mail, telefone..." 
                 className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#C89B5A]"
                 value={filterQuery}
                 onChange={(e) => setFilterQuery(e.target.value)}
               />
             </div>
             <select 
               className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#C89B5A]"
               value={filterType}
               onChange={e => setFilterType(e.target.value)}
             >
               <option value="all">Todos os Tipos</option>
               <option value="b2c">B2C (Consumidor)</option>
               <option value="b2b">B2B (Empresa)</option>
               <option value="subscription">Assinatura</option>
               <option value="partner">Parceiros</option>
             </select>
          </div>
          
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
              <thead className="bg-[#F6F1EB] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Cliente</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Contato</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Tipo</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E] text-center">Pedidos</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E] text-right">LTV (Total)</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E] text-right">Pendente</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Última Compra</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => setSelectedCustomer(c)}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#1C1A17] flex items-center gap-2">
                        {c.name}
                        {c.stats.totalPending > 0 && <span className="w-2 h-2 rounded-full bg-red-500" title="Pendência Financeira" />}
                      </div>
                      {c.company?.name && <div className="text-xs text-gray-500 mt-1">@{c.company.name}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {c.whatsapp && <div className="text-sm font-medium">{c.whatsapp}</div>}
                      {c.email && <div className="text-xs text-gray-500">{c.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border tracking-wider ${getTypeColor(c.type)}`}>
                         {getTypeLabel(c.type)}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-700">{c.stats.totalOrders}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-700">R$ {c.stats.totalSpent.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">{c.stats.totalPending > 0 ? `R$ ${c.stats.totalPending.toFixed(2)}` : '-'}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {c.stats.lastOrderAt ? new Date(c.stats.lastOrderAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={(e) => { e.stopPropagation(); setSelectedCustomer(c); }} className="p-2 text-gray-400 hover:text-[#B06A32] transition-colors tooltip-trigger" title="Ver Detalhes">
                         <Eye size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-100">
             {filteredCustomers.map(c => (
               <div key={c.id} className="p-4 bg-white hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-[#1C1A17]">{c.name}</div>
                      {c.company?.name && <div className="text-xs text-gray-500 mt-0.5">@{c.company.name}</div>}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border tracking-wider ${getTypeColor(c.type)}`}>
                      {getTypeLabel(c.type)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">WhatsApp</span>
                      <span className="font-medium">{c.whatsapp || '-'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 text-xs block">LTV / Gasto</span>
                      <span className="font-bold text-green-700">R$ {c.stats.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
               </div>
             ))}
          </div>

        </div>
      )}

      <CustomerDetailDrawer 
        isOpen={selectedCustomer !== null}
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onUpdate={updateCustomer} 
        onAddNote={addNote}
      />
      <CustomerFormDrawer 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={createCustomer as any}
      />
    </div>
  );
}
