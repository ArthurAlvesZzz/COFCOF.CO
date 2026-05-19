import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Target, 
  Clock, 
  PenTool, 
  LayoutList, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Scale
} from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';
import { AdminFormSection } from './ui/AdminFormSection';
import { B2BLead } from '../../types/admin';
import toast from 'react-hot-toast';

interface B2BLeadFormDrawerProps {
  lead?: B2BLead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<B2BLead>) => void;
}

export function B2BLeadFormDrawer({ lead, isOpen, onClose, onSave }: B2BLeadFormDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
     companyName: '',
     contactName: '',
     email: '',
     whatsapp: '',
     expectedConsumption: 0,
     position: '',
     notes: ''
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        companyName: lead.companyName || '',
        contactName: lead.contactName || '',
        email: lead.email || '',
        whatsapp: lead.whatsapp || '',
        expectedConsumption: lead.estimatedConsumption?.monthlyKg || 0,
        position: (lead as any).position || '',
        notes: (lead as any).notes || ''
      });
    } else {
      setFormData({ companyName: '', contactName: '', email: '', whatsapp: '', expectedConsumption: 0, position: '', notes: '' });
    }
    setHasChanges(false);
  }, [lead, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setHasChanges(true);
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const setManualValue = (name: string, value: any) => {
    setHasChanges(true);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if(!formData.companyName || !formData.contactName) {
       toast.error("Empresa e Contato são obrigatórios.");
       return;
    }
    
    try {
      setLoading(true);
      await onSave({ 
        ...formData, 
        estimatedConsumption: { monthlyKg: Number(formData.expectedConsumption || 0) },
        status: lead?.status || 'new', 
        source: lead?.source || 'admin' 
      });
      toast.success(lead ? 'Lead atualizado!' : 'Lead B2B criado!');
      onClose();
    } catch (err) {
      toast.error('Erro ao salvar lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      size="premium"
      title={lead ? "Editar Lead B2B" : "Novo Lead Corporativo"}
      subtitle="Cadastre uma nova empresa para prospecção de assinaturas e vendas B2B."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors mr-4">
              Cancelar
            </button>
            <Clock size={14} />
            <span>Criado em: {lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Hoje'}</span>
            {hasChanges && <span className="flex items-center gap-1 text-amber-600 ml-4 font-bold"><AlertCircle size={14} /> Alterações pendentes</span>}
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleSubmit} 
               disabled={loading}
               className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#1C1A17] hover:bg-[#B06A32] shadow-lg shadow-[#1C1A17]/10 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
             >
               {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PenTool size={18} />}
               {lead ? 'Salvar Alterações' : 'Cadastrar Lead'}
             </button>
          </div>
        </div>
      }
    >
      <div className="flex gap-8 relative pb-6">
        <div className="flex-1 min-w-0 space-y-4">
           <AdminFormSection 
             id="empresa" 
             title="Dados da Empresa" 
             icon={Building2} 
             description="Informações corporativas e perfil do negócio."
             defaultOpen={true}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="md:col-span-2 space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nome da Empresa / Razão Social</label>
                   <div className="relative group">
                     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                       <Building2 size={16} />
                     </div>
                     <input 
                       name="companyName"
                       value={formData.companyName}
                       onChange={handleChange}
                       className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                       placeholder="Ex: Agência Criativa Ltda"
                     />
                   </div>
                 </div>
                 
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Consumo Mensal Estimado</label>
                    <div className="relative group">
                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                          <Scale size={16} />
                       </div>
                       <input 
                         type="number"
                         name="expectedConsumption"
                         value={formData.expectedConsumption || ''}
                         onChange={handleChange}
                         className="w-full pl-11 pr-12 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                         placeholder="10"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">KG</span>
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Potencial do Lead</label>
                    <div className="flex gap-2 p-1 bg-gray-50/50 rounded-xl border border-gray-100">
                       {['Baixo', 'Médio', 'Alto'].map(level => (
                         <button 
                           key={level}
                           type="button"
                           onClick={() => setManualValue('potencial', level)}
                           className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${(formData as any).potencial === level ? 'bg-[#1C1A17] text-white shadow-sm' : 'text-gray-400 hover:text-[#1C1A17]'}`}
                         >
                           {level}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </AdminFormSection>

           <AdminFormSection 
             id="contato" 
             title="Ponto de Contato" 
             icon={User} 
             description="Pessoa responsável pela decisão ou interface."
             defaultOpen={true}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Responsável</label>
                   <input 
                     name="contactName"
                     value={formData.contactName}
                     onChange={handleChange}
                     className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-medium" 
                     placeholder="Ex: João da Silva"
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Cargo / Função</label>
                   <input 
                     name="position"
                     value={formData.position}
                     onChange={handleChange}
                     className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" 
                     placeholder="Ex: Gerente de RH"
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">E-mail</label>
                   <div className="relative group">
                     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                       <Mail size={16} />
                     </div>
                     <input 
                       name="email"
                       type="email"
                       value={formData.email}
                       onChange={handleChange}
                       className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" 
                       placeholder="joao@empresa.com"
                     />
                   </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">WhatsApp direto</label>
                   <div className="relative group">
                     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                       <Phone size={16} />
                     </div>
                     <input 
                       name="whatsapp"
                       value={formData.whatsapp}
                       onChange={handleChange}
                       className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                       placeholder="11 99999-9999"
                     />
                   </div>
                 </div>
              </div>
           </AdminFormSection>

           <AdminFormSection 
             id="notas" 
             title="Qualificação & Notas" 
             icon={Target} 
             description="Registro de conversas e próximos passos."
           >
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm leading-relaxed" 
                placeholder="Detalhes sobre a prospecção, qualificação do lead, necessidades específicas..."
              />
           </AdminFormSection>
        </div>

        <div className="hidden lg:block w-[300px] shrink-0 space-y-6">
           <div className="bg-[#FDFCFB] rounded-3xl border border-[#2A160E]/5 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-[#1C1A17] flex items-center justify-center text-white font-serif text-lg">
                   {formData.companyName ? formData.companyName[0].toUpperCase() : <Building2 size={24} />}
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-[#1C1A17] leading-tight">{formData.companyName || 'Empresa'}</h4>
                    <p className="text-[10px] text-gray-400">{formData.contactName || 'Contato'}</p>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Consumo Estimado</span>
                    <span className="font-bold text-[#1C1A17]">{formData.expectedConsumption} KG/mês</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Status</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-md">Prospecção</span>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                   <Target size={14} /> Checklist Lead
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-xs">
                      {formData.companyName ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-gray-200" />}
                      <span className={formData.companyName ? 'text-gray-900 font-medium' : 'text-gray-400'}>Empresa Identificada</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs">
                      {formData.expectedConsumption > 0 ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-gray-200" />}
                      <span className={formData.expectedConsumption > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}>Volume de Café Definido</span>
                   </div>
                </div>
              </div>
           </div>

           <div className="p-5 bg-[#1C1A17] rounded-3xl text-white shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Ação Rápida</h4>
              <button 
                onClick={() => toast.error("Integração com CRM em breve")}
                className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-left group"
              >
                 <div className="flex flex-col gap-0.5">
                   <span className="text-xs font-bold">Gerar Proposta</span>
                   <span className="text-[10px] opacity-60">PDF automático</span>
                 </div>
                 <PenTool size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
           </div>
        </div>
      </div>
    </AdminPopup>
  );
}
