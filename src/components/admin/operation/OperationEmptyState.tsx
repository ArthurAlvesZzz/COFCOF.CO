import React from 'react';
import { LucideIcon } from 'lucide-react';

interface OperationEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function OperationEmptyState({ icon: Icon, title, description, actionLabel, onAction }: OperationEmptyStateProps) {
  return (
    <div className="bg-[#FDFCFB] border border-gray-100 rounded-[24px] p-8 md:p-12 flex flex-col items-center justify-center text-center w-full shadow-sm min-h-[300px]">
      <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-[16px] flex items-center justify-center mb-6 shadow-sm">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-black text-[#1C1A17] tracking-tight mb-2">{title}</h3>
      <p className="text-sm font-medium text-gray-500 max-w-md mx-auto mb-8">{description}</p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="bg-[#1C1A17] text-[#F6F1EB] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#2A2723] transition-all shadow-md active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
