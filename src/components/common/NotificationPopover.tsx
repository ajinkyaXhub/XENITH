import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, ExternalLink, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PlatformAlert } from '../../types';

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { alerts, unreadAlertCount, markAlertRead, markAllAlertsRead, setActivePage } =
    usePlatform();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAlertClick = (alert: PlatformAlert) => {
    markAlertRead(alert.id);
    setActivePage(alert.pageTarget);
    setIsOpen(false);
  };

  const getSeverityIcon = (sev: string) => {
    if (sev === 'high') return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
    if (sev === 'medium') return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
    return <Info className="w-4 h-4 text-cyan-500 shrink-0" />;
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden"
        title="Monitoring Alerts & Notifications"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadAlertCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
            {unreadAlertCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Popover Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">Alerts & Signals</span>
              {unreadAlertCount > 0 && (
                <span className="text-xs bg-rose-100 text-rose-700 font-medium px-2 py-0.5 rounded-full">
                  {unreadAlertCount} new
                </span>
              )}
            </div>
            {unreadAlertCount > 0 && (
              <button
                type="button"
                onClick={markAllAlertsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List of Alerts */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                No active alerts in this monitoring batch.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                    !alert.read ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          !alert.read ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {alert.title}
                      </h4>
                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{alert.timestamp}</span>
                      <span className="text-indigo-600 hover:underline flex items-center gap-1">
                        Inspect <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Popover Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-mono">
              Live rule engine evaluation • Simulated demonstration stream
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
