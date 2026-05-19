import React from 'react';
import { Settings } from 'lucide-react';

interface AdminEmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export function AdminEmptyState({ title, description, action, icon }: AdminEmptyStateProps) {
  return (
    <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 bg-[#F6F1EB] text-[#B06A32] rounded-full flex items-center justify-center mb-4">
        {icon || <Settings size={32} />}
      </div>
      <h2 className="text-2xl font-serif text-[#1C1A17] mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="bg-[#1C1A17] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-[#B06A32] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
