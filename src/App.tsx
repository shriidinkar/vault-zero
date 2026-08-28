import React, { useState, useEffect } from 'react';
import { VaultNavbar } from './components/VaultNavbar.js';
import { LoginScreen } from './components/LoginScreen.js';
import { DashboardView } from './components/DashboardView.js';
import { ProcurementPillarView } from './components/ProcurementPillarView.js';
import { IntelligencePillarView } from './components/IntelligencePillarView.js';
import { FinancePillarView } from './components/FinancePillarView.js';

// Modals
import { InvoiceDetailModal } from './components/InvoiceDetailModal.js';
import { UploadModal } from './components/UploadModal.js';
import { EvaluationDashboard } from './components/EvaluationDashboard.js';
import { QboSettingsModal } from './components/QboSettingsModal.js';
import { SpendAuditModal } from './components/SpendAuditModal.js';
import { FloatingTaskbar } from './components/FloatingTaskbar.js';
import { DataInjectorModal } from './components/DataInjectorModal.js';
import { SchemaModal } from './components/SchemaModal.js';

import {
  InvoiceRecord,
  PipelineMetrics,
  UserProfile,
  OrganizationWorkspace,
  MainNavPillar,
  AppFlowStage,
} from './types.js';
import {
  fetchInvoicesApi,
  fetchMetricsApi,
  approveInvoiceApi,
  rejectInvoiceApi,
  computeLocalMetrics,
} from './lib/apiService.js';
import {
  DatasetScenarioId,
  getInvoicesForScenario,
} from './lib/scenarioData.js';

export function App() {
  // Authentication & User State
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr_cfo_01',
    name: 'Sarah Jenkins',
    email: 's.jenkins@apexglobal.corp',
    role: 'CFO',
    avatarInitials: 'SJ',
    department: 'Executive Finance & Treasury',
  });

  // Single Unified Enterprise Workspace
  const currentWorkspace: OrganizationWorkspace = {
    id: 'org_apex_01',
    name: 'Apex Global Technologies Corp',
    legalEntity: 'Apex Global Enterprises Ltd.',
    domain: 'apexglobal.corp',
    industry: 'Enterprise Hardware & Cloud Datacenters',
    erpType: 'QuickBooks Online',
    erpStatus: 'CONNECTED',
    currency: 'INR (₹)',
    dpoDays: 46.4,
    autoPayThreshold: 98.0,
    monthlyVolume: 200,
    openPOsCount: 24,
    pendingExceptionsCount: 14,
  };

  // Flow Stage: 'LOGIN' | 'WORKSPACE'
  const [flowStage, setFlowStage] = useState<AppFlowStage>('WORKSPACE');

  // Main Pillar State: 'DASHBOARD' | 'PROCUREMENT' | 'INTELLIGENCE' | 'FINANCE'
  const [activePillar, setActivePillar] = useState<MainNavPillar>('DASHBOARD');
  const [procurementSubView, setProcurementSubView] = useState<string>('pipeline');
  const [intelligenceSubView, setIntelligenceSubView] = useState<string>('risk-center');
  const [financeSubView, setFinanceSubView] = useState<string>('payments');

  // Dataset Scenarios & Custom Injected Data
  const [activeScenarioId, setActiveScenarioId] = useState<DatasetScenarioId>('ENTERPRISE_BALANCED');
  const [customInvoices, setCustomInvoices] = useState<InvoiceRecord[]>([]);
  const [isDataInjectorOpen, setIsDataInjectorOpen] = useState(false);

  // Invoices & Telemetry State
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() =>
    getInvoicesForScenario('ENTERPRISE_BALANCED', [])
  );
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(() =>
    computeLocalMetrics(getInvoicesForScenario('ENTERPRISE_BALANCED', []))
  );
  const [isPolling, setIsPolling] = useState(false);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEvalOpen, setIsEvalOpen] = useState(false);
  const [isQboSettingsOpen, setIsQboSettingsOpen] = useState(false);
  const [isAuditExportOpen, setIsAuditExportOpen] = useState(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);

  // Switch Dataset Scenario handler
  const handleSelectScenario = (scenarioId: DatasetScenarioId) => {
    setActiveScenarioId(scenarioId);
    const updatedInvoices = getInvoicesForScenario(scenarioId, customInvoices);
    setInvoices(updatedInvoices);
    setMetrics(computeLocalMetrics(updatedInvoices));
  };

  // Custom Invoice Injection handler
  const handleInjectCustomInvoice = (newInv: InvoiceRecord) => {
    const updatedCustom = [newInv, ...customInvoices];
    setCustomInvoices(updatedCustom);
    const updatedInvoices = getInvoicesForScenario(activeScenarioId, updatedCustom);
    setInvoices(updatedInvoices);
    setMetrics(computeLocalMetrics(updatedInvoices));
    setSelectedInvoice(newInv);
  };

  // Reset Custom Data handler
  const handleResetCustomData = () => {
    setCustomInvoices([]);
    const defaultData = getInvoicesForScenario(activeScenarioId, []);
    setInvoices(defaultData);
    setMetrics(computeLocalMetrics(defaultData));
  };

  // Fetch Invoices with resilient fallback
  const fetchInvoices = async () => {
    if (customInvoices.length > 0) {
      return;
    }
    const data = await fetchInvoicesApi('all', '');
    if (data && data.length > 0) {
      setInvoices(data);
    }
  };

  // Fetch KPI Metrics
  const fetchMetrics = async () => {
    if (customInvoices.length > 0) {
      return;
    }
    const data = await fetchMetricsApi();
    if (data) {
      setMetrics(data);
    }
  };

  // 1-Click Approve handler
  const handleApprove = async (id: string, notes?: string) => {
    // Update local state directly for immediate reactivity
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'PAID' as const,
          routeDecision: 'R1_AUTO_PAY' as const,
          duplicateProb: 0,
          forensicRisk: 0,
          confidenceScore: 99.5,
          trustScore: 99.5,
          cfoNotes: notes || 'Approved & released by CFO',
          erpPushResult: {
            erpType: 'QuickBooks Online + Mock ACH',
            syncStatus: 'SUCCESS' as const,
            qboBillId: `QBO-BILL-${Date.now().toString().slice(-4)}`,
            achReference: `ACH-SETTLE-${Date.now().toString().slice(-6)}`,
            settledAmount: inv.amount,
            currency: inv.currency,
            timestamp: new Date().toISOString(),
          },
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    setMetrics(computeLocalMetrics(updatedInvoices));

    try {
      await approveInvoiceApi(id, notes);
    } catch (e) {
      // server sync
    }
  };

  // 1-Click Reject handler
  const handleReject = async (id: string, notes?: string) => {
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'REJECTED' as const,
          routeDecision: 'REJECTED' as const,
          cfoNotes: notes || 'Rejected & flagged by CFO',
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    setMetrics(computeLocalMetrics(updatedInvoices));

    try {
      await rejectInvoiceApi(id, notes);
    } catch (e) {
      // server sync
    }
  };

  const handleNavigatePillarWithSubview = (pillar: MainNavPillar, subview?: string) => {
    setActivePillar(pillar);
    if (pillar === 'PROCUREMENT' && subview) setProcurementSubView(subview);
    if (pillar === 'INTELLIGENCE' && subview) setIntelligenceSubView(subview);
    if (pillar === 'FINANCE' && subview) setFinanceSubView(subview);
  };

  const pendingExceptionsCount = invoices.filter(
    (i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID' && i.status !== 'REJECTED'
  ).length;

  // Render: LOGIN Screen
  if (flowStage === 'LOGIN') {
    return (
      <LoginScreen
        onLogin={(user) => {
          setCurrentUser(user);
          setFlowStage('WORKSPACE');
        }}
      />
    );
  }

  // Render: MAIN DASHBOARD & 3 PILLARS WORKSPACE
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-24">
      {/* Centered Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5">
        {/* Top Navbar */}
        <VaultNavbar
          currentUser={currentUser}
          workspace={currentWorkspace}
          activePillar={activePillar}
          onSelectPillar={(pillar) => setActivePillar(pillar)}
          pendingExceptionsCount={pendingExceptionsCount}
          onSwitchUser={(user) => setCurrentUser(user)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenEval={() => setIsEvalOpen(true)}
          onOpenQboSettings={() => setIsQboSettingsOpen(true)}
          onOpenAuditExport={() => setIsAuditExportOpen(true)}
          onOpenDataInjector={() => setIsDataInjectorOpen(true)}
          onOpenSchema={() => setIsSchemaOpen(true)}
          activeScenarioId={activeScenarioId}
          customDataCount={customInvoices.length}
          onLogout={() => setFlowStage('LOGIN')}
        />

        {/* PILLAR 1: DASHBOARD (Overview) */}
        {activePillar === 'DASHBOARD' && (
          <DashboardView
            metrics={metrics}
            invoices={invoices}
            workspace={currentWorkspace}
            currentUser={currentUser}
            onNavigatePillar={handleNavigatePillarWithSubview}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenAuditExport={() => setIsAuditExportOpen(true)}
            onOpenQboSettings={() => setIsQboSettingsOpen(true)}
          />
        )}

        {/* PILLAR 2: PROCUREMENT */}
        {activePillar === 'PROCUREMENT' && (
          <ProcurementPillarView
            invoices={invoices}
            workspace={currentWorkspace}
            currentUser={currentUser}
            initialSubTab={procurementSubView}
            onSelectInvoice={(inv) => setSelectedInvoice(inv)}
            onApprove={(id, notes) => handleApprove(id, notes)}
            onReject={(id, notes) => handleReject(id, notes)}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {/* PILLAR 3: INTELLIGENCE */}
        {activePillar === 'INTELLIGENCE' && (
          <IntelligencePillarView
            invoices={invoices}
            workspace={currentWorkspace}
            currentUser={currentUser}
            initialSubTab={intelligenceSubView}
            onSelectInvoice={(inv) => setSelectedInvoice(inv)}
            onOpenAuditExport={() => setIsAuditExportOpen(true)}
          />
        )}

        {/* PILLAR 4: FINANCE */}
        {activePillar === 'FINANCE' && (
          <FinancePillarView
            invoices={invoices}
            workspace={currentWorkspace}
            currentUser={currentUser}
            initialSubTab={financeSubView}
            onSelectInvoice={(inv) => setSelectedInvoice(inv)}
            onOpenAuditExport={() => setIsAuditExportOpen(true)}
          />
        )}
      </div>

      {/* Deep Inspection Invoice Detail Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onApprove={(id, notes) => handleApprove(id, notes)}
        onReject={(id, notes) => handleReject(id, notes)}
      />

      {/* Upload & Forensics Ingestion Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(newInv) => {
          fetchInvoices();
          fetchMetrics();
          if (newInv) setSelectedInvoice(newInv);
        }}
      />

      {/* Ground Truth Precision & Recall Evaluation Modal */}
      <EvaluationDashboard
        isOpen={isEvalOpen}
        onClose={() => setIsEvalOpen(false)}
      />

      {/* QBO & Thresholds Configuration Modal */}
      <QboSettingsModal
        isOpen={isQboSettingsOpen}
        onClose={() => setIsQboSettingsOpen(false)}
      />

      {/* CA Compliance & Audit Ledger Modal */}
      <SpendAuditModal
        isOpen={isAuditExportOpen}
        onClose={() => setIsAuditExportOpen(false)}
        invoices={invoices}
      />

      {/* Interactive Dataset & Custom Data Injector Engine */}
      <DataInjectorModal
        isOpen={isDataInjectorOpen}
        onClose={() => setIsDataInjectorOpen(false)}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        onInjectCustomInvoice={handleInjectCustomInvoice}
        onResetToDefault={handleResetCustomData}
        customInvoicesCount={customInvoices.length}
      />

      {/* AP Workflow Architecture Schema Modal */}
      <SchemaModal
        isOpen={isSchemaOpen}
        onClose={() => setIsSchemaOpen(false)}
      />

      {/* Persistent Floating Command Navigation Dock */}
      <FloatingTaskbar
        activePillar={activePillar}
        onSelectPillar={(pillar) => setActivePillar(pillar)}
        pendingExceptionsCount={pendingExceptionsCount}
        totalInvoicesCount={invoices.length}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenEval={() => setIsEvalOpen(true)}
        onOpenQboSettings={() => setIsQboSettingsOpen(true)}
        onOpenAuditExport={() => setIsAuditExportOpen(true)}
      />
    </div>
  );
}

export default App;
