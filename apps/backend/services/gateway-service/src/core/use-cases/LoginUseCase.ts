import type { IUserRepository } from '../interfaces/IUserRepository.js';
import type { IPasswordHasher } from '../interfaces/IPasswordHasher.js';
import type { ITokenService, TokenPair } from '../interfaces/ITokenService.js';
import type { LoginInput } from '@bts/core-models';
import { InvalidCredentialsError } from '../../domain/errors.js';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<TokenPair> {
    const user = await this.userRepository.findByUsername(input.username);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await this.passwordHasher.compare(input.password, user.password_hash);
    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    return this.tokenService.generateTokens({
      id: user.id,
      username: user.username,
    });
  }
}
