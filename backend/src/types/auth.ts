import { ObjectId } from 'mongodb';

export type AdminRole = 'ADMIN';

export type Admin = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
};

export type JwtPayload = {
  adminId: string;
  email: string;
  role: AdminRole;
};