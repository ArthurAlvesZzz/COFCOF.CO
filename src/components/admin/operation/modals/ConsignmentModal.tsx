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
               userName: user?.email || 'contato@cofcof.co'
            });
         }
      }

      await adminLogService.logAdminAction({
         userId: user?.id || 'user',
         userEmail: user?.email || 'contato@cofcof.co',
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
    <AdminPopup isOpen={isOpen} onClose={onClose} size="lg" title="Registrar Consignação" subtitle="Envie pacotes para pontos de venda e parceiros" footer={
        <div className="flex items-center justify-end gap-3 w-full border-t border-[#a3a3a3]/10 pt-6 mt-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-[#c9a263] text-black hover:bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(201,162,99,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">Confirmar Envio</button>
        </div>
    }>
       <div className="space-y-8 pt-4">
          <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Destinatário / Parceiro</label>
                <input className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} placeholder="Nome do PDV" />
             </div>
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">WhatsApp / Telefone</label>
                <input className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40" value={formData.recipientWhatsapp} onChange={e => setFormData({...formData, recipientWhatsapp: e.target.value})} placeholder="Ex: 553499..." />
             </div>
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Data de Envio</label>
                <input type="date" className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
             </div>
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Data de Acerto (Vencimento)</label>
                <input type="date" className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
             </div>
          </div>
          <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a263] border-b border-[#a3a3a3]/10 pb-4 mb-4">Itens Enviados</h4>
              {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center bg-[#111111] border border-[#a3a3a3]/10 p-5 rounded-[24px]">
                      <div className="col-span-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Formato</label>
                          <select className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-xl px-3 py-2 text-sm text-white outline-none appearance-none" value={item.format} onChange={e => { const newItems = [...items]; newItems[index].format = e.target.value; setItems(newItems); }}>
                              <option value="200g">200g ({availableStock['200g']||0} disp)</option>
                              <option value="1kg">1kg ({availableStock['1kg']||0} disp)</option>
                          </select>
                      </div>
                      <div className="col-span-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Unidades</label>
                          <input type="number" min="1" className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-xl px-3 py-2 text-sm text-white outline-none" value={item.quantitySent} onChange={e => { const newItems = [...items]; newItems[index].quantitySent = Number(e.target.value); setItems(newItems); }} />
                      </div>
                      <div className="col-span-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Preço Und (R$)</label>
                          <input type="number" min="0" step="0.1" className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-xl px-3 py-2 text-sm text-[#c9a263] font-serif outline-none" value={item.unitPrice} onChange={e => { const newItems = [...items]; newItems[index].unitPrice = Number(e.target.value); setItems(newItems); }} />
                      </div>
                      <div className="col-span-1 flex flex-col justify-center items-end h-full">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Total Base</span>
                          <span className="text-xl font-serif text-white">R$ {(item.quantitySent * item.unitPrice).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      </div>
                  </div>
              ))}
          </div>
          <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Observações (Opcional)</label>
                <textarea className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40 resize-none" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Anotações sobre a consignação..." />
          </div>
       </div>
    </AdminPopup>
  );
}
