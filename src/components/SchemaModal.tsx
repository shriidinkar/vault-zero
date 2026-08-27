import React from 'react';
import { Code2, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface SchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchemaModal: React.FC<SchemaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const asciiWorkflow = `
┌────────────────────────────────────────────────────────────────────────┐
│                          AP WORKFLOW ARCHITECTURE                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                              DASHBOARD                                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼───────────────────────────┐
       ↓                            ↓                           ↓
 ┌───────────────┐          ┌───────────────┐           ┌───────────────┐
 │  PROCUREMENT  │          │ INTELLIGENCE  │           │    FINANCE    │
 └───────┬───────┘          └───────┬───────┘           └───────┬───────┘
         │                          │                           │
         ├─ 1. Purchase Request     ├─ Risk Center (VaR)        ├─ 7. Payments (Instant ACH)
         ├─ 2. Purchase Order       ├─ Vendor Intel             ├─ 8. Reconciliation (3-Way)
         ├─ 3. Inbound Invoice      ├─ Savings Records          └─ 9. Financial Record (GL)
         ├─ 4. AI AUDIT (Forensics) └─ AI Copilot
         ├─ 5. TRUST SCORE (0-100)
         ├─ 6. DECISION ENGINE
         │     ├── AUTO PAY (R1)
         │     ├── ESCROW / HOLD (R3)
         │     └── APPROVAL REQUIRED (R2)
         │
         ↓
 ┌───────────────────────────────────────────────────────────────────────┐
 │                 10. FEEDBACK → AI (Calibration Loop)                  │
 └───────────────────────────────────────────────────────────────────────┘
`;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full text-white shadow-2xl space-y-4 font-mono animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                AP Workflow Architecture Schema
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Formal 10-node autonomous pipeline model &amp; decision hierarchy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto text-[11px] text-emerald-400 leading-tight">
          <pre>{asciiWorkflow}</pre>
        </div>

        <div className="flex justify-between items-center pt-1 text-xs text-slate-400 font-sans">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero-Trust 3-Way &amp; Forensic Verification Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono cursor-pointer"
          >
            Close Schema
          </button>
        </div>
      </div>
    </div>
  );
};
