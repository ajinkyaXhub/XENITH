import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Layers,
  Cpu,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SectionCard } from '../common/SectionCard';
import { StatusBadge } from '../common/StatusBadge';
import { SHAP_FEATURE_COMPARISON } from '../../data/mockData';

export const ExplanationDriftPage: React.FC = () => {
  const { currentModel, selectedBatch, setActivePage } = usePlatform();

  // Reformat SHAP data for horizontal bar chart (features on Y-axis)
  const chartData = [...SHAP_FEATURE_COMPARISON].reverse().map((item) => ({
    name: item.feature,
    reference: item.referenceShap,
    current: item.currentShap,
    delta: item.relativeChange,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
              Core Differentiating Capability
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Window: {selectedBatch}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Explanation Drift Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Compare how feature contributions change between the reference and current monitoring windows.
            Unlike data drift which monitors input inputs in isolation, <strong>Explanation Drift (EDS)</strong> tracks
            shifts in the model's internal decision reasoning and feature dependencies — providing early warnings
            before delayed ground-truth labels arrive.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActivePage('diagnosis')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
        >
          <span>Correlate with Diagnosis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* EDS Hero Metric & Summary Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large EDS Card */}
        <div className="lg:col-span-4 bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Explanation Drift Score (EDS)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Moderate Drift
              </span>
            </div>

            <div className="my-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold font-mono text-white tracking-tight">
                  0.27
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 1.00</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>+0.09 shift vs reference baseline</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Calculated via Earth Mover's Distance across TreeSHAP feature attribution distributions
              between baseline (Q1-Q3) and current Batch 024.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Reference Window:</span>
              <span className="text-slate-200">120,000 samples</span>
            </div>
            <div className="flex justify-between">
              <span>Current Batch 024:</span>
              <span className="text-slate-200">15,420 samples</span>
            </div>
            <div className="flex justify-between">
              <span>Statistical Confidence:</span>
              <span className="text-cyan-400">95% CI [0.24, 0.30]</span>
            </div>
          </div>
        </div>

        {/* Explanation Summary Insight Panel */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Automated Explanation Drift Interpretation</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-2">
              Decision Reliance Pivot: Device Risk Importance Surges +33.3%
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              <strong>Transaction Amount</strong> remains the primary driving feature (|SHAP|: 0.38 → 0.45),
              while <strong>Device Risk Score</strong> has gained significant relative importance in Batch 024
              (|SHAP|: 0.24 → 0.32, +33.3%). Simultaneously, <strong>Account Age</strong> has lost protective weight (-26.7%).
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This pattern indicates that the model is shifting reliance toward network and device telemetry signatures
              rather than relying on customer account seniority. This frequently precedes elevated false-positive rates
              when upstream device fingerprinting updates occur.
            </p>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Note on Technical Formulation:</strong> Mean absolute SHAP values (E[|SHAP|]) represent
              the magnitude of feature contribution to classification scores, regardless of whether the feature
              increases or decreases fraud risk for individual transactions.
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution Comparison Chart */}
      <SectionCard
        title="SHAP Feature Contribution Comparison"
        subtitle="Horizontal comparison of mean absolute SHAP values (E[|SHAP|]): Reference Baseline vs Current Batch 024"
        demoNotice="Illustrative TreeSHAP attribution outputs"
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 0.55]}
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                label={{ value: 'Mean |SHAP| Value (Attribution Magnitude)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748B' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
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
                formatter={(val: any, name: any) => [`${val}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
              <Bar
                dataKey="reference"
                name="Reference Baseline (Q1-Q3)"
                fill="#94A3B8"
                radius={[0, 4, 4, 0]}
                barSize={16}
              />
              <Bar
                dataKey="current"
                name="Current Batch 024"
                fill="#4F46E5"
                radius={[0, 4, 4, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Feature Contribution Change Table */}
      <SectionCard
        title="Feature Contribution Shift & Rank Dynamics"
        subtitle="Detailed breakdown of attribution shifts, rank ordering, and behavioral interpretations"
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Baseline |SHAP|</th>
                <th className="py-3 px-4">Current |SHAP|</th>
                <th className="py-3 px-4">Relative Change (%)</th>
                <th className="py-3 px-4">Rank Shift</th>
                <th className="py-3 px-4">Significance</th>
                <th className="py-3 px-4">Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SHAP_FEATURE_COMPARISON.map((feat) => {
                const isPositive = feat.relativeChange > 0;
                return (
                  <tr key={feat.feature} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {feat.feature}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                      {feat.referenceShap.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-[11px]">
                      {feat.currentShap.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[11px]">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          feat.relativeChange > 25
                            ? 'text-rose-600'
                            : isPositive
                            ? 'text-indigo-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {feat.relativeChange.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                      {feat.rankShift > 0 ? (
                        <span className="text-rose-600 font-semibold">▲ +{feat.rankShift}</span>
                      ) : feat.rankShift < 0 ? (
                        <span className="text-slate-500 font-semibold">▼ {feat.rankShift}</span>
                      ) : (
                        <span className="text-slate-400">— Stable</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={feat.significance} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-sm leading-relaxed">
                      {feat.interpretation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Proposed Architectural Methods: EDS-A vs EDS-B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EDS-A Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Proposed Method 1
              </span>
              <span className="text-xs font-mono text-slate-400">Zero-Label Required</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              EDS-A — Frozen-Model Explanation Drift
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Computes SHAP explanations on newly arriving unlabelled batches using the <em>currently deployed frozen model</em>.
              Measures how the current model interprets new incoming data distributions compared to baseline expectations.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Real-time capability: Operates instantly without label delay</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Detection focus: Covariate shift impacting decision boundaries</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
            Status: Proposed methodology in XENITH research framework
          </div>
        </div>

        {/* EDS-B Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                Proposed Method 2
              </span>
              <span className="text-xs font-mono text-slate-400">Delayed Ground Truth</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              EDS-B — Shadow-Model Explanation Drift
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Trains a <em>shadow model</em> on recently labelled delayed batches and computes explanations.
              Comparing shadow-model explanations against frozen-model explanations directly diagnoses true
              <strong> Concept Drift (P(Y|X) shift)</strong>.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <ShieldAlert className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>Requires ground-truth labels: Delayed by audit window (~48h)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Layers className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>Detection focus: Genuine structural changes in fraudster tactics</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
            Status: Proposed research prototype (simulated demonstration)
          </div>
        </div>
      </div>
    </div>
  );
};
