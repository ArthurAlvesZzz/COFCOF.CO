import React, { useState } from 'react';
import { AdminPopup } from './AdminPopup';

export interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDestructive = false
}: AdminConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="text-gray-500 font-medium hover:text-[#1C1A17] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
              isDestructive
                ? 'bg-red-900 border border-red-500 hover:bg-red-800 text-white'
                : 'bg-[#111111] hover:bg-black text-[#c9a263] border border-[#a3a3a3]/20 shadow-[0_0_15px_rgba(201,162,99,0.1)]'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-[#a3a3a3] mb-2">
        {description}
      </div>
    </AdminPopup>
  );
}
