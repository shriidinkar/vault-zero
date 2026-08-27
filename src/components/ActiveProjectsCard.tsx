import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { ProjectItem } from '../atlasData.js';

interface ActiveProjectsCardProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onViewAllProjects?: () => void;
}

export const ActiveProjectsCard: React.FC<ActiveProjectsCardProps> = ({
  projects,
  onSelectProject,
  onViewAllProjects,
}) => {
  const displayProjects = projects.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:border-blue-300/80 transition-all group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active projects</h2>
        </div>
      </div>

      {/* 3 Project Rows */}
      <div className="space-y-4 my-auto pt-1">
        {displayProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProject(p)}
            className="group/row cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-all"
          >
            {/* Title, Percentage & Date in clean aligned row */}
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              <span className="font-bold text-slate-900 group-hover/row:text-blue-600 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                {p.name}
              </span>
              <div className="flex items-center space-x-3 text-xs flex-shrink-0">
                <span className="font-extrabold text-slate-900">{p.progressPercent}%</span>
                <span className="text-slate-400 font-medium text-[11px] sm:text-xs">{p.dueDate}</span>
              </div>
            </div>

            {/* Solid Blue Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${p.progressPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* View all footer */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">{projects.length} total active</span>
        <button
          onClick={onViewAllProjects}
          className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>All projects</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
