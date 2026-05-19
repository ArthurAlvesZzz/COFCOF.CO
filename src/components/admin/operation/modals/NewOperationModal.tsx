import React, { useState, useEffect, useRef } from 'react';
import { X, Target, Flame, Package, Layers, Handshake, Clock, AlertTriangle, Briefcase, Zap, Search, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionId: string) => void;
  stats?: any;
}

export function NewOperationModal({ isOpen, onClose, onAction, stats }: NewOperationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') {
          const visible = getGroupedActions().flatMap(g => g.items);
          if (visible.length > 0) {
              onAction(visible[0].id);
              onClose();
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchQuery]);

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

  const getGroupedActions = () => {
    const actions = [
      { group: 'Produção', items: [
        { id: 'launch_lot', label: 'Lançar lote', desc: 'Cadastre um novo lote com origem, pontuação, custo e estoque inicial.', icon: Target, keywords: 'compra verde cru sacaria' },
        { id: 'register_roast', label: 'Registrar torra', desc: 'Consuma café cru, informe rendimento e gere estoque torrado.', icon: Flame, keywords: 'forno maquina mestre queima perfil' },
        { id: 'package_coffee', label: 'Empacotar', desc: 'Transforme café torrado em pacotes de 200g, 1kg ou outros formatos.', icon: Package, keywords: 'embalagem final produto' },
        { id: 'adjust_stock', label: 'Ajustar estoque', desc: 'Faça correções manuais de inventário (perda, avaria).', icon: Layers, keywords: 'correcao manual contagem inventario' }
      ]},
      { group: 'Comercial', items: [
        { id: 'create_consignment', label: 'Registrar consignação', desc: 'Envie pacotes para pontos de venda e parceiros.', icon: Handshake, keywords: 'venda b2b parceiro prateleira' },
        { id: 'register_courtesy', label: 'Registrar cortesia', desc: 'Registre saídas de estoque para degustação ou brinde.', icon: Briefcase, keywords: 'brinde doacao provador evento degustacao' },
        { id: 'settle_consignment', label: 'Registrar acerto', desc: 'Receba valores e registre devoluções de consignações.', icon: AlertTriangle, keywords: 'receber cobranca dinheiro puxar devolucao' }
      ]},
      { group: 'Equipe / Financeiro', items: [
        { id: 'launch_hours', label: 'Lançar horas', desc: 'Registre o trabalho do mestre de torra por dia e atividade.', icon: Clock, keywords: 'trabalho mestre ponto relogio' },
        { id: 'close_period', label: 'Fechar período', desc: 'Consolide as horas trabalhadas e gere valor a pagar.', icon: Zap, keywords: 'pagamento acerto salario fechamento' },
        { id: 'view_hours', label: 'Aprovar horas', desc: 'Revise e aprove registros de horas pendentes.', icon: Clock, keywords: 'aprovar mestre salario validar' }
      ]}
    ];

    if (!searchQuery) {
        return actions.map(g => ({
            ...g,
            items: g.items.map(item => ({ ...item, status: getActionStatus(item.id) }))
        }));
    }

    const filtered = actions.map(g => ({
        ...g,
        items: g.items.filter(a => 
            a.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
            a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.keywords.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(item => ({ ...item, status: getActionStatus(item.id) }))
    })).filter(g => g.items.length > 0);
    return filtered;
  };

  const groupedActions = getGroupedActions();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-10 sm:pt-20 px-4 sm:px-6 pb-20">
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
          className="bg-[#111111] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-2xl flex flex-col relative overflow-hidden z-10 border border-[#c9a263]/20 h-[80vh]"
        >
          {/* Header Palette Search */}
          <div className="flex items-center p-4 border-b border-[#a3a3a3]/10 relative bg-[#1a1a1a]">
             <div className="pl-4 pr-3 text-[#c9a263]">
                 <Search size={22} className="opacity-80" />
             </div>
             <input 
                ref={inputRef}
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
          <div className="flex-1 overflow-y-auto p-4 bg-[#111111]">
              <div className="flex flex-col gap-6">
                  {groupedActions.length === 0 ? (
                      <div className="text-center py-20 flex flex-col items-center">
                          <Zap size={32} className="text-[#a3a3a3]/30 mb-4" />
                          <p className="text-sm font-bold text-[#a3a3a3]">Nenhuma operação encontrada. Tente 'lote' ou 'horas'.</p>
                      </div>
                  ) : (
                      groupedActions.map((group, gIdx) => (
                          <div key={gIdx} className="space-y-3">
                              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a263] pl-2">{group.group}</h3>
                              <div className="grid grid-cols-1 gap-2">
                                  {group.items.map((action, index) => {
                                      const blocked = action.status.status === 'blocked';
                                      return (
                                          <button
                                              key={action.id}
                                              onClick={() => {
                                                  onAction(action.id);
                                                  onClose();
                                              }}
                                              className={`w-full text-left p-4 rounded-3xl transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-[#c9a263]/20 relative border ${blocked ? 'bg-[#1a1a1a] border-transparent opacity-80' : 'bg-[#1a1a1a] border-[#a3a3a3]/10 hover:bg-[#222] hover:border-[#c9a263]/40'}`}
                                          >
                                              <div className="flex items-center gap-4">
                                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 border ${blocked ? 'bg-[#111111] text-[#a3a3a3] border-[#a3a3a3]/10' : 'bg-[#0a0a0a] text-white border-[#c9a263]/20 group-hover:scale-105 group-hover:text-[#c9a263]'}`}>
                                                      {blocked ? <Lock size={20} /> : <action.icon size={22} strokeWidth={1.5} />}
                                                  </div>
                                                  <div>
                                                      <div className="flex items-center gap-2 mb-1">
                                                          <p className={`text-sm font-bold ${blocked ? 'text-[#a3a3a3]' : 'text-white'}`}>{action.label}</p>
                                                      </div>
                                                      <p className={`text-[11px] font-medium leading-relaxed ${blocked ? 'text-amber-500/80' : 'text-[#a3a3a3]/80'}`}>
                                                          {blocked ? action.status.reason : action.desc}
                                                      </p>
                                                  </div>
                                              </div>
                                              
                                              {!blocked && (
                                              <div className="hidden sm:flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#c9a263]">
                                                  <span className="text-[10px] font-bold uppercase tracking-widest">Iniciar</span>
                                                  <div className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center bg-[#0a0a0a] border border-[#c9a263]/20">
                                                      <ArrowRight size={14} />
                                                  </div>
                                              </div>
                                              )}
                                              {blocked && (
                                                <div className="hidden sm:flex items-center opacity-60 text-amber-500/80 transition-opacity">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest pl-2">Ver requisito</span>
                                                </div>
                                              )}
                                          </button>
                                      );
                                  })}
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
          
          {/* Footer */}
          <div className="bg-[#0a0a0a] p-4 border-t border-[#c9a263]/20 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3]">
             <span>↑↓ Navegar • Enter Selecionar • ESC Fechar</span>
             <span className="flex items-center gap-2 text-[#c9a263]"><Zap size={14} /> CofCof</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
