import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getDatabase } from '../config/database';
import {
  comparePassword,
  generateToken,
  hashPassword,
} from '../utils/auth';

const COOKIE_NAME = 'trc_admin_token';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production'
    ? ('none' as const)
    : ('lax' as const),
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function login(req: Request, res: Response) {
  try {
    const email =
      typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';

    const password =
      typeof req.body.password === 'string'
        ? req.body.password
        : '';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const db = getDatabase();
    const admin = await db.collection('admins').findOne({ email });

    if (
      !admin ||
      typeof admin.password !== 'string' ||
      !(await comparePassword(password, admin.password))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: 'ADMIN',
    });

    res.cookie(COOKIE_NAME, token, cookieOptions);

    return res.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
}

export async function me(req: Request, res: Response) {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const db = getDatabase();
    const admin = await db.collection('admins').findOne({
      _id: new ObjectId(req.admin.adminId),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found',
      });
    }

    return res.json({
      success: true,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production'
        ? ('none' as const)
        : ('lax' as const),
    path: '/',
  });

  return res.json({
    success: true,
    message: 'Logged out successfully',
  });
}

export async function register(req: Request, res: Response) {
  try {
    const name =
      typeof req.body.name === 'string'
        ? req.body.name.trim()
        : '';

    const email =
      typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';

    const password =
      typeof req.body.password === 'string'
        ? req.body.password
        : '';

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    if (name.length > 100 || email.length > 254) {
      return res.status(400).json({
        success: false,
        message: 'Name or email is too long',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid email address',
      });
    }

    if (password.length < 12 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 12 and 72 characters',
      });
    }

    const db = getDatabase();
    const admins = db.collection('admins');

    const existing = await admins.findOne({ email });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const now = new Date();

    const result = await admins.insertOne({
      name,
      email,
      password: await hashPassword(password),
      role: 'ADMIN',
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({
      success: true,
      message: 'Administrator account created',
      admin: {
        id: result.insertedId.toString(),
        name,
        email,
        role: 'ADMIN',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
}