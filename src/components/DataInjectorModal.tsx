import React, { useState } from 'react';
import {
  Database,
  Sliders,
  PlusCircle,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  X,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  DollarSign,
  Cpu,
  Coins,
} from 'lucide-react';
import {
  DATASET_SCENARIOS,
  DatasetScenarioId,
  createCustomInvoice,
} from '../lib/scenarioData.js';
import { InvoiceRecord } from '../types.js';

interface DataInjectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenarioId: DatasetScenarioId;
  onSelectScenario: (scenarioId: DatasetScenarioId) => void;
  onInjectCustomInvoice: (invoice: InvoiceRecord) => void;
  onResetToDefault: () => void;
  customInvoicesCount: number;
}

export const DataInjectorModal: React.FC<DataInjectorModalProps> = ({
  isOpen,
  onClose,
  activeScenarioId,
  onSelectScenario,
  onInjectCustomInvoice,
  onResetToDefault,
  customInvoicesCount,
}) => {
  const [activeTab, setActiveTab] = useState<'SCENARIOS' | 'INJECT_CUSTOM' | 'THRESHOLDS'>('SCENARIOS');

  // Custom Invoice Form State
  const [vendorName, setVendorName] = useState('Nvidia AI Solutions India');
  const [amount, setAmount] = useState('48500');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-NV-2026-902');
  const [poNumber, setPoNumber] = useState('PO-2026-8802');
  const [hasTampering, setHasTampering] = useState(false);
  const [hasBecDrift, setHasBecDrift] = useState(false);
  const [hasRateDiscrepancy, setHasRateDiscrepancy] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [injectedSuccess, setInjectedSuccess] = useState(false);

  // Thresholds state
  const [autobahnThreshold, setAutobahnThreshold] = useState(98);
  const [maxAutoPayLimit, setMaxAutoPayLimit] = useState(50000);

  if (!isOpen) return null;

  const handleInject = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 25000;
    const newInv = createCustomInvoice({
      vendorName,
      amount: numAmount,
      invoiceNumber: invoiceNumber || undefined,
      poNumber: poNumber || undefined,
      hasTampering,
      hasBecDrift,
      hasRateDiscrepancy,
      isDuplicate,
    });

    onInjectCustomInvoice(newInv);
    setInjectedSuccess(true);
    setTimeout(() => {
      setInjectedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-3xl w-full text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-mono max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                Dataset &amp; Live Data Injector Engine
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Interactive
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Input custom data, switch enterprise business scenarios, and tune autonomous thresholds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('SCENARIOS')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'SCENARIOS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Preset Business Scenarios ({DATASET_SCENARIOS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('INJECT_CUSTOM')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'INJECT_CUSTOM'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Inject Custom Invoices {customInvoicesCount > 0 && `(${customInvoicesCount})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('THRESHOLDS')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'THRESHOLDS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Autobahn Thresholds</span>
          </button>
        </div>

        {/* TAB 1: PRESET SCENARIOS */}
        {activeTab === 'SCENARIOS' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 font-sans">
              Select an enterprise data scenario. The entire AP workflow pipeline (PR, PO, Invoices, AI Audit, Trust Scores, Decision Engine, Payments, Reconciliation, Ledger) immediately executes and adapts to that data:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DATASET_SCENARIOS.map((scenario) => {
                const isSelected = activeScenarioId === scenario.id;
                return (
                  <div
                    key={scenario.id}
                    onClick={() => {
                      onSelectScenario(scenario.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-black text-white flex items-center gap-1.5">
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                          {scenario.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                            scenario.badgeColor === 'emerald'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : scenario.badgeColor === 'rose'
                              ? 'bg-rose-950 text-rose-400 border-rose-800'
                              : scenario.badgeColor === 'amber'
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-blue-950 text-blue-400 border-blue-800'
                          }`}
                        >
                          {scenario.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        {scenario.tagline}
                      </p>
                    </div>

                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 text-[10px]">
                      {scenario.keyStats.map((st, i) => (
                        <div key={i} className="flex items-center justify-between text-slate-400">
                          <span>{st.label}:</span>
                          <span className="font-bold text-slate-200">{st.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`w-full py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Currently Active' : 'Load Dataset & Run'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INJECT CUSTOM INVOICES */}
        {activeTab === 'INJECT_CUSTOM' && (
          <form onSubmit={handleInject} className="space-y-4">
            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-2xl text-xs text-blue-200 font-sans">
              <span className="font-bold text-blue-300 font-mono">Custom Input:</span> Provide raw invoice details and optionally inject adversarial forensic signals to see how the AI Audit, Trust Scoring, and Decision Engine dynamically react.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Vendor / Counterparty Name</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-hidden"
                  placeholder="e.g. Acme Tech Solutions"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Total Amount (₹ INR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-hidden"
                  placeholder="e.g. 48500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Invoice Document #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-hidden"
                  placeholder="INV-9921"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Purchase Order (PO) Match #</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-hidden"
                  placeholder="PO-2026-8802"
                />
              </div>
            </div>

            {/* Injected Anomaly Switches */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                Simulate Risk &amp; Forensic Anomalies (Optional):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-colors ${hasTampering ? 'bg-rose-950/40 border-rose-600 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <input
                    type="checkbox"
                    checked={hasTampering}
                    onChange={(e) => setHasTampering(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span>Font Substitution / Tampered PDF</span>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-colors ${hasBecDrift ? 'bg-rose-950/40 border-rose-600 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <input
                    type="checkbox"
                    checked={hasBecDrift}
                    onChange={(e) => setHasBecDrift(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span>BEC Remittance Bank Hash Drift</span>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-colors ${hasRateDiscrepancy ? 'bg-amber-950/40 border-amber-600 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <input
                    type="checkbox"
                    checked={hasRateDiscrepancy}
                    onChange={(e) => setHasRateDiscrepancy(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span>Contract Rate Inflation (+18%)</span>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-colors ${isDuplicate ? 'bg-rose-950/40 border-rose-600 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <input
                    type="checkbox"
                    checked={isDuplicate}
                    onChange={(e) => setIsDuplicate(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span>Duplicate Line-Item Hash Collision</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Injected item will be inserted into active stream and auto-evaluated.
              </span>
              <button
                type="submit"
                disabled={injectedSuccess}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shadow-md flex items-center space-x-2 cursor-pointer"
              >
                {injectedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Injected &amp; Pipeline Re-calculated!</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Inject &amp; Run Pipeline</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: AUTOBAHN THRESHOLDS */}
        {activeTab === 'THRESHOLDS' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 font-sans">
              Adjust hyperparameters governing zero-touch R1 Autobahn execution versus R2 CFO Review and R3 Escrow Hold:
            </p>

            <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Minimum Autobahn Trust Score Threshold</span>
                  <span className="font-black text-emerald-400 font-mono text-sm">{autobahnThreshold}.0 / 100</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="99"
                  value={autobahnThreshold}
                  onChange={(e) => setAutobahnThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>85 (Permissive)</span>
                  <span>95 (Standard)</span>
                  <span>98 (Zero-Trust Strict)</span>
                  <span>99 (Ultra-Paranoid)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Maximum Auto-Disbursement Value (₹ INR)</span>
                  <span className="font-black text-emerald-400 font-mono text-sm">₹{maxAutoPayLimit.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={maxAutoPayLimit}
                  onChange={(e) => setMaxAutoPayLimit(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>₹10,000</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={onResetToDefault}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Custom Injections</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black cursor-pointer shadow-md"
              >
                Apply Parameters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
