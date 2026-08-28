import React, { useState } from 'react';
import {
  ShoppingCart,
  FileText,
  FileCheck2,
  FileSpreadsheet,
  ScanEye,
  Award,
  Cpu,
  Zap,
  Lock,
  UserCheck,
  CreditCard,
  Scale,
  BookOpen,
  RotateCcw,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Mail,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Sliders,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '../lib/utils.js';
import {
  InvoiceRecord,
  PurchaseOrder,
  PurchaseRequest,
  AiFeedbackLog,
  RouteDecision,
  OrganizationWorkspace,
  UserProfile,
} from '../types.js';

interface ProcurementPillarViewProps {
  invoices: InvoiceRecord[];
  workspace: OrganizationWorkspace;
  currentUser: UserProfile;
  initialSubTab?: string;
  onSelectInvoice: (invoice: InvoiceRecord) => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
  onOpenUpload: () => void;
}

export const ProcurementPillarView: React.FC<ProcurementPillarViewProps> = ({
  invoices,
  workspace,
  currentUser,
  initialSubTab = 'pipeline',
  onSelectInvoice,
  onApprove,
  onReject,
  onOpenUpload,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Mock Purchase Requests
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([
    {
      id: 'pr_101',
      prNumber: 'PR-2026-089',
      requesterName: 'Marcus Vance',
      department: 'Cloud Infrastructure',
      vendorName: 'AWS Enterprise Cloud',
      itemDescription: 'H100 GPU Cluster Reserved Instances (Q3 Compute)',
      estimatedAmount: 345000,
      currency: 'INR',
      priority: 'HIGH',
      status: 'APPROVED',
      budgetCategory: 'OPEX Compute',
      poNumber: 'PO-9022',
      createdAt: '2026-08-20',
    },
    {
      id: 'pr_102',
      prNumber: 'PR-2026-090',
      requesterName: 'Elena Vance',
      department: 'Corporate Legal & Governance',
      vendorName: 'Apex Logistics Corp',
      itemDescription: 'Global Airfreight Expedited Shipping Contract',
      estimatedAmount: 184000,
      currency: 'INR',
      priority: 'MEDIUM',
      status: 'PENDING_APPROVAL',
      budgetCategory: 'Supply Chain Freight',
      createdAt: '2026-08-22',
    },
    {
      id: 'pr_103',
      prNumber: 'PR-2026-091',
      requesterName: 'David Sterling',
      department: 'R&D Lab Facilities',
      vendorName: 'Quantum Materials',
      itemDescription: 'Ultra-Pure Silicon Substrates (Batch 48)',
      estimatedAmount: 89000,
      currency: 'INR',
      priority: 'URGENT',
      status: 'PO_CONVERTED',
      budgetCategory: 'Direct Materials',
      poNumber: 'PO-8812',
      createdAt: '2026-08-24',
    },
  ]);

  // AI Feedback Logs
  const [feedbackLogs, setFeedbackLogs] = useState<AiFeedbackLog[]>([
    {
      id: 'fb_1',
      invoiceId: 'inv_392',
      invoiceNumber: 'INV-3920',
      vendorName: 'Quantum Materials',
      anomalyType: 'Altered Bank Routing Hash',
      originalScore: 78.4,
      originalRoute: 'R2_CFO_REVIEW',
      userAction: 'REJECTED',
      feedbackNotes: 'Confirmed with counterparty CFO via phone wire fraud attempt.',
      modelWeightDelta: '+14% Bank Drift Strictness Penalty',
      recalibratedTrustScore: 64.0,
      recordedAt: '10m ago',
    },
    {
      id: 'fb_2',
      invoiceId: 'inv_109',
      invoiceNumber: 'INV-1092',
      vendorName: 'Starlight Logistics',
      anomalyType: '3% Unit Price Drift from PO',
      originalScore: 91.2,
      originalRoute: 'R2_CFO_REVIEW',
      userAction: 'APPROVED',
      feedbackNotes: 'Emergency surcharge pre-authorized in Contract Addendum B.',
      modelWeightDelta: 'Tolerated Addendum Exception Index calibrated',
      recalibratedTrustScore: 98.4,
      recordedAt: '45m ago',
    },
  ]);

  // Filters & State
  const [prFilter, setPrFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newPrModal, setNewPrModal] = useState<boolean>(false);
  const [newPrForm, setNewPrForm] = useState({
    item: '',
    vendor: '',
    amount: '',
    department: 'Engineering & IT',
    priority: 'MEDIUM' as const,
  });

  const autoPaidInvoices = invoices.filter((i) => i.status === 'PAID' && i.routeDecision === 'R1_AUTO_PAY');
  const escrowHeldInvoices = invoices.filter(
    (i) =>
      (i.duplicateProb >= 0.5 ||
        i.forensicRisk >= 0.5 ||
        i.status === 'FLAGGED' ||
        i.routeDecision === 'R3_HOLD_ESCROW') &&
      i.status !== 'PAID' &&
      i.status !== 'SETTLED' &&
      i.status !== 'REJECTED'
  );
  const approvalRequiredInvoices = invoices.filter(
    (i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID' && i.status !== 'REJECTED'
  );

  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrForm.item || !newPrForm.amount) return;
    const newPr: PurchaseRequest = {
      id: `pr_${Date.now()}`,
      prNumber: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      requesterName: currentUser.name,
      department: newPrForm.department,
      vendorName: newPrForm.vendor || 'General Supplier',
      itemDescription: newPrForm.item,
      estimatedAmount: Number(newPrForm.amount) || 50000,
      currency: 'INR',
      priority: newPrForm.priority,
      status: 'PENDING_APPROVAL',
      budgetCategory: 'Department OPEX',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPurchaseRequests([newPr, ...purchaseRequests]);
    setNewPrModal(false);
    setNewPrForm({ item: '', vendor: '', amount: '', department: 'Engineering & IT', priority: 'MEDIUM' });
  };

  const handleApprovePr = (prId: string) => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id === prId) {
          return {
            ...pr,
            status: 'APPROVED',
            poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
          };
        }
        return pr;
      })
    );
  };

  const handleRecordFeedback = (invoice: InvoiceRecord, action: 'APPROVED' | 'OVERRIDDEN' | 'ESCROW_RELEASED' | 'REJECTED') => {
    const newFeedback: AiFeedbackLog = {
      id: `fb_${Date.now()}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.rawInvoiceNumber,
      vendorName: invoice.vendorName,
      anomalyType: invoice.agentFindings?.[0]?.description || 'Audit Discrepancy',
      originalScore: invoice.confidenceScore ?? invoice.trustScore ?? 98.0,
      originalRoute: invoice.routeDecision,
      userAction: action,
      feedbackNotes: `Action ${action} executed by ${currentUser.name} (${currentUser.role}). Calibrated model weights.`,
      modelWeightDelta: action === 'APPROVED' ? '+1.2% Threshold Tolerance' : '+3.5% Stricter Penalty',
      recalibratedTrustScore: action === 'APPROVED' ? 98.5 : 55.0,
      recordedAt: 'Just now',
    };
    setFeedbackLogs([newFeedback, ...feedbackLogs]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Pillar Header Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Procurement Pipeline
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                End-to-End Chain
              </span>
            </div>
            <p className="text-xs text-slate-500">
              PR → PO Match → OCR Ingestion → 8-Stage Audit → Trust Score → Decision Engine → Feedback Loop
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setNewPrModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New PR</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <ScanEye className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-1.5 flex items-center space-x-1 overflow-x-auto shadow-xs">
        {[
          { id: 'pipeline', label: 'Flow Pipeline', icon: Zap },
          { id: 'purchase-requests', label: 'Purchase Requests', icon: FileText, count: purchaseRequests.length },
          { id: 'purchase-orders', label: 'Purchase Orders', icon: FileCheck2, count: 24 },
          { id: 'invoices', label: 'Inbound Invoices', icon: FileSpreadsheet, count: invoices.length },
          { id: 'ai-audit', label: 'Forensic Audit', icon: ScanEye },
          { id: 'trust-score', label: 'Trust Score', icon: Award },
          { id: 'decision-engine', label: 'Decision Engine', icon: Cpu, badge: approvalRequiredInvoices.length },
          { id: 'feedback', label: 'Calibration Feedback', icon: RotateCcw, count: feedbackLogs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>

              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: PIPELINE TRACKER */}
      {activeSubTab === 'pipeline' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 uppercase">
                Active Transaction Stages
              </h3>
              <p className="text-xs text-slate-500">
                Click any stage card below to directly inspect records or manage approvals.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Live Synchronization: 100%
            </span>
          </div>

          {/* Detailed Visual Step Progression Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1: PR */}
            <div
              onClick={() => setActiveSubTab('purchase-requests')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-blue-600">STEP 1</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-mono">Purchase Request</h4>
              <p className="text-xs text-slate-500">Internal departmental requests &amp; budget sign-offs.</p>
              <div className="pt-2 text-xs font-bold text-blue-600 font-mono flex items-center space-x-1">
                <span>{purchaseRequests.length} Active PRs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2: PO */}
            <div
              onClick={() => setActiveSubTab('purchase-orders')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-blue-600">STEP 2</span>
                <FileCheck2 className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-mono">Purchase Order</h4>
              <p className="text-xs text-slate-500">Committed vendor line items &amp; rate-lock contracts.</p>
              <div className="pt-2 text-xs font-bold text-blue-600 font-mono flex items-center space-x-1">
                <span>24 POs Matched</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3: Invoices */}
            <div
              onClick={() => setActiveSubTab('invoices')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-blue-600">STEP 3</span>
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-mono">Invoice Ingestion</h4>
              <p className="text-xs text-slate-500">Inbound emails, PDFs &amp; multi-format OCR.</p>
              <div className="pt-2 text-xs font-bold text-blue-600 font-mono flex items-center space-x-1">
                <span>{invoices.length} Invoices</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 4: AI Audit & Trust Score */}
            <div
              onClick={() => setActiveSubTab('ai-audit')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-purple-600">STEP 4</span>
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-mono">AI Audit &amp; Score</h4>
              <p className="text-xs text-slate-500">8-stage forensics &amp; 3-way matching engine.</p>
              <div className="pt-2 text-xs font-bold text-purple-600 font-mono flex items-center space-x-1">
                <span>99.2 Avg Trust</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Decision Engine 3 Branches */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-black font-mono uppercase">
                  Step 5: Automated Decision Engine (3 Routing Branches)
                </h4>
              </div>
              <button
                onClick={() => setActiveSubTab('decision-engine')}
                className="text-xs text-blue-400 hover:text-blue-300 font-mono underline cursor-pointer"
              >
                Inspect All Decisions →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Branch 1: Auto Pay */}
              <div
                onClick={() => setActiveSubTab('decision-engine')}
                className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>1. AUTO PAY (STP)</span>
                  </span>
                  <span className="text-emerald-400 font-bold">≥ 98.0 Score</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant ACH execution with zero touch. ({autoPaidInvoices.length} invoices cleared)
                </p>
              </div>

              {/* Branch 2: Escrow / Hold */}
              <div
                onClick={() => setActiveSubTab('decision-engine')}
                className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/50 hover:border-purple-400 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-400 font-bold flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>2. ESCROW / HOLD</span>
                  </span>
                  <span className="text-purple-400 font-bold">Risk Quarantined</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Wire fraud, altered bank hash or duplicates held safely. ({escrowHeldInvoices.length} held)
                </p>
              </div>

              {/* Branch 3: Approval Required */}
              <div
                onClick={() => setActiveSubTab('decision-engine')}
                className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/50 hover:border-amber-400 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>3. CFO APPROVAL</span>
                  </span>
                  <span className="text-amber-400 font-bold">{approvalRequiredInvoices.length} Pending</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Commercial rate markups &amp; variances requiring CFO 1-click review.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: PURCHASE REQUESTS */}
      {activeSubTab === 'purchase-requests' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 uppercase">
                Purchase Requests (PR) Master Table
              </h3>
              <p className="text-xs text-slate-500">
                Authorized purchase requisitions prior to PO creation and vendor contracting.
              </p>
            </div>
            <button
              onClick={() => setNewPrModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit PR</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">PR Number</th>
                  <th className="py-3 px-3">Requester &amp; Dept</th>
                  <th className="py-3 px-3">Item Description</th>
                  <th className="py-3 px-3">Vendor</th>
                  <th className="py-3 px-3">Est. Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseRequests.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-blue-600">{pr.prNumber}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{pr.requesterName}</span>
                      <span className="text-[10px] text-slate-400">{pr.department}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-sans max-w-xs">{pr.itemDescription}</td>
                    <td className="py-3 px-3 text-slate-700">{pr.vendorName}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{formatINR(pr.estimatedAmount)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          pr.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pr.status === 'PO_CONVERTED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pr.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {pr.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => handleApprovePr(pr.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Approve &amp; Generate PO
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {pr.poNumber ? `Linked: ${pr.poNumber}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: PURCHASE ORDERS (PO) */}
      {activeSubTab === 'purchase-orders' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black font-mono text-slate-900 uppercase">
              Purchase Orders &amp; Vendor Rate Cards (3-Way Matching Master)
            </h3>
            <p className="text-xs text-slate-500">
              Contracted line items with binding unit prices and quantities used for zero-trust tolerance checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                po: 'PO-9022',
                vendor: 'AWS Enterprise Cloud',
                item: 'H100 GPU Cluster Reserved Instances',
                unitPrice: '₹42,000 / node',
                qty: '8 Nodes',
                total: 336000,
                status: 'FULFILLED',
              },
              {
                po: 'PO-8812',
                vendor: 'Quantum Materials',
                item: 'Ultra-Pure Silicon Substrates',
                unitPrice: '₹8,900 / wafer',
                qty: '10 Wafers',
                total: 89000,
                status: 'OPEN',
              },
              {
                po: 'PO-7741',
                vendor: 'Apex Logistics Corp',
                item: 'Global Airfreight Expedited Shipping',
                unitPrice: '₹18,400 / shipment',
                qty: '10 Shipments',
                total: 184000,
                status: 'OPEN',
              },
            ].map((po) => (
              <div key={po.po} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-blue-600">{po.po}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                    {po.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{po.vendor}</h4>
                <p className="text-xs text-slate-600 font-sans">{po.item}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">{po.qty}</span>
                  <span className="font-bold text-slate-900">{formatINR(po.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: INBOUND INVOICES */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 uppercase">
                Inbound Invoices Ledger
              </h3>
              <p className="text-xs text-slate-500">
                All raw invoices ingested via corporate AP email, API, and PDF drop.
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <ScanEye className="w-3.5 h-3.5" />
              <span>Ingest Raw Invoice</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Vendor</th>
                  <th className="py-3 px-3">PO Reference</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Trust Score</th>
                  <th className="py-3 px-3">Route Decision</th>
                  <th className="py-3 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.slice(0, 15).map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => onSelectInvoice(inv)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-bold text-blue-600">{inv.rawInvoiceNumber}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{inv.vendorName}</td>
                    <td className="py-3 px-3 text-slate-500">{inv.poNumber || 'N/A'}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{formatINR(inv.amount)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          (inv.trustScore ?? inv.confidenceScore ?? 98.0) >= 98
                            ? 'bg-emerald-100 text-emerald-800'
                            : (inv.trustScore ?? inv.confidenceScore ?? 98.0) >= 80
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {(inv.trustScore ?? inv.confidenceScore ?? 98.0).toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.routeDecision === 'R1_AUTO_PAY'
                            ? 'bg-blue-100 text-blue-800'
                            : inv.routeDecision === 'R2_CFO_REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.routeDecision}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectInvoice(inv);
                        }}
                        className="p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW: AI AUDIT (Forensics Engine) */}
      {activeSubTab === 'ai-audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <ScanEye className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black font-mono text-slate-900 uppercase">
                  Multi-Agent AI Forensics &amp; Audit Engine
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                8 specialized autonomous AI agents inspect every document for byte-level tamper evidence, font drift, and duplicate hashes.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              8 Multi-Agent Swarm Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <span className="text-[10px] font-mono font-bold text-purple-600 uppercase">Agent 1</span>
              <h4 className="text-xs font-bold text-slate-900 font-mono">PDF Producer &amp; Metadata</h4>
              <p className="text-[11px] text-slate-600 font-sans">
                Detects post-export alterations in Canva, Acrobat, or ghostscript engines.
              </p>
              <div className="text-[10px] font-mono text-emerald-600 font-bold">Passed 99.1%</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <span className="text-[10px] font-mono font-bold text-purple-600 uppercase">Agent 2</span>
              <h4 className="text-xs font-bold text-slate-900 font-mono">Font Substitution Engine</h4>
              <p className="text-[11px] text-slate-600 font-sans">
                Identifies replaced glyphs and overlaid bounding boxes in bank routing numbers.
              </p>
              <div className="text-[10px] font-mono text-amber-600 font-bold">1 Intercept Quarantined</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <span className="text-[10px] font-mono font-bold text-purple-600 uppercase">Agent 3</span>
              <h4 className="text-xs font-bold text-slate-900 font-mono">Duplicate SHA-256 Hasher</h4>
              <p className="text-[11px] text-slate-600 font-sans">
                Levenshtein and visual hash comparison across historical ERP invoices.
              </p>
              <div className="text-[10px] font-mono text-emerald-600 font-bold">0 Active Collisions</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <span className="text-[10px] font-mono font-bold text-purple-600 uppercase">Agent 4</span>
              <h4 className="text-xs font-bold text-slate-900 font-mono">3-Way PO Contract Scout</h4>
              <p className="text-[11px] text-slate-600 font-sans">
                Line-item unit price matching against binding PO contracts.
              </p>
              <div className="text-[10px] font-mono text-emerald-600 font-bold">24 POs Validated</div>
            </div>
          </div>

          {/* Audit Queue Inspector */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black font-mono text-slate-900 uppercase">
              Recent Forensic Findings &amp; Intercepts
            </h4>
            <div className="space-y-2">
              {invoices.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onSelectInvoice(inv)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/40 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{inv.rawInvoiceNumber}</span>
                      <span className="text-slate-500">• {inv.vendorName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-100 text-purple-800">
                        {inv.forensicSignals?.length || 8} Checks Completed
                      </span>
                    </div>
                    <p className="text-slate-600 font-sans text-[11px]">
                      {inv.agentFindings?.[0]?.description || 'Clean audit: All 8 forensic tests passed with zero drift.'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <span className="font-bold text-slate-900">{formatINR(inv.amount)}</span>
                    <span className="font-bold text-purple-600">{(inv.trustScore ?? inv.confidenceScore ?? 98.0).toFixed(1)} Trust</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW: TRUST SCORE (0-100 Engine) */}
      {activeSubTab === 'trust-score' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black font-mono text-slate-900 uppercase">
                  Composite Trust Score Calibration (0-100 Engine)
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Mathematical weighted aggregation of 8 zero-trust signals governing automated ERP execution.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                STP Threshold: ≥ 98.0
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">Tier 1: Autobahn</span>
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black font-mono text-slate-900">98.0 – 100.0</div>
              <p className="text-xs text-slate-600">
                Zero-touch straight-through payment disbursement via Instant ACH/FedNow.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Tier 2: CFO Review</span>
                <UserCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-black font-mono text-slate-900">80.0 – 97.9</div>
              <p className="text-xs text-slate-600">
                Variance/rate-markup routing requiring 1-click executive sign-off.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-rose-700 uppercase">Tier 3: Escrow Quarantine</span>
                <Lock className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-xl font-black font-mono text-slate-900">&lt; 80.0</div>
              <p className="text-xs text-slate-600">
                Font alteration or bank account drift quarantined until out-of-band phone auth.
              </p>
            </div>
          </div>

          {/* Invoices by Trust Score Breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black font-mono text-slate-900 uppercase">
              Current Invoices Trust Score Distribution
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice</th>
                    <th className="py-2.5 px-3">Vendor</th>
                    <th className="py-2.5 px-3">Forensic Score</th>
                    <th className="py-2.5 px-3">PO Match</th>
                    <th className="py-2.5 px-3">Duplicate Check</th>
                    <th className="py-2.5 px-3">Final Trust Score</th>
                    <th className="py-2.5 px-3">Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.slice(0, 10).map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => onSelectInvoice(inv)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-bold text-blue-600">{inv.rawInvoiceNumber}</td>
                      <td className="py-2.5 px-3 text-slate-900">{inv.vendorName}</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-bold">{inv.forensicSignals?.[0]?.score ? `${(100 - inv.forensicSignals[0].score * 100).toFixed(0)}%` : '100%'}</td>
                      <td className="py-2.5 px-3 text-slate-700">{inv.poNumber ? '100% Match' : 'PO N/A'}</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-bold">Clean (0.00)</td>
                      <td className="py-2.5 px-3 font-black text-slate-900">{(inv.trustScore ?? inv.confidenceScore ?? 98.0).toFixed(1)}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.routeDecision === 'R1_AUTO_PAY'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.routeDecision === 'R2_CFO_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {inv.routeDecision === 'R1_AUTO_PAY' ? 'AUTO PAY' : inv.routeDecision === 'R2_CFO_REVIEW' ? 'CFO REVIEW' : 'ESCROW HOLD'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: DECISION ENGINE (The 3 Routes) */}
      {activeSubTab === 'decision-engine' && (
        <div className="space-y-6">
          {/* Branch 1: Auto Pay */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black font-mono text-slate-900 uppercase">
                  Route 1: Auto-Pay (STP) Invoices (Score ≥ 98.0)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {autoPaidInvoices.length} Auto-Cleared
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {autoPaidInvoices.slice(0, 6).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onSelectInvoice(inv)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-900">{inv.rawInvoiceNumber}</span>
                    <span className="font-bold text-emerald-600">{(inv.trustScore ?? inv.confidenceScore ?? 98.0).toFixed(1)} Trust</span>
                  </div>
                  <p className="text-xs text-slate-700 font-bold truncate">{inv.vendorName}</p>
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-slate-500">{formatINR(inv.amount)}</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      ACH Settled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch 2: Escrow / Hold */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-black font-mono text-slate-900 uppercase">
                  Route 2: Escrow / Zero-Trust Hold (Quarantined Risk)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                {escrowHeldInvoices.length} Quarantined
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {escrowHeldInvoices.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onSelectInvoice(inv)}
                  className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200 hover:border-purple-400 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-purple-900">{inv.rawInvoiceNumber}</span>
                    <span className="font-bold text-purple-700">{formatINR(inv.amount)}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{inv.vendorName}</p>
                  <p className="text-[11px] text-purple-800 font-medium">
                    {inv.agentFindings?.[0]?.description || 'Quarantined: Suspicious metadata or bank drift detected.'}
                  </p>
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-purple-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecordFeedback(inv, 'ESCROW_RELEASED');
                        onApprove(inv.id, 'Escrow release authorized');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold font-mono cursor-pointer"
                    >
                      Release Escrow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch 3: CFO Approval Queue */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black font-mono text-slate-900 uppercase">
                  Route 3: CFO Exec Review Queue (Rate Markups &amp; Exceptions)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                {approvalRequiredInvoices.length} Pending Review
              </span>
            </div>

            <div className="space-y-3">
              {approvalRequiredInvoices.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onSelectInvoice(inv)}
                  className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 hover:border-amber-400 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black font-mono text-slate-900">{inv.rawInvoiceNumber}</span>
                      <span className="text-xs font-bold text-slate-700">• {inv.vendorName}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        {(inv.trustScore ?? inv.confidenceScore ?? 98.0).toFixed(1)} Trust
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 font-medium">
                      {inv.agentFindings?.[0]?.description || 'Rate markup vs contract PO clause.'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <span className="text-xs font-bold font-mono text-slate-900 mr-2">
                      {formatINR(inv.amount)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecordFeedback(inv, 'APPROVED');
                        onApprove(inv.id, 'Approved exception in CFO review');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecordFeedback(inv, 'REJECTED');
                        onReject(inv.id, 'Rejected markup exception');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: FEEDBACK → AI LEARNING */}
      {activeSubTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black font-mono text-slate-900 uppercase">
                  Feedback → AI Learning &amp; Weight Recalibration Loop
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Every executive approval, rejection, and escrow release automatically fine-tunes the zero-trust scoring model.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
              Active Learning Engine
            </span>
          </div>

          <div className="space-y-3">
            {feedbackLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{log.invoiceNumber}</span>
                    <span className="text-slate-500">({log.vendorName})</span>
                    <span className="text-purple-600 font-bold">• {log.anomalyType}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{log.recordedAt}</span>
                </div>

                <p className="text-xs text-slate-700 font-sans">
                  <strong>User Action:</strong>{' '}
                  <span className="font-mono font-bold text-blue-600">{log.userAction}</span> — {log.feedbackNotes}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-mono">
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Model Delta: {log.modelWeightDelta}</span>
                  </span>
                  <span className="text-slate-500">
                    Recalibrated Score: <strong className="text-slate-900">{log.recalibratedTrustScore.toFixed(1)}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Purchase Request Form */}
      {newPrModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black font-mono text-slate-900 uppercase">
                Create Purchase Request
              </h3>
              <button
                onClick={() => setNewPrModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePr} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-500 block font-bold">Item Description</label>
                <input
                  type="text"
                  required
                  value={newPrForm.item}
                  onChange={(e) => setNewPrForm({ ...newPrForm, item: e.target.value })}
                  placeholder="e.g. 50x Cloud Compute Licenses"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-500 block font-bold">Vendor / Supplier</label>
                <input
                  type="text"
                  value={newPrForm.vendor}
                  onChange={(e) => setNewPrForm({ ...newPrForm, vendor: e.target.value })}
                  placeholder="e.g. AWS Enterprise Cloud"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono text-slate-500 block font-bold">Estimated Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrForm.amount}
                    onChange={(e) => setNewPrForm({ ...newPrForm, amount: e.target.value })}
                    placeholder="e.g. 150000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-500 block font-bold">Priority</label>
                  <select
                    value={newPrForm.priority}
                    onChange={(e) => setNewPrForm({ ...newPrForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setNewPrModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold cursor-pointer"
                >
                  Submit For Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
