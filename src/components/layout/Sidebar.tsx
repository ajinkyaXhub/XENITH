import React from 'react';
import {
  LayoutDashboard,
  Activity,
  BrainCircuit,
  FlaskConical,
  ShieldCheck,
  GitMerge,
  BarChart3,
  FileText,
  Settings,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { NavigationPage } from '../../types';

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, unreadAlertCount } = usePlatform();

  const primaryNavItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: unreadAlertCount > 0 ? `${unreadAlertCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'monitoring',
      label: 'Model Monitoring',
      icon: Activity,
    },
    {
      id: 'explanation-drift',
      label: 'Explanation Drift',
      icon: BrainCircuit,
      badge: 'EDS',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    },
    {
      id: 'drift-lab',
      label: 'Drift Lab',
      icon: FlaskConical,
      badge: 'Interactive',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'model-health',
      label: 'Model Health',
      icon: ShieldCheck,
      badge: '82 Warning',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'diagnosis',
      label: 'Diagnosis & Actions',
      icon: GitMerge,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      id: 'experiments',
      label: 'Experiments',
      icon: BarChart3,
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-68 bg-[#0F172A] text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Branding Section */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {/* Geometric Wordmark Emblem */}
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Layers className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-wider font-mono">
                  XENITH
                </span>
                <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-400 text-[10px] font-mono rounded font-medium border border-indigo-500/30">
                  AI-X
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                Explainable Drift Diagnosis
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Observability Suite
            </div>
            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Research & Governance
            </div>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Metadata & Workspace Info */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* Environment Badge */}
        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Demo Environment</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
            PROTOTYPE
          </span>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40 border border-slate-800/60">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
            <GraduationCap className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">
              Research Workspace
            </div>
            <div className="text-[10px] text-slate-400 truncate font-mono">
              Final-Year ML Project
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
