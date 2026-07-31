import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
}) => {
  if (!isOpen) return null;

  const typeMap = {
    danger: {
      btn: 'bg-critical hover:bg-critical-dark text-white shadow-red-100 dark:shadow-none',
      icon: 'text-critical bg-red-50 dark:bg-red-950/20',
    },
    warning: {
      btn: 'bg-warning hover:bg-warning-dark text-white shadow-amber-100 dark:shadow-none',
      icon: 'text-warning bg-amber-50 dark:bg-amber-950/20',
    },
    info: {
      btn: 'bg-brand-600 hover:bg-brand-700 text-white shadow-blue-100 dark:shadow-none',
      icon: 'text-brand-500 bg-blue-50 dark:bg-blue-950/20',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 select-none">
      <div className="bg-white dark:bg-darkbg-card border border-slate-200 dark:border-darkbg-border rounded-2xl w-full max-w-md overflow-hidden shadow-glass p-6 space-y-4">
        <div className="flex gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center ${typeMap[type].icon}`}>
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white leading-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 dark:border-darkbg-border text-slate-650 dark:text-slate-400 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${typeMap[type].btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;
