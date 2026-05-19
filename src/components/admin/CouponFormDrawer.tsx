import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Tag, 
  Settings, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  PenTool,
  Hash,
  Percent,
  Truck,
  RotateCcw,
  Calendar,
  Lock,
  Target
} from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';
import { AdminFormSection } from './ui/AdminFormSection';
import { Coupon } from '../../types/admin';
import toast from 'react-hot-toast';

interface CouponFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Coupon>) => Promise<void>;
  coupon?: Partial<Coupon> | null;
}

export function CouponFormDrawer({ isOpen, onClose, onSave, coupon }: CouponFormDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    name: '',
    active: true,
    discountType: 'percentage',
    discountValue: 0,
    appliesTo: 'all',
  });

  useEffect(() => {
    if (coupon) {
      setFormData(coupon);
    } else {
      setFormData({
        code: '',
        name: '',
        active: true,
        discountType: 'percentage',
        discountValue: 0,
        appliesTo: 'all',
      });
    }
    setHasChanges(false);
  }, [coupon, isOpen]);

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
    if (!formData.code || !formData.name) {
      toast.error('Código e nome são obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      toast.success(coupon?.id ? 'Cupom atualizado!' : 'Cupom criado!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar cupom');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      size="premium"
      title={coupon?.id ? "Editar Cupom" : "Novo Cupom de Desconto"}
      subtitle="Defina o tipo de benefício, regras de validade e limites de uso."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors mr-4">
              Cancelar
            </button>
            <Clock size={14} />
            <span>Última alteração: {coupon?.updatedAt ? new Date(coupon.updatedAt).toLocaleTimeString() : 'Agora'}</span>
            {hasChanges && <span className="flex items-center gap-1 text-amber-600 ml-4 font-bold"><AlertCircle size={14} /> Alterações pendentes</span>}
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleSubmit} 
               disabled={loading}
               className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#1C1A17] hover:bg-[#B06A32] shadow-lg shadow-[#1C1A17]/10 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
             >
               {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PenTool size={18} />}
               {coupon?.id ? 'Salvar Alterações' : 'Publicar Cupom'}
             </button>
          </div>
        </div>
      }
    >
      <div className="flex gap-8 relative pb-6">
        <div className="flex-1 min-w-0 space-y-4">
           <AdminFormSection 
             id="identidade" 
             title="Identidade do Cupom" 
             icon={Tag} 
             description="Código público e nome de controle interno."
             defaultOpen={true}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Código Promocional</label>
                   <input 
                     name="code"
                     value={formData.code || ''}
                     onChange={(e) => setManualValue('code', e.target.value.toUpperCase())}
                     className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-mono font-bold uppercase" 
                     placeholder="Ex: COFCOF10"
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nome da Campanha</label>
                   <input 
                     name="name"
                     value={formData.name || ''}
                     onChange={handleChange}
                     className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-medium" 
                     placeholder="Ex: Lançamento de Inverno"
                   />
                 </div>
              </div>
           </AdminFormSection>

           <AdminFormSection 
             id="beneficio" 
             title="Benefício & Valor" 
             icon={Ticket} 
             description="Qual o desconto ou vantagem este cupom entrega?"
             defaultOpen={true}
           >
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-3">Tipo de Benefício</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       {[
                         { id: 'percentage', label: 'Percentual', icon: Percent },
                         { id: 'fixed_amount', label: 'Valor Fixo', icon: Tag },
                         { id: 'free_shipping', label: 'Frete Grátis', icon: Truck },
                         { id: 'first_order', label: '1ª Compra', icon: RotateCcw }
                       ].map(type => (
                         <button 
                           key={type.id}
                           type="button"
                           onClick={() => setManualValue('discountType', type.id)}
                           className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${formData.discountType === type.id ? 'bg-[#1C1A17] border-[#1C1A17] text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                         >
                            <type.icon size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 {formData.discountType !== 'free_shipping' && (
                    <div className="space-y-1.5 max-w-xs transition-all animate-in fade-in slide-in-from-top-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Valor do Desconto</label>
                       <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                             {formData.discountType === 'percentage' || formData.discountType === 'first_order' ? '%' : 'R$'}
                          </div>
                          <input 
                            type="number"
                            name="discountValue"
                            value={formData.discountValue || ''}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-4 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] text-lg font-bold" 
                            placeholder="0"
                          />
                       </div>
                    </div>
                 )}
              </div>
           </AdminFormSection>

           <AdminFormSection 
             id="regras" 
             title="Regras & Limites" 
             icon={Lock} 
             description="Condições para o cupom ser aceito no carrinho."
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Pedido Mínimo</label>
                   <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xs">R$</div>
                      <input 
                        type="number"
                        name="minimumOrderValue"
                        value={formData.minimumOrderValue || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                        placeholder="Ex: 150"
                      />
                   </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Limite Total de Usos</label>
                   <input 
                     type="number"
                     name="maxUses"
                     value={formData.maxUses || ''}
                     onChange={handleChange}
                     className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" 
                     placeholder="Vazio para ilimitado"
                   />
                 </div>

                 <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 block">Configurações de Status</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <button 
                         type="button"
                         onClick={() => setManualValue('active', !formData.active)}
                         className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-100 opacity-60'}`}
                       >
                         <div className="flex flex-col items-start gap-0.5">
                            <span className="text-sm font-bold">Cupom Ativo</span>
                            <span className="text-[10px] opacity-70">Disponível para uso agora</span>
                         </div>
                         <div className={`w-8 h-4 rounded-full relative transition-colors ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.active ? 'left-4.5' : 'left-0.5'}`} />
                         </div>
                       </button>

                       <button 
                         type="button"
                         onClick={() => setManualValue('oneUsePerCustomer', !formData.oneUsePerCustomer)}
                         className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.oneUsePerCustomer ? 'bg-[#1C1A17] border-[#1C1A17] text-white shadow-md' : 'bg-white border-gray-100 text-gray-500 opacity-60'}`}
                       >
                         <div className="flex flex-col items-start gap-0.5">
                            <span className="text-sm font-bold">Uso Único p/ Cliente</span>
                            <span className="text-[10px] opacity-70">Exige login do usuário</span>
                         </div>
                         {formData.oneUsePerCustomer ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded border border-gray-200" />}
                       </button>
                    </div>
                 </div>
              </div>
           </AdminFormSection>
        </div>

        <div className="hidden lg:block w-[300px] shrink-0 space-y-6">
           <div className="bg-white rounded-3xl border border-[#2A160E]/5 overflow-hidden shadow-sm">
              <div className="p-6 bg-[#B06A32] text-white">
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-70">
                    <Ticket size={14} /> Preview do Cupom
                 </div>
                 <div className="font-mono text-3xl font-black mb-1">{formData.code || 'COFFEE'}</div>
                 <div className="text-xs font-bold opacity-80">{formData.name || 'Nova Campanha'}</div>
              </div>
              <div className="p-6 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Benefício</span>
                    <span className="text-sm font-bold text-[#1C1A17]">
                       {formData.discountType === 'free_shipping' ? 'Frete Grátis' : `${formData.discountValue}${formData.discountType === 'percentage' || formData.discountType === 'first_order' ? '%' : ' R$'}`}
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Pedido Mínimo</span>
                    <span className="text-sm font-bold text-[#1C1A17]">{formData.minimumOrderValue ? `R$ ${formData.minimumOrderValue}` : 'Nenhum'}</span>
                 </div>
                 <div className="pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                       <ShieldCheck size={14} /> Status de Saúde
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-xs">
                          {formData.code && formData.code.length >= 4 ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-gray-200" />}
                          <span className={formData.code && formData.code.length >= 4 ? 'text-gray-900 font-medium' : 'text-gray-400'}>Código Válido</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs">
                          {formData.discountValue && formData.discountValue > 0 ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-gray-200" />}
                          <span className={formData.discountValue && formData.discountValue > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}>Benefício Real</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-[#1C1A17] rounded-3xl text-white shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Manual do Sucesso</h4>
              <p className="text-xs opacity-60 leading-relaxed italic border-l-2 border-[#B06A32] pl-3">
                Cupons de primeira compra com frete grátis convertem 3x mais que descontos fixos de baixo valor.
              </p>
           </div>
        </div>
      </div>
    </AdminPopup>
  );
}
