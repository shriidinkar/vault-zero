import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface KybVerificationBannerProps {
  onCompleteVerification: () => void;
  isVerified?: boolean;
}

export const KybVerificationBanner: React.FC<KybVerificationBannerProps> = ({
  onCompleteVerification,
  isVerified = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-blue-200/60 bg-gradient-to-br from-[#b0d2ff] via-[#8bbcfd] to-[#60a5fa] group transition-all">
      {/* Abstract decorative background rings */}
      <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full border-[10px] border-white/20 pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border-[12px] border-white/15 pointer-events-none" />
      <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full border-[14px] border-white/10 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-blue-900" />
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            KYB verification required
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed max-w-xs sm:max-w-sm mt-1">
          Complete KYB verification to submit proposals and access RFPs.
        </p>
      </div>

      {/* Button CTA */}
      <div className="relative z-10 mt-6 sm:mt-8">
        <button
          onClick={onCompleteVerification}
          className="w-full bg-white hover:bg-slate-50 text-blue-600 font-bold text-xs sm:text-sm py-3 px-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
        >
          <span>{isVerified ? 'Verification Approved (View)' : 'Complete verification'}</span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
};
