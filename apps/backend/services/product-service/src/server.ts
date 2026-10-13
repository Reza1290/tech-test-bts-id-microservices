import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './main/config/env.js';
import { makeProductControllers } from './main/factories/controllers/product-controller-factory.js';
import { createProductRoutes } from './main/routes/product-routes.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  const controllers = makeProductControllers();
  const productRoutes = createProductRoutes(controllers);

  app.use('/api/products', productRoutes);
  app.get('/health', (_req, res) => {
    res.json({ service: 'product-service', status: 'UP' });
  });

  return app;
};

export const startServer = () => {
  const app = createApp();
  return app.listen(env.PORT, () => {
    console.log(`Product service running on port ${env.PORT}`);
  });
};

if (env.NODE_ENV !== 'test') {
  startServer();
}
