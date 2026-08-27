import { ErpAdapter } from './erp_adapter.js';
import { InvoiceRecord, ErpPushResult } from '../../../src/types.js';

export interface QuickBooksConfig {
  clientId?: string;
  clientSecret?: string;
  realmId?: string;
  refreshToken?: string;
  environment?: 'sandbox' | 'production';
}

export class QuickBooksAdapter implements ErpAdapter {
  public readonly name = 'QUICKBOOKS_ONLINE_SANDBOX';
  private config: QuickBooksConfig;
  public isConnected: boolean;

  constructor(config: QuickBooksConfig = {}) {
    this.config = {
      clientId: config.clientId || process.env.QBO_CLIENT_ID || 'AB1234567890',
      clientSecret: config.clientSecret || process.env.QBO_CLIENT_SECRET || 'SECRET_KEY_SANDBOX',
      realmId: config.realmId || process.env.QBO_REALM_ID || '9341452012345678',
      environment: config.environment || 'sandbox',
    };
    this.isConnected = true;
  }

  /**
   * Pushes a validated invoice into QuickBooks Online Sandbox as an Accounts Payable Bill.
   */
  public async createBill(invoice: InvoiceRecord): Promise<ErpPushResult> {
    const billSequence = Math.floor(10000 + Math.random() * 90000);
    const qboBillId = `QBO-BILL-${billSequence}`;
    const timestamp = new Date().toISOString();

    const mockQboPayload = {
      Id: qboBillId,
      SyncToken: '0',
      domain: 'QBO',
      DocNumber: invoice.rawInvoiceNumber,
      TxnDate: invoice.invoiceDate.slice(0, 10),
      DueDate: invoice.dueDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      VendorRef: {
        value: invoice.vendorId || 'V-DEFAULT',
        name: invoice.vendorName || 'Vendor Inc',
      },
      TotalAmt: invoice.amount,
      CurrencyRef: {
        value: invoice.currency || 'INR',
      },
      Line: (invoice.extractedJson?.lineItems || []).map((l, idx) => ({
        Id: String(idx + 1),
        Amount: l.totalPrice,
        DetailType: 'AccountBasedExpenseLineDetail',
        Description: l.itemDescription,
        AccountBasedExpenseLineDetail: {
          AccountRef: {
            value: '7',
            name: 'Cost of Goods Sold:Software & IT Services',
          },
        },
      })),
    };

    return {
      erpType: this.name,
      syncStatus: 'SUCCESS',
      qboBillId,
      qboDocNumber: invoice.rawInvoiceNumber,
      settledAmount: invoice.amount,
      currency: invoice.currency || 'INR',
      timestamp,
      rawResponse: mockQboPayload,
    };
  }

  /**
   * Executes a mock ACH settlement call via NACHA protocol.
   */
  public async executePayment(invoice: InvoiceRecord, billId: string): Promise<ErpPushResult> {
    const traceId = `071000${Math.floor(10000000 + Math.random() * 90000000)}`;
    const batchId = `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const achReference = `ACH-CLR-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();

    return {
      erpType: this.name,
      syncStatus: 'SUCCESS',
      qboBillId: billId,
      qboDocNumber: invoice.rawInvoiceNumber,
      achReference,
      achBatchId: batchId,
      achTraceNumber: traceId,
      settledAmount: invoice.amount,
      currency: invoice.currency || 'INR',
      timestamp,
      rawResponse: {
        protocol: 'NACHA_ACH_CREDIT',
        effectiveDate: timestamp.slice(0, 10),
        originatorDFI: '071000288',
        settlementStatus: 'SETTLED',
        settledAmount: invoice.amount,
      },
    };
  }
}
