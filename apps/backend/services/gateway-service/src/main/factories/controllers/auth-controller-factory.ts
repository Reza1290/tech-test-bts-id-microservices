import { createDatabaseClient } from '../../../infra/db/client.js';
import { PostgresUserRepository } from '../../../infra/repositories/PostgresUserRepository.js';
import { BcryptPasswordHasher } from '../../../infra/security/BcryptPasswordHasher.js';
import { JwtTokenService } from '../../../infra/security/JwtTokenService.js';
import { RegisterUseCase } from '../../../core/use-cases/RegisterUseCase.js';
import { LoginUseCase } from '../../../core/use-cases/LoginUseCase.js';
import { RegisterController } from '../../../infra/http/controllers/RegisterController.js';
import { LoginController } from '../../../infra/http/controllers/LoginController.js';
import { HealthController } from '../../../infra/http/controllers/HealthController.js';
import { env } from '../../config/env.js';

export interface AuthControllers {
  registerController: RegisterController;
  loginController: LoginController;
  healthController: HealthController;
}

export const makeAuthControllers = (): AuthControllers => {
  const { db } = createDatabaseClient({
    connectionString: env.DATABASE_URL,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.AUTH_DB_NAME,
  });

  const userRepository = new PostgresUserRepository(db);
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(env.JWT_SECRET);

  const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

  return {
    registerController: new RegisterController(registerUseCase),
    loginController: new LoginController(loginUseCase),
    healthController: new HealthController(),
  };
};
