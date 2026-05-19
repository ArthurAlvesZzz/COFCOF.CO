import React, { useState } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { stockService } from '../../../../services/stockService';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { adminLogService } from '../../../../services/adminLogService';

interface CourtesyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  stats: any;
}

export function CourtesyModal({ isOpen, onClose, onSave, stats }: CourtesyModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAdminAuthStore();
  const [formData, setFormData] = useState({
    recipient: '',
    reason: '',
    format: '200g', 
    quantity: 1,
    notes: ''
  });

  const handleSubmit = async () => {
    if (!formData.recipient.trim() || !formData.reason.trim()) {
      toast.error('Destinatário e Motivo são obrigatórios.');
      return;
    }
    if (formData.quantity <= 0) {
      toast.error('Quantidade deve ser maior que 0');
      return;
    }

    try {
      setLoading(true);
      const stockItems = await stockService.listStockItems();
      const stItem = stockItems.find(si => si.type === 'finished' && si.format === formData.format);
      
      if (!stItem || (stItem.availableUnits||0) < formData.quantity) {
          toast.error('Estoque insuficiente para registrar essa cortesia.');
          return;
      }
      
      await stockService.adjustStock({
         stockItemId: stItem.id,
         adjustmentType: 'subtract',
         quantityUnits: formData.quantity,
         reason: `Cortesia: ${formData.reason} p/ ${formData.recipient}`,
         userId: user?.id || 'user',
         userName: user?.email || 'admin'
      });
      
      await adminLogService.logAdminAction({
         userId: user?.id || 'user',
         userEmail: user?.email || 'contato@cofcof.co',
         action: 'REGISTER_COURTESY',
         entity: 'stock',
         entityId: stItem.id,
         after: { format: formData.format, qty: formData.quantity, recipient: formData.recipient }
      } as any);

      toast.success('Cortesia registrada com sucesso.');
      onSave();
      onClose();
    } catch (e: any) {
      toast.error('Erro ao registrar cortesia: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup isOpen={isOpen} onClose={onClose} size="md" title="Registrar Cortesia" subtitle="Saídas para brindes, parcerias e degustação" footer={
        <div className="flex items-center justify-end gap-3 w-full border-t border-[#a3a3a3]/10 pt-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-[#c9a263] text-black hover:bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(201,162,99,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">Confirmar Saída</button>
        </div>
    }>
        <div className="space-y-6 pt-2">
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Destinatário (Pessoa, Influencer, Evento)</label>
                <input className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40" value={formData.recipient} onChange={e => setFormData({...formData, recipient: e.target.value})} placeholder="Nome" />
             </div>
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Motivo</label>
                <input className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Ex: Degustação comercial, Doação..." />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Formato</label>
                    <select className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all appearance-none" value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})}>
                        <option value="200g">Pacote 200g (Disp: {stats?.finishedStockByFormat?.['200g']||0})</option>
                        <option value="1kg">Pacote 1kg (Disp: {stats?.finishedStockByFormat?.['1kg']||0})</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Quantidade</label>
                    <input type="number" min="1" className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                 </div>
             </div>
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Observações adicionais</label>
                <textarea className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40 resize-none" rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Detalhes opcionais..." />
             </div>
        </div>
    </AdminPopup>
  );
}
