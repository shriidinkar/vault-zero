import React, { useState } from 'react';
import {
  Landmark,
  CreditCard,
  Scale,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  DollarSign,
  ArrowRight,
  Zap,
  Lock,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { formatINR } from '../lib/utils.js';
import {
  InvoiceRecord,
  OrganizationWorkspace,
  UserProfile,
  PaymentDisbursement,
  ReconciliationRecord,
} from '../types.js';

interface FinancePillarViewProps {
  invoices: InvoiceRecord[];
  workspace: OrganizationWorkspace;
  currentUser: UserProfile;
  initialSubTab?: string;
  onSelectInvoice: (invoice: InvoiceRecord) => void;
  onOpenAuditExport: () => void;
}

export const FinancePillarView: React.FC<FinancePillarViewProps> = ({
  invoices,
  workspace,
  currentUser,
  initialSubTab = 'payments',
  onSelectInvoice,
  onOpenAuditExport,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Mock Payments Queue
  const [paymentsQueue, setPaymentsQueue] = useState<PaymentDisbursement[]>([
    {
      id: 'pay_901',
      invoiceId: 'inv_4474',
      invoiceNumber: 'INV-4474',
      vendorName: 'AWS Enterprise Cloud',
      amount: 42000,
      currency: 'INR',
      rail: 'ACH_INSTANT',
      status: 'SETTLED',
      settlementHash: '0x8f2d...91c4',
      scheduledDate: '2026-08-27',
      settledAt: '12m ago',
    },
    {
      id: 'pay_902',
      invoiceId: 'inv_8812',
      invoiceNumber: 'INV-8812',
      vendorName: 'Apex Logistics Corp',
      amount: 184000,
      currency: 'INR',
      rail: 'FEDNOW',
      status: 'AUTO_PAID',
      settlementHash: '0x3c7e...44a1',
      scheduledDate: '2026-08-27',
      settledAt: '24m ago',
    },
    {
      id: 'pay_903',
      invoiceId: 'inv_3920',
      invoiceNumber: 'INV-3920',
      vendorName: 'Quantum Materials',
      amount: 89000,
      currency: 'INR',
      rail: 'WIRE_SWIFT',
      status: 'ESCROW_HELD',
      escrowReason: 'Altered Bank Routing Hash Drift quarantined',
      settlementHash: 'QUARANTINE_LOCKED',
      scheduledDate: '2026-08-28',
    },
    {
      id: 'pay_904',
      invoiceId: 'inv_1092',
      invoiceNumber: 'INV-1092',
      vendorName: 'Starlight Defense Avionics',
      amount: 345000,
      currency: 'INR',
      rail: 'ACH_INSTANT',
      status: 'IN_FLIGHT',
      settlementHash: '0x1a9b...77f3',
      scheduledDate: '2026-08-27',
    },
  ]);

  // Mock Reconciliation Records
  const [reconciliations, setReconciliations] = useState<ReconciliationRecord[]>([
    {
      id: 'rec_1',
      invoiceNumber: 'INV-4474',
      vendorName: 'AWS Enterprise Cloud',
      invoiceAmount: 42000,
      bankFeedAmount: 42000,
      erpLedgerAmount: 42000,
      matchStatus: 'PERFECT_MATCH',
      varianceAmount: 0,
      glAccount: '6100 - Cloud Infrastructure OPEX',
      journalEntryId: 'JE-2026-8812',
      reconciledAt: '10m ago',
    },
    {
      id: 'rec_2',
      invoiceNumber: 'INV-8812',
      vendorName: 'Apex Logistics Corp',
      invoiceAmount: 184000,
      bankFeedAmount: 184000,
      erpLedgerAmount: 184000,
      matchStatus: 'PERFECT_MATCH',
      varianceAmount: 0,
      glAccount: '6300 - Freight & Shipping Services',
      journalEntryId: 'JE-2026-8813',
      reconciledAt: '22m ago',
    },
    {
      id: 'rec_3',
      invoiceNumber: 'INV-3920',
      vendorName: 'Quantum Materials',
      invoiceAmount: 89000,
      bankFeedAmount: 0,
      erpLedgerAmount: 89000,
      matchStatus: 'UNMATCHED_BANK',
      varianceAmount: 89000,
      glAccount: '1200 - Direct Silicon Raw Materials',
      journalEntryId: 'JE-PENDING-HOLD',
      reconciledAt: 'Quarantined in Escrow',
    },
  ]);

  const totalDisbursed = paymentsQueue
    .filter((p) => p.status === 'SETTLED' || p.status === 'AUTO_PAID')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Pillar Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black font-mono text-slate-900 tracking-tight uppercase">
                Finance Pillar
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                Payments &amp; Ledger
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Payment Rails (ACH / FedNow) • 3-Way Bank Reconciliation • Immutable Financial Records
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuditExport}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer self-start md:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export CA Compliance Ledger</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-slate-900 text-white rounded-2xl p-1.5 flex items-center space-x-1 overflow-x-auto shadow-md border border-slate-800 scrollbar-none">
        {[
          { id: 'payments', label: 'Payments & Settlement Hub', icon: CreditCard, count: paymentsQueue.length },
          { id: 'reconciliation', label: '3-Way Bank Reconciliation', icon: Scale },
          { id: 'records', label: 'Financial Records & Journal Entries', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap font-mono uppercase tracking-wider ${
                isActive ? 'bg-emerald-600 text-slate-950 shadow-md font-extrabold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>

              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: PAYMENTS HUB */}
      {activeSubTab === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                Total Settled Disbursements
              </span>
              <span className="text-2xl font-black font-mono text-emerald-600 block">
                {formatINR(totalDisbursed)}
              </span>
              <span className="text-xs text-slate-400">Direct ACH &amp; FedNow rails</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                Escrow Quarantined Funds
              </span>
              <span className="text-2xl font-black font-mono text-purple-600 block">
                {formatINR(89000)}
              </span>
              <span className="text-xs text-slate-400">Zero-Trust protection against wire fraud</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                Active ERP Link
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 block flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{workspace.erpType}</span>
              </span>
              <span className="text-xs text-emerald-600 font-bold">Live Synchronized</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black font-mono text-slate-900 uppercase">
              Disbursement Rails Queue
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Invoice #</th>
                    <th className="py-3 px-3">Vendor</th>
                    <th className="py-3 px-3">Payment Rail</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Settlement Status</th>
                    <th className="py-3 px-3 text-right">Hash Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentsQueue.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-blue-600">{p.invoiceNumber}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{p.vendorName}</td>
                      <td className="py-3 px-3 text-slate-600">{p.rail}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{formatINR(p.amount)}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'SETTLED' || p.status === 'AUTO_PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'ESCROW_HELD'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">{p.settlementHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: RECONCILIATION */}
      {activeSubTab === 'reconciliation' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black font-mono text-slate-900 uppercase">
              3-Way Bank Feed vs ERP GL vs AP Invoice Reconciliation
            </h3>
            <p className="text-xs text-slate-500">
              Automated ledger matching ensuring 100% mathematical parity across bank accounts and financial statements.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">GL Account Code</th>
                  <th className="py-3 px-3">Invoice Total</th>
                  <th className="py-3 px-3">Bank Feed</th>
                  <th className="py-3 px-3">ERP Ledger</th>
                  <th className="py-3 px-3">Match Status</th>
                  <th className="py-3 px-3 text-right">Journal ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconciliations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-blue-600">{r.invoiceNumber}</td>
                    <td className="py-3 px-3 text-slate-700">{r.glAccount}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{formatINR(r.invoiceAmount)}</td>
                    <td className="py-3 px-3 text-slate-700">{formatINR(r.bankFeedAmount)}</td>
                    <td className="py-3 px-3 text-slate-700">{formatINR(r.erpLedgerAmount)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.matchStatus === 'PERFECT_MATCH'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.matchStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">{r.journalEntryId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: RECORDS */}
      {activeSubTab === 'records' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 uppercase">
                Immutable Financial Audit Records &amp; Tax Compliance
              </h3>
              <p className="text-xs text-slate-500">
                Auditor-ready general ledger logs formatted for CA compliance, GSTIN filings, and external audits.
              </p>
            </div>
            <button
              onClick={onOpenAuditExport}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Signed CA Ledger</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold font-mono text-slate-900 uppercase">
                Statutory Tax &amp; GST Compliance
              </h4>
              <p className="text-xs text-slate-600">
                100% automated 2B reconciliation against government GST portal with HSN/SAC code validation.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold">
                ✓ 200/200 GSTIN &amp; PAN Tax Identifiers Verified
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold font-mono text-slate-900 uppercase">
                Cryptographic Audit Trail
              </h4>
              <p className="text-xs text-slate-600">
                Every action (OCR extraction, 3-way line check, CFO note, ACH dispatch) is signed into an immutable block.
              </p>
              <div className="pt-2 text-[11px] font-mono text-blue-700 font-bold">
                ✓ SHA-256 Ledger Sealed: 0x82f9...10a9
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
