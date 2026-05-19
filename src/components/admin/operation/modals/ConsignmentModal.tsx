import React, { useState, useEffect } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { consignmentService } from '../../../../services/consignmentService';
import toast from 'react-hot-toast';
import { stockService } from '../../../../services/stockService';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { adminLogService } from '../../../../services/adminLogService';

interface ConsignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  stats: any;
}

export function ConsignmentModal({ isOpen, onClose, onSave, stats }: ConsignmentModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAdminAuthStore();
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientWhatsapp: '',
    city: '',
    seller: '',
    startDate: new Date().toISOString().substring(0, 10),
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10),
    notes: ''
  });

  const [items, setItems] = useState([{ productId: 'cafe-cerrado', format: '200g', quantitySent: 0, unitPrice: 0 }]);
  const availableStock = stats?.finishedStockByFormat || {};

  useEffect(() => {
    if (isOpen) {
      setFormData({
        recipientName: '',
        recipientWhatsapp: '',
        city: '',
        seller: '',
        startDate: new Date().toISOString().substring(0, 10),
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10),
        notes: ''
      });
      setItems([{ productId: 'cafe-cerrado', format: '200g', quantitySent: 0, unitPrice: 0 }]);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.recipientName) {
      toast.error('Destinatário é obrigatório');
      return;
    }
    if (items.some(i => i.quantitySent <= 0)) {
       toast.error('Quantidade deve ser maior que 0');
       return;
    }
    
    // Check stock
    for (const item of items) {
       const av = availableStock[item.format] || 0;
       if (item.quantitySent > av) {
          toast.error(`Estoque insuficiente de ${item.format}`);
          return;
       }
    }

    try {
      setLoading(true);
      
      const newItems = items.map((i, idx) => ({
         id: `item_${idx}`,
         productId: i.productId,
         productName: `Café ${i.format}`,
         quantitySent: i.quantitySent,
         quantitySold: 0,
         quantityReturned: 0,
         quantityPending: i.quantitySent,
         unitPrice: i.unitPrice,
         totalValue: i.quantitySent * i.unitPrice,
         soldValue: 0,
         pendingValue: i.quantitySent * i.unitPrice
      }));

      const newCons = await consignmentService.createConsignment({
         recipientType: 'partner',
         recipientName: formData.recipientName,
         recipientWhatsapp: formData.recipientWhatsapp,
         startDate: new Date(formData.startDate).toISOString(),
         dueDate: new Date(formData.dueDate).toISOString(),
         status: 'open',
         agreementType: 'consignment',
         paymentStatus: 'pending',
         items: newItems
      } as any);

      // Reduce stock
      const stockItems = await stockService.listStockItems();
      for (const item of items) {
         const sItem = stockItems.find(si => si.type === 'finished' && si.format === item.format);
         if(sItem) {
            await stockService.adjustStock({
               stockItemId: sItem.id,
               adjustmentType: 'subtract',
               quantityUnits: item.quantitySent,
               reason: `Consignação para ${formData.recipientName}`,
               userId: user?.id || 'user',
               userName: user?.email || 'admin@cofcof.co'
            });
         }
      }

      await adminLogService.logAdminAction({
         userId: user?.id || 'user',
         userEmail: user?.email || 'admin@cofcof.co',
         action: 'CREATE_CONSIGNMENT',
         entity: 'consignment',
         entityId: newCons.id,
         after: newCons
      });

      toast.success('Consignação registrada com sucesso.');
      onSave();
      onClose();
    } catch (e: any) {
      toast.error('Erro ao registrar consignação: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup isOpen={isOpen} onClose={onClose} size="lg" title="Registrar Consignação" footer={
        <div className="flex justify-end gap-3 w-full">
            <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-[#1C1A17] text-white rounded-xl text-sm font-bold shadow-sm">Confirmar Envio</button>
        </div>
    }>
       <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold text-gray-400">Destinatário / Parceiro</label>
                <input className="w-full border p-3 rounded-lg mt-1" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} placeholder="Nome do PDV" />
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400">WhatsApp / Telefone</label>
                <input className="w-full border p-3 rounded-lg mt-1" value={formData.recipientWhatsapp} onChange={e => setFormData({...formData, recipientWhatsapp: e.target.value})} placeholder="Ex: 553499..." />
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400">Data de Envio</label>
                <input type="date" className="w-full border p-3 rounded-lg mt-1" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400">Data de Acerto (Vencimento)</label>
                <input type="date" className="w-full border p-3 rounded-lg mt-1" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
             </div>
          </div>
          <div>
              <h4 className="font-bold text-sm text-[#1C1A17] mt-4 mb-2">Itens Enviados</h4>
              {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3 items-center bg-gray-50 p-3 rounded-lg mb-2">
                      <div className="col-span-1">
                          <label className="text-xs text-gray-500 block mb-1">Formato</label>
                          <select className="w-full border p-2 rounded text-sm" value={item.format} onChange={e => { const newItems = [...items]; newItems[index].format = e.target.value; setItems(newItems); }}>
                              <option value="200g">Pacote 200g (Disp: {availableStock['200g']||0})</option>
                              <option value="1kg">Pacote 1kg (Disp: {availableStock['1kg']||0})</option>
                          </select>
                      </div>
                      <div className="col-span-1">
                          <label className="text-xs text-gray-500 block mb-1">Qtd Enviada</label>
                          <input type="number" min="1" className="w-full border p-2 rounded text-sm" value={item.quantitySent} onChange={e => { const newItems = [...items]; newItems[index].quantitySent = Number(e.target.value); setItems(newItems); }} />
                      </div>
                      <div className="col-span-1">
                          <label className="text-xs text-gray-500 block mb-1">Preço Unitário (R$)</label>
                          <input type="number" min="0" step="0.1" className="w-full border p-2 rounded text-sm" value={item.unitPrice} onChange={e => { const newItems = [...items]; newItems[index].unitPrice = Number(e.target.value); setItems(newItems); }} />
                      </div>
                      <div className="col-span-1 flex flex-col justify-end">
                          <span className="text-xs font-bold block mb-1 text-right">Total: R$ {item.quantitySent * item.unitPrice}</span>
                      </div>
                  </div>
              ))}
          </div>
          <div>
                <label className="text-xs font-bold text-gray-400">Observações</label>
                <textarea className="w-full border p-3 rounded-lg mt-1" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Anotações opcionais" />
          </div>
       </div>
    </AdminPopup>
  );
}
