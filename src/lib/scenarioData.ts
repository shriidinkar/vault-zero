import { InvoiceRecord, PipelineMetrics, PurchaseOrder, Vendor, AuditFindingItem, RouteDecision } from '../types.js';
import { generateSyntheticData } from '../../packages/datagen/generator.js';

export type DatasetScenarioId = 'TECH_SAAS' | 'MANUFACTURING_FRAUD' | 'RETAIL_PRICE_DISPUTES' | 'ENTERPRISE_BALANCED';

export interface DatasetScenario {
  id: DatasetScenarioId;
  name: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  description: string;
  keyStats: { label: string; value: string }[];
  invoiceCount: number;
}

export const DATASET_SCENARIOS: DatasetScenario[] = [
  {
    id: 'TECH_SAAS',
    name: 'Tech & Cloud SaaS (Clean STP Flow)',
    badge: '96.2% Autobahn STP',
    badgeColor: 'emerald',
    tagline: 'Pristine cloud compute & SaaS subscriptions with zero-touch instant ACH settlements.',
    description: 'Simulates high-velocity recurring vendors (AWS Cloud, Snowflake, Google Workspace, TechInfra). Invoices match locked master purchase orders with clean PDF metadata.',
    keyStats: [
      { label: 'Autobahn Rate', value: '96.2%' },
      { label: 'Avg Trust Score', value: '98.9/100' },
      { label: 'Risk Value at Risk', value: '₹0' },
      { label: 'Avg Cycle Time', value: '4.2 seconds' },
    ],
    invoiceCount: 26,
  },
  {
    id: 'MANUFACTURING_FRAUD',
    name: 'Manufacturing & Hardware (BEC Attack & Quarantines)',
    badge: 'High Adversarial Risk',
    badgeColor: 'rose',
    tagline: 'Simulated adversarial attacks with altered bank routing numbers, tampered PDFs & duplicate spam.',
    description: 'Includes critical forensic flags: Font substitutions, bank account drift on unverified vendors (BEC attack), and collision hashes routed to Escrow Quarantine.',
    keyStats: [
      { label: 'Quarantined / Escrow', value: '8 Invoices' },
      { label: 'VaR Intercepted', value: '₹14,50,000' },
      { label: 'Tampered PDFs', value: '4 Detected' },
      { label: 'Autobahn Rate', value: '38.5%' },
    ],
    invoiceCount: 22,
  },
  {
    id: 'RETAIL_PRICE_DISPUTES',
    name: 'Retail & Sourcing (Contract Price Variance & PO Creep)',
    badge: 'Price Drift Alerts',
    badgeColor: 'amber',
    tagline: 'Discrepancy simulation with unit rate inflation (+18%) and quantity overages against master POs.',
    description: 'Invoices exhibit rate creep, missing PO attachments, and unapproved price hikes. Routed to R2 CFO Approval Queue with automated penalty audits.',
    keyStats: [
      { label: 'Rate Creep Caught', value: '₹3,40,000' },
      { label: 'CFO Approvals Queued', value: '11 Invoices' },
      { label: 'Avg Trust Score', value: '81.4/100' },
      { label: 'Autobahn Rate', value: '52.0%' },
    ],
    invoiceCount: 24,
  },
  {
    id: 'ENTERPRISE_BALANCED',
    name: 'Apex Global (Production Standard Mix)',
    badge: 'Enterprise Production',
    badgeColor: 'blue',
    tagline: 'Standard enterprise production mix with clean recurring spend, edge cases, and automated routing.',
    description: 'Realistic corporate baseline with a healthy distribution of R1 Autobahn execution, R2 CFO reviews for high amounts, and 3-way reconciliation.',
    keyStats: [
      { label: 'Autobahn Rate', value: '88.5%' },
      { label: 'Total Volume', value: '₹42.8 Lakhs' },
      { label: '3-Way Match Rate', value: '94.0%' },
      { label: 'Processed', value: '25 Invoices' },
    ],
    invoiceCount: 25,
  },
];

/**
 * Generate customized invoice records according to the selected scenario or custom inputs
 */
export function getInvoicesForScenario(scenarioId: DatasetScenarioId, customInvoices?: InvoiceRecord[]): InvoiceRecord[] {
  // If custom invoices provided and matches custom session, prepend or merge
  const baseData = generateSyntheticData();
  const rawInvoices = baseData.invoices;

  let transformed: InvoiceRecord[] = [];

  switch (scenarioId) {
    case 'TECH_SAAS': {
      // 95%+ Clean Invoices, high trust scores, R1 Auto Pay
      transformed = rawInvoices.map((inv, idx) => {
        const isException = idx === 3; // only 1 small exception
        const trustScore = isException ? 84.5 : Math.min(100, 98.4 + ((idx * 3) % 15) * 0.1);
        const routeDecision: RouteDecision = isException ? 'R2_CFO_REVIEW' : 'R1_AUTO_PAY';
        const status = isException ? 'RECEIVED' : 'PAID';

        return {
          ...inv,
          trustScore,
          routeDecision,
          status,
          duplicateProb: 0.01,
          forensicRisk: 0.02,
          auditFindingCount: isException ? 1 : 0,
          agentFindings: isException
            ? [
                {
                  id: `af-saas-${idx}`,
                  invoiceId: inv.id,
                  agentType: 'CONTROL_FLAGS',
                  severity: 'MEDIUM',
                  findingType: 'TIER_THRESHOLD_CHECK',
                  evidence: 'First-time software tier expansion exceeding ₹1,00,000 threshold',
                  dollarImpact: 15000,
                  createdAt: new Date().toISOString(),
                },
              ]
            : [],
        };
      });
      break;
    }

    case 'MANUFACTURING_FRAUD': {
      // Adversarial scenario: multiple tampered PDFs, BEC bank routing changes, duplicate attempts
      transformed = rawInvoices.map((inv, idx) => {
        const isTampered = idx % 3 === 0;
        const isBecAttack = idx === 1 || idx === 7;
        const isDuplicate = idx === 4 || idx === 10;
        const isClean = !isTampered && !isBecAttack && !isDuplicate;

        let trustScore = 99.0;
        let routeDecision: RouteDecision = 'R1_AUTO_PAY';
        let status: any = 'PAID';
        const findings: AuditFindingItem[] = [];

        if (isBecAttack) {
          trustScore = 32.0;
          routeDecision = 'R2_CFO_REVIEW';
          status = 'FLAGGED';
          findings.push({
            id: `af-bec-${idx}`,
            invoiceId: inv.id,
            agentType: 'FORENSICS',
            severity: 'CRITICAL',
            findingType: 'BEC_BANK_ROUTING_MUTATION',
            evidence: 'Remittance bank account hash altered from vendor master record (•••• 9999 vs •••• 9812)',
            dollarImpact: inv.amount,
            createdAt: new Date().toISOString(),
          });
        } else if (isTampered) {
          trustScore = 48.0;
          routeDecision = 'R2_CFO_REVIEW';
          status = 'FLAGGED';
          findings.push({
            id: `af-forge-${idx}`,
            invoiceId: inv.id,
            agentType: 'FORENSICS',
            severity: 'CRITICAL',
            findingType: 'PDF_STRUCTURE_TAMPERING',
            evidence: 'Font substitution (ArialMT replacing HelveticaNeue) & modified vector layer',
            dollarImpact: inv.amount,
            createdAt: new Date().toISOString(),
          });
        } else if (isDuplicate) {
          trustScore = 21.5;
          routeDecision = 'R2_CFO_REVIEW';
          status = 'FLAGGED';
          findings.push({
            id: `af-dup-${idx}`,
            invoiceId: inv.id,
            agentType: 'DUPLICATE_ENGINE',
            severity: 'CRITICAL',
            findingType: 'EXACT_HASH_COLLISION',
            evidence: 'Duplicate line-item hash previously settled on 2026-08-01',
            dollarImpact: inv.amount,
            createdAt: new Date().toISOString(),
          });
        }

        return {
          ...inv,
          trustScore,
          routeDecision,
          status,
          duplicateProb: isDuplicate ? 0.96 : 0.02,
          forensicRisk: isTampered || isBecAttack ? 0.88 : 0.04,
          auditFindingCount: findings.length,
          agentFindings: findings,
        };
      });
      break;
    }

    case 'RETAIL_PRICE_DISPUTES': {
      // Overpriced invoices, rate inflation (+18%), missing POs
      transformed = rawInvoices.map((inv, idx) => {
        const isRateCreep = idx % 2 === 0;
        const isMissingPo = idx % 5 === 0;
        const isClean = !isRateCreep && !isMissingPo;

        const trustScore = isClean ? 98.8 : isRateCreep ? 79.2 : 68.0;
        const routeDecision: RouteDecision = isClean ? 'R1_AUTO_PAY' : 'R2_CFO_REVIEW';
        const status: any = isClean ? 'PAID' : 'RECEIVED';
        const findings: AuditFindingItem[] = [];

        if (isRateCreep) {
          findings.push({
            id: `af-rate-${idx}`,
            invoiceId: inv.id,
            agentType: 'AUDITOR_3WAY',
            severity: 'HIGH',
            findingType: 'CONTRACT_RATE_INFLATION',
            evidence: 'Unit rate charged (₹950/unit) exceeds Master Agreement ceiling of ₹780/unit (+21.8%)',
            dollarImpact: Math.round(inv.amount * 0.18),
            createdAt: new Date().toISOString(),
          });
        }

        if (isMissingPo) {
          findings.push({
            id: `af-nopo-${idx}`,
            invoiceId: inv.id,
            agentType: 'AUDITOR_3WAY',
            severity: 'MEDIUM',
            findingType: 'UNMATCHED_PO_ORDER',
            evidence: 'Inbound invoice lacks pre-approved Purchase Order number in ERP requisition registry',
            dollarImpact: inv.amount,
            createdAt: new Date().toISOString(),
          });
        }

        return {
          ...inv,
          trustScore,
          routeDecision,
          status,
          duplicateProb: 0.02,
          forensicRisk: 0.05,
          auditFindingCount: findings.length,
          agentFindings: findings,
        };
      });
      break;
    }

    case 'ENTERPRISE_BALANCED':
    default: {
      transformed = rawInvoices;
      break;
    }
  }

  if (customInvoices && customInvoices.length > 0) {
    // Prepend custom injected invoices
    return [...customInvoices, ...transformed];
  }

  return transformed;
}

/**
 * Creates a custom test invoice to inject into the pipeline
 */
export function createCustomInvoice(input: {
  vendorName: string;
  amount: number;
  invoiceNumber?: string;
  poNumber?: string;
  hasTampering?: boolean;
  hasBecDrift?: boolean;
  hasRateDiscrepancy?: boolean;
  isDuplicate?: boolean;
}): InvoiceRecord {
  const invNum = input.invoiceNumber || `INV-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
  const findings: AuditFindingItem[] = [];

  let trustScore = 99.4;
  let duplicateProb = 0.02;
  let forensicRisk = 0.02;

  if (input.isDuplicate) {
    trustScore -= 60;
    duplicateProb = 0.94;
    findings.push({
      id: `af-cust-dup-${Date.now()}`,
      invoiceId: `inv-cust-${Date.now()}`,
      agentType: 'DUPLICATE_ENGINE',
      severity: 'CRITICAL',
      findingType: 'DUPLICATE_COLLISION',
      evidence: `Exact hash collision with prior invoice for ${input.vendorName}`,
      dollarImpact: input.amount,
      createdAt: new Date().toISOString(),
    });
  }

  if (input.hasTampering) {
    trustScore -= 45;
    forensicRisk = 0.85;
    findings.push({
      id: `af-cust-forge-${Date.now()}`,
      invoiceId: `inv-cust-${Date.now()}`,
      agentType: 'FORENSICS',
      severity: 'CRITICAL',
      findingType: 'PDF_TAMPERING_DETECTED',
      evidence: 'Font substitutions & modification timestamp mismatch in PDF structure',
      dollarImpact: input.amount,
      createdAt: new Date().toISOString(),
    });
  }

  if (input.hasBecDrift) {
    trustScore -= 50;
    forensicRisk = 0.92;
    findings.push({
      id: `af-cust-bec-${Date.now()}`,
      invoiceId: `inv-cust-${Date.now()}`,
      agentType: 'FORENSICS',
      severity: 'CRITICAL',
      findingType: 'BEC_ROUTING_MUTATION',
      evidence: 'Bank routing number does not match registered vendor master record',
      dollarImpact: input.amount,
      createdAt: new Date().toISOString(),
    });
  }

  if (input.hasRateDiscrepancy) {
    trustScore -= 20;
    findings.push({
      id: `af-cust-rate-${Date.now()}`,
      invoiceId: `inv-cust-${Date.now()}`,
      agentType: 'AUDITOR_3WAY',
      severity: 'HIGH',
      findingType: 'CONTRACT_RATE_VARIANCE',
      evidence: 'Unit price exceeds agreed master service contract by +18.5%',
      dollarImpact: Math.round(input.amount * 0.185),
      createdAt: new Date().toISOString(),
    });
  }

  trustScore = Math.max(5, Math.min(100, Math.round(trustScore * 10) / 10));
  const isAutoPay = trustScore >= 98.0 && input.amount <= 50000 && !input.hasTampering && !input.hasBecDrift && !input.isDuplicate;
  const routeDecision: RouteDecision = isAutoPay ? 'R1_AUTO_PAY' : 'R2_CFO_REVIEW';
  const status = isAutoPay ? 'PAID' : (trustScore < 70 ? 'FLAGGED' : 'RECEIVED');

  return {
    id: `inv-cust-${Date.now()}`,
    vendorId: `v-cust-${Math.floor(Math.random() * 100)}`,
    vendorName: input.vendorName,
    rawInvoiceNumber: invNum,
    normalizedInvoiceNumber: invNum.toLowerCase(),
    amount: input.amount,
    currency: 'INR',
    invoiceDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    poNumber: input.poNumber || (input.hasRateDiscrepancy ? 'PO-2026-9901' : 'PO-2026-8802'),
    rawFilePath: `/invoices/${invNum}.pdf`,
    status,
    routeDecision,
    trustScore,
    duplicateProb,
    forensicRisk,
    auditFindingCount: findings.length,
    extractedJson: {
      header: {
        vendorName: input.vendorName,
        taxId: '27AABCT9988Z1Z2',
        invoiceNumber: invNum,
        date: new Date().toISOString().split('T')[0],
        bankDetails: {
          bankName: input.hasBecDrift ? 'Altered Suspicious Bank LLC' : 'HDFC Bank Corporate',
          accountNumber: input.hasBecDrift ? '•••• •••• 9999' : '•••• •••• 4412',
        },
        totalAmount: input.amount,
        currency: 'INR',
      },
      lineItems: [
        {
          itemDescription: 'Custom Injected Procurement Service',
          canonicalItemKey: 'CUSTOM_LINE_ITEM',
          category: 'INFRASTRUCTURE',
          quantity: 1,
          unitPrice: input.amount,
          totalPrice: input.amount,
          unitOfMeasure: 'UNIT',
        },
      ],
    },
    forensicReport: {
      producerString: input.hasTampering ? 'Online PDF Editor Studio' : 'Adobe Acrobat Pro 2026',
      expectedProducer: 'Adobe Acrobat Pro 2026',
      producerAnomaly: !!input.hasTampering,
      creationDate: new Date().toISOString(),
      modificationDate: new Date().toISOString(),
      dateMismatchAnomaly: !!input.hasTampering,
      embeddedFonts: input.hasTampering ? ['ArialMT'] : ['HelveticaNeue'],
      fontSubstitutionFlag: !!input.hasTampering,
      kerningInconsistencyScore: input.hasTampering ? 0.85 : 0.01,
      textVsRenderMismatch: !!input.hasTampering,
      overallForensicRisk: forensicRisk,
      heuristicsTriggered: input.hasTampering ? ['FONT_SUBSTITUTION', 'METADATA_DISCREPANCY'] : [],
      notes: input.hasTampering ? 'Tampered vector structures intercepted' : 'Clean document',
    },
    agentFindings: findings,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
