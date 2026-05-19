import React, { useState, useEffect } from 'react';
import { X, Target, Flame, Package, Layers, Handshake, Clock, AlertTriangle, Briefcase, Zap, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionId: string) => void;
  stats?: any;
}

export function NewOperationModal({ isOpen, onClose, onAction, stats }: NewOperationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getActionStatus = (id: string): { status: 'available'|'blocked', reason?: string } => {
    switch(id) {
       case 'register_roast': 
         if ((stats?.activeLotsCount || 0) === 0 && (stats?.rawKgAvailable || 0) === 0) 
            return { status: 'blocked', reason: 'Exige lote cru ativo' };
         return { status: 'available' };
       case 'package_coffee':
         if ((stats?.roastedKgInPeriod || 0) <= 0)
            return { status: 'blocked', reason: 'Exige torra registrada' };
         return { status: 'available' };
       case 'create_consignment':
         if ((stats?.finishedStockUnits || 0) <= 0)
            return { status: 'blocked', reason: 'Exige estoque pronto' };
         return { status: 'available' };
       default: 
         return { status: 'available' };
    }
  };

const actions = [
    { id: 'launch_lot', label: 'Lançar lote', desc: 'Cadastre um novo lote com origem, pontuação, custo e estoque inicial.', icon: Target, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-[#a3a3a3]/10', keywords: 'compra verde cru sacaria', isBlocked: false },
    { id: 'register_roast', label: 'Registrar torra', desc: 'Consuma café cru, informe rendimento e gere estoque torrado.', icon: Flame, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-[#a3a3a3]/10', keywords: 'forno maquina mestre queima perfil', isBlocked: (stats?.activeLotsCount || 0) === 0 && (stats?.rawKgAvailable || 0) === 0, blockReason: 'Exige lote cru disponível' },
    { id: 'package_coffee', label: 'Empacotar', desc: 'Transforme café torrado em pacotes de 200g, 1kg ou outros formatos.', icon: Package, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-[#a3a3a3]/10', keywords: 'embalagem final produto', isBlocked: (stats?.roastedKgInPeriod || 0) <= 0, blockReason: 'Exige torra registrada' },
    { id: 'create_consignment', label: 'Registrar consignação', desc: 'Envie pacotes para pontos de venda e parceiros.', icon: Handshake, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-[#a3a3a3]/10', keywords: 'venda b2b parceiro prateleira', isBlocked: (stats?.finishedStockUnits || 0) <= 0, blockReason: 'Exige estoque pronto' },
    { id: 'settle_consignment', label: 'Registrar acerto', desc: 'Receba valores e registre devoluções de consignações.', icon: AlertTriangle, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-red-900/30', keywords: 'receber cobranca dinheiro puxar devolucao', isBlocked: false },
    { id: 'launch_hours', label: 'Lançar horas', desc: 'Registre o trabalho do mestre de torra por dia e atividade.', icon: Clock, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-[#a3a3a3]/10', keywords: 'trabalho mestre ponto relogio', isBlocked: false },
    { id: 'close_period', label: 'Fechar período', desc: 'Consolide as horas trabalhadas e gere valor a pagar.', icon: Zap, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-[#a3a3a3]/10', keywords: 'pagamento acerto salario fechamento', isBlocked: false },
    { id: 'adjust_stock', label: 'Ajustar estoque', desc: 'Faça correções manuais de inventário (perda, avaria).', icon: Layers, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-[#a3a3a3]/10', keywords: 'correcao manual contagem inventario', isBlocked: false },
    { id: 'register_courtesy', label: 'Registrar cortesia', desc: 'Registre saídas de estoque para degustação ou brinde.', icon: Briefcase, color: 'text-white', bg: 'bg-[#1a1a1a]', border: 'border-[#a3a3a3]/10', keywords: 'brinde doacao provador evento degustacao', isBlocked: false },
  ];

  const filteredActions = actions.filter(a => 
      a.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.keywords.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          className="bg-[#111111] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-2xl flex flex-col relative overflow-hidden z-10 border border-[#c9a263]/20"
        >
          {/* Header Palette Search */}
          <div className="flex items-center p-4 border-b border-[#a3a3a3]/10 relative bg-[#1a1a1a]">
             <div className="pl-4 pr-3 text-[#c9a263]">
                 <Search size={22} className="opacity-80" />
             </div>
             <input 
                autoFocus
                type="text" 
                placeholder="Qual operação você deseja realizar?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-xl font-serif text-white placeholder:text-[#a3a3a3]/50 py-3 outline-none"
             />
             <div className="px-4 flex items-center gap-2">
                 <kbd className="hidden sm:inline-flex items-center justify-center h-6 px-2 text-[10px] font-bold uppercase text-[#a3a3a3] bg-[#0a0a0a] border border-[#a3a3a3]/20 rounded">ESC</kbd>
                 <button onClick={onClose} className="p-2 sm:hidden text-[#a3a3a3] hover:text-white rounded-full"><X size={20} /></button>
             </div>
          </div>

          {/* Action List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 bg-[#111111]">
              <div className="flex flex-col gap-2">
                  {filteredActions.length === 0 ? (
                      <div className="text-center py-12">
                          <p className="text-sm font-bold text-[#a3a3a3]">Nenhuma ação encontrada para "{searchQuery}"</p>
                      </div>
                  ) : (
                      filteredActions.map((action, index) => (
                          <button
                              key={action.id}
                              onClick={() => {
                                  onAction(action.id);
                                  onClose();
                              }}
                              className={`w-full text-left bg-[#1a1a1a] border border-transparent hover:border-[#c9a263]/30 p-4 rounded-3xl transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-[#c9a263]/20 relative ${action.isBlocked ? 'opacity-50 hover:bg-[#111111]' : 'hover:bg-[#111111] hover:shadow-[0_0_15px_rgba(201,162,99,0.1)]'}`}
                          >
                              <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${action.isBlocked ? 'bg-[#111111] text-[#a3a3a3] border border-[#a3a3a3]/10' : `${action.bg} ${action.color} border ${action.border} group-hover:scale-105 group-hover:text-[#c9a263]`}`}>
                                      <action.icon size={22} />
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-2 mb-0.5">
                                          <p className="text-sm font-medium text-white">{action.label}</p>
                                          {action.isBlocked && (
                                              <span className="bg-[#111111] text-[#a3a3a3] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 border border-[#a3a3a3]/10">
                                                  Bloqueado
                                              </span>
                                          )}
                                      </div>
                                      <p className="text-xs font-medium text-[#a3a3a3]/80">
                                          {action.isBlocked ? action.blockReason : action.desc}
                                      </p>
                                  </div>
                              </div>
                              
                              <div className={`hidden sm:flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity ${action.isBlocked ? 'text-[#a3a3a3]' : 'text-[#c9a263]'}`}>
                                  <span className="text-[10px] font-bold uppercase tracking-widest">{action.isBlocked ? 'Ver bloqueio' : 'Iniciar'}</span>
                                  <div className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center ${action.isBlocked ? 'bg-[#111111]' : 'bg-[#1a1a1a] border border-[#c9a263]/20'}`}>
                                      <ArrowRight size={14} />
                                  </div>
                              </div>
                          </button>
                      ))
                  )}
              </div>
          </div>
          
          {/* Footer minimalista */}
          <div className="bg-[#0a0a0a] p-4 border-t border-[#c9a263]/20 flex items-center justify-between text-xs font-medium text-[#a3a3a3]">
             <span>Use as setas para navegar, Enter para confirmar</span>
             <span className="font-bold flex items-center gap-1 text-[#c9a263]"><Zap size={12} /> Central Operacional CofCof</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
