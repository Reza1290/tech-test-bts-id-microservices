import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { fixRequestBody } from 'http-proxy-middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { env } from './main/config/env.js';
import { makeAuthControllers } from './main/factories/controllers/auth-controller-factory.js';
import { createAuthRoutes } from './main/routes/auth-routes.js';
import { requireAuth } from './middleware/auth.js';
import { productMutationRateLimiter } from './middleware/rate-limiter.js';

export const createApp = () => {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  const swaggerPath = path.resolve(process.cwd(), 'docs/swagger.yaml');
  if (fs.existsSync(swaggerPath)) {
    const swaggerDoc = YAML.load(swaggerPath);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    app.get('/api/docs/swagger.yaml', (_req, res) => {
      res.sendFile(swaggerPath);
    });
  }

  const authControllers = makeAuthControllers();
  const authRoutes = createAuthRoutes(authControllers);
  app.use('/api/auth', authRoutes);

  app.use(
    '/api/products',
    (req, res, next) => {
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        productMutationRateLimiter(req, res, (err) => {
          if (err) return next(err);
          requireAuth(req, res, next);
        });
      } else {
        next();
      }
    },
    createProxyMiddleware({
      target: env.PRODUCT_SERVICE_URL,
      changeOrigin: true,
      on: {
        proxyReq: fixRequestBody,
      },
    }),
  );

  app.get('/health', (_req, res) => {
    res.json({ service: 'gateway-service', status: 'UP' });
  });

  return app;
};

export const startServer = () => {
  const app = createApp();
  return app.listen(env.PORT, () => {
    console.log(`Gateway service running on port ${env.PORT}`);
  });
};

if (env.NODE_ENV !== 'test') {
  startServer();
}
