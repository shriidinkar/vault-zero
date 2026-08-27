import React from 'react';
import {
  FileUp,
  Search,
  CopyX,
  ScanText,
  UserCheck,
  Bot,
  Gauge,
  ArrowRightLeft,
  CheckCircle2,
} from 'lucide-react';

export const PipelineStageBar: React.FC = () => {
  const stages = [
    {
      step: '1',
      name: 'Intake',
      desc: 'PDF / Drop Folder',
      icon: FileUp,
      accent: 'from-blue-500 to-indigo-500',
    },
    {
      step: '2',
      name: 'Forensics',
      desc: 'pikepdf Metadata & Fonts',
      icon: Search,
      accent: 'from-indigo-500 to-purple-500',
    },
    {
      step: '3',
      name: 'Duplicate',
      desc: 'UNIQUE + Fuzzy Lev ≤ 2',
      icon: CopyX,
      accent: 'from-purple-500 to-pink-500',
    },
    {
      step: '4',
      name: 'Extract',
      desc: 'JSON Schema Normalizer',
      icon: ScanText,
      accent: 'from-pink-500 to-rose-500',
    },
    {
      step: '5',
      name: 'Resolve',
      desc: 'Tax ID & Bank Hash',
      icon: UserCheck,
      accent: 'from-amber-500 to-yellow-500',
    },
    {
      step: '6',
      name: 'Agents',
      desc: '3-Way Match & Scout',
      icon: Bot,
      accent: 'from-teal-500 to-emerald-500',
    },
    {
      step: '7',
      name: 'Score',
      desc: '0–100 Waterfall',
      icon: Gauge,
      accent: 'from-emerald-500 to-cyan-500',
    },
    {
      step: '8',
      name: 'Route',
      desc: 'R1 QBO/ACH or R2 CFO',
      icon: ArrowRightLeft,
      accent: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />

        {stages.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={st.name} className="relative z-10 flex flex-col items-center group cursor-default">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${st.accent} flex items-center justify-center text-white shadow-md shadow-slate-950/40 ring-4 ring-slate-900 group-hover:scale-110 transition-all`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs font-semibold text-slate-200">{st.name}</div>
                <div className="text-[10px] text-slate-400 font-mono tracking-tight">{st.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
