import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  FileCheck,
  CreditCard,
  CheckCircle2,
  Upload,
  Sparkles,
} from 'lucide-react';

interface KybModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

export const KybModal: React.FC<KybModalProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [crNumber, setCrNumber] = useState('1010894210');
  const [taxId, setTaxId] = useState('31049281900003');
  const [companyLegalName, setCompanyLegalName] = useState('Atlas Build Contracting LLC');
  const [bankIban, setBankIban] = useState('SA44 2000 0001 2345 6789 0123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onVerificationComplete();
        onClose();
        setIsSuccess(false);
        setStep(1);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-indigo-50/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                KYB Business Verification
              </h3>
              <p className="text-xs text-slate-500">
                Saudi Commercial Registration & Authority Accreditation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Strip */}
        <div className="px-6 sm:px-8 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>1</span>
            <span>Commercial Info</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>2</span>
            <span>Tax & Bank</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-blue-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>3</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Verification Approved!</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Atlas Build Group is now certified for government and commercial RFP submissions.
              </p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Legal Entity Name
                </label>
                <input
                  type="text"
                  value={companyLegalName}
                  onChange={(e) => setCompanyLegalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Commercial Registration (CR) Number
                </label>
                <input
                  type="text"
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Verified via Saudi Ministry of Commerce Wathq API
                </p>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start space-x-2.5">
                <Building2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  Atlas Build Group is registered under General Construction, Interior Engineering & Finishing licenses.
                </p>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ZATCA VAT / Tax Identification Number
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Corporate Bank Account IBAN
                </label>
                <input
                  type="text"
                  value={bankIban}
                  onChange={(e) => setBankIban(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Al Rajhi Bank • Match verified with company legal title
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer bg-slate-50/50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">Upload Authorized Signatory Certificate (PDF)</p>
                <p className="text-[11px] text-slate-400">Drag & drop or browse</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Company Name:</span>
                  <span className="font-bold text-slate-900">{companyLegalName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">CR Number:</span>
                  <span className="font-mono font-bold text-slate-900">{crNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">VAT Identification:</span>
                  <span className="font-mono font-bold text-slate-900">{taxId}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">IBAN:</span>
                  <span className="font-mono font-bold text-slate-900">{bankIban}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start space-x-2 text-xs text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>All documents pre-verified against Saudi Government registries.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors shadow-xs"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors shadow-xs flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete Verification</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
