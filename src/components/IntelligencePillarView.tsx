import React, { useState } from 'react';
import {
  BrainCircuit,
  ShieldAlert,
  Users,
  PiggyBank,
  Sparkles,
  Send,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { formatINR } from '../lib/utils.js';
import {
  InvoiceRecord,
  OrganizationWorkspace,
  UserProfile,
  AiChatMessage,
} from '../types.js';

interface IntelligencePillarViewProps {
  invoices: InvoiceRecord[];
  workspace: OrganizationWorkspace;
  currentUser: UserProfile;
  initialSubTab?: string;
  onSelectInvoice: (invoice: InvoiceRecord) => void;
  onOpenAuditExport: () => void;
}

export const IntelligencePillarView: React.FC<IntelligencePillarViewProps> = ({
  invoices,
  workspace,
  currentUser,
  initialSubTab = 'risk-center',
  onSelectInvoice,
  onOpenAuditExport,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab === 'ai-copilot' ? 'copilot' : initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab === 'ai-copilot' ? 'copilot' : initialSubTab);
    }
  }, [initialSubTab]);

  // AI Copilot Interactive Chat State
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: `Hello ${currentUser.name}. I am your Zero-Trust AP Intelligence Brain for ${workspace.name}. I have monitored ${invoices.length} transactions across your ERP ledger. How can I assist you with fraud intercepts, counterparty risk, or cash discount capture?`,
      timestamp: 'Just now',
      suggestedActions: [
        'Analyze counterparty risk for Quantum Materials',
        'Show top 3 invoices with altered bank routing hashes',
        'Calculate potential 2/10 Net 30 cash savings this month',
      ],
      attachedMetrics: [
        { label: 'Active Pipeline VaR', value: '0.02%', color: 'emerald' },
        { label: 'Identified Savings', value: '₹36.1L', color: 'blue' },
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleSendPrompt = (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: AiChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = '';
      let metrics: { label: string; value: string; color?: string }[] = [];
      let suggestions: string[] = [];

      const lower = text.toLowerCase();
      if (lower.includes('quantum') || lower.includes('counterparty') || lower.includes('risk')) {
        reply = `**Counterparty Risk Audit for Quantum Materials:**\n• Trust Rating: **72.4 (Probationary)**\n• Recent Intercept: Font alteration & altered bank routing hash (•••• 9999) detected on Inv #INV-3920.\n• Contract PO: PO-8812 agreed unit price is ₹8,900/wafer.\n• **Recommendation**: Maintain escrow hold until vendor verification via verified out-of-band phone protocol completes.`;
        metrics = [
          { label: 'Counterparty VaR', value: '₹1.84L', color: 'amber' },
          { label: 'Bank Hash Match', value: 'MISMATCH (Drift)', color: 'rose' },
        ];
        suggestions = ['Release Escrow after Phone Verification', 'Inspect Inv #INV-3920 PDF Metadata'];
      } else if (lower.includes('saving') || lower.includes('discount') || lower.includes('2/10') || lower.includes('dpo')) {
        reply = `**AP Savings Alpha Analysis:**\n• Identified Total Savings: **₹36,10,000**\n• Early Pay Capture Rate: **84.2%**\n• Working Capital DPO Delta: **+4.2 Days** achieved via scheduled STP payment bundling.\n• 14% line-item markup leakage prevented on 8 logistics invoices.`;
        metrics = [
          { label: 'Gross Savings', value: '₹36,10,000', color: 'emerald' },
          { label: 'DPO Target', value: `${workspace.dpoDays} Days`, color: 'blue' },
        ];
        suggestions = ['Export CA Audit Ledger', 'Adjust Dynamic Payment Rails'];
      } else {
        reply = `I have cross-checked your query against the ${invoices.length} active invoices in ${workspace.name}. All 3-way matching rules, rate-lock clauses, and PDF forensic producer headers are verified within tolerance. Would you like me to generate a deep-dive forensic breakdown?`;
        suggestions = ['Run 8-Stage Forensics Test', 'View Executive Telemetry'];
      }

      const assistantMsg: AiChatMessage = {
        id: `msg_asst_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
        attachedMetrics: metrics.length > 0 ? metrics : undefined,
        suggestedActions: suggestions,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsAiThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Pillar Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black font-mono text-slate-900 tracking-tight uppercase">
                Intelligence Pillar
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold uppercase">
                Risk &amp; AP Brain
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Risk Center (VaR) • Counterparty Vendor Intel • Savings Alpha • Interactive AI AP Copilot
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuditExport}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer self-start md:self-auto"
        >
          <PiggyBank className="w-4 h-4 text-emerald-400" />
          <span>Export Savings Audit</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-slate-900 text-white rounded-2xl p-1.5 flex items-center space-x-1 overflow-x-auto shadow-md border border-slate-800 scrollbar-none">
        {[
          { id: 'risk-center', label: 'Risk Center & Fraud Vectors', icon: ShieldAlert },
          { id: 'vendor-intel', label: 'Counterparty Vendor Intel', icon: Users, count: 48 },
          { id: 'savings', label: 'Savings Alpha & DPO', icon: PiggyBank },
          { id: 'copilot', label: 'AI Copilot (AP Brain)', icon: Sparkles, pulse: true },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap font-mono uppercase tracking-wider ${
                isActive ? 'bg-purple-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>

              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isActive ? 'bg-purple-800 text-purple-100' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}

              {tab.pulse && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: RISK CENTER */}
      {activeSubTab === 'risk-center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                Portfolio Value-at-Risk (VaR)
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black font-mono text-emerald-600">0.02%</span>
                <span className="text-xs font-bold text-slate-500 font-mono">₹24,800 Exposure</span>
              </div>
              <p className="text-xs text-slate-400">
                Industry benchmark is 1.84%. Vault-Zero keeps counterparty risk near zero.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                BEC Wire Fraud Intercepts
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black font-mono text-purple-600">6 Blocked</span>
                <span className="text-xs font-bold text-purple-600 font-mono">100% Success</span>
              </div>
              <p className="text-xs text-slate-400">
                Bank account hash alterations intercepted before ACH dispatch.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                Duplicate Invoices Caught
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black font-mono text-rose-600">8 Duplicates</span>
                <span className="text-xs font-bold text-rose-600 font-mono">₹8,20,000 Blocked</span>
              </div>
              <p className="text-xs text-slate-400">
                Identical payload &amp; invoice numbering hash collisions quarantined.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black font-mono text-slate-900 uppercase">
              Intercepted Fraud Vectors Ledger
            </h3>
            <div className="space-y-3">
              {[
                {
                  vector: 'BEC Bank Hash Drift',
                  target: 'Quantum Materials',
                  desc: 'Remittance bank routing altered to unverified destination account (•••• 9999).',
                  action: 'Quarantined in Escrow',
                  amount: 184000,
                  badge: 'CRITICAL RISK',
                },
                {
                  vector: 'PDF Font Substitution',
                  target: 'Starlight Logistics',
                  desc: 'Producer metadata mismatch: Helvetica replaced with synthetic vector overlay.',
                  action: 'Flagged for Forensics',
                  amount: 42000,
                  badge: 'FORGERY ALERT',
                },
                {
                  vector: 'Line Item Price Drift',
                  target: 'Global Silicon Fab',
                  desc: 'Unit rate billed at ₹10,200 vs Contract PO-8812 rate of ₹8,900 (14.6% markup).',
                  action: 'Routed to CFO Queue',
                  amount: 89000,
                  badge: 'PRICE LEAKAGE',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black font-mono text-slate-900">{item.vector}</span>
                      <span className="text-xs font-bold text-slate-600">• {item.target}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-rose-100 text-rose-800">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-slate-900 block">{formatINR(item.amount)}</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">{item.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: VENDOR INTEL */}
      {activeSubTab === 'vendor-intel' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black font-mono text-slate-900 uppercase">
              Counterparty Vendor Trust Intelligence Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Verified supplier profiles with cryptographic bank account hashes, contract compliance, and delivery SLA scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'AWS Enterprise Cloud',
                tier: 'PRISTINE TIER',
                trustScore: 99.8,
                bankStatus: 'VERIFIED HASH',
                spend: 3450000,
                poCompliance: '100%',
              },
              {
                name: 'Apex Logistics Corp',
                tier: 'STANDARD TIER',
                trustScore: 98.2,
                bankStatus: 'VERIFIED HASH',
                spend: 1840000,
                poCompliance: '97.4%',
              },
              {
                name: 'Quantum Materials',
                tier: 'PROBATIONARY TIER',
                trustScore: 72.4,
                bankStatus: 'HASH DRIFT SUSPECT',
                spend: 890000,
                poCompliance: '85.4%',
              },
            ].map((v) => (
              <div key={v.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">{v.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.trustScore >= 98
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {v.tier}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>Trust Score:</span>
                    <strong className="text-slate-900">{v.trustScore}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Routing:</span>
                    <span className="text-emerald-600 font-bold">{v.bankStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PO Compliance:</span>
                    <span className="text-blue-600 font-bold">{v.poCompliance}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span>YTD Spend:</span>
                    <strong className="text-slate-900">{formatINR(v.spend)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SAVINGS */}
      {activeSubTab === 'savings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black font-mono text-slate-900 uppercase">
              AP Savings Alpha &amp; Dynamic Discount Capture
            </h3>
            <p className="text-xs text-slate-500">
              Quantified cost savings achieved through fraud prevention, automated 2/10 Net 30 capture, and rate lock enforcement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-800">Total Savings Identified</span>
              <span className="text-2xl font-black font-mono text-emerald-900 block">{formatINR(3610000)}</span>
              <span className="text-[11px] text-emerald-700">YTD cumulative bottom-line savings</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-800">2/10 Net 30 Capture Rate</span>
              <span className="text-2xl font-black font-mono text-blue-900 block">84.2%</span>
              <span className="text-[11px] text-blue-700">Automated instant payment capture</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
              <span className="text-xs font-mono font-bold text-indigo-800">DPO Extension Alpha</span>
              <span className="text-2xl font-black font-mono text-indigo-900 block">+{workspace.dpoDays} Days</span>
              <span className="text-[11px] text-indigo-700">Treasury working capital optimization</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: AI COPILOT */}
      {activeSubTab === 'copilot' && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-black font-mono uppercase text-white">
                Zero-Trust AP Copilot (Conversational AP Brain)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Live Neural AP Enclave
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-2 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-200 border border-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans leading-relaxed">{msg.text}</p>

                  {/* Attached Metrics Chips */}
                  {msg.attachedMetrics && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-800">
                      {msg.attachedMetrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] font-mono flex items-center space-x-1.5"
                        >
                          <span className="text-slate-400">{m.label}:</span>
                          <strong className="text-white">{m.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(s)}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-800 text-[11px] font-mono cursor-pointer transition-colors"
                      >
                        ⚡ {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center space-x-2 text-xs text-purple-400 font-mono py-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Zero-Trust AP Brain analyzing contracts &amp; ledger rules...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-2 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendPrompt();
              }}
              placeholder="Ask Copilot about any invoice, PO clause, vendor bank hash, or cash forecast..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSendPrompt()}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition-all shadow-md shadow-purple-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Query</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
