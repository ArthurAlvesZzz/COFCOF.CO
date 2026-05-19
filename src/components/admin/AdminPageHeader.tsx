import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
}

export function AdminPageHeader({ title, subtitle, action, children }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-serif text-[#1C1A17]">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {action && (
          <button
            onClick={action.onClick}
            className="bg-[#1C1A17] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-[#B06A32] transition-colors flex items-center justify-center gap-2"
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
