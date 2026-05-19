import React, { useState, useEffect } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { RawCoffeeLot } from '../../../../types/admin';
import { rawCoffeeLotService } from '../../../../services/rawCoffeeLotService';
import { operationService } from '../../../../services/operationService';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { Flame, Target, User, Calculator, Info, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RoastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function RoastModal({ isOpen, onClose, onSave }: RoastModalProps) {
  const { user } = useAdminAuthStore();
  const [lots, setLots] = useState<RawCoffeeLot[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    roasterId: user?.id || '',
    roasterName: user?.name || '',
    rawLotId: '',
    rawKgUsed: 0,
    roastedKgOutput: 0,
    roastProfile: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadLots();
    }
  }, [isOpen]);

  const loadLots = async () => {
    const list = await rawCoffeeLotService.getActiveLotsWithStock();
    setLots(list);
  };

  const lossKg = formData.rawKgUsed - formData.roastedKgOutput;
  const lossPercent = formData.rawKgUsed > 0 ? (lossKg / formData.rawKgUsed) * 100 : 0;

  const missingFields = [];
  if (!formData.rawLotId) missingFields.push('Lote de origem');
  if (formData.rawKgUsed <= 0) missingFields.push('Kg consumidos');
  if (formData.roastedKgOutput <= 0) missingFields.push('Kg torrado final');
  
  const canSave = missingFields.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const selectedLot = lots.find(l => l.id === formData.rawLotId);
    
    setLoading(true);
    try {
      await operationService.registerRoast({
        ...formData,
        rawLotName: selectedLot?.name || '',
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Sistema'
      } as any);
      
      toast.success("Torra registrada com sucesso!");
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Registrar Torra Industrial" 
      subtitle="Transforme café cru em torrado e controle perdas"
      size="operation"
    >
      <form onSubmit={handleSubmit} className="space-y-8 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* General Info */}
           <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Data da Torra</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white border border-[#a3a3a3]/20 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#c9a263]/20 focus:border-[#c9a263]/50 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Mestre de Torra</label>
                <div className="relative">
                   <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
                   <input 
                     type="text" 
                     value={formData.roasterName}
                     readOnly
                     className="w-full bg-white border border-[#a3a3a3]/20 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-gray-500 outline-none"
                   />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Lote de Origem (Cru)</label>
                <select 
                  value={formData.rawLotId}
                  onChange={e => setFormData({...formData, rawLotId: e.target.value})}
                  className="w-full bg-white border border-[#a3a3a3]/20 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#c9a263]/20 focus:border-[#c9a263]/50 transition-all outline-none"
                >
                  <option value="">Selecione o lote...</option>
                  {lots.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.availableKg}kg disp.)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Perfil de Torra (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Média Clara / Perfil #23"
                  value={formData.roastProfile}
                  onChange={e => setFormData({...formData, roastProfile: e.target.value})}
                  className="w-full bg-white border border-[#a3a3a3]/20 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#c9a263]/20 focus:border-[#c9a263]/50 transition-all outline-none placeholder:text-[#a3a3a3]/50"
                />
              </div>
           </div>

           {/* Metrics */}
           <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#a3a3a3]/10 space-y-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a263]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a263] border-b border-[#a3a3a3]/10 pb-4 relative z-10">Cálculo de Produção</h3>
              
              <div className="space-y-6 relative z-10">
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Kg Cru Utilizado</label>
                    <div className="relative">
                       <Target size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a3a3a3]/50" />
                       <input 
                         type="number" 
                         step="0.1"
                         value={formData.rawKgUsed}
                         onChange={e => setFormData({...formData, rawKgUsed: Number(e.target.value)})}
                         className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/20 focus:border-[#c9a263]/50 rounded-2xl pl-12 pr-5 py-4 text-xl font-serif text-white outline-none transition-all shadow-inner focus:ring-2 focus:ring-[#c9a263]/10"
                         placeholder="0.0"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Kg Torrado Final</label>
                    <div className="relative">
                       <Flame size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c9a263]/70" />
                       <input 
                         type="number" 
                         step="0.1"
                         value={formData.roastedKgOutput}
                         onChange={e => setFormData({...formData, roastedKgOutput: Number(e.target.value)})}
                         className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/20 focus:border-[#c9a263]/50 rounded-2xl pl-12 pr-5 py-4 text-xl font-serif text-[#c9a263] outline-none transition-all shadow-[0_0_15px_rgba(201,162,99,0.05)] focus:ring-2 focus:ring-[#c9a263]/10"
                         placeholder="0.0"
                       />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-[#a3a3a3]/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-[#a3a3a3] uppercase tracking-widest">Perda Estimada</p>
                      <p className="text-lg font-serif text-[#c9a263]">{lossKg.toFixed(2)}<span className="text-xs ml-1 uppercase font-sans font-medium text-[#a3a3a3]">kg</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-bold text-[#a3a3a3] uppercase tracking-widest">% Perda</p>
                       <p className="text-lg font-serif text-white">{lossPercent.toFixed(1)}%</p>
                    </div>
                 </div>
                 
                 {lossPercent > 20 && (
                   <div className="flex items-center gap-2 p-3 bg-red-900/10 text-red-400 border border-red-900/30 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                      <Zap size={14} className="shrink-0" /> Perda acima do padrão (15-18%)
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Observações Adicionais</label>
          <textarea 
            rows={3}
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            className="w-full bg-white border border-[#a3a3a3]/20 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#c9a263]/20 focus:border-[#c9a263]/50 transition-all outline-none resize-none placeholder:text-[#a3a3a3]/50"
            placeholder="Algum detalhe relevante sobre este lote de torra..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#a3a3a3]/10">
           <button 
             type="button" 
             onClick={onClose} 
             className="px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#111111] hover:bg-black/5 transition-all"
           >
             Descartar
           </button>
           <div className="relative group">
              <button 
                type="submit"
                disabled={!canSave || loading}
                className="bg-[#111111] border border-[#a3a3a3]/10 text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-black/5 hover:bg-black active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? 'Processando...' : 'Finalizar Registro'}
              </button>
              {!canSave && (
                 <div className="absolute bottom-full mb-2 right-0 w-max max-w-xs whitespace-normal bg-black text-white text-[10px] font-bold py-2 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                     Obrigatório: {missingFields.join(', ')}
                 </div>
              )}
           </div>
        </div>
      </form>
    </AdminPopup>
  );
}
