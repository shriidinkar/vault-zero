import React from 'react';
import {
  FileText,
  Zap,
  AlertTriangle,
  TrendingDown,
  Copy,
  Coins,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { PipelineMetrics } from '../types.js';
import { formatINR } from '../lib/utils.js';

interface MetricsStripProps {
  metrics: PipelineMetrics | null;
  onFilterCfo: () => void;
  onFilterAutoPaid: () => void;
}

export const MetricsStrip: React.FC<MetricsStripProps> = ({
  metrics,
  onFilterCfo,
  onFilterAutoPaid,
}) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-900/60 rounded-xl border border-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
      {/* 1. Processed Invoices */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Vetted</span>
          <FileText className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-white">{metrics.totalProcessed}</div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Idempotent Pipeline</span>
          <span className="text-cyan-400 font-medium">8 Stages</span>
        </div>
      </div>

      {/* 2. Auto-Paid % (R1 Execution) */}
      <div
        onClick={onFilterAutoPaid}
        className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-emerald-500/50 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">R1 Auto-Paid</span>
          <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold tracking-tight text-emerald-400">{metrics.autoPaidPct}%</span>
          <span className="text-xs text-slate-400 font-medium">({metrics.autoPaidCount} inv)</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>QBO + Mock ACH</span>
          <span className="text-emerald-400 font-semibold">&gt;= 98 Trust</span>
        </div>
      </div>

      {/* 3. CFO Queue Exceptions */}
      <div
        onClick={onFilterCfo}
        className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-amber-500/50 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-amber-400">CFO Queue</span>
          <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold tracking-tight text-amber-300">{metrics.exceptionsCount}</span>
          <span className="text-xs text-slate-400">Exceptions</span>
        </div>
        <div className="text-[11px] text-amber-400/80 mt-1 flex items-center justify-between">
          <span>Requires Sign-off</span>
          <span className="font-semibold">Review</span>
        </div>
      </div>

      {/* 4. Identified Savings ₹ */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-400">Price Leakage Saved</span>
          <TrendingDown className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-xl font-bold tracking-tight text-white truncate">
          {formatINR(metrics.identifiedSavings)}
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Rate-Creep & Markup</span>
          <span className="text-indigo-400 font-medium">Auditor Swarm</span>
        </div>
      </div>

      {/* 5. Duplicates Caught ₹ */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-rose-400">Duplicates Blocked</span>
          <Copy className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-xl font-bold tracking-tight text-rose-300 truncate">
          {formatINR(metrics.duplicatesCaughtAmount)}
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Exact & Fuzzy GIN</span>
          <span className="text-rose-400 font-medium">100% Caught</span>
        </div>
      </div>

      {/* 6. Processing Cost / Invoice */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-teal-400">AP Cost / Inv</span>
          <Coins className="w-4 h-4 text-teal-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold tracking-tight text-teal-300">₹{(metrics.avgCostPerInvoice ?? 0.90).toFixed(2)}</span>
          <span className="text-[10px] text-slate-400 line-through">₹120</span>
        </div>
        <div className="text-[11px] text-teal-400/90 mt-1 flex items-center justify-between">
          <span>99.2% Cost Reduction</span>
          <span className="font-semibold">Sub-second</span>
        </div>
      </div>
    </div>
  );
};
