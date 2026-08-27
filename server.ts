import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './packages/core/db.js';
import { pipeline } from './packages/core/pipeline.js';
import { runEvaluation } from './packages/core/eval.js';
import { generateSyntheticData } from './packages/datagen/generator.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // =========================================================================
  // REST API ENDPOINTS
  // =========================================================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      engine: 'Vault-Zero Autonomous Engine v1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // KPI Metrics Strip
  app.get('/api/metrics', (req, res) => {
    try {
      const metrics = db.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Get all invoices with filtering & search
  app.get('/api/invoices', (req, res) => {
    try {
      const { status, route, search, tab } = req.query;
      let list = db.getInvoices();

      if (tab === 'cfo-queue') {
        list = list.filter((i) => i.routeDecision === 'R2_CFO_REVIEW' && i.status !== 'PAID');
      } else if (tab === 'auto-paid') {
        list = list.filter((i) => i.status === 'PAID' && i.routeDecision === 'R1_AUTO_PAY');
      } else if (tab === 'flagged') {
        list = list.filter((i) => i.status === 'FLAGGED');
      } else if (tab === 'demo-scenarios') {
        list = list.filter((i) => i.isDemoScenario);
      }

      if (status && typeof status === 'string') {
        list = list.filter((i) => i.status.toUpperCase() === status.toUpperCase());
      }

      if (route && typeof route === 'string') {
        list = list.filter((i) => i.routeDecision.toUpperCase() === route.toUpperCase());
      }

      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        list = list.filter(
          (i) =>
            i.rawInvoiceNumber.toLowerCase().includes(q) ||
            (i.vendorName && i.vendorName.toLowerCase().includes(q)) ||
            (i.poNumber && i.poNumber.toLowerCase().includes(q)) ||
            String(i.amount).includes(q)
        );
      }

      res.json(list);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Get single invoice detail
  app.get('/api/invoices/:id', (req, res) => {
    try {
      const invoice = db.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Ingest & run 8-stage pipeline on custom invoice upload
  app.post('/api/invoices/upload', async (req, res) => {
    try {
      const { filename, pdfMetadata, injectedFields, rawText } = req.body;
      const result = await pipeline.processInvoice({
        filename: filename || 'uploaded_invoice.pdf',
        pdfMetadata,
        injectedFields,
        rawText,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Run Demo Scenario (Reset & Load 4 Demo Invoices + Clean Auto-Pay Invoices)
  app.post('/api/invoices/demo-batch', (req, res) => {
    try {
      db.seed();
      const demoInvoices = db.getInvoices().filter((i) => i.isDemoScenario);
      res.json({
        success: true,
        message: 'Demo batch initialized with 4 anomaly scenarios and clean auto-paid invoices.',
        count: demoInvoices.length,
        invoices: demoInvoices,
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Seed entire 200 synthetic dataset
  app.post('/api/invoices/seed-all', (req, res) => {
    try {
      db.seed();
      const all = db.getInvoices();
      res.json({
        success: true,
        message: 'Master data and 200 synthetic invoices generated and seeded.',
        count: all.length,
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // CFO 1-click Approve (triggers R1 auto-pay to QuickBooks + ACH)
  app.post('/api/invoices/:id/approve', async (req, res) => {
    try {
      const { notes } = req.body;
      const approved = await pipeline.approveInvoice(req.params.id, notes);
      res.json(approved);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // CFO 1-click Reject
  app.post('/api/invoices/:id/reject', async (req, res) => {
    try {
      const { notes } = req.body;
      const rejected = await pipeline.rejectInvoice(req.params.id, notes);
      res.json(rejected);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Ground Truth Evaluation endpoint
  app.get('/api/eval', (req, res) => {
    try {
      const invoices = db.getInvoices();
      const groundTruth = Array.from(db.groundTruth.values());
      const evaluation = runEvaluation(invoices, groundTruth);
      res.json(evaluation);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Ground truth dataset
  app.get('/api/ground-truth', (req, res) => {
    res.json(Array.from(db.groundTruth.values()));
  });

  // Master data
  app.get('/api/master-data', (req, res) => {
    res.json({
      vendors: Array.from(db.vendors.values()),
      contracts: Array.from(db.contracts.values()),
      purchaseOrders: Array.from(db.purchaseOrders.values()),
      marketPrices: Array.from(db.marketPrices.values()),
    });
  });

  // Reset database to initial state
  app.post('/api/reset', (req, res) => {
    db.seed();
    res.json({ success: true, message: 'Database reset to initial demo state.' });
  });

  // =========================================================================
  // VITE DEVELOPMENT MIDDLEWARE / PRODUCTION STATIC FILE SERVING
  // =========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vault-Zero Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Vault-Zero Server] Fatal error starting server:', err);
});
