import { InvoiceRecord, ErpPushResult } from '../../../src/types.js';

export interface ErpAdapter {
  readonly name: string;
  readonly isConnected: boolean;

  /**
   * Pushes an approved invoice into the target ERP as a Bill.
   */
  createBill(invoice: InvoiceRecord): Promise<ErpPushResult>;

  /**
   * Executes settlement via the simulated banking rails (Mock ACH / NACHA).
   */
  executePayment(invoice: InvoiceRecord, billId: string): Promise<ErpPushResult>;
}
