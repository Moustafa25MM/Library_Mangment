import prisma from '../database';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { authMethods } from '../middlewares/auth';
import requestHandler from '../handlers/requestHandler';

export const registerBorrower = async (
  request: Request,
  response: Response
) => {
  try {
    const { name, email, password } = request.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response.status(409).send('user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        registeredDate: new Date(),
        role: 'BORROWER',
      },
    });
    return requestHandler.sendSuccess(
      response,
      'user created successfully'
    )({ user });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const loginUser = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return response.status(401).json({ error: 'user does not exist' });
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!comparePassword) {
      return response.status(401).json({ error: 'Invalid email or password' });
    }
    const token = authMethods.generateJWT({ id: existingUser.id });

    const userData = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };
    return requestHandler.sendSuccess(
      response,
      'user Login Successfully'
    )({ token, user: userData });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};
