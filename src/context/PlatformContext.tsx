import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  NavigationPage,
  ModelId,
  ModelInfo,
  HealthScoreData,
  TimeSeriesPoint,
  FeatureDriftSummary,
  PlatformAlert,
  DiagnosisCase,
  ExperimentRecord,
  PlatformSettings,
} from '../types';
import {
  MODELS_DATA,
  INITIAL_HEALTH_DATA,
  TIME_SERIES_HISTORY,
  FEATURES_DRIFT_LIST,
  RECENT_ALERTS,
  DIAGNOSIS_CASES,
  BENCHMARK_EXPERIMENTS,
  INITIAL_SETTINGS,
} from '../data/mockData';

interface PlatformContextType {
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  selectedModelId: ModelId;
  setSelectedModelId: (id: ModelId) => void;
  currentModel: ModelInfo;
  selectedBatch: string;
  setSelectedBatch: (batch: string) => void;
  healthData: HealthScoreData;
  timeSeriesHistory: TimeSeriesPoint[];
  featuresDrift: FeatureDriftSummary[];
  selectedFeatureId: string;
  setSelectedFeatureId: (id: string) => void;
  alerts: PlatformAlert[];
  unreadAlertCount: number;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  diagnosisCases: DiagnosisCase[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  updateRecommendationStatus: (caseId: string, recId: string, status: 'Pending' | 'In Progress' | 'Scheduled') => void;
  experiments: ExperimentRecord[];
  addExperiment: (exp: ExperimentRecord) => void;
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  resetDemoState: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavigationPage>('overview');
  const [selectedModelId, setSelectedModelId] = useState<ModelId>('credit-card-fraud');
  const [selectedBatch, setSelectedBatch] = useState<string>('Batch 024 (Latest - Elevated Drift)');
  const [healthData, setHealthData] = useState<HealthScoreData>(INITIAL_HEALTH_DATA);
  const [timeSeriesHistory] = useState<TimeSeriesPoint[]>(TIME_SERIES_HISTORY);
  const [featuresDrift] = useState<FeatureDriftSummary[]>(FEATURES_DRIFT_LIST);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('tx_amount');
  const [alerts, setAlerts] = useState<PlatformAlert[]>(RECENT_ALERTS);
  const [diagnosisCases, setDiagnosisCases] = useState<DiagnosisCase[]>(DIAGNOSIS_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-001');
  const [experiments, setExperiments] = useState<ExperimentRecord[]>(BENCHMARK_EXPERIMENTS);
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem('xenith_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('xenith_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    );
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
    showToast('All notifications marked as read.');
  };

  const updateRecommendationStatus = (
    caseId: string,
    recId: string,
    status: 'Pending' | 'In Progress' | 'Scheduled'
  ) => {
    setDiagnosisCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          recommendations: c.recommendations.map((r) =>
            r.id === recId ? { ...r, status } : r
          ),
        };
      })
    );
    showToast(`Recommendation updated to "${status}".`);
  };

  const addExperiment = (exp: ExperimentRecord) => {
    setExperiments((prev) => [exp, ...prev]);
    showToast(`Experiment "${exp.name}" saved to tracking history.`);
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully.');
  };

  const resetDemoState = () => {
    setActivePage('overview');
    setSelectedModelId('credit-card-fraud');
    setSelectedBatch('Batch 024 (Latest - Elevated Drift)');
    setHealthData(INITIAL_HEALTH_DATA);
    setSelectedFeatureId('tx_amount');
    setAlerts(RECENT_ALERTS);
    setDiagnosisCases(DIAGNOSIS_CASES);
    setSelectedCaseId('case-001');
    setExperiments(BENCHMARK_EXPERIMENTS);
    setSettings(INITIAL_SETTINGS);
    try {
      localStorage.removeItem('xenith_settings');
    } catch {
      // ignore
    }
    showToast('Demo environment reset to baseline state.');
  };

  const currentModel = MODELS_DATA[selectedModelId] || MODELS_DATA['credit-card-fraud'];
  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  return (
    <PlatformContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedModelId,
        setSelectedModelId,
        currentModel,
        selectedBatch,
        setSelectedBatch,
        healthData,
        timeSeriesHistory,
        featuresDrift,
        selectedFeatureId,
        setSelectedFeatureId,
        alerts,
        unreadAlertCount,
        markAlertRead,
        markAllAlertsRead,
        diagnosisCases,
        selectedCaseId,
        setSelectedCaseId,
        updateRecommendationStatus,
        experiments,
        addExperiment,
        settings,
        updateSettings,
        resetDemoState,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
