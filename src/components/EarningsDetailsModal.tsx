import React from 'react';
import { X, CreditCard, TrendingUp, CheckCircle2, Download, ArrowUpRight } from 'lucide-react';

interface EarningsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarningsDetailsModal: React.FC<EarningsDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const payouts = [
    {
      id: 'tx-1',
      date: '12 April, 2026',
      project: 'City Apartment Makeover',
      description: 'Milestone 2 Joinery Completion',
      amountSar: 7000,
      status: 'Settled',
      ref: 'ACH-99201',
    },
    {
      id: 'tx-2',
      date: '28 March, 2026',
      project: 'Living Space Transformation',
      description: 'Phase 1 Structural Foundation Advance',
      amountSar: 9600,
      status: 'Settled',
      ref: 'ACH-88412',
    },
    {
      id: 'tx-3',
      date: '15 March, 2026',
      project: 'Architectural Interior Revamp',
      description: 'Design Blueprint Approval Escrow Release',
      amountSar: 125000,
      status: 'Settled',
      ref: 'ACH-77190',
    },
    {
      id: 'tx-4',
      date: '17 April, 2026 (Scheduled)',
      project: 'Living Space Transformation',
      description: 'Phase 2 Smart Renovation Milestone',
      amountSar: 48000,
      status: 'Pending Release',
      ref: 'ACH-11029',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Earnings & Financial Statements</h2>
              <p className="text-xs text-slate-500">Corporate settlement accounts & escrow releases</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Metric Strip */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/30 border-b border-slate-100 grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Total Cumulative Earned</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono">SAR 757,000.00</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">This Month (April)</span>
            <span className="text-lg font-extrabold text-blue-600 font-mono">SAR 7,000.00</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Last Month (March)</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono">SAR 9,600.00</span>
          </div>
        </div>

        {/* Transaction History */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Payouts & Escrow Releases
            </h3>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              <span>Export Tax Invoices (ZATCA)</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {payouts.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{tx.project}</span>
                    <span className="text-[10px] font-mono text-slate-400">{tx.ref}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{tx.description}</p>
                  <span className="text-[10px] text-slate-400">{tx.date}</span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono text-sm block">
                    SAR {tx.amountSar.toLocaleString()}.00
                  </span>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      tx.status === 'Settled'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
          >
            Close Statement
          </button>
        </div>
      </div>
    </div>
  );
};
