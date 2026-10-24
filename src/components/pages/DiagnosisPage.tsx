import React from 'react';
import {
  GitMerge,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check,
  FileCheck,
  ExternalLink,
  Info,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SectionCard } from '../common/SectionCard';
import { StatusBadge } from '../common/StatusBadge';

export const DiagnosisPage: React.FC = () => {
  const {
    diagnosisCases,
    selectedCaseId,
    setSelectedCaseId,
    updateRecommendationStatus,
    showToast,
  } = usePlatform();

  const selectedCase =
    diagnosisCases.find((c) => c.id === selectedCaseId) || diagnosisCases[0];

  const handleRecommendationAction = (
    recId: string,
    currentStatus: 'Pending' | 'In Progress' | 'Scheduled'
  ) => {
    const nextStatus =
      currentStatus === 'Pending'
        ? 'In Progress'
        : currentStatus === 'In Progress'
        ? 'Scheduled'
        : 'In Progress';
    updateRecommendationStatus(selectedCase.id, recId, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Automated Root-Cause Diagnostic Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Rule Engine v1.4
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Diagnosis & Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Synthesize observed statistical signals, explanation drift patterns, and data quality checks
            into transparent, evidence-based diagnostic explanations and concrete mitigation workflows.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
            Simulated Rule-Based Demonstration
          </span>
        </div>
      </div>

      {/* Two Column Diagnostic Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Detected / Simulated Diagnostic Cases */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 font-mono">
            Active Diagnostic Cases ({diagnosisCases.length})
          </div>

          {diagnosisCases.map((c) => {
            const isSelected = c.id === selectedCase.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        c.severity === 'Elevated'
                          ? 'bg-amber-500 animate-pulse'
                          : c.severity === 'Critical'
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {c.title}
                    </h3>
                  </div>
                  <StatusBadge status={c.severity} size="sm" />
                </div>

                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {c.likelyRootCause}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{c.timestamp}</span>
                  <span className="font-semibold text-indigo-600">
                    Confidence: {c.confidence}%
                  </span>
                </div>
              </div>
            );
          })}

          {/* Theoretical Diagnostic Rules Reference Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Multi-Signal Decision Rules</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              XENITH discriminates between:
            </p>
            <ul className="text-[11px] text-slate-600 space-y-1 pl-1">
              <li><strong>High DDS + Low EDS:</strong> Benign covariate shift; model decision invariant.</li>
              <li><strong>High DDS + High EDS:</strong> Severe covariate drift with attribution reordering.</li>
              <li><strong>Low DDS + High EDS:</strong> Stealth concept drift or silent adversarial shift.</li>
              <li><strong>Missingness Spike:</strong> Upstream ETL or API schema failure.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Detailed Diagnostic Dossier for Selected Case */}
        <div className="lg:col-span-7 space-y-6">
          {/* Diagnostic Dossier Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    Case ID: {selectedCase.id}
                  </span>
                  <StatusBadge status={selectedCase.status} size="sm" />
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {selectedCase.title}
                </h2>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400 block">Rule Confidence</span>
                <span className="text-xl font-extrabold font-mono text-indigo-600">
                  {selectedCase.confidence}%
                </span>
              </div>
            </div>

            {/* Supporting Metrics Grid */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                Corroborating Telemetry Signals
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {selectedCase.supportingMetrics.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-mono block text-[11px] truncate" title={m.label}>
                      {m.label}
                    </span>
                    <span
                      className={`text-base font-bold font-mono mt-1 block ${
                        m.status === 'severe'
                          ? 'text-rose-600'
                          : m.status === 'elevated'
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Observed Evidence Bullets */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                Observed Empirical Evidence
              </span>
              <ul className="space-y-2 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                {selectedCase.observedEvidence.map((ev, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-indigo-600 font-bold font-mono mt-0.5">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Likely Root Cause Panel */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Primary Diagnostic Hypothesis (Rule Evaluator)</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {selectedCase.likelyRootCause}
              </p>
            </div>

            {/* Alternative Hypotheses Ruled Out */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                Alternative Hypotheses Considered & Disproven
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedCase.alternativeHypotheses.map((alt, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-mono">✕</span>
                    <span className="leading-relaxed">{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations Section */}
          <SectionCard
            title="Recommended Corrective Actions"
            subtitle="Tiered human-in-the-loop intervention protocols ordered by priority"
            demoNotice="Interactive adaptation workflow"
          >
            <div className="space-y-4">
              {selectedCase.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                          rec.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {rec.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={rec.status} size="sm" />
                      <button
                        type="button"
                        onClick={() => handleRecommendationAction(rec.id, rec.status)}
                        className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                      >
                        {rec.status === 'Pending'
                          ? 'Start Action'
                          : rec.status === 'In Progress'
                          ? 'Mark Scheduled'
                          : 'Review Progress'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                    <div className="text-emerald-800 bg-emerald-50/60 p-2 rounded border border-emerald-100">
                      <strong>Expected Benefit:</strong> {rec.expectedBenefit}
                    </div>
                    <div className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                      <strong>Known Limitation:</strong> {rec.limitations}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono text-center">
              Safety Guardrail: Autonomous model retraining or direct production deployment is intentionally disabled.
              All adaptations require human-in-the-loop sign-off.
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
