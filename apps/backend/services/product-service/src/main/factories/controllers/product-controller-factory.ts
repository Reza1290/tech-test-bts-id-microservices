import { createDatabaseClient } from '../../../infra/db/client.js';
import { PostgresProductRepository } from '../../../infra/repositories/PostgresProductRepository.js';
import { MemoryCacheProvider } from '../../../infra/cache/MemoryCacheProvider.js';
import { ListProductsUseCase } from '../../../core/use-cases/ListProductsUseCase.js';
import { GetProductByIdUseCase } from '../../../core/use-cases/GetProductByIdUseCase.js';
import { CreateProductUseCase } from '../../../core/use-cases/CreateProductUseCase.js';
import { UpdateProductUseCase } from '../../../core/use-cases/UpdateProductUseCase.js';
import { DeleteProductUseCase } from '../../../core/use-cases/DeleteProductUseCase.js';
import { ListProductsController } from '../../../infra/http/controllers/ListProductsController.js';
import { GetProductByIdController } from '../../../infra/http/controllers/GetProductByIdController.js';
import { CreateProductController } from '../../../infra/http/controllers/CreateProductController.js';
import { UpdateProductController } from '../../../infra/http/controllers/UpdateProductController.js';
import { DeleteProductController } from '../../../infra/http/controllers/DeleteProductController.js';
import { HealthController } from '../../../infra/http/controllers/HealthController.js';
import { env } from '../../config/env.js';

export interface ProductControllers {
  listProductsController: ListProductsController;
  getProductByIdController: GetProductByIdController;
  createProductController: CreateProductController;
  updateProductController: UpdateProductController;
  deleteProductController: DeleteProductController;
  healthController: HealthController;
}

export const makeProductControllers = (): ProductControllers => {
  const { db } = createDatabaseClient({
    connectionString: env.DATABASE_URL,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.PRODUCTS_DB_NAME,
  });

  const productRepository = new PostgresProductRepository(db);
  const cacheProvider = new MemoryCacheProvider();

  const listProductsUseCase = new ListProductsUseCase(productRepository, cacheProvider);
  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository, cacheProvider);
  const createProductUseCase = new CreateProductUseCase(productRepository, cacheProvider);
  const updateProductUseCase = new UpdateProductUseCase(productRepository, cacheProvider);
  const deleteProductUseCase = new DeleteProductUseCase(productRepository, cacheProvider);

  return {
    listProductsController: new ListProductsController(listProductsUseCase),
    getProductByIdController: new GetProductByIdController(getProductByIdUseCase),
    createProductController: new CreateProductController(createProductUseCase),
    updateProductController: new UpdateProductController(updateProductUseCase),
    deleteProductController: new DeleteProductController(deleteProductUseCase),
    healthController: new HealthController(),
  };
};
