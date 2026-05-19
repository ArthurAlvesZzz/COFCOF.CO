import React, { useState } from 'react';
import { useStock } from '../../hooks/useStock';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { Search, Filter, Download, Plus, Scale, AlertTriangle, Layers, Gift } from 'lucide-react';
import { StockItem, StockMovement } from '../../types/admin';
import { AdminPopup } from './ui/AdminPopup';

export function StockTab() {
  const { items, stats, loading, adjustStock, registerCourtesy, getMovements } = useStock();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'raw' | 'roasted' | 'finished' | 'consigned' | 'movements' | 'adjustments'>('overview');

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isCourtesyModalOpen, setIsCourtesyModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando estoque...</div>;

  const lowStockAlerts = items.filter(i => i.status === 'low' || i.status === 'empty');

  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (item.productName || '').toLowerCase().includes(term) ||
        (item.rawLotName || '').toLowerCase().includes(term)
      );
    }
    return true;
  }).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());

  const rawItems = filteredItems.filter(i => i.type === 'raw');
  const roastedItems = filteredItems.filter(i => i.type === 'roasted');
  const finishedItems = filteredItems.filter(i => i.type === 'finished');

  const handleAdjustClick = (item: StockItem) => {
    setSelectedStockItem(item);
    setIsAdjustModalOpen(true);
  };

  const handleCourtesyClick = (item: StockItem) => {
    setSelectedStockItem(item);
    setIsCourtesyModalOpen(true);
  };

  return (
    <div className="pb-24">
       <AdminPageHeader
          title="Estoque"
          subtitle="Controle café cru, café torrado, produto acabado, consignações, cortesias e movimentações da operação CofCof."
          action={{
            label: "Ajustar Estoque",
            onClick: () => setIsAdjustModalOpen(true)
          }}
       />

       {lowStockAlerts.length > 0 && (
         <div className="mb-6 space-y-2">
            {lowStockAlerts.map(item => (
              <div key={item.id} className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm font-medium flex items-center gap-2">
                 <AlertTriangle size={16} /> Alerta: O item "{item.productName || item.rawLotName}" está com estoque {item.status === 'empty' ? 'zerado' : 'baixo'} ({item.availableKg || item.availableUnits || 0} disponível).
              </div>
            ))}
         </div>
       )}

       {items.length === 0 ? (
         <div className="bg-white border text-center p-12 rounded-2xl shadow-sm my-6">
            <Layers size={48} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-serif text-[#1C1A17] mb-2">Nenhum estoque registrado ainda</h3>
            <p className="text-gray-500 mb-8">
              O estoque será alimentado por lotes, torras, empacotamentos, vendas, consignações e ajustes.
            </p>
         </div>
       ) : (
         <>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <AdminStatCard title="Café Cru (kg)" value={stats?.rawTotalKg} />
             <AdminStatCard title="Torrado (kg)" value={stats?.roastedTotalKg} />
             <AdminStatCard title="Produto Acabado (un)" value={stats?.finishedTotalUnits} />
             <AdminStatCard title="Itens Baixo Estoque" value={stats?.lowStockCount} alert={stats?.lowStockCount > 0} />
           </div>

           {/* Tabs */}
           <div className="flex overflow-x-auto border-b border-gray-200 mb-6 custom-scrollbar">
              {[
                { id: 'overview', label: 'Visão Geral' },
                { id: 'raw', label: 'Café Cru' },
                { id: 'roasted', label: 'Café Torrado' },
                { id: 'finished', label: 'Produto Acabado' },
                { id: 'movements', label: 'Histórico de Mov.' },
              ].map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id ? 'border-[#B06A32] text-[#1C1A17]' : 'border-transparent text-gray-500 hover:text-[#1C1A17]'
                   }`}
                >
                   {tab.label}
                </button>
              ))}
           </div>

           <div className="bg-white border text-sm max-w-full overflow-x-auto border-gray-100 rounded-2xl shadow-sm mb-6">
              {(activeTab === 'overview' || activeTab === 'finished') && (
                 <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                    <thead className="bg-[#F6F1EB] border-b border-gray-200">
                       <tr>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Produto Acabado</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Formato</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Disponível</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Consignado</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Reservado</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Vendido</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Ações</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {finishedItems.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-[#1C1A17]">{item.productName}</td>
                             <td className="px-6 py-4">{item.format || 'N/A'}</td>
                             <td className={`px-6 py-4 font-bold ${item.status === 'empty' ? 'text-red-600' : item.status === 'low' ? 'text-amber-500' : 'text-green-600'}`}>{item.availableUnits || 0} un</td>
                             <td className="px-6 py-4 text-blue-600">{item.consignedUnits || 0} un</td>
                             <td className="px-6 py-4 text-amber-600">{item.reservedUnits || 0} un</td>
                             <td className="px-6 py-4 text-gray-600">{item.soldUnits || 0} un</td>
                             <td className="px-6 py-4 flex gap-2">
                                <button onClick={() => handleAdjustClick(item)} className="text-[#B06A32] font-bold text-xs hover:underline uppercase">Ajustar</button>
                                <button onClick={() => handleCourtesyClick(item)} className="text-[#B06A32] font-bold text-xs hover:underline uppercase">Cortesia</button>
                             </td>
                          </tr>
                       ))}
                       {finishedItems.length === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Nenhum produto acabado</td></tr>}
                    </tbody>
                 </table>
              )}

              {activeTab === 'raw' && (
                 <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                    <thead className="bg-[#F6F1EB] border-b border-gray-200">
                       <tr>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Lote Cru</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Disponível (kg)</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {rawItems.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-[#1C1A17]">{item.rawLotName}</td>
                             <td className={`px-6 py-4 font-bold ${item.status === 'empty' ? 'text-red-600' : item.status === 'low' ? 'text-amber-500' : 'text-green-600'}`}>{item.availableKg || 0} kg</td>
                             <td className="px-6 py-4 uppercase text-xs font-bold">{item.status}</td>
                          </tr>
                       ))}
                       {rawItems.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Nenhum café cru no estoque unificado</td></tr>}
                    </tbody>
                 </table>
              )}

              {activeTab === 'roasted' && (
                 <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                    <thead className="bg-[#F6F1EB] border-b border-gray-200">
                       <tr>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Lote Torrado</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Disponível (kg)</th>
                          <th className="px-6 py-4 font-medium text-[#2A160E]">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {roastedItems.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-[#1C1A17]">Torra {item.roastBatchId || item.id}</td>
                             <td className={`px-6 py-4 font-bold ${item.status === 'empty' ? 'text-red-600' : 'text-green-600'}`}>{item.availableKg || 0} kg</td>
                             <td className="px-6 py-4 uppercase text-xs font-bold">{item.status}</td>
                          </tr>
                       ))}
                       {roastedItems.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Nenhum café torrado a granel</td></tr>}
                    </tbody>
                 </table>
              )}

              {activeTab === 'movements' && (
                 <StockMovementsList getMovements={getMovements} />
              )}
           </div>
         </>
       )}

       {/* Modals here */}
       <AdminPopup
         isOpen={isAdjustModalOpen}
         onClose={() => setIsAdjustModalOpen(false)}
         title={
           <div>
              <h3 className="font-serif text-2xl text-red-600">Ajuste Manual de Estoque</h3>
              <p className="text-sm text-gray-500 mt-1">Atenção: Use apenas para correções e inventário.</p>
           </div>
         }
         size="md"
         footer={
           <button type="submit" form="adjust-stock-form" className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl shadow-md">Confirmar Ajuste</button>
         }
       >
          <form id="adjust-stock-form" onSubmit={async (e) => {
             e.preventDefault();
             const form = e.target as HTMLFormElement;
             const itemId = form.itemId.value;
             const qty = Number(form.quantity.value);
             const type = form.type.value;
             const reason = form.reason.value;
             const item = items.find(i => i.id === itemId);
             if(!item) return;

             if(item.type === 'finished') {
                await adjustStock({ stockItemId: itemId, quantityUnits: qty, adjustmentType: type, reason });
             } else {
                await adjustStock({ stockItemId: itemId, quantityKg: qty, adjustmentType: type, reason });
             }
             
             setIsAdjustModalOpen(false);
          }} className="space-y-4 py-2">
             <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Item *</label>
                <select name="itemId" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl outline-none focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] transition-colors" required defaultValue={selectedStockItem?.id || ''}>
                   <option value="">Selecione...</option>
                   {items.map(i => <option key={i.id} value={i.id}>{i.productName || i.rawLotName || `Item ${i.id}`} ({i.type === 'finished' ? 'un' : 'kg'})</option>)}
                </select>
             </div>
             <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Tipo de Ajuste *</label>
                <select name="type" className="w-full px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl outline-none focus:bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-800 transition-colors" required>
                   <option value="remove">Saída / Perda / Baixa (-)</option>
                   <option value="add">Entrada / Sobra (+)</option>
                </select>
             </div>
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Quantidade (Absoluta) *</label><input name="quantity" type="number" step="0.01" min="0.01" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl outline-none focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] transition-colors" required /></div>
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Justificativa *</label><input name="reason" type="text" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl outline-none focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] transition-colors" required placeholder="Motivo obrigatório" /></div>
          </form>
       </AdminPopup>

       <AdminPopup
         isOpen={isCourtesyModalOpen}
         onClose={() => setIsCourtesyModalOpen(false)}
         title={
           <div>
              <h3 className="font-serif text-2xl text-[#1C1A17]">Registrar Cortesia</h3>
              <p className="text-sm text-gray-500 mt-1">Envio de produtos como cortesia ou amostra grátis.</p>
           </div>
         }
         size="md"
         footer={
           <button type="submit" form="courtesy-form" className="px-6 py-2 bg-[#1C1A17] hover:bg-[#2A160E] text-white font-bold rounded-xl shadow-md transition-colors">Confirmar Cortesia</button>
         }
       >
          <form id="courtesy-form" onSubmit={async (e) => {
             e.preventDefault();
             const form = e.target as HTMLFormElement;
             const itemId = form.itemId.value;
             const qty = Number(form.quantity.value);
             const recipient = form.recipient.value;
             const reason = form.reason.value;
             const item = items.find(i => i.id === itemId);
             if(!item) return;

             if(item.type === 'finished') {
                await registerCourtesy({ stockItemId: itemId, quantityUnits: qty, recipient, reason });
             } else {
                await registerCourtesy({ stockItemId: itemId, quantityKg: qty, recipient, reason });
             }
             
             setIsCourtesyModalOpen(false);
          }} className="space-y-4 py-2 text-left">
             <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Item Acabado *</label>
                <select name="itemId" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl outline-none focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] transition-colors" required defaultValue={selectedStockItem?.id || ''}>
                   <option value="">Selecione...</option>
                   {finishedItems.map(i => <option key={i.id} value={i.id}>{i.productName} (Avail: {i.availableUnits})</option>)}
                </select>
             </div>
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Quantidade (un) *</label><input name="quantity" type="number" step="1" min="1" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl outline-none focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] transition-colors" required /></div>
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Destinatário *</label><input name="recipient" type="text" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl outline-none focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] transition-colors" required placeholder="Nome do influenciador, evento, etc" /></div>
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Motivo</label><input name="reason" type="text" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl outline-none focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] transition-colors" required /></div>
          </form>
       </AdminPopup>
    </div>
  );
}

function StockMovementsList({ getMovements }: { getMovements: () => Promise<StockMovement[]> }) {
   const [moves, setMoves] = useState<StockMovement[]>([]);
   const [loading, setLoading] = useState(true);

   React.useEffect(() => {
      getMovements().then(m => { setMoves(m); setLoading(false); });
   }, [getMovements]);

   if (loading) return <div className="p-8 text-center">Carregando movimentações...</div>;

   return (
      <table className="w-full text-left whitespace-nowrap min-w-[800px]">
         <thead className="bg-[#F6F1EB] border-b border-gray-200">
            <tr>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Data</th>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Tipo</th>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Qtd</th>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Usuário</th>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Motivo / Obs</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-gray-100">
            {moves.map(m => (
               <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs">{new Date(m.createdAt!).toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 font-bold text-[#1C1A17] uppercase text-xs">
                     <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">{m.type.replace(/_/g, ' ')}</span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${Number(m.quantityKg || m.quantityUnits) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {Number(m.quantityKg || m.quantityUnits) > 0 ? '+' : ''}{m.quantityKg || m.quantityUnits}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{m.userName || 'Sistema'}</td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]" title={m.reason}>{m.reason || '-'}</td>
               </tr>
            ))}
            {moves.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhuma movimentação</td></tr>}
         </tbody>
      </table>
   )
}
