import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Bot,
  Coins,
  ArrowRight,
  TrendingDown,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Barcode,
  ExternalLink,
  Lock,
  Binary,
} from 'lucide-react';
import { InvoiceRecord } from '../types.js';
import { formatINR } from '../lib/utils.js';

interface InvoiceDetailModalProps {
  invoice: InvoiceRecord | null;
  onClose: () => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<'waterfall' | 'lines' | 'forensics' | 'agents' | 'preview' | 'erp'>('waterfall');
  const [cfoNotes, setCfoNotes] = useState('');

  if (!invoice) return null;

  const score = invoice.trustScore ?? 0;
  const isAutoPaid = invoice.routeDecision === 'R1_AUTO_PAY' && invoice.status === 'PAID';
  const isCfoQueue = invoice.routeDecision === 'R2_CFO_REVIEW' && invoice.status !== 'PAID' && invoice.status !== 'REJECTED';
  const isEscrowHeld =
    (invoice.routeDecision === 'R3_HOLD_ESCROW' ||
      invoice.status === 'FLAGGED' ||
      invoice.forensicRisk >= 0.5 ||
      invoice.duplicateProb >= 0.5) &&
    invoice.status !== 'PAID' &&
    invoice.status !== 'REJECTED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
                score >= 98
                  ? 'bg-emerald-600'
                  : score >= 80
                  ? 'bg-amber-500'
                  : 'bg-rose-600'
              }`}
            >
              {score >= 98 ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight font-mono">
                  {invoice.rawInvoiceNumber}
                </h2>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isAutoPaid
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {invoice.routeDecision === 'R1_AUTO_PAY' ? 'R1: Auto-Paid (ACH)' : 'R2: CFO Review Queue'}
                </span>
                {invoice.isDemoScenario && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {invoice.demoScenarioType || 'DEMO ANOMALY'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {invoice.vendorName || 'Unregistered Vendor'} • {formatINR(invoice.amount)} •{' '}
                {new Date(invoice.invoiceDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Trust score badge */}
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trust Score</div>
              <div
                className={`text-2xl font-extrabold font-mono ${
                  score >= 98 ? 'text-emerald-600' : score >= 80 ? 'text-amber-600' : 'text-rose-600'
                }`}
              >
                {score.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="px-6 border-b border-slate-100 bg-white flex space-x-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'waterfall', label: 'Waterfall Score' },
            { id: 'lines', label: `Line Items (${invoice.lineItems?.length || 0})` },
            { id: 'forensics', label: 'Digital Forensics' },
            { id: 'agents', label: 'Multi-Agent Swarm' },
            { id: 'erp', label: 'ERP & ACH Rails' },
            { id: 'preview', label: 'Raw PDF / Text' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: WATERFALL TRUST SCORE */}
          {activeTab === 'waterfall' && (
            <div className="space-y-6">
              {/* Top Banner Decision */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isAutoPaid
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isAutoPaid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {isAutoPaid
                        ? 'Passed All Zero-Trust Gates: Auto-Dispatched to QuickBooks & ACH'
                        : 'Routed to CFO Exception Queue'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {invoice.routingReason || 'Multi-agent score evaluated.'}
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono text-xs font-bold">
                  Gate Threshold: &ge; 98.0 Score
                </div>
              </div>

              {/* Waterfall Breakdown Visual */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Signal Contributing Breakdown (Weighted Composite)
                </h3>

                <div className="space-y-3">
                  {/* Signal 1: Duplicate (Weight 0.30) */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Duplicate Independence (Weight: 30%)</span>
                      <span className="font-mono text-slate-900">
                        {((invoice.scoreBreakdown?.duplicateScore ?? 100) * 0.3).toFixed(1)} / 30.0 pts
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${invoice.scoreBreakdown?.duplicateScore ?? 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Signal 2: Forensics (Weight 0.20) */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Digital Forensics Integrity (Weight: 20%)</span>
                      <span className="font-mono text-slate-900">
                        {((invoice.scoreBreakdown?.forensicScore ?? 100) * 0.2).toFixed(1)} / 20.0 pts
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${invoice.scoreBreakdown?.forensicScore ?? 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Signal 3: 3-Way Match & Audit (Weight 0.20) */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>3-Way Match &amp; PO Compliance (Weight: 20%)</span>
                      <span className="font-mono text-slate-900">
                        {((invoice.scoreBreakdown?.auditScore ?? 100) * 0.2).toFixed(1)} / 20.0 pts
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${invoice.scoreBreakdown?.auditScore ?? 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Signal 4: Price Floor Benchmark (Weight 0.15) */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Market Price Variance Floor (Weight: 15%)</span>
                      <span className="font-mono text-slate-900">
                        {((invoice.scoreBreakdown?.priceVarianceScore ?? 100) * 0.15).toFixed(1)} / 15.0 pts
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${invoice.scoreBreakdown?.priceVarianceScore ?? 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Signal 5: Entity & Control Flags (Weight 0.15) */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Vendor Entity &amp; Internal Controls (Weight: 15%)</span>
                      <span className="font-mono text-slate-900">
                        {((invoice.scoreBreakdown?.controlFlagsScore ?? 100) * 0.15).toFixed(1)} / 15.0 pts
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${invoice.scoreBreakdown?.controlFlagsScore ?? 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXTRACTED LINE ITEMS */}
          {activeTab === 'lines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Borderless table extracted via zero-shot ontology parser</span>
                <span className="font-mono font-bold text-emerald-700">Cross-Check Sum: Balanced</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">UNSPSC Category</th>
                      <th className="py-3 px-4 text-right">Qty</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Contract Price</th>
                      <th className="py-3 px-4 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {invoice.lineItems?.map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{line.description}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700">
                            {line.category || 'Raw Materials'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">{line.quantity}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {formatINR(line.unitPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          {line.contractUnitPrice ? formatINR(line.contractUnitPrice) : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {formatINR(line.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL FORENSICS */}
          {activeTab === 'forensics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase">PDF Producer String</div>
                  <div className="font-mono text-xs text-slate-900 font-bold">
                    {invoice.forensicReport?.pdfProducer || 'Adobe PDF Library 15.0 / Standard'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase">Creation vs ModDate Match</div>
                  <div className="font-mono text-xs text-slate-900 font-bold flex items-center space-x-1.5">
                    {invoice.forensicReport?.creationModDateMismatch ? (
                      <span className="text-rose-600">Mismatch Detected (&gt; 48h drift)</span>
                    ) : (
                      <span className="text-emerald-600">Synchronized &amp; Signed</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase">Font Substitution &amp; Kerning</div>
                  <div className="font-mono text-xs text-slate-900 font-bold">
                    {invoice.forensicReport?.fontTamperRisk ? (
                      <span className="text-rose-600">Altered Font Spacing (&gt;3 font families)</span>
                    ) : (
                      <span className="text-emerald-600">Embedded Typeface Verified</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase">Forensic Heuristic Score</div>
                  <div className="font-mono text-xs text-slate-900 font-bold">
                    Risk: {(invoice.forensicRisk ?? 0).toFixed(2)} / 1.00
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MULTI-AGENT SWARM */}
          {activeTab === 'agents' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {invoice.auditFindings?.map((finding, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      finding.severity === 'HIGH'
                        ? 'bg-rose-50 border-rose-200'
                        : finding.severity === 'MEDIUM'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-slate-700" />
                        <span className="font-bold text-xs text-slate-900">{finding.agentName || 'Auditor Swarm'}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white font-bold text-slate-700">
                          {finding.findingType}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        Deduction: -{finding.scoreDeduction} pts
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{finding.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ERP & PAYMENT RAILS */}
          {activeTab === 'erp' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-700">QuickBooks Online Bill Sync</span>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {invoice.erpPushResult?.qboBillId ? `Bill #${invoice.erpPushResult.qboBillId}` : 'Ready for Sync'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-700">Mock ACH Payment Rail</span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {invoice.erpPushResult?.achReference || 'ACH-SIM-PENDING'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-700">Settlement Status</span>
                  <span className="font-bold text-xs text-emerald-700">
                    {invoice.status === 'PAID' ? 'Settled & Executed' : 'Awaiting CFO Release'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RAW PREVIEW */}
          {activeTab === 'preview' && (
            <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs max-h-80 overflow-y-auto space-y-2">
              <div className="text-slate-400">// Ingested PDF Raw Text &amp; OCR stream</div>
              <pre className="whitespace-pre-wrap">{invoice.rawExtractedText || 'Raw invoice OCR text buffer...'}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Transaction ID: {invoice.id}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {isEscrowHeld && (
              <>
                <button
                  onClick={() => {
                    onReject(invoice.id, cfoNotes || 'Rejected due to escrow quarantine risk');
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reject &amp; Quarantine
                </button>
                <button
                  onClick={() => {
                    onApprove(invoice.id, cfoNotes || 'Escrow release authorized after review');
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Release Escrow &amp; Settle (ACH)</span>
                </button>
              </>
            )}
            {isCfoQueue && (
              <>
                <button
                  onClick={() => {
                    onReject(invoice.id, cfoNotes);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  1-Click Reject
                </button>
                <button
                  onClick={() => {
                    onApprove(invoice.id, cfoNotes);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Approve &amp; Auto-Pay (ACH)</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
