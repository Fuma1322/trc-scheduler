import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getDatabase } from '../config/database';
import {
  comparePassword,
  generateToken,
} from '../utils/auth';

export async function login(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const db = getDatabase();

    const admin = await db
      .collection('admins')
      .findOne({
        email: email.toLowerCase().trim(),
      });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const passwordMatches =
      await comparePassword(
        password,
        admin.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
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

export async function me(
  req: Request,
  res: Response
) {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const db = getDatabase();

    const admin = await db
      .collection('admins')
      .findOne({
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
        id: admin._id,
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