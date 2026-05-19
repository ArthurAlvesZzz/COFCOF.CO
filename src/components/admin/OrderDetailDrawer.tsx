import React, { useState, useMemo } from 'react';
import { OrderAdmin } from '../../types/admin';
import { 
  ExternalLink, 
  MessageCircle, 
  MapPin, 
  Package, 
  CreditCard, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Send, 
  Archive,
  Copy,
  Truck,
  User,
  Hash,
  Wallet,
  Calendar,
  MoreVertical,
  Check,
  X,
  Printer,
  ChevronRight,
  Info,
  Terminal,
  Activity,
  Phone,
  ShoppingCart
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminConfirmDialog } from './ui/AdminConfirmDialog';
import { AdminPopup } from './ui/AdminPopup';
import { motion, AnimatePresence } from 'motion/react';

interface OrderDetailDrawerProps {
  order: OrderAdmin | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderAdmin['status'], note?: string) => void;
  onAddNote: (id: string, text: string) => void;
}

const ORDER_STAGES: { key: OrderAdmin['status']; label: string; icon: any }[] = [
  { key: 'awaiting_payment', label: 'Recebido', icon: Clock },
  { key: 'paid', label: 'Pago', icon: Wallet },
  { key: 'preparing', label: 'Em Preparo', icon: Package },
  { key: 'shipped', label: 'Enviado', icon: Truck },
  { key: 'delivered', label: 'Entregue', icon: CheckCircle },
  { key: 'completed', label: 'Concluído', icon: Archive },
];

export function OrderDetailDrawer({ order, isOpen, onClose, onUpdateStatus, onAddNote }: OrderDetailDrawerProps) {
  const [noteText, setNoteText] = useState('');
  const [statusToChange, setStatusToChange] = useState<OrderAdmin['status'] | null>(null);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [viewMode, setViewMode] = useState<'operational' | 'technical'>('operational');

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
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'awaiting_payment': return 'Aguardando Pagamento';
      case 'paid': return 'Pago';
      case 'preparing': return 'Em Preparo';
      case 'ready_for_pickup': return 'Pronto para Retirada';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'completed': return 'Concluído';
      case 'canceled': return 'Cancelado';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const currentStageIndex = useMemo(() => {
    if (!order) return -1;
    if (order.status === 'canceled' || order.status === 'failed') return -2;
    const stages = ORDER_STAGES.map(s => s.key);
    const idx = stages.indexOf(order.status);
    if (idx === -1 && order.status === 'ready_for_pickup') return 2; // Treat as preparing/ready
    return idx;
  }, [order]);

  const copySummary = () => {
    if (!order) return;
    const summary = `📦 Pedido ${order.orderNumber}
Cliente: ${order.customer.name}
Total: R$ ${order.total.toFixed(2)}

Items:
${order.items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}

Status: ${getStatusLabel(order.status)}`;
    navigator.clipboard.writeText(summary);
    toast.success('Resumo operacional copiado!');
  };

  const openWhatsApp = (type: 'confirm' | 'pending' | 'shipping' | 'ready') => {
    if (!order?.customer.whatsapp) return;
    let text = "";
    const wa = order.customer.whatsapp.replace(/\D/g, '');
    
    switch (type) {
      case 'confirm': text = `Olá, ${order.customer.name}! Seu pedido CofCof ${order.orderNumber} foi recebido. Assim que o pagamento for aprovado seguimos com o preparo.`; break;
      case 'pending': text = `Olá! Tudo bem? Passando para avisar que seu pedido CofCof ${order.orderNumber} está aguardando pagamento.`; break;
      case 'shipping': text = `Oba! Seu pedido CofCof ${order.orderNumber} saiu para entrega!`; break;
      case 'ready': text = `Olá! Seu pedido CofCof ${order.orderNumber} já está pronto para retirada.`; break;
    }
    
    window.open(`https://wa.me/55${wa}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getNextAction = (order: OrderAdmin) => {
    if (order.status === 'canceled') return { label: 'Reabrir Pedido', action: () => onUpdateStatus(order.id, 'awaiting_payment'), color: 'bg-gray-600', icon: Activity };
    if (order.status === 'completed') return { label: 'Arquivar Histórico', action: onClose, color: 'bg-emerald-600', icon: Archive };
    
    if (order.payment.status === 'pending') return { label: 'Cobrar Pagamento', action: () => openWhatsApp('pending'), color: 'bg-amber-600', icon: Phone };
    
    if (order.payment.status === 'approved') {
       if (order.status === 'paid' || order.status === 'awaiting_payment') return { label: 'Iniciar Preparo', action: () => onUpdateStatus(order.id, 'preparing'), color: 'bg-[#B06A32]', icon: Package };
       if (order.status === 'preparing') return { label: order.shipping.type === 'pickup' ? 'Marcar como Pronto' : 'Informar Envio', action: () => onUpdateStatus(order.id, order.shipping.type === 'pickup' ? 'ready_for_pickup' : 'shipped'), color: 'bg-indigo-600', icon: Truck };
       if (order.status === 'shipped' || order.status === 'ready_for_pickup') return { label: 'Concluir Pedido', action: () => onUpdateStatus(order.id, 'completed'), color: 'bg-emerald-600', icon: CheckCircle };
    }
    
    return { label: 'Ver Detalhes', action: () => {}, color: 'bg-gray-400', icon: Info };
  };

  const copyAddress = () => {
    if (!order) return;
    const addr = `${order.shipping.street}, ${order.shipping.number} - ${order.shipping.neighborhood}, ${order.shipping.city}/${order.shipping.state}. CEP: ${order.shipping.cep}`;
    navigator.clipboard.writeText(addr);
    toast.success('Endereço copiado para entrega!');
  };

  const copySeparationList = () => {
    if (!order) return;
    const list = order.items.map(i => `${i.quantity}x ${i.name} (${i.format})`).join('\n');
    navigator.clipboard.writeText(`Lista de Separação - Pedido ${order.orderNumber}:\n${list}`);
    toast.success('Lista de separação copiada!');
  };

  if (!order) return null;

  const nextAction = getNextAction(order);

  return (
    <>
      <AdminPopup
        isOpen={isOpen}
        onClose={onClose}
        size="premium"
        title={
          <div className="flex items-center justify-between w-full pr-8">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F6F1EB] rounded-2xl flex items-center justify-center text-[#B06A32]">
                   <ShoppingCart size={24} />
                </div>
                <div>
                   <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-[#1C1A17]">{order.orderNumber}</h2>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500`}>
                        ID: {order.id.slice(-6).toUpperCase()}
                      </span>
                   </div>
                   <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                         {order.customer.name}
                      </p>
                      <div className="w-1 h-1 bg-gray-200 rounded-full" />
                      <div className="flex items-center gap-1 text-[10px] font-black text-[#B06A32] uppercase">
                         <Activity size={10} /> {getStatusLabel(order.status)}
                      </div>
                   </div>
                </div>
             </div>

             <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-right mr-3 pr-3 border-r border-gray-200">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor do Pedido</p>
                   <p className="text-lg font-black text-[#1C1A17]">R$ {order.total.toFixed(2)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Fin.</p>
                   <div className={`flex items-center justify-end gap-1.5 text-xs font-black uppercase ${order.payment.status === 'approved' ? 'text-green-600' : 'text-amber-500'}`}>
                      {order.payment.status === 'approved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {order.payment.status === 'approved' ? 'Aprovado' : 'Pendente'}
                   </div>
                </div>
             </div>
          </div>
        }
        footer={
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl">
                <button 
                  onClick={() => setViewMode('operational')}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'operational' ? 'bg-white text-[#1C1A17] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                   Cockpit
                </button>
                <button 
                  onClick={() => setViewMode('technical')}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'technical' ? 'bg-white text-[#1C1A17] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                   Timeline
                </button>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                 onClick={onClose}
                 className="px-6 py-2.5 bg-gray-100 text-gray-500 font-bold rounded-xl text-xs hover:bg-gray-200 transition-all uppercase tracking-widest"
               >
                 Sair
               </button>

               <div className="relative">
                <button 
                  onClick={() => setShowStatusSelector(!showStatusSelector)} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 font-bold text-xs hover:border-[#1C1A17] transition-all uppercase tracking-widest"
                >
                  <MoreVertical size={16} /> Fluxo
                </button>
                <AnimatePresence>
                  {showStatusSelector && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 bottom-full mb-4 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 flex flex-col gap-1 overflow-hidden"
                    >
                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Alterar Status Manual</div>
                        {ORDER_STAGES.map(s => (
                          <button 
                            key={s.key} 
                            onClick={() => { onUpdateStatus(order.id, s.key); setShowStatusSelector(false); }}
                            className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-600 transition-all text-left"
                          >
                            <div className="flex items-center gap-2">
                               <s.icon size={14} className="opacity-50" />
                               {s.label}
                            </div>
                            {order.status === s.key && <Check size={14} className="text-[#B06A32]" />}
                          </button>
                        ))}
                        <div className="h-px bg-gray-50 my-1" />
                        <button 
                          onClick={() => { setStatusToChange('canceled'); setShowStatusSelector(false); }}
                          className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-red-50 text-xs font-bold text-red-500 transition-all"
                        >
                          <div className="flex items-center gap-2">
                             <X size={14} />
                             Cancelar Pedido
                          </div>
                        </button>
                    </motion.div>
                  )}
                </AnimatePresence>
               </div>

               <button 
                 onClick={nextAction.action}
                 className={`flex items-center gap-2 px-8 py-3 ${nextAction.color} text-white font-black rounded-xl text-xs hover:opacity-90 shadow-xl transition-all uppercase tracking-[0.1em]`}
               >
                  <nextAction.icon size={18} />
                  {nextAction.label}
               </button>
            </div>
          </div>
        }
      >

        <div className="flex flex-col gap-8 pb-10">
          
          {/* Status Track */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm overflow-hidden relative">
             <div className="relative max-w-4xl mx-auto">
                {/* Connector Lines */}
                <div className="absolute top-[24px] left-[5%] right-[5%] h-0.5 bg-gray-100" />
                <div 
                   className="absolute top-[24px] left-[5%] h-0.5 bg-[#B06A32] transition-all duration-700" 
                   style={{ width: `${Math.max(0, currentStageIndex) * (90 / (ORDER_STAGES.length - 1))}%` }}
                />

                <div className="relative flex justify-between">
                   {ORDER_STAGES.map((stage, idx) => {
                     const isCompleted = idx < currentStageIndex;
                     const isCurrent = idx === currentStageIndex;
                     const Icon = stage.icon;

                     return (
                       <div key={stage.key} className="flex flex-col items-center gap-4 z-10 group cursor-pointer" onClick={() => onUpdateStatus(order.id, stage.key)}>
                          <div 
                             className={`w-12 h-12 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 ${
                               isCompleted 
                                 ? 'bg-[#B06A32] border-white shadow-lg text-white scale-110' 
                                 : isCurrent 
                                   ? 'bg-white border-[#B06A32] text-[#B06A32] shadow-xl' 
                                   : 'bg-white border-gray-100 text-gray-300'
                             } group-hover:border-[#B06A32]/30`}
                          >
                             {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                          </div>
                          <div className="text-center">
                             <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-[#1C1A17]' : 'text-gray-400'}`}>
                                {stage.label}
                             </p>
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             
             {/* Left Column: Blocks */}
             <div className="lg:col-span-8 space-y-8">
                
                 {/* 1. Operational Quick Actions Bar */}
                 <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
                       <button onClick={copySummary} className="flex items-center gap-2 px-5 py-2.5 hover:bg-gray-50 text-gray-600 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">
                          <Copy size={16} /> Resumo
                       </button>
                       <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 hover:bg-gray-50 text-gray-600 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">
                          <Printer size={16} /> Comprovante
                       </button>
                       <button onClick={copySeparationList} className="flex items-center gap-2 px-5 py-2.5 hover:bg-gray-50 text-gray-600 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">
                          <CheckCircle size={16} /> Lista Separação
                       </button>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                       <div className="px-4 py-2 bg-[#FDFCFB] rounded-xl border border-[#F6F1EB] text-[10px] font-black uppercase tracking-widest text-[#B06A32]">
                         <Activity size={14} className="inline mr-2" /> Cockpit do Pedido Ativo
                       </div>
                    </div>
                 </div>

                 {/* 2. Customer & Shipping Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm group relative overflow-hidden">
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F6F1EB]/30 rounded-full blur-3xl" />
                       <div className="relative">
                          <div className="flex items-center justify-between mb-8">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#F6F1EB] rounded-2xl flex items-center justify-center text-[#B06A32]">
                                   <User size={20} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1A17]">Dados do Cliente</h3>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="relative group/wa">
                                   <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm">
                                      <MessageCircle size={18} />
                                   </button>
                                   <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 invisible group-hover/wa:visible opacity-0 group-hover/wa:opacity-100 transition-all z-20">
                                      <p className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400">Atendimento WhatsApp</p>
                                      <button onClick={() => openWhatsApp('confirm')} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition-all">Confirmar Pedido</button>
                                      <button onClick={() => openWhatsApp('pending')} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition-all">Cobrar Pagamento</button>
                                      <button onClick={() => openWhatsApp('shipping')} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition-all">Informar Envio</button>
                                      <button onClick={() => openWhatsApp('ready')} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition-all">Informar Retirada</button>
                                   </div>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all">
                                   <Copy size={16} />
                                </button>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#B06A32] mb-1">Nome Completo</p>
                                <p className="text-base font-black text-[#1C1A17]">{order.customer.name}</p>
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <div>
                                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">WhatsApp</p>
                                   <p className="text-sm font-bold text-[#1C1A17]">{order.customer.whatsapp || 'N/A'}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Status CRM</p>
                                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-lg inline-block">Cliente VVIP</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Shipping Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm relative overflow-hidden">
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50/40 rounded-full blur-3xl" />
                       <div className="relative">
                          <div className="flex items-center justify-between mb-8">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                   <MapPin size={20} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1A17]">Entregas & Rotas</h3>
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={copyAddress} className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all" title="Copiar Endereço">
                                   <Copy size={16} />
                                </button>
                                {order.shipping.street && (
                                   <a 
                                     href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.shipping.street}, ${order.shipping.number}, ${order.shipping.city}`)}`} 
                                     target="_blank"
                                     className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                   >
                                      <ExternalLink size={16} />
                                   </a>
                                )}
                             </div>
                          </div>

                          <div className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] space-y-4">
                             {order.shipping.type === 'pickup' ? (
                               <div className="flex flex-col items-center py-4 text-center">
                                  <Archive size={32} className="text-[#B06A32] mb-3 opacity-20" />
                                  <p className="text-sm font-black text-[#1C1A17] uppercase tracking-widest">Retirada na Unidade</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sede CofCof • Belo Horizonte</p>
                               </div>
                             ) : (
                               <>
                                  <div>
                                     <p className="text-[9px] font-black uppercase tracking-widest text-[#B06A32] mb-1">Destino Final</p>
                                     <p className="text-sm font-black text-[#1C1A17] leading-tight">
                                        {order.shipping.street}, {order.shipping.number}<br/>
                                        <span className="text-xs text-gray-400 font-bold uppercase">{order.shipping.neighborhood} • {order.shipping.city}/{order.shipping.state}</span>
                                     </p>
                                  </div>
                                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                     <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">CEP Local</p>
                                        <p className="text-sm font-black text-[#1C1A17]">{order.shipping.cep}</p>
                                     </div>
                                     <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'shipped' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {order.status === 'shipped' ? 'Em Rota' : 'Aguardando Coleta'}
                                     </div>
                                  </div>
                               </>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>

                {/* 3. Items List */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                           <Package size={20} />
                         </div>
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1A17]">Itens do Pedido ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</h3>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#B06A32] bg-[#F6F1EB] px-4 py-1.5 rounded-full">Operação Grãos</span>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left whitespace-nowrap">
                         <thead className="bg-[#FDFCFB]">
                            <tr>
                               <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Produto selecionado</th>
                               <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Formato</th>
                               <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Unid.</th>
                               <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Total item</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50">
                            {order.items.map((item, idx) => (
                               <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                  <td className="px-8 py-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#F6F1EB] rounded-2xl flex items-center justify-center font-black text-xl text-[#B06A32] group-hover:scale-105 transition-transform">
                                           {item.name[0]}
                                        </div>
                                        <div>
                                           <div className="font-extrabold text-[#1C1A17]">{item.name}</div>
                                           <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ref: {item.unitPrice.toFixed(0)}C-COF-{idx}</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6 text-center">
                                     <span className="px-4 py-1.5 bg-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        {item.format}
                                     </span>
                                  </td>
                                  <td className="px-8 py-6 text-center font-black text-[#1C1A17]">
                                     {item.quantity}
                                  </td>
                                  <td className="px-8 py-6 text-right font-black text-[#1C1A17] text-lg">
                                     R$ {item.totalPrice.toFixed(2)}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>

                   {/* Finance Summary */}
                   <div className="p-10 bg-[#FDFCFB] border-t border-gray-50">
                      <div className="flex flex-col md:flex-row justify-between gap-10">
                         <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-[1.5rem] border border-gray-100">
                               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                  <Wallet size={18} />
                               </div>
                               <div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Método de Pagamento</p>
                                  <p className="text-xs font-bold text-[#1C1A17] uppercase tracking-widest">{order.payment.method || 'CARTÃO / MERCADO PAGO'}</p>
                               </div>
                            </div>
                         </div>
                         <div className="w-full md:w-80 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                               <span className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Subtotal Bruto</span>
                               <span className="font-bold text-[#1C1A17]">R$ {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                               <span className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Descontos e Cupons</span>
                               <span className="font-black text-emerald-600">- R$ {order.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                               <span className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Frete Aplicado</span>
                               <span className="font-bold text-[#1C1A17]">R$ {order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B06A32]">Valor Final</span>
                                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Pago Integralmente</span>
                               </div>
                               <span className="text-4xl font-black font-serif text-[#1C1A17]">R$ {order.total.toFixed(2)}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 4. Timeline (Technical Mode) */}
                <AnimatePresence mode="wait">
                  {viewMode === 'technical' && (
                    <motion.div 
                      key="technical-view"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-[#1C1A17] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                          <Terminal size={160} />
                       </div>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B06A32] mb-10 flex items-center gap-3">
                          <Activity size={18} /> Logs do Sistema & Linha do Tempo
                       </h3>
                       <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                          {order.timeline?.map((event) => (
                             <div key={event.id} className="relative pl-12 group">
                                <div className="absolute left-[8px] top-1.5 w-3 h-3 rounded-full border-2 border-[#1C1A17] bg-[#B06A32] group-hover:scale-125 transition-transform" />
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors">
                                   <div className="flex items-center justify-between mb-2">
                                      <p className="font-black text-sm uppercase tracking-widest">{event.label}</p>
                                      <span className="text-[9px] font-black text-[#B06A32] px-3 py-1 bg-[#B06A32]/10 rounded-full">SYSTEM EVENT</span>
                                   </div>
                                   <p className="text-xs text-white/40 mt-1 leading-relaxed font-medium">{event.description}</p>
                                   <div className="flex items-center gap-6 mt-6 text-[9px] font-black uppercase tracking-widest text-[#B06A32]/40">
                                      <div className="flex items-center gap-2">
                                         <Calendar size={12} />
                                         <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <Clock size={12} />
                                         <span>{new Date(event.createdAt).toLocaleTimeString()}</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Right Column: Sidebar Actions & Notes */}
             <div className="lg:col-span-4 space-y-8">
                
                {/* 1. Internal Notes */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm overflow-hidden flex flex-col h-full max-h-[700px]">
                   <div className="flex items-center gap-4 mb-8 shrink-0">
                      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                         <Terminal size={20} />
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1A17]">Notas do Time</h3>
                   </div>

                   <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar mb-8">
                      {order.internalNotes?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                           <div className="w-16 h-16 rounded-[2rem] border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-200 mb-6">
                              <Info size={24} />
                           </div>
                           <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Nenhuma nota registrada</p>
                           <p className="text-[10px] text-gray-200 uppercase tracking-widest mt-2">Instruções ficam salvas aqui</p>
                        </div>
                      ) : (
                        order.internalNotes?.map(note => (
                          <div key={note.id} className="p-6 bg-gray-50 border border-transparent hover:border-gray-100 rounded-[1.5rem] transition-all group">
                             <p className="text-sm font-medium text-[#1C1A17] mb-4 leading-relaxed">{note.text}</p>
                             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#B06A32] transition-colors">
                                <div className="flex items-center gap-2">
                                   <User size={12} />
                                   <span>{note.userName}</span>
                                </div>
                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                             </div>
                          </div>
                        ))
                      )}
                   </div>

                   <div className="relative mt-auto pt-6 border-t border-gray-100">
                      <textarea 
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Escrever uma instrução interna..."
                        className="w-full bg-gray-50 rounded-[2rem] p-6 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#B06A32]/5 border border-transparent focus:border-[#F6F1EB] transition-all resize-none min-h-[140px]"
                      />
                      <button 
                        onClick={() => { if(noteText) { onAddNote(order.id, noteText); setNoteText(''); } }}
                        className="absolute bottom-10 right-10 p-3 bg-[#1C1A17] text-white rounded-2xl hover:bg-[#B06A32] transition-all shadow-xl active:scale-90 scale-110"
                      >
                         <Send size={18} />
                      </button>
                   </div>
                </div>

                {/* 2. Quick Task Checklist */}
                <div className="p-8 bg-[#FDFCFB] rounded-[2.5rem] border border-gray-100">
                   <div className="flex items-center gap-3 mb-6">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Workflow de Checkout</h4>
                   </div>
                   <div className="space-y-4">
                      {[
                        { label: 'Validação de Pagamento', checked: currentStageIndex >= 1 },
                        { label: 'Separação em Estoque', checked: currentStageIndex >= 2 },
                        { label: 'Embalagem Premium Aplicada', checked: currentStageIndex >= 2 },
                        { label: 'Despacho Logístico', checked: currentStageIndex >= 3 },
                        { label: 'Confirmado pelo Cliente', checked: currentStageIndex >= 5 },
                      ].map((task, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                           <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.checked ? 'bg-[#B06A32] border-[#B06A32] text-white shadow-lg scale-110' : 'border-gray-100 bg-white group-hover:border-gray-300'}`}>
                              {task.checked && <Check size={14} strokeWidth={4} />}
                           </div>
                           <span className={`text-[11px] font-black uppercase tracking-widest ${task.checked ? 'text-[#1C1A17] line-through opacity-30 font-medium' : 'text-gray-500'}`}>{task.label}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* 3. Operational Warning Card */}
                {order.status === 'awaiting_payment' && (
                  <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 relative overflow-hidden">
                     <AlertTriangle size={40} className="absolute -bottom-2 -right-2 text-amber-200 opacity-50" />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 mb-2">Atenção Necessária</h4>
                     <p className="text-xs text-amber-600 font-bold leading-relaxed">Este pedido está reservando estoque mas ainda não foi pago. Considere cobrar o cliente via WhatsApp.</p>
                     <button onClick={() => openWhatsApp('pending')} className="mt-4 text-[9px] font-black uppercase tracking-widest text-amber-700 hover:underline">Enviar cobrança agora →</button>
                  </div>
                )}

             </div>
          </div>
        </div>
      </AdminPopup>

      {statusToChange && (
        <AdminConfirmDialog
          isOpen={!!statusToChange}
          onClose={() => setStatusToChange(null)}
          title="Alterar Fluxo Operacional"
          description={`Você está movendo este pedido para a etapa de ${getStatusLabel(statusToChange)}. Esta ação é registrada no log do sistema e notifica os canais vinculados.`}
          onConfirm={() => { onUpdateStatus(order.id, statusToChange); setStatusToChange(null); }}
        />
      )}
    </>
  );
}
