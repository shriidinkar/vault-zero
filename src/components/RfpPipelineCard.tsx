import React from 'react';
import { PieChart } from 'lucide-react';
import { RfpItem } from '../atlasData.js';

interface RfpPipelineCardProps {
  rfps: RfpItem[];
  onSelectCategory: (category: string) => void;
  onOpenAll: () => void;
}

export const RfpPipelineCard: React.FC<RfpPipelineCardProps> = ({
  rfps,
  onSelectCategory,
  onOpenAll,
}) => {
  const eligibleCount = rfps.filter((r) => r.category === 'Eligible RFPs').length;
  const submittedCount = rfps.filter((r) => r.category === 'Proposal Submitted').length;
  const shortlistedCount = rfps.filter((r) => r.category === 'Shortlisted').length;
  const awardingCount = rfps.filter((r) => r.category === 'Awarding').length;
  const total = rfps.length;

  // SVG Donut calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  // Percentages
  const pEligible = total > 0 ? eligibleCount / total : 0;
  const pSubmitted = total > 0 ? submittedCount / total : 0;
  const pShortlisted = total > 0 ? shortlistedCount / total : 0;
  const pAwarding = total > 0 ? awardingCount / total : 0;

  const strokeEligible = pEligible * circumference;
  const strokeSubmitted = pSubmitted * circumference;
  const strokeShortlisted = pShortlisted * circumference;
  const strokeAwarding = pAwarding * circumference;

  const offsetEligible = 0;
  const offsetSubmitted = -strokeEligible;
  const offsetShortlisted = -(strokeEligible + strokeSubmitted);
  const offsetAwarding = -(strokeEligible + strokeSubmitted + strokeShortlisted);

  return (
    <div
      onClick={onOpenAll}
      className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all cursor-pointer group"
    >
      {/* Card Header with Blue Icon */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
          <PieChart className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">RFP pipeline</h2>
      </div>

      {/* Donut Chart & Legend in Split Layout */}
      <div className="flex items-center justify-between gap-4 sm:gap-6 my-auto pt-1">
        {/* Donut chart */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="13"
            />
            {/* Eligible RFPs (Royal Blue) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#2563eb"
              strokeWidth="13"
              strokeDasharray={`${strokeEligible} ${circumference}`}
              strokeDashoffset={offsetEligible}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            {/* Proposal Submitted (Light Blue) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#93c5fd"
              strokeWidth="13"
              strokeDasharray={`${strokeSubmitted} ${circumference}`}
              strokeDashoffset={offsetSubmitted}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            {/* Shortlisted (Dark Navy) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#0f172a"
              strokeWidth="13"
              strokeDasharray={`${strokeShortlisted} ${circumference}`}
              strokeDashoffset={offsetShortlisted}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            {/* Awarding (Sky Blue) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#60a5fa"
              strokeWidth="13"
              strokeDasharray={`${strokeAwarding} ${circumference}`}
              strokeDashoffset={offsetAwarding}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          {/* Center text 15 */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-none">
              {total}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 text-xs sm:text-sm">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory('Eligible RFPs');
            }}
            className="flex items-center justify-between group/item hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] flex-shrink-0" />
              <span className="text-slate-600 font-medium group-hover/item:text-slate-900 text-xs">Eligible RFPs</span>
            </div>
            <span className="font-bold text-slate-900 text-xs ml-2">{eligibleCount}</span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory('Proposal Submitted');
            }}
            className="flex items-center justify-between group/item hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd] flex-shrink-0" />
              <span className="text-slate-600 font-medium group-hover/item:text-slate-900 text-xs">Proposal Submitted</span>
            </div>
            <span className="font-bold text-slate-900 text-xs ml-2">{submittedCount}</span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory('Shortlisted');
            }}
            className="flex items-center justify-between group/item hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f172a] flex-shrink-0" />
              <span className="text-slate-600 font-medium group-hover/item:text-slate-900 text-xs">Shortlisted</span>
            </div>
            <span className="font-bold text-slate-900 text-xs ml-2">{shortlistedCount}</span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory('Awarding');
            }}
            className="flex items-center justify-between group/item hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] flex-shrink-0" />
              <span className="text-slate-600 font-medium group-hover/item:text-slate-900 text-xs">Awarding</span>
            </div>
            <span className="font-bold text-slate-900 text-xs ml-2">{awardingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
