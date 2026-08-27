import React, { useState } from 'react';
import { CreditCard, TrendingUp, Info } from 'lucide-react';

interface EarningsOverviewCardProps {
  totalEarnings?: number;
  thisMonth?: number;
  lastMonth?: number;
  onOpenDetails?: () => void;
}

export const EarningsOverviewCard: React.FC<EarningsOverviewCardProps> = ({
  totalEarnings = 757000,
  thisMonth = 7000,
  lastMonth = 9600,
  onOpenDetails,
}) => {
  const [currency, setCurrency] = useState<'SAR' | 'USD' | 'AED'>('SAR');

  const formatAmount = (val: number) => {
    let rate = 1;
    let sym = 'SAR';
    if (currency === 'USD') {
      rate = 0.27;
      sym = '$';
    } else if (currency === 'AED') {
      rate = 0.98;
      sym = 'AED';
    }

    const converted = val * rate;
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${sym} ${formatted.replace('.', ',')}`;
  };

  return (
    <div
      onClick={onOpenDetails}
      className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <CreditCard className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Earnings overview</h2>
        </div>

        {/* Currency Switcher */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold text-slate-600"
        >
          <button
            onClick={() => setCurrency('SAR')}
            className={`px-1.5 py-0.5 rounded ${currency === 'SAR' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'}`}
          >
            SAR
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-1.5 py-0.5 rounded ${currency === 'USD' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'}`}
          >
            USD
          </button>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="my-auto pt-2 pb-1">
        <div className="flex items-end justify-between gap-3 sm:gap-4 h-36 sm:h-40 px-1">
          {/* Bar 1: Total (Hatched Diagonal Pattern, Taller) */}
          <div className="flex-1 flex flex-col items-center justify-end h-full group/bar">
            <div className="w-full h-32 sm:h-36 rounded-t-xl rounded-b-sm bg-hatch-pattern border border-blue-200/80 p-2 flex flex-col justify-end transition-transform group-hover/bar:scale-[1.02]">
              <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 leading-tight">
                {currency === 'SAR' ? 'SAR' : currency}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 font-mono leading-tight truncate">
                757.000,00
              </span>
            </div>
          </div>

          {/* Bar 2: This month (Cobalt Blue, Medium Height) */}
          <div className="flex-1 flex flex-col items-center justify-end h-full group/bar">
            <div className="w-full h-20 sm:h-24 rounded-t-xl rounded-b-sm bg-[#1e40af] sm:bg-[#2563eb] p-2 flex flex-col justify-end text-white shadow-xs transition-transform group-hover/bar:scale-[1.02]">
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-100 leading-tight">
                {currency === 'SAR' ? 'SAR' : currency}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-white font-mono leading-tight truncate">
                7.000,00
              </span>
            </div>
          </div>

          {/* Bar 3: Last month (Dark Navy, Medium-Tall Height) */}
          <div className="flex-1 flex flex-col items-center justify-end h-full group/bar">
            <div className="w-full h-24 sm:h-28 rounded-t-xl rounded-b-sm bg-[#0f172a] p-2 flex flex-col justify-end text-white shadow-xs transition-transform group-hover/bar:scale-[1.02]">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 leading-tight">
                {currency === 'SAR' ? 'SAR' : currency}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-white font-mono leading-tight truncate">
                9.600,00
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-start gap-4 sm:gap-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#bfdbfe] border border-blue-300 flex-shrink-0" />
          <span>Total</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] flex-shrink-0" />
          <span>This month</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0f172a] flex-shrink-0" />
          <span>Last month</span>
        </div>
      </div>
    </div>
  );
};
