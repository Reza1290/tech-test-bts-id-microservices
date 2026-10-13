import type { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../infra/security/JwtTokenService.js';
import { env } from '../main/config/env.js';

const tokenService = new JwtTokenService(env.JWT_SECRET);

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Authorization token is required',
    });
    return;
  }

  const token = authHeader.slice(7).trim();
  try {
    const payload = await tokenService.verifyToken(token);
    req.headers['x-user-id'] = payload.sub;
    req.headers['x-username'] = payload.username;
    next();
  } catch {
    res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired authorization token',
    });
  }
};
