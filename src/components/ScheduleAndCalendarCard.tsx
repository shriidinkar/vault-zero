import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { MilestoneItem } from '../atlasData.js';

interface ScheduleAndCalendarCardProps {
  milestones: MilestoneItem[];
  onSelectMilestone?: (m: MilestoneItem) => void;
}

export const ScheduleAndCalendarCard: React.FC<ScheduleAndCalendarCardProps> = ({
  milestones,
  onSelectMilestone,
}) => {
  const [currentMonth, setCurrentMonth] = useState('April 2026');
  const [selectedDay, setSelectedDay] = useState<number>(15);

  // April 2026 Calendar days matrix (Starts on Wednesday Apr 1, 2026)
  // Prev month Mar 30, 31 for Mo, Tu
  const calendarDays = [
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true, hasGreenPill: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true, isToday: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true, hasPaymentDue: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false },
  ];

  const todayItem = milestones.find((m) => m.timeframe === 'today') || milestones[0];
  const weekItem = milestones.find((m) => m.timeframe === 'this_week') || milestones[1];

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 sm:p-8 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Timeline Activity */}
        <div className="lg:col-span-6 space-y-6">
          {/* Today 15 April, 2026 */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 tracking-tight">
              Today 15 April, 2026
            </h2>

            {todayItem && (
              <div
                onClick={() => onSelectMilestone && onSelectMilestone(todayItem)}
                className="flex items-start justify-between gap-3 p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {todayItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {todayItem.projectTitle}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100/80 whitespace-nowrap flex-shrink-0">
                  {todayItem.statusBadge}
                </span>
              </div>
            )}
          </div>

          {/* This Week */}
          <div className="pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 tracking-tight">
              This Week
            </h2>

            {weekItem && (
              <div
                onClick={() => onSelectMilestone && onSelectMilestone(weekItem)}
                className="flex items-start justify-between gap-3 p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {weekItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {weekItem.projectTitle}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/80 whitespace-nowrap flex-shrink-0">
                  {weekItem.statusBadge}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive April 2026 Calendar */}
        <div className="lg:col-span-6 lg:border-l lg:border-slate-100 lg:pl-8">
          {/* Calendar Header with Navigators */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => {}}
              className="w-8 h-8 rounded-full border border-blue-400/80 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm sm:text-base font-bold text-slate-900">
              {currentMonth}
            </span>

            <button
              onClick={() => {}}
              className="w-8 h-8 rounded-full border border-blue-400/80 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels: Mo Tu We Th Fr Sa Su */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-600 mb-2">
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
            <div>Su</div>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm">
            {calendarDays.map((item, index) => {
              const isSelected = item.isCurrentMonth && item.day === selectedDay;
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (item.isCurrentMonth) setSelectedDay(item.day);
                  }}
                  className={`h-9 flex flex-col items-center justify-center relative rounded-xl cursor-pointer transition-all ${
                    !item.isCurrentMonth
                      ? 'text-slate-400'
                      : isSelected
                      ? 'bg-blue-50 font-bold text-blue-600'
                      : 'text-slate-700 font-medium hover:bg-slate-50'
                  }`}
                >
                  <span>{item.day}</span>

                  {/* Green pill indicator under day 6 */}
                  {item.hasGreenPill && (
                    <span className="w-4 h-1 bg-emerald-400 rounded-full mt-0.5" />
                  )}

                  {/* Dot indicator under today (15) */}
                  {item.isToday && (
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full absolute bottom-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
