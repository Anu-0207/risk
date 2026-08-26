import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import authRoutes from './backend/src/routes/auth.js';
import profileRoutes from './backend/src/routes/profile.js';
import scanRoutes from './backend/src/routes/scans.js';
import analyticsRoutes from './backend/src/routes/analytics.js';
import { errorHandler } from './backend/src/middleware/errorHandler.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'RiskVault Risk Intelligence API',
      timestamp: new Date().toISOString(),
      capabilities: {
        localEngine: true,
        geminiContextual: Boolean(process.env.GEMINI_API_KEY),
        openaiContextual: Boolean(process.env.OPENAI_API_KEY),
      },
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/scans', scanRoutes);
  app.use('/api', scanRoutes); // Support both /api/analyze-risk and /api/scans
  app.use('/api/analytics', analyticsRoutes);

  // Global Error Handler for API
  app.use('/api', errorHandler);

  // Vite middleware for development vs static build in production
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
    console.log(`RiskVault server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to boot RiskVault server:', err);
});
