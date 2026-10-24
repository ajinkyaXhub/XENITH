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
} from 'recharts';
import {
  BarChart3,
  GitCompare,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  Zap,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SectionCard } from '../common/SectionCard';
import { StatusBadge } from '../common/StatusBadge';
import { ExperimentRecord } from '../../types';

export const ExperimentsPage: React.FC = () => {
  const { experiments, setActivePage } = usePlatform();
  const [selectedExp, setSelectedExp] = useState<ExperimentRecord | null>(null);

  // Comparative benchmark data for chart
  const comparisonData = [
    {
      method: 'Data-Drift-Only (KS)',
      detectionDelay: 2.8,
      falseAlarmRate: 14.2,
      accuracy: 62.0,
      color: '#94A3B8',
    },
    {
      method: 'Performance Threshold (F1)',
      detectionDelay: 4.6,
      falseAlarmRate: 3.1,
      accuracy: 48.0,
      color: '#64748B',
    },
    {
      method: 'SHAP EDS-A Only',
      detectionDelay: 1.4,
      falseAlarmRate: 6.8,
      accuracy: 84.5,
      color: '#06B6D4',
    },
    {
      method: 'Proposed XENITH Combined',
      detectionDelay: 1.1,
      falseAlarmRate: 4.2,
      accuracy: 92.4,
      color: '#4F46E5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              Academic & Experimental Benchmarking
            </span>
            <span className="text-xs font-mono text-slate-400">
              Evaluation Matrix
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Research Experiment Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Empirical comparative evaluations comparing XENITH’s proposed multi-signal monitoring against
            standard data-drift baselines and delayed ground-truth performance thresholding.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
            Illustrative Experimental Results • College Final-Year Project
          </span>
        </div>
      </div>

      {/* 4 Method Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Baseline Method 1
            </span>
            <h3 className="text-sm font-bold text-slate-800 mt-1">Data-Drift-Only</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Wasserstein distance & KS-test on raw input distributions.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Avg Delay:</span>
              <span className="font-bold">2.8 batches</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>False Alarm:</span>
              <span className="font-bold text-amber-600">14.2%</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Diagnosis Acc:</span>
              <span className="font-bold">62.0%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Baseline Method 2
            </span>
            <h3 className="text-sm font-bold text-slate-800 mt-1">Performance Threshold</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Monitors F1-score and error rate on delayed verified labels.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Avg Delay:</span>
              <span className="font-bold text-rose-600">4.6 batches</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>False Alarm:</span>
              <span className="font-bold text-emerald-600">3.1%</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Diagnosis Acc:</span>
              <span className="font-bold">48.0%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-600 uppercase block">
              Proposed Method 3
            </span>
            <h3 className="text-sm font-bold text-slate-800 mt-1">SHAP-Based EDS-A</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Unsupervised TreeSHAP explanation drift tracking on frozen model.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Avg Delay:</span>
              <span className="font-bold text-cyan-700">1.4 batches</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>False Alarm:</span>
              <span className="font-bold text-emerald-600">6.8%</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Diagnosis Acc:</span>
              <span className="font-bold">84.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-xl border border-indigo-700 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-mono font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proposed Framework</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1">XENITH Combined Engine</h3>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Joint DDS + EDS-A + Root-Cause Rule Engine.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Avg Delay:</span>
              <span className="font-bold text-cyan-400">1.1 batches (-3.5x)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>False Alarm:</span>
              <span className="font-bold text-emerald-400">4.2%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Diagnosis Acc:</span>
              <span className="font-bold text-white">92.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Delay Comparison */}
        <SectionCard
          title="Detection Delay Comparison (Lower is Better)"
          subtitle="Average batches required to trigger a true drift alert after drift onset"
          demoNotice="Synthetic benchmark evaluation"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="method"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  unit=" b"
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
                  formatter={(val: any) => [`${val} batches`, 'Detection Delay']}
                />
                <Bar dataKey="detectionDelay" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* False Alarm vs Diagnosis Accuracy */}
        <SectionCard
          title="Diagnosis Accuracy vs False Alarm Rate"
          subtitle="Tradeoff between accurate root-cause identification and alert fatigue"
          demoNotice="Illustrative simulation results"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="method"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="accuracy" name="Diagnosis Accuracy (%)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="falseAlarmRate" name="False Alarm Rate (%)" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Experiment Tracking Table */}
      <SectionCard
        title="Experiment Evaluation Log"
        subtitle="Click any row to inspect full scenario configurations, metrics, and technical notes"
        headerAction={
          <button
            type="button"
            onClick={() => setActivePage('drift-lab')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Launch New Drift Lab Run</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Experiment Name</th>
                <th className="py-3 px-4">Scenario</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Pattern</th>
                <th className="py-3 px-4">Method Tested</th>
                <th className="py-3 px-4">Delay</th>
                <th className="py-3 px-4">FAR</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {experiments.map((exp) => (
                <tr
                  key={exp.id}
                  onClick={() => setSelectedExp(exp)}
                  className="hover:bg-indigo-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div>{exp.name}</div>
                    <span className="text-[10px] font-mono text-slate-400">{exp.date}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{exp.scenarioType}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={exp.severity} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{exp.pattern}</td>
                  <td className="py-3 px-4 font-semibold text-indigo-700">{exp.baselineMethod}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{exp.detectionDelay} b</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{exp.falseAlarmRate}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">{exp.diagnosisAccuracy}%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-semibold text-indigo-600 hover:underline">
                      View Dossier
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Experiment Detail Modal / Drawer */}
      {selectedExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Experiment Dossier • {selectedExp.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedExp.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedExp(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Scenario Type</span>
                  <span className="font-bold text-slate-800">{selectedExp.scenarioType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Method Tested</span>
                  <span className="font-bold text-indigo-600">{selectedExp.baselineMethod}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Detection Delay</span>
                  <span className="font-mono font-bold text-slate-900">{selectedExp.detectionDelay} batches</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Diagnosis Accuracy</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedExp.diagnosisAccuracy}%</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Experimental Observation & Notes:
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {selectedExp.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedExp(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
