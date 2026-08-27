import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  MessageSquare,
  FileText,
  DollarSign,
  Send,
  Building2,
  ArrowUpRight,
  Sliders,
  CheckSquare,
  Square,
  Lock,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import { InvoiceRecord } from '../types.js';
import { formatINR } from '../lib/utils.js';
import { computeScoreSpec } from '../lib/scoreSpecs.js';

interface CfoReviewQueueProps {
  invoices: InvoiceRecord[];
  onSelectInvoice: (invoice: InvoiceRecord) => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export const CfoReviewQueue: React.FC<CfoReviewQueueProps> = ({
  invoices,
  onSelectInvoice,
  onApprove,
  onReject,
}) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [expandedSpecs, setExpandedSpecs] = useState<{ [invoiceId: string]: boolean }>({});
  const [completedRemediations, setCompletedRemediations] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'FRAUD' | 'MARKUP' | 'DUPLICATE'>('ALL');

  const pendingQueue = invoices.filter(
    (i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID' && i.status !== 'REJECTED'
  );

  const filteredQueue = pendingQueue.filter((inv) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'FRAUD') return inv.forensicRisk > 0.3 || (inv.exceptionReasons || []).some(r => r.includes('Bank') || r.includes('forgery'));
    if (filterType === 'MARKUP') return (inv.exceptionReasons || []).some(r => r.includes('rate') || r.includes('markup') || r.includes('14%'));
    if (filterType === 'DUPLICATE') return inv.duplicateProb > 0.5;
    return true;
  });

  const totalAtRiskCapital = pendingQueue.reduce((acc, i) => acc + (i.amount || 0), 0);

  const toggleSpecs = (id: string) => {
    setExpandedSpecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRemediation = (remediationId: string) => {
    setCompletedRemediations((prev) => ({
      ...prev,
      [remediationId]: !prev[remediationId],
    }));
  };

  const handleCopyPlaybook = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* High-Finance Executive Desk Header */}
      <div className="bg-slate-900 text-white rounded-2xl md:rounded-3xl border border-slate-800 shadow-xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg flex-shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <h2 className="text-xl font-extrabold tracking-tight text-white uppercase font-mono">
                CFO Exec Review Desk
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                {pendingQueue.length} EXCEPTIONS PENDING
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                CAPITAL AT RISK: {formatINR(totalAtRiskCapital)}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Zero-Trust Exception Gating: Deep inspection of score deductions, remediation playbooks, and counterparty trust verdicts.
            </p>
          </div>
        </div>

        {/* Quick Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700 text-xs font-bold font-mono">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'ALL' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            ALL ({pendingQueue.length})
          </button>
          <button
            onClick={() => setFilterType('FRAUD')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'FRAUD' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            WIRE &amp; BEC
          </button>
          <button
            onClick={() => setFilterType('MARKUP')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'MARKUP' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            RATE MARKUPS
          </button>
          <button
            onClick={() => setFilterType('DUPLICATE')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'DUPLICATE' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            DUPLICATES
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredQueue.length === 0 ? (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 font-mono">CFO Exception Queue Clear</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Zero pending counterparty exceptions. All incoming transactions have satisfied zero-trust gates or have been adjudicated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQueue.map((inv) => {
            const spec = computeScoreSpec(inv);
            const isSpecsOpen = expandedSpecs[inv.id] ?? true; // Default open for maximum transparency
            const isPlaybookOpen = selectedPlaybook === inv.id;

            // Calculate simulated live score based on checked remediation steps
            let simulatedBonus = 0;
            spec.remediationSteps.forEach((r) => {
              if (completedRemediations[r.id]) {
                simulatedBonus += r.pointRecovery;
              }
            });
            const liveSimulatedScore = Math.min(100, Number((spec.currentScore + simulatedBonus).toFixed(1)));
            const isAutoPayReady = liveSimulatedScore >= 98.0;

            const playbookText = `Attn: ${inv.vendorName || 'Vendor Accounts Receivable'},\n\nRe: Invoice ${inv.rawInvoiceNumber} (${formatINR(inv.amount)})\n\nOur automated audit detected compliance exceptions against Master Contract Clause 4.2:\n- ${spec.deductions.map((d) => d.reason).join('\n- ')}\n\nRequired Action: ${spec.remediationSteps.map((r) => r.requiredAction).join(' ')}\n\nPayment hold will be released upon receipt of credit memo / verified banking documentation.\n\nTreasury & AP Operations`;

            return (
              <div
                key={inv.id}
                id={`cfo-card-${inv.id}`}
                className="bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200 hover:border-slate-400 p-5 sm:p-6 space-y-5 transition-all shadow-sm flex flex-col justify-between"
              >
                {/* 1. Header Row: Counterparty, Invoice #, Amount & Trust Conviction */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-base font-black text-slate-900 font-mono tracking-tight">
                          {inv.rawInvoiceNumber}
                        </span>
                        {inv.isDemoScenario && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                            {inv.demoScenarioType}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                          PO: {inv.poNumber || 'PO-AERO-2024'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-bold mt-1 flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inv.vendorName || 'Unregistered Vendor'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black font-mono text-slate-900">
                        {formatINR(inv.amount)}
                      </div>
                      <div className="flex items-center justify-end space-x-1 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Current:</span>
                        <span
                          className={`text-xs font-mono font-black ${
                            spec.currentScore >= 80 ? 'text-amber-600' : 'text-rose-600'
                          }`}
                        >
                          {spec.currentScore.toFixed(1)}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Trust Verdict Banner: Should They Be Trusted Or Not */}
                  <div
                    className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
                      spec.trustVerdict === 'DO_NOT_TRUST_HIGH_RISK'
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : spec.trustVerdict === 'CONDITIONAL_TRUST_ACTION_REQUIRED'
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {spec.trustVerdict === 'DO_NOT_TRUST_HIGH_RISK' ? (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      ) : spec.trustVerdict === 'CONDITIONAL_TRUST_ACTION_REQUIRED' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold tracking-wider font-mono text-[11px] uppercase">
                          {spec.trustVerdictLabel}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed font-medium">
                        {spec.trustVerdictExplanation}
                      </p>
                      <div className="text-[11px] font-bold mt-1 text-slate-800 bg-white/70 px-2 py-1 rounded border border-black/5 font-mono">
                        Direct Guidance: {spec.actionGuidance}
                      </div>
                    </div>
                  </div>

                  {/* 3. Detailed Score Specifications (Why rated that low & How to change to higher number) */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <button
                      onClick={() => toggleSpecs(inv.id)}
                      className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-mono uppercase font-black tracking-wider">
                          Forensic Score Specifications &amp; Remediation Roadmap
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-slate-500">
                          {spec.deductions.length} Deductions • {spec.remediationSteps.length} Steps
                        </span>
                        {isSpecsOpen ? (
                          <ChevronDown className="w-4 h-4 text-slate-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </button>

                    {isSpecsOpen && (
                      <div className="p-4 space-y-4 text-xs divide-y divide-slate-200 bg-white">
                        {/* PART A: WHY IT WAS RATED THAT LOW (Root-Cause Deductions) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-rose-800 font-mono">
                            <span className="flex items-center space-x-1.5">
                              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                              <span>Why Rated That Low (Deduction Audit Trail)</span>
                            </span>
                            <span>Total Penalties: -{(100 - spec.currentScore).toFixed(1)} pts</span>
                          </div>

                          <div className="space-y-2">
                            {spec.deductions.map((d, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-200/80 flex items-start justify-between gap-2"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-rose-950 font-mono text-[11px]">
                                      {d.category}
                                    </span>
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 font-mono uppercase">
                                      {d.severity}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-rose-900 leading-snug font-medium">
                                    {d.reason}
                                  </p>
                                </div>
                                <div className="text-right font-mono font-black text-rose-700 whitespace-nowrap text-xs">
                                  -{d.pointsDeducted.toFixed(1)} pts
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* PART B: HOW IT CAN BE CHANGED TO A HIGHER NUMBER (Remediation Checklist & Live Simulator) */}
                        <div className="pt-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-emerald-800 font-mono">
                            <span className="flex items-center space-x-1.5">
                              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                              <span>How to Raise Score to ≥ 98.0 (Remediation Checklist)</span>
                            </span>
                            <span className="text-slate-600 font-mono">
                              Simulated Score: <strong className={liveSimulatedScore >= 98 ? 'text-emerald-600 font-black' : 'text-amber-600 font-black'}>{liveSimulatedScore.toFixed(1)} / 100</strong>
                            </span>
                          </div>

                          <div className="space-y-2">
                            {spec.remediationSteps.map((step) => {
                              const isChecked = !!completedRemediations[step.id];
                              return (
                                <div
                                  key={step.id}
                                  onClick={() => toggleRemediation(step.id)}
                                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                    isChecked
                                      ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-start space-x-2.5">
                                    <div className="mt-0.5 text-slate-500">
                                      {isChecked ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-400" />
                                      )}
                                    </div>
                                    <div className="space-y-0.5">
                                      <div className="flex items-center space-x-2">
                                        <span className={`text-[11px] font-bold ${isChecked ? 'text-emerald-950 font-black' : 'text-slate-900'}`}>
                                          {step.step}
                                        </span>
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">
                                          {step.owner}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-600 leading-snug">
                                        {step.requiredAction}
                                      </p>
                                    </div>
                                  </div>

                                  <span className="text-[11px] font-mono font-black text-emerald-700 whitespace-nowrap">
                                    +{step.pointRecovery.toFixed(1)} pts
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Simulation Result Alert */}
                          {isAutoPayReady && (
                            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center justify-between font-mono animate-in fade-in">
                              <span>QUALIFIED: Simulated score {liveSimulatedScore.toFixed(1)} passes 98.0 autonomous threshold!</span>
                              <span className="text-[10px] uppercase px-2 py-0.5 bg-emerald-600 text-white rounded">
                                Ready for Auto-Pay
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. AI Negotiation & Pushback Playbook (Copyable Memo) */}
                  <div>
                    <button
                      onClick={() => setSelectedPlaybook(isPlaybookOpen ? null : inv.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>{isPlaybookOpen ? 'Hide Negotiation Playbook' : 'Generate Vendor Dispute & Pushback Memo'}</span>
                    </button>

                    {isPlaybookOpen && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2.5 text-xs animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 font-mono text-[11px] uppercase">
                            Pre-Drafted Vendor Dispute Notice
                          </span>
                          <button
                            onClick={() => handleCopyPlaybook(inv.id, playbookText)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            {copiedId === inv.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Notice</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-[10px] bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed overflow-x-auto">
                          {playbookText}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                  <button
                    onClick={() => onSelectInvoice(inv)}
                    className="text-xs font-black text-slate-700 hover:text-blue-600 flex items-center space-x-1 transition-colors cursor-pointer uppercase font-mono"
                  >
                    <span>Inspect Forensic Stream</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onReject(inv.id, 'Rejected by CFO exception review')}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-black transition-colors cursor-pointer font-mono"
                    >
                      1-Click Reject
                    </button>

                    <button
                      onClick={() => onApprove(inv.id, 'Manual CFO override after validation')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-sm cursor-pointer flex items-center space-x-1.5 font-mono"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Approve &amp; Release ACH</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
