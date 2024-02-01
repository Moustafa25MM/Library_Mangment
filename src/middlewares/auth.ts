import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction } from 'express';
import prisma from '../database';

dotenv.config();
const JWTSecret = process.env.JWT_SECRET;

type TokenPayload = {
  id: string;
};

const generateJWT = (payload: TokenPayload): String =>
  jwt.sign(payload, JWTSecret as string, { expiresIn: '7d' });

const isAuthenicated = async (
  request: any,
  response: any,
  next: NextFunction
) => {
  try {
    const token = request.headers.authorization;
    if (!token) {
      return response
        .status(401)
        .json({ error: 'Unauthorized: Token not provided' });
    }

    const payload: TokenPayload = jwt.verify(
      token,
      JWTSecret as string
    ) as TokenPayload;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!existingUser) {
      return response.status(400).json({ error: 'User not found' });
    }

    request.user = existingUser;
    next();
  } catch (error) {
    return response.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const authMethods = {
  generateJWT,
  isAuthenicated,
};
