export type InvoiceStatus =
  | 'RECEIVED'
  | 'PROCESSING'
  | 'FLAGGED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID';

export type RouteDecision = 'R1_AUTO_PAY' | 'R2_CFO_REVIEW' | 'REJECTED';

export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AgentType =
  | 'FORENSICS'
  | 'DUPLICATE_ENGINE'
  | 'AUDITOR_3WAY'
  | 'MARKET_SCOUT'
  | 'CONTROL_FLAGS';

export type PaymentStatus = 'INITIATED' | 'SETTLED' | 'FAILED' | 'SIMULATED';

export interface Vendor {
  id: string;
  name: string;
  normalizedName: string;
  taxId: string;
  bankAccountHash: string;
  bankName: string;
  accountNumberMasked: string;
  isNewVendor: boolean;
  trustTier: 'PRISTINE' | 'STANDARD' | 'PROBATIONARY' | 'UNVERIFIED';
  rating: number;
  contactEmail: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  vendorId: string;
  contractNumber: string;
  itemDescription: string;
  canonicalItemKey: string;
  agreedUnitPrice: number;
  currency: string;
  validFrom: string;
  validTo: string;
  maxAnnualSpend: number;
  rateLockClause: boolean;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  poNumber: string;
  itemDescription: string;
  canonicalItemKey: string;
  approvedQuantity: number;
  approvedUnitPrice: number;
  approvedTotalAmount: number;
  currency: string;
  status: 'OPEN' | 'FULFILLED' | 'CLOSED';
  issueDate: string;
}

export interface MarketPrice {
  id: string;
  canonicalItemKey: string;
  category: string;
  benchmarkPrice: number;
  tolerancePct: number;
  lastUpdated: string;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  lineNumber: number;
  itemDescription: string;
  canonicalItemKey: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitOfMeasure: string;
}

export interface ForensicSignalDetail {
  checkName: string;
  passed: boolean;
  score: number; // 0 (clean) to 1 (high risk)
  evidence: string;
  severity: FindingSeverity;
}

export interface ForensicReport {
  producerString: string;
  expectedProducer: string;
  producerAnomaly: boolean;
  creationDate: string;
  modificationDate: string;
  dateMismatchAnomaly: boolean;
  embeddedFonts: string[];
  fontSubstitutionFlag: boolean;
  kerningInconsistencyScore: number;
  textVsRenderMismatch: boolean;
  overallForensicRisk: number; // 0 to 1
  heuristicsTriggered: string[];
  notes: string;
}

export interface AuditFindingItem {
  id: string;
  invoiceId: string;
  agentType: AgentType;
  severity: FindingSeverity;
  findingType: string;
  evidence: string;
  description?: string;
  dollarImpact: number;
  createdAt: string;
}

export interface WaterfallSignal {
  name: string;
  weight: number;
  maxPoints: number;
  pointsEarned: number;
  deduction: number;
  detail: string;
}

export interface ScoreBreakdown {
  finalScore: number; // 0 - 100
  duplicateWeight: number; // 0.30
  forensicWeight: number; // 0.20
  auditWeight: number; // 0.20
  priceWeight: number; // 0.15
  controlWeight: number; // 0.15
  signals: WaterfallSignal[];
  summaryNote: string;
}

export interface ErpPushResult {
  erpType: string;
  syncStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  qboBillId?: string;
  qboDocNumber?: string;
  achReference?: string;
  achBatchId?: string;
  achTraceNumber?: string;
  settledAmount?: number;
  currency?: string;
  timestamp: string;
  rawResponse?: Record<string, unknown>;
}

export interface RemediationStep {
  id: string;
  step: string;
  pointRecovery: number;
  requiredAction: string;
  owner: 'VENDOR' | 'PROCUREMENT' | 'CFO' | 'TREASURY';
  completed?: boolean;
}

export interface ScoreSpec {
  currentScore: number;
  potentialScore: number;
  deductions: Array<{
    category: string;
    pointsDeducted: number;
    reason: string;
    dollarImpact: number;
    severity: FindingSeverity;
  }>;
  remediationSteps: RemediationStep[];
  trustVerdict: 'DO_NOT_TRUST_HIGH_RISK' | 'CONDITIONAL_TRUST_ACTION_REQUIRED' | 'TRUSTED_SAFE_FOR_SETTLEMENT';
  trustVerdictLabel: string;
  trustVerdictExplanation: string;
  actionGuidance: string;
}

export interface EmailProcurementRecord {
  id: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  receivedAt: string;
  attachmentFilename: string;
  attachmentSize: string;
  spfDkimStatus: 'PASS' | 'FLAGGED' | 'FAIL';
  senderDomainAge: string;
  status: 'INGESTED_AUTO_PAID' | 'INGESTED_CFO_QUEUE' | 'INGESTED_FLAGGED' | 'IN_TRANSIT';
  extractedAmount: number;
  extractedVendor: string;
  invoiceId?: string;
  trustScore?: number;
}

export interface InvoiceRecord {
  id: string;
  vendorId?: string;
  vendorName?: string;
  rawInvoiceNumber: string;
  normalizedInvoiceNumber: string;
  amount: number;
  currency: string;
  invoiceDate: string;
  dueDate?: string;
  poNumber?: string;
  rawFilePath: string;
  status: InvoiceStatus;
  routeDecision: RouteDecision;
  trustScore?: number;
  confidenceScore?: number;
  forensicSignals?: ForensicSignalDetail[];
  duplicateProb: number;
  forensicRisk: number;
  auditFindingCount: number;
  extractedJson?: {
    header: {
      vendorName: string;
      taxId: string;
      invoiceNumber: string;
      date: string;
      poNumber?: string;
      bankDetails?: {
        bankName: string;
        accountNumber: string;
      };
      totalAmount: number;
      currency: string;
    };
    lineItems: Array<{
      itemDescription: string;
      canonicalItemKey: string;
      category: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      unitOfMeasure: string;
    }>;
  };
  forensicReport?: ForensicReport;
  agentFindings?: AuditFindingItem[];
  scoreBreakdown?: ScoreBreakdown;
  erpPushResult?: ErpPushResult;
  exceptionReasons?: string[];
  cfoNotes?: string;
  matchedDuplicateId?: string;
  isDemoScenario?: boolean;
  demoScenarioType?: 'EXACT_DUPLICATE' | 'MARKUP_14_PCT' | 'NEW_VENDOR_BANK_CHANGE' | 'FORGED_PDF' | 'CLEAN_AUTO_PAY';
  createdAt: string;
  updatedAt: string;
}

export interface GroundTruthRecord {
  invoiceId: string;
  invoiceNumber: string;
  vendorName: string;
  amount: number;
  is_duplicate: boolean;
  is_overpriced: boolean;
  is_forged: boolean;
  is_unusual: boolean;
  expected_route: 'R1_AUTO_PAY' | 'R2_CFO_REVIEW' | 'REJECTED';
  expected_savings: number;
  anomaly_description?: string;
}

export interface PipelineMetrics {
  totalProcessed: number;
  autoPaidCount: number;
  autoPaidPct: number;
  exceptionsCount: number;
  flaggedCount: number;
  identifiedSavings: number;
  duplicatesCaughtAmount: number;
  avgCostPerInvoice: number; // e.g. 0.90
  humanReviewCostSaved: number;
  lastUpdated: string;
}

export interface EvaluationMetrics {
  totalInvoices: number;
  duplicate: {
    precision: number;
    recall: number;
    f1: number;
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    trueNegatives: number;
  };
  forgery: {
    precision: number;
    recall: number;
    f1: number;
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    trueNegatives: number;
  };
  overpricing: {
    precision: number;
    recall: number;
    f1: number;
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    trueNegatives: number;
  };
  routingAccuracy: {
    overallAccuracy: number;
    correctDecisions: number;
    totalEvaluated: number;
    r1Precision: number;
    r1Recall: number;
    r2Precision: number;
    r2Recall: number;
  };
  estimatedTotalSavingsIdentified: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'CFO' | 'AP_DIRECTOR' | 'TREASURER' | 'PROCUREMENT_LEAD';
  avatarInitials: string;
  department: string;
}

export interface OrganizationWorkspace {
  id: string;
  name: string;
  legalEntity: string;
  domain: string;
  industry: string;
  erpType: 'QuickBooks Online' | 'SAP S/4HANA' | 'Oracle NetSuite' | 'Workday Financials';
  erpStatus: 'CONNECTED' | 'SYNCING' | 'SANDBOX';
  currency: string;
  dpoDays: number;
  autoPayThreshold: number; // e.g. 98.0
  monthlyVolume: number;
  openPOsCount: number;
  pendingExceptionsCount: number;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string;
  requesterName: string;
  department: string;
  vendorName: string;
  itemDescription: string;
  estimatedAmount: number;
  currency: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'PO_CONVERTED' | 'REJECTED';
  budgetCategory: string;
  poNumber?: string;
  createdAt: string;
}

export interface PaymentDisbursement {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorName: string;
  amount: number;
  currency: string;
  rail: 'ACH_INSTANT' | 'FEDNOW' | 'WIRE_SWIFT' | 'SEPA_INSTANT';
  status: 'SCHEDULED' | 'IN_FLIGHT' | 'AUTO_PAID' | 'ESCROW_HELD' | 'SETTLED';
  escrowReason?: string;
  settlementHash: string;
  scheduledDate: string;
  settledAt?: string;
}

export interface ReconciliationRecord {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  invoiceAmount: number;
  bankFeedAmount: number;
  erpLedgerAmount: number;
  matchStatus: 'PERFECT_MATCH' | 'VARIANCE_ALERT' | 'UNMATCHED_BANK' | 'PENDING_POSTING';
  varianceAmount: number;
  glAccount: string;
  journalEntryId: string;
  reconciledAt: string;
}

export interface AiFeedbackLog {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorName: string;
  anomalyType: string;
  originalScore: number;
  originalRoute: RouteDecision;
  userAction: 'APPROVED' | 'OVERRIDDEN' | 'ESCROW_RELEASED' | 'REJECTED';
  feedbackNotes: string;
  modelWeightDelta: string;
  recalibratedTrustScore: number;
  recordedAt: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  attachedMetrics?: { label: string; value: string; color?: string }[];
}

export type MainNavPillar = 'DASHBOARD' | 'PROCUREMENT' | 'INTELLIGENCE' | 'FINANCE';
export type AppFlowStage = 'LOGIN' | 'ORGANIZATION' | 'WORKSPACE';
