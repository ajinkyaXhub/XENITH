import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  SlidersHorizontal,
  Search,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SectionCard } from '../common/SectionCard';
import { StatusBadge } from '../common/StatusBadge';
import { PREDICTION_DIST_COMPARISON } from '../../data/mockData';

export const ModelMonitoringPage: React.FC = () => {
  const {
    currentModel,
    selectedBatch,
    setSelectedBatch,
    featuresDrift,
    selectedFeatureId,
    setSelectedFeatureId,
    showToast,
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isSimulatedUploading, setIsSimulatedUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const selectedFeature =
    featuresDrift.find((f) => f.id === selectedFeatureId) || featuresDrift[0];

  const filteredFeatures = featuresDrift.filter((feat) => {
    const matchesSearch =
      feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === 'all' ||
      feat.severity.toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  // Combine ref & curr distribution for chart
  const distributionChartData = selectedFeature.refDistribution.map((refItem, idx) => {
    const currItem = selectedFeature.currDistribution[idx] || { count: 0 };
    return {
      bucket: refItem.value,
      reference: refItem.count,
      current: currItem.count,
    };
  });

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSimulatedUploading(true);
      setTimeout(() => {
        setIsSimulatedUploading(false);
        setUploadedFileName(file.name);
        showToast(`Simulated dataset "${file.name}" ingested successfully (14,800 mock rows).`);
      }, 700);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              Input & Prediction Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Model: {currentModel.algorithm}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Data & Prediction Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Continuously evaluate covariate feature shift, output prediction distributions, and incoming data quality.
            Differentiate between input data drift, prediction drift, and schema or pipeline corruption.
          </p>
        </div>

        {/* Dataset Ingestion / Upload Control */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors text-xs font-semibold text-slate-700">
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>{isSimulatedUploading ? 'Ingesting Batch...' : uploadedFileName ? `Active: ${uploadedFileName}` : 'Simulate CSV Upload'}</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleSimulatedUpload}
            />
          </label>
        </div>
      </div>

      {/* Dataset Summary Metrics: Reference vs Current */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-mono text-slate-400 block uppercase">Sample Volume</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900">15,420</span>
            <span className="text-xs text-slate-500">vs 120k baseline</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>Sampling Window: 72 hrs</span>
            <span className="text-emerald-600 font-medium">100% Complete</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-mono text-slate-400 block uppercase">Features Monitored</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900">6 Numerical</span>
            <span className="text-xs text-amber-600 font-semibold">2 Drifted</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>KS / PSI Statistics</span>
            <span className="text-amber-600 font-medium">Elevated</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-mono text-slate-400 block uppercase">High-Risk Fraud Ratio</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900">4.8%</span>
            <span className="text-xs text-rose-600 font-semibold">+1.6% vs 3.2% ref</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>Prediction Drift</span>
            <span className="text-rose-600 font-medium">Flagged</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-mono text-slate-400 block uppercase">Data Quality Health</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-emerald-600">99.4%</span>
            <span className="text-xs text-slate-500">0.08% missing avg</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>Schema Integrity</span>
            <span className="text-emerald-600 font-medium">Passing</span>
          </div>
        </div>
      </div>

      {/* Main Monitoring Two Columns: Feature Table & Interactive Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feature Drift Table with Search & Filters */}
        <div className="lg:col-span-7 space-y-4">
          <SectionCard
            title="Feature Drift Summary Table"
            subtitle="Click any row to inspect distribution histograms and statistical comparisons"
            headerAction={
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search feature..."
                    className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-36"
                  />
                </div>
                {/* Filter */}
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-hidden cursor-pointer"
                  aria-label="Filter features by drift severity"
                >
                  <option value="all">All Severities</option>
                  <option value="elevated">Elevated</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>
            }
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Feature</th>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">p-Value</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFeatures.map((feat) => {
                    const isSelected = feat.id === selectedFeatureId;
                    return (
                      <tr
                        key={feat.id}
                        onClick={() => setSelectedFeatureId(feat.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{feat.name}</span>
                            {isSelected && (
                              <span className="text-[10px] font-mono text-indigo-600 bg-indigo-100 px-1.5 py-0.2 rounded">
                                Selected
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Ref: {feat.refMean} • Curr: {feat.currMean}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium">
                          <span
                            className={
                              feat.driftValue > 0.3
                                ? 'text-rose-600 font-bold'
                                : feat.driftValue > 0.2
                                ? 'text-amber-600 font-semibold'
                                : 'text-slate-600'
                            }
                          >
                            {feat.driftMetric}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                          {feat.pVal < 0.001 ? '<0.001' : feat.pVal.toFixed(3)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={feat.severity} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`text-[11px] font-semibold font-mono ${
                              feat.status === 'drifted'
                                ? 'text-rose-600'
                                : feat.status === 'warning'
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {feat.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Batch History Table */}
          <SectionCard
            title="Batch Evaluation History"
            subtitle="Previous 4 monitoring batches and their drift classification status"
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-4">Batch ID</th>
                    <th className="py-2.5 px-4">Evaluated Samples</th>
                    <th className="py-2.5 px-4">DDS</th>
                    <th className="py-2.5 px-4">EDS</th>
                    <th className="py-2.5 px-4 text-right">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr className="bg-indigo-50/40">
                    <td className="py-2.5 px-4 font-bold text-indigo-700">Batch 024 (Active)</td>
                    <td className="py-2.5 px-4 text-slate-700">15,420</td>
                    <td className="py-2.5 px-4 text-rose-600 font-bold">0.34 (Elevated)</td>
                    <td className="py-2.5 px-4 text-amber-600 font-bold">0.27 (Moderate)</td>
                    <td className="py-2.5 px-4 text-right font-bold text-amber-600">82 / 100</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Batch 023</td>
                    <td className="py-2.5 px-4 text-slate-700">14,890</td>
                    <td className="py-2.5 px-4 text-amber-600">0.29 (Moderate)</td>
                    <td className="py-2.5 px-4 text-amber-600">0.24 (Moderate)</td>
                    <td className="py-2.5 px-4 text-right text-amber-600 font-medium">85 / 100</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Batch 022</td>
                    <td className="py-2.5 px-4 text-slate-700">15,100</td>
                    <td className="py-2.5 px-4 text-slate-600">0.26 (Moderate)</td>
                    <td className="py-2.5 px-4 text-slate-600">0.21 (Moderate)</td>
                    <td className="py-2.5 px-4 text-right text-slate-700">86 / 100</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Batch 021</td>
                    <td className="py-2.5 px-4 text-slate-700">14,750</td>
                    <td className="py-2.5 px-4 text-emerald-600">0.22 (Low)</td>
                    <td className="py-2.5 px-4 text-emerald-600">0.18 (Low)</td>
                    <td className="py-2.5 px-4 text-right text-emerald-600 font-medium">89 / 100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Right Column: Interactive Deep Dive for Selected Feature */}
        <div className="lg:col-span-5 space-y-4">
          <SectionCard
            title={`Distribution Comparison: ${selectedFeature.name}`}
            subtitle={`Comparing baseline reference vs Batch 024 (${selectedFeature.driftMetric})`}
            demoNotice="Simulated histogram breakdown"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="bucket"
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis
                    unit="%"
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                      border: 'none',
                    }}
                    formatter={(val: any) => [`${val}%`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar
                    dataKey="reference"
                    name="Reference Baseline"
                    fill="#94A3B8"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="current"
                    name="Batch 024"
                    fill="#4F46E5"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Feature Statistics Summary Box */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Drift Distance Test:</span>
                <span className="font-bold text-slate-800">{selectedFeature.driftMetric}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Hypothesis p-Value:</span>
                <span className="font-bold text-rose-600">
                  {selectedFeature.pVal < 0.001 ? '<0.001 (Reject H₀)' : selectedFeature.pVal}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Missing Rate (Ref vs Curr):</span>
                <span className="font-medium text-slate-700">
                  {selectedFeature.missingRef} vs {selectedFeature.missingCurr}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200 leading-relaxed">
                <strong>Observation:</strong> {selectedFeature.name} shows pronounced divergence in upper quantiles.
                In the fraud detection model, shifts in this variable influence decision boundary confidence.
              </div>
            </div>
          </SectionCard>

          {/* Data Quality & Missing Value Diagnostics */}
          <SectionCard
            title="Data Quality & Integrity Diagnostics"
            subtitle="Pipeline validation checks for Batch 024"
          >
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Schema & Type Enforcement</span>
                </div>
                <span className="font-mono text-emerald-700 font-semibold text-[11px]">0 errors</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Missing Values Threshold (&lt;1%)</span>
                </div>
                <span className="font-mono text-emerald-700 font-semibold text-[11px]">0.08% avg</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2 text-amber-800 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Outlier & Extreme Values (&gt;4σ)</span>
                </div>
                <span className="font-mono text-amber-700 font-semibold text-[11px]">1.8% in Tx Amount</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Duplicate Ingestion Check</span>
                </div>
                <span className="font-mono text-emerald-700 font-semibold text-[11px]">0 duplicates</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
