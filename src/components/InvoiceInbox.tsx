import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  ChevronRight,
  Shield,
  Zap,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Play,
  Filter,
} from 'lucide-react';
import { InvoiceRecord } from '../types.js';
import { formatINR } from '../lib/utils.js';

interface InvoiceInboxProps {
  invoices: InvoiceRecord[];
  onSelectInvoice: (invoice: InvoiceRecord) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  activeFilterTab: string;
  setActiveFilterTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const InvoiceInbox: React.FC<InvoiceInboxProps> = ({
  invoices,
  onSelectInvoice,
  onApprove,
  onReject,
  activeFilterTab,
  setActiveFilterTab,
  searchQuery,
  setSearchQuery,
}) => {
  // Score Chip helper
  const renderScoreChip = (score?: number) => {
    if (score === undefined || score === null) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-400">
          N/A
        </span>
      );
    }

    if (score >= 98) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{score.toFixed(1)}</span>
        </span>
      );
    }

    if (score >= 80) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{score.toFixed(1)}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        <span>{score.toFixed(1)}</span>
      </span>
    );
  };

  // Status & Route pill helper
  const renderStatusPill = (invoice: InvoiceRecord) => {
    if (invoice.routeDecision === 'R1_AUTO_PAY' && invoice.status === 'PAID') {
      return (
        <div className="flex flex-col">
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700">
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>R1: Auto-Paid (QBO)</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {invoice.erpPushResult?.achReference || 'ACH Settled'}
          </span>
        </div>
      );
    }

    if (invoice.status === 'REJECTED') {
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600">
          <XCircle className="w-3.5 h-3.5" />
          <span>CFO Rejected</span>
        </span>
      );
    }

    if (invoice.status === 'FLAGGED' || invoice.routeDecision === 'R2_CFO_REVIEW') {
      return (
        <div className="flex flex-col">
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>R2: CFO Queue</span>
          </span>
          <span className="text-[10px] text-amber-600/90 truncate max-w-[140px]">
            {invoice.exceptionReasons?.[0] || 'Requires Review'}
          </span>
        </div>
      );
    }

    return (
      <span className="inline-flex items-center space-x-1 text-xs font-medium text-slate-500">
        <Clock className="w-3.5 h-3.5" />
        <span>{invoice.status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Standalone Dedicated Taskbar / Command Center Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-3">
        {/* Top Line: Primary Filter Segmented Controls + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Segmented Filter Pills (Non-scrolling, wraps cleanly on smaller screens) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
            {[
              {
                key: 'all',
                label: 'All Invoices',
                icon: Layers,
                count: invoices.length,
              },
              {
                key: 'cfo-queue',
                label: 'CFO Queue',
                icon: AlertTriangle,
                count: invoices.filter((i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID' && i.status !== 'REJECTED').length,
                badgeActive: 'bg-amber-500 text-white',
                badgeInactive: 'bg-amber-100 text-amber-800',
              },
              {
                key: 'auto-paid',
                label: 'R1 Auto-Paid',
                icon: Zap,
                count: invoices.filter((i) => i.status === 'PAID' && i.routeDecision === 'R1_AUTO_PAY').length,
                badgeActive: 'bg-emerald-500 text-white',
                badgeInactive: 'bg-emerald-100 text-emerald-800',
              },
              {
                key: 'flagged',
                label: 'Flagged / Anomalies',
                icon: ShieldAlert,
                count: invoices.filter((i) => i.status === 'FLAGGED' || i.routeDecision === 'R2_CFO_REVIEW').length,
                badgeActive: 'bg-rose-500 text-white',
                badgeInactive: 'bg-rose-100 text-rose-800',
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFilterTab === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`taskbar-filter-${tab.key}`}
                  onClick={() => setActiveFilterTab(tab.key)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? (tab.badgeActive || 'bg-blue-600 text-white')
                          : (tab.badgeInactive || 'bg-slate-200/80 text-slate-700')
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box in Taskbar */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice #, vendor, PO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-full hover:bg-slate-200 cursor-pointer"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Separate Invoice Data Table Container */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Table Sub-Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audit Ledger &amp; Settlement Stream
            </h3>
            <span className="text-[11px] font-mono font-bold text-slate-500">
              ({invoices.length} matching)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Click row for forensic breakdown &amp; line items
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4 sm:px-6">Invoice # &amp; Demo Tag</th>
              <th className="py-3.5 px-4">Vendor &amp; Trust Tier</th>
              <th className="py-3.5 px-4">PO Match</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Trust Score</th>
              <th className="py-3.5 px-4">Forensics / Findings</th>
              <th className="py-3.5 px-4">Routing Decision</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">No matching invoices found</p>
                  <p className="text-xs text-slate-400">Try changing your search query or filter tab</p>
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const isAutoPaid = inv.routeDecision === 'R1_AUTO_PAY' && inv.status === 'PAID';
                const isCfoQueue = inv.routeDecision === 'R2_CFO_REVIEW' && inv.status !== 'PAID' && inv.status !== 'REJECTED';

                return (
                  <tr
                    key={inv.id}
                    id={`invoice-row-${inv.id}`}
                    onClick={() => onSelectInvoice(inv)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    {/* Invoice # & Demo tag */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 font-mono group-hover:text-blue-600 transition-colors">
                          {inv.rawInvoiceNumber}
                        </span>
                        {inv.isDemoScenario && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            DEMO
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(inv.invoiceDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Vendor Name & Trust Tier */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{inv.vendorName || 'Unregistered Vendor'}</div>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-slate-500 font-mono">Tax: Verified</span>
                      </div>
                    </td>

                    {/* PO Match */}
                    <td className="py-3.5 px-4">
                      {inv.poNumber ? (
                        <div className="flex items-center space-x-1 text-slate-700 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{inv.poNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Non-PO</span>
                      )}
                    </td>

                    {/* Amount in INR */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatINR(inv.amount)}
                    </td>

                    {/* Trust Score Chip */}
                    <td className="py-3.5 px-4 text-center">
                      {renderScoreChip(inv.trustScore)}
                    </td>

                    {/* Forensics / Findings */}
                    <td className="py-3.5 px-4">
                      {inv.auditFindingCount > 0 || inv.forensicRisk > 0.1 ? (
                        <div className="flex items-center space-x-1.5 text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span className="font-semibold text-xs">
                            {inv.auditFindingCount || 1} finding(s)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-xs">Pristine Check</span>
                        </div>
                      )}
                    </td>

                    {/* Routing Decision */}
                    <td className="py-3.5 px-4">
                      {renderStatusPill(inv)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {isCfoQueue && (
                          <>
                            <button
                              onClick={() => onApprove(inv.id)}
                              title="1-Click Approve (Execute R1 to QBO & ACH)"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onReject(inv.id)}
                              title="1-Click Reject"
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onSelectInvoice(inv)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};
