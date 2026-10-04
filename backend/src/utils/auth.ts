import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';

import type { JwtPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const jwtSecret: string = JWT_SECRET;

export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(
  payload: JwtPayload
): string {
  const expiresIn =
    process.env.JWT_EXPIRES_IN || '7d';

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(
    payload,
    jwtSecret,
    options
  );
}

export function verifyToken(
  token: string
): JwtPayload {
  const decoded = jwt.verify(
    token,
    jwtSecret
  );

  if (
    typeof decoded === 'string' ||
    !decoded ||
    typeof decoded !== 'object'
  ) {
    throw new Error('Invalid token payload');
  }

  if (
    typeof decoded.adminId !== 'string' ||
    typeof decoded.email !== 'string' ||
    decoded.role !== 'ADMIN'
  ) {
    throw new Error('Invalid token payload');
  }

  return {
    adminId: decoded.adminId,
    email: decoded.email,
    role: decoded.role,
  };
}