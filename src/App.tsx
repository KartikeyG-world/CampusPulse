import React from 'react';
import { CampusPulseProvider, useCampusPulse } from './context/CampusPulseContext';
import { Header } from './components/Header';
import { LandingPageView } from './components/LandingPageView';
import { StudentReportView } from './components/StudentReportView';
import { OperationsView } from './components/OperationsView';
import { BenQKioskView } from './components/BenQKioskView';
import { Toast } from './components/Toast';
import { CheckCircle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeRole } = useCampusPulse();

  if (activeRole === 'landing') {
    return (
      <>
        <LandingPageView />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F6F1] text-[#202720]">
      {/* Global Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 pb-12" id={`view-${activeRole}`} tabIndex={-1}>
        {activeRole === 'student' && <StudentReportView />}
        {activeRole === 'operations' && <OperationsView />}
        {activeRole === 'benq-kiosk' && <BenQKioskView />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-[#DCE2D9] bg-white py-6 text-xs text-[#626B63]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-[#202720]">CampusPulse</span>
            <span className="text-[#DCE2D9]">|</span>
            <span>Campus Issue Reporting and Resolution Prototype</span>
            <span className="text-[#DCE2D9]">|</span>
            <span className="inline-flex items-center gap-1 text-[#246348]">
              <CheckCircle className="w-3.5 h-3.5" />
              Local storage synchronized
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[#626B63]">
            <span>Designed for 16:9 Ambient Displays</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CampusPulseProvider>
      <MainLayout />
    </CampusPulseProvider>
  );
};

export default App;
