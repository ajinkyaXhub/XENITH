import React from 'react';

interface HealthGaugeProps {
  score: number;
  status: 'Healthy' | 'Stable' | 'Warning' | 'Critical';
  size?: number;
  showLabels?: boolean;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  status,
  size = 190,
  showLabels = true,
}) => {
  // SVG radius & coordinates
  const radius = 70;
  const strokeWidth = 12;
  const cx = 100;
  const cy = 90;

  // Semicircle circumference = PI * r
  const arcLength = Math.PI * radius;
  // Score percentage 0..100 clamped
  const clampedScore = Math.max(0, Math.min(100, score));
  const progressOffset = arcLength * (1 - clampedScore / 100);

  // Determine stroke color
  let strokeColor = '#10B981'; // Healthy green
  let statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (clampedScore < 50) {
    strokeColor = '#EF4444'; // Critical red
    statusBg = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (clampedScore < 70) {
    strokeColor = '#F59E0B'; // Warning amber
    statusBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (clampedScore < 90) {
    strokeColor = '#06B6D4'; // Stable cyan/blue
    statusBg = 'bg-cyan-50 text-cyan-800 border-cyan-200';
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg
        width={size}
        height={size * 0.58}
        viewBox="0 0 200 115"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gaugeBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="gaugeProgress" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={strokeColor} />
          </linearGradient>
        </defs>

        {/* Background Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#gaugeBg)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#gaugeProgress)"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />

        {/* Threshold Markers */}
        {/* Warning threshold at 70% (180 - 70*1.8 = 54 deg) */}
        {/* Critical threshold at 50% (180 - 50*1.8 = 90 deg) */}
        <circle cx={cx} cy={cy - radius} r="2.5" fill="#94A3B8" />

        {/* Inner Score text */}
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          className="font-bold fill-slate-900"
          style={{ fontSize: '32px', fontFamily: 'JetBrains Mono, monospace' }}
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          className="font-medium fill-slate-400 text-xs"
          style={{ fontSize: '11px' }}
        >
          / 100
        </text>
      </svg>

      {/* Status Pill below */}
      <div className="mt-1 flex items-center gap-2">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBg} flex items-center gap-1.5`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: strokeColor }}
          />
          {status} Status
        </span>
      </div>

      {showLabels && (
        <div className="w-full flex justify-between text-[11px] font-mono text-slate-400 mt-1 px-4">
          <span>0 (Critical)</span>
          <span>50 (Warn)</span>
          <span>70 (Stable)</span>
          <span>100</span>
        </div>
      )}
    </div>
  );
};
