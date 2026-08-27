import React from 'react';
import {
  ShoppingCart,
  BrainCircuit,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Lock,
  RotateCcw,
  Scale,
  CreditCard,
  Building2,
  PieChart,
  Inbox,
  Mail,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { formatINR } from '../lib/utils.js';
import {
  InvoiceRecord,
  PipelineMetrics,
  MainNavPillar,
  OrganizationWorkspace,
  UserProfile,
} from '../types.js';

interface DashboardViewProps {
  metrics: PipelineMetrics | null;
  invoices: InvoiceRecord[];
  workspace: OrganizationWorkspace;
  currentUser: UserProfile;
  onNavigatePillar: (pillar: MainNavPillar, subview?: string) => void;
  onOpenUpload: () => void;
  onOpenAuditExport: () => void;
  onOpenQboSettings: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  invoices,
  workspace,
  currentUser,
  onNavigatePillar,
  onOpenUpload,
  onOpenAuditExport,
  onOpenQboSettings,
}) => {
  const autoPaidInvoices = invoices.filter(
    (i) => i.status === 'PAID' && i.routeDecision === 'R1_AUTO_PAY'
  );
  const pendingExceptions = invoices.filter(
    (i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID' && i.status !== 'REJECTED'
  );
  const escrowHeldInvoices = invoices.filter(
    (i) =>
      (i.forensicRisk >= 0.6 ||
        i.duplicateProb >= 0.7 ||
        i.status === 'FLAGGED' ||
        i.routeDecision === 'R3_HOLD_ESCROW') &&
      i.status !== 'PAID' &&
      i.status !== 'SETTLED' &&
      i.status !== 'REJECTED'
  );

  const totalSpend = invoices.reduce((acc, i) => acc + (i.amount || 0), 0) || 14850000;
  const autoPaidSpend =
    invoices.filter((i) => i.status === 'PAID').reduce((acc, i) => acc + (i.amount || 0), 0) ||
    11240000;
  const identifiedSavings = metrics?.identifiedSavings || 3610000;
  const stpRate = metrics?.autoPaidPct || 94.2;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome & KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              STP Auto-Pay Rate
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-slate-900">{stpRate}%</span>
              <span className="text-xs font-bold text-emerald-600 font-mono">≥ 98.0 Target</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{autoPaidInvoices.length} Cleared with zero touch</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-mono font-bold">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Pending CFO Review
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-amber-600">
                {pendingExceptions.length}
              </span>
              <span className="text-xs font-bold text-amber-600 font-mono">Exceptions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Rate markups &amp; discrepancy</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-mono font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Leakage &amp; Fraud Intercept
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-emerald-600">
                {formatINR(identifiedSavings)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Duplicates &amp; altered hashes blocked</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-mono font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              DPO Working Capital Alpha
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-indigo-600">
                +{workspace.dpoDays}d
              </span>
              <span className="text-xs font-bold text-emerald-600 font-mono">+4.2d Delta</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Dynamic 2/10 Net 30 capture</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono font-bold">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Complete Interactive Flow Diagram Canvas Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
              Autonomous Pipeline
            </span>
            <h2 className="text-lg font-black font-mono text-white">
              End-to-End System Workflow Map
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click any step to inspect active transactions &amp; controls
          </span>
        </div>

        {/* 3 Pillar Architectural Flow Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Pillar 1: Procurement Branch */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono text-blue-400 flex items-center space-x-1.5">
                  <ShoppingCart className="w-4 h-4" />
                  <span>1. PROCUREMENT</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {invoices.length} Invoices
                </span>
              </div>

              {/* Sub-steps inside Procurement */}
              <div className="space-y-1.5 pt-1 text-xs font-mono">
                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'purchase-requests')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ Purchase Request (PR)</span>
                  <span className="text-[10px] text-blue-400 font-bold">12 Active</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'purchase-orders')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ Purchase Order (PO)</span>
                  <span className="text-[10px] text-blue-400 font-bold">24 POs Matched</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'invoices')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ Invoice &amp; Email Drop</span>
                  <span className="text-[10px] text-emerald-400 font-bold">OCR 99.4%</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'ai-audit')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ AI AUDIT &amp; TRUST SCORE</span>
                  <span className="text-[10px] text-purple-400 font-bold">8-Stage Engine</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'decision-engine')}
                  className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-950/80 flex items-center justify-between cursor-pointer border border-blue-800 text-blue-200"
                >
                  <span className="text-[11px] font-bold">
                    → DECISION ENGINE (Auto / Escrow / Approval)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigatePillar('PROCUREMENT')}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Open Procurement Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: Intelligence Branch */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono text-purple-400 flex items-center space-x-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  <span>2. INTELLIGENCE</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Real-Time AP Brain
                </span>
              </div>

              {/* Sub-steps inside Intelligence */}
              <div className="space-y-1.5 pt-1 text-xs font-mono">
                <div
                  onClick={() => onNavigatePillar('INTELLIGENCE', 'risk-center')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ Risk Center &amp; VaR</span>
                  <span className="text-[10px] text-emerald-400 font-bold">0.02% VaR</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('INTELLIGENCE', 'vendor-intel')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ Counterparty Vendor Intel</span>
                  <span className="text-[10px] text-purple-400 font-bold">48 Profiles</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('INTELLIGENCE', 'savings')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ Savings Alpha &amp; Discounts</span>
                  <span className="text-[10px] text-amber-400 font-bold">{formatINR(3610000)}</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('INTELLIGENCE', 'copilot')}
                  className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-950/80 flex items-center justify-between cursor-pointer border border-purple-800 text-purple-200"
                >
                  <span className="text-[11px] font-bold">→ AI AP Copilot Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigatePillar('INTELLIGENCE')}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Open Intelligence &amp; Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3: Finance Branch */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono text-emerald-400 flex items-center space-x-1.5">
                  <Landmark className="w-4 h-4" />
                  <span>3. FINANCE</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {workspace.erpType}
                </span>
              </div>

              {/* Sub-steps inside Finance */}
              <div className="space-y-1.5 pt-1 text-xs font-mono">
                <div
                  onClick={() => onNavigatePillar('FINANCE', 'payments')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ Payments &amp; ACH Settle</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{formatINR(autoPaidSpend)}</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('FINANCE', 'reconciliation')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ 3-Way GL Reconciliation</span>
                  <span className="text-[10px] text-emerald-400 font-bold">100% Balanced</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('FINANCE', 'records')}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 flex items-center justify-between cursor-pointer border border-slate-800 text-slate-300 hover:text-white"
                >
                  <span className="text-[11px]">→ CA Audit Ledger &amp; Records</span>
                  <span className="text-[10px] text-blue-400 font-bold">Exportable</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'feedback')}
                  className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/80 flex items-center justify-between cursor-pointer border border-emerald-800 text-emerald-200"
                >
                  <span className="text-[11px] font-bold">→ FEEDBACK → AI LEARNING</span>
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigatePillar('FINANCE')}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-mono font-black flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Open Finance &amp; Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Toolstrip */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-900 font-mono">
            Zero-Trust Pre-ERP Forensic Ingestion
          </h3>
          <p className="text-xs text-slate-500">
            Submit raw documents to trigger the 8-stage zero-trust audit and automated route determination.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Upload Document For Audit</span>
          </button>

          <button
            onClick={onOpenAuditExport}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            <span>Export CA Ledger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
