import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';
import {
  Activity,
  ArrowRight,
  AlertTriangle,
  Compass,
  Layers,
  Sparkles,
  ExternalLink,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { KpiCard } from '../common/KpiCard';
import { SectionCard } from '../common/SectionCard';
import { HealthGauge } from '../common/HealthGauge';
import { StatusBadge } from '../common/StatusBadge';
import { PREDICTION_DIST_COMPARISON } from '../../data/mockData';

export const OverviewPage: React.FC = () => {
  const {
    currentModel,
    healthData,
    timeSeriesHistory,
    featuresDrift,
    alerts,
    setActivePage,
    setSelectedFeatureId,
  } = usePlatform();

  const handleInspectFeature = (featureId: string) => {
    setSelectedFeatureId(featureId);
    setActivePage('monitoring');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Model Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentModel.name}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor model behaviour, detect explanation drift, and investigate emerging operational risks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-mono text-slate-400">Reference Baseline</div>
            <div className="text-xs font-semibold text-slate-700">
              {currentModel.referenceDataset}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('diagnosis')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Open Diagnosis Engine</span>
          </button>
        </div>
      </div>

      {/* Model Health Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 relative overflow-hidden">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radial Health Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Composite Model Health
            </span>
            <HealthGauge
              score={healthData.overallScore}
              status={healthData.status}
              size={210}
            />
            <p className="text-[11px] text-slate-400 text-center mt-3 font-mono">
              Simulated demonstration score • Weighted 4-factor composite
            </p>
          </div>

          {/* Model Status & Metadata Breakdown */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Operational Status: Warning
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Evaluation: {currentModel.currentBatch}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Elevated Feature & Attribution Drift Detected
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mt-1">
                  Model health dropped to <strong className="text-slate-800">82/100</strong> due to
                  concurrent data drift in transaction totals and an explanation shift in device risk
                  attribution. Classification output stability remains within acceptable tolerance (91.8%).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePage('model-health')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors group"
              >
                <span>View Full Score Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Metadata Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-mono">Model Architecture</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                  {currentModel.algorithm}
                </span>
              </div>
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-mono">Reference Volume</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block font-mono">
                  {currentModel.referenceCount.toLocaleString()} samples
                </span>
              </div>
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-mono">Current Batch Window</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block font-mono">
                  {currentModel.currentCount.toLocaleString()} samples
                </span>
              </div>
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-mono">Last Evaluated</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate font-mono">
                  Oct 24, 14:30 UTC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Data Drift Score (DDS)"
          value="0.34"
          status="Elevated"
          deltaText="+0.12 vs Batch 020"
          deltaDirection="up"
          deltaSeverity="bad"
          tooltipText="Aggregate multivariate Wasserstein / Population Stability Index (PSI) measuring input distribution divergence from baseline."
          metricType="Wasserstein Composite"
        />

        <KpiCard
          title="Explanation Drift Score (EDS)"
          value="0.27"
          status="Moderate"
          deltaText="+0.09 vs baseline"
          deltaDirection="up"
          deltaSeverity="bad"
          tooltipText="Earth Mover's Distance across SHAP attribution vectors. Quantifies how the model's internal decision reasoning is shifting."
          metricType="Mean |SHAP| Divergence"
        />

        <KpiCard
          title="Prediction Stability"
          value="91.8"
          unit="%"
          status="Stable"
          deltaText="-4.2% score quantile shift"
          deltaDirection="down"
          deltaSeverity="neutral"
          tooltipText="Percentage of prediction scores remaining within historical baseline quantile ranges without sudden collapse."
          metricType="Quantile Overlap"
        />

        <KpiCard
          title="Latest F1-Score"
          value="0.86"
          status="Warning"
          deltaText="Down from 0.91 baseline"
          deltaDirection="down"
          deltaSeverity="bad"
          tooltipText="Evaluation performance measured on delayed verified ground-truth sample (400 audited transaction cases)."
          metricType="Delayed Verified Ground Truth"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Model Health Over Time */}
        <SectionCard
          title="Model Health Over Time"
          subtitle="Composite health score trajectory across historical monitoring batches"
          demoNotice="Threshold: Warning <70, Critical <50"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="batch"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  domain={[40, 100]}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(value: any) => [`${value} / 100`, 'Health Score']}
                />
                <ReferenceLine
                  y={70}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{ value: 'Warning (70)', fill: '#D97706', fontSize: 10, position: 'insideTopRight' }}
                />
                <ReferenceLine
                  y={50}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Critical (50)', fill: '#DC2626', fontSize: 10, position: 'insideTopRight' }}
                />
                <Line
                  type="monotone"
                  dataKey="healthScore"
                  name="Health Score"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#4F46E5' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Chart B: Drift Signals Over Time */}
        <SectionCard
          title="Drift Signals Over Time"
          subtitle="Comparative trajectory of Data Drift (DDS) vs Explanation Drift (EDS)"
          demoNotice="Warning region: Score > 0.25"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="batch"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  domain={[0, 0.45]}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <ReferenceLine
                  y={0.25}
                  stroke="#F59E0B"
                  strokeDasharray="3 3"
                  label={{ value: 'Drift Threshold (0.25)', fill: '#D97706', fontSize: 10, position: 'insideTopLeft' }}
                />
                <Line
                  type="monotone"
                  dataKey="dataDriftScore"
                  name="Data Drift Score (DDS)"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#06B6D4' }}
                />
                <Line
                  type="monotone"
                  dataKey="explanationDriftScore"
                  name="Explanation Drift Score (EDS)"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Chart C: Prediction Distribution Comparison */}
      <SectionCard
        title="Prediction Distribution Comparison"
        subtitle="Distribution of predicted fraud probability scores: Reference Baseline vs Current Batch 024"
        demoNotice="Shows noticeable rightward skew towards high-risk buckets (0.5 - 0.9)"
      >
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={PREDICTION_DIST_COMPARISON}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="bucket"
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                unit="%"
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
                formatter={(val: any) => [`${val}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar
                dataKey="referencePercentage"
                name="Reference Baseline (Q1-Q3)"
                fill="#94A3B8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="currentPercentage"
                name="Current Batch 024"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Feature Drift Summary Table */}
      <SectionCard
        title="Feature Drift Summary"
        subtitle="Statistical divergence summary for key input features in the active monitoring batch"
        headerAction={
          <button
            type="button"
            onClick={() => setActivePage('monitoring')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>Open Feature Monitoring</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Reference Baseline</th>
                <th className="py-3 px-4">Current Batch 024</th>
                <th className="py-3 px-4">Drift Statistic</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {featuresDrift.map((feat) => (
                <tr key={feat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {feat.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {feat.type}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {feat.refMean}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-bold font-mono text-[11px]">
                    {feat.currMean}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">
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
                  <td className="py-3.5 px-4">
                    <StatusBadge status={feat.severity} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleInspectFeature(feat.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline px-2 py-1 rounded transition-colors"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Two Column Bottom: Recent Alerts & Recommended Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Alerts List */}
        <div className="lg:col-span-7">
          <SectionCard
            title="Recent Monitoring Alerts"
            subtitle="Automated alerts and signal anomalies registered across current evaluation batches"
            headerAction={
              <span className="text-xs font-mono text-slate-400">
                {alerts.length} events logged
              </span>
            }
            noPadding
          >
            <div className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    {alert.severity === 'high' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {alert.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setActivePage(alert.pageTarget)}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
                      >
                        Investigate in {alert.pageTarget.replace('-', ' ')}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Recommended Action Card */}
        <div className="lg:col-span-5">
          <div className="bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Automated Recommendation</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Investigate Recent Transaction Distribution Changes
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Feature-level distribution shift (Transaction Amount KS = 0.38) and explanation drift
                (EDS = 0.27) have both crossed advisory thresholds. Evidence suggests upstream payment
                gateway telemetry changes rather than sudden fraud attacker adaptation.
              </p>

              <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Check payment gateway API v3 tokenization</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Sample 500 transactions for expedited ground-truth audit</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Assess decision threshold recalibration (0.50 → 0.54)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Rule Confidence: 88%
              </span>
              <button
                type="button"
                onClick={() => setActivePage('diagnosis')}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Open Diagnosis & Recommendations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
