import {
  AuditFindingItem,
  Contract,
  PurchaseOrder,
  MarketPrice,
  Vendor,
  InvoiceRecord,
} from '../../src/types.js';

export interface SwarmContext {
  invoice: InvoiceRecord;
  vendor?: Vendor;
  contracts: Contract[];
  purchaseOrders: PurchaseOrder[];
  marketPrices: MarketPrice[];
  recentInvoices?: InvoiceRecord[];
}

export class AgentSwarmEngine {
  /**
   * Runs the multi-agent audit swarm over an extracted invoice.
   * Emits structured findings with { agentType, severity, findingType, evidence, dollarImpact }.
   */
  public runSwarm(ctx: SwarmContext): AuditFindingItem[] {
    const findings: AuditFindingItem[] = [];
    const { invoice, vendor, contracts, purchaseOrders, marketPrices, recentInvoices = [] } = ctx;
    const lines = invoice.extractedJson?.lineItems || [];
    const invTotal = invoice.amount;

    // =========================================================================
    // 1. AUDITOR AGENT: 3-Way Match & Contract Compliance & Split Invoices
    // =========================================================================
    if (invoice.poNumber) {
      const matchedPo = purchaseOrders.find(
        (po) => po.poNumber.toUpperCase() === invoice.poNumber?.toUpperCase()
      );

      if (matchedPo) {
        if (matchedPo.status === 'CLOSED') {
          findings.push({
            id: `af-${Date.now()}-po-closed`,
            invoiceId: invoice.id,
            agentType: 'AUDITOR_3WAY',
            severity: 'HIGH',
            findingType: 'PO_ALREADY_CLOSED',
            evidence: `Referenced ${matchedPo.poNumber} was already marked CLOSED upon earlier settlement.`,
            dollarImpact: invTotal,
            createdAt: new Date().toISOString(),
          });
        }

        if (invTotal > matchedPo.approvedTotalAmount * 1.02) {
          const delta = invTotal - matchedPo.approvedTotalAmount;
          findings.push({
            id: `af-${Date.now()}-po-overspend`,
            invoiceId: invoice.id,
            agentType: 'AUDITOR_3WAY',
            severity: 'HIGH',
            findingType: 'PO_TOTAL_AMOUNT_EXCEEDED',
            evidence: `Invoiced amount ₹${invTotal.toLocaleString('en-IN')} exceeds PO authorized total of ₹${matchedPo.approvedTotalAmount.toLocaleString('en-IN')} by ₹${delta.toLocaleString('en-IN')}.`,
            dollarImpact: delta,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Missing PO
        findings.push({
          id: `af-${Date.now()}-po-missing`,
          invoiceId: invoice.id,
          agentType: 'AUDITOR_3WAY',
          severity: 'MEDIUM',
          findingType: 'PURCHASE_ORDER_NOT_FOUND',
          evidence: `Referenced PO "${invoice.poNumber}" does not exist in the ERP master PO database.`,
          dollarImpact: invTotal,
          createdAt: new Date().toISOString(),
        });
      }
    } else if (invTotal > 50000) {
      findings.push({
        id: `af-${Date.now()}-no-po`,
        invoiceId: invoice.id,
        agentType: 'AUDITOR_3WAY',
        severity: 'HIGH',
        findingType: 'MISSING_PURCHASE_ORDER',
        evidence: `Invoice of ₹${invTotal.toLocaleString('en-IN')} lacks an attached Purchase Order number for pre-authorization.`,
        dollarImpact: invTotal,
        createdAt: new Date().toISOString(),
      });
    }

    // Line-level 3-way match & Contract Rate-Creep
    for (const line of lines) {
      const matchedContract = contracts.find(
        (c) => c.canonicalItemKey === line.canonicalItemKey || c.vendorId === invoice.vendorId
      );

      if (matchedContract) {
        if (line.unitPrice > matchedContract.agreedUnitPrice) {
          const markupPct = (
            ((line.unitPrice - matchedContract.agreedUnitPrice) / matchedContract.agreedUnitPrice) *
            100
          ).toFixed(2);
          const impact = (line.unitPrice - matchedContract.agreedUnitPrice) * line.quantity;

          findings.push({
            id: `af-${Date.now()}-rate-creep-${line.canonicalItemKey}`,
            invoiceId: invoice.id,
            agentType: 'AUDITOR_3WAY',
            severity: 'HIGH',
            findingType: 'CONTRACT_RATE_CREEP',
            evidence: `Unit rate ₹${line.unitPrice.toLocaleString('en-IN')} violates locked contract ${matchedContract.contractNumber} rate of ₹${matchedContract.agreedUnitPrice.toLocaleString('en-IN')} (+${markupPct}% markup).`,
            dollarImpact: impact,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Split Invoice Pattern Detection (e.g. multiple ~₹49,000 invoices from same vendor in close window)
    const recentFromVendor = recentInvoices.filter(
      (r) => r.vendorId === invoice.vendorId && r.id !== invoice.id
    );
    const splitLike = recentFromVendor.filter(
      (r) => r.amount >= 45000 && r.amount <= 49999
    );
    if (invTotal >= 45000 && invTotal <= 49999 && splitLike.length > 0) {
      findings.push({
        id: `af-${Date.now()}-split-invoice`,
        invoiceId: invoice.id,
        agentType: 'AUDITOR_3WAY',
        severity: 'HIGH',
        findingType: 'SPLIT_INVOICE_PATTERN_SUSPECTED',
        evidence: `Multiple invoices issued just below the autonomous ₹50,000 threshold (Current: ₹${invTotal.toLocaleString('en-IN')}, Prior: ${splitLike.map(s => s.rawInvoiceNumber).join(', ')}).`,
        dollarImpact: invTotal,
        createdAt: new Date().toISOString(),
      });
    }

    // =========================================================================
    // 2. MARKET SCOUT AGENT: Unit Price vs Market Index Benchmark
    // =========================================================================
    for (const line of lines) {
      const marketItem = marketPrices.find((m) => m.canonicalItemKey === line.canonicalItemKey);
      if (marketItem) {
        const threshold = marketItem.benchmarkPrice * (1 + marketItem.tolerancePct / 100);
        if (line.unitPrice > threshold) {
          const deltaUnit = line.unitPrice - marketItem.benchmarkPrice;
          const overpayPct = ((deltaUnit / marketItem.benchmarkPrice) * 100).toFixed(1);
          const totalImpact = deltaUnit * line.quantity;
          const annualized = totalImpact * 12;

          findings.push({
            id: `af-${Date.now()}-market-overpay-${line.canonicalItemKey}`,
            invoiceId: invoice.id,
            agentType: 'MARKET_SCOUT',
            severity: 'MEDIUM',
            findingType: 'ABOVE_MARKET_INDEX',
            evidence: `Billed ₹${line.unitPrice.toLocaleString('en-IN')} is +${overpayPct}% above the regional benchmark ₹${marketItem.benchmarkPrice.toLocaleString('en-IN')}. Projected annualized overspend: ₹${annualized.toLocaleString('en-IN')}.`,
            dollarImpact: totalImpact,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // =========================================================================
    // 3. CONTROL FLAGS & VENDOR GOVERNANCE AGENT
    // =========================================================================
    if (vendor) {
      if (vendor.isNewVendor || vendor.trustTier === 'UNVERIFIED') {
        findings.push({
          id: `af-${Date.now()}-new-vendor`,
          invoiceId: invoice.id,
          agentType: 'CONTROL_FLAGS',
          severity: 'CRITICAL',
          findingType: 'NEW_UNVERIFIED_VENDOR',
          evidence: `Vendor "${vendor.name}" is newly registered (< 7 days) without verified historical billing pedigree.`,
          dollarImpact: invTotal,
          createdAt: new Date().toISOString(),
        });
      }

      // Bank account check
      const rawBankAcc = invoice.extractedJson?.header?.bankDetails?.accountNumber;
      if (rawBankAcc && !rawBankAcc.includes('••••') && !rawBankAcc.includes(vendor.accountNumberMasked.slice(-4))) {
        findings.push({
          id: `af-${Date.now()}-bank-mismatch`,
          invoiceId: invoice.id,
          agentType: 'CONTROL_FLAGS',
          severity: 'CRITICAL',
          findingType: 'CHANGED_BANK_ACCOUNT_DETAILS',
          evidence: `Beneficiary bank account on invoice does not match the verified master vendor record (${vendor.bankName} - ${vendor.accountNumberMasked}).`,
          dollarImpact: invTotal,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return findings;
  }
}
