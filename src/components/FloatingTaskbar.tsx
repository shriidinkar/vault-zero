import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  BrainCircuit,
  Landmark,
  Upload,
  Sliders,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';
import { MainNavPillar } from '../types.js';

interface FloatingTaskbarProps {
  activePillar: MainNavPillar;
  onSelectPillar: (pillar: MainNavPillar) => void;
  pendingExceptionsCount: number;
  totalInvoicesCount: number;
  onOpenUpload: () => void;
  onOpenEval: () => void;
  onOpenQboSettings: () => void;
  onOpenAuditExport: () => void;
}

export const FloatingTaskbar: React.FC<FloatingTaskbarProps> = ({
  activePillar,
  onSelectPillar,
  pendingExceptionsCount,
  totalInvoicesCount,
  onOpenUpload,
  onOpenEval,
  onOpenQboSettings,
  onOpenAuditExport,
}) => {
  const navPillars: {
    id: MainNavPillar;
    label: string;
    icon: any;
    count?: number;
    badge?: number;
  }[] = [
    { id: 'DASHBOARD', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'PROCUREMENT',
      label: 'Procurement',
      icon: ShoppingCart,
      count: totalInvoicesCount,
      badge: pendingExceptionsCount,
    },
    { id: 'INTELLIGENCE', label: 'Intelligence', icon: BrainCircuit },
    { id: 'FINANCE', label: 'Finance & GL', icon: Landmark },
  ];

  return (
    <div
      id="vault-floating-taskbar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-2xl pointer-events-auto transition-all"
    >
      <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl border border-slate-800 shadow-lg px-2.5 py-1.5 flex items-center gap-2">
        {/* Navigation Pillars */}
        <div className="flex items-center space-x-1">
          {navPillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                id={`taskbar-pillar-${pillar.id.toLowerCase()}`}
                onClick={() => onSelectPillar(pillar.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pillar.label}</span>

                {pillar.badge !== undefined && pillar.badge > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950">
                    {pillar.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="w-px h-5 bg-slate-700 mx-0.5" />

        {/* Quick Tools */}
        <div className="flex items-center space-x-1">
          <button
            id="taskbar-action-upload"
            onClick={onOpenUpload}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer border border-slate-700/60"
            title="Upload Document"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            id="taskbar-action-audit-export"
            onClick={onOpenAuditExport}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Export CA Audit Ledger"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
          </button>

          <button
            id="taskbar-action-settings"
            onClick={onOpenQboSettings}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Configure Thresholds & ERP"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
