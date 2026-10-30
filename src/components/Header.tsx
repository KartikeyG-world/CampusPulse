import React, { useState } from 'react';
import { useCampusPulse } from '../context/CampusPulseContext';
import { UserRole } from '../types';
import {
  Building2,
  Send,
  SlidersHorizontal,
  Tv2,
  Trash2,
  Home,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { activeRole, setActiveRole, clearLocalReports } = useCampusPulse();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const navItems: { role: UserRole; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      label: 'Report an issue',
      shortLabel: 'Report',
      icon: <Send className="w-3.5 h-3.5" />,
    },
    {
      role: 'operations',
      label: 'Operations hub',
      shortLabel: 'Operations',
      icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
    },
    {
      role: 'benq-kiosk',
      label: 'Public signage',
      shortLabel: 'Signage',
      icon: <Tv2 className="w-3.5 h-3.5" />,
    },
  ];

  const handleConfirmClear = () => {
    clearLocalReports();
    setShowClearConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#DCE2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo & Product Identity (Clickable to return to Landing Page) */}
            <button
              onClick={() => setActiveRole('landing')}
              className="flex items-center gap-3 shrink-0 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246348] rounded-md p-0.5"
              title="Return to Product Overview"
              aria-label="CampusPulse Home Overview"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348] group-hover:border-[#246348] transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-[#202720] group-hover:text-[#246348] transition-colors">
                    CampusPulse
                  </span>
                </div>
                <p className="text-xs text-[#626B63] hidden sm:block">
                  Campus issue reporting and resolution
                </p>
              </div>
            </button>

            {/* Central Segmented Nav */}
            <nav
              role="tablist"
              aria-label="CampusPulse workspace navigation"
              className="flex items-center p-0.5 rounded-lg bg-[#EFEFEA] border border-[#DCE2D9]"
            >
              {navItems.map((item) => {
                const isActive = activeRole === item.role;
                return (
                  <button
                    key={item.role}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`view-${item.role}`}
                    onClick={() => setActiveRole(item.role)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-[#202720] shadow-sm border border-[#DCE2D9]'
                        : 'text-[#626B63] hover:text-[#202720] hover:bg-white/50'
                    }`}
                  >
                    <span className={isActive ? 'text-[#246348]' : 'text-[#8E988F]'}>
                      {item.icon}
                    </span>
                    <span className="hidden md:inline">{item.label}</span>
                    <span className="md:hidden">{item.shortLabel}</span>
                  </button>
                );
              })}
            </nav>

            {/* Action Utilities */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveRole('landing')}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-white text-[#626B63] border border-[#DCE2D9] hover:bg-[#FAF9F5] hover:text-[#202720] transition-colors"
                title="Return to Product Overview"
                aria-label="Return to Product Overview"
              >
                <Home className="w-3.5 h-3.5 text-[#8E988F]" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-[#FAF9F5] text-[#626B63] border border-[#DCE2D9] hover:bg-white hover:text-[#A32D2D] hover:border-[#F1C4C4] transition-colors"
                title="Clear locally saved reports in this browser"
                aria-label="Clear locally saved reports in this browser"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#8E988F]" />
                <span className="hidden sm:inline">Clear reports</span>
              </button>
            </div>

          </div>
        </div>

        {/* Proportionate Prototype Disclaimer Banner */}
        <div className="bg-[#FAF9F5] border-t border-[#DCE2D9]/70 py-1 px-4 text-center text-[11px] text-[#626B63]">
          CampusPulse is an independent operations prototype using browser-local storage. Reports are saved in this browser's local data.
        </div>
      </header>

      {/* Deliberate Confirmation Dialog for Clearing Local Reports */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-reports-title"
        >
          <div className="bg-white rounded-lg border border-[#DCE2D9] max-w-md w-full p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="clear-reports-title" className="text-sm font-bold text-[#202720]">
                Clear locally saved reports?
              </h2>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="p-1 rounded text-[#8E988F] hover:text-[#202720]"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#626B63] leading-relaxed">
              This will remove all campus reports and resolution notes stored in this browser's local storage. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-white border border-[#DCE2D9] text-[#202720] hover:bg-[#FAF9F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#A32D2D] text-white hover:bg-[#832323]"
              >
                Yes, clear local reports
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
