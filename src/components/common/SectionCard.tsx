import React from 'react';

interface SectionCardProps {
  title?: React.ReactNode;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  demoNotice?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  footer,
  className = '',
  noPadding = false,
  demoNotice,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col ${className}`}
    >
      {(title || headerAction) && (
        <div className="px-6 py-4.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div>
            {typeof title === 'string' ? (
              <h2 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                {title}
              </h2>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 leading-normal">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}

      <div className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>

      {(footer || demoNotice) && (
        <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div>{footer}</div>
          {demoNotice && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {demoNotice}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
