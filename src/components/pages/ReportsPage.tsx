import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Calendar,
  Building,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SectionCard } from '../common/SectionCard';
import { StatusBadge } from '../common/StatusBadge';
import { SHAP_FEATURE_COMPARISON } from '../../data/mockData';

export const ReportsPage: React.FC = () => {
  const { currentModel, healthData, selectedBatch, featuresDrift, diagnosisCases, showToast } =
    usePlatform();

  const [reportType, setReportType] = useState<'executive' | 'technical' | 'governance'>('executive');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const header = 'feature_id,feature_name,type,ref_mean,curr_mean,drift_metric,drift_value,severity,status\n';
    const rows = featuresDrift
      .map(
        (f) =>
          `"${f.id}","${f.name}","${f.type}","${f.refMean}","${f.currMean}","${f.driftMetric}",${f.driftValue},"${f.severity}","${f.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xenith_drift_report_${selectedBatch.replace(/ /g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Drift Metrics exported as CSV.');
  };

  const handleExportJson = () => {
    const reportJson = {
      title: 'XENITH Model Observability & Explanation Drift Audit',
      model: currentModel,
      batch: selectedBatch,
      health: healthData,
      featuresDrift,
      explanationDrift: SHAP_FEATURE_COMPARISON,
      diagnosisCases,
      generatedAt: new Date().toISOString(),
      disclaimer: 'Demonstration prototype report generated for academic presentation.',
    };
    const blob = new Blob([JSON.stringify(reportJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xenith_audit_report_${currentModel.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit Report exported as JSON.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Hidden during print) */}
      <div className="no-print bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Governance & Observability Dossier
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Audit Ready
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Observability Reports & Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Generate printable executive audit summaries, compliance documentation, and export raw telemetry metrics
            for stakeholder reviews.
          </p>
        </div>

        {/* Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Report Type Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setReportType('executive')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reportType === 'executive' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Executive
            </button>
            <button
              type="button"
              onClick={() => setReportType('technical')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reportType === 'technical' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Technical
            </button>
            <button
              type="button"
              onClick={() => setReportType('governance')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reportType === 'governance' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Governance
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report (PDF)</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-4xl mx-auto space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-xl text-slate-900 tracking-wider font-mono">
                XENITH
              </span>
              <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                AUDIT REPORT
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Model Health & Explanation Drift Evaluation Dossier
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Document Ref: XEN-AUD-{currentModel.id.toUpperCase()}-2026-024
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500 space-y-1">
            <div>Generated: Oct 24, 2026 • 15:00 UTC</div>
            <div>Model: {currentModel.name} ({currentModel.version})</div>
            <div>Evaluation Window: {selectedBatch}</div>
          </div>
        </div>

        {/* Executive Summary Block */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">
            1. Executive Assessment
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-700 space-y-2">
            <p>
              During evaluation window <strong>{selectedBatch}</strong>, the composite health score for{' '}
              <strong>{currentModel.name}</strong> was calculated at{' '}
              <strong className="text-amber-700">82 / 100 (Operational Status: Warning)</strong>.
            </p>
            <p>
              Elevated <strong>Data Drift (DDS = 0.34)</strong> and moderate{' '}
              <strong>Explanation Drift (EDS = 0.27)</strong> were observed. Specifically, input transaction
              amounts and device risk scores demonstrated statistically significant distribution shifts
              (KS statistic = 0.38). In parallel, model attribution shifted heavily toward device risk
              telemetry (+33.3% SHAP weight), signaling potential false-positive inflation on mobile consumers.
            </p>
          </div>
        </div>

        {/* Score & KPI Snapshot */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">
            2. Core Telemetry Summary
          </h3>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-mono text-[11px]">Composite Health</span>
              <span className="text-xl font-extrabold font-mono text-amber-600 mt-1 block">
                82 / 100
              </span>
              <span className="text-[10px] text-amber-700 font-medium">Warning Threshold Triggered</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-mono text-[11px]">Data Drift (DDS)</span>
              <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">0.34</span>
              <span className="text-[10px] text-rose-600 font-medium">Elevated (+0.12 vs ref)</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-mono text-[11px]">Explanation Drift (EDS)</span>
              <span className="text-xl font-extrabold font-mono text-indigo-600 mt-1 block">0.27</span>
              <span className="text-[10px] text-amber-600 font-medium">Moderate Attribution Shift</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-mono text-[11px]">Delayed F1-Score</span>
              <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">0.86</span>
              <span className="text-[10px] text-slate-500 font-medium">Baseline: 0.91 (-0.05 drop)</span>
            </div>
          </div>
        </div>

        {/* Feature Attribution Changes Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">
            3. Explanation Drift & Feature Contribution Dynamics
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-600 font-semibold font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Feature Name</th>
                <th className="py-2.5 px-3">Baseline |SHAP|</th>
                <th className="py-2.5 px-3">Batch 024 |SHAP|</th>
                <th className="py-2.5 px-3">Relative Shift</th>
                <th className="py-2.5 px-3">Attribution Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {SHAP_FEATURE_COMPARISON.map((f) => (
                <tr key={f.feature}>
                  <td className="py-2 px-3 font-bold text-slate-900">{f.feature}</td>
                  <td className="py-2 px-3 text-slate-600">{f.referenceShap.toFixed(2)}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{f.currentShap.toFixed(2)}</td>
                  <td className="py-2 px-3 font-bold">
                    <span className={f.relativeChange > 20 ? 'text-rose-600' : 'text-slate-700'}>
                      {f.relativeChange > 0 ? '+' : ''}{f.relativeChange.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-600">{f.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommended Actions Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">
            4. Diagnostic Findings & Corrective Action Items
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Action 1 (High Priority):</strong> Inspect upstream Payment Gateway API v3 integration
                to verify device risk token normalization.
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Action 2 (High Priority):</strong> Dispatch expedited audit batch of 500 transactions to
                human fraud review queue for ground-truth confirmation.
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Action 3 (Medium Priority):</strong> Evaluate temporary decision threshold recalibration
                from 0.50 to 0.54 to mitigate checkout drop-off.
              </div>
            </div>
          </div>
        </div>

        {/* Sign-Off & Governance Section */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs font-mono">
          <div>
            <span className="text-slate-400 block mb-6">Prepared by:</span>
            <div className="border-b border-slate-300 pb-1 font-bold text-slate-800">
              Lead ML Observability Researcher
            </div>
            <span className="text-[10px] text-slate-400">XENITH Senior Capstone Workspace</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-6">Academic / Faculty Reviewer:</span>
            <div className="border-b border-slate-300 pb-1 font-bold text-slate-800">
              Project Evaluation Committee
            </div>
            <span className="text-[10px] text-slate-400">Department of Computer Science & AI</span>
          </div>
        </div>

        {/* Demonstration Disclaimer */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-[10px] font-mono text-slate-400">
          PROTOTYPE REPORT — Generated for academic demonstration purposes with simulated telemetry data.
        </div>
      </div>
    </div>
  );
};
