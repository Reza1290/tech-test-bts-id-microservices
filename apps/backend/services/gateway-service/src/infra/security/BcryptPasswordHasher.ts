import bcrypt from 'bcryptjs';
import type { IPasswordHasher } from '../../core/interfaces/IPasswordHasher.js';

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
