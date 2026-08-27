import React, { useState } from 'react';
import {
  X,
  PieChart,
  Search,
  CheckCircle2,
  Clock,
  Building,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import { RfpItem } from '../atlasData.js';

interface RfpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rfps: RfpItem[];
  selectedCategoryFilter: string | null;
  onSelectCategoryFilter: (cat: string | null) => void;
  onSubmitProposal: (rfpId: string) => void;
}

export const RfpDrawer: React.FC<RfpDrawerProps> = ({
  isOpen,
  onClose,
  rfps,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  onSubmitProposal,
}) => {
  const [search, setSearch] = useState('');
  const [activeRfp, setActiveRfp] = useState<RfpItem | null>(null);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Eligible RFPs', 'Proposal Submitted', 'Shortlisted', 'Awarding'];

  const filtered = rfps.filter((r) => {
    if (selectedCategoryFilter && selectedCategoryFilter !== 'All') {
      if (r.category !== selectedCategoryFilter) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchClient = r.client.toLowerCase().includes(q);
      const matchLoc = r.location.toLowerCase().includes(q);
      if (!matchTitle && !matchClient && !matchLoc) return false;
    }
    return true;
  });

  const handleApply = (rfp: RfpItem) => {
    setIsSubmittingProposal(true);
    setTimeout(() => {
      setIsSubmittingProposal(false);
      setSubmissionSuccess(`Proposal for "${rfp.title}" submitted successfully!`);
      onSubmitProposal(rfp.id);
      setTimeout(() => setSubmissionSuccess(null), 3500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">RFP Pipeline Management</h2>
              <p className="text-xs text-slate-500">
                15 Tracked Opportunities & Active Proposals
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

        {/* Filter Pills & Search */}
        <div className="p-4 sm:p-6 border-b border-slate-100 space-y-3 bg-white">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search RFPs, clients, or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => {
              const isSelected =
                (cat === 'All' && !selectedCategoryFilter) ||
                selectedCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategoryFilter(cat === 'All' ? null : cat)}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toast Alert */}
        {submissionSuccess && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{submissionSuccess}</span>
          </div>
        )}

        {/* RFP List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No matching RFPs found.
            </div>
          ) : (
            filtered.map((rfp) => {
              const isEligible = rfp.category === 'Eligible RFPs';
              return (
                <div key={rfp.id} className="py-4 first:pt-0 last:pb-0 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            rfp.category === 'Eligible RFPs'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : rfp.category === 'Proposal Submitted'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : rfp.category === 'Shortlisted'
                              ? 'bg-slate-900 text-white'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {rfp.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Match: {rfp.matchScore}%
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {rfp.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rfp.scopeSummary}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {rfp.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {rfp.location}
                        </span>
                        <span className="font-bold text-slate-900 font-mono">
                          SAR {rfp.budgetSar.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {rfp.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {isEligible ? (
                        <button
                          onClick={() => handleApply(rfp)}
                          disabled={isSubmittingProposal}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Proposal</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
