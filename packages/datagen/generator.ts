import {
  Vendor,
  Contract,
  PurchaseOrder,
  MarketPrice,
  InvoiceRecord,
  GroundTruthRecord,
  AuditFindingItem,
} from '../../src/types.js';

export interface GeneratedDataset {
  vendors: Vendor[];
  contracts: Contract[];
  purchaseOrders: PurchaseOrder[];
  marketPrices: MarketPrice[];
  invoices: InvoiceRecord[];
  groundTruth: GroundTruthRecord[];
}

export function generateSyntheticData(): GeneratedDataset {
  // 1. Seed Master Vendors
  const vendors: Vendor[] = [
    {
      id: 'v-101',
      name: 'TechInfra Solutions Pvt Ltd',
      normalizedName: 'techinfra solutions',
      taxId: '27AABCT1234F1Z8',
      bankAccountHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      bankName: 'HDFC Bank',
      accountNumberMasked: '•••• •••• 9812',
      isNewVendor: false,
      trustTier: 'PRISTINE',
      rating: 4.9,
      contactEmail: 'billing@techinfra.io',
      createdAt: '2023-01-15T00:00:00Z',
    },
    {
      id: 'v-102',
      name: 'Apex Cloud Services Inc',
      normalizedName: 'apex cloud services',
      taxId: '29AABCA5678G2Z1',
      bankAccountHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      bankName: 'ICICI Bank',
      accountNumberMasked: '•••• •••• 4421',
      isNewVendor: false,
      trustTier: 'PRISTINE',
      rating: 4.8,
      contactEmail: 'accounts@apexcloud.com',
      createdAt: '2023-03-20T00:00:00Z',
    },
    {
      id: 'v-103',
      name: 'CyberShield SecOps Corp',
      normalizedName: 'cybershield secops',
      taxId: '33AABCC9012H3Z4',
      bankAccountHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      bankName: 'State Bank of India',
      accountNumberMasked: '•••• •••• 7731',
      isNewVendor: false,
      trustTier: 'STANDARD',
      rating: 4.6,
      contactEmail: 'invoices@cybershield.net',
      createdAt: '2023-06-10T00:00:00Z',
    },
    {
      id: 'v-104',
      name: 'Quantum Synergy Advisors LLP',
      normalizedName: 'quantum synergy advisors',
      taxId: '07AABCQ4455K1Z9',
      bankAccountHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      bankName: 'Axis Bank',
      accountNumberMasked: '•••• •••• 1109',
      isNewVendor: true, // Flagged new vendor!
      trustTier: 'UNVERIFIED',
      rating: 3.2,
      contactEmail: 'partner@quantumsynergy.biz',
      createdAt: '2026-08-20T00:00:00Z',
    },
    {
      id: 'v-105',
      name: 'Optima Data Systems',
      normalizedName: 'optima data systems',
      taxId: '19AABCO7890L4Z2',
      bankAccountHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      bankName: 'Kotak Mahindra Bank',
      accountNumberMasked: '•••• •••• 5590',
      isNewVendor: false,
      trustTier: 'STANDARD',
      rating: 4.7,
      contactEmail: 'pay@optimadata.com',
      createdAt: '2023-11-05T00:00:00Z',
    },
    {
      id: 'v-106',
      name: 'Vertex Hardware & Logistics',
      normalizedName: 'vertex hardware logistics',
      taxId: '06AABCV3322M5Z6',
      bankAccountHash: '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
      bankName: 'HDFC Bank',
      accountNumberMasked: '•••• •••• 3341',
      isNewVendor: false,
      trustTier: 'PRISTINE',
      rating: 4.9,
      contactEmail: 'orders@vertexhw.in',
      createdAt: '2023-04-12T00:00:00Z',
    },
  ];

  // 2. Contracts
  const contracts: Contract[] = [
    {
      id: 'c-201',
      vendorId: 'v-101',
      contractNumber: 'CTR-TECH-2025-01',
      itemDescription: 'Managed Cloud Infrastructure Services (Monthly L3)',
      canonicalItemKey: 'IT_CLOUD_MANAGED_SERVICES_L3',
      agreedUnitPrice: 45000,
      currency: 'INR',
      validFrom: '2025-01-01T00:00:00Z',
      validTo: '2027-01-01T00:00:00Z',
      maxAnnualSpend: 1500000,
      rateLockClause: true,
    },
    {
      id: 'c-202',
      vendorId: 'v-102',
      contractNumber: 'CTR-APEX-2025-04',
      itemDescription: 'Kubernetes Cluster Compute Node Hours (Standard)',
      canonicalItemKey: 'COMPUTE_K8S_NODE_HOUR_STD',
      agreedUnitPrice: 1250, // Rate is locked at 1,250
      currency: 'INR',
      validFrom: '2025-01-01T00:00:00Z',
      validTo: '2026-12-31T00:00:00Z',
      maxAnnualSpend: 3000000,
      rateLockClause: true,
    },
    {
      id: 'c-203',
      vendorId: 'v-103',
      contractNumber: 'CTR-SHIELD-2025-09',
      itemDescription: 'SOC Continuous Threat Detection Agent License',
      canonicalItemKey: 'SEC_SOC_THREAT_AGENT_LIC',
      agreedUnitPrice: 850,
      currency: 'INR',
      validFrom: '2025-01-01T00:00:00Z',
      validTo: '2026-12-31T00:00:00Z',
      maxAnnualSpend: 1200000,
      rateLockClause: true,
    },
    {
      id: 'c-204',
      vendorId: 'v-106',
      contractNumber: 'CTR-VERTEX-2025-11',
      itemDescription: 'High-Density Rackmount Server PSU Module',
      canonicalItemKey: 'HW_SERVER_PSU_1200W',
      agreedUnitPrice: 18500,
      currency: 'INR',
      validFrom: '2025-01-01T00:00:00Z',
      validTo: '2026-12-31T00:00:00Z',
      maxAnnualSpend: 2500000,
      rateLockClause: true,
    },
  ];

  // 3. Purchase Orders
  const purchaseOrders: PurchaseOrder[] = [
    {
      id: 'po-301',
      vendorId: 'v-101',
      poNumber: 'PO-2026-901',
      itemDescription: 'Managed Cloud Infrastructure Services (Monthly L3)',
      canonicalItemKey: 'IT_CLOUD_MANAGED_SERVICES_L3',
      approvedQuantity: 1,
      approvedUnitPrice: 45000,
      approvedTotalAmount: 45000,
      currency: 'INR',
      status: 'OPEN',
      issueDate: '2026-08-01T00:00:00Z',
    },
    {
      id: 'po-302',
      vendorId: 'v-102',
      poNumber: 'PO-2026-902',
      itemDescription: 'Kubernetes Cluster Compute Node Hours (Standard)',
      canonicalItemKey: 'COMPUTE_K8S_NODE_HOUR_STD',
      approvedQuantity: 680,
      approvedUnitPrice: 1250,
      approvedTotalAmount: 850000,
      currency: 'INR',
      status: 'OPEN',
      issueDate: '2026-08-05T00:00:00Z',
    },
    {
      id: 'po-303',
      vendorId: 'v-103',
      poNumber: 'PO-2026-903',
      itemDescription: 'SOC Continuous Threat Detection Agent License',
      canonicalItemKey: 'SEC_SOC_THREAT_AGENT_LIC',
      approvedQuantity: 50,
      approvedUnitPrice: 850,
      approvedTotalAmount: 42500,
      currency: 'INR',
      status: 'OPEN',
      issueDate: '2026-08-10T00:00:00Z',
    },
    {
      id: 'po-304',
      vendorId: 'v-101',
      poNumber: 'PO-2026-880',
      itemDescription: 'Enterprise Storage Array SAN Expansion',
      canonicalItemKey: 'IT_STORAGE_SAN_TB',
      approvedQuantity: 10,
      approvedUnitPrice: 82000,
      approvedTotalAmount: 820000,
      currency: 'INR',
      status: 'CLOSED',
      issueDate: '2026-07-01T00:00:00Z',
    },
  ];

  // 4. Market Prices Index
  const marketPrices: MarketPrice[] = [
    {
      id: 'mp-1',
      canonicalItemKey: 'IT_CLOUD_MANAGED_SERVICES_L3',
      category: 'IT_SERVICES',
      benchmarkPrice: 46000,
      tolerancePct: 5.0,
      lastUpdated: '2026-08-01T00:00:00Z',
    },
    {
      id: 'mp-2',
      canonicalItemKey: 'COMPUTE_K8S_NODE_HOUR_STD',
      category: 'INFRASTRUCTURE',
      benchmarkPrice: 1240,
      tolerancePct: 5.0,
      lastUpdated: '2026-08-01T00:00:00Z',
    },
    {
      id: 'mp-3',
      canonicalItemKey: 'SEC_SOC_THREAT_AGENT_LIC',
      category: 'CYBERSECURITY',
      benchmarkPrice: 870,
      tolerancePct: 5.0,
      lastUpdated: '2026-08-01T00:00:00Z',
    },
    {
      id: 'mp-4',
      canonicalItemKey: 'HW_SERVER_PSU_1200W',
      category: 'HARDWARE',
      benchmarkPrice: 18200,
      tolerancePct: 5.0,
      lastUpdated: '2026-08-01T00:00:00Z',
    },
    {
      id: 'mp-5',
      canonicalItemKey: 'GENERIC_CONSULTING_HOUR',
      category: 'PROFESSIONAL_SERVICES',
      benchmarkPrice: 4500,
      tolerancePct: 10.0,
      lastUpdated: '2026-08-01T00:00:00Z',
    },
  ];

  const invoices: InvoiceRecord[] = [];
  const groundTruth: GroundTruthRecord[] = [];

  // -------------------------------------------------------------
  // SEED THE 4 CRITICAL DEMO SCENARIOS
  // -------------------------------------------------------------

  // Demo 1: INV-4471 (Exact Duplicate, ₹8.2L)
  const inv4471: InvoiceRecord = {
    id: 'inv-4471',
    vendorId: 'v-101',
    vendorName: 'TechInfra Solutions Pvt Ltd',
    rawInvoiceNumber: 'INV-4471',
    normalizedInvoiceNumber: 'inv-4471',
    amount: 820000,
    currency: 'INR',
    invoiceDate: '2026-08-18T10:00:00Z',
    dueDate: '2026-09-18T10:00:00Z',
    poNumber: 'PO-2026-880',
    rawFilePath: '/invoices/INV-4471_TechInfra_SAN_Expansion.pdf',
    status: 'FLAGGED',
    routeDecision: 'R2_CFO_REVIEW',
    trustScore: 4.5,
    duplicateProb: 0.99,
    forensicRisk: 0.08,
    auditFindingCount: 2,
    isDemoScenario: true,
    demoScenarioType: 'EXACT_DUPLICATE',
    matchedDuplicateId: 'inv-4100-baseline',
    extractedJson: {
      header: {
        vendorName: 'TechInfra Solutions Pvt Ltd',
        taxId: '27AABCT1234F1Z8',
        invoiceNumber: 'INV-4471',
        date: '2026-08-18',
        poNumber: 'PO-2026-880',
        bankDetails: {
          bankName: 'HDFC Bank',
          accountNumber: '50200012349812',
        },
        totalAmount: 820000,
        currency: 'INR',
      },
      lineItems: [
        {
          itemDescription: 'Enterprise Storage Array SAN Expansion (10 TB)',
          canonicalItemKey: 'IT_STORAGE_SAN_TB',
          category: 'INFRASTRUCTURE',
          quantity: 10,
          unitPrice: 82000,
          totalPrice: 820000,
          unitOfMeasure: 'TB',
        },
      ],
    },
    forensicReport: {
      producerString: 'Adobe PDF Library 21.1.180',
      expectedProducer: 'Adobe PDF Library 21.1.180',
      producerAnomaly: false,
      creationDate: '2026-08-18T09:45:00Z',
      modificationDate: '2026-08-18T09:45:00Z',
      dateMismatchAnomaly: false,
      embeddedFonts: ['HelveticaNeue', 'HelveticaNeue-Bold'],
      fontSubstitutionFlag: false,
      kerningInconsistencyScore: 0.02,
      textVsRenderMismatch: false,
      overallForensicRisk: 0.08,
      heuristicsTriggered: [],
      notes: 'PDF metadata and visual stream match verified corporate template profile.',
    },
    agentFindings: [
      {
        id: 'af-4471-1',
        invoiceId: 'inv-4471',
        agentType: 'DUPLICATE_ENGINE',
        severity: 'CRITICAL',
        findingType: 'EXACT_DUPLICATE_DETECTED',
        evidence: 'Exact collision with already settled Invoice INV-4100 (₹8,20,000, TaxID 27AABCT1234F1Z8, PO-2026-880). Identical line-set hash match.',
        dollarImpact: 820000,
        createdAt: '2026-08-18T10:01:00Z',
      },
      {
        id: 'af-4471-2',
        invoiceId: 'inv-4471',
        agentType: 'AUDITOR_3WAY',
        severity: 'HIGH',
        findingType: 'PO_ALREADY_FULFILLED',
        evidence: 'Referenced PO-2026-880 was marked CLOSED on 2026-07-28 upon settlement of original invoice.',
        dollarImpact: 820000,
        createdAt: '2026-08-18T10:01:00Z',
      },
    ],
    scoreBreakdown: {
      finalScore: 4.5,
      duplicateWeight: 0.30,
      forensicWeight: 0.20,
      auditWeight: 0.20,
      priceWeight: 0.15,
      controlWeight: 0.15,
      signals: [
        { name: 'Duplicate Risk Engine', weight: 0.30, maxPoints: 30, pointsEarned: 0, deduction: 30, detail: 'Exact duplicate detected with prior invoice INV-4100 (₹8.2L)' },
        { name: 'Forensic PDF Inspection', weight: 0.20, maxPoints: 20, pointsEarned: 18.5, deduction: 1.5, detail: 'Clean metadata structure' },
        { name: 'Auditor 3-Way Match', weight: 0.20, maxPoints: 20, pointsEarned: 0, deduction: 20, detail: 'PO is already fulfilled and closed' },
        { name: 'Market Scout Benchmark', weight: 0.15, maxPoints: 15, pointsEarned: 14, deduction: 1, detail: 'Unit pricing within historical band' },
        { name: 'Control Flags & Vendor Tier', weight: 0.15, maxPoints: 15, pointsEarned: 12, deduction: 3, detail: 'Amount ₹8,20,000 exceeds autonomous threshold ₹50,000' },
      ],
      summaryNote: 'CRITICAL: Severe duplicate collision. Total potential loss prevented: ₹8,20,000.',
    },
    exceptionReasons: [
      'Exact duplicate of settled invoice INV-4100 (₹8,20,000)',
      'Associated PO-2026-880 is already closed and spent',
      'Exceeds autonomous payment threshold of ₹50,000',
    ],
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-18T10:01:00Z',
  };

  // Demo 2: INV-4472 (14% Markup vs Contract Rate)
  const inv4472: InvoiceRecord = {
    id: 'inv-4472',
    vendorId: 'v-102',
    vendorName: 'Apex Cloud Services Inc',
    rawInvoiceNumber: 'INV-4472',
    normalizedInvoiceNumber: 'inv-4472',
    amount: 969000, // 680 hrs * ₹1425 = ₹9,69,000 instead of 680 * ₹1250 = ₹8,50,000 (₹1,19,000 overcharge!)
    currency: 'INR',
    invoiceDate: '2026-08-19T11:20:00Z',
    dueDate: '2026-09-19T11:20:00Z',
    poNumber: 'PO-2026-902',
    rawFilePath: '/invoices/INV-4472_Apex_Cloud_K8s_Compute.pdf',
    status: 'FLAGGED',
    routeDecision: 'R2_CFO_REVIEW',
    trustScore: 48.0,
    duplicateProb: 0.02,
    forensicRisk: 0.05,
    auditFindingCount: 2,
    isDemoScenario: true,
    demoScenarioType: 'MARKUP_14_PCT',
    extractedJson: {
      header: {
        vendorName: 'Apex Cloud Services Inc',
        taxId: '29AABCA5678G2Z1',
        invoiceNumber: 'INV-4472',
        date: '2026-08-19',
        poNumber: 'PO-2026-902',
        bankDetails: {
          bankName: 'ICICI Bank',
          accountNumber: '001205004421',
        },
        totalAmount: 969000,
        currency: 'INR',
      },
      lineItems: [
        {
          itemDescription: 'Kubernetes Cluster Compute Node Hours (Standard)',
          canonicalItemKey: 'COMPUTE_K8S_NODE_HOUR_STD',
          category: 'INFRASTRUCTURE',
          quantity: 680,
          unitPrice: 1425, // Contract says 1250! (+14.0%)
          totalPrice: 969000,
          unitOfMeasure: 'HR',
        },
      ],
    },
    forensicReport: {
      producerString: 'GPL Ghostscript 10.02.0',
      expectedProducer: 'GPL Ghostscript 10.02.0',
      producerAnomaly: false,
      creationDate: '2026-08-19T11:15:00Z',
      modificationDate: '2026-08-19T11:15:00Z',
      dateMismatchAnomaly: false,
      embeddedFonts: ['LiberationSans-Regular', 'LiberationSans-Bold'],
      fontSubstitutionFlag: false,
      kerningInconsistencyScore: 0.03,
      textVsRenderMismatch: false,
      overallForensicRisk: 0.05,
      heuristicsTriggered: [],
      notes: 'Clean forensic signature. Valid provider billing system stream.',
    },
    agentFindings: [
      {
        id: 'af-4472-1',
        invoiceId: 'inv-4472',
        agentType: 'AUDITOR_3WAY',
        severity: 'HIGH',
        findingType: 'CONTRACT_RATE_CREEP',
        evidence: 'Invoiced unit price of ₹1,425/hr violates locked contract CTR-APEX-2025-04 agreed rate of ₹1,250/hr (+14.00% markup).',
        dollarImpact: 119000,
        createdAt: '2026-08-19T11:21:00Z',
      },
      {
        id: 'af-4472-2',
        invoiceId: 'inv-4472',
        agentType: 'MARKET_SCOUT',
        severity: 'MEDIUM',
        findingType: 'ABOVE_MARKET_INDEX',
        evidence: 'Unit price of ₹1,425 exceeds current market benchmark of ₹1,240 by +14.92%. Annualized excess spend projected at ₹14,28,000.',
        dollarImpact: 119000,
        createdAt: '2026-08-19T11:21:00Z',
      },
    ],
    scoreBreakdown: {
      finalScore: 48.0,
      duplicateWeight: 0.30,
      forensicWeight: 0.20,
      auditWeight: 0.20,
      priceWeight: 0.15,
      controlWeight: 0.15,
      signals: [
        { name: 'Duplicate Risk Engine', weight: 0.30, maxPoints: 30, pointsEarned: 29.5, deduction: 0.5, detail: 'Unique invoice record' },
        { name: 'Forensic PDF Inspection', weight: 0.20, maxPoints: 20, pointsEarned: 19.0, deduction: 1.0, detail: 'Valid PDF structure' },
        { name: 'Auditor 3-Way Match', weight: 0.20, maxPoints: 20, pointsEarned: 2.0, deduction: 18.0, detail: '+14% price discrepancy vs master contract rate' },
        { name: 'Market Scout Benchmark', weight: 0.15, maxPoints: 15, pointsEarned: 3.5, deduction: 11.5, detail: 'Rates significantly above market index' },
        { name: 'Control Flags & Vendor Tier', weight: 0.15, maxPoints: 15, pointsEarned: 4.0, deduction: 11.0, detail: 'Amount ₹9.69L requires CFO authorization' },
      ],
      summaryNote: 'FLAGGED: 14% unauthorized price escalation. Immediate contract savings potential: ₹1,19,000.',
    },
    exceptionReasons: [
      '14.0% price markup above locked contract rate (₹1,425 vs ₹1,250)',
      'Total overcharge of ₹1,19,000 against PO-2026-902',
      'Invoice total ₹9,69,000 exceeds autonomous limit',
    ],
    createdAt: '2026-08-19T11:20:00Z',
    updatedAt: '2026-08-19T11:21:00Z',
  };

  // Demo 3: INV-4473 (New Vendor + Changed Bank Details + Vague Consulting Line)
  const inv4473: InvoiceRecord = {
    id: 'inv-4473',
    vendorId: 'v-104',
    vendorName: 'Quantum Synergy Advisors LLP',
    rawInvoiceNumber: 'INV-4473',
    normalizedInvoiceNumber: 'inv-4473',
    amount: 145000,
    currency: 'INR',
    invoiceDate: '2026-08-20T14:30:00Z',
    dueDate: '2026-09-04T14:30:00Z',
    rawFilePath: '/invoices/INV-4473_Quantum_Synergy_Advisory.pdf',
    status: 'FLAGGED',
    routeDecision: 'R2_CFO_REVIEW',
    trustScore: 32.0,
    duplicateProb: 0.05,
    forensicRisk: 0.25,
    auditFindingCount: 3,
    isDemoScenario: true,
    demoScenarioType: 'NEW_VENDOR_BANK_CHANGE',
    extractedJson: {
      header: {
        vendorName: 'Quantum Synergy Advisors LLP',
        taxId: '07AABCQ4455K1Z9',
        invoiceNumber: 'INV-4473',
        date: '2026-08-20',
        bankDetails: {
          bankName: 'Axis Bank',
          accountNumber: '91802004991109', // Newly added / unverified bank account
        },
        totalAmount: 145000,
        currency: 'INR',
      },
      lineItems: [
        {
          itemDescription: 'Strategic Synergistic Digital Transformation Consulting & Advisory Services',
          canonicalItemKey: 'GENERIC_CONSULTING_HOUR',
          category: 'PROFESSIONAL_SERVICES',
          quantity: 20,
          unitPrice: 7250,
          totalPrice: 145000,
          unitOfMeasure: 'HR',
        },
      ],
    },
    forensicReport: {
      producerString: 'Microsoft Word for Microsoft 365',
      expectedProducer: 'ERP Standard Automated PDF Engine',
      producerAnomaly: true,
      creationDate: '2026-08-20T14:15:00Z',
      modificationDate: '2026-08-20T14:28:00Z',
      dateMismatchAnomaly: false,
      embeddedFonts: ['Calibri', 'Calibri-Bold'],
      fontSubstitutionFlag: false,
      kerningInconsistencyScore: 0.08,
      textVsRenderMismatch: false,
      overallForensicRisk: 0.25,
      heuristicsTriggered: ['DESKTOP_OFFICE_SUITE_PRODUCER', 'MANUALLY_COMPOSED_DOCUMENT'],
      notes: 'Invoice generated via desktop word processor rather than automated accounting ERP.',
    },
    agentFindings: [
      {
        id: 'af-4473-1',
        invoiceId: 'inv-4473',
        agentType: 'CONTROL_FLAGS',
        severity: 'CRITICAL',
        findingType: 'NEW_UNVERIFIED_VENDOR',
        evidence: 'Vendor created < 7 days ago with zero historical transaction track record and Unverified Trust Tier.',
        dollarImpact: 145000,
        createdAt: '2026-08-20T14:31:00Z',
      },
      {
        id: 'af-4473-2',
        invoiceId: 'inv-4473',
        agentType: 'CONTROL_FLAGS',
        severity: 'HIGH',
        findingType: 'UNVERIFIED_BANK_ACCOUNT_HASH',
        evidence: 'Beneficiary bank account hash (Axis Bank ...1109) has no verified penny-drop confirmation.',
        dollarImpact: 145000,
        createdAt: '2026-08-20T14:31:00Z',
      },
      {
        id: 'af-4473-3',
        invoiceId: 'inv-4473',
        agentType: 'AUDITOR_3WAY',
        severity: 'MEDIUM',
        findingType: 'VAGUE_SCOPE_NO_PO_ATTACHED',
        evidence: 'Line description "Strategic Synergistic Consulting" lacks SOW attachment and approved PO reference.',
        dollarImpact: 145000,
        createdAt: '2026-08-20T14:31:00Z',
      },
    ],
    scoreBreakdown: {
      finalScore: 32.0,
      duplicateWeight: 0.30,
      forensicWeight: 0.20,
      auditWeight: 0.20,
      priceWeight: 0.15,
      controlWeight: 0.15,
      signals: [
        { name: 'Duplicate Risk Engine', weight: 0.30, maxPoints: 30, pointsEarned: 28.5, deduction: 1.5, detail: 'First time seen invoice' },
        { name: 'Forensic PDF Inspection', weight: 0.20, maxPoints: 20, pointsEarned: 14.5, deduction: 5.5, detail: 'Desktop Word processor artifact' },
        { name: 'Auditor 3-Way Match', weight: 0.20, maxPoints: 20, pointsEarned: 4.0, deduction: 16.0, detail: 'Missing PO, vague statement of work' },
        { name: 'Market Scout Benchmark', weight: 0.15, maxPoints: 15, pointsEarned: 5.0, deduction: 10.0, detail: 'Rate of ₹7,250/hr exceeds benchmark of ₹4,500/hr' },
        { name: 'Control Flags & Vendor Tier', weight: 0.15, maxPoints: 15, pointsEarned: 0.0, deduction: 15.0, detail: 'CRITICAL: New vendor + unverified bank details' },
      ],
      summaryNote: 'HIGH RISK: Unverified new vendor requesting payment to new bank account with no PO.',
    },
    exceptionReasons: [
      'New vendor created < 7 days ago with Probationary / Unverified status',
      'Changed / unverified bank account routing details (Axis Bank)',
      'Vague consulting scope with no approved Purchase Order',
      'Consulting hourly rate (₹7,250) is 61% above market benchmark',
    ],
    createdAt: '2026-08-20T14:30:00Z',
    updatedAt: '2026-08-20T14:31:00Z',
  };

  // Demo 4: INV-4474 (Forged PDF: Metadata Mismatch + Font Substituted)
  const inv4474: InvoiceRecord = {
    id: 'inv-4474',
    vendorId: 'v-101',
    vendorName: 'TechInfra Solutions Pvt Ltd',
    rawInvoiceNumber: 'INV-4474',
    normalizedInvoiceNumber: 'inv-4474',
    amount: 320000,
    currency: 'INR',
    invoiceDate: '2026-08-21T09:10:00Z',
    dueDate: '2026-09-21T09:10:00Z',
    poNumber: 'PO-2026-901',
    rawFilePath: '/invoices/INV-4474_TechInfra_FORGED_ALTERED.pdf',
    status: 'FLAGGED',
    routeDecision: 'R2_CFO_REVIEW',
    trustScore: 21.5,
    duplicateProb: 0.15,
    forensicRisk: 0.89, // High forensic risk!
    auditFindingCount: 2,
    isDemoScenario: true,
    demoScenarioType: 'FORGED_PDF',
    extractedJson: {
      header: {
        vendorName: 'TechInfra Solutions Pvt Ltd',
        taxId: '27AABCT1234F1Z8',
        invoiceNumber: 'INV-4474',
        date: '2026-08-21',
        poNumber: 'PO-2026-901',
        bankDetails: {
          bankName: 'HDFC Bank',
          accountNumber: '50200012349812',
        },
        totalAmount: 320000,
        currency: 'INR',
      },
      lineItems: [
        {
          itemDescription: 'Managed Cloud Infrastructure Extended SLA & Threat Monitoring Support',
          canonicalItemKey: 'IT_CLOUD_MANAGED_SERVICES_L3',
          category: 'IT_SERVICES',
          quantity: 4,
          unitPrice: 80000,
          totalPrice: 320000,
          unitOfMeasure: 'MONTH',
        },
      ],
    },
    forensicReport: {
      producerString: 'iLovePDF / PDFtk Free / Online Editor v4.2',
      expectedProducer: 'Adobe PDF Library 21.1.180 (TechInfra Official)',
      producerAnomaly: true,
      creationDate: '2022-03-14T08:12:00Z', // Created in 2022
      modificationDate: '2026-08-21T09:04:12Z', // Modified 4 years later!
      dateMismatchAnomaly: true,
      embeddedFonts: ['Arial-BoldMT', 'TimesNewRomanPSMT', 'Helvetica-Narrow'],
      fontSubstitutionFlag: true,
      kerningInconsistencyScore: 0.84, // Substituted glyph bounding box mismatch
      textVsRenderMismatch: true,
      overallForensicRisk: 0.89,
      heuristicsTriggered: [
        'HEURISTIC: PRODUCER_STRING_MODIFIED (iLovePDF/Online Editor)',
        'HEURISTIC: CHRONOLOGICAL_MISMATCH (Creation: 2022 vs Mod: 2026)',
        'HEURISTIC: FONT_SUBSTITUTION_DETECTED (ArialMT spliced over Helvetica)',
        'HEURISTIC: TEXT_LAYER_KERNING_JITTER (Glyph bbox displacement > 2.4pt)',
      ],
      notes: 'HIGH RISK FORENSIC ANOMALY: The document is an old 2022 template that was modified using an online PDF editor. The amount and date fields were overwritten with substituted Arial glyphs.',
    },
    agentFindings: [
      {
        id: 'af-4474-1',
        invoiceId: 'inv-4474',
        agentType: 'FORENSICS',
        severity: 'CRITICAL',
        findingType: 'TAMPERED_PDF_FILE_STRUCTURE',
        evidence: 'Creation date (2022-03-14) vs Mod date (2026-08-21) mismatch. Producer string "iLovePDF" deviates from authentic vendor software. Substituted font bounding boxes detected over numerical total field.',
        dollarImpact: 320000,
        createdAt: '2026-08-21T09:11:00Z',
      },
      {
        id: 'af-4474-2',
        invoiceId: 'inv-4474',
        agentType: 'AUDITOR_3WAY',
        severity: 'HIGH',
        findingType: 'PO_LINE_RATE_MISMATCH',
        evidence: 'PO-2026-901 authorizes 1 unit @ ₹45,000. Invoiced claims 4 units @ ₹80,000 (+77.7% inflated rate).',
        dollarImpact: 275000,
        createdAt: '2026-08-21T09:11:00Z',
      },
    ],
    scoreBreakdown: {
      finalScore: 21.5,
      duplicateWeight: 0.30,
      forensicWeight: 0.20,
      auditWeight: 0.20,
      priceWeight: 0.15,
      controlWeight: 0.15,
      signals: [
        { name: 'Duplicate Risk Engine', weight: 0.30, maxPoints: 30, pointsEarned: 18.0, deduction: 12.0, detail: 'Structural similarity with altered 2022 template' },
        { name: 'Forensic PDF Inspection', weight: 0.20, maxPoints: 20, pointsEarned: 1.5, deduction: 18.5, detail: 'CRITICAL: Font substitution & 4-year creation mismatch' },
        { name: 'Auditor 3-Way Match', weight: 0.20, maxPoints: 20, pointsEarned: 2.0, deduction: 18.0, detail: 'Unit rate ₹80k vs PO authorized ₹45k' },
        { name: 'Market Scout Benchmark', weight: 0.15, maxPoints: 15, pointsEarned: 0.0, deduction: 15.0, detail: 'Inflated 77% above standard benchmark' },
        { name: 'Control Flags & Vendor Tier', weight: 0.15, maxPoints: 15, pointsEarned: 0.0, deduction: 15.0, detail: 'Failed forensic gatekeeper' },
      ],
      summaryNote: 'FORGERY DETECTED: Tampered PDF with font substitutions and 4-year creation timestamp disparity.',
    },
    exceptionReasons: [
      'Forensic Alert: Tampered PDF created in 2022 and edited via online tool (iLovePDF)',
      'Font substitution and kerning displacement on amount fields',
      'Invoiced rate ₹80,000 exceeds PO authorized rate ₹45,000',
    ],
    createdAt: '2026-08-21T09:10:00Z',
    updatedAt: '2026-08-21T09:11:00Z',
  };

  // Add the 4 demo invoices
  invoices.push(inv4471, inv4472, inv4473, inv4474);

  // Add corresponding Ground Truth records
  groundTruth.push(
    {
      invoiceId: 'inv-4471',
      invoiceNumber: 'INV-4471',
      vendorName: 'TechInfra Solutions Pvt Ltd',
      amount: 820000,
      is_duplicate: true,
      is_overpriced: false,
      is_forged: false,
      is_unusual: true,
      expected_route: 'R2_CFO_REVIEW',
      expected_savings: 820000,
      anomaly_description: 'Exact duplicate invoice of already settled INV-4100',
    },
    {
      invoiceId: 'inv-4472',
      invoiceNumber: 'INV-4472',
      vendorName: 'Apex Cloud Services Inc',
      amount: 969000,
      is_duplicate: false,
      is_overpriced: true,
      is_forged: false,
      is_unusual: false,
      expected_route: 'R2_CFO_REVIEW',
      expected_savings: 119000,
      anomaly_description: '14% rate markup above locked contract rate',
    },
    {
      invoiceId: 'inv-4473',
      invoiceNumber: 'INV-4473',
      vendorName: 'Quantum Synergy Advisors LLP',
      amount: 145000,
      is_duplicate: false,
      is_overpriced: false,
      is_forged: false,
      is_unusual: true,
      expected_route: 'R2_CFO_REVIEW',
      expected_savings: 145000,
      anomaly_description: 'Unverified new vendor + new bank account + vague consulting scope',
    },
    {
      invoiceId: 'inv-4474',
      invoiceNumber: 'INV-4474',
      vendorName: 'TechInfra Solutions Pvt Ltd',
      amount: 320000,
      is_duplicate: false,
      is_overpriced: false,
      is_forged: true,
      is_unusual: true,
      expected_route: 'R2_CFO_REVIEW',
      expected_savings: 320000,
      anomaly_description: 'Forged PDF with substituted fonts & 4-year metadata date discrepancy',
    }
  );

  // -------------------------------------------------------------
  // SEED CLEAN AUTO-PAYABLE INVOICES (R1 AUTO-PAY SCENARIOS)
  // -------------------------------------------------------------
  const cleanInvoicesConfig = [
    {
      id: 'inv-3001',
      num: 'INV-3001',
      vendorId: 'v-101',
      vendorName: 'TechInfra Solutions Pvt Ltd',
      poNumber: 'PO-2026-901',
      amount: 45000,
      desc: 'Managed Cloud Infrastructure Services (Monthly L3)',
      key: 'IT_CLOUD_MANAGED_SERVICES_L3',
      cat: 'IT_SERVICES',
      qty: 1,
      rate: 45000,
      uom: 'MONTH',
    },
    {
      id: 'inv-3002',
      num: 'INV-3002',
      vendorId: 'v-103',
      vendorName: 'CyberShield SecOps Corp',
      poNumber: 'PO-2026-903',
      amount: 42500,
      desc: 'SOC Continuous Threat Detection Agent License',
      key: 'SEC_SOC_THREAT_AGENT_LIC',
      cat: 'CYBERSECURITY',
      qty: 50,
      rate: 850,
      uom: 'AGENT',
    },
    {
      id: 'inv-3003',
      num: 'INV-3003',
      vendorId: 'v-106',
      vendorName: 'Vertex Hardware & Logistics',
      poNumber: 'PO-2026-911',
      amount: 37000,
      desc: 'High-Density Rackmount Server PSU Module (2x Units)',
      key: 'HW_SERVER_PSU_1200W',
      cat: 'HARDWARE',
      qty: 2,
      rate: 18500,
      uom: 'EA',
    },
    {
      id: 'inv-3004',
      num: 'INV-3004',
      vendorId: 'v-102',
      vendorName: 'Apex Cloud Services Inc',
      poNumber: 'PO-2026-912',
      amount: 37500,
      desc: 'Kubernetes Cluster Compute Node Hours (Standard)',
      key: 'COMPUTE_K8S_NODE_HOUR_STD',
      cat: 'INFRASTRUCTURE',
      qty: 30,
      rate: 1250,
      uom: 'HR',
    },
    {
      id: 'inv-3005',
      num: 'INV-3005',
      vendorId: 'v-101',
      vendorName: 'TechInfra Solutions Pvt Ltd',
      poNumber: 'PO-2026-915',
      amount: 48000,
      desc: 'Managed Cloud Infrastructure Services - Auxiliary Backup Tier',
      key: 'IT_CLOUD_MANAGED_SERVICES_L3',
      cat: 'IT_SERVICES',
      qty: 1,
      rate: 48000,
      uom: 'MONTH',
    },
  ];

  cleanInvoicesConfig.forEach((cfg, idx) => {
    const inv: InvoiceRecord = {
      id: cfg.id,
      vendorId: cfg.vendorId,
      vendorName: cfg.vendorName,
      rawInvoiceNumber: cfg.num,
      normalizedInvoiceNumber: cfg.num.toLowerCase(),
      amount: cfg.amount,
      currency: 'INR',
      invoiceDate: `2026-08-${15 + idx}T08:30:00Z`,
      dueDate: `2026-09-${15 + idx}T08:30:00Z`,
      poNumber: cfg.poNumber,
      rawFilePath: `/invoices/${cfg.num}_${cfg.vendorName.replace(/\s+/g, '_')}.pdf`,
      status: 'PAID',
      routeDecision: 'R1_AUTO_PAY',
      trustScore: 99.2 - idx * 0.2,
      duplicateProb: 0.0,
      forensicRisk: 0.01,
      auditFindingCount: 0,
      isDemoScenario: true,
      demoScenarioType: 'CLEAN_AUTO_PAY',
      extractedJson: {
        header: {
          vendorName: cfg.vendorName,
          taxId: cfg.vendorId === 'v-101' ? '27AABCT1234F1Z8' : cfg.vendorId === 'v-102' ? '29AABCA5678G2Z1' : cfg.vendorId === 'v-103' ? '33AABCC9012H3Z4' : '06AABCV3322M5Z6',
          invoiceNumber: cfg.num,
          date: `2026-08-${15 + idx}`,
          poNumber: cfg.poNumber,
          bankDetails: {
            bankName: 'HDFC Bank',
            accountNumber: '•••• •••• 9812',
          },
          totalAmount: cfg.amount,
          currency: 'INR',
        },
        lineItems: [
          {
            itemDescription: cfg.desc,
            canonicalItemKey: cfg.key,
            category: cfg.cat,
            quantity: cfg.qty,
            unitPrice: cfg.rate,
            totalPrice: cfg.amount,
            unitOfMeasure: cfg.uom,
          },
        ],
      },
      forensicReport: {
        producerString: 'Adobe PDF Library 21.1.180',
        expectedProducer: 'Adobe PDF Library 21.1.180',
        producerAnomaly: false,
        creationDate: `2026-08-${15 + idx}T08:00:00Z`,
        modificationDate: `2026-08-${15 + idx}T08:00:00Z`,
        dateMismatchAnomaly: false,
        embeddedFonts: ['HelveticaNeue', 'HelveticaNeue-Bold'],
        fontSubstitutionFlag: false,
        kerningInconsistencyScore: 0.01,
        textVsRenderMismatch: false,
        overallForensicRisk: 0.01,
        heuristicsTriggered: [],
        notes: 'Pristine authentic document signature. Verified issuer keys.',
      },
      agentFindings: [],
      scoreBreakdown: {
        finalScore: 99.2 - idx * 0.2,
        duplicateWeight: 0.30,
        forensicWeight: 0.20,
        auditWeight: 0.20,
        priceWeight: 0.15,
        controlWeight: 0.15,
        signals: [
          { name: 'Duplicate Risk Engine', weight: 0.30, maxPoints: 30, pointsEarned: 30, deduction: 0, detail: 'Unique transaction signature' },
          { name: 'Forensic PDF Inspection', weight: 0.20, maxPoints: 20, pointsEarned: 19.8, deduction: 0.2, detail: 'Authentic vector rendering' },
          { name: 'Auditor 3-Way Match', weight: 0.20, maxPoints: 20, pointsEarned: 20, deduction: 0, detail: '100% matched against PO and locked contract' },
          { name: 'Market Scout Benchmark', weight: 0.15, maxPoints: 15, pointsEarned: 15, deduction: 0, detail: 'Competitive market pricing' },
          { name: 'Control Flags & Vendor Tier', weight: 0.15, maxPoints: 15, pointsEarned: 14.4, deduction: 0.6, detail: 'Trusted Tier 1 vendor, <= ₹50k limit satisfied' },
        ],
        summaryNote: 'PRISTINE: Fully verified 3-way match. Autonomous R1 approval & settlement executed.',
      },
      erpPushResult: {
        erpType: 'QUICKBOOKS_ONLINE_SANDBOX',
        syncStatus: 'SUCCESS',
        qboBillId: `QBO-BILL-${8800 + idx}`,
        qboDocNumber: cfg.num,
        achReference: `ACH-CLR-202608-${9001 + idx}`,
        achBatchId: `BATCH-HDFC-991${idx}`,
        achTraceNumber: `07100028839100${idx}`,
        settledAmount: cfg.amount,
        currency: 'INR',
        timestamp: `2026-08-${15 + idx}T08:31:02Z`,
      },
      createdAt: `2026-08-${15 + idx}T08:30:00Z`,
      updatedAt: `2026-08-${15 + idx}T08:31:02Z`,
    };

    invoices.push(inv);
    groundTruth.push({
      invoiceId: cfg.id,
      invoiceNumber: cfg.num,
      vendorName: cfg.vendorName,
      amount: cfg.amount,
      is_duplicate: false,
      is_overpriced: false,
      is_forged: false,
      is_unusual: false,
      expected_route: 'R1_AUTO_PAY',
      expected_savings: 0,
      anomaly_description: 'Clean compliant low-value invoice matching PO and contract',
    });
  });

  // -------------------------------------------------------------
  // GENERATE ADDITIONAL BATCH OF ~190 INVOICES FOR FULL 200 DATASET
  // -------------------------------------------------------------
  const anomalyTemplates = [
    { type: 'CLEAN', prob: 0.65 },
    { type: 'OVERPRICED', prob: 0.15 },
    { type: 'NEAR_DUPLICATE', prob: 0.08 },
    { type: 'FORGED_METADATA', prob: 0.07 },
    { type: 'SPLIT_INVOICE', prob: 0.05 },
  ];

  for (let i = 10; i < 200; i++) {
    const invNum = `INV-${5000 + i}`;
    const vendorIdx = i % vendors.length;
    const vendor = vendors[vendorIdx];
    const isClean = i % 5 !== 0 && i % 7 !== 0;
    const isOverpriced = !isClean && i % 3 === 0;
    const isDuplicate = !isClean && i % 4 === 0;
    const isForged = !isClean && i % 5 === 0 && !isDuplicate;
    const isSplit = !isClean && i % 6 === 0;

    let amount = 15000 + (i * 370) % 75000;
    if (isSplit) amount = 49200; // Just under 50k split attempt
    if (isDuplicate) amount = 82000;

    const baseUnitPrice = 1250;
    const billedUnitPrice = isOverpriced ? Math.round(baseUnitPrice * 1.18) : baseUnitPrice;
    const qty = Math.max(1, Math.round(amount / billedUnitPrice));
    const finalAmount = qty * billedUnitPrice;

    const trustScore = isClean
      ? Math.min(100, Math.round(98 + (i % 3) * 0.8))
      : Math.round(20 + (i % 60));

    const routeDecision = (trustScore >= 98 && finalAmount <= 50000 && !vendor.isNewVendor)
      ? 'R1_AUTO_PAY'
      : 'R2_CFO_REVIEW';

    const status = routeDecision === 'R1_AUTO_PAY' ? 'PAID' : (isDuplicate || isForged ? 'FLAGGED' : 'RECEIVED');

      const synthFindings: AuditFindingItem[] = [];
      if (isDuplicate) {
        synthFindings.push({
          id: `af-dup-${5000 + i}`,
          invoiceId: `inv-${5000 + i}`,
          agentType: 'DUPLICATE_ENGINE',
          severity: 'CRITICAL',
          findingType: 'DUPLICATE_SUSPECTED',
          evidence: 'Fuzzy invoice hash match detected',
          dollarImpact: finalAmount,
          createdAt: '2026-08-22T08:05:00Z',
        });
      }
      if (isForged) {
        synthFindings.push({
          id: `af-forge-${5000 + i}`,
          invoiceId: `inv-${5000 + i}`,
          agentType: 'FORENSICS',
          severity: 'CRITICAL',
          findingType: 'FORENSIC_TAMPERING',
          evidence: 'Font substitution & altered vector layer detected',
          dollarImpact: finalAmount,
          createdAt: '2026-08-22T08:05:00Z',
        });
      }
      if (isOverpriced) {
        synthFindings.push({
          id: `af-price-${5000 + i}`,
          invoiceId: `inv-${5000 + i}`,
          agentType: 'AUDITOR_3WAY',
          severity: 'HIGH',
          findingType: 'CONTRACT_RATE_CREEP',
          evidence: 'Rate above locked contract price (+18%)',
          dollarImpact: (billedUnitPrice - baseUnitPrice) * qty,
          createdAt: '2026-08-22T08:05:00Z',
        });
      }

      const invRecord: InvoiceRecord = {
        id: `inv-${5000 + i}`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        rawInvoiceNumber: invNum,
        normalizedInvoiceNumber: invNum.toLowerCase(),
        amount: finalAmount,
        currency: 'INR',
        invoiceDate: `2026-08-22T08:00:00Z`,
        dueDate: `2026-09-22T08:00:00Z`,
        poNumber: `PO-2026-${800 + (i % 50)}`,
        rawFilePath: `/invoices/${invNum}_batch.pdf`,
        status,
        routeDecision,
        trustScore,
        duplicateProb: isDuplicate ? 0.95 : 0.02,
        forensicRisk: isForged ? 0.82 : 0.03,
        auditFindingCount: synthFindings.length,
        extractedJson: {
          header: {
            vendorName: vendor.name,
            taxId: vendor.taxId,
            invoiceNumber: invNum,
            date: '2026-08-22',
            bankDetails: {
              bankName: vendor.bankName,
              accountNumber: vendor.accountNumberMasked,
            },
            totalAmount: finalAmount,
            currency: 'INR',
          },
          lineItems: [
            {
              itemDescription: 'Standard Enterprise Procurement Item',
              canonicalItemKey: 'COMPUTE_K8S_NODE_HOUR_STD',
              category: 'INFRASTRUCTURE',
              quantity: qty,
              unitPrice: billedUnitPrice,
              totalPrice: finalAmount,
              unitOfMeasure: 'HR',
            },
          ],
        },
        forensicReport: {
          producerString: isForged ? 'Online PDF Editor' : 'Adobe PDF Library 21.1',
          expectedProducer: 'Adobe PDF Library 21.1',
          producerAnomaly: isForged,
          creationDate: '2026-08-22T07:30:00Z',
          modificationDate: '2026-08-22T07:30:00Z',
          dateMismatchAnomaly: isForged,
          embeddedFonts: isForged ? ['ArialMT'] : ['HelveticaNeue'],
          fontSubstitutionFlag: isForged,
          kerningInconsistencyScore: isForged ? 0.75 : 0.02,
          textVsRenderMismatch: isForged,
          overallForensicRisk: isForged ? 0.82 : 0.03,
          heuristicsTriggered: isForged ? ['HEURISTIC: FONT_SUBSTITUTION'] : [],
          notes: isForged ? 'Font substitution anomaly flagged' : 'Clean document',
        },
        agentFindings: synthFindings,
      scoreBreakdown: {
        finalScore: trustScore,
        duplicateWeight: 0.30,
        forensicWeight: 0.20,
        auditWeight: 0.20,
        priceWeight: 0.15,
        controlWeight: 0.15,
        signals: [
          { name: 'Duplicate Risk Engine', weight: 0.30, maxPoints: 30, pointsEarned: isDuplicate ? 5 : 30, deduction: isDuplicate ? 25 : 0, detail: isDuplicate ? 'Duplicate matched' : 'Clean' },
          { name: 'Forensic PDF Inspection', weight: 0.20, maxPoints: 20, pointsEarned: isForged ? 3 : 19.5, deduction: isForged ? 17 : 0.5, detail: isForged ? 'Font anomaly' : 'Clean' },
          { name: 'Auditor 3-Way Match', weight: 0.20, maxPoints: 20, pointsEarned: isOverpriced ? 4 : 20, deduction: isOverpriced ? 16 : 0, detail: isOverpriced ? 'Rate discrepancy' : 'Matched' },
          { name: 'Market Scout Benchmark', weight: 0.15, maxPoints: 15, pointsEarned: isOverpriced ? 3 : 15, deduction: isOverpriced ? 12 : 0, detail: isOverpriced ? 'Above market' : 'Fair market rate' },
          { name: 'Control Flags & Vendor Tier', weight: 0.15, maxPoints: 15, pointsEarned: routeDecision === 'R1_AUTO_PAY' ? 14.5 : 8, deduction: routeDecision === 'R1_AUTO_PAY' ? 0.5 : 7, detail: 'Threshold check' },
        ],
        summaryNote: isClean ? 'Automated validation passed' : 'Discrepancies identified during pipeline run',
      },
      erpPushResult: routeDecision === 'R1_AUTO_PAY' ? {
        erpType: 'QUICKBOOKS_ONLINE_SANDBOX',
        syncStatus: 'SUCCESS',
        qboBillId: `QBO-BILL-${9000 + i}`,
        qboDocNumber: invNum,
        achReference: `ACH-CLR-202608-${9500 + i}`,
        achBatchId: `BATCH-AUTO-${i}`,
        achTraceNumber: `07100099${i}`,
        settledAmount: finalAmount,
        currency: 'INR',
        timestamp: '2026-08-22T08:06:00Z',
      } : undefined,
      exceptionReasons: routeDecision === 'R2_CFO_REVIEW' ? [
        ...(isDuplicate ? ['Duplicate invoice collision'] : []),
        ...(isForged ? ['Tampered PDF structure and font substitution'] : []),
        ...(isOverpriced ? ['Billed rate exceeds approved contract rate'] : []),
        ...(finalAmount > 50000 ? ['Amount exceeds ₹50,000 auto-pay limit'] : []),
      ] : undefined,
      createdAt: '2026-08-22T08:00:00Z',
      updatedAt: '2026-08-22T08:06:00Z',
    };

    invoices.push(invRecord);
    groundTruth.push({
      invoiceId: `inv-${5000 + i}`,
      invoiceNumber: invNum,
      vendorName: vendor.name,
      amount: finalAmount,
      is_duplicate: isDuplicate,
      is_overpriced: isOverpriced,
      is_forged: isForged,
      is_unusual: isSplit || vendor.isNewVendor,
      expected_route: routeDecision,
      expected_savings: isOverpriced ? (billedUnitPrice - baseUnitPrice) * qty : (isDuplicate ? finalAmount : 0),
      anomaly_description: isClean ? 'Clean invoice' : 'Planted synthetic anomaly',
    });
  }

  return {
    vendors,
    contracts,
    purchaseOrders,
    marketPrices,
    invoices,
    groundTruth,
  };
}
