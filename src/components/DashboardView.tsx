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
      {/* Top KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              STP Auto-Pay Rate
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900">{stpRate}%</span>
              <span className="text-xs font-semibold text-emerald-700 font-mono">≥ 98.0 Target</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{autoPaidInvoices.length} invoices cleared touchless</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Pending CFO Review
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-amber-700">
                {pendingExceptions.length}
              </span>
              <span className="text-xs font-semibold text-amber-800 font-mono">In Review</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Price variance &amp; missing records</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-semibold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Leakage &amp; Fraud Intercept
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-700">
                {formatINR(identifiedSavings)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Duplicates &amp; altered hashes blocked</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              DPO Working Capital Alpha
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-indigo-700">
                +{workspace.dpoDays}d
              </span>
              <span className="text-xs font-semibold text-emerald-700 font-mono">+4.2d Net</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Dynamic 2/10 Net 30 capture</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Complete Interactive Flow Diagram Canvas Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-emerald-400">Autonomous Orchestration</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">10-Stage Pipeline</span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">
              End-to-End System Workflow Map
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any stage to view live transactions &amp; controls
          </span>
        </div>

        {/* 3 Pillar Architectural Flow Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pillar 1: Procurement Branch */}
          <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-700/60 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 flex items-center space-x-1.5 uppercase tracking-wide">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                  <span>1. Procurement Pipeline</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80">
                  {invoices.length} Invoices
                </span>
              </div>

              {/* Sub-steps inside Procurement */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'purchase-requests')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Purchase Request (PR)</span>
                  <span className="text-[11px] font-mono text-blue-400 font-medium">12 Active</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'purchase-orders')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Purchase Order (PO) Match</span>
                  <span className="text-[11px] font-mono text-blue-400 font-medium">24 Reconciled</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'invoices')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Inbound OCR &amp; Ingestion</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">OCR 99.4%</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'ai-audit')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Multi-Agent Swarm Audit</span>
                  <span className="text-[11px] font-mono text-purple-300 font-medium">8 Checks Active</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'decision-engine')}
                  className="p-2.5 rounded-md bg-blue-950/50 hover:bg-blue-900/60 flex items-center justify-between cursor-pointer border border-blue-800/80 text-blue-200 transition-colors"
                >
                  <span className="font-medium">
                    Decision Engine (Auto / Escrow / CFO)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigatePillar('PROCUREMENT')}
              className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
            >
              <span>View Procurement Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: Intelligence Branch */}
          <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-700/60 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5 uppercase tracking-wide">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span>2. Risk &amp; Intelligence</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/80">
                  Continuous
                </span>
              </div>

              {/* Sub-steps inside Intelligence */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div
                  onClick={() => onNavigatePillar('INTELLIGENCE', 'risk-center')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Counterparty Risk &amp; VaR</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">0.02% VaR</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('INTELLIGENCE', 'vendor-intel')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Vendor Master Profiles</span>
                  <span className="text-[11px] font-mono text-purple-300 font-medium">48 Monitored</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('INTELLIGENCE', 'savings')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Cash Discount Capture (2/10)</span>
                  <span className="text-[11px] font-mono text-amber-300 font-medium">{formatINR(3610000)}</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('INTELLIGENCE', 'copilot')}
                  className="p-2.5 rounded-md bg-purple-950/50 hover:bg-purple-900/60 flex items-center justify-between cursor-pointer border border-purple-800/80 text-purple-200 transition-colors"
                >
                  <span className="font-medium">AI AP Copilot Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigatePillar('INTELLIGENCE')}
              className="w-full py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
            >
              <span>View Intelligence Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3: Finance Branch */}
          <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-700/60 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5 uppercase tracking-wide">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  <span>3. Finance &amp; GL</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  {workspace.erpType}
                </span>
              </div>

              {/* Sub-steps inside Finance */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div
                  onClick={() => onNavigatePillar('FINANCE', 'payments')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Instant ACH &amp; Rail Settlement</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">{formatINR(autoPaidSpend)}</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('FINANCE', 'reconciliation')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>3-Way Ledger Reconciliation</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">100% Balanced</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('FINANCE', 'records')}
                  className="p-2 rounded-md bg-slate-900/80 hover:bg-slate-750 flex items-center justify-between cursor-pointer border border-slate-750 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Audit Trail &amp; CA Ledger</span>
                  <span className="text-[11px] font-mono text-blue-300 font-medium">Export Ready</span>
                </div>

                <div
                  onClick={() => onNavigatePillar('PROCUREMENT', 'feedback')}
                  className="p-2.5 rounded-md bg-emerald-950/50 hover:bg-emerald-900/60 flex items-center justify-between cursor-pointer border border-emerald-800/80 text-emerald-200 transition-colors"
                >
                  <span className="font-medium">Feedback Calibration Loop</span>
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigatePillar('FINANCE')}
              className="w-full py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
            >
              <span>View Finance &amp; Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Strip */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-900">
            Zero-Trust Pre-ERP Forensic Ingestion
          </h3>
          <p className="text-xs text-slate-500">
            Submit raw documents to trigger the 8-stage zero-trust audit and automated route determination.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenUpload}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={onOpenAuditExport}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>Export CA Ledger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
