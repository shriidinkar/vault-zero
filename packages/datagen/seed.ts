import { generateSyntheticData } from './generator.js';
import * as fs from 'fs';
import * as path from 'path';

export function seedDataset() {
  const data = generateSyntheticData();
  const outDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outDir, 'ground_truth.json'),
    JSON.stringify(data.groundTruth, null, 2)
  );

  fs.writeFileSync(
    path.join(outDir, 'master_data.json'),
    JSON.stringify({
      vendors: data.vendors,
      contracts: data.contracts,
      purchaseOrders: data.purchaseOrders,
      marketPrices: data.marketPrices,
    }, null, 2)
  );

  fs.writeFileSync(
    path.join(outDir, 'invoices.json'),
    JSON.stringify(data.invoices, null, 2)
  );

  console.log(`[Seed] Successfully generated and stored dataset with ${data.invoices.length} invoices and ${data.groundTruth.length} ground-truth entries.`);
  return data;
}

if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('seed')) {
  seedDataset();
}
