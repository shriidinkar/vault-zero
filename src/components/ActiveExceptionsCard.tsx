import React from 'react';
import { Layers, ArrowRight, AlertTriangle, ShieldAlert } from 'lucide-react';
import { InvoiceRecord } from '../types.js';
import { formatINR } from '../lib/utils.js';

interface ActiveExceptionsCardProps {
  invoices: InvoiceRecord[];
  onSelectInvoice: (invoice: InvoiceRecord) => void;
  onViewAllExceptions: () => void;
}

export const ActiveExceptionsCard: React.FC<ActiveExceptionsCardProps> = ({
  invoices,
  onSelectInvoice,
  onViewAllExceptions,
}) => {
  // Pending exceptions
  const exceptionInvoices = invoices
    .filter((i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID' && i.status !== 'REJECTED')
    .slice(0, 3);

  // Fallback demo items if list is empty
  const displayItems = exceptionInvoices.length > 0
    ? exceptionInvoices
    : invoices.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Priority CFO Queue
            </h2>
            <p className="text-xs text-slate-400">High-dollar / anomaly review</p>
          </div>
        </div>
      </div>

      {/* 3 Exception Rows with solid progress bar */}
      <div className="space-y-4 my-auto pt-1">
        {displayItems.map((inv) => {
          const score = inv.trustScore ?? 45;
          const riskPercent = Math.round(100 - score);
          const reason = inv.exceptionReasons?.[0] || inv.demoScenarioType || 'Multi-agent review required';

          return (
            <div
              key={inv.id}
              onClick={() => onSelectInvoice(inv)}
              className="group/row cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-all"
            >
              {/* Title, Percentage & Date in clean aligned row */}
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <div className="truncate max-w-[150px] sm:max-w-[190px]">
                  <span className="font-bold text-slate-900 group-hover/row:text-blue-600 transition-colors block truncate">
                    {inv.vendorName || inv.rawInvoiceNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {reason}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs flex-shrink-0">
                  <span className="font-extrabold text-slate-900 font-mono">
                    {formatINR(inv.amount)}
                  </span>
                  <span className="text-amber-600 font-bold text-[11px] sm:text-xs font-mono">
                    {score.toFixed(0)} Trust
                  </span>
                </div>
              </div>

              {/* Solid Blue Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(20, riskPercent)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* View all footer */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">
          {invoices.filter((i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID').length} total pending
        </span>
        <button
          onClick={onViewAllExceptions}
          className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>All exceptions</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
