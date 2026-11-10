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
    const authorization = req.headers.authorization;

    const token =
      req.cookies?.trc_admin_token ||
      (authorization?.startsWith('Bearer ')
        ? authorization.slice(7)
        : undefined);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const payload = verifyToken(token);

    if (payload.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Administrator access required',
      });
    }

    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session',
    });
  }
}