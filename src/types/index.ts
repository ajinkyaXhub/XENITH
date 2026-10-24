export type ModelId = 'credit-card-fraud' | 'loan-approval';

export type NavigationPage =
  | 'overview'
  | 'monitoring'
  | 'explanation-drift'
  | 'drift-lab'
  | 'model-health'
  | 'diagnosis'
  | 'experiments'
  | 'reports'
  | 'settings';

export type DriftSeverity = 'Low' | 'Moderate' | 'Elevated' | 'Severe';

export interface ModelInfo {
  id: ModelId;
  name: string;
  type: string;
  algorithm: string;
  version: string;
  referenceDataset: string;
  referenceCount: number;
  currentBatch: string;
  currentCount: number;
  lastEvaluation: string;
  description: string;
}

export interface KpiMetric {
  title: string;
  value: string | number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical' | 'neutral';
  statusText: string;
  deltaText: string;
  deltaType: 'increase' | 'decrease' | 'neutral';
  tooltip: string;
  badgeColor: string;
}

export interface HealthScoreData {
  overallScore: number;
  status: 'Healthy' | 'Stable' | 'Warning' | 'Critical';
  statusColor: string;
  modelType: string;
  referenceDataset: string;
  currentBatch: string;
  lastEvaluated: string;
  weights: {
    dataDrift: number;
    explanationDrift: number;
    predictionStability: number;
    performanceDelayed: number;
  };
  deductions: {
    dataDrift: number;
    explanationDrift: number;
    predictionStability: number;
    performanceDelayed: number;
  };
}

export interface TimeSeriesPoint {
  batch: string;
  healthScore: number;
  dataDriftScore: number;
  explanationDriftScore: number;
  predictionStability: number;
  f1Score?: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface PredictionDistBin {
  bucket: string;
  referencePercentage: number;
  currentPercentage: number;
}

export interface FeatureDriftSummary {
  id: string;
  name: string;
  type: 'Numerical' | 'Categorical';
  refMean: string;
  currMean: string;
  driftMetric: string; // e.g. "KS: 0.38" or "PSI: 0.24"
  driftValue: number;
  severity: DriftSeverity;
  pVal: number;
  status: 'drifted' | 'stable' | 'warning';
  missingRef: string;
  missingCurr: string;
  refDistribution: { value: string; count: number }[];
  currDistribution: { value: string; count: number }[];
}

export interface PlatformAlert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  pageTarget: NavigationPage;
  read: boolean;
  feature?: string;
}

export interface ShapFeatureData {
  feature: string;
  referenceShap: number;
  currentShap: number;
  relativeChange: number; // percentage
  rankShift: number;
  interpretation: string;
  significance: 'Critical' | 'Notable' | 'Minor';
}

export type DriftLabType =
  | 'Covariate Drift'
  | 'Concept Drift'
  | 'Prior-Probability Shift'
  | 'Feature Corruption';

export type DriftLabSeverity = 'Mild' | 'Moderate' | 'Severe';
export type DriftLabPattern = 'Abrupt' | 'Gradual' | 'Recurring';

export interface DriftLabConfig {
  driftType: DriftLabType;
  severity: DriftLabSeverity;
  pattern: DriftLabPattern;
  affectedFeature: string;
  sampleSize: number;
  batchCount: number;
  randomSeed: number;
  startBatch: number;
}

export interface DriftLabResult {
  scenarioName: string;
  config: DriftLabConfig;
  simulatedDDS: number;
  simulatedEDS: number;
  detectionStatus: 'Detected' | 'Warning' | 'Undetected';
  detectionDelay: string;
  likelyDiagnosis: string;
  recommendedAction: string;
  confidenceScore: number;
  sampleRows: SyntheticDataRow[];
  distributionPreview: { bucket: string; baseline: number; synthetic: number }[];
  timestamp: string;
}

export interface SyntheticDataRow {
  id: string;
  transactionAmount: number;
  transactionFreq: number;
  deviceRiskScore: number;
  transactionHour: number;
  accountAgeMonths: number;
  merchantRiskIndex: number;
  predictionScore: number;
  isDriftFlagged: boolean;
}

export interface DiagnosisCase {
  id: string;
  title: string;
  status: 'Investigating' | 'Verified' | 'Mitigated';
  severity: 'Critical' | 'Elevated' | 'Moderate' | 'Low';
  confidence: number;
  timestamp: string;
  observedEvidence: string[];
  supportingMetrics: { label: string; value: string; status: 'normal' | 'elevated' | 'severe' }[];
  likelyRootCause: string;
  alternativeHypotheses: string[];
  recommendations: RecommendationItem[];
}

export interface RecommendationItem {
  id: string;
  title: string;
  type: 'Preprocessing' | 'Data Verification' | 'Threshold Tuning' | 'Model Adaptation';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  expectedBenefit: string;
  limitations: string;
  status: 'Pending' | 'In Progress' | 'Scheduled';
}

export interface ExperimentRecord {
  id: string;
  name: string;
  date: string;
  scenarioType: string;
  severity: string;
  pattern: string;
  baselineMethod: string;
  detectionDelay: number; // in batches
  falseAlarmRate: number; // percentage
  diagnosisAccuracy: number; // percentage
  runtimePerBatch: string;
  status: 'Completed' | 'Benchmarked';
  notes: string;
}

export interface PlatformSettings {
  modelDisplayName: string;
  defaultMonitoringWindow: string;
  thresholds: {
    healthyMin: number;
    stableMin: number;
    warningMin: number;
    criticalMin: number;
  };
  componentWeights: {
    dataDrift: number;
    explanationDrift: number;
    predictionStability: number;
    delayedPerformance: number;
  };
  alertPreferences: {
    emailOnCritical: boolean;
    highSeveritySound: boolean;
    autoFlagShapShifts: boolean;
  };
  displayMode: 'standard' | 'compact';
}
