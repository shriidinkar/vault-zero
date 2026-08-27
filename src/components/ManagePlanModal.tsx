import React, { useState } from 'react';
import { X, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface ManagePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  usedCount: number;
  totalLimit: number;
  onUpgradePlan?: (newLimit: number) => void;
}

export const ManagePlanModal: React.FC<ManagePlanModalProps> = ({
  isOpen,
  onClose,
  usedCount,
  totalLimit,
  onUpgradePlan,
}) => {
  const [selectedTier, setSelectedTier] = useState<'pro' | 'enterprise'>('pro');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = (tier: 'pro' | 'enterprise') => {
    setIsSuccess(true);
    setTimeout(() => {
      if (onUpgradePlan) onUpgradePlan(tier === 'enterprise' ? 30 : 15);
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Proposal Plan & Quotas</h2>
              <p className="text-xs text-slate-500">
                Monthly RFP proposal allocation for Atlas Build Group
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

        {/* Current Usage Status */}
        <div className="px-6 sm:px-8 py-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-900">Current Cycle Usage</span>
            <p className="text-xs text-blue-700">Resets in 12 days (May 1, 2026)</p>
          </div>
          <span className="text-base font-extrabold text-blue-900 font-mono">
            {usedCount} / {totalLimit} Slots Used
          </span>
        </div>

        {/* Plan Cards */}
        <div className="p-6 sm:p-8 space-y-4">
          {/* Pro Plan Card */}
          <div
            onClick={() => setSelectedTier('pro')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedTier === 'pro'
                ? 'border-blue-600 bg-blue-50/30 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase mb-1">
                  Active Tier
                </span>
                <h3 className="text-base font-bold text-slate-900">Pro Contractor Plan</h3>
                <p className="text-xs text-slate-500">15 RFP Proposal Submissions / month</p>
              </div>
              <span className="text-lg font-extrabold text-slate-900 font-mono">
                SAR 1,200 <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" /> Direct bid submission to verified developers
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" /> Milestone escrow & payment notifications
              </li>
            </ul>
          </div>

          {/* Enterprise Unlimited Card */}
          <div
            onClick={() => setSelectedTier('enterprise')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedTier === 'enterprise'
                ? 'border-blue-600 bg-blue-50/30 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 uppercase mb-1">
                  <Sparkles className="w-3 h-3" /> Recommended for Scale
                </span>
                <h3 className="text-base font-bold text-slate-900">Unlimited Enterprise</h3>
                <p className="text-xs text-slate-500">30+ Priority Proposals & Direct WhatsApp Alerts</p>
              </div>
              <span className="text-lg font-extrabold text-slate-900 font-mono">
                SAR 2,400 <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" /> Unlimited government megaproject bids
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" /> Dedicated bid strategist & priority review
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={() => handleUpgrade(selectedTier)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            {isSuccess ? 'Updated!' : 'Confirm Selection'}
          </button>
        </div>
      </div>
    </div>
  );
};
