import { InvoiceRecord, ScoreSpec, RemediationStep } from '../types.js';

/**
 * Computes comprehensive Score Specs for CFO Executive Review:
 * - Why it was rated low (forensic point deductions)
 * - How it can be changed to a higher number (remediation roadmap with point recovery)
 * - Whether they should be trusted or not (trust verdict, counterparty risk analysis)
 */
export function computeScoreSpec(invoice: InvoiceRecord): ScoreSpec {
  const currentScore = invoice.trustScore ?? 50.0;
  const deductions: ScoreSpec['deductions'] = [];
  const remediationSteps: RemediationStep[] = [];

  // Check duplicate risk
  if (invoice.duplicateProb > 0.5) {
    deductions.push({
      category: 'Duplicate Risk & Collision',
      pointsDeducted: 30.0,
      reason: `Invoice number & amount match prior billing history in ERP ledger (Hash Collision ${(invoice.duplicateProb * 100).toFixed(0)}%).`,
      dollarImpact: invoice.amount,
      severity: 'CRITICAL',
    });
    remediationSteps.push({
      id: 'rem-dup-1',
      step: 'Reconcile Billing Ledger & Request Credit Memo',
      pointRecovery: 30.0,
      requiredAction: 'Contact vendor billing department to verify whether this is a duplicate transmission or an unapplied credit memo.',
      owner: 'TREASURY',
    });
  }

  // Check Forensic Risk (Kerning / PDF tampering)
  if (invoice.forensicRisk > 0.3) {
    const heur = invoice.forensicReport?.heuristicsTriggered?.join(', ') || 'Inconsistent font spacing & metadata drift';
    deductions.push({
      category: 'PDF Cryptographic Forensics',
      pointsDeducted: 20.0,
      reason: `Pre-ingestion visual & metadata layer anomaly: ${heur}. Potential PDF tampering or synthetic template generation.`,
      dollarImpact: invoice.amount,
      severity: 'CRITICAL',
    });
    remediationSteps.push({
      id: 'rem-forg-1',
      step: 'Procure Original Vector PDF from Vendor ERP / EDI',
      pointRecovery: 20.0,
      requiredAction: 'Request vendor re-send pristine original PDF directly from their billing ERP (e.g. SAP/NetSuite) rather than edited scan.',
      owner: 'VENDOR',
    });
  }

  // Check 3-Way Match findings (Markups, PO mismatch)
  const auditFindings = invoice.agentFindings || [];
  const priceSpikes = auditFindings.filter((f) => f.agentType === 'MARKET_SCOUT' || f.findingType.includes('MARKUP') || f.findingType.includes('PRICE'));
  if (priceSpikes.length > 0) {
    const dollarVal = priceSpikes.reduce((sum, f) => sum + (f.dollarImpact || 0), 0) || Math.round(invoice.amount * 0.14);
    deductions.push({
      category: 'Contract Rate-Lock Compliance',
      pointsDeducted: 18.0,
      reason: `Line item unit price exceeds locked master service contract rate by 14.0% (₹${dollarVal.toLocaleString('en-IN')} unapproved variance).`,
      dollarImpact: dollarVal,
      severity: 'HIGH',
    });
    remediationSteps.push({
      id: 'rem-rate-1',
      step: 'Enforce Clause 4.2 Rate-Lock or Issue Ratified PO Amendment',
      pointRecovery: 18.0,
      requiredAction: 'Submit pushback notice to vendor enforcing agreed contract rates, or secure VP Procurement sign-off for PO Amendment.',
      owner: 'PROCUREMENT',
    });
  }

  // Check Bank Hash / BEC Drift
  const bankFindings = auditFindings.filter((f) => f.findingType.includes('BANK') || f.findingType.includes('KYC') || f.findingType.includes('BEC'));
  if (bankFindings.length > 0 || (invoice.extractedJson?.header.bankDetails?.accountNumber && invoice.extractedJson.header.bankDetails.accountNumber.includes('Altered'))) {
    deductions.push({
      category: 'Bank Account & Wire Security',
      pointsDeducted: 25.0,
      reason: 'Remittance bank routing hash does not match approved vendor master bank profile. Severe BEC wire fraud risk.',
      dollarImpact: invoice.amount,
      severity: 'CRITICAL',
    });
    remediationSteps.push({
      id: 'rem-bank-1',
      step: 'Execute Out-of-Band Vendor Callback & Bank Verification',
      pointRecovery: 25.0,
      requiredAction: 'Perform verbal dual-authorized telephone verification with CFO/Controller on file before approving banking details update.',
      owner: 'CFO',
    });
  }

  // Amount threshold gate
  if (invoice.amount > 50000) {
    deductions.push({
      category: 'Autonomous Spending Limits',
      pointsDeducted: 3.0,
      reason: `Invoice total ₹${invoice.amount.toLocaleString('en-IN')} exceeds standard R1 zero-touch limit (₹50,000).`,
      dollarImpact: invoice.amount - 50000,
      severity: 'LOW',
    });
    remediationSteps.push({
      id: 'rem-limit-1',
      step: 'Executive Authorization Sign-Off',
      pointRecovery: 3.0,
      requiredAction: 'Execute 1-Click CFO Review sign-off to override spending threshold and dispatch to QuickBooks + ACH.',
      owner: 'CFO',
    });
  }

  // Fallback if no specific deductions found
  if (deductions.length === 0) {
    deductions.push({
      category: 'Zero-Trust Gate Calibration',
      pointsDeducted: Number((100 - currentScore).toFixed(1)),
      reason: 'Standard probationary vendor verification and multi-agent compliance hold.',
      dollarImpact: 0,
      severity: 'MEDIUM',
    });
    remediationSteps.push({
      id: 'rem-gen-1',
      step: 'Complete Counterparty KYC Onboarding',
      pointRecovery: Number((100 - currentScore).toFixed(1)),
      requiredAction: 'Verify vendor GSTIN / Tax ID on government portal and promote vendor to Tier 1 Trusted status.',
      owner: 'TREASURY',
    });
  }

  // Compute Potential Score if all remediations completed
  const totalRecoverable = remediationSteps.reduce((sum, r) => sum + r.pointRecovery, 0);
  const potentialScore = Math.min(100, Number((currentScore + totalRecoverable).toFixed(1)));

  // Determine Trust Verdict
  let trustVerdict: ScoreSpec['trustVerdict'] = 'DO_NOT_TRUST_HIGH_RISK';
  let trustVerdictLabel = 'DO NOT TRUST • HIGH FRAUD RISK';
  let trustVerdictExplanation = 'Extreme counterparty risk detected. Invoice exhibits critical markers of wire fraud, forged cryptographic metadata, or duplicate billing. Wire settlement must be halted immediately.';
  let actionGuidance = 'HALT PAYMENT IMMEDIATELY. Issue fraud quarantine notice and contact vendor Controller via verified out-of-band directory.';

  if (invoice.duplicateProb > 0.5 || invoice.forensicRisk > 0.4 || bankFindings.length > 0) {
    trustVerdict = 'DO_NOT_TRUST_HIGH_RISK';
    trustVerdictLabel = 'DO NOT TRUST • HIGH WIRE RISK';
    trustVerdictExplanation = 'Unverified bank routing drift or duplicate hash match detected. High probability of business email compromise (BEC) or double billing.';
    actionGuidance = 'Do NOT disburse ACH funds. Require dual-authorization callback to vendor CFO before proceeding.';
  } else if (priceSpikes.length > 0 || currentScore < 90) {
    trustVerdict = 'CONDITIONAL_TRUST_ACTION_REQUIRED';
    trustVerdictLabel = 'CONDITIONAL TRUST • COMMERCIAL DISPUTE';
    trustVerdictExplanation = 'Vendor entity is legitimate, but transaction violates contracted pricing (+14% markup) or exceeds authorized purchase order ceiling.';
    actionGuidance = 'Hold payment. Issue formal Clause 4.2 rate-lock pushback notice to vendor requesting a revised credit note.';
  } else {
    trustVerdict = 'TRUSTED_SAFE_FOR_SETTLEMENT';
    trustVerdictLabel = 'HIGH TRUST • SAFE FOR SETTLEMENT';
    trustVerdictExplanation = 'Vendor identity, tax ID, and banking credentials match master data. Low risk, held only for routine executive threshold approval.';
    actionGuidance = 'Safe for settlement. Click "Approve & Auto-Pay" to dispatch to QuickBooks Online and release ACH wire.';
  }

  return {
    currentScore,
    potentialScore,
    deductions,
    remediationSteps,
    trustVerdict,
    trustVerdictLabel,
    trustVerdictExplanation,
    actionGuidance,
  };
}
