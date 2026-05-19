import React, { useState } from 'react';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { Briefcase, Search, Settings, Coffee, Users, TrendingUp, AlertCircle, Calendar, CalendarClock } from 'lucide-react';
import { SubscriptionPlan, SubscriptionInterest, Subscription } from '../../types/admin';

export function SubscriptionsTab() {
  const { plans, interests, subscriptions, loading, updatePlan, updateInterestStatus, updateSubscription, convertInterestToCustomer } = useSubscriptions();
  const [activeSubTab, setActiveSubTab] = useState<'plans' | 'interests' | 'subscriptions' | 'forecast' | 'settings'>('plans');

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando assinaturas...</div>;

  const activePlans = plans.filter(p => p.active);
  const newInterests = interests.filter(i => i.status === 'new');
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const estimatedRevenue = activeSubs.reduce((acc, s) => acc + (s.estimatedValue || 0), 0);

  const renderPlans = () => (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
         <h3 className="font-bold text-[#1C1A17]">Planos Publicados</h3>
         <button className="text-sm font-bold text-[#B06A32] hover:text-[#2A160E]">+ Criar Plano</button>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
         <table className="w-full text-left whitespace-nowrap min-w-[800px]">
           <thead className="bg-[#F6F1EB] border-b border-gray-200">
             <tr>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Nome do Plano</th>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Preço a partir de</th>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Frequência</th>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Status</th>
               <th className="px-6 py-3 font-medium text-[#2A160E] text-right">Ações</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {plans.map(p => (
               <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4">
                   <div className="font-bold text-[#1C1A17] flex items-center gap-2">
                     {p.name}
                     {p.featured && <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Destacado</span>}
                   </div>
                   <div className="text-xs text-gray-500 mt-1">{p.shortDescription}</div>
                 </td>
                 <td className="px-6 py-4 font-medium text-amber-700">R$ {p.priceFrom.toFixed(2)}</td>
                 <td className="px-6 py-4 capitalize text-gray-600">{p.frequency}</td>
                 <td className="px-6 py-4">
                   <button 
                     onClick={() => updatePlan(p.id, { active: !p.active })}
                     className={`px-3 py-1 rounded text-xs uppercase font-bold tracking-wider ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                   >
                     {p.active ? 'Ativo' : 'Inativo'}
                   </button>
                 </td>
                 <td className="px-6 py-4 text-right font-bold text-[#B06A32] cursor-pointer hover:underline">
                   Editar
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );

  const renderInterests = () => (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
         <h3 className="font-bold text-[#1C1A17]">Interessados em Assinaturas</h3>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
         <table className="w-full text-left whitespace-nowrap min-w-[800px]">
           <thead className="bg-[#F6F1EB] border-b border-gray-200">
             <tr>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Nome</th>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Contato</th>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Plano Desejado</th>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Status</th>
               <th className="px-6 py-3 font-medium text-[#2A160E]">Data</th>
               <th className="px-6 py-3 font-medium text-[#2A160E] text-right">Ações</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {interests.map(i => (
               <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 font-bold text-[#1C1A17]">{i.name}</td>
                 <td className="px-6 py-4">
                   {i.whatsapp && <div className="text-gray-600">{i.whatsapp}</div>}
                   {i.email && <div className="text-gray-400 text-xs">{i.email}</div>}
                 </td>
                 <td className="px-6 py-4 font-medium text-[#B06A32]">{i.planName || '-'}</td>
                 <td className="px-6 py-4">
                   <select 
                     className="text-xs border border-gray-200 rounded p-1"
                     value={i.status}
                     onChange={(e) => updateInterestStatus(i.id, e.target.value as any)}
                   >
                     <option value="new">Novo</option>
                     <option value="contacted">Contatado</option>
                     <option value="qualified">Qualificado</option>
                     <option value="converted">Convertido</option>
                     <option value="no_response">Sem repsposta</option>
                     <option value="lost">Perdido</option>
                   </select>
                 </td>
                 <td className="px-6 py-4 text-xs font-medium text-gray-400">
                   {new Date(i.createdAt).toLocaleDateString()}
                 </td>
                 <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-3 text-xs font-bold">
                     <button 
                       onClick={() => i.whatsapp && window.open(`https://wa.me/55${i.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20${i.name}!%20Vi%20seu%20interesse%20na%20assinatura%20CofCof.`, '_blank')}
                       className="text-green-600 hover:underline"
                     >
                       WhatsApp
                     </button>
                     {i.status !== 'converted' && (
                       <button onClick={() => convertInterestToCustomer(i.id)} className="text-[#B06A32] hover:underline">
                         Converter
                       </button>
                     )}
                   </div>
                 </td>
               </tr>
             ))}
             {interests.length === 0 && (
               <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhum interessado encontrado.</td></tr>
             )}
           </tbody>
         </table>
      </div>
    </div>
  );

  const renderActive = () => (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
         <h3 className="font-bold text-[#1C1A17]">Assinaturas Ativas</h3>
      </div>
      <div className="p-8 text-center text-gray-500">
         <Coffee size={40} className="mx-auto text-gray-300 mb-4" />
         <p>Nenhuma assinatura ativa no momento.</p>
         <p className="text-xs mt-2">Converta interessados para iniciar o faturamento recorrente.</p>
      </div>
    </div>
  );

  return (
    <div>
       <AdminPageHeader
          title="Assinaturas"
          subtitle="Gerencie planos recorrentes, interessados, assinaturas ativas e previsão."
          action={{
            label: "Ver Página Pública",
            onClick: () => window.open('/assinatura', '_blank')
          }}
       />

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <AdminStatCard title="Planos Ativos" value={activePlans.length} />
         <AdminStatCard title="Novos Interessados" value={newInterests.length} alert={newInterests.length > 0} />
         <AdminStatCard title="Assinantes Ativos" value={activeSubs.length} />
         <AdminStatCard title="Receita Prevista" value={estimatedRevenue} unit="R$" highlight={true} />
       </div>

       <div className="flex overflow-x-auto gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'plans', label: 'Planos', icon: Coffee },
            { id: 'interests', label: 'Interessados', count: newInterests.length },
            { id: 'subscriptions', label: 'Assinaturas Ativas', count: activeSubs.length },
            { id: 'forecast', label: 'Previsão (Breve)' },
            { id: 'settings', label: 'Configurações (Breve)', icon: Settings }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeSubTab === tab.id ? 'border-[#B06A32] text-[#1C1A17]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {tab.icon && <tab.icon size={16} />}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-xs">{tab.count}</span>}
            </button>
          ))}
       </div>

       {activeSubTab === 'plans' && renderPlans()}
       {activeSubTab === 'interests' && renderInterests()}
       {activeSubTab === 'subscriptions' && renderActive()}
       {(activeSubTab === 'forecast' || activeSubTab === 'settings') && (
         <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 text-sm text-yellow-800 font-medium">
           Painel em desenvolvimento. Aguarde as próximas atualizações da plataforma.
         </div>
       )}

    </div>
  );
}
