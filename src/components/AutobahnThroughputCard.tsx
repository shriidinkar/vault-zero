import React from 'react';
import { Zap, Sliders, CheckCircle2 } from 'lucide-react';

interface AutobahnThroughputCardProps {
  autoPaidCount: number;
  totalInvoices: number;
  onManageThresholds?: () => void;
}

export const AutobahnThroughputCard: React.FC<AutobahnThroughputCardProps> = ({
  autoPaidCount = 156,
  totalInvoices = 200,
  onManageThresholds,
}) => {
  const percentage = totalInvoices > 0 ? Math.round((autoPaidCount / totalInvoices) * 100) : 78;
  const totalSlots = 15;
  const activePills = Math.round((percentage / 100) * totalSlots);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              R1 Autobahn Throughput
            </h2>
            <p className="text-xs text-slate-400">Zero-human touch payments</p>
          </div>
        </div>

        {/* Pro / High Throughput Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
          Autonomous Rate: {percentage}%
        </span>
      </div>

      {/* Main Metric & 15 Segmented Blue Pills */}
      <div className="my-auto py-2 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
            {autoPaidCount}{' '}
            <span className="text-sm sm:text-base font-semibold text-slate-400">
              / {totalInvoices} auto-paid
            </span>
          </span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pass &ge; 98 Trust</span>
          </span>
        </div>

        {/* 15 Solid Pill Progress Bars */}
        <div className="flex items-center gap-1.5 w-full">
          {Array.from({ length: totalSlots }).map((_, index) => {
            const isFilled = index < activePills;
            return (
              <div
                key={index}
                className={`h-4 flex-1 rounded-full transition-all duration-500 ${
                  isFilled ? 'bg-blue-600' : 'bg-slate-100'
                }`}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 font-medium pt-1">
          <span>Avg speed: <strong className="text-slate-800 font-mono">820ms</strong></span>
          <span>Engine cost: <strong className="text-emerald-700 font-mono">&lt; ₹1 / invoice</strong></span>
        </div>
      </div>

      {/* Footer: Manage Thresholds CTA */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex justify-between items-center text-xs">
        <span className="text-slate-400">Max Auto Cap: <strong>₹50,000</strong></span>
        <button
          onClick={onManageThresholds}
          className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Configure Thresholds</span>
        </button>
      </div>
    </div>
  );
};
