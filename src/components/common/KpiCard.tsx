import React, { useState } from 'react';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: string;
  deltaText: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
  deltaSeverity?: 'good' | 'bad' | 'neutral';
  tooltipText: string;
  metricType?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  status,
  deltaText,
  deltaDirection = 'neutral',
  deltaSeverity = 'neutral',
  tooltipText,
  metricType,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getDeltaIcon = () => {
    if (deltaDirection === 'up') return <TrendingUp className="w-3.5 h-3.5" />;
    if (deltaDirection === 'down') return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getDeltaColor = () => {
    if (deltaSeverity === 'bad') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (deltaSeverity === 'good') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>{title}</span>
          <div className="relative inline-block">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip((p) => !p)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded focus:outline-hidden"
              aria-label="Metric information"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            {showTooltip && (
              <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none">
                <p className="font-normal leading-relaxed">{tooltipText}</p>
                <div className="mt-1 pt-1 border-t border-slate-700/80 text-[10px] text-cyan-300 font-mono">
                  Illustrative metric • Demo simulation
                </div>
              </div>
            )}
          </div>
        </div>

        <StatusBadge status={status} size="sm" />
      </div>

      {/* Value */}
      <div className="my-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
          {value}
        </span>
        {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
      </div>

      {/* Bottom Trend & Method */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <div
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border ${getDeltaColor()}`}
        >
          {getDeltaIcon()}
          <span>{deltaText}</span>
        </div>
        {metricType && (
          <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]" title={metricType}>
            {metricType}
          </span>
        )}
      </div>
    </div>
  );
};
