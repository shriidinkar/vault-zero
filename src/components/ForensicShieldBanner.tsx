import React from 'react';
import { ShieldCheck, Sparkles, ArrowRight, FileCheck, Binary } from 'lucide-react';

interface ForensicShieldBannerProps {
  onRunForensicTest: () => void;
  anomaliesCaughtCount?: number;
}

export const ForensicShieldBanner: React.FC<ForensicShieldBannerProps> = ({
  onRunForensicTest,
  anomaliesCaughtCount = 44,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 bg-gradient-to-br from-[#d9ebfb] via-[#e2effd] to-[#cadff8] border border-blue-200/80 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.08)] flex flex-col justify-between group">
      {/* Decorative Guilloche Concentric Circles / Vector Grid */}
      <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full border border-blue-400/20 pointer-events-none" />
      <div className="absolute -right-14 -bottom-16 w-64 h-64 rounded-full border border-blue-400/25 pointer-events-none" />
      <div className="absolute -right-20 -bottom-22 w-80 h-80 rounded-full border border-blue-400/15 pointer-events-none" />
      <div className="absolute top-4 right-10 w-24 h-24 rounded-full border border-blue-300/30 pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center space-x-2 relative z-10 mb-3">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-blue-800 shadow-xs border border-blue-200/60 backdrop-blur-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Core Differentiator</span>
        </span>
        <span className="text-[11px] font-bold text-blue-900/80 font-mono">
          {anomaliesCaughtCount} Tampered Invoices Caught
        </span>
      </div>

      {/* Main Copy */}
      <div className="relative z-10 my-auto py-1 space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          Pre-Ingestion Digital Forensics
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed max-w-sm">
          Email-gateway interception inspects PDFs <strong>before</strong> ERP entry. Flags font substitutions, Producer mismatches, &amp; BEC banking shifts.
        </p>
      </div>

      {/* Action CTA Button */}
      <div className="relative z-10 pt-4 flex items-center justify-between">
        <button
          onClick={onRunForensicTest}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer transform group-hover:translate-x-0.5"
        >
          <span>Run Gateway Forensic Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <span className="text-[11px] text-blue-900 font-mono font-semibold hidden sm:inline-block">
          Risk Score 0–1.0
        </span>
      </div>
    </div>
  );
};
