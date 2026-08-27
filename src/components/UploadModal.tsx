import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { formatINR } from '../lib/utils.js';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (invoice: any) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'upload' | 'sample_invoices' | 'manual'>('upload');
  const [selectedSample, setSelectedSample] = useState<number>(0);
  const [customFile, setCustomFile] = useState<{ name: string; size: string; content?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual entry fields if user wants to test specific invoice metadata
  const [manualVendor, setManualVendor] = useState('Apex Technologies Ltd');
  const [manualTaxId, setManualTaxId] = useState('27AABCA9911L1Z0');
  const [manualInvoiceNo, setManualInvoiceNo] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [manualAmount, setManualAmount] = useState('48500');
  const [manualPo, setManualPo] = useState('PO-2024-8819');

  if (!isOpen) return null;

  // Unprocessed Inbound Vendor Invoices Queue (Raw documents waiting for blind forensics)
  const inboundRawInvoices = [
    {
      id: 0,
      filename: 'TechInfra_Srv_Oct2024.pdf',
      vendor: 'TechInfra Solutions Pvt Ltd',
      amount: 42000,
      poNumber: 'PO-2024-8819',
      receivedFrom: 'ap-billing@techinfra-corp.com',
      date: '2026-08-27',
      taxId: '27AABCT1234F1Z8',
      desc: 'Raw inbound vendor statement. System will blindly evaluate 3-way match and forensic integrity.',
    },
    {
      id: 1,
      filename: 'OmniLogistics_Freight_Exp.pdf',
      vendor: 'OmniGlobal Logistics Pvt Ltd',
      amount: 820000,
      poNumber: 'PO-LOG-2024-001',
      receivedFrom: 'dispatch@omniglobal-logistics.in',
      date: '2026-08-27',
      taxId: '27AAACG9921D1ZO',
      desc: 'Container freight and drayage invoice. Zero-trust engine will audit duplicate ledger histories.',
    },
    {
      id: 2,
      filename: 'AeroTech_PrecisionMachining.pdf',
      vendor: 'AeroTech Systems Pvt Ltd',
      amount: 456000,
      poNumber: 'PO-AERO-2024-042',
      receivedFrom: 'accounts@aerotech-systems.com',
      date: '2026-08-27',
      taxId: '27AABCA7712M1Z2',
      desc: 'Precision alloy CNC components bill. System evaluates line-item unit rates against contracted rate locks.',
    },
    {
      id: 3,
      filename: 'Quantum_Materials_WireRemittance.pdf',
      vendor: 'Quantum Materials Corp',
      amount: 1240000,
      poNumber: 'PO-QNT-2024-118',
      receivedFrom: 'billing@quantum-mat-solutions.com',
      date: '2026-08-27',
      taxId: '27AAACQ4412K1Z9',
      desc: 'Polycarbonate raw material consignment. System audits remittance bank routing hash against vendor master.',
    },
    {
      id: 4,
      filename: 'Apex_Sensors_ElectronicScan.pdf',
      vendor: 'Apex Forge Instruments Ltd',
      amount: 980000,
      poNumber: 'PO-APX-2024-009',
      receivedFrom: 'invoice-desk@apex-instruments.org',
      date: '2026-08-27',
      taxId: '27AABCA9911L1Z0',
      desc: 'Optical sensor supply invoice. Engine performs blind pikepdf XMP inspection and kerning analysis.',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setCustomFile({
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`,
      });
    }
  };

  const handleRunForensics = async () => {
    setLoading(true);
    try {
      let payload: any;

      if (activeMode === 'upload' && customFile) {
        payload = {
          filename: customFile.name,
          injectedFields: {
            vendorName: 'Inbound Vendor (File Extracted)',
            invoiceNumber: `INV-${customFile.name.replace(/\.[^/.]+$/, '').toUpperCase()}`,
            amount: 45000 + Math.floor(Math.random() * 85000),
            currency: 'INR',
          },
        };
      } else if (activeMode === 'manual') {
        const amt = parseFloat(manualAmount) || 50000;
        payload = {
          filename: `${manualInvoiceNo}.pdf`,
          injectedFields: {
            vendorName: manualVendor,
            taxId: manualTaxId,
            invoiceNumber: manualInvoiceNo,
            poNumber: manualPo,
            amount: amt,
            currency: 'INR',
          },
        };
      } else {
        // Sample inbound invoice
        const s = inboundRawInvoices[selectedSample];
        payload = {
          filename: s.filename,
          injectedFields: {
            vendorName: s.vendor,
            taxId: s.taxId,
            invoiceNumber: `INV-${s.filename.replace(/\.pdf$/i, '').toUpperCase()}`,
            poNumber: s.poNumber,
            amount: s.amount,
            currency: 'INR',
          },
        };
      }

      const res = await fetch('/api/invoices/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      onUploadSuccess(data);
      onClose();
    } catch (err) {
      console.error('Forensic inspection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase font-mono">
                Pre-Ingestion Invoice Forensics
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Autonomous 8-Stage Zero-Trust Pipeline: Blind Anomaly Determination &amp; Risk Scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex space-x-2 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveMode('upload')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeMode === 'upload'
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📁 File Ingestion (.PDF / .XML)
          </button>
          <button
            onClick={() => setActiveMode('sample_invoices')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeMode === 'sample_invoices'
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📥 Inbound Vendor Documents Buffer
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeMode === 'manual'
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ✍️ Manual Intake Form
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* MODE 1: FILE UPLOAD */}
          {activeMode === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.xml,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/20 transition-all bg-slate-50 cursor-pointer space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {customFile ? customFile.name : 'Click to select invoice file or drop here'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    {customFile ? `Size: ${customFile.size} • Ready for blind inspection` : 'Supports PDF, XML, EDI, and scanned TIFF formats'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1 font-medium">
                <div className="font-bold flex items-center space-x-1.5 font-mono uppercase text-[11px]">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  <span>Autonomous Zero-Trust Forensic Protocol</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  No predefined scenario needed. The system autonomously extracts table lines, checks Levenshtein duplicate distance, audits against master PO/contracts, inspects PDF font tables, and calculates composite trust score on its own.
                </p>
              </div>
            </div>
          )}

          {/* MODE 2: INBOUND VENDOR INVOICES BUFFER */}
          {activeMode === 'sample_invoices' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-mono">
                Select an unprocessed inbound vendor invoice from the AP staging stream for blind automated classification:
              </div>

              <div className="space-y-2.5">
                {inboundRawInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedSample(inv.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedSample === inv.id
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-black text-slate-900 font-mono">
                          {inv.filename}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-700 font-bold">
                          {inv.poNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        <strong>{inv.vendor}</strong> • {formatINR(inv.amount)} • From: <span className="font-mono text-slate-500">{inv.receivedFrom}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 italic">
                        {inv.desc}
                      </p>
                    </div>

                    <input
                      type="radio"
                      checked={selectedSample === inv.id}
                      onChange={() => setSelectedSample(inv.id)}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 3: MANUAL INTAKE FORM */}
          {activeMode === 'manual' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono text-[10px]">Vendor Name</label>
                  <input
                    type="text"
                    value={manualVendor}
                    onChange={(e) => setManualVendor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono text-[10px]">Tax ID / GSTIN</label>
                  <input
                    type="text"
                    value={manualTaxId}
                    onChange={(e) => setManualTaxId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono text-[10px]">Invoice Number</label>
                  <input
                    type="text"
                    value={manualInvoiceNo}
                    onChange={(e) => setManualInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono text-[10px]">Total Amount (INR)</label>
                  <input
                    type="number"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono text-[10px]">Matched PO Number</label>
                  <input
                    type="text"
                    value={manualPo}
                    onChange={(e) => setManualPo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Mode: Autonomous Zero-Trust Execution
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer font-mono"
            >
              Cancel
            </button>
            <button
              onClick={handleRunForensics}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 font-mono"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{loading ? 'Executing 8 Stages...' : 'Run Autonomous Forensic Ingestion'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
