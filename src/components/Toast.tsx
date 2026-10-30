import React from 'react';
import { useCampusPulse } from '../context/CampusPulseContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useCampusPulse();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md pointer-events-auto"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-lg bg-white border shadow-md transition-all ${
          isSuccess
            ? 'border-[#246348]'
            : isWarning
            ? 'border-[#B45309]'
            : 'border-[#0F766E]'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#246348] shrink-0 mt-0.5" />}
        {isWarning && <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />}
        {!isSuccess && !isWarning && <Info className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wide font-semibold text-[#626B63]">
            {isSuccess ? 'Confirmation' : isWarning ? 'Notice' : 'Information'}
          </div>
          <div className="text-sm font-medium text-[#202720] mt-0.5 leading-snug">{toast.text}</div>
        </div>
      </div>
    </div>
  );
};
