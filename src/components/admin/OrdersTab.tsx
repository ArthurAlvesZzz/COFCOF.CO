import React, { useState, useMemo } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { AdminEmptyState } from './AdminEmptyState';
import { 
  ShoppingCart, 
  Eye, 
  MessageCircle, 
  Copy, 
  Search, 
  Filter, 
  RefreshCcw, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  LayoutList, 
  Kanban,
  ChevronRight,
  MoreVertical,
  Circle,
  AlertTriangle,
  ArrowRight,
  Phone,
  MapPin,
  Calendar,
  Wallet,
  Activity,
  X
} from 'lucide-react';
import { OrderAdmin } from '../../types/admin';
import { OrderDetailDrawer } from './OrderDetailDrawer';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

type OrderViewMode = 'table' | 'kanban';

export function OrdersTab() {
  const { orders, loading, updateStatus, addNote, exportCSV, refresh } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderAdmin | null>(null);
  
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<OrderViewMode>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Operational Filter States
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      today: orders.filter(o => o.createdAt.startsWith(todayStr)).length,
      pendingPayment: orders.filter(o => o.payment.status === 'pending').length,
      toPrepare: orders.filter(o => o.payment.status === 'approved' && (o.status === 'paid' || o.status === 'awaiting_payment')).length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready_for_pickup' || o.status === 'shipped').length,
      late: orders.filter(o => {
        const created = new Date(o.createdAt).getTime();
        const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
        return created < twoDaysAgo && o.status !== 'completed' && o.status !== 'canceled';
      }).length,
      failed: orders.filter(o => o.status === 'failed' || o.payment.status === 'rejected').length,
      revenue: orders.filter(o => o.payment.status === 'approved').reduce((acc, o) => acc + o.total, 0)
    };
  }, [orders]);

  const getNextAction = (order: OrderAdmin) => {
    if (order.status === 'canceled') return 'Sem ação (Cancelado)';
    if (order.status === 'completed') return 'Sem ação (Concluído)';
    if (order.payment.status === 'pending') return 'Cobrar Pagamento';
    if (order.payment.status === 'approved' && (order.status === 'paid' || order.status === 'awaiting_payment')) return 'Separar Pedido';
    if (order.status === 'preparing') return order.shipping.type === 'pickup' ? 'Marcar como Pronto' : 'Enviar Pedido';
    if (order.status === 'shipped' || order.status === 'ready_for_pickup') return 'Concluir';
    return 'Ver Detalhes';
  };

  const getOrderPriority = (order: OrderAdmin) => {
    const created = new Date(order.createdAt).getTime();
    const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
    
    if (order.payment.status === 'approved' && (order.status === 'paid' || order.status === 'awaiting_payment')) return 'high';
    if (created < twoDaysAgo && order.status !== 'completed' && order.status !== 'canceled') return 'high';
    if (order.status === 'failed' || order.payment.status === 'rejected') return 'high';
    
    if (order.status === 'preparing' || order.status === 'shipped' || order.status === 'ready_for_pickup') return 'medium';
    
    return 'low';
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = filterQuery.toLowerCase();
      const matchesQuery = 
        !q || 
        o.orderNumber?.toLowerCase().includes(q) || 
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.whatsapp?.includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.shipping?.city?.toLowerCase().includes(q) ||
        o.items?.some(i => i.name.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || o.payment.status === paymentFilter;
      const matchesOrigin = originFilter === 'all' || o.source === originFilter;

      // Special active card filters
      if (statusFilter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        return matchesQuery && o.createdAt.startsWith(todayStr);
      }
      if (statusFilter === 'pending_payment') {
        return matchesQuery && o.payment.status === 'pending';
      }
      if (statusFilter === 'to_prepare') {
        return matchesQuery && o.payment.status === 'approved' && (o.status === 'paid' || o.status === 'awaiting_payment');
      }
      if (statusFilter === 'late') {
        const created = new Date(o.createdAt).getTime();
        const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
        return matchesQuery && created < twoDaysAgo && o.status !== 'completed' && o.status !== 'canceled';
      }
      if (statusFilter === 'ready_operational') {
        return matchesQuery && (o.status === 'ready_for_pickup' || o.status === 'shipped');
      }

      return matchesQuery && matchesStatus && matchesPayment && matchesOrigin;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filterQuery, statusFilter, paymentFilter, originFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awaiting_payment': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'paid': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'preparing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'ready_for_pickup': return 'bg-green-50 text-green-600 border-green-100';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'canceled': case 'failed': return 'bg-red-50 text-red-600 border-red-100';
      case 'refunded': return 'bg-gray-50 text-gray-400 border-gray-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'awaiting_payment': return 'Aguardando Pagamento';
      case 'paid': return 'Pago';
      case 'preparing': return 'Em Preparo';
      case 'ready_for_pickup': return 'Pronto (Loja)';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'completed': return 'Concluído';
      case 'canceled': return 'Cancelado';
      case 'failed': return 'Falhou';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  };

  const copyOrderSummary = (o: OrderAdmin) => {
    const summary = `📦 Pedido ${o.orderNumber}
Cliente: ${o.customer.name}
WhatsApp: ${o.customer.whatsapp}

Itens:
${o.items.map(i => `- ${i.quantity}x ${i.name} (${i.format})`).join('\n')}

Total: R$ ${o.total.toFixed(2)}
Pagamento: ${o.payment.status === 'approved' ? '✅ Aprovado' : '⏳ Pendente'}
Entrega: ${o.shipping.type === 'pickup' ? '🏪 Retirada' : '🚚 ' + o.shipping.street + ', ' + o.shipping.number}`;
    
    navigator.clipboard.writeText(summary);
    toast.success('Resumo copiado para o WhatsApp!');
  };

  const operationalAlerts = useMemo(() => {
    const alerts = [];
    const highPriorityCount = orders.filter(o => o.payment.status === 'approved' && (o.status === 'paid' || o.status === 'awaiting_payment')).length;
    if (highPriorityCount > 0) {
      alerts.push({
        id: 'high-priority',
        type: 'warning',
        message: `${highPriorityCount} pedidos pagos aguardam separação.`,
        action: () => setStatusFilter('to_prepare')
      });
    }
    const pendingPaymentCount = orders.filter(o => o.payment.status === 'pending').length;
    if (pendingPaymentCount > 5) {
      alerts.push({
        id: 'pending-payment',
        type: 'info',
        message: `${pendingPaymentCount} pedidos aguardando pagamento.`,
        action: () => setStatusFilter('pending_payment')
      });
    }
    return alerts;
  }, [orders]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-[#B06A32]/20 border-t-[#B06A32] rounded-full animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse uppercase tracking-widest text-xs">Sincronizando Central de Pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Pedidos" 
        subtitle="Gerencie pagamentos, preparo, envio, retirada e relacionamento.">
         <button onClick={refresh} className="p-2.5 text-gray-400 hover:text-[#B06A32] bg-white border border-gray-100 rounded-xl transition-all shadow-sm hover:shadow-md">
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
         </button>
         <button onClick={exportCSV} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 hover:border-[#1C1A17] text-[#1C1A17] font-bold rounded-xl transition-all text-sm shadow-sm group">
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            Exportar CSV
         </button>
         <button onClick={() => toast.error("Criação manual em breve")} className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1A17] hover:bg-[#B06A32] text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-[#1C1A17]/10 active:scale-95">
            <ShoppingCart size={16} />
            Novo Pedido
         </button>
      </AdminPageHeader>

      {/* Interactive Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <AdminStatCard 
          title="Novos Hoje" 
          value={stats.today} 
          isActive={statusFilter === 'today'}
          onClick={() => setStatusFilter(statusFilter === 'today' ? 'all' : 'today')}
          icon={Clock}
          microcopy="Criados nas últimas 24h"
        />
        <AdminStatCard 
          title="Aguardando Pagto" 
          value={stats.pendingPayment} 
          alert={stats.pendingPayment > 0}
          isActive={statusFilter === 'pending_payment'}
          onClick={() => setStatusFilter(statusFilter === 'pending_payment' ? 'all' : 'pending_payment')}
          icon={Wallet}
          microcopy="Reservando estoque"
        />
        <AdminStatCard 
          title="Para Preparar" 
          value={stats.toPrepare} 
          highlight={stats.toPrepare > 0}
          isActive={statusFilter === 'to_prepare'}
          onClick={() => setStatusFilter(statusFilter === 'to_prepare' ? 'all' : 'to_prepare')}
          icon={Package}
          microcopy="Pagamento aprovado"
        />
        <AdminStatCard 
          title="Prontos" 
          value={stats.ready} 
          isActive={statusFilter === 'ready_operational'}
          onClick={() => setStatusFilter(statusFilter === 'ready_operational' ? 'all' : 'ready_operational')}
          icon={Truck}
          microcopy="Aguardando despacho"
        />
        <AdminStatCard 
          title="Atrasados" 
          value={stats.late} 
          alert={stats.late > 0}
          isActive={statusFilter === 'late'}
          onClick={() => setStatusFilter(statusFilter === 'late' ? 'all' : 'late')}
          icon={AlertTriangle}
          microcopy="Ação urgente"
        />
         <AdminStatCard 
          title="Falha Pagto" 
          value={stats.failed} 
          alert={stats.failed > 0}
          isActive={statusFilter === 'failed'}
          onClick={() => setStatusFilter(statusFilter === 'failed' ? 'all' : 'failed')}
          icon={AlertCircle}
          microcopy="Tentar recuperar"
        />
        <AdminStatCard 
          title="Faturamento" 
          value={`R$ ${stats.revenue.toLocaleString()}`} 
          unit="aprovado"
          icon={ArrowRight}
        />
      </div>

      {/* Next Actions Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-[#F6F1EB] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#B06A32]">
              <Activity size={14} /> Próximas Ações Operacionais
           </div>
           <div className="h-px flex-1 bg-gray-100" />
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => setStatusFilter('pending_payment')}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 hover:border-amber-200 hover:bg-amber-50 rounded-xl text-xs font-bold text-gray-600 hover:text-amber-700 transition-all shadow-sm"
           >
              <Phone size={14} className="text-amber-500" /> Cobrar Pendentes
           </button>
           <button 
             onClick={() => setStatusFilter('to_prepare')}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 hover:border-[#B06A32] hover:bg-[#F6F1EB] rounded-xl text-xs font-bold text-gray-600 hover:text-[#B06A32] transition-all shadow-sm"
           >
              <Package size={14} className="text-[#B06A32]" /> Preparar Pagos
           </button>
           <button 
             onClick={() => setStatusFilter('late')}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 hover:border-red-200 hover:bg-red-50 rounded-xl text-xs font-bold text-gray-600 hover:text-red-700 transition-all shadow-sm"
           >
              <AlertTriangle size={14} className="text-red-500" /> Resolver Atrasados
           </button>
           {statusFilter !== 'all' && (
             <button 
               onClick={() => {
                 setStatusFilter('all');
                 setPaymentFilter('all');
                 setOriginFilter('all');
                 setFilterQuery('');
               }}
               className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-600 transition-all"
             >
                Limpar Todos os Filtros
             </button>
           )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B06A32] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar pedido, cliente, WhatsApp, produto, cidade ou valor..."
              className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border-transparent focus:border-[#F6F1EB] rounded-2xl text-sm transition-all outline-none"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            {filterQuery && (
              <button 
                onClick={() => setFilterQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl shrink-0 w-full md:w-auto">
            <button 
              onClick={() => setViewMode('table')}
              className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-white text-[#1C1A17] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutList size={16} /> <span className="hidden sm:inline">Tabela</span>
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'kanban' ? 'bg-white text-[#1C1A17] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Kanban size={16} /> <span className="hidden sm:inline">Fila</span>
            </button>
          </div>

          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-3.5 rounded-2xl border transition-all ${showAdvancedFilters ? 'bg-[#1C1A17] border-[#1C1A17] text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto p-2 no-scrollbar border-t border-gray-50 mt-1">
          {['all', 'awaiting_payment', 'paid', 'preparing', 'shipped', 'completed', 'canceled'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                statusFilter === status 
                  ? 'bg-[#F6F1EB] text-[#1C1A17] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {status === 'all' ? 'Todos' : getStatusLabel(status)}
            </button>
          ))}
          {statusFilter !== 'all' && (
            <button onClick={() => setStatusFilter('all')} className="text-xs font-bold text-red-500 ml-2 hover:underline">Limpar</button>
          )}
        </div>

        {/* Advanced Filters Drawer */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status Financeiro</label>
                  <select 
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B06A32]/20 outline-none"
                  >
                    <option value="all">Todos Pagamentos</option>
                    <option value="pending">Pendentes</option>
                    <option value="approved">Aprovados</option>
                    <option value="failed">Falhas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Origem de Venda</label>
                  <select 
                    value={originFilter}
                    onChange={(e) => setOriginFilter(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B06A32]/20 outline-none"
                  >
                    <option value="all">Todas Origens</option>
                    <option value="site">Site Ecommerce</option>
                    <option value="b2b">B2B / Corporativo</option>
                    <option value="admin">Venda Manual</option>
                  </select>
                </div>
                <div className="flex items-end">
                   <button 
                     onClick={() => {
                        setPaymentFilter('all');
                        setOriginFilter('all');
                        setStatusFilter('all');
                        setShowAdvancedFilters(false);
                     }}
                     className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
                   >
                     Limpar Todos Filtros
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orders View */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-6">
              <ShoppingCart size={40} />
           </div>
           <h3 className="text-xl font-black text-[#1C1A17] mb-2">
              {orders.length === 0 ? 'Nenhum pedido ainda' : 'Nenhum pedido encontrado'}
           </h3>
           <p className="text-sm text-gray-400 max-w-sm mb-8">
              {orders.length === 0 
                ? 'Os pedidos criados no checkout aparecerão aqui automaticamente.' 
                : 'Tente limpar os filtros ou buscar por cliente, número do pedido, WhatsApp ou produto.'}
           </p>
           <button 
             onClick={() => {
                setFilterQuery('');
                setStatusFilter('all');
                setPaymentFilter('all');
                setOriginFilter('all');
             }} 
             className="px-8 py-3 bg-[#1C1A17] text-white font-bold rounded-xl text-sm hover:bg-[#B06A32] transition-all shadow-lg active:scale-95"
           >
              Ver todos os pedidos
           </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-visible">
           <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#FDFCFB] border-b border-gray-50">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pedido & Origem</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Cliente</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Items</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Total</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Próxima Ação</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map(o => {
                    const nextAction = getNextAction(o);
                    const priority = getOrderPriority(o);

                    return (
                    <tr 
                      key={o.id} 
                      className={`hover:bg-gray-50/80 transition-colors group cursor-pointer relative ${
                        priority === 'high' ? 'border-l-4 border-l-red-500' : 
                        priority === 'medium' ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-transparent'
                      }`}
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${
                             o.source === 'site' ? 'bg-amber-100 text-[#B06A32]' : 'bg-indigo-100 text-indigo-700'
                           }`}>
                             {o.source === 'site' ? 'ECOM' : 'MANU'}
                           </div>
                           <div>
                              <div className="font-black text-[#1C1A17]">{o.orderNumber}</div>
                              <div className="text-[10px] text-gray-400 font-bold uppercase">{new Date(o.createdAt).toLocaleDateString()}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#1C1A17] hover:text-[#B06A32] transition-colors">{o.customer.name}</div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                           <Phone size={10} className="text-green-500" /> {o.customer.whatsapp || 's/ número'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500">
                             {o.items.reduce((acc, i) => acc + i.quantity, 0)} items
                           </span>
                           <div className="flex -space-x-2">
                              {o.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black overflow-hidden shadow-sm">
                                  {item.name[0]}
                                </div>
                              ))}
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-black text-[#1C1A17]">R$ {o.total.toFixed(2)}</div>
                        <div className={`text-[9px] font-black uppercase tracking-wider ${o.payment.status === 'approved' ? 'text-green-600' : 'text-amber-600'}`}>
                           {o.payment.status === 'approved' ? 'Pago' : 'Pendente'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                           nextAction.includes('Cobrar') ? 'bg-amber-50 text-amber-700' :
                           nextAction.includes('Separar') ? 'bg-blue-50 text-blue-700' :
                           nextAction.includes('Enviar') || nextAction.includes('Pronto') ? 'bg-indigo-50 text-indigo-700' :
                           nextAction.includes('Concluir') ? 'bg-emerald-50 text-emerald-700' :
                           'bg-gray-50 text-gray-500'
                         }`}>
                           {nextAction}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current opacity-80 ${getStatusColor(o.status)}`}>
                           {getStatusLabel(o.status)}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={(e) => { e.stopPropagation(); copyOrderSummary(o); }}
                             className="p-2 text-gray-400 hover:text-[#B06A32] hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all"
                             title="Copiar Resumo"
                           >
                             <Copy size={16} />
                           </button>
                           {o.customer.whatsapp && (
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 const wa = o.customer.whatsapp?.replace(/\D/g, '');
                                 if (wa) window.open(`https://wa.me/55${wa}`, '_blank');
                               }}
                               className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all"
                               title="WhatsApp"
                             >
                               <MessageCircle size={16} />
                             </button>
                           )}
                           <button 
                             className="p-2 text-gray-400 hover:text-[#1C1A17] hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all font-bold text-xs"
                             onClick={() => setSelectedOrder(o)}
                           >
                             Abrir
                           </button>
                        </div>
                      </td>
                    </tr>
                   );
                  })}
                </tbody>
              </table>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
           {/* Kanban Fila Status Columns */}
           {['awaiting_payment', 'paid', 'preparing', 'shipped', 'completed'].map(status => {
             const statusOrders = orders.filter(o => o.status === status);
             return (
               <div key={status} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{getStatusLabel(status)}</h3>
                     <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-[10px] font-black text-gray-400">{statusOrders.length}</span>
                  </div>
                  <div className="space-y-4 min-h-[500px] border-2 border-dashed border-gray-50 rounded-[2.5rem] p-2 bg-gray-50/20">
                     {statusOrders.map(o => (
                       <motion.div 
                         layout
                         key={o.id}
                         onClick={() => setSelectedOrder(o)}
                         className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                       >
                          <div className="flex justify-between items-start mb-3">
                             <span className="text-[10px] font-black text-[#1C1A17]">{o.orderNumber}</span>
                             <div className={`w-2 h-2 rounded-full ${o.payment.status === 'approved' ? 'bg-green-500' : 'bg-amber-400'}`} />
                          </div>
                          <p className="text-xs font-bold text-[#1C1A17] truncate mb-1">{o.customer.name}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mb-3">{o.items.length} itens • R$ {o.total.toFixed(2)}</p>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                             <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-[#B06A32]">
                                <Activity size={10} /> {getNextAction(o)}
                             </div>
                             <div className="flex -space-x-1.5">
                                {o.items.slice(0, 2).map((item, id) => (
                                   <div key={id} className="w-5 h-5 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[6px] font-black">
                                      {item.name[0]}
                                   </div>
                                ))}
                             </div>
                          </div>
                       </motion.div>
                     ))}
                  </div>
               </div>
             );
           })}
        </div>
      )}

      <OrderDetailDrawer 
        isOpen={selectedOrder !== null}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateStatus}
        onAddNote={addNote}
      />
    </div>
  );
}
