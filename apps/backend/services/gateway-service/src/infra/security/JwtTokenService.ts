import jwt from 'jsonwebtoken';
import type { ITokenService, TokenPair, TokenPayload } from '../../core/interfaces/ITokenService.js';
import { UnauthorizedError } from '../../domain/errors.js';

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresInSeconds: number = 3600,
  ) {}

  async generateTokens(user: { id: number; username: string }): Promise<TokenPair> {
    const payload = {
      sub: String(user.id),
      username: user.username,
    };

    const authentication_token = jwt.sign(payload, this.secret, {
      expiresIn: this.expiresInSeconds,
    });

    const refresh_token = jwt.sign(
      { sub: String(user.id), type: 'refresh' },
      this.secret,
      { expiresIn: '7d' },
    );

    return {
      authentication_token,
      refresh_token,
      token_type: 'Bearer',
      expires_in: this.expiresInSeconds,
    };
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.secret) as { sub: string; username: string };
      return {
        sub: decoded.sub,
        username: decoded.username,
      };
    } catch {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }
  }
}
