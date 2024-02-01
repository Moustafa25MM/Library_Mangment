import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
const JWTSecret = process.env.JWT_SECRET;

type TokenPayload = {
  id: string;
};

const generateJWT = (payload: TokenPayload): String =>
  jwt.sign(payload, JWTSecret as string, { expiresIn: '7d' });

export const authMethods = {
  generateJWT,
};
