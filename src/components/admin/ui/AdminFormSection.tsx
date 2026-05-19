import React, { useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AdminFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  id?: string;
  defaultOpen?: boolean;
  statusBadge?: React.ReactNode;
}

export function AdminFormSection({ 
  title, 
  description, 
  children, 
  icon: Icon, 
  id, 
  defaultOpen = true,
  statusBadge
}: AdminFormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div id={id} className="bg-white rounded-2xl border border-[#2A160E]/5 overflow-hidden shadow-sm transition-all hover:shadow-md mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`p-2.5 rounded-xl ${isOpen ? 'bg-[#1C1A17] text-white' : 'bg-gray-100 text-gray-400'} transition-colors`}>
              <Icon size={20} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-[#1C1A17]">{title}</h3>
              {statusBadge}
            </div>
            {description && !isOpen && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{description}</p>
            )}
            {description && isOpen && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        <div className="text-gray-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-gray-50">
              <div className="space-y-5">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
