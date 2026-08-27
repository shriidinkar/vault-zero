import React from 'react';
import {
  ShieldCheck,
  Zap,
  Play,
  Upload,
  BarChart3,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenEval: () => void;
  onOpenQboSettings: () => void;
  onRunDemoBatch: () => void;
  onReset: () => void;
  isPolling: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingExceptionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenEval,
  onOpenQboSettings,
  onRunDemoBatch,
  onReset,
  isPolling,
  activeTab,
  setActiveTab,
  pendingExceptionsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">Vault-Zero</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Autonomous AP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Pre-ERP Forensic & Agentic Vetting Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              id="tab-inbox"
              onClick={() => setActiveTab('inbox')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'inbox'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Invoice Inbox
            </button>
            <button
              id="tab-cfo-queue"
              onClick={() => setActiveTab('cfo-queue')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'cfo-queue'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span>CFO Review Queue</span>
              {pendingExceptionsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                  {pendingExceptionsCount}
                </span>
              )}
            </button>
            <button
              id="tab-demo"
              onClick={() => setActiveTab('demo-scenarios')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'demo-scenarios'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              4 Demo Scenarios
            </button>
            <button
              id="tab-eval"
              onClick={onOpenEval}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 flex items-center space-x-1.5 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ground Truth Eval</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2">
            {/* Live 3s Polling Indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              <span className={`w-2 h-2 rounded-full ${isPolling ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>3s Live Poll</span>
            </div>

            {/* Run Demo Scenarios Button */}
            <button
              id="btn-run-demo"
              onClick={onRunDemoBatch}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Seed 4 Scenarios</span>
            </button>

            {/* Ingest / Upload Button */}
            <button
              id="btn-upload"
              onClick={onOpenUpload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ingest PDF</span>
            </button>

            {/* ERP / Settings button */}
            <button
              id="btn-qbo-settings"
              onClick={onOpenQboSettings}
              title="QuickBooks Online Sandbox & Bank Rails"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Reset Button */}
            <button
              id="btn-reset"
              onClick={onReset}
              title="Reset Database"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/80 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
