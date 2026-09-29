import React from 'react';
import { useHims } from '../context/HimsContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useHims();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-900/90 text-emerald-100 border-emerald-700',
    error: 'bg-rose-900/90 text-rose-100 border-rose-700',
    info: 'bg-sky-900/90 text-sky-100 border-sky-700'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${bgColors[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};
