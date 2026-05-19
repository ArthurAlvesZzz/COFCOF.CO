import React, { useState } from 'react';
import { useCoupons } from '../../hooks/useCoupons';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { Tag, Receipt, TrendingUp, HandCoins, Copy, Play, Loader2, Download } from 'lucide-react';
import { Coupon } from '../../types/admin';
import { couponService } from '../../services/couponService';
import { exportToCSV } from '../../lib/export';
import toast from 'react-hot-toast';
import { CouponFormDrawer } from './CouponFormDrawer';

export function CouponsTab() {
  const { coupons, loading, createCoupon, updateCoupon, duplicateCoupon, archiveCoupon } = useCoupons();
  const [filterCode, setFilterCode] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando cupons...</div>;

  const activeCoupons = coupons.filter(c => couponService.getCouponComputedStatus(c) === 'active');
  const scheduledCoupons = coupons.filter(c => couponService.getCouponComputedStatus(c) === 'scheduled');
  const expiredCoupons = coupons.filter(c => couponService.getCouponComputedStatus(c) === 'expired');

  const usesThisMonth = coupons.reduce((acc, c) => acc + (c.stats?.usedCount || 0), 0); // Simplified for stats
  const totalDiscount = coupons.reduce((acc, c) => acc + (c.stats?.totalDiscountGiven || 0), 0);

  const filteredCoupons = coupons.filter(c => 
    (c.code || '').toLowerCase().includes((filterCode || '').toLowerCase()) || 
    (c.name || '').toLowerCase().includes((filterCode || '').toLowerCase()) ||
    (c.campaign && c.campaign.toLowerCase().includes((filterCode || '').toLowerCase()))
  );

  const handleOpenForm = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
    } else {
      setEditingCoupon(null);
    }
    setIsFormOpen(true);
  };

  const handleSaveCoupon = async (data: Partial<Coupon>) => {
    const normalizedCode = (data.code || '').replace(/([^a-zA-Z0-9_\-])/g, '').toUpperCase();
    
    if (data.id) {
       await updateCoupon(data.id, { ...data, code: normalizedCode });
    } else {
       const existing = coupons.find(c => c.code === normalizedCode);
       if (existing) {
         throw new Error("Já existe um cupom com este código.");
       }
       await createCoupon({ ...data, code: normalizedCode });
    }
  };

  const copyCampaign = (c: Coupon) => {
    const text = `Use o cupom ${c.code} e ganhe ${c.discountType === 'percentage' ? `${c.discountValue}%` : `R$ ${c.discountValue}`} na sua compra CofCof.`;
    navigator.clipboard.writeText(text);
    toast.success('Texto da campanha copiado para a área de transferência.');
  };

  const handleExportCSV = () => {
    const headers = ['Código', 'Nome', 'Desconto', 'Usos', 'Status'];
    const rows = filteredCoupons.map(c => [
      c.code, c.name,
      c.discountType === 'percentage' ? `${c.discountValue}%` : `R$ ${c.discountValue?.toFixed(2)}`,
      c.usedCount,
      couponService.getCouponComputedStatus(c)
    ]);
    exportToCSV('cupons_cofcof.csv', headers, rows);
    toast.success('Cupons exportados!');
  };

  return (
    <div className="pb-24">
       <AdminPageHeader
          title="Cupons"
          subtitle="Crie e gerencie descontos, campanhas, regras de uso e resultados."
          action={{
            label: "Novo Cupom",
            onClick: () => handleOpenForm()
          }}
       >
         <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-[#1C1A17] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Download size={16} /> Exportar CSV
         </button>
       </AdminPageHeader>

       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <AdminStatCard title="Cupons Ativos" value={activeCoupons.length} />
         <AdminStatCard title="Usos Retrospectivos" value={usesThisMonth} />
         <AdminStatCard title="Desconto Total" value={totalDiscount} unit="R$" highlight={true} />
         <AdminStatCard title="Expirados" value={expiredCoupons.length} alert={expiredCoupons.length > 0} />
       </div>

       <div className="mb-6 flex gap-4">
         <input 
           type="text"
           placeholder="Buscar por código ou campanha..."
           className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-[#C89B5A]"
           value={filterCode}
           onChange={(e) => setFilterCode(e.target.value)}
         />
       </div>

       <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead className="bg-[#F6F1EB] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Código</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Desconto</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Validade</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E] text-center">Usos</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Status</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoupons.map(c => {
                  const status = couponService.getCouponComputedStatus(c);
                  return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                       <span className="font-mono font-bold text-[#1C1A17] bg-gray-100 px-2 py-1 rounded">{c.code}</span>
                       <div className="text-xs text-gray-500 mt-1">{c.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#B06A32]">
                        {c.discountType === 'percentage' && `${c.discountValue}%`}
                        {c.discountType === 'fixed_amount' && `R$ ${c.discountValue?.toFixed(2)}`}
                        {c.discountType === 'first_order' && `${c.discountValue}% (1ª Compra)`}
                        {c.discountType === 'free_shipping' && 'Frete Grátis'}
                      </div>
                      {c.appliesTo !== 'all' && <div className="text-[10px] uppercase text-gray-500 mt-1">{c.appliesTo.replace('_', ' ')}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'Imediato'} 
                      {c.endDate ? ` até ${new Date(c.endDate).toLocaleDateString()}` : ' (Sem fim)'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-medium">{c.usedCount}</span>
                      {c.maxUses ? <span className="text-gray-400"> / {c.maxUses}</span> : <span className="text-gray-400"> / ∞</span>}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                         status === 'active' ? 'bg-green-100 text-green-800' :
                         status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                         status === 'exhausted' ? 'bg-orange-100 text-orange-800' :
                         status === 'expired' ? 'bg-red-100 text-red-800' :
                         'bg-gray-100 text-gray-600'
                       }`}>
                         {status === 'active' ? 'Ativo' : status === 'scheduled' ? 'Agendado' : status === 'exhausted' ? 'Esgotado' : status === 'expired' ? 'Expirado' : 'Inativo'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-3 items-center">
                          <button onClick={() => updateCoupon(c.id, { active: !c.active })} className="text-gray-500 hover:text-black" title="Ativar/Desativar">
                            <Play size={16} className={c.active ? 'opacity-50' : 'opacity-100'} />
                          </button>
                          <button onClick={() => copyCampaign(c)} className="text-gray-500 hover:text-[#B06A32]" title="Copiar Campanha">
                            <Copy size={16}/>
                          </button>
                          <button onClick={() => handleOpenForm(c)} className="text-[#B06A32] font-bold text-xs hover:underline">
                            Editar
                          </button>
                       </div>
                    </td>
                  </tr>
                )})}
                {filteredCoupons.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhum cupom encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
       </div>

       <CouponFormDrawer 
         isOpen={isFormOpen}
         onClose={() => setIsFormOpen(false)}
         onSave={handleSaveCoupon}
         coupon={editingCoupon}
       />
    </div>
  );
}
