import type { IUserRepository } from '../interfaces/IUserRepository.js';
import type { IPasswordHasher } from '../interfaces/IPasswordHasher.js';
import type { RegisterInput } from '@bts/core-models';
import { UserAlreadyExistsError } from '../../domain/errors.js';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: RegisterInput): Promise<{ id: number; username: string }> {
    const existing = await this.userRepository.findByUsername(input.username);
    if (existing) {
      throw new UserAlreadyExistsError(input.username);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({
      username: input.username,
      password_hash: passwordHash,
    });

    return {
      id: user.id,
      username: user.username,
    };
  }
}
