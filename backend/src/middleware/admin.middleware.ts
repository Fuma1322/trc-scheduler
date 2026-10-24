import type { Request, Response, NextFunction } from 'express';

export function requireAdminRole(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.admin || req.admin.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Administrator access required.',
    });
  }

  next();
}
