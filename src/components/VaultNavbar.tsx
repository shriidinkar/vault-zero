import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  BarChart3,
  Sliders,
  Bell,
  ChevronDown,
  FileSpreadsheet,
  LogOut,
  UserCheck,
  Zap,
  Database,
  Layers,
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
  const [showNotifications, setShowNotifications] = useState(false);
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
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Brand & Organization Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-md flex-shrink-0 font-mono font-black border border-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight font-mono uppercase">
                Vault-Zero
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-slate-900 text-emerald-400 border border-slate-700 uppercase font-mono tracking-wider">
                Autonomous AP
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-800">{workspace.name}</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold font-mono inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {workspace.erpType} Connected
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Right Notification Bell */}
        <div className="flex items-center space-x-2 sm:hidden">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Top Right Action Toolstrip */}
      <div className="flex items-center flex-wrap gap-2 justify-start sm:justify-end">
        {/* Active Dataset & Custom Injected Data Trigger */}
        {onOpenDataInjector && (
          <button
            onClick={onOpenDataInjector}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-all shadow-xs cursor-pointer border border-slate-700"
            title="Switch business dataset or inject custom invoices"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden lg:inline text-slate-300">Data:</span>
            <span className="text-emerald-400 font-bold max-w-[130px] truncate">
              {currentScenario.name.split(' ')[0]}
            </span>
            {customDataCount > 0 && (
              <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                +{customDataCount}
              </span>
            )}
          </button>
        )}

        {/* Schema Viewer */}
        {onOpenSchema && (
          <button
            onClick={onOpenSchema}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            title="View 10-Node AP Workflow Architecture Schema"
          >
            <Code2 className="w-4 h-4 text-slate-600" />
          </button>
        )}

        <button
          onClick={onOpenUpload}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer font-mono"
          title="Upload Raw Invoice or PO Document"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>

        <button
          onClick={onOpenAuditExport}
          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200 flex items-center space-x-1.5 font-mono"
          title="CA Compliance & Ledger Audit Export"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden md:inline">Spend Audit</span>
        </button>

        <button
          onClick={onOpenQboSettings}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
          title="ERP Routing Thresholds & Settings"
        >
          <Sliders className="w-4 h-4 text-slate-600" />
        </button>

        <button
          onClick={onOpenEval}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
          title="Model Precision & Benchmarks"
        >
          <BarChart3 className="w-4 h-4 text-slate-600" />
        </button>

        {/* User Profile & 1-Click Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-xs font-mono">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="font-bold text-slate-900 block leading-tight font-mono">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in space-y-1">
              <div className="px-3 py-2 border-b border-slate-100 mb-1 font-mono">
                <p className="text-xs font-black text-slate-900">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                <p className="text-[10px] text-blue-600 font-bold">{currentUser.department}</p>
              </div>

              {/* 1-Click Role Switcher */}
              <div className="px-2 py-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block px-1 mb-1">
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
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between font-mono transition-colors cursor-pointer ${
                        currentUser.id === u.id
                          ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-slate-900 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                          {u.avatarInitials}
                        </span>
                        <span>{u.name}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
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
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer font-mono flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Log Out &amp; Lock Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

