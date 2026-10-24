import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewPage } from './components/pages/OverviewPage';
import { ModelMonitoringPage } from './components/pages/ModelMonitoringPage';
import { ExplanationDriftPage } from './components/pages/ExplanationDriftPage';
import { DriftLabPage } from './components/pages/DriftLabPage';
import { ModelHealthPage } from './components/pages/ModelHealthPage';
import { DiagnosisPage } from './components/pages/DiagnosisPage';
import { ExperimentsPage } from './components/pages/ExperimentsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { CheckCircle2, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, toastMessage } = usePlatform();

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'monitoring':
        return <ModelMonitoringPage />;
      case 'explanation-drift':
        return <ExplanationDriftPage />;
      case 'drift-lab':
        return <DriftLabPage />;
      case 'model-health':
        return <ModelHealthPage />;
      case 'diagnosis':
        return <DiagnosisPage />;
      case 'experiments':
        return <ExperimentsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FB] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Top Header */}
        <Header />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}
