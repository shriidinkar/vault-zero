import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  BarChart3,
  Sliders,
  ChevronDown,
  FileSpreadsheet,
  LogOut,
  Database,
  Code2,
} from 'lucide-react';
import { OrganizationWorkspace, UserProfile } from '../types.js';
import { DatasetScenarioId, DATASET_SCENARIOS } from '../lib/scenarioData.js';

interface VaultNavbarProps {
  currentUser: UserProfile;
  workspace: OrganizationWorkspace;
  onSwitchUser?: (user: UserProfile) => void;
  onOpenUpload: () => void;
  onOpenEval: () => void;
  onOpenQboSettings: () => void;
  onOpenAuditExport: () => void;
  onOpenDataInjector?: () => void;
  onOpenSchema?: () => void;
  activeScenarioId?: DatasetScenarioId;
  customDataCount?: number;
  onLogout: () => void;
}

export const VaultNavbar: React.FC<VaultNavbarProps> = ({
  currentUser,
  workspace,
  onSwitchUser,
  onOpenUpload,
  onOpenEval,
  onOpenQboSettings,
  onOpenAuditExport,
  onOpenDataInjector,
  onOpenSchema,
  activeScenarioId = 'ENTERPRISE_BALANCED',
  customDataCount = 0,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentScenario = DATASET_SCENARIOS.find((s) => s.id === activeScenarioId) || DATASET_SCENARIOS[3];

  const demoUsers: UserProfile[] = [
    {
      id: 'usr_cfo_01',
      name: 'Sarah Jenkins',
      email: 's.jenkins@apexglobal.corp',
      role: 'CFO',
      avatarInitials: 'SJ',
      department: 'Executive Finance & Treasury',
    },
    {
      id: 'usr_ap_02',
      name: 'David Sterling',
      email: 'd.sterling@apexglobal.corp',
      role: 'AP_DIRECTOR',
      avatarInitials: 'DS',
      department: 'Accounts Payable & Controls',
    },
    {
      id: 'usr_proc_03',
      name: 'Marcus Vance',
      email: 'm.vance@apexglobal.corp',
      role: 'PROCUREMENT_LEAD',
      avatarInitials: 'MV',
      department: 'Strategic Sourcing & Vendor Ops',
    },
  ];

  return (
    <header className="bg-white rounded-xl border border-slate-200/90 shadow-xs px-4 py-3 sm:px-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">Vault-Zero</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  AP Engine
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="text-slate-700 font-medium">{workspace.name}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {workspace.erpType} Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center flex-wrap gap-2 justify-start sm:justify-end">
          {/* Active Dataset */}
          {onOpenDataInjector && (
            <button
              onClick={onOpenDataInjector}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-medium transition-colors cursor-pointer border border-slate-200"
              title="Switch business dataset or inject custom invoices"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 hidden sm:inline">Data:</span>
              <span className="font-semibold text-slate-800">{currentScenario.name.split(' ')[0]}</span>
              {customDataCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                  +{customDataCount}
                </span>
              )}
            </button>
          )}

          {/* Schema Viewer */}
          {onOpenSchema && (
            <button
              onClick={onOpenSchema}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer border border-slate-200"
              title="View 10-Node AP Architecture Schema"
            >
              <Code2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenUpload}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
            title="Upload Raw Invoice or PO Document"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={onOpenAuditExport}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-medium transition-colors cursor-pointer border border-slate-200 flex items-center space-x-1.5"
            title="CA Compliance & Ledger Audit Export"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Spend Audit</span>
          </button>

          <button
            onClick={onOpenQboSettings}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer border border-slate-200"
            title="ERP Routing Thresholds & Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenEval}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer border border-slate-200"
            title="Model Precision & Benchmarks"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
            >
              <div className="w-6 h-6 rounded-md bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                {currentUser.avatarInitials}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-semibold text-slate-800 block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 font-normal">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in space-y-1">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  <p className="text-[11px] text-blue-600 font-medium mt-0.5">{currentUser.department}</p>
                </div>

                <div className="px-2 py-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block px-1 mb-1 tracking-wider">
                    Switch Active Persona
                  </span>
                  <div className="space-y-1">
                    {demoUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          if (onSwitchUser) onSwitchUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          currentUser.id === u.id
                            ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-md bg-slate-900 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                            {u.avatarInitials}
                          </span>
                          <span>{u.name}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

