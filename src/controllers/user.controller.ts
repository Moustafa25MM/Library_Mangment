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
    const existingBorrower = await prisma.borrower.findUnique({
      where: { email },
    });

    if (existingBorrower) {
      return response.status(409).send('borrower already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const borrower = await prisma.borrower.create({
      data: {
        name,
        email,
        password: hashedPassword,
        registeredDate: new Date(),
      },
    });
    return requestHandler.sendSuccess(
      response,
      'borrower created successfully'
    )({ borrower });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const loginBorrower = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    const existingBorrower = await prisma.borrower.findUnique({
      where: { email },
    });
    if (!existingBorrower) {
      return response.status(401).json({ error: 'borrower does not exist' });
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingBorrower.password
    );

    if (!comparePassword) {
      response.status(401).json({ error: 'Invalid email or password' });
    }
    const token = authMethods.generateJWT({ id: existingBorrower.id });

    const borrowerData = {
      id: existingBorrower.id,
      name: existingBorrower.name,
      email: existingBorrower.email,
    };
    return requestHandler.sendSuccess(
      response,
      'borrower Login Successfully'
    )({ token, borrower: borrowerData });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};
