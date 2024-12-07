import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export enum Role {
  User = 'user',
  Institute = 'institute',
  Admin = 'admin',
}


export interface AuthUser extends JwtPayload {
  id: string;
  role: 'user' | 'institute' | 'admin';
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  code?: string;
  user?: AuthUser;
  data?: any;
  error?:any;
}