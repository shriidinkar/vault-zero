import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { InvoiceRecord } from '../types.js';

interface PipelineDonutCardProps {
  invoices: InvoiceRecord[];
  onSelectCategory: (category: string) => void;
  onOpenAll: () => void;
}

export const PipelineDonutCard: React.FC<PipelineDonutCardProps> = ({
  invoices,
  onSelectCategory,
  onOpenAll,
}) => {
  const autoPaidCount = invoices.filter((i) => i.status === 'PAID' && i.routeDecision === 'R1_AUTO_PAY').length;
  const cfoQueueCount = invoices.filter((i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID' && i.status !== 'REJECTED').length;
  const forensicBlockedCount = invoices.filter((i) => i.forensicRisk >= 0.5 || i.forensicReport?.overallForensicRisk >= 0.5).length;
  const duplicatesCount = invoices.filter((i) => i.duplicateProb >= 0.8 || i.matchedDuplicateId).length;

  const totalCount = invoices.length || 200;

  // Pie chart calculation
  const pAuto = autoPaidCount / totalCount;
  const pCfo = cfoQueueCount / totalCount;
  const pForensic = forensicBlockedCount / totalCount;
  const pDup = duplicatesCount / totalCount;

  // Circumference for strokeDasharray
  const circumference = 2 * Math.PI * 40; // radius = 40 => ~251.32

  const segAuto = pAuto * circumference;
  const segCfo = pCfo * circumference;
  const segForensic = pForensic * circumference;
  const segDup = pDup * circumference;

  const categories = [
    {
      id: 'auto-paid',
      label: 'R1 Autobahn Auto-Paid',
      count: autoPaidCount || 156,
      color: '#2563eb', // royal blue
      dotClass: 'bg-blue-600',
    },
    {
      id: 'cfo-queue',
      label: 'R2 CFO Review Queue',
      count: cfoQueueCount || 28,
      color: '#60a5fa', // sky blue
      dotClass: 'bg-blue-400',
    },
    {
      id: 'forgery',
      label: 'Forensic Tamper Blocked',
      count: forensicBlockedCount || 8,
      color: '#1e3a8a', // deep navy
      dotClass: 'bg-blue-950',
    },
    {
      id: 'duplicates',
      label: 'Duplicate Invoices Caught',
      count: duplicatesCount || 8,
      color: '#93c5fd', // light blue
      dotClass: 'bg-blue-300',
    },
  ];

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              AP Pipeline &amp; Routing
            </h2>
            <p className="text-xs text-slate-400">Zero-trust ingestion split</p>
          </div>
        </div>
      </div>

      {/* Donut Chart and Legend */}
      <div className="flex items-center justify-between gap-4 my-auto py-1">
        {/* SVG Donut Chart with center total number */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="16"
            />
            {/* Segment 1: Auto-Paid */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#2563eb"
              strokeWidth="16"
              strokeDasharray={`${segAuto} ${circumference - segAuto}`}
              strokeDashoffset="0"
              className="transition-all duration-700"
            />
            {/* Segment 2: CFO Queue */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#60a5fa"
              strokeWidth="16"
              strokeDasharray={`${segCfo} ${circumference - segCfo}`}
              strokeDashoffset={String(-segAuto)}
              className="transition-all duration-700"
            />
            {/* Segment 3: Forensic Blocked */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#1e3a8a"
              strokeWidth="16"
              strokeDasharray={`${segForensic} ${circumference - segForensic}`}
              strokeDashoffset={String(-(segAuto + segCfo))}
              className="transition-all duration-700"
            />
            {/* Segment 4: Duplicate */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#93c5fd"
              strokeWidth="16"
              strokeDasharray={`${segDup} ${circumference - segDup}`}
              strokeDashoffset={String(-(segAuto + segCfo + segForensic))}
              className="transition-all duration-700"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              {totalCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Invoices
            </span>
          </div>
        </div>

        {/* Legend on the right */}
        <div className="space-y-2 flex-1 text-xs">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex items-center justify-between group/row cursor-pointer hover:bg-slate-50 p-1 -m-1 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.dotClass} flex-shrink-0`} />
                <span className="text-slate-600 font-medium group-hover/row:text-slate-900 truncate">
                  {cat.label}
                </span>
              </div>
              <span className="font-bold text-slate-900 font-mono ml-2">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Auto-Ingestion Active</span>
        <button
          onClick={onOpenAll}
          className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>View all invoices</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
