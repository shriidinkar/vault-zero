import React from 'react';
import { X, Layers, CheckCircle2, Clock, Calendar, Building, DollarSign } from 'lucide-react';
import { ProjectItem } from '../atlasData.js';

interface ProjectDetailsModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onUpdateProgress?: (id: string, newPercent: number) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
  onUpdateProgress,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{project.name}</h2>
              <p className="text-xs text-slate-500">Client: {project.client} • {project.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
          {/* Progress Bar & percentage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Project Completion</span>
              <span className="font-extrabold text-blue-600 text-sm font-mono">{project.progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Status</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                {project.status}
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Target Handover</span>
              <span className="font-bold text-slate-900">{project.dueDate}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Total Contract</span>
              <span className="font-bold text-slate-900 font-mono">SAR {project.budgetSar.toLocaleString()}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Paid to Date</span>
              <span className="font-bold text-emerald-600 font-mono">SAR {project.paidSar.toLocaleString()}</span>
            </div>
          </div>

          {/* Milestones List */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
              Project Milestones
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-900">Demolition & MEP Rough-in</span>
                </div>
                <span className="text-emerald-700 font-bold text-[11px]">100% Completed</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-900">Interior Joinery & Marble Installation</span>
                </div>
                <span className="text-blue-700 font-bold text-[11px]">In Progress (Today)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-600">Final Snagging & Handover</span>
                </div>
                <span className="text-slate-400 font-medium text-[11px]">Scheduled for Q3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
