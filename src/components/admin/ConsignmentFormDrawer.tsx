import React, { useState, useEffect } from 'react';
import { 
  Handshake, 
  User, 
  Calendar, 
  Clock, 
  PenTool, 
  LayoutList, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Users,
  Star,
  FileSearch,
  PackageSearch
} from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';
import { AdminFormSection } from './ui/AdminFormSection';
import { Consignment } from '../../types/admin';
import toast from 'react-hot-toast';

interface ConsignmentFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Consignment>) => Promise<void>;
  consignment?: Consignment | null;
}

export function ConsignmentFormDrawer({ isOpen, onClose, onSave, consignment }: ConsignmentFormDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<Consignment>>({
     recipientType: 'partner',
     status: 'open',
     agreementType: 'consignment',
     paymentStatus: 'pending'
  });

  useEffect(() => {
    if (consignment) {
      setFormData(consignment);
    } else {
      setFormData({
         recipientType: 'partner',
         status: 'open',
         agreementType: 'consignment',
         paymentStatus: 'pending',
         startDate: new Date().toISOString().substring(0,10),
         dueDate: new Date(Date.now() + 15 * 86400000).toISOString().substring(0,10)
      });
    }
    setHasChanges(false);
  }, [consignment, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setHasChanges(true);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setManualValue = (name: string, value: any) => {
    setHasChanges(true);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.recipientName) {
      toast.error('O nome do parceiro é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      toast.success(consignment ? 'Consignação atualizada!' : 'Consignação criada!');
      onClose();
    } catch (err) {
      toast.error('Erro ao salvar consignação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      size="premium"
      title={consignment ? "Editar Consignação" : "Nova Consignação PDV"}
      subtitle="Controle envios de lotes, prazos de acertos e parcerias em consignação."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors mr-4">
              Cancelar
            </button>
            <Clock size={14} />
            <span>Último acerto registrado: {consignment?.updatedAt ? new Date(consignment.updatedAt).toLocaleDateString() : 'Nunca'}</span>
            {hasChanges && <span className="flex items-center gap-1 text-amber-600 ml-4 font-bold"><AlertCircle size={14} /> Alterações pendentes</span>}
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleSubmit} 
               disabled={loading}
               className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#1C1A17] hover:bg-[#B06A32] shadow-lg shadow-[#1C1A17]/10 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
             >
               {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PenTool size={18} />}
               {consignment ? 'Salvar Alterações' : 'Criar Acordo'}
             </button>
          </div>
        </div>
      }
    >
      <div className="flex gap-8 relative pb-6">
        <div className="flex-1 min-w-0 space-y-4">
           <AdminFormSection 
             id="parceiro" 
             title="Parceiro & Contrato" 
             icon={Handshake} 
             description="Identificação do recebedor e tipo de acordo comercial."
             defaultOpen={true}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nome do Parceiro / PDV</label>
                    <div className="relative group">
                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                          <Building2 size={16} />
                       </div>
                       <input 
                         name="recipientName"
                         value={formData.recipientName || ''}
                         onChange={handleChange}
                         className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                         placeholder="Ex: Empório Central Coffee"
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-3">Tipo de Recebedor</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {[
                         { id: 'partner', label: 'Parceiro / PDV', icon: Building2 },
                         { id: 'b2b_customer', label: 'Cliente B2B', icon: Users },
                         { id: 'influencer', label: 'Influenciador', icon: Star }
                       ].map(type => (
                         <button 
                           key={type.id}
                           type="button"
                           onClick={() => setManualValue('recipientType', type.id)}
                           className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.recipientType === type.id ? 'bg-[#1C1A17] border-[#1C1A17] text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                         >
                            <type.icon size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </AdminFormSection>

           <AdminFormSection 
             id="cronograma" 
             title="Cronograma de Acerto" 
             icon={Calendar} 
             description="Definição de prazos para contagem e pagamento."
             defaultOpen={true}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Data de Envio do Lote</label>
                   <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                        <Calendar size={16} />
                      </div>
                      <input 
                        type="date"
                        name="startDate"
                        value={formData.startDate ? formData.startDate.substring(0,10) : ''}
                        onChange={(e) => setManualValue('startDate', new Date(e.target.value).toISOString())}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-medium" 
                      />
                   </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Data de Vencimento / Acerto</label>
                   <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                        <Clock size={16} />
                      </div>
                      <input 
                        type="date"
                        name="dueDate"
                        value={formData.dueDate ? formData.dueDate.substring(0,10) : ''}
                        onChange={(e) => setManualValue('dueDate', new Date(e.target.value).toISOString())}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold text-amber-600" 
                      />
                   </div>
                 </div>
              </div>
           </AdminFormSection>

           <AdminFormSection 
             id="produtos" 
             title="Produtos Consignados" 
             icon={PackageSearch} 
             description="Quais cafés estão em posse do parceiro agora?"
           >
              <div className="p-8 border border-dashed border-gray-200 rounded-3xl bg-[#FDFCFB]/50 flex flex-col items-center justify-center text-center space-y-3">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                    <LayoutList size={24} />
                 </div>
                 <div>
                    <h5 className="text-sm font-bold text-[#1C1A17]">Módulo de Estoque Externo</h5>
                    <p className="text-[10px] text-gray-400 max-w-[240px] mt-1">Integração com o inventário físico será liberada na próxima fase.</p>
                 </div>
                 <button 
                   onClick={() => toast.success("Aguarde a próxima atualização")}
                   className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1C1A17] hover:border-[#1C1A17] transition-all"
                 >
                    Adicionar Itens (Em Breve)
                 </button>
              </div>
           </AdminFormSection>
        </div>

        <div className="hidden lg:block w-[300px] shrink-0 space-y-6">
           <div className="bg-white rounded-3xl border border-[#2A160E]/5 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-[#B06A32] flex items-center justify-center text-white font-serif text-lg">
                   {formData.recipientName ? formData.recipientName[0].toUpperCase() : <Building2 size={24} />}
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-[#1C1A17] leading-tight">{formData.recipientName || 'Parceiro'}</h4>
                    <p className="text-[10px] text-gray-400">Status: {formData.status === 'open' ? 'Em aberto' : 'Liquidado'}</p>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Tipo de Acordo</span>
                    <span className="font-bold text-[#1C1A17] capitalize">{formData.agreementType}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Pagamento</span>
                    <span className={`font-bold ${formData.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                      {formData.paymentStatus === 'paid' ? 'Liquidado' : 'Pendente'}
                    </span>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                   <FileSearch size={14} /> Detalhes Fiscais
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-2 opacity-60">
                   <div className="w-full h-2 bg-gray-200 rounded animate-pulse" />
                   <div className="w-2/3 h-2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
           </div>

           <div className="p-6 bg-[#1C1A17] rounded-3xl text-white shadow-xl">
             <div className="flex items-center gap-3 mb-4">
               <Handshake size={18} className="text-[#B06A32]" />
               <h4 className="text-xs font-bold uppercase tracking-widest">Compromisso</h4>
             </div>
             <p className="text-xs opacity-70 leading-relaxed italic">
               "Parcerias em consignação exigem acerto quinzenal para garantir a frescura dos lotes e o fluxo de caixa do produtor."
             </p>
           </div>
        </div>
      </div>
    </AdminPopup>
  );
}
