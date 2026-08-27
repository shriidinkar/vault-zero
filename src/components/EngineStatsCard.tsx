import React from 'react';
import {
  Kanban,
  CheckCircle2,
  TrendingUp,
  Copy,
  Building2,
  Binary,
  Layers,
} from 'lucide-react';

interface EngineStatsCardProps {
  stats?: {
    pristineR1: number;
    priceMarkup: number;
    duplicates: number;
    bankHashDrift: number;
    pdfTamper: number;
    splitInvoices: number;
  };
  onSelectFilter?: (category: string) => void;
}

export const EngineStatsCard: React.FC<EngineStatsCardProps> = ({
  stats = {
    pristineR1: 156,
    priceMarkup: 12,
    duplicates: 8,
    bankHashDrift: 6,
    pdfTamper: 4,
    splitInvoices: 4,
  },
  onSelectFilter,
}) => {
  const statItems = [
    {
      id: 'pristineR1',
      label: 'Pristine R1 (98+)',
      count: stats.pristineR1,
      icon: CheckCircle2,
      filterKey: 'auto-paid',
    },
    {
      id: 'priceMarkup',
      label: 'Contract rate-creep',
      count: stats.priceMarkup,
      icon: TrendingUp,
      filterKey: 'flagged',
    },
    {
      id: 'duplicates',
      label: 'Near & exact duplicate',
      count: stats.duplicates,
      icon: Copy,
      filterKey: 'flagged',
    },
    {
      id: 'bankHashDrift',
      label: 'Bank account drift',
      count: stats.bankHashDrift,
      icon: Building2,
      filterKey: 'flagged',
    },
    {
      id: 'pdfTamper',
      label: 'PDF font/XMP tamper',
      count: stats.pdfTamper,
      icon: Binary,
      filterKey: 'flagged',
    },
    {
      id: 'splitInvoices',
      label: 'Split invoice (salami)',
      count: stats.splitInvoices,
      icon: Layers,
      filterKey: 'flagged',
    },
  ];

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all group">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
          <Kanban className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Forensics &amp; Audit Signals
          </h2>
          <p className="text-xs text-slate-400">Heuristics &amp; Agent findings</p>
        </div>
      </div>

      {/* 2x3 Grid matching reference image layout */}
      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 my-auto pt-2 pb-1">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectFilter && onSelectFilter(item.filterKey)}
              className="flex items-center justify-between group/item cursor-pointer hover:bg-blue-50/50 p-1.5 -m-1.5 rounded-xl transition-all"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover/item:text-slate-900 transition-colors truncate">
                  {item.label}
                </span>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 ml-2 font-mono flex-shrink-0">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex justify-between items-center text-xs">
        <span className="text-slate-400">Zero-Trust Matrix</span>
        <span className="text-blue-600 font-semibold font-mono">0–100 Waterfall</span>
      </div>
    </div>
  );
};
