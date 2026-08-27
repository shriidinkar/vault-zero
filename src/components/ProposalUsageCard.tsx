import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

interface ProposalUsageCardProps {
  usedCount: number;
  totalLimit: number;
  resetDays: number;
  planName: string;
  onManagePlan: () => void;
}

export const ProposalUsageCard: React.FC<ProposalUsageCardProps> = ({
  usedCount = 6,
  totalLimit = 15,
  resetDays = 12,
  planName = 'Pro plan',
  onManagePlan,
}) => {
  // Array of 15 segments
  const segments = Array.from({ length: totalLimit }, (_, i) => i < usedCount);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all group">
      {/* Card Header with Blue Icon */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Proposal usage</h2>
      </div>

      {/* Plan Name and Fraction 6/15 */}
      <div className="my-auto pt-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-900">{planName}</span>
          <span className="text-sm font-semibold text-slate-500 tracking-wide font-mono">
            {usedCount} / {totalLimit}
          </span>
        </div>

        {/* 15 Segmented Pill Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5 w-full py-2">
          {segments.map((isFilled, idx) => (
            <div
              key={idx}
              className={`h-7 flex-1 rounded-sm sm:rounded transition-all duration-500 ${
                isFilled
                  ? 'bg-[#1e40af] sm:bg-[#1d4ed8] shadow-xs'
                  : 'bg-[#bfdbfe]'
              }`}
              title={`Proposal slot ${idx + 1}: ${isFilled ? 'Used' : 'Available'}`}
            />
          ))}
        </div>

        {/* Reset text */}
        <p className="text-xs text-slate-500 mt-2 font-medium">
          Resets in {resetDays} days
        </p>
      </div>

      {/* Manage Plan Action Link */}
      <div className="pt-4 border-t border-slate-100 mt-2">
        <button
          onClick={onManagePlan}
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn transition-colors focus:outline-none"
        >
          <span>Manage plan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
