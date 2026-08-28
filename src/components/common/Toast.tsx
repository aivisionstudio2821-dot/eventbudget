import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5 flex items-start justify-between gap-3 ${
            t.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/50 text-white'
              : t.type === 'warning'
              ? 'bg-slate-900/95 border-amber-500/50 text-white'
              : 'bg-slate-900/95 border-purple-500/50 text-white'
          }`}
        >
          <div className="flex items-start gap-3">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />}

            <div>
              <p className="text-xs font-bold">{t.title}</p>
              {t.message && <p className="text-[11px] text-slate-400 mt-0.5">{t.message}</p>}
            </div>
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
