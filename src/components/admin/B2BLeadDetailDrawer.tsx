import React, { useState } from 'react';
import { B2BLead } from '../../types/admin';
import { MessageCircle, Briefcase, Calculator, FileText, CheckCircle, RotateCcw } from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';

interface B2BLeadDetailDrawerProps {
  lead: B2BLead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: B2BLead['status'], note?: string) => void;
  onUpdate: (id: string, data: Partial<B2BLead>) => void;
  onAddFollowUp: (id: string, fu: any) => void;
  onCreateProposal: (id: string, proposal: any) => void;
  onConvertToCustomer: (id: string) => void;
  onMarkLost: (id: string, reason: string) => void;
}

export function B2BLeadDetailDrawer({ 
  lead, isOpen, onClose, onUpdateStatus, onUpdate, onAddFollowUp, onCreateProposal, onConvertToCustomer, onMarkLost 
}: B2BLeadDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'consumption' | 'followups' | 'proposal' | 'conversion' | 'history'>('overview');
  
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

  const getTempColor = (t?: string) => ({ cold: 'bg-gray-300', warm: 'bg-yellow-400', hot: 'bg-red-500' }[t || 'cold']);
  const getTempLabel = (t?: string) => ({ cold: 'Frio', warm: 'Morno', hot: 'Quente' }[t || 'cold']);

  const openWhatsApp = (msgType: 'contact' | 'estimate' | 'proposal' | 'no_response' | 'converted') => {
    if (!lead || !lead.whatsapp) return;
    let text = `Olá, ${lead.contactName}! `;
    switch (msgType) {
      case 'contact': text += `Vi seu interesse em café CofCof para ${lead.companyName || 'sua empresa'}. Posso te ajudar a montar uma sugestão de volume idela para sua operação?`; break;
      case 'estimate': text += `Com base no consumo informado, estimei aproximadamente ${lead.estimatedConsumption?.monthlyKg || 0} kg/mês para ${lead.companyName || 'sua empresa'}. O pacote recomendado seria ${lead.estimatedConsumption?.recommendedPackage || 'ideal para você'}. Quer que eu te envie uma proposta?`; break;
      case 'proposal': text += `Passando para saber se conseguiu avaliar a proposta CofCof para ${lead.companyName || 'sua empresa'}. Posso ajustar volume, frequência ou perfil do café se precisar.`; break;
      case 'no_response': text += `Só passando para retomar seu interesse em café CofCof para ${lead.companyName || 'sua empresa'}. Ainda faz sentido conversarmos sobre isso?`; break;
      case 'converted': text += `Vou registrar ${lead.companyName || 'sua empresa'} como cliente CofCof e seguimos com os próximos passos do fornecimento!`; break;
    }
    window.open(`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const [lostReason, setLostReason] = useState('');
  const [showLostConfirm, setShowLostConfirm] = useState(false);

  if (!lead) return null;

  const headerContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
         <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-3 h-3 rounded-full ${getTempColor(lead.temperature)}`} title={`Temperatura: ${getTempLabel(lead.temperature)}`} />
              <h2 className="text-xl sm:text-2xl font-serif text-[#1C1A17]">{lead.companyName || lead.contactName}</h2>
              {lead.companyName && <span className="text-sm font-medium text-gray-500">@{lead.contactName}</span>}
            </div>
            <div className="flex flex-wrap gap-2 items-center mt-2 text-sm font-medium">
               <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getStatusColor(lead.status)}`}>{getStatusLabel(lead.status)}</span>
               <span className="text-xs uppercase font-bold text-gray-400">{lead.segment || 'Segmento n/a'}</span>
               <span className="text-xs font-medium text-gray-400">|</span>
               <span className="text-xs font-bold text-amber-700">{lead.estimatedConsumption?.monthlyKg ? `${lead.estimatedConsumption.monthlyKg} Kg/mês` : 'Consumo n/a'}</span>
            </div>
         </div>
      </div>
      
      <div className="flex overflow-x-auto gap-1 border-b border-gray-200 scrollbar-hide">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'consumption', label: 'Estimativa' },
          { id: 'followups', label: 'Follow-Ups', count: lead.followUps?.length },
          { id: 'proposal', label: 'Proposta', alert: lead.status === 'proposal_sent' },
          { id: 'conversion', label: 'Conversão', hide: lead.status === 'converted' || lead.status === 'lost' },
        ].filter(t => !t.hide).map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-[#B06A32] text-[#1C1A17]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            {tab.label}
            {tab.count !== undefined && <span className="ml-2 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">{tab.count}</span>}
            {tab.alert && <span className="ml-1 w-2 h-2 inline-block rounded-full bg-red-500" />}
          </button>
        ))}
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex justify-between items-center w-full">
       <div className="flex items-center gap-2">
         {lead.whatsapp && (
            <button onClick={() => openWhatsApp('contact')} className="px-5 py-2 flex items-center justify-center gap-2 bg-green-100 text-green-700 font-bold hover:bg-green-200 rounded-xl transition-colors tooltip-trigger">
              <MessageCircle size={18} /> WhatsApp
            </button>
         )}
       </div>
       <button onClick={onClose} className="px-6 py-2 font-bold text-gray-500 hover:text-gray-700 transition-colors">
         Fechar
       </button>
    </div>
  );

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      title={headerContent}
      size="2xl"
      footer={footerContent}
    >
        <div className="min-h-[50vh]">
           {activeTab === 'overview' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
               {lead.status === 'new' && (
                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-center">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Briefcase size={20} /></div>
                    <div className="flex-1 text-sm text-blue-900">
                      <strong>Novo Lead Entrou!</strong> Este lead precisa do primeiro contato.
                    </div>
                    <button 
                      onClick={() => { openWhatsApp('contact'); onUpdateStatus(lead.id, 'contacted'); }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md transition-colors"
                    >
                      Iniciar Contato
                    </button>
                 </div>
               )}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                     <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Contato</h3>
                     <div className="space-y-3 text-sm">
                       {lead.whatsapp && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">WhatsApp:</span> <span className="font-medium">{lead.whatsapp}</span></div>}
                       {lead.email && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">E-mail:</span> <span className="font-medium">{lead.email}</span></div>}
                       {lead.city && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Cidade:</span> <span className="font-medium">{lead.city}/{lead.state}</span></div>}
                       <div className="flex justify-between pt-1"><span className="text-gray-500">Origem:</span> <span className="font-bold uppercase text-xs">{lead.source.replace('_', ' ')}</span></div>
                     </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                     <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Comercial</h3>
                     <div className="space-y-3 text-sm">
                       <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Temperatura:</span> <span className="font-medium">{getTempLabel(lead.temperature)}</span></div>
                       <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Consumo Estimado:</span> <span className="font-medium text-amber-700">{lead.estimatedConsumption?.monthlyKg ? `${lead.estimatedConsumption.monthlyKg} Kg` : '-'}</span></div>
                       <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Valor Potencial:</span> <span className="font-medium text-green-700">{lead.proposal?.estimatedMonthlyValue ? `R$ ${lead.proposal.estimatedMonthlyValue}` : '-'}</span></div>
                       <div className="flex justify-between pt-1"><span className="text-gray-500">Responsável:</span> <span>{lead.responsibleSellerId || '-'}</span></div>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
                  <button onClick={() => openWhatsApp('contact')} className="flex-1 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold hover:bg-green-100 text-center transition-colors">Zap: Primeiro Contato</button>
                  <button onClick={() => openWhatsApp('estimate')} className="flex-1 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-bold hover:bg-amber-100 text-center transition-colors">Zap: Estimativa</button>
                  <button onClick={() => openWhatsApp('no_response')} className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 text-center transition-colors">Zap: Retomar</button>
               </div>
             </div>
           )}

           {activeTab === 'consumption' && (
              <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-right-4 fade-in">
                 <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-xl"><Calculator size={24}/></div>
                    <div>
                      <h3 className="font-serif text-xl border-b-0 pb-0">Simulador de Consumo</h3>
                      <p className="text-sm text-gray-500">Dados baseados no perfil preenchido.</p>
                    </div>
                 </div>

                 {lead.estimatedConsumption?.monthlyKg ? (
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                         <div className="p-3 bg-gray-50 rounded-xl">
                           <div className="text-xs text-gray-500 font-bold uppercase mb-1">Pessoas / Dia</div>
                           <div className="font-medium text-lg">{lead.estimatedConsumption.peoplePerDay || '-'}</div>
                         </div>
                         <div className="p-3 bg-gray-50 rounded-xl">
                           <div className="text-xs text-gray-500 font-bold uppercase mb-1">Dias / Mês</div>
                           <div className="font-medium text-lg">{lead.estimatedConsumption.daysPerMonth || '-'}</div>
                         </div>
                      </div>

                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex justify-between items-center">
                         <div>
                            <div className="text-xs text-amber-800 font-bold uppercase mb-1">Consumo Total Estimado</div>
                            <div className="font-serif text-2xl text-amber-900">{lead.estimatedConsumption.monthlyKg} Kg <span className="text-base text-amber-700 font-sans">/ mês</span></div>
                         </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                         <div className="text-xs text-gray-500 font-bold uppercase mb-1">Sugestão de Produto B2B</div>
                         <div className="font-medium text-[#1C1A17]">{lead.estimatedConsumption.recommendedPackage || 'Pacote Standard'}</div>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-2xl">
                      O lead não preencheu os dados de consumo. <br/>
                      Você pode editar e preencher manualmente depois.
                   </div>
                 )}
              </div>
           )}

           {activeTab === 'conversion' && (
             <div className="space-y-6 max-w-xl mx-auto animate-in slide-in-from-right-4 fade-in">
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl font-serif mb-2">Lead Ganho</h3>
                  <p className="text-sm text-gray-500 mb-6">Conveter este lead criará um cliente oficial na aba Clientes associado a empresa.</p>
                  <button 
                    onClick={() => {
                      openWhatsApp('converted');
                      onConvertToCustomer(lead.id);
                    }}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition-all active:scale-[0.98]"
                  >
                    Converter em Cliente B2B
                  </button>
                  <p className="text-xs text-gray-400 mt-4">Uma vez convertido, você poderá gerar Pedidos B2B e acompanhar LTV lá.</p>
               </div>

               {showLostConfirm ? (
                 <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-center animate-fade-in">
                   <h3 className="font-bold text-red-800 mb-4 text-lg">Confirma Perda do Lead?</h3>
                   <select 
                     className="w-full text-base border border-red-300 rounded-xl p-3 mb-4 bg-white outline-none focus:ring-1 focus:ring-red-500"
                     value={lostReason}
                     onChange={e => setLostReason(e.target.value)}
                   >
                     <option value="">Selecione um motivo...</option>
                     <option value="preco">Preço / Orçamento</option>
                     <option value="concorrente">Fechou com Concorrente</option>
                     <option value="sem_resposta">Sem Resposta / Sumiu</option>
                     <option value="baixo_consumo">Baixo Consumo / Não é Foco</option>
                     <option value="fora_regiao">Fora da Região de Entrega</option>
                     <option value="outro">Outro (Especificar nas notas)</option>
                   </select>
                   <div className="flex gap-2 justify-center">
                     <button onClick={() => setShowLostConfirm(false)} className="px-4 py-2 font-bold text-gray-600 hover:bg-red-100 rounded-xl transition-colors">Cancelar</button>
                     <button 
                       disabled={!lostReason}
                       onClick={() => onMarkLost(lead.id, lostReason)} 
                       className="px-6 py-2 font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all active:scale-[0.98]"
                     >
                       Confirmar Perda
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <h3 className="font-bold text-red-600 mb-2">Lead Perdido</h3>
                    <p className="text-sm text-gray-500 mb-4">Caso não haja negócio. Não apaga os dados, apenas arquiva a negociação na aba Perdidos.</p>
                    <button onClick={() => setShowLostConfirm(true)} className="px-6 py-2 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 text-sm transition-colors">
                      Marcar como Perdido
                    </button>
                 </div>
               )}
             </div>
           )}

           {activeTab === 'proposal' && (
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-xl mx-auto animate-in slide-in-from-right-4 fade-in">
               {lead.proposal ? (
                 <div>
                   <h3 className="font-serif text-xl border-b border-gray-100 pb-4 mb-4">Proposta Registrada</h3>
                   <div className="space-y-4 text-sm">
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                       <span className="text-gray-600 font-medium">Pacote</span>
                       <span className="font-bold">{lead.proposal.packageName}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                       <span className="text-gray-600 font-medium">Preço / Kg</span>
                       <span className="font-bold">R$ {lead.proposal.pricePerKg}</span>
                     </div>
                     <div className="flex justify-between items-center p-5 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 shadow-sm">
                       <span className="font-bold">Valor Mensal Estimado</span>
                       <span className="font-bold text-xl">R$ {lead.proposal.estimatedMonthlyValue}</span>
                     </div>
                   </div>
                   <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                     <button onClick={() => openWhatsApp('proposal')} className="flex-1 py-3 text-sm font-bold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                       Follow-Up de Proposta
                     </button>
                     {lead.proposal.status !== 'accepted' && (
                       <button onClick={() => onUpdateStatus(lead.id, 'negotiation', 'Proposta em Negociação')} className="flex-1 py-3 text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors shadow-sm">
                         Em Negociação
                       </button>
                     )}
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FileText size={32} className="text-gray-400" />
                   </div>
                   <p className="text-gray-500 mb-6 font-medium">Nenhuma proposta registrada. Envie proposta e gere simulação.</p>
                   <button
                     onClick={() => {
                       const kg = prompt("Volume mensal sugerido (Kg):", lead.estimatedConsumption?.monthlyKg?.toString() || "10");
                       if (!kg) return;
                       const price = prompt("Preço por Kg (R$):", "85");
                       if (!price) return;
                       onCreateProposal(lead.id, {
                         packageName: `Pacote B2B ${kg}kg`,
                         monthlyKg: parseFloat(kg),
                         pricePerKg: parseFloat(price),
                         estimatedMonthlyValue: parseFloat(kg) * parseFloat(price),
                       });
                     }}
                     className="px-6 py-3 bg-[#1C1A17] text-white font-bold text-sm rounded-xl hover:bg-[#B06A32] shadow-md transition-colors"
                   >
                     Registrar Proposta Base
                   </button>
                 </div>
               )}
             </div>
           )}

           {activeTab === 'followups' && (
              <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-4 fade-in">
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold mb-4 font-serif text-lg">Registrar Follow-Up</h3>
                    <button 
                      onClick={() => {
                        const result = prompt("O que foi conversado/acordado?");
                        if (result) {
                           onAddFollowUp(lead.id, { type: 'whatsapp', result, status: 'done' });
                           onUpdateStatus(lead.id, 'contacted', 'Follow-up registrado');
                        }
                      }}
                      className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300 transition-all text-sm"
                    >
                       + Adicionar Registro Rápido
                    </button>
                 </div>

                 <div className="space-y-4">
                   {lead.followUps?.length ? (
                     [...lead.followUps].reverse().map(fu => (
                       <div key={fu.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                          <div className="bg-gray-50 p-3 rounded-xl self-start"><RotateCcw size={20} className="text-gray-400" /></div>
                          <div>
                             <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{new Date(fu.createdAt).toLocaleString()} • Via {fu.type}</div>
                             <p className="text-sm font-medium text-gray-800 leading-relaxed">{fu.result || 'Contato realizado'}</p>
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 py-12">
                        <p className="text-gray-500 font-medium">Nenhum follow-up registrado.</p>
                     </div>
                   )}
                 </div>
              </div>
           )}

        </div>
    </AdminPopup>
  );
}
