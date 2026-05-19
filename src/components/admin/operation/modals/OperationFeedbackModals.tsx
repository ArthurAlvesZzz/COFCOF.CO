import React, { useState } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { AlertCircle, AlertTriangle, ArrowRight, Construction, CheckCircle2 } from 'lucide-react';

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
      subtitle="Ação bloqueada no momento"
      size="md"
    >
      <div className="flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[16px] flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>
        
        <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
        
        <div className="bg-gray-50 border border-gray-100 rounded-[16px] p-4 text-left w-full mb-8">
           <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-3">O que está faltando:</h4>
           <ul className="space-y-2">
             {missingRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                  <AlertCircle size={16} className="text-gray-400 shrink-0 mt-0.5" />
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
             className="bg-[#1C1A17] hover:bg-[#2A2723] text-[#F6F1EB] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 w-full flex items-center justify-center gap-2"
           >
              {primaryActionLabel}
              <ArrowRight size={16} />
           </button>
           
           <button 
             onClick={onClose}
             className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors w-full"
           >
             Cancelar
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
      subtitle="Confirmação necessária"
      size="md"
    >
      <div className="flex flex-col justify-center p-4">
        <p className="text-gray-600 mb-6 text-sm text-center">{description}</p>
        
        {summary && (
          <div className="bg-gray-50 border border-gray-100 rounded-[16px] p-5 text-left w-full mb-8">
             {summary}
          </div>
        )}
        
        <div className="flex items-center gap-3 w-full mt-4">
           <button 
             onClick={onClose}
             disabled={loading}
             className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
           >
             Cancelar
           </button>
           <button 
             onClick={handleConfirm}
             disabled={loading}
             className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${
               isDestructive 
                 ? 'bg-red-500 hover:bg-red-600 text-white' 
                 : 'bg-[#1C1A17] hover:bg-[#2A2723] text-[#F6F1EB]'
             } ${loading ? 'opacity-70 cursor-wait' : ''}`}
           >
              {loading ? 'Processando...' : primaryActionLabel}
           </button>
        </div>
      </div>
    </AdminPopup>
  );
}

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export function OperationComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      title="Funcionalidade em desenvolvimento"
      subtitle={featureName}
      size="md"
    >
      <div className="flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-[16px] flex items-center justify-center mb-6">
          <Construction size={32} />
        </div>
        
        <p className="text-gray-600 mb-8 max-w-sm">
           Essa ação ainda não está finalizada, mas já está mapeada no fluxo operacional do CofCof. Em breve estará disponível!
        </p>
        
        <button 
          onClick={onClose}
          className="bg-[#1C1A17] hover:bg-[#2A2723] text-[#F6F1EB] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 w-full"
        >
           Entendi
        </button>
      </div>
    </AdminPopup>
  );
}
