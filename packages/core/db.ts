import {
  Vendor,
  Contract,
  PurchaseOrder,
  MarketPrice,
  InvoiceRecord,
  GroundTruthRecord,
  PipelineMetrics,
} from '../../src/types.js';
import { generateSyntheticData } from '../datagen/generator.js';

class InMemoryDatabase {
  public vendors: Map<string, Vendor> = new Map();
  public contracts: Map<string, Contract> = new Map();
  public purchaseOrders: Map<string, PurchaseOrder> = new Map();
  public marketPrices: Map<string, MarketPrice> = new Map();
  public invoices: Map<string, InvoiceRecord> = new Map();
  public groundTruth: Map<string, GroundTruthRecord> = new Map();

  constructor() {
    this.seed();
  }

  public seed() {
    const dataset = generateSyntheticData();
    this.vendors.clear();
    this.contracts.clear();
    this.purchaseOrders.clear();
    this.marketPrices.clear();
    this.invoices.clear();
    this.groundTruth.clear();

    dataset.vendors.forEach((v) => this.vendors.set(v.id, v));
    dataset.contracts.forEach((c) => this.contracts.set(c.id, c));
    dataset.purchaseOrders.forEach((po) => this.purchaseOrders.set(po.id, po));
    dataset.marketPrices.forEach((mp) => this.marketPrices.set(mp.canonicalItemKey, mp));
    dataset.invoices.forEach((inv) => this.invoices.set(inv.id, inv));
    dataset.groundTruth.forEach((gt) => this.groundTruth.set(gt.invoiceId, gt));
  }

  public getInvoices(): InvoiceRecord[] {
    return Array.from(this.invoices.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getInvoice(id: string): InvoiceRecord | undefined {
    return this.invoices.get(id);
  }

  public saveInvoice(invoice: InvoiceRecord): InvoiceRecord {
    invoice.updatedAt = new Date().toISOString();
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  public getMetrics(): PipelineMetrics {
    const all = Array.from(this.invoices.values());
    const totalProcessed = all.length;
    const autoPaid = all.filter((i) => i.status === 'PAID' && i.routeDecision === 'R1_AUTO_PAY');
    const exceptions = all.filter((i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID');
    const flagged = all.filter((i) => i.status === 'FLAGGED');

    let identifiedSavings = 0;
    let duplicatesCaughtAmount = 0;

    all.forEach((inv) => {
      if (inv.duplicateProb > 0.5) {
        duplicatesCaughtAmount += inv.amount;
      }
      (inv.agentFindings || []).forEach((f) => {
        if (f.dollarImpact > 0 && f.agentType !== 'DUPLICATE_ENGINE') {
          identifiedSavings += f.dollarImpact;
        }
      });
    });

    const autoPaidPct = totalProcessed > 0 ? (autoPaid.length / totalProcessed) * 100 : 0;
    const avgCostPerInvoice = 0.90; // Static estimate ₹0.90 vs human manual processing of ₹120.00
    const humanReviewCostSaved = totalProcessed * 119.10;

    return {
      totalProcessed,
      autoPaidCount: autoPaid.length,
      autoPaidPct: Number(autoPaidPct.toFixed(1)),
      exceptionsCount: exceptions.length,
      flaggedCount: flagged.length,
      identifiedSavings: Math.round(identifiedSavings),
      duplicatesCaughtAmount: Math.round(duplicatesCaughtAmount),
      avgCostPerInvoice,
      humanReviewCostSaved: Math.round(humanReviewCostSaved),
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const db = new InMemoryDatabase();
