import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Save,
  PenTool
} from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';
import { AdminFormSection } from './ui/AdminFormSection';
import toast from 'react-hot-toast';

interface CustomerFormDrawerProps {
  customer?: any; // Add optional customer for editing
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function CustomerFormDrawer({ customer, isOpen, onClose, onSave }: CustomerFormDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
     name: '',
     email: '',
     whatsapp: '',
     type: 'b2c',
     notes: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        whatsapp: customer.whatsapp || '',
        type: customer.type || 'b2c',
        notes: customer.notes || ''
      });
    } else {
      setFormData({ name: '', email: '', whatsapp: '', type: 'b2c', notes: '' });
    }
    setHasChanges(false);
  }, [customer, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setHasChanges(true);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleManualChange = (name: string, value: any) => {
    setHasChanges(true);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if(!formData.name || !formData.whatsapp) {
       toast.error("Nome e WhatsApp são obrigatórios.");
       return;
    }
    
    try {
      setLoading(true);
      await onSave({ ...formData, source: 'admin', status: 'new' });
      toast.success(customer ? 'Cliente atualizado!' : 'Cliente criado com sucesso!');
      onClose();
    } catch (err) {
      toast.error('Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      size="premium"
      title={customer ? "Editar Cliente" : "Novo Cliente"}
      subtitle="Cadastre informações essenciais para o acompanhamento comercial."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors mr-4">
              Cancelar
            </button>
            <Clock size={14} />
            <span>Última atualização: agora</span>
            {hasChanges && <span className="flex items-center gap-1 text-amber-600 ml-4 font-bold transition-all animate-pulse"><AlertCircle size={14} /> Alterações pendentes</span>}
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleSubmit} 
               disabled={loading}
               className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#1C1A17] hover:bg-[#B06A32] shadow-lg shadow-[#1C1A17]/10 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
             >
               {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PenTool size={18} />}
               {customer ? 'Salvar Alterações' : 'Criar Cliente'}
             </button>
          </div>
        </div>
      }
    >
      <div className="flex gap-8 relative pb-6">
        <div className="flex-1 min-w-0 space-y-4">
           <AdminFormSection 
             id="identidade" 
             title="Identidade & Contato" 
             icon={User} 
             description="Informações básicas e canais de comunicação."
             defaultOpen={true}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="md:col-span-2 space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nome Completo</label>
                   <input 
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] focus:ring-4 focus:ring-[#B06A32]/5 transition-all text-sm font-medium" 
                     placeholder="Ex: Ana Souza"
                   />
                 </div>
                 
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">E-mail Comercial</label>
                   <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#B06A32]">
                        <Mail size={16} />
                      </div>
                      <input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" 
                        placeholder="ana@exemplo.com"
                      />
                   </div>
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">WhatsApp</label>
                   <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#B06A32]">
                        <Phone size={16} />
                      </div>
                      <input 
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                        placeholder="34 99872-8882"
                      />
                   </div>
                 </div>
              </div>
           </AdminFormSection>

           <AdminFormSection 
             id="perfil" 
             title="Perfil & Classificação" 
             icon={Building2} 
             description="Tipo de conta e notas internas."
             defaultOpen={true}
           >
              <div className="space-y-5">
                 <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-3">Tipo de Cliente</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => handleManualChange('type', 'b2c')}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${formData.type === 'b2c' ? 'bg-[#1C1A17] border-[#1C1A17] text-white' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'}`}
                      >
                         <div className="flex items-center gap-3 text-left">
                            <div className={`p-2 rounded-lg ${formData.type === 'b2c' ? 'bg-white/10' : 'bg-gray-50'}`}>
                               <User size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-bold">Consumidor (B2C)</p>
                               <p className="text-[10px] opacity-60">Pessoa física / CPF</p>
                            </div>
                         </div>
                         {formData.type === 'b2c' && <CheckCircle2 size={16} />}
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleManualChange('type', 'b2b')}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${formData.type === 'b2b' ? 'bg-[#1C1A17] border-[#1C1A17] text-white' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'}`}
                      >
                         <div className="flex items-center gap-3 text-left">
                            <div className={`p-2 rounded-lg ${formData.type === 'b2b' ? 'bg-white/10' : 'bg-gray-50'}`}>
                               <Building2 size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-bold">Empresa (B2B)</p>
                               <p className="text-[10px] opacity-60">Pessoa jurídica / CNPJ</p>
                            </div>
                         </div>
                         {formData.type === 'b2b' && <CheckCircle2 size={16} />}
                      </button>
                   </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Notas e Observações</label>
                    <textarea 
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm leading-relaxed" 
                      placeholder="Histórico, preferências ou avisos importantes sobre o cliente..."
                    />
                 </div>
              </div>
           </AdminFormSection>
        </div>

        <div className="hidden lg:block w-[300px] shrink-0 space-y-6">
           <div className="bg-[#1C1A17] rounded-3xl p-6 text-white shadow-xl">
              <div className="flex justify-center mb-6">
                 <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-serif">
                   {formData.name ? formData.name[0].toUpperCase() : <User size={40} />}
                 </div>
              </div>
              <div className="text-center space-y-1">
                 <h4 className="font-bold text-lg leading-tight">{formData.name || 'Nome do Cliente'}</h4>
                 <p className="text-xs text-white/60 mb-4">{formData.email || 'sem e-mail'}</p>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
                   {formData.type === 'b2c' ? 'Consumidor Final' : 'Cliente Corporativo'}
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                 <div className="flex items-center gap-3 text-xs opacity-60">
                    <Mail size={14} />
                    <span className="truncate">{formData.email || '-'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs opacity-60 font-bold">
                    <Phone size={14} className="text-[#B06A32]" />
                    <span>{formData.whatsapp || '-'}</span>
                 </div>
              </div>
           </div>

           <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                 <FileText size={16} /> Checklist
              </div>
              <ul className="space-y-2">
                 <li className="flex items-center gap-2 text-xs">
                    {formData.name ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-amber-300" />}
                    Nome Identificado
                 </li>
                 <li className="flex items-center gap-2 text-xs">
                    {formData.whatsapp.length > 8 ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-amber-300" />}
                    WhatsApp Válido
                 </li>
                 <li className="flex items-center gap-2 text-xs opacity-60">
                    {formData.email ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-amber-300" />}
                    E-mail preenchido
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </AdminPopup>
  );
}
