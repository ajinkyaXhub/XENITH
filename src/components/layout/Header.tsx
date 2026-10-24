import React, { useState } from 'react';
import {
  ChevronRight,
  Database,
  Calendar,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { NotificationPopover } from '../common/NotificationPopover';
import { ConfirmModal } from '../common/ConfirmModal';
import { ModelId } from '../../types';

export const Header: React.FC = () => {
  const {
    activePage,
    selectedModelId,
    setSelectedModelId,
    selectedBatch,
    setSelectedBatch,
    resetDemoState,
  } = usePlatform();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const getPageTitle = () => {
    switch (activePage) {
      case 'overview':
        return 'Model Overview';
      case 'monitoring':
        return 'Data & Prediction Monitoring';
      case 'explanation-drift':
        return 'Explanation Drift Analysis';
      case 'drift-lab':
        return 'Drift Lab & Synthetic Simulator';
      case 'model-health':
        return 'Model Health & Composite Index';
      case 'diagnosis':
        return 'Diagnosis & Root-Cause Actions';
      case 'experiments':
        return 'Research Experiment Tracking';
      case 'reports':
        return 'Observability Reports & Audit';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'Observability Dashboard';
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between gap-4 sticky top-0 z-10 shrink-0 select-none shadow-2xs">
        {/* Left: Breadcrumbs & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <span>XENITH</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="capitalize">{activePage.replace('-', ' ')}</span>
          </div>
          <span className="text-slate-300">|</span>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight truncate m-0">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right: Controls & Selectors */}
        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs">
            <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value as ModelId)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-hidden cursor-pointer text-xs"
              aria-label="Select Machine Learning Model"
            >
              <option value="credit-card-fraud">Credit Card Fraud (XGBoost)</option>
              <option value="loan-approval">Loan Approval (LightGBM)</option>
            </select>
          </div>

          {/* Monitoring Window Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-hidden cursor-pointer text-xs"
              aria-label="Select Monitoring Batch Window"
            >
              <option value="Batch 024 (Latest - Elevated Drift)">
                Batch 024 (Latest - Elevated)
              </option>
              <option value="Batch 023 (Moderate Drift)">Batch 023 (Moderate)</option>
              <option value="Batch 022 (Stable)">Batch 022 (Stable)</option>
              <option value="Batch 021 (Baseline)">Batch 021 (Baseline)</option>
            </select>
          </div>

          {/* Demo Mode Badge */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-[11px] font-medium"
            title="Demonstration Prototype — All outputs are simulated with mock evaluation telemetry."
          >
            <Sparkles className="w-3 h-3 text-cyan-600" />
            <span>Demo Mode</span>
          </div>

          {/* Reset Demo Action */}
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            title="Reset demo parameters to baseline state for presentations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          {/* Notifications Popover */}
          <NotificationPopover />
        </div>
      </header>

      {/* Confirmation Modal for Reset Demo */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Demo to Baseline?"
        message="This will reset all simulated drift parameters, filters, alerts, and settings back to their default presentation state. Useful before beginning a live demonstration."
        confirmLabel="Reset State"
        cancelLabel="Cancel"
        onConfirm={() => {
          resetDemoState();
          setIsResetModalOpen(false);
        }}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </>
  );
};
