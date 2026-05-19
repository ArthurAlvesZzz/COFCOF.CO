import React, { useState, useEffect } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { RoastBatch } from '../../../../types/admin';
import { operationService } from '../../../../services/operationService';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { Package, Flame, User, Box, ArrowRight, Info, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PackagingModal({ isOpen, onClose, onSave }: PackagingModalProps) {
  const { user } = useAdminAuthStore();
  const [roasts, setRoasts] = useState<RoastBatch[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    roastBatchId: '',
    responsibleId: user?.id || '',
    responsibleName: user?.name || '',
    packageFormat: 'Pacote 250g',
    unitWeightKg: 0.25,
    quantityUnits: 0,
    destination: 'estoque' as any,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) loadRoasts();
  }, [isOpen]);

  const loadRoasts = async () => {
    const list = await operationService.listRoasts();
    // Simplified: show logic here could filter roasts with remaining stock if we had that detail
    setRoasts(list);
  };

  const totalKg = formData.unitWeightKg * formData.quantityUnits;

  const missingFields = [];
  if (!formData.roastBatchId) missingFields.push('Lote de torra');
  if (formData.quantityUnits <= 0) missingFields.push('Quantidade de unidades');
  
  const canSave = missingFields.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const selectedRoast = roasts.find(r => r.id === formData.roastBatchId);
    
    setLoading(true);
    try {
      await operationService.registerPackaging({
        ...formData,
        roastBatchName: `Torra #${selectedRoast?.id.slice(-4)}`,
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Sistema'
      });
      
      toast.success("Empacotamento registrado!");
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formats = [
    { label: 'Sachê 200g', weight: 0.2 },
    { label: 'Pacote 250g', weight: 0.25 },
    { label: 'Pacote 500g', weight: 0.5 },
    { label: 'Pacote 1kg', weight: 1.0 },
    { label: 'Kg Avulso', weight: 1.0 },
  ];

  return (
    <AdminPopup 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Registrar Empacotamento" 
      subtitle="Converta café torrado em produto acabado"
      size="operation"
    >
      <form onSubmit={handleSubmit} className="space-y-8 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Lote de Torra (Origem)</label>
                <select 
                  value={formData.roastBatchId}
                  onChange={e => setFormData({...formData, roastBatchId: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#B06A32]/10 transition-all outline-none appearance-none"
                >
                  <option value="">Selecione o lote torrado...</option>
                  {roasts.map(r => (
                    <option key={r.id} value={r.id}>Torra {r.date} ({r.roastedKgOutput}kg orig.)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Formato / Unidade</label>
                <div className="grid grid-cols-2 gap-3">
                   {formats.map(f => (
                     <button
                       key={f.label}
                       type="button"
                       onClick={() => setFormData({...formData, packageFormat: f.label, unitWeightKg: f.weight})}
                       className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${formData.packageFormat === f.label ? 'border-[#c9a263] bg-[#c9a263]/5 text-[#c9a263] shadow-[0_0_15px_rgba(201,162,99,0.1)]' : 'border-[#a3a3a3]/20 bg-white text-[#a3a3a3] hover:border-[#a3a3a3]/50'}`}
                     >
                       {f.label}
                     </button>
                   ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Destino do Produzido</label>
                <div className="flex gap-2">
                   {['estoque', 'pedido', 'consignacao'].map(d => (
                     <button
                        key={d}
                        type="button"
                        onClick={() => setFormData({...formData, destination: d as any})}
                        className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${formData.destination === d ? 'bg-[#111111] text-[#c9a263]' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3]'}`}
                     >
                        {d}
                     </button>
                   ))}
                </div>
              </div>
           </div>

           <div className="bg-[#fcfaf8] p-8 rounded-[2.5rem] border border-[#a3a3a3]/10 space-y-8">
              <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a263]">Produção de Unidades</h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Quantidade de Unidades</label>
                    <div className="relative">
                       <Box size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
                       <input 
                         type="number" 
                         value={formData.quantityUnits}
                         onChange={e => setFormData({...formData, quantityUnits: Number(e.target.value)})}
                         className="w-full bg-white border border-[#a3a3a3]/20 focus:border-[#c9a263]/50 focus:ring-2 focus:ring-[#c9a263]/20 rounded-2xl pl-12 pr-5 py-4 text-xl font-serif text-[#111111] outline-none transition-all shadow-[0_0_15px_rgba(201,162,99,0.05)]"
                         placeholder="0"
                       />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-[#a3a3a3]/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-[#a3a3a3] uppercase tracking-widest">Peso Total (Consumo)</p>
                      <p className="text-lg font-serif text-[#c9a263]">{totalKg.toFixed(2)}<span className="text-xs ml-1 uppercase font-sans text-[#a3a3a3]">kg</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-bold text-[#a3a3a3] uppercase tracking-widest">Saldo Torrado Disp.</p>
                       <p className="text-xs font-bold text-[#a3a3a3]">---</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 p-3 bg-white border border-[#a3a3a3]/10 text-gray-500 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    <Layers size={14} className="shrink-0 text-[#c9a263]" /> Baixa automática de café torrado
                 </div>
              </div>
           </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#a3a3a3]/10">
           <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#111111] transition-colors">Cancelar</button>
           <div className="relative group">
              <button 
                type="submit"
                disabled={!canSave || loading}
                className="bg-[#111111] text-[#c9a263] border border-[#a3a3a3]/10 px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-black/5 hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processando...' : 'Registrar Empacotamento'}
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
