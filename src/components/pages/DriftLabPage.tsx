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
  FlaskConical,
  Play,
  RotateCcw,
  Download,
  FileJson,
  BookmarkPlus,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  Layers,
  Sliders,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SectionCard } from '../common/SectionCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  DriftLabConfig,
  DriftLabResult,
  DriftLabType,
  DriftLabSeverity,
  DriftLabPattern,
  SyntheticDataRow,
  ExperimentRecord,
} from '../../types';
import { INITIAL_SYNTHETIC_ROWS } from '../../data/mockData';

export const DriftLabPage: React.FC = () => {
  const { addExperiment, showToast } = usePlatform();

  // Configuration State
  const [config, setConfig] = useState<DriftLabConfig>({
    driftType: 'Covariate Drift',
    severity: 'Moderate',
    pattern: 'Abrupt',
    affectedFeature: 'Transaction Amount',
    sampleSize: 100000,
    batchCount: 15,
    randomSeed: 42,
    startBatch: 8,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<DriftLabResult | null>(null);

  // Dynamic explanations for Drift Types
  const driftTypeExplanations: Record<DriftLabType, string> = {
    'Covariate Drift':
      'Changes the distribution of input features P(X) while intending to preserve the feature-outcome conditional relationship P(Y|X). In this scenario, input transactions shift toward higher amounts or riskier devices, but identical inputs still have the same true fraud risk.',
    'Concept Drift':
      'Simulates a structural change in the relationship between inputs and outcomes P(Y|X). For example, fraud tactics evolve so that small, seemingly benign transactions are now fraudulent. This causes model predictions to become inaccurate even if input distributions appear stable.',
    'Prior-Probability Shift':
      'Changes the outcome-class proportions P(Y) while aiming to preserve class-conditional feature distributions P(X|Y). E.g., an overall surge in card fraud prevalence across the entire transaction volume.',
    'Feature Corruption':
      'Introduces pipeline data-quality problems such as missing values, scaling errors, telemetry noise, or extreme sensor outliers into the feature engineering stream.',
  };

  // Distribution chart preview data based on config
  const getDistributionPreview = () => {
    const isSevere = config.severity === 'Severe';
    const isModerate = config.severity === 'Moderate';

    if (config.driftType === 'Covariate Drift') {
      return [
        { bucket: 'Tier 1 (Low)', baseline: 45, synthetic: isSevere ? 15 : isModerate ? 25 : 35 },
        { bucket: 'Tier 2 (Med)', baseline: 35, synthetic: isSevere ? 30 : isModerate ? 35 : 35 },
        { bucket: 'Tier 3 (High)', baseline: 15, synthetic: isSevere ? 35 : isModerate ? 25 : 20 },
        { bucket: 'Tier 4 (Risk)', baseline: 5, synthetic: isSevere ? 20 : isModerate ? 15 : 10 },
      ];
    } else if (config.driftType === 'Concept Drift') {
      return [
        { bucket: 'Bucket 0-25%', baseline: 60, synthetic: isSevere ? 40 : 50 },
        { bucket: 'Bucket 25-50%', baseline: 25, synthetic: isSevere ? 28 : 26 },
        { bucket: 'Bucket 50-75%', baseline: 10, synthetic: isSevere ? 20 : 15 },
        { bucket: 'Bucket 75-100%', baseline: 5, synthetic: isSevere ? 12 : 9 },
      ];
    } else if (config.driftType === 'Prior-Probability Shift') {
      return [
        { bucket: 'Non-Fraud (0)', baseline: 96.8, synthetic: isSevere ? 88.0 : 92.5 },
        { bucket: 'Fraud Label (1)', baseline: 3.2, synthetic: isSevere ? 12.0 : 7.5 },
      ];
    } else {
      // Feature Corruption
      return [
        { bucket: 'Valid Range', baseline: 99.2, synthetic: isSevere ? 82.0 : 91.5 },
        { bucket: 'Null / Missing', baseline: 0.1, synthetic: isSevere ? 8.5 : 4.2 },
        { bucket: 'Extreme Outlier (>5σ)', baseline: 0.7, synthetic: isSevere ? 9.5 : 4.3 },
      ];
    }
  };

  const handleRunExperiment = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);

      // Generate deterministic metrics from seed and parameters
      const sevMultiplier = config.severity === 'Severe' ? 1.4 : config.severity === 'Moderate' ? 1.0 : 0.6;
      const seedFactor = (config.randomSeed % 10) * 0.01;

      const simDDS = Number((0.28 * sevMultiplier + seedFactor).toFixed(2));
      const simEDS = Number((0.24 * sevMultiplier + (config.driftType === 'Concept Drift' ? 0.08 : 0)).toFixed(2));

      const detectionStatus = simDDS > 0.3 || simEDS > 0.25 ? 'Detected' : 'Warning';
      const delayBatches = config.pattern === 'Abrupt' ? '1.2 batches' : config.pattern === 'Gradual' ? '2.4 batches' : '1.8 batches';

      const simulatedRows: SyntheticDataRow[] = INITIAL_SYNTHETIC_ROWS.map((row, idx) => ({
        ...row,
        transactionAmount:
          config.affectedFeature === 'Transaction Amount' || config.affectedFeature === 'All eligible features'
            ? Number((row.transactionAmount * (config.severity === 'Severe' ? 1.8 : 1.35)).toFixed(1))
            : row.transactionAmount,
        deviceRiskScore:
          config.affectedFeature === 'Device Risk Score' || config.affectedFeature === 'All eligible features'
            ? Math.min(100, Number((row.deviceRiskScore * (config.severity === 'Severe' ? 1.6 : 1.25)).toFixed(1)))
            : row.deviceRiskScore,
        predictionScore:
          config.severity === 'Severe'
            ? Math.min(0.99, Number((row.predictionScore + 0.14).toFixed(2)))
            : row.predictionScore,
        isDriftFlagged: idx % 2 === 0 || config.severity === 'Severe',
      }));

      const newResult: DriftLabResult = {
        scenarioName: `${config.driftType} (${config.severity}) on ${config.affectedFeature}`,
        config: { ...config },
        simulatedDDS: simDDS,
        simulatedEDS: simEDS,
        detectionStatus,
        detectionDelay: delayBatches,
        likelyDiagnosis:
          config.driftType === 'Covariate Drift'
            ? 'Input distribution shift; feature-outcome relationship remains intact. Consider threshold adjustment.'
            : config.driftType === 'Concept Drift'
            ? 'Structural concept shift; model decision boundary degraded. Re-labelling and shadow retraining indicated.'
            : config.driftType === 'Prior-Probability Shift'
            ? 'Prior fraud rate shift; baseline prevalence recalibration recommended.'
            : 'Feature pipeline corruption detected; audit upstream data ingestion and imputation.',
        recommendedAction:
          config.driftType === 'Covariate Drift'
            ? 'Evaluate classification threshold recalibration and inspect input pipeline.'
            : config.driftType === 'Concept Drift'
            ? 'Accelerate human verification batch for ground truth retraining.'
            : 'Audit data ingestion schema and verify missingness handlers.',
        confidenceScore: Math.min(95, Math.floor(75 + sevMultiplier * 12)),
        sampleRows: simulatedRows,
        distributionPreview: getDistributionPreview(),
        timestamp: new Date().toLocaleTimeString(),
      };

      setLastResult(newResult);
      showToast('Drift simulation completed. Evaluated against synthetic stream.');
    }, 500);
  };

  const handleReset = () => {
    setConfig({
      driftType: 'Covariate Drift',
      severity: 'Moderate',
      pattern: 'Abrupt',
      affectedFeature: 'Transaction Amount',
      sampleSize: 100000,
      batchCount: 15,
      randomSeed: 42,
      startBatch: 8,
    });
    setLastResult(null);
    showToast('Drift Lab configuration reset to defaults.');
  };

  const handleDownloadCsv = () => {
    const rows = lastResult?.sampleRows || INITIAL_SYNTHETIC_ROWS;
    const header = 'id,transactionAmount,transactionFreq,deviceRiskScore,transactionHour,accountAgeMonths,merchantRiskIndex,predictionScore,isDriftFlagged\n';
    const csvContent =
      header +
      rows
        .map(
          (r) =>
            `${r.id},${r.transactionAmount},${r.transactionFreq},${r.deviceRiskScore},${r.transactionHour},${r.accountAgeMonths},${r.merchantRiskIndex},${r.predictionScore},${r.isDriftFlagged}`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `xenith_synthetic_${config.driftType.toLowerCase().replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Synthetic dataset CSV downloaded to local disk.');
  };

  const handleExportJson = () => {
    const exportData = {
      product: 'XENITH AI Observability',
      environment: 'Drift Lab Prototype',
      config,
      result: lastResult,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `xenith_scenario_seed_${config.randomSeed}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Experiment configuration exported as JSON.');
  };

  const handleSaveToHistory = () => {
    if (!lastResult) return;
    const newExp: ExperimentRecord = {
      id: `lab-exp-${Date.now()}`,
      name: `Synthetic ${config.driftType} (${config.severity})`,
      date: new Date().toLocaleDateString(),
      scenarioType: config.driftType,
      severity: config.severity,
      pattern: config.pattern,
      baselineMethod: 'XENITH Multi-Signal Engine',
      detectionDelay: parseFloat(lastResult.detectionDelay),
      falseAlarmRate: 4.8,
      diagnosisAccuracy: lastResult.confidenceScore,
      runtimePerBatch: '98ms',
      status: 'Completed',
      notes: `Lab experiment generated with seed ${config.randomSeed} on ${config.affectedFeature}. ${lastResult.likelyDiagnosis}`,
    };
    addExperiment(newExp);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
              Controlled Experimentation Environment
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              SIMULATED EXPERIMENT — No production model affected
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Drift Lab & Synthetic Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Generate controlled statistical shifts in test datasets to evaluate XENITH’s proposed multi-signal
            monitoring, explanation drift (EDS) sensitivity, and automated diagnosis rules.
          </p>
        </div>

        {/* Global Experiment Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Config</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scenario Configuration Controls */}
        <div className="lg:col-span-5 space-y-4">
          <SectionCard
            title="Scenario Configuration"
            subtitle="Configure synthetic drift parameters, distribution mutations, and seed"
          >
            <div className="space-y-4 text-xs">
              {/* Drift Type */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Drift Scenario Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'Covariate Drift',
                      'Concept Drift',
                      'Prior-Probability Shift',
                      'Feature Corruption',
                    ] as DriftLabType[]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConfig({ ...config, driftType: type })}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        config.driftType === type
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-xs">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Contextual Explanation Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed text-[11px]">
                <strong className="text-slate-800 block mb-1">
                  Theoretical Definition:
                </strong>
                {driftTypeExplanations[config.driftType]}
              </div>

              {/* Severity & Pattern Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Severity */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Drift Severity
                  </label>
                  <select
                    value={config.severity}
                    onChange={(e) =>
                      setConfig({ ...config, severity: e.target.value as DriftLabSeverity })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:outline-hidden"
                  >
                    <option value="Mild">Mild (+15% shift)</option>
                    <option value="Moderate">Moderate (+35% shift)</option>
                    <option value="Severe">Severe (+80% shift)</option>
                  </select>
                </div>

                {/* Pattern */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Temporal Pattern
                  </label>
                  <select
                    value={config.pattern}
                    onChange={(e) =>
                      setConfig({ ...config, pattern: e.target.value as DriftLabPattern })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:outline-hidden"
                  >
                    <option value="Abrupt">Abrupt (Step shift)</option>
                    <option value="Gradual">Gradual (Linear ramp)</option>
                    <option value="Recurring">Recurring (Seasonal wave)</option>
                  </select>
                </div>
              </div>

              {/* Affected Feature */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Targeted Feature Vector
                </label>
                <select
                  value={config.affectedFeature}
                  onChange={(e) => setConfig({ ...config, affectedFeature: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:outline-hidden"
                >
                  <option value="Transaction Amount">Transaction Amount ($)</option>
                  <option value="Device Risk Score">Device Risk Score (0-100)</option>
                  <option value="Transaction Frequency">Transaction Frequency (tx/hr)</option>
                  <option value="Transaction Time">Transaction Time (Hour)</option>
                  <option value="Account Age">Account Age (Months)</option>
                  <option value="All eligible features">All Eligible Features (Joint Covariate)</option>
                </select>
              </div>

              {/* Numerical Parameters: Sliders */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">Simulated Batches:</span>
                    <span className="font-mono font-bold text-indigo-600">{config.batchCount} batches</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={config.batchCount}
                    onChange={(e) => setConfig({ ...config, batchCount: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Random Seed
                    </label>
                    <input
                      type="number"
                      value={config.randomSeed}
                      onChange={(e) => setConfig({ ...config, randomSeed: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-mono text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Drift Start Batch
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={config.batchCount - 1}
                      value={config.startBatch}
                      onChange={(e) => setConfig({ ...config, startBatch: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Run Button */}
              <button
                type="button"
                onClick={handleRunExperiment}
                disabled={isRunning}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
                <span>{isRunning ? 'Simulating Mutation...' : 'Run Simulation on Test Stream'}</span>
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Right Column: Dataset Preview and Experiment Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Distribution Preview Chart */}
          <SectionCard
            title="Distribution Impact Preview"
            subtitle={`Visual comparison of baseline vs synthetic mutated stream under ${config.driftType}`}
            demoNotice="Synthetic data preview"
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lastResult ? lastResult.distributionPreview : getDistributionPreview()}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
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
                    dataKey="baseline"
                    name="Reference Baseline"
                    fill="#94A3B8"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="synthetic"
                    name={`Synthetic (${config.severity})`}
                    fill="#4F46E5"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Experiment Result Panel (Displays when run or by default) */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">
                  {lastResult ? 'Latest Simulation Evaluation Report' : 'Awaiting Simulation Run'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                Illustrative result — not a real model evaluation
              </span>
            </div>

            {lastResult ? (
              <div className="mt-4 space-y-4">
                {/* 4 Score Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-mono block text-[11px]">Simulated DDS</span>
                    <span className="text-base font-extrabold font-mono text-slate-900 mt-0.5 block">
                      {lastResult.simulatedDDS}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-mono block text-[11px]">Simulated EDS</span>
                    <span className="text-base font-extrabold font-mono text-indigo-600 mt-0.5 block">
                      {lastResult.simulatedEDS}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-mono block text-[11px]">Detection Status</span>
                    <span className="text-base font-extrabold font-mono text-rose-600 mt-0.5 block">
                      {lastResult.detectionStatus}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-mono block text-[11px]">Detection Delay</span>
                    <span className="text-base font-extrabold font-mono text-emerald-600 mt-0.5 block">
                      {lastResult.detectionDelay}
                    </span>
                  </div>
                </div>

                {/* Automated Diagnosis & Recommendation Output */}
                <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 font-mono">Simulated Rule Diagnosis:</span>
                    <span className="text-[11px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      Confidence: {lastResult.confidenceScore}%
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {lastResult.likelyDiagnosis}
                  </p>
                  <div className="pt-2 border-t border-indigo-200/60 text-slate-800 text-[11px] flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Action: {lastResult.recommendedAction}</span>
                  </div>
                </div>

                {/* Result Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download Synthetic CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <FileJson className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export Config (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToHistory}
                    className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-lg border border-indigo-200 transition-colors ml-auto"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Save to Experiment Tracking</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Click <strong>"Run Simulation on Test Stream"</strong> to trigger the synthetic mutation
                pipeline and view multi-signal detection metrics.
              </div>
            )}
          </div>

          {/* Sample Synthetic Records Table */}
          <SectionCard
            title="Generated Synthetic Sample Records"
            subtitle="Preview of incoming feature vectors generated by the current simulator seed"
            noPadding
          >
            <div className="overflow-x-auto max-h-56">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2 px-3">Tx ID</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Freq</th>
                    <th className="py-2 px-3">Device Risk</th>
                    <th className="py-2 px-3">Score</th>
                    <th className="py-2 px-3 text-right">Drift Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {(lastResult?.sampleRows || INITIAL_SYNTHETIC_ROWS).slice(0, 6).map((r) => (
                    <tr
                      key={r.id}
                      className={r.isDriftFlagged ? 'bg-amber-50/40' : 'hover:bg-slate-50'}
                    >
                      <td className="py-2 px-3 font-semibold text-slate-700">{r.id}</td>
                      <td className="py-2 px-3 text-slate-900">${r.transactionAmount}</td>
                      <td className="py-2 px-3 text-slate-600">{r.transactionFreq}/hr</td>
                      <td className="py-2 px-3 text-slate-900 font-bold">{r.deviceRiskScore}</td>
                      <td className="py-2 px-3 text-indigo-600 font-bold">{r.predictionScore}</td>
                      <td className="py-2 px-3 text-right">
                        {r.isDriftFlagged ? (
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                            MUTATED
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">BASELINE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
