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
         userEmail: user?.email || 'contato@cofcof.co',
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
    <AdminPopup isOpen={isOpen} onClose={onClose} size="lg" title="Registrar Acerto" subtitle="Baixa de consignações, devoluções e recebimentos" footer={
        <div className="flex items-center justify-end gap-3 w-full border-t border-[#a3a3a3]/10 pt-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading || !selectedConsignmentId} className="px-8 py-3 bg-[#c9a263] text-black hover:bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(201,162,99,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">Confirmar Acerto</button>
        </div>
    }>
        {consignments.length === 0 ? (
            <div className="py-16 text-center text-[#a3a3a3] text-sm">Nenhuma consignação pendente de acerto.</div>
        ) : (
            <div className="space-y-8 pt-2">
               <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Selecione a Consignação</label>
                  <select className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all appearance-none" value={selectedConsignmentId} onChange={e => setSelectedConsignmentId(e.target.value)}>
                     {consignments.map(c => (
                        <option key={c.id} value={c.id}>{c.recipientName} - {c.code}</option>
                     ))}
                  </select>
               </div>
               
               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a263] border-b border-[#a3a3a3]/10 pb-4 mb-4">Itens Pendentes e Baixas</h4>
                  {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4 items-center bg-[#111111] border border-[#a3a3a3]/10 p-5 rounded-[24px] mb-3">
                         <div className="col-span-1 border-r border-[#a3a3a3]/10 pr-4">
                             <span className="text-xs font-bold block truncate text-white mb-1" title={item.productName}>{item.productName}</span>
                             <span className="text-[9px] font-bold uppercase tracking-wider text-[#a3a3a3]">Pend. {item.quantityPending} | R$ {item.unitPrice}</span>
                         </div>
                         <div className="col-span-1">
                             <label className="text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Vendida</label>
                             <input type="number" min="0" max={item.quantityPending} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" value={item.quantitySold} onChange={e => { const newItems = [...items]; newItems[index].quantitySold = Number(e.target.value); setItems(newItems); }} />
                         </div>
                         <div className="col-span-1">
                             <label className="text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Devolvida</label>
                             <input type="number" min="0" max={item.quantityPending} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-xl px-3 py-2 text-sm text-white outline-none" value={item.quantityReturned} onChange={e => { const newItems = [...items]; newItems[index].quantityReturned = Number(e.target.value); setItems(newItems); }} />
                         </div>
                         <div className="col-span-1">
                             <label className="text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Perdida</label>
                             <input type="number" min="0" max={item.quantityPending} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500/50" value={item.quantityLost} onChange={e => { const newItems = [...items]; newItems[index].quantityLost = Number(e.target.value); setItems(newItems); }} />
                         </div>
                         <div className="col-span-1 flex flex-col justify-center items-end text-right">
                             <span className="text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Subtotal</span>
                             <span className="text-base font-serif text-emerald-500">R$ {item.quantitySold * item.unitPrice}</span>
                         </div>
                      </div>
                  ))}
               </div>

               <div className="pt-6 border-t border-[#a3a3a3]/10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a263] mb-4">Pagamento & Recebimento</h4>
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Total a Receber</label>
                        <input type="number" step="0.1" className="w-full bg-[#1a1a1a] border border-emerald-500/30 rounded-xl px-4 py-3 text-lg font-serif text-emerald-500 outline-none" value={payment.value} onChange={e => setPayment({...payment, value: Number(e.target.value)})} />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Método de Pgto</label>
                        <select className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none" value={payment.method} onChange={e => setPayment({...payment, method: e.target.value})}>
                            <option value="pix">PIX</option>
                            <option value="transfer">Transferência Bancária</option>
                            <option value="cash">Dinheiro em Espécie</option>
                        </select>
                     </div>
                  </div>
                  <div className="mt-6">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Observações do Acerto</label>
                        <textarea className="w-full bg-[#111111] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-[#a3a3a3]/40 resize-none" rows={2} value={payment.notes} onChange={e => setPayment({...payment, notes: e.target.value})} placeholder="Anotações sobre quebras, devoluções, ou prazo" />
                  </div>
               </div>
            </div>
        )}
    </AdminPopup>
  );
}
