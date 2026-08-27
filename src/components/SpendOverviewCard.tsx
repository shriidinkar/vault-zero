import React, { useState } from 'react';
import { CreditCard, TrendingDown, ArrowRight, Download, DollarSign } from 'lucide-react';
import { formatINR } from '../lib/utils.js';

interface SpendOverviewCardProps {
  totalSpend?: number;
  autoPaidSpend?: number;
  savedSpend?: number;
  onOpenAuditModal?: () => void;
}

export const SpendOverviewCard: React.FC<SpendOverviewCardProps> = ({
  totalSpend = 14850000,
  autoPaidSpend = 11240000,
  savedSpend = 3610000,
  onOpenAuditModal,
}) => {
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  const formatVal = (val: number) => {
    if (currency === 'USD') {
      return `$${Math.round(val / 83).toLocaleString()}`;
    }
    if (currency === 'EUR') {
      return `€${Math.round(val / 90).toLocaleString()}`;
    }
    return formatINR(val);
  };

  // Height percentages for bars
  const maxVal = totalSpend;
  const hTotal = 100;
  const hAuto = Math.round((autoPaidSpend / maxVal) * 100);
  const hSaved = Math.max(15, Math.round((savedSpend / maxVal) * 100));

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all group">
      {/* Header with Title and Currency Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Spend &amp; Leakage Overview
            </h2>
            <p className="text-xs text-slate-400">Total ledger vetting</p>
          </div>
        </div>

        {/* Currency Switcher Pill */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
          {(['INR', 'USD', 'EUR'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-2 py-0.5 rounded-md transition-all ${
                currency === c ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : '€ EUR'}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart comparing Total Spend, Auto-Paid, and Fraud Prevented */}
      <div className="flex items-end justify-between gap-4 sm:gap-6 my-auto pt-4 pb-2 px-2">
        {/* Bar 1: Total Spend (Hatched Pattern) */}
        <div className="flex flex-col items-center flex-1 group/bar">
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 mb-2 font-mono text-center">
            {formatVal(totalSpend)}
          </span>
          <div className="w-full max-w-[64px] h-28 sm:h-32 bg-slate-100 rounded-t-xl overflow-hidden relative flex items-end">
            <div
              className="w-full bg-blue-600 rounded-t-xl transition-all duration-700 relative"
              style={{
                height: `${hTotal}%`,
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 6px, transparent 6px, transparent 12px)',
              }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-600 mt-2">Total Invoiced</span>
        </div>

        {/* Bar 2: Auto-Paid (Solid Blue) */}
        <div className="flex flex-col items-center flex-1 group/bar">
          <span className="text-xs sm:text-sm font-extrabold text-blue-600 mb-2 font-mono text-center">
            {formatVal(autoPaidSpend)}
          </span>
          <div className="w-full max-w-[64px] h-28 sm:h-32 bg-slate-100 rounded-t-xl overflow-hidden relative flex items-end">
            <div
              className="w-full bg-blue-600 rounded-t-xl transition-all duration-700"
              style={{ height: `${hAuto}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-600 mt-2">Auto-Paid ACH</span>
        </div>

        {/* Bar 3: Fraud & Leakage Saved (Emerald/Sky Blue) */}
        <div className="flex flex-col items-center flex-1 group/bar">
          <span className="text-xs sm:text-sm font-extrabold text-emerald-600 mb-2 font-mono text-center">
            {formatVal(savedSpend)}
          </span>
          <div className="w-full max-w-[64px] h-28 sm:h-32 bg-slate-100 rounded-t-xl overflow-hidden relative flex items-end">
            <div
              className="w-full bg-emerald-500 rounded-t-xl transition-all duration-700"
              style={{ height: `${hSaved}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-emerald-700 mt-2">Leakage Saved</span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Audit Trail Synced</span>
        <button
          onClick={onOpenAuditModal}
          className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Ledgers</span>
        </button>
      </div>
    </div>
  );
};
