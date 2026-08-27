import React, { useState } from 'react';
import {
  Database,
  Building2,
  FileCheck,
  Key,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
} from 'lucide-react';
import { formatINR } from '../lib/utils.js';

export const MasterDataView: React.FC = () => {
  const [subTab, setSubTab] = useState<'vendors' | 'contracts' | 'pos'>('vendors');
  const [searchTerm, setSearchTerm] = useState('');

  const vendors = [
    {
      id: 'VEND-001',
      name: 'Apex Logistics Corp',
      taxId: '27AABCA1234F1Z5',
      bankHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'Pristine',
      category: 'Logistics & Freight',
      onboarded: '2023-01-15',
    },
    {
      id: 'VEND-002',
      name: 'Vertex Electronics Ltd',
      taxId: '29AABCV5678G2Z1',
      bankHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      status: 'Under Review',
      category: 'Electronics & Chips',
      onboarded: '2023-05-10',
    },
    {
      id: 'VEND-003',
      name: 'Nova Packaging Solutions',
      taxId: '27AABCN9012H3Z8',
      bankHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      status: 'Pristine',
      category: 'Packaging & Cartons',
      onboarded: '2022-11-20',
    },
    {
      id: 'VEND-004',
      name: 'Zenith Fasteners Inc',
      taxId: '33AABCZ3456J4Z3',
      bankHash: 'c672b8d1ef56ed28ab87c3622c5114069bdd3ad7b8f9737498d0c01ecef0967a',
      status: 'Pristine',
      category: 'Raw Materials & Metals',
      onboarded: '2023-08-01',
    },
    {
      id: 'VEND-005',
      name: 'Falcon Industrial Supplies',
      taxId: '27AABCF7890K5Z6',
      bankHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      status: 'Probationary',
      category: 'MRO & Facilities',
      onboarded: '2024-02-14',
    },
  ];

  const contracts = [
    {
      id: 'CNT-2026-001',
      vendor: 'Apex Logistics Corp',
      itemKey: 'LOG_FREIGHT_TON_KM',
      rate: 14.5,
      unit: '₹ / ton-km',
      rateLock: 'Strict (Clause 4.2)',
      maxAnnual: 5000000,
    },
    {
      id: 'CNT-2026-002',
      vendor: 'Vertex Electronics Ltd',
      itemKey: 'ELEC_MICRO_MCU_32',
      rate: 420.0,
      unit: '₹ / unit',
      rateLock: 'Strict (Clause 3.1)',
      maxAnnual: 4000000,
    },
    {
      id: 'CNT-2026-003',
      vendor: 'Nova Packaging Solutions',
      itemKey: 'PKG_BOX_CORRUGATED_5PLY',
      rate: 35.0,
      unit: '₹ / box',
      rateLock: 'Strict (Clause 5.4)',
      maxAnnual: 3000000,
    },
  ];

  const pos = [
    {
      id: 'PO-2026-8801',
      vendor: 'Apex Logistics Corp',
      lineItems: 3,
      amount: 42500,
      status: 'MATCHED_3WAY',
      deliveryConfirmed: true,
    },
    {
      id: 'PO-2026-8802',
      vendor: 'Vertex Electronics Ltd',
      lineItems: 5,
      amount: 148000,
      status: 'PRICE_VARIANCE_FLAG',
      deliveryConfirmed: true,
    },
    {
      id: 'PO-2026-8803',
      vendor: 'Nova Packaging Solutions',
      lineItems: 2,
      amount: 28000,
      status: 'MATCHED_3WAY',
      deliveryConfirmed: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Master Data, Contracts &amp; 3-Way Match Records
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cryptographic vendor entity resolution, bank account SHA-256 hashes, and PO line item rate-locks.
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSubTab('vendors')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'vendors' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setSubTab('contracts')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'contracts' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contracts ({contracts.length})
          </button>
          <button
            onClick={() => setSubTab('pos')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'pos' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Purchase Orders ({pos.length})
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
        {subTab === 'vendors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">Vendor ID &amp; Name</th>
                  <th className="py-3.5 px-4">Tax ID (GSTIN/PAN)</th>
                  <th className="py-3.5 px-4">Bank Account SHA-256 Hash</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Trust Status</th>
                  <th className="py-3.5 px-6 text-right">Onboarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{v.name}</div>
                      <span className="text-[11px] text-slate-400 font-mono">{v.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{v.taxId}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 max-w-[180px] truncate" title={v.bankHash}>
                      {v.bankHash}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{v.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-slate-500 font-mono">{v.onboarded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subTab === 'contracts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">Contract ID</th>
                  <th className="py-3.5 px-4">Vendor</th>
                  <th className="py-3.5 px-4">Canonical Item Key</th>
                  <th className="py-3.5 px-4">Agreed Unit Rate</th>
                  <th className="py-3.5 px-4">Rate-Lock Enforcement</th>
                  <th className="py-3.5 px-6 text-right">Annual Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{c.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{c.vendor}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{c.itemKey}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">₹{c.rate} / {c.unit}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 text-slate-700">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{c.rateLock}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900">{formatINR(c.maxAnnual)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subTab === 'pos' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">PO Number</th>
                  <th className="py-3.5 px-4">Vendor</th>
                  <th className="py-3.5 px-4">Line Items</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">3-Way Match Status</th>
                  <th className="py-3.5 px-6 text-right">GRN Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{p.vendor}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.lineItems} items</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{formatINR(p.amount)}</td>
                    <td className="py-3.5 px-4">
                      {p.status === 'MATCHED_3WAY' ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Matched (PO + GRN)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-700 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Price Variance Detected</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right text-emerald-600 font-semibold">
                      Confirmed Received
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
