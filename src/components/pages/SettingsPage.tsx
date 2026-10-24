import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  Monitor,
  RotateCcw,
  Check,
  Save,
  Shield,
  Info,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SectionCard } from '../common/SectionCard';
import { INITIAL_SETTINGS } from '../../data/mockData';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoState, showToast } = usePlatform();

  const [formData, setFormData] = useState({ ...settings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleResetDefaults = () => {
    setFormData(INITIAL_SETTINGS);
    updateSettings(INITIAL_SETTINGS);
    showToast('Platform preferences restored to default prototype values.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-indigo-600" />
              Interface Preferences
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Local State Only
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Platform Settings & Thresholds
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Configure display parameters, composite health score thresholds, and alert preferences.
            Settings are persisted locally in browser localStorage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Model Display Preferences */}
          <SectionCard
            title="General Model Display"
            subtitle="Configure model metadata labels and default batch selector"
          >
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Active Model Display Name
                </label>
                <input
                  type="text"
                  value={formData.modelDisplayName}
                  onChange={(e) =>
                    setFormData({ ...formData, modelDisplayName: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Default Monitoring Window
                </label>
                <select
                  value={formData.defaultMonitoringWindow}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultMonitoringWindow: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 text-xs focus:outline-hidden cursor-pointer"
                >
                  <option value="Batch 024 (Last 72 Hours)">Batch 024 (Last 72 Hours)</option>
                  <option value="Batch 023 (Moderate Drift)">Batch 023 (Moderate Drift)</option>
                  <option value="Batch 022 (Stable)">Batch 022 (Stable)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Workspace Density Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, displayMode: 'standard' })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.displayMode === 'standard'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Standard Presentation (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, displayMode: 'compact' })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.displayMode === 'compact'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    High-Density Table View
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Model Health Thresholds */}
          <SectionCard
            title="Composite Health Score Thresholds"
            subtitle="Define status boundaries for Healthy, Stable, and Warning bands"
            demoNotice="Configurable prototype bands"
          >
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-emerald-800">Healthy Band Minimum (Optimal):</span>
                  <span className="font-mono font-bold text-emerald-700">{formData.thresholds.healthyMin} / 100</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={95}
                  value={formData.thresholds.healthyMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholds: { ...formData.thresholds, healthyMin: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-cyan-800">Stable Band Minimum (Monitored):</span>
                  <span className="font-mono font-bold text-cyan-700">{formData.thresholds.stableMin} / 100</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={85}
                  value={formData.thresholds.stableMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholds: { ...formData.thresholds, stableMin: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-amber-800">Warning Band Minimum (Advisory Alert):</span>
                  <span className="font-mono font-bold text-amber-700">{formData.thresholds.warningMin} / 100</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={65}
                  value={formData.thresholds.warningMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholds: { ...formData.thresholds, warningMin: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                Scores below {formData.thresholds.warningMin} automatically enter the <strong>Critical</strong> band,
                triggering escalation recommendations in the Diagnosis workspace.
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Alert Severity & Notification Preferences */}
        <SectionCard
          title="Notification & Diagnostic Trigger Preferences"
          subtitle="Simulated notification dispatch and automatic explanation drift flags"
        >
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
              <div>
                <strong className="text-slate-800 block">Automatic SHAP Shift Detection</strong>
                <span className="text-slate-500 text-[11px]">Flag alerts whenever a single feature's |SHAP| attribution shifts by &gt;25%.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.alertPreferences.autoFlagShapShifts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alertPreferences: {
                      ...formData.alertPreferences,
                      autoFlagShapShifts: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
              <div>
                <strong className="text-slate-800 block">Simulate Critical Escalation Webhook</strong>
                <span className="text-slate-500 text-[11px]">Generate diagnostic dispatch payload when health index falls below Warning threshold.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.alertPreferences.emailOnCritical}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alertPreferences: {
                      ...formData.alertPreferences,
                      emailOnCritical: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </SectionCard>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
