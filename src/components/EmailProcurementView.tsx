import React, { useState, useEffect } from 'react';
import {
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Lock,
  Search,
  Filter,
  FileText,
  Clock,
  Send,
  Building2,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { EmailProcurementRecord, InvoiceRecord } from '../types.js';
import { formatINR } from '../lib/utils.js';

interface EmailProcurementViewProps {
  onSelectInvoiceById: (invoiceId: string) => void;
  onRefreshAll: () => void;
}

export const EmailProcurementView: React.FC<EmailProcurementViewProps> = ({
  onSelectInvoiceById,
  onRefreshAll,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [autoPoll, setAutoPoll] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AUTO_PAID' | 'CFO_QUEUE' | 'FLAGGED'>('ALL');
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  // Email procurement records
  const [emailRecords, setEmailRecords] = useState<EmailProcurementRecord[]>([
    {
      id: 'em-001',
      senderEmail: 'ap-billing@techinfra-corp.com',
      senderName: 'TechInfra Solutions AR Desk',
      subject: 'Invoice INV-9022: Cloud Infrastructure Hosting Tier 3',
      receivedAt: '10 mins ago',
      attachmentFilename: 'TechInfra_Srv_Oct2024.pdf',
      attachmentSize: '242 KB',
      spfDkimStatus: 'PASS',
      senderDomainAge: '6.4 Years (Trusted Tier 1)',
      status: 'INGESTED_AUTO_PAID',
      extractedAmount: 42000,
      extractedVendor: 'TechInfra Solutions Pvt Ltd',
      invoiceId: 'inv-clean-01',
      trustScore: 99.2,
    },
    {
      id: 'em-002',
      senderEmail: 'accounts@aerotech-systems.com',
      senderName: 'AeroTech Systems Billing Dept',
      subject: 'Commercial Invoice INV-4472: Precision CNC Brackets',
      receivedAt: '24 mins ago',
      attachmentFilename: 'INV-4472_MachinedAlloy.pdf',
      attachmentSize: '418 KB',
      spfDkimStatus: 'PASS',
      senderDomainAge: '4.8 Years (Verified Master Vendor)',
      status: 'INGESTED_CFO_QUEUE',
      extractedAmount: 456000,
      extractedVendor: 'AeroTech Systems Pvt Ltd',
      invoiceId: 'inv-4472',
      trustScore: 78.4,
    },
    {
      id: 'em-003',
      senderEmail: 'dispatch@omniglobal-logistics.in',
      senderName: 'OmniGlobal Freight Dispatch',
      subject: 'Consignment Freight Invoice INV-4471 Re-issue',
      receivedAt: '42 mins ago',
      attachmentFilename: 'OmniLogistics_Freight_Oct.pdf',
      attachmentSize: '310 KB',
      spfDkimStatus: 'PASS',
      senderDomainAge: '8.1 Years',
      status: 'INGESTED_FLAGGED',
      extractedAmount: 820000,
      extractedVendor: 'OmniGlobal Logistics Pvt Ltd',
      invoiceId: 'inv-4471',
      trustScore: 42.0,
    },
    {
      id: 'em-004',
      senderEmail: 'billing@quantum-mat-solutions.com',
      senderName: 'Quantum Materials Remittance Notice',
      subject: 'URGENT: Updated Remittance Details & Invoice INV-4473',
      receivedAt: '1 hour ago',
      attachmentFilename: 'INV-4473_PolycarbonateConsignment.pdf',
      attachmentSize: '512 KB',
      spfDkimStatus: 'FLAGGED',
      senderDomainAge: '14 Days (Unverified Domain Drift)',
      status: 'INGESTED_FLAGGED',
      extractedAmount: 1240000,
      extractedVendor: 'Quantum Materials Corp',
      invoiceId: 'inv-4473',
      trustScore: 35.0,
    },
    {
      id: 'em-005',
      senderEmail: 'invoice-desk@apex-instruments.org',
      senderName: 'Apex Forge Accounting Gateway',
      subject: 'Invoice #INV-4474: Optical Sensor Supply Consignment',
      receivedAt: '2 hours ago',
      attachmentFilename: 'ApexSensors_ElectronicScan.pdf',
      attachmentSize: '890 KB',
      spfDkimStatus: 'PASS',
      senderDomainAge: '3.2 Years',
      status: 'INGESTED_CFO_QUEUE',
      extractedAmount: 980000,
      extractedVendor: 'Apex Forge Instruments Ltd',
      invoiceId: 'inv-4474',
      trustScore: 61.2,
    },
  ]);

  const handleTriggerSync = async () => {
    setSyncing(true);
    try {
      // Simulate real-time email polling and ingestion
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setLastSyncTime(new Date().toLocaleTimeString());
      onRefreshAll();
    } catch (err) {
      console.error('Email sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const filteredRecords = emailRecords.filter((rec) => {
    if (statusFilter === 'AUTO_PAID' && rec.status !== 'INGESTED_AUTO_PAID') return false;
    if (statusFilter === 'CFO_QUEUE' && rec.status !== 'INGESTED_CFO_QUEUE') return false;
    if (statusFilter === 'FLAGGED' && rec.status !== 'INGESTED_FLAGGED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rec.senderEmail.toLowerCase().includes(q) ||
        rec.subject.toLowerCase().includes(q) ||
        rec.extractedVendor.toLowerCase().includes(q) ||
        rec.attachmentFilename.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Executive Direct Email Procurement Desk */}
      <div className="bg-slate-900 text-white rounded-2xl md:rounded-3xl border border-slate-800 shadow-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg flex-shrink-0">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="text-xl font-extrabold tracking-tight uppercase font-mono">
                  Autonomous AP Email Procurement Gateway
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE MAILBOX LISTENER ACTIVE</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                Direct procurement from corporate AP mailbox (<span className="text-blue-300 font-mono">ap-invoices@enterprise.io</span>). Real-time SPF/DKIM verification, attachment extraction, and zero-trust ingestion.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shadow-sm flex items-center space-x-2 cursor-pointer font-mono disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Procuring Inbound Invoices...' : 'Procure & Ingest Inboxes Now'}</span>
            </button>
          </div>
        </div>

        {/* Mailbox Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mailbox Ingress Endpoint</span>
            <span className="font-black text-slate-100 truncate block mt-0.5">ap-inbox@vaultzero.io</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Counterparty SPF/DKIM</span>
            <span className="font-black text-emerald-400 block mt-0.5">100% Cryptographic Pass</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Procured Sync</span>
            <span className="font-black text-slate-100 block mt-0.5">{lastSyncTime}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Auto-Polling Daemon</span>
            <span className="font-black text-emerald-400 block mt-0.5">Active (Every 15s)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email sender, subject, vendor, or PDF..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ALL STREAMS ({emailRecords.length})
          </button>
          <button
            onClick={() => setStatusFilter('AUTO_PAID')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'AUTO_PAID' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            AUTO-PAID (STP)
          </button>
          <button
            onClick={() => setStatusFilter('CFO_QUEUE')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'CFO_QUEUE' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            CFO QUEUE
          </button>
          <button
            onClick={() => setStatusFilter('FLAGGED')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'FLAGGED' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            HIGH RISK
          </button>
        </div>
      </div>

      {/* Procured Invoices Ingestion Feed */}
      <div className="space-y-4">
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-slate-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Left: Email metadata & attachment */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs font-black text-slate-900 font-mono">
                  {item.senderName}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  &lt;{item.senderEmail}&gt;
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                  {item.receivedAt}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.2 rounded font-mono ${
                    item.spfDkimStatus === 'PASS'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  SPF/DKIM: {item.spfDkimStatus}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {item.subject}
              </h3>

              <div className="flex items-center space-x-3 text-xs text-slate-600 flex-wrap gap-y-1">
                <div className="flex items-center space-x-1 font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{item.attachmentFilename} ({item.attachmentSize})</span>
                </div>
                <span className="font-medium text-slate-500">
                  Counterparty Age: <strong className="text-slate-800 font-mono">{item.senderDomainAge}</strong>
                </span>
              </div>
            </div>

            {/* Right: Financial extraction, trust score, and action button */}
            <div className="flex items-center space-x-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <div className="text-right">
                <div className="text-base font-black font-mono text-slate-900">
                  {formatINR(item.extractedAmount)}
                </div>
                <div className="flex items-center justify-end space-x-1 mt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">Trust Score:</span>
                  <span
                    className={`text-xs font-mono font-black ${
                      (item.trustScore ?? 0) >= 98
                        ? 'text-emerald-600'
                        : (item.trustScore ?? 0) >= 70
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {(item.trustScore ?? 0).toFixed(1)}/100
                  </span>
                </div>
              </div>

              <div>
                <span
                  className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider block text-center font-mono ${
                    item.status === 'INGESTED_AUTO_PAID'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : item.status === 'INGESTED_CFO_QUEUE'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {item.status === 'INGESTED_AUTO_PAID'
                    ? 'R1 Auto-Paid (ACH)'
                    : item.status === 'INGESTED_CFO_QUEUE'
                    ? 'CFO Review Hold'
                    : 'Quarantined Risk'}
                </span>
              </div>

              {item.invoiceId && (
                <button
                  onClick={() => onSelectInvoiceById(item.invoiceId!)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Inspect Ingestion Stream"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
