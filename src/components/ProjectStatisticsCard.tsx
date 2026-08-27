import React from 'react';
import {
  Kanban,
  CheckCircle2,
  FileText,
  PauseCircle,
  RotateCw,
  Clock,
  CreditCard,
} from 'lucide-react';

interface ProjectStatisticsCardProps {
  stats?: {
    onTrack: number;
    deliverablesNeeded: number;
    hold: number;
    revisionNeeded: number;
    delayed: number;
    pendingPayment: number;
  };
  onSelectFilter?: (status: string) => void;
}

export const ProjectStatisticsCard: React.FC<ProjectStatisticsCardProps> = ({
  stats = {
    onTrack: 6,
    deliverablesNeeded: 4,
    hold: 3,
    revisionNeeded: 4,
    delayed: 2,
    pendingPayment: 4,
  },
  onSelectFilter,
}) => {
  const statItems = [
    {
      id: 'onTrack',
      label: 'On track',
      count: stats.onTrack,
      icon: CheckCircle2,
      color: 'text-blue-600',
    },
    {
      id: 'deliverablesNeeded',
      label: 'Deliverables needed',
      count: stats.deliverablesNeeded,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      id: 'hold',
      label: 'Hold',
      count: stats.hold,
      icon: PauseCircle,
      color: 'text-blue-600',
    },
    {
      id: 'revisionNeeded',
      label: 'Revision needed',
      count: stats.revisionNeeded,
      icon: RotateCw,
      color: 'text-blue-600',
    },
    {
      id: 'delayed',
      label: 'Delayed',
      count: stats.delayed,
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      id: 'pendingPayment',
      label: 'Pending payment',
      count: stats.pendingPayment,
      icon: CreditCard,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all group">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
          <Kanban className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Project statistics</h2>
      </div>

      {/* 2x3 Grid */}
      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 my-auto pt-2 pb-1">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectFilter && onSelectFilter(item.label)}
              className="flex items-center justify-between group/item cursor-pointer hover:bg-blue-50/50 p-1.5 -m-1.5 rounded-xl transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover/item:text-slate-900 transition-colors">
                  {item.label}
                </span>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 ml-2">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
