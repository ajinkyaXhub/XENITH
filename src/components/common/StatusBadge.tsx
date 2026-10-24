import React from 'react';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  dot = true,
}) => {
  const norm = status.toLowerCase();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (norm.includes('healthy') || norm.includes('stable') || norm.includes('normal') || norm.includes('low') || norm.includes('mitigated')) {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    dotColor = 'bg-emerald-500';
  } else if (norm.includes('warning') || norm.includes('moderate') || norm.includes('elevated') || norm.includes('investigating')) {
    bg = 'bg-amber-50 text-amber-700 border-amber-200/80';
    dotColor = 'bg-amber-500';
  } else if (norm.includes('critical') || norm.includes('severe') || norm.includes('drifted') || norm.includes('high')) {
    bg = 'bg-rose-50 text-rose-700 border-rose-200/80';
    dotColor = 'bg-rose-500';
  } else if (norm.includes('benchmarked') || norm.includes('scheduled') || norm.includes('completed')) {
    bg = 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
    dotColor = 'bg-indigo-500';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${bg} ${sizeClasses} tracking-tight transition-colors shadow-2xs`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />}
      <span>{status}</span>
    </span>
  );
};
