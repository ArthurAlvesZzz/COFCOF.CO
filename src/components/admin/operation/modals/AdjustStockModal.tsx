import React, { useState } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { stockService } from '../../../../services/stockService';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { adminLogService } from '../../../../services/adminLogService';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  stats: any;
}

export function AdjustStockModal({ isOpen, onClose, onSave, stats }: AdjustStockModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAdminAuthStore();
  const [formData, setFormData] = useState({
    stockType: 'finished',
    format: '200g', 
    adjustmentType: 'add',
    quantity: 0,
    reason: ''
  });

  const handleSubmit = async () => {
    if (formData.quantity <= 0) {
      toast.error('Quantidade deve ser maior que 0');
      return;
    }
    if (!formData.reason.trim()) {
      toast.error('Motivo é obrigatório');
      return;
    }

    try {
      setLoading(true);
      const stockItems = await stockService.listStockItems();
      const stItem = stockItems.find(si => si.type === formData.stockType && (formData.stockType !== 'finished' || si.format === formData.format));
      
      if (!stItem && formData.adjustmentType === 'subtract') {
          toast.error('Estoque inexistente para saída/perda');
          return;
      }
      
      let targetId = stItem?.id;
      if (!targetId && formData.stockType === 'finished') {
         const newSt = await stockService.createStockItem({
             type: 'finished',
             format: formData.format,
             availableUnits: 0,
             status: 'available'
         });
         targetId = newSt.id;
      } else if (!targetId) {
         toast.error("Não é possível ajustar estoque cru/torrado não existente. Lançe lote ou torra.");
         return;
      }

      await stockService.adjustStock({
         stockItemId: targetId,
         adjustmentType: formData.adjustmentType as any,
         quantityUnits: formData.stockType === 'finished' ? formData.quantity : undefined,
         quantityKg: formData.stockType !== 'finished' ? formData.quantity : undefined,
         reason: formData.reason,
         userId: user?.id || 'user',
         userName: user?.email || 'admin@cofcof.co'
      });

      await adminLogService.logAdminAction({
         userId: user?.id || 'user',
         userEmail: user?.email || 'admin@cofcof.co',
         action: 'ADJUST_STOCK',
         entity: 'stock',
         entityId: targetId,
         after: { ...formData }
      } as any);

      toast.success('Estoque ajustado com sucesso.');
      onSave();
      onClose();
    } catch (e: any) {
      toast.error('Erro ao ajustar estoque: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup isOpen={isOpen} onClose={onClose} size="md" title="Ajustar Estoque" footer={
        <div className="flex justify-end gap-3 w-full">
            <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-[#1C1A17] text-white rounded-xl text-sm font-bold shadow-sm">Confirmar Ajuste</button>
        </div>
    }>
        <div className="space-y-4 pt-2">
             <div>
                <label className="text-xs font-bold text-gray-400">Tipo de Estoque</label>
                <select className="w-full border p-3 rounded-lg mt-1" value={formData.stockType} onChange={e => setFormData({...formData, stockType: e.target.value})}>
                    <option value="finished">Produto Acabado (Pacotes)</option>
                    <option value="roasted">Café Torrado</option>
                </select>
             </div>
             {formData.stockType === 'finished' && (
                 <div>
                    <label className="text-xs font-bold text-gray-400">Formato</label>
                    <select className="w-full border p-3 rounded-lg mt-1" value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})}>
                        <option value="200g">Pacote 200g (Disp: {stats?.finishedStockByFormat?.['200g']||0})</option>
                        <option value="1kg">Pacote 1kg (Disp: {stats?.finishedStockByFormat?.['1kg']||0})</option>
                    </select>
                 </div>
             )}
             <div>
                <label className="text-xs font-bold text-gray-400">Ação</label>
                <select className="w-full border p-3 rounded-lg mt-1" value={formData.adjustmentType} onChange={e => setFormData({...formData, adjustmentType: e.target.value})}>
                    <option value="add">Entrada / Adição</option>
                    <option value="subtract">Saída / Perda / Correção Negativa</option>
                </select>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400">Quantidade ({formData.stockType==='finished'?'unidades':'kg'})</label>
                <input type="number" min="0" className="w-full border p-3 rounded-lg mt-1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400">Motivo (Obrigatório)</label>
                <input className="w-full border p-3 rounded-lg mt-1" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Ex: Contagem física errada, Perda avaria..." />
             </div>
        </div>
    </AdminPopup>
  );
}
