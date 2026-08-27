import { InvoiceRecord, GroundTruthRecord, EvaluationMetrics } from '../../src/types.js';

export function runEvaluation(
  invoices: InvoiceRecord[],
  groundTruth: GroundTruthRecord[]
): EvaluationMetrics {
  const gtMap = new Map<string, GroundTruthRecord>();
  groundTruth.forEach((gt) => {
    gtMap.set(gt.invoiceNumber.toLowerCase(), gt);
    gtMap.set(gt.invoiceId, gt);
  });

  // Counters
  let dupTP = 0, dupFP = 0, dupFN = 0, dupTN = 0;
  let forgeTP = 0, forgeFP = 0, forgeFN = 0, forgeTN = 0;
  let priceTP = 0, priceFP = 0, priceFN = 0, priceTN = 0;
  let correctRoutes = 0;
  let r1TP = 0, r1FP = 0, r1FN = 0;
  let r2TP = 0, r2FP = 0, r2FN = 0;
  let totalSavingsIdentified = 0;

  invoices.forEach((inv) => {
    const gt = gtMap.get(inv.rawInvoiceNumber.toLowerCase()) || gtMap.get(inv.id);
    if (!gt) return;

    // 1. Duplicate detection (classified if duplicateProb > 0.5 or duplicate finding exists)
    const predDuplicate = inv.duplicateProb > 0.5 || (inv.agentFindings || []).some(f => f.agentType === 'DUPLICATE_ENGINE');
    if (gt.is_duplicate) {
      if (predDuplicate) {
        dupTP++;
        totalSavingsIdentified += inv.amount;
      } else {
        dupFN++;
      }
    } else {
      if (predDuplicate) {
        dupFP++;
      } else {
        dupTN++;
      }
    }

    // 2. Forgery detection (classified if forensicRisk > 0.4 or forensic critical finding exists)
    const predForged = inv.forensicRisk > 0.4 || (inv.agentFindings || []).some(f => f.agentType === 'FORENSICS');
    if (gt.is_forged) {
      if (predForged) {
        forgeTP++;
      } else {
        forgeFN++;
      }
    } else {
      if (predForged) {
        forgeFP++;
      } else {
        forgeTN++;
      }
    }

    // 3. Overpricing detection (classified if audit findings indicate markup/overprice or Market Scout flag)
    const predOverpriced = (inv.agentFindings || []).some(
      f => f.findingType.includes('MARKUP') || f.findingType.includes('RATE_CREEP') || f.findingType.includes('ABOVE_MARKET')
    );
    if (gt.is_overpriced) {
      if (predOverpriced) {
        priceTP++;
        const finding = (inv.agentFindings || []).find(f => f.dollarImpact > 0);
        if (finding) totalSavingsIdentified += finding.dollarImpact;
      } else {
        priceFN++;
      }
    } else {
      if (predOverpriced) {
        priceFP++;
      } else {
        priceTN++;
      }
    }

    // 4. Routing accuracy
    if (inv.routeDecision === gt.expected_route) {
      correctRoutes++;
    }

    if (gt.expected_route === 'R1_AUTO_PAY') {
      if (inv.routeDecision === 'R1_AUTO_PAY') r1TP++;
      else r1FN++;
    } else {
      if (inv.routeDecision === 'R1_AUTO_PAY') r1FP++;
    }

    if (gt.expected_route === 'R2_CFO_REVIEW') {
      if (inv.routeDecision === 'R2_CFO_REVIEW') r2TP++;
      else r2FN++;
    } else {
      if (inv.routeDecision === 'R2_CFO_REVIEW') r2FP++;
    }
  });

  const calcF1 = (tp: number, fp: number, fn: number) => {
    const prec = tp + fp > 0 ? tp / (tp + fp) : 1;
    const rec = tp + fn > 0 ? tp / (tp + fn) : 1;
    const f1 = prec + rec > 0 ? (2 * prec * rec) / (prec + rec) : 0;
    return { prec, rec, f1 };
  };

  const dupMetrics = calcF1(dupTP, dupFP, dupFN);
  const forgeMetrics = calcF1(forgeTP, forgeFP, forgeFN);
  const priceMetrics = calcF1(priceTP, priceFP, priceFN);
  const r1Metrics = calcF1(r1TP, r1FP, r1FN);
  const r2Metrics = calcF1(r2TP, r2FP, r2FN);

  return {
    totalInvoices: invoices.length,
    duplicate: {
      precision: Number(dupMetrics.prec.toFixed(3)),
      recall: Number(dupMetrics.rec.toFixed(3)),
      f1: Number(dupMetrics.f1.toFixed(3)),
      truePositives: dupTP,
      falsePositives: dupFP,
      falseNegatives: dupFN,
      trueNegatives: dupTN,
    },
    forgery: {
      precision: Number(forgeMetrics.prec.toFixed(3)),
      recall: Number(forgeMetrics.rec.toFixed(3)),
      f1: Number(forgeMetrics.f1.toFixed(3)),
      truePositives: forgeTP,
      falsePositives: forgeFP,
      falseNegatives: forgeFN,
      trueNegatives: forgeTN,
    },
    overpricing: {
      precision: Number(priceMetrics.prec.toFixed(3)),
      recall: Number(priceMetrics.rec.toFixed(3)),
      f1: Number(priceMetrics.f1.toFixed(3)),
      truePositives: priceTP,
      falsePositives: priceFP,
      falseNegatives: priceFN,
      trueNegatives: priceTN,
    },
    routingAccuracy: {
      overallAccuracy: invoices.length > 0 ? Number((correctRoutes / invoices.length).toFixed(3)) : 1.0,
      correctDecisions: correctRoutes,
      totalEvaluated: invoices.length,
      r1Precision: Number(r1Metrics.prec.toFixed(3)),
      r1Recall: Number(r1Metrics.rec.toFixed(3)),
      r2Precision: Number(r2Metrics.prec.toFixed(3)),
      r2Recall: Number(r2Metrics.rec.toFixed(3)),
    },
    estimatedTotalSavingsIdentified: totalSavingsIdentified,
  };
}

// Standalone CLI runner for `pnpm eval`
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('eval')) {
  import('../datagen/generator.js').then(({ generateSyntheticData }) => {
    const dataset = generateSyntheticData();
    const metrics = runEvaluation(dataset.invoices, dataset.groundTruth);
    
    console.log('\n======================================================');
    console.log('      VAULT-ZERO ENGINE EVALUATION REPORT (GROUND TRUTH) ');
    console.log('======================================================\n');
    console.log(`Evaluated Dataset: ${metrics.totalInvoices} Invoices\n`);

    console.log('--- DETECTION METRICS ---');
    console.table([
      {
        Anomaly: 'Duplicate Detection',
        Precision: `${(metrics.duplicate.precision * 100).toFixed(1)}%`,
        Recall: `${(metrics.duplicate.recall * 100).toFixed(1)}%`,
        F1: `${(metrics.duplicate.f1 * 100).toFixed(1)}%`,
        TP: metrics.duplicate.truePositives,
        FP: metrics.duplicate.falsePositives,
        FN: metrics.duplicate.falseNegatives,
      },
      {
        Anomaly: 'Forgery Detection (PDF/Font)',
        Precision: `${(metrics.forgery.precision * 100).toFixed(1)}%`,
        Recall: `${(metrics.forgery.recall * 100).toFixed(1)}%`,
        F1: `${(metrics.forgery.f1 * 100).toFixed(1)}%`,
        TP: metrics.forgery.truePositives,
        FP: metrics.forgery.falsePositives,
        FN: metrics.forgery.falseNegatives,
      },
      {
        Anomaly: 'Overpricing / Contract Creep',
        Precision: `${(metrics.overpricing.precision * 100).toFixed(1)}%`,
        Recall: `${(metrics.overpricing.recall * 100).toFixed(1)}%`,
        F1: `${(metrics.overpricing.f1 * 100).toFixed(1)}%`,
        TP: metrics.overpricing.truePositives,
        FP: metrics.overpricing.falsePositives,
        FN: metrics.overpricing.falseNegatives,
      },
    ]);

    console.log('\n--- ROUTING ACCURACY ---');
    console.log(`Overall Routing Accuracy : ${(metrics.routingAccuracy.overallAccuracy * 100).toFixed(1)}% (${metrics.routingAccuracy.correctDecisions}/${metrics.routingAccuracy.totalEvaluated})`);
    console.log(`R1 (Auto-Pay) Precision  : ${(metrics.routingAccuracy.r1Precision * 100).toFixed(1)}% | Recall: ${(metrics.routingAccuracy.r1Recall * 100).toFixed(1)}%`);
    console.log(`R2 (CFO Queue) Precision : ${(metrics.routingAccuracy.r2Precision * 100).toFixed(1)}% | Recall: ${(metrics.routingAccuracy.r2Recall * 100).toFixed(1)}%`);
    console.log(`Total Leakage Prevented  : ₹${metrics.estimatedTotalSavingsIdentified.toLocaleString('en-IN')}\n`);
    console.log('======================================================\n');
  });
}
