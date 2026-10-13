export interface TokenPair {
  authentication_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface TokenPayload {
  sub: string;
  username: string;
}

export interface ITokenService {
  generateTokens(user: { id: number; username: string }): Promise<TokenPair>;
  verifyToken(token: string): Promise<TokenPayload>;
}
