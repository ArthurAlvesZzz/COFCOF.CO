import React, { useState } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { Lock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PrerequisiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  missingRequirements: string[];
  primaryActionLabel: string;
  onPrimaryAction: () => void;
}

export function OperationPrerequisiteModal({ isOpen, onClose, title, description, missingRequirements, primaryActionLabel, onPrimaryAction }: PrerequisiteModalProps) {
  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Primeiro passo necessário"
      size="md"
    >
      <div className="flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 bg-[#c9a263]/10 text-[#c9a263] rounded-[16px] flex items-center justify-center mb-6 border border-[#c9a263]/20">
          <Lock size={32} />
        </div>
        
        <p className="text-[#0a0a0a] font-medium mb-6 max-w-sm">{description}</p>
        
        <div className="bg-[#fcfaf8] border border-[#c9a263]/10 rounded-[16px] p-5 text-left w-full mb-8">
           <h4 className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mb-4 flex items-center gap-2">
               Pré-requisito
           </h4>
           <ul className="space-y-3">
             {missingRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#0a0a0a] font-medium">
                  <div className="w-5 h-5 rounded-full border border-[#a3a3a3]/30 flex items-center justify-center text-[#a3a3a3] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
             ))}
           </ul>
        </div>
        
        <div className="flex flex-col gap-3 w-full">
           <button 
             onClick={() => {
                onClose();
                onPrimaryAction();
             }}
             className="bg-[#c9a263] hover:bg-[#b08d55] text-[#0a0a0a] px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-sm active:scale-95 w-full flex items-center justify-center gap-2"
           >
              {primaryActionLabel}
              <ArrowRight size={16} />
           </button>
           
           <button 
             onClick={onClose}
             className="bg-transparent hover:bg-[#fcfaf8] border border-[#a3a3a3]/20 text-[#a3a3a3] hover:text-[#0a0a0a] px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-colors w-full"
           >
             Voltar
           </button>
        </div>
      </div>
    </AdminPopup>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  summary: React.ReactNode;
  primaryActionLabel: string;
  onConfirm: () => Promise<void> | void;
  isDestructive?: boolean;
}

export function OperationConfirmModal({ isOpen, onClose, title, description, summary, primaryActionLabel, onConfirm, isDestructive }: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (onConfirm) await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title={title}
      subtitle="Confirmação de Ação"
      size="md"
    >
      <div className="flex flex-col justify-center p-4">
        <p className="text-[#0a0a0a] font-medium mb-6 text-sm text-center">{description}</p>
        
        {summary && (
          <div className="bg-[#fcfaf8] border border-[#a3a3a3]/10 rounded-[16px] p-5 text-left w-full mb-8 shadow-sm">
             {summary}
          </div>
        )}
        
        <div className="flex items-center gap-3 w-full mt-4">
           <button 
             onClick={onClose}
             disabled={loading}
             className="flex-1 bg-transparent hover:bg-[#fcfaf8] border border-[#a3a3a3]/20 text-[#a3a3a3] hover:text-[#0a0a0a] px-4 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-colors"
           >
             Cancelar
           </button>
           <button 
             onClick={handleConfirm}
             disabled={loading}
             className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-sm ${
               isDestructive 
                 ? 'bg-red-600 hover:bg-red-700 text-white' 
                 : 'bg-[#0a0a0a] hover:bg-[#111111] text-[#c9a263]'
             } ${loading ? 'opacity-70 cursor-wait' : ''}`}
           >
              {loading ? 'Processando...' : primaryActionLabel}
           </button>
        </div>
      </div>
    </AdminPopup>
  );
}
