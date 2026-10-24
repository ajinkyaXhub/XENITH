import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  ShieldCheck,
  Activity,
  BrainCircuit,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  Scale,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SectionCard } from '../common/SectionCard';
import { HealthGauge } from '../common/HealthGauge';
import { StatusBadge } from '../common/StatusBadge';

export const ModelHealthPage: React.FC = () => {
  const { currentModel, healthData, timeSeriesHistory, showToast } = usePlatform();

  // Interactive weights simulator
  const [weights, setWeights] = useState({
    dataDrift: 35,
    explanationDrift: 35,
    predictionStability: 15,
    delayedPerformance: 15,
  });

  // Calculate dynamic simulated score based on weights
  const simulatedScore = Math.round(
    100 -
      ((100 - 82) *
        (weights.dataDrift * 0.35 +
          weights.explanationDrift * 0.35 +
          weights.predictionStability * 0.15 +
          weights.delayedPerformance * 0.15)) /
        25
  );
  const clampedSimulated = Math.max(40, Math.min(98, simulatedScore));

  const getBand = (score: number) => {
    if (score >= 90) return { label: 'Healthy', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 70) return { label: 'Stable', color: 'text-cyan-800 bg-cyan-50 border-cyan-200' };
    if (score >= 50) return { label: 'Warning', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Critical', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const handleWeightChange = (key: keyof typeof weights, val: number) => {
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Composite Governance Metric
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Model: {currentModel.algorithm}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Model Health & Composite Index
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            The XENITH Model Health Score synthesizes multiple monitoring signals into a single 0–100 index.
            It balances unsupervised input drift, explanation dynamics, output stability, and delayed ground-truth feedback.
          </p>
        </div>

        <div className="text-right bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Score</span>
          <span className="text-2xl font-extrabold font-mono text-amber-600">82 / 100</span>
          <span className="text-[11px] text-amber-700 font-semibold block">Warning Status</span>
        </div>
      </div>

      {/* Hero Gauge & Configured Status Thresholds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Gauge Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Current Composite Score
            </span>
            <span className="text-xs font-mono text-slate-400">Batch 024</span>
          </div>

          <div className="my-4">
            <HealthGauge score={clampedSimulated} status={healthData.status} size={240} />
          </div>

          <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 text-center font-mono">
            Score = 100 - [w_dds · Δ_dds + w_eds · Δ_eds + w_stab · Δ_stab + w_f1 · Δ_f1]
            <div className="text-[10px] text-cyan-700 mt-0.5">
              *Configurable prototype composite equation
            </div>
          </div>
        </div>

        {/* Configured Status Threshold Bands */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Configured Status Threshold Bands
              </h2>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Configurable Prototype Defaults
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <strong className="text-emerald-900 block font-semibold">90 – 100: Healthy</strong>
                    <span className="text-emerald-700 text-[11px]">Normal operations. All drift and attribution metrics within acceptable baselines.</span>
                  </div>
                </div>
                <span className="font-mono text-emerald-800 font-bold shrink-0">Optimal</span>
              </div>

              <div className="p-3 rounded-xl border border-cyan-200 bg-cyan-50/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-600 shrink-0" />
                  <div>
                    <strong className="text-cyan-900 block font-semibold">70 – 89: Stable</strong>
                    <span className="text-cyan-700 text-[11px]">Minor distribution variations observed; model decision reasoning remains reliable.</span>
                  </div>
                </div>
                <span className="font-mono text-cyan-800 font-bold shrink-0">Monitored</span>
              </div>

              <div className="p-3 rounded-xl border-2 border-amber-300 bg-amber-50 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <div>
                    <strong className="text-amber-900 block font-bold">50 – 69: Warning (Current: 82)</strong>
                    <span className="text-amber-800 text-[11px]">Notable data drift or explanation shifts detected. Automated investigation recommended.</span>
                  </div>
                </div>
                <span className="font-mono text-amber-800 font-bold shrink-0">Active Trigger</span>
              </div>

              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                  <div>
                    <strong className="text-rose-900 block font-semibold">0 – 49: Critical</strong>
                    <span className="text-rose-700 text-[11px]">Severe degradation or multi-signal collapse. Fallback heuristic or immediate triage required.</span>
                  </div>
                </div>
                <span className="font-mono text-rose-800 font-bold shrink-0">Intervention</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed font-mono">
            Notice: These threshold bands represent proposed operational defaults in the XENITH design framework.
            Validation against domain-specific SLA tolerances is required before production deployment.
          </p>
        </div>
      </div>

      {/* Signal Availability Matrix: Unsupervised vs Ground-Truth Dependent */}
      <SectionCard
        title="Signal Taxonomy & Availability Matrix"
        subtitle="Clarifying latency and ground-truth dependencies across all monitored signals"
        demoNotice="Core Technical Honesty Component"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Column 1: Immediately Available */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span>Available Real-Time Signals</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Calculated immediately upon batch arrival without waiting for delayed labels.
            </p>
            <ul className="space-y-2 text-slate-700 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-indigo-600 font-bold">•</span>
                <span><strong>DDS:</strong> Wasserstein & PSI on feature distributions</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-indigo-600 font-bold">•</span>
                <span><strong>EDS-A:</strong> Frozen-model TreeSHAP attribution divergence</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-indigo-600 font-bold">•</span>
                <span><strong>Prediction Entropy:</strong> Output probability variance & stability</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-indigo-600 font-bold">•</span>
                <span><strong>Data Quality:</strong> Missing rate, schema mismatches, & outliers</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Delayed Ground-Truth */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-cyan-800 font-bold">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>Label-Dependent Delayed Signals</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Require verified fraud feedback / chargeback confirmations (~48–72h delay).
            </p>
            <ul className="space-y-2 text-slate-700 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-cyan-700 font-bold">•</span>
                <span><strong>F1-Score & PR-AUC:</strong> Evaluated on audited sample subsets</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-cyan-700 font-bold">•</span>
                <span><strong>EDS-B:</strong> Shadow model explanations on newly confirmed labels</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-cyan-700 font-bold">•</span>
                <span><strong>True False-Positive Rate:</strong> Confirmed disputed chargebacks</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Indeterminate / Unreliable */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Indeterminate from Predictions</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cannot be proven purely from model prediction scores without external context.
            </p>
            <ul className="space-y-2 text-slate-700 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-amber-700 font-bold">•</span>
                <span><strong>Silent Concept Shift:</strong> Fraud tactics changing while scores appear normal</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-amber-700 font-bold">•</span>
                <span><strong>Adversarial Evasion:</strong> Coordinated fraud designed to evade decision trees</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono text-amber-700 font-bold">•</span>
                <span><strong>Upstream Schema Alteration:</strong> Unannounced API payload adjustments</span>
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Historical Health Trend Chart */}
      <SectionCard
        title="Historical Composite Health Trajectory"
        subtitle="Batch-by-batch trajectory showing evolution from baseline to current warning state"
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
                  fontSize: '11px',
                  border: 'none',
                }}
              />
              <ReferenceLine
                y={70}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                label={{ value: 'Warning Threshold (70)', fill: '#D97706', fontSize: 10, position: 'insideTopRight' }}
              />
              <ReferenceLine
                y={50}
                stroke="#EF4444"
                strokeDasharray="4 4"
                label={{ value: 'Critical Threshold (50)', fill: '#DC2626', fontSize: 10, position: 'insideTopRight' }}
              />
              <Line
                type="monotone"
                dataKey="healthScore"
                name="Health Score"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ r: 4, fill: '#4F46E5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Interactive Composite Scoring Weights Simulator */}
      <SectionCard
        title="Composite Health Formula Weight Simulator"
        subtitle="Adjust the relative importance of monitoring factors to observe simulated health index sensitivity"
        headerAction={
          <button
            type="button"
            onClick={() => {
              setWeights({
                dataDrift: 35,
                explanationDrift: 35,
                predictionStability: 15,
                delayedPerformance: 15,
              });
              showToast('Restored default prototype formula weights.');
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Reset Default Weights
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-slate-700">Data Drift (DDS):</span>
              <span className="font-mono font-bold text-indigo-600">{weights.dataDrift}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={weights.dataDrift}
              onChange={(e) => handleWeightChange('dataDrift', Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Deduction: -6.2 pts</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-slate-700">Explanation Drift (EDS):</span>
              <span className="font-mono font-bold text-indigo-600">{weights.explanationDrift}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={weights.explanationDrift}
              onChange={(e) => handleWeightChange('explanationDrift', Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Deduction: -7.1 pts</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-slate-700">Prediction Stability:</span>
              <span className="font-mono font-bold text-indigo-600">{weights.predictionStability}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={weights.predictionStability}
              onChange={(e) => handleWeightChange('predictionStability', Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Deduction: -2.8 pts</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-slate-700">Delayed Performance (F1):</span>
              <span className="font-mono font-bold text-indigo-600">{weights.delayedPerformance}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={weights.delayedPerformance}
              onChange={(e) => handleWeightChange('delayedPerformance', Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Deduction: -1.9 pts</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
