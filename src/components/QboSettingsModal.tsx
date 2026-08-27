import React, { useState } from 'react';
import {
  X,
  Sliders,
  CheckCircle2,
  Lock,
  Layers,
  Database,
  Building2,
  Zap,
} from 'lucide-react';

interface QboSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QboSettingsModal: React.FC<QboSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [minScore, setMinScore] = useState<number>(98);
  const [maxAmount, setMaxAmount] = useState<number>(50000);
  const [newVendorProbationDays, setNewVendorProbationDays] = useState<number>(30);
  const [erpTarget, setErpTarget] = useState<'QBO' | 'ZOHO' | 'SAP' | 'MOCK'>('QBO');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Routing Thresholds &amp; ERP Connectors
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Configure R1 Autobahn autonomous gates and accounting sync targets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Threshold 1: Min Score */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <label>Minimum Trust Score for R1 Auto-Pay (0–100)</label>
              <span className="font-mono text-blue-600 font-extrabold text-sm">{minScore} pts</span>
            </div>
            <input
              type="range"
              min={70}
              max={100}
              step={1}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-400">
              Invoices below this trust threshold automatically divert to the R2 CFO Review Queue.
            </p>
          </div>

          {/* Threshold 2: Max Amount INR */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <label>Autonomous Execution Dollar Cap (INR ₹)</label>
              <span className="font-mono text-blue-600 font-extrabold text-sm">₹{maxAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={250000}
              step={5000}
              value={maxAmount}
              onChange={(e) => setMaxAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-400">
              Even with 100/100 score, invoices exceeding this amount require dual CFO sign-off.
            </p>
          </div>

          {/* Threshold 3: Vendor Probation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <label>New Vendor Probation Lockout</label>
              <span className="font-mono text-blue-600 font-extrabold text-sm">{newVendorProbationDays} Days</span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={15}
              value={newVendorProbationDays}
              onChange={(e) => setNewVendorProbationDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-400">
              Vendors onboarded less than {newVendorProbationDays} days ago cannot auto-pay.
            </p>
          </div>

          {/* ERP Adapter Connector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Connected ERP Sync Adapter
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'QBO', name: 'QuickBooks Online', status: 'Live Sandbox' },
                { id: 'ZOHO', name: 'Zoho Books', status: 'API Ready' },
                { id: 'SAP', name: 'SAP S/4HANA', status: 'OData Connected' },
                { id: 'MOCK', name: 'Mock Ledger File', status: 'Local Dev' },
              ].map((erp) => (
                <div
                  key={erp.id}
                  onClick={() => setErpTarget(erp.id as any)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    erpTarget === erp.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{erp.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{erp.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-mono">
            {saved ? '✓ Changes saved to engine!' : 'Zero-Trust Protocol Active'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply Thresholds</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
