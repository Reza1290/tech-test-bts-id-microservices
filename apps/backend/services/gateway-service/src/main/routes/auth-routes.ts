import { Router } from 'express';
import { expressRouteAdapter } from '../adapters/express-route-adapter.js';
import { authRateLimiter } from '../../middleware/rate-limiter.js';
import type { AuthControllers } from '../factories/controllers/auth-controller-factory.js';

export const createAuthRoutes = (controllers: AuthControllers): Router => {
  const router = Router();

  router.get('/health', expressRouteAdapter(controllers.healthController));
  router.post('/register', authRateLimiter, expressRouteAdapter(controllers.registerController));
  router.post('/login', authRateLimiter, expressRouteAdapter(controllers.loginController));

  return router;
};
