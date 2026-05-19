import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AdminPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | 'premium' | 'operation';
}

export function AdminPopup({ isOpen, onClose, title, subtitle, children, footer, size = 'lg' }: AdminPopupProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-7xl',
    premium: 'max-w-[1180px]',
    operation: 'max-w-[1040px] w-[calc(100vw-32px)]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full ${sizeClasses[size]} bg-[#fcfaf8] rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-10 max-h-[92dvh] sm:max-h-[90dvh] overflow-hidden border border-[#c9a263]/20`}
          >
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#c9a263]/20 bg-[#111111] shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-white">{title}</h2>
                {subtitle && <p className="text-sm text-[#a3a3a3] mt-1">{subtitle}</p>}
              </div>
              <button 
                onClick={onClose}
                aria-label="Fechar"
                className="p-2 text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a] rounded-full transition-colors shrink-0 ml-4 border border-transparent hover:border-[#a3a3a3]/10"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#fcfaf8]">
              {children}
            </div>

            {footer && (
              <div className="border-t border-[#a3a3a3]/10 bg-white px-6 py-4 flex items-center justify-between shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
