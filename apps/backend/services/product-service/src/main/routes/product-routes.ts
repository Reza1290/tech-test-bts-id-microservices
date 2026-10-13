import { Router } from 'express';
import { expressRouteAdapter } from '../adapters/express-route-adapter.js';
import type { ProductControllers } from '../factories/controllers/product-controller-factory.js';

export const createProductRoutes = (controllers: ProductControllers): Router => {
  const router = Router();

  router.get('/health', expressRouteAdapter(controllers.healthController));

  router.get('/', expressRouteAdapter(controllers.listProductsController));
  router.get('/:id', expressRouteAdapter(controllers.getProductByIdController));
  router.post('/', expressRouteAdapter(controllers.createProductController));
  router.put('/:id', expressRouteAdapter(controllers.updateProductController));
  router.delete('/:id', expressRouteAdapter(controllers.deleteProductController));

  return router;
};
