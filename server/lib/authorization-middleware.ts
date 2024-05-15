import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ClientError } from './client-error.js';
// import { error } from 'console';

const hashKey = process.env.TOKEN_SECRET ?? '';
if (!hashKey) throw new Error('TOKEN_SECRET not found in env');

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // The token will be in the Authorization header with the format `Bearer ${token}`
    const token = req.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      throw new ClientError(401, 'authentication required');
    }
    req.user = jwt.verify(token, hashKey) as Request['user'];
    next();
  } catch (error) {
    console.log('error', error);
  }
}
