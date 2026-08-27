import React, { useState } from 'react';
import {
  PieChart,
  TrendingUp,
  Building2,
  MapPin,
  FileSpreadsheet,
  Download,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { InvoiceRecord } from '../types.js';
import { formatINR } from '../lib/utils.js';

interface SpendIntelligenceViewProps {
  invoices: InvoiceRecord[];
  onOpenAuditExport: () => void;
}

export const SpendIntelligenceView: React.FC<SpendIntelligenceViewProps> = ({
  invoices,
  onOpenAuditExport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Category breakdown
  const categoryData = [
    { name: 'Raw Materials & Metals', spend: 4250000, invoices: 42, pct: 28.6, savings: 850000 },
    { name: 'Electronics & Chips', spend: 3120000, invoices: 34, pct: 21.0, savings: 640000 },
    { name: 'Packaging & Cartons', spend: 2480000, invoices: 38, pct: 16.7, savings: 520000 },
    { name: 'Logistics & Freight', spend: 2150000, invoices: 30, pct: 14.5, savings: 480000 },
    { name: 'MRO & Facilities', spend: 1200000, invoices: 22, pct: 8.1, savings: 310000 },
    { name: 'IT Hardware & SaaS', spend: 950000, invoices: 18, pct: 6.4, savings: 450000 },
    { name: 'Professional Services', spend: 450000, invoices: 10, pct: 3.0, savings: 240000 },
    { name: 'Utilities & Power', spend: 250000, invoices: 6, pct: 1.7, savings: 120000 },
  ];

  const topVendors = [
    { name: 'Apex Logistics Corp', spend: 3450000, count: 28, status: 'Verified', trust: 94 },
    { name: 'Vertex Electronics Ltd', spend: 2890000, count: 24, status: 'Under Review', trust: 82 },
    { name: 'Nova Packaging Solutions', spend: 2120000, count: 22, status: 'Verified', trust: 99 },
    { name: 'Zenith Fasteners Inc', spend: 1840000, count: 18, status: 'Verified', trust: 98 },
    { name: 'Falcon Industrial Supplies', spend: 1420000, count: 15, status: 'Probationary', trust: 76 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Spend Intelligence &amp; Category Ontology
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              UNSPSC auto-categorized line items, rate-leakage analytics, and supplier spend distribution.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuditExport}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CA Audit Ledger (CSV/PDF)</span>
        </button>
      </div>

      {/* 2-Column Grid: Category Breakdown + Top Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Spend by Category */}
        <div className="lg:col-span-7 bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Spend by UNSPSC Category</h3>
            <span className="text-xs text-slate-400 font-mono">₹14.85M Total</span>
          </div>

          <div className="space-y-3.5">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="group p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  <span className="group-hover:text-blue-600 transition-colors">{cat.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 font-mono text-xs">{cat.invoices} inv</span>
                    <span className="font-extrabold text-slate-900 font-mono">{formatINR(cat.spend)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>{cat.pct}% of ledger spend</span>
                  <span className="text-emerald-700 font-semibold font-mono">
                    ₹{(cat.savings / 1000).toFixed(0)}k leakage prevented
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Top Vendors & Supplier Geographies */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Vendors Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Top Suppliers by Spend</h3>
              <span className="text-xs text-blue-600 font-bold">5 Active</span>
            </div>

            <div className="space-y-3">
              {topVendors.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{v.count} invoices</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-700 font-semibold">{v.trust} Trust</span>
                    </div>
                  </div>
                  <div className="text-right font-mono font-extrabold text-slate-900 text-sm">
                    {formatINR(v.spend)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Map Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl md:rounded-3xl border border-blue-100 p-5 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-blue-900 mb-2 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Supplier Hubs &amp; Geography</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              All 15 master suppliers verified across Mumbai, Pune, Bangalore, Hyderabad &amp; Delhi NCR corridors.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-700 bg-white/80 p-2 rounded-xl border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Tax IDs &amp; GSTIN Hash Matched</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
