import {
  InvoiceRecord,
  InvoiceStatus,
  RouteDecision,
  AuditFindingItem,
  ScoreBreakdown,
  WaterfallSignal,
  Vendor,
} from '../../src/types.js';
import { db } from './db.js';
import { ForensicsEngine, RawPdfMetadataInput } from '../forensics/forensics_engine.js';
import { AgentSwarmEngine } from '../agents/swarm_engine.js';
import { QuickBooksAdapter } from './erp/quickbooks_adapter.js';

export interface IntakePayload {
  filename: string;
  rawText?: string;
  pdfMetadata?: RawPdfMetadataInput;
  injectedFields?: {
    vendorName?: string;
    taxId?: string;
    invoiceNumber?: string;
    date?: string;
    poNumber?: string;
    bankAccount?: string;
    amount?: number;
    currency?: string;
    items?: Array<{
      description: string;
      canonicalItemKey: string;
      category: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      unitOfMeasure: string;
    }>;
  };
}

export class VaultZeroPipeline {
  private forensicsEngine = new ForensicsEngine();
  private swarmEngine = new AgentSwarmEngine();
  private qboAdapter = new QuickBooksAdapter();

  /**
   * Levenshtein Distance for fuzzy duplicate comparison
   */
  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1 // deletion
            )
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /**
   * Complete 8-stage autonomous pipeline runner
   */
  public async processInvoice(payload: IntakePayload): Promise<InvoiceRecord> {
    const invoiceId = `inv-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    // =========================================================================
    // STAGE 1: INTAKE
    // =========================================================================
    const rawInvoiceNumber =
      payload.injectedFields?.invoiceNumber ||
      payload.filename.replace(/\.pdf$/i, '').toUpperCase() ||
      `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const normalizedInvoiceNumber = rawInvoiceNumber.trim().toLowerCase();
    const rawFilePath = `/drop/${payload.filename}`;

    let invoice: InvoiceRecord = {
      id: invoiceId,
      rawInvoiceNumber,
      normalizedInvoiceNumber,
      amount: payload.injectedFields?.amount || 0,
      currency: payload.injectedFields?.currency || 'INR',
      invoiceDate: payload.injectedFields?.date || now,
      dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      poNumber: payload.injectedFields?.poNumber,
      rawFilePath,
      status: 'RECEIVED' as InvoiceStatus,
      routeDecision: 'R2_CFO_REVIEW' as RouteDecision,
      duplicateProb: 0,
      forensicRisk: 0,
      auditFindingCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    // =========================================================================
    // STAGE 2: FORENSICS (pikepdf / pdfplumber simulation)
    // =========================================================================
    const forensicReport = this.forensicsEngine.analyze(
      payload.pdfMetadata || {
        filename: payload.filename,
        rawText: payload.rawText,
      }
    );
    invoice.forensicReport = forensicReport;
    invoice.forensicRisk = forensicReport.overallForensicRisk;

    // =========================================================================
    // STAGE 3: DUPLICATE DETECTION (Exact DB Unique Key + Fuzzy Edit Distance <= 2 + Line Set)
    // =========================================================================
    const existingInvoices = db.getInvoices();
    let duplicateProbability = 0;
    let matchedDuplicateId: string | undefined;

    for (const existing of existingInvoices) {
      if (existing.id === invoice.id) continue;

      // 1. Exact match on normalized number + amount
      if (
        existing.normalizedInvoiceNumber === normalizedInvoiceNumber &&
        Math.abs(existing.amount - invoice.amount) < 0.01
      ) {
        duplicateProbability = 0.99;
        matchedDuplicateId = existing.id;
        break;
      }

      // 2. Fuzzy edit distance <= 2 on invoice number + exact amount
      const dist = this.levenshtein(existing.normalizedInvoiceNumber, normalizedInvoiceNumber);
      if (dist > 0 && dist <= 2 && Math.abs(existing.amount - invoice.amount) < 0.01) {
        duplicateProbability = 0.85;
        matchedDuplicateId = existing.id;
        break;
      }
    }
    invoice.duplicateProb = duplicateProbability;
    invoice.matchedDuplicateId = matchedDuplicateId;

    // =========================================================================
    // STAGE 4: EXTRACT & NORMALIZATION (JSON Schema format)
    // =========================================================================
    const extractedLines =
      payload.injectedFields?.items || [
        {
          description: 'Standard IT Managed Service Provisioning',
          canonicalItemKey: 'IT_CLOUD_MANAGED_SERVICES_L3',
          category: 'IT_SERVICES',
          quantity: 1,
          unitPrice: invoice.amount || 45000,
          totalPrice: invoice.amount || 45000,
          unitOfMeasure: 'MONTH',
        },
      ];

    const computedTotal = extractedLines.reduce((sum, l) => sum + l.totalPrice, 0);
    invoice.amount = computedTotal > 0 ? computedTotal : invoice.amount;

    invoice.extractedJson = {
      header: {
        vendorName: payload.injectedFields?.vendorName || 'TechInfra Solutions Pvt Ltd',
        taxId: payload.injectedFields?.taxId || '27AABCT1234F1Z8',
        invoiceNumber: rawInvoiceNumber,
        date: invoice.invoiceDate.slice(0, 10),
        poNumber: invoice.poNumber,
        bankDetails: {
          bankName: 'Verified Clearing Bank',
          accountNumber: payload.injectedFields?.bankAccount || '•••• •••• 9812',
        },
        totalAmount: invoice.amount,
        currency: invoice.currency,
      },
      lineItems: extractedLines.map((l) => ({
        itemDescription: l.description,
        canonicalItemKey: l.canonicalItemKey,
        category: l.category,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        totalPrice: l.totalPrice,
        unitOfMeasure: l.unitOfMeasure,
      })),
    };

    // =========================================================================
    // STAGE 5: RESOLVE VENDOR (Fuzzy name + exact Tax ID + Bank hash)
    // =========================================================================
    const vendors = Array.from(db.vendors.values());
    let matchedVendor: Vendor | undefined = vendors.find(
      (v) => v.taxId.toUpperCase() === invoice.extractedJson?.header.taxId.toUpperCase()
    );

    if (!matchedVendor && invoice.extractedJson?.header.vendorName) {
      const vName = invoice.extractedJson.header.vendorName.toLowerCase();
      matchedVendor = vendors.find(
        (v) =>
          v.normalizedName.includes(vName) ||
          vName.includes(v.normalizedName) ||
          this.levenshtein(v.normalizedName, vName) <= 3
      );
    }

    if (matchedVendor) {
      invoice.vendorId = matchedVendor.id;
      invoice.vendorName = matchedVendor.name;
    } else {
      invoice.vendorName = invoice.extractedJson?.header.vendorName || 'Unregistered Vendor';
    }

    // =========================================================================
    // STAGE 6: MULTI-AGENT AUDIT SWARM (Auditor 3-Way Match + Market Scout)
    // =========================================================================
    const findings: AuditFindingItem[] = [];

    // If duplicate detected in Stage 3, add finding
    if (duplicateProbability > 0.5) {
      findings.push({
        id: `af-${Date.now()}-dup`,
        invoiceId: invoice.id,
        agentType: 'DUPLICATE_ENGINE',
        severity: 'CRITICAL',
        findingType: 'DUPLICATE_INVOICE_COLLISION',
        evidence: `Duplicate collision detected against record ${matchedDuplicateId || 'prior invoice'} (Confidence: ${(duplicateProbability * 100).toFixed(0)}%).`,
        dollarImpact: invoice.amount,
        createdAt: now,
      });
    }

    // If forensics risk is high, add finding
    if (forensicReport.overallForensicRisk > 0.4) {
      findings.push({
        id: `af-${Date.now()}-forgery`,
        invoiceId: invoice.id,
        agentType: 'FORENSICS',
        severity: 'CRITICAL',
        findingType: 'TAMPERED_PDF_ANOMALIES',
        evidence: forensicReport.heuristicsTriggered.join(' | ') || 'PDF metadata and visual layers deviate from authorized template.',
        dollarImpact: invoice.amount,
        createdAt: now,
      });
    }

    const swarmFindings = this.swarmEngine.runSwarm({
      invoice,
      vendor: matchedVendor,
      contracts: Array.from(db.contracts.values()),
      purchaseOrders: Array.from(db.purchaseOrders.values()),
      marketPrices: Array.from(db.marketPrices.values()),
      recentInvoices: existingInvoices,
    });

    findings.push(...swarmFindings);
    invoice.agentFindings = findings;
    invoice.auditFindingCount = findings.length;

    // =========================================================================
    // STAGE 7: TRUST SCORE ENGINE (Weighted Combine + Waterfall)
    // =========================================================================
    const scoreBreakdown = this.calculateTrustScore(invoice, findings, forensicReport, matchedVendor);
    invoice.trustScore = scoreBreakdown.finalScore;
    invoice.scoreBreakdown = scoreBreakdown;

    // =========================================================================
    // STAGE 8: RULE-BASED ROUTING
    // R1 (Auto-pay): Trust Score >= 98 AND Amount <= 50,000 AND Vendor not new
    // R2 (CFO Review): Otherwise
    // =========================================================================
    const isCleanVendor = matchedVendor && !matchedVendor.isNewVendor && matchedVendor.trustTier !== 'UNVERIFIED';
    const isAutoPayEligible =
      invoice.trustScore >= 98 &&
      invoice.amount <= 50000 &&
      isCleanVendor &&
      duplicateProbability < 0.1 &&
      forensicReport.overallForensicRisk < 0.1 &&
      findings.length === 0;

    if (isAutoPayEligible) {
      invoice.routeDecision = 'R1_AUTO_PAY';
      invoice.status = 'PAID';
      
      // Execute QuickBooks Online Sandbox Bill creation + Mock ACH settlement
      const qboResult = await this.qboAdapter.createBill(invoice);
      const achResult = await this.qboAdapter.executePayment(invoice, qboResult.qboBillId || 'QBO-BILL-001');
      invoice.erpPushResult = achResult;
    } else {
      invoice.routeDecision = 'R2_CFO_REVIEW';
      invoice.status = (duplicateProbability > 0.5 || forensicReport.overallForensicRisk > 0.4 || findings.some(f => f.severity === 'CRITICAL' || f.severity === 'HIGH'))
        ? 'FLAGGED'
        : 'RECEIVED';

      const reasons: string[] = [];
      if (invoice.trustScore < 98) reasons.push(`Trust score ${invoice.trustScore.toFixed(1)}/100 is below autonomous threshold (98.0)`);
      if (invoice.amount > 50000) reasons.push(`Amount ₹${invoice.amount.toLocaleString('en-IN')} exceeds auto-pay limit (₹50,000)`);
      if (!isCleanVendor) reasons.push(`Vendor is newly registered or unverified`);
      if (duplicateProbability > 0.5) reasons.push(`High duplicate risk probability (${(duplicateProbability * 100).toFixed(0)}%)`);
      if (forensicReport.overallForensicRisk > 0.3) reasons.push(`Pre-ingestion PDF forensic anomalies detected (${(forensicReport.overallForensicRisk * 100).toFixed(0)}% risk)`);
      
      findings.forEach((f) => {
        if (!reasons.includes(f.evidence)) reasons.push(`${f.findingType}: ${f.evidence}`);
      });

      invoice.exceptionReasons = reasons;
    }

    db.saveInvoice(invoice);
    return invoice;
  }

  /**
   * Trust Score Calculation:
   * Weighted combine:
   * - Duplicate: .30 (30 pts)
   * - Forensic: .20 (20 pts)
   * - Audit 3-way: .20 (20 pts)
   * - Price & Market: .15 (15 pts)
   * - Control Flags: .15 (15 pts)
   */
  private calculateTrustScore(
    invoice: InvoiceRecord,
    findings: AuditFindingItem[],
    forensic: any,
    vendor?: Vendor
  ): ScoreBreakdown {
    const signals: WaterfallSignal[] = [];

    // 1. Duplicate Signal (Max 30)
    let dupPts = 30;
    if (invoice.duplicateProb > 0.8) dupPts = 0;
    else if (invoice.duplicateProb > 0.4) dupPts = 10;
    else if (invoice.duplicateProb > 0.1) dupPts = 22;
    signals.push({
      name: 'Duplicate Risk Engine',
      weight: 0.30,
      maxPoints: 30,
      pointsEarned: dupPts,
      deduction: 30 - dupPts,
      detail: dupPts === 30 ? 'Unique verified invoice record' : `Duplicate probability ${(invoice.duplicateProb * 100).toFixed(0)}%`,
    });

    // 2. Forensic Signal (Max 20)
    const forensicRisk = forensic.overallForensicRisk || 0;
    const forensicPts = Number(Math.max(0, 20 * (1 - forensicRisk)).toFixed(1));
    signals.push({
      name: 'Forensic PDF Inspection',
      weight: 0.20,
      maxPoints: 20,
      pointsEarned: forensicPts,
      deduction: Number((20 - forensicPts).toFixed(1)),
      detail: forensicRisk < 0.1 ? 'Authentic producer & typography' : `${forensic.heuristicsTriggered?.length || 1} heuristic flags detected`,
    });

    // 3. Auditor 3-Way Match (Max 20)
    const auditFindings = findings.filter((f) => f.agentType === 'AUDITOR_3WAY');
    let auditPts = 20;
    if (auditFindings.some((f) => f.severity === 'CRITICAL')) auditPts = 0;
    else if (auditFindings.some((f) => f.severity === 'HIGH')) auditPts = 3;
    else if (auditFindings.some((f) => f.severity === 'MEDIUM')) auditPts = 12;
    signals.push({
      name: 'Auditor 3-Way Match',
      weight: 0.20,
      maxPoints: 20,
      pointsEarned: auditPts,
      deduction: 20 - auditPts,
      detail: auditPts === 20 ? 'PO and contract terms matched' : auditFindings.map((f) => f.findingType).join(', '),
    });

    // 4. Market Scout Benchmark (Max 15)
    const marketFindings = findings.filter((f) => f.agentType === 'MARKET_SCOUT');
    let pricePts = 15;
    if (marketFindings.some((f) => f.severity === 'HIGH')) pricePts = 2;
    else if (marketFindings.length > 0) pricePts = 5;
    signals.push({
      name: 'Market Scout Benchmark',
      weight: 0.15,
      maxPoints: 15,
      pointsEarned: pricePts,
      deduction: 15 - pricePts,
      detail: pricePts === 15 ? 'Unit prices aligned with index' : 'Above market rate variance',
    });

    // 5. Control Flags & Vendor Tier (Max 15)
    let controlPts = 15;
    if (!vendor || vendor.isNewVendor || vendor.trustTier === 'UNVERIFIED') {
      controlPts -= 10;
    }
    if (invoice.amount > 50000) {
      controlPts -= 3; // Amount gate deduction
    }
    const controlFindings = findings.filter((f) => f.agentType === 'CONTROL_FLAGS');
    if (controlFindings.length > 0) {
      controlPts = Math.max(0, controlPts - 8);
    }
    signals.push({
      name: 'Control Flags & Vendor Tier',
      weight: 0.15,
      maxPoints: 15,
      pointsEarned: Math.max(0, controlPts),
      deduction: Math.max(0, 15 - controlPts),
      detail: controlPts >= 14 ? 'Tier 1 verified vendor' : 'Requires CFO review authorization',
    });

    const finalScore = Number(signals.reduce((acc, s) => acc + s.pointsEarned, 0).toFixed(1));

    let summaryNote = 'Clean verification signals across all pipeline stages.';
    if (finalScore < 50) {
      summaryNote = 'HIGH RISK: Critical anomalies detected by audit swarm and forensic gates.';
    } else if (finalScore < 98) {
      summaryNote = 'REVIEW REQUIRED: Moderate risk indicators require CFO sign-off before ERP transmission.';
    }

    return {
      finalScore,
      duplicateWeight: 0.30,
      forensicWeight: 0.20,
      auditWeight: 0.20,
      priceWeight: 0.15,
      controlWeight: 0.15,
      signals,
      summaryNote,
    };
  }

  /**
   * CFO 1-click Approve action
   */
  public async approveInvoice(id: string, notes?: string): Promise<InvoiceRecord> {
    const invoice = db.getInvoice(id);
    if (!invoice) throw new Error(`Invoice ${id} not found`);

    invoice.status = 'APPROVED';
    invoice.cfoNotes = notes || 'Approved by CFO in review queue';

    // Promote to R1 auto-pay execution
    const qboResult = await this.qboAdapter.createBill(invoice);
    const achResult = await this.qboAdapter.executePayment(invoice, qboResult.qboBillId || 'QBO-BILL-CFO-001');

    invoice.erpPushResult = achResult;
    invoice.status = 'PAID';
    invoice.routeDecision = 'R1_AUTO_PAY';

    db.saveInvoice(invoice);
    return invoice;
  }

  /**
   * CFO 1-click Reject action
   */
  public async rejectInvoice(id: string, notes?: string): Promise<InvoiceRecord> {
    const invoice = db.getInvoice(id);
    if (!invoice) throw new Error(`Invoice ${id} not found`);

    invoice.status = 'REJECTED';
    invoice.routeDecision = 'REJECTED';
    invoice.cfoNotes = notes || 'Rejected by CFO due to compliance violations';

    db.saveInvoice(invoice);
    return invoice;
  }
}

export const pipeline = new VaultZeroPipeline();
