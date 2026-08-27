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
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'PROCUREMENT',
      label: 'Procurement',
      icon: ShoppingCart,
      count: totalInvoicesCount,
      badge: pendingExceptionsCount,
    },
    { id: 'INTELLIGENCE', label: 'Intelligence', icon: BrainCircuit },
    { id: 'FINANCE', label: 'Finance', icon: Landmark },
  ];

  return (
    <div
      id="vault-floating-taskbar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-4xl pointer-events-auto"
    >
      <div className="bg-slate-950/95 backdrop-blur-xl text-white rounded-3xl border border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-2 sm:p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 transition-all">
        {/* Navigation Pillars */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-start overflow-x-auto scrollbar-none py-0.5">
          {navPillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                id={`taskbar-pillar-${pillar.id.toLowerCase()}`}
                onClick={() => onSelectPillar(pillar.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer font-mono whitespace-nowrap uppercase tracking-wider ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pillar.label}</span>

                {pillar.count !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/20 text-white font-bold">
                    {pillar.count}
                  </span>
                )}

                {pillar.badge !== undefined && pillar.badge > 0 && (
                  <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950">
                    {pillar.badge} CFO
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-1.5 sm:pt-0 border-slate-800/80 flex-shrink-0">
          <button
            id="taskbar-action-upload"
            onClick={onOpenUpload}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all cursor-pointer shadow-xs font-mono whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Forensics</span>
          </button>

          <button
            id="taskbar-action-audit-export"
            onClick={onOpenAuditExport}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Export CA Audit Ledger"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          <button
            id="taskbar-action-eval"
            onClick={onOpenEval}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Ground Truth Accuracy Evaluation"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            id="taskbar-action-settings"
            onClick={onOpenQboSettings}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Configure Thresholds & ERP"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
