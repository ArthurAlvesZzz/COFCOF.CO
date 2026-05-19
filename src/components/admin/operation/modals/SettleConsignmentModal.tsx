import React, { useState, useEffect } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { consignmentService } from '../../../../services/consignmentService';
import toast from 'react-hot-toast';
import { stockService } from '../../../../services/stockService';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { adminLogService } from '../../../../services/adminLogService';
import { Consignment } from '../../../../types/admin';

interface SettleConsignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function SettleConsignmentModal({ isOpen, onClose, onSave }: SettleConsignmentModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAdminAuthStore();
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [selectedConsignmentId, setSelectedConsignmentId] = useState('');
  
  const [items, setItems] = useState<any[]>([]);
  const [payment, setPayment] = useState({ value: 0, method: 'pix', notes: '' });

  useEffect(() => {
    if (isOpen) {
      loadConsignments();
    }
  }, [isOpen]);

  const loadConsignments = async () => {
    try {
      const all = await consignmentService.listConsignments();
      const open = all.filter(c => c.status === 'open' || c.status === 'partial' || c.status === 'overdue');
      setConsignments(open);
      if (open.length > 0) {
         setSelectedConsignmentId(open[0].id);
      } else {
         setSelectedConsignmentId('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
     if (selectedConsignmentId) {
        const c = consignments.find(x => x.id === selectedConsignmentId);
        if (c) {
           setItems(c.items.map(i => ({
              itemId: i.id,
              productName: i.productName,
              quantityPending: i.quantityPending,
              unitPrice: i.unitPrice,
              quantitySold: 0,
              quantityReturned: 0,
              quantityLost: 0
           })));
        }
     }
  }, [selectedConsignmentId, consignments]);

  useEffect(() => {
     const totalItemsSoldValue = items.reduce((acc, i) => acc + (i.quantitySold * i.unitPrice), 0);
     setPayment(p => ({...p, value: totalItemsSoldValue}));
  }, [items]);

  const handleSubmit = async () => {
    if (!selectedConsignmentId) {
        toast.error('Selecione uma consignação aberta.');
        return;
    }
    for (const item of items) {
       if (item.quantitySold + item.quantityReturned + item.quantityLost > item.quantityPending) {
           toast.error(`Soma de quantidades excede pendente para ${item.productName}`);
           return;
       }
    }

    try {
      setLoading(true);
      
      const settled = await consignmentService.registerConsignmentSettlement(selectedConsignmentId, {
         items,
         notes: payment.notes
      });

      if (payment.value > 0) {
         await consignmentService.registerConsignmentPayment(selectedConsignmentId, {
             value: payment.value,
             method: payment.method,
             userId: user?.id
         });
      }

      await adminLogService.logAdminAction({
         userId: user?.id || 'user',
         userEmail: user?.email || 'admin@cofcof.co',
         action: 'SETTLE_CONSIGNMENT',
         entity: 'consignment',
         entityId: selectedConsignmentId,
         after: settled
      } as any);

      toast.success('Acerto registrado com sucesso.');
      onSave();
      onClose();
    } catch (e: any) {
      toast.error('Erro ao registrar acerto: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup isOpen={isOpen} onClose={onClose} size="lg" title="Registrar Acerto" footer={
        <div className="flex justify-end gap-3 w-full">
            <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading || !selectedConsignmentId} className="px-6 py-3 bg-[#1C1A17] text-white rounded-xl text-sm font-bold shadow-sm">Confirmar Acerto</button>
        </div>
    }>
        {consignments.length === 0 ? (
            <div className="py-10 text-center text-gray-500">Nenhuma consignação aberta para acertar.</div>
        ) : (
            <div className="space-y-6 pt-2">
               <div>
                  <label className="text-xs font-bold text-gray-400">Consignação / Parceiro</label>
                  <select className="w-full border p-3 rounded-lg mt-1" value={selectedConsignmentId} onChange={e => setSelectedConsignmentId(e.target.value)}>
                     {consignments.map(c => (
                        <option key={c.id} value={c.id}>{c.recipientName} - {c.code}</option>
                     ))}
                  </select>
               </div>
               
               <div>
                  <h4 className="font-bold text-sm text-[#1C1A17] mb-2">Itens Pendentes</h4>
                  {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded-lg mb-2">
                         <div className="col-span-1">
                             <span className="text-xs font-bold block truncate" title={item.productName}>{item.productName}</span>
                             <span className="text-[10px] text-gray-500">Pend. {item.quantityPending} | R$ {item.unitPrice}</span>
                         </div>
                         <div className="col-span-1">
                             <label className="text-[10px] text-gray-500 block mb-1">Qtd Vendida</label>
                             <input type="number" min="0" max={item.quantityPending} className="w-full border p-2 rounded text-sm" value={item.quantitySold} onChange={e => { const newItems = [...items]; newItems[index].quantitySold = Number(e.target.value); setItems(newItems); }} />
                         </div>
                         <div className="col-span-1">
                             <label className="text-[10px] text-gray-500 block mb-1">Qtd Devolvida</label>
                             <input type="number" min="0" max={item.quantityPending} className="w-full border p-2 rounded text-sm" value={item.quantityReturned} onChange={e => { const newItems = [...items]; newItems[index].quantityReturned = Number(e.target.value); setItems(newItems); }} />
                         </div>
                         <div className="col-span-1">
                             <label className="text-[10px] text-gray-500 block mb-1">Qtd Perdida</label>
                             <input type="number" min="0" max={item.quantityPending} className="w-full border p-2 rounded text-sm" value={item.quantityLost} onChange={e => { const newItems = [...items]; newItems[index].quantityLost = Number(e.target.value); setItems(newItems); }} />
                         </div>
                         <div className="col-span-1 flex flex-col justify-end text-right">
                             <span className="text-xs font-bold text-emerald-600 block mb-1">R$ {item.quantitySold * item.unitPrice}</span>
                         </div>
                      </div>
                  ))}
               </div>

               <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-sm text-[#1C1A17] mb-2">Pagamento & Recebimento</h4>
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="text-[10px] font-bold text-gray-400">Total a Receber</label>
                        <input type="number" step="0.1" className="w-full border p-3 rounded-lg mt-1 font-bold text-emerald-600" value={payment.value} onChange={e => setPayment({...payment, value: Number(e.target.value)})} />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-gray-400">Método de Pgto</label>
                        <select className="w-full border p-3 rounded-lg mt-1" value={payment.method} onChange={e => setPayment({...payment, method: e.target.value})}>
                            <option value="pix">PIX</option>
                            <option value="transfer">Transferência Bancária</option>
                            <option value="cash">Dinheiro em Espécie</option>
                        </select>
                     </div>
                  </div>
                  <div className="mt-4">
                        <label className="text-[10px] font-bold text-gray-400">Observações do Acerto</label>
                        <textarea className="w-full border p-3 rounded-lg mt-1" rows={2} value={payment.notes} onChange={e => setPayment({...payment, notes: e.target.value})} placeholder="Anotações sobre quebras, devoluções, ou prazo" />
                  </div>
               </div>
            </div>
        )}
    </AdminPopup>
  );
}
