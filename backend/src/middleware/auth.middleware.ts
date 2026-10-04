import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../utils/auth';
import type { JwtPayload } from '../types/auth';

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const [scheme, token] =
      authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header',
      });
    }

    const payload = verifyToken(token);

    req.admin = payload;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}