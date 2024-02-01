import prisma from '../database';
import { Request, Response } from 'express';
import requestHandler from '../handlers/requestHandler';
import bcrypt from 'bcrypt';

export const createAdmin = async (request: Request, response: Response) => {
  const { name, email, password } = request.body;
  if (!email || !password || !name) {
    return response
      .status(404)
      .json({ msg: 'error : unProvided name or email or password' });
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return response.status(409).send('user already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        registeredDate: new Date(),
        role: 'ADMIN',
      },
    });

    return requestHandler.sendSuccess(
      response,
      'Admin created successfully'
    )({ admin });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const updateAdmin = async (request: any, response: Response) => {
  const { name, email, password } = request.body;

  if (!email && !password && !name) {
    return response
      .status(404)
      .json({ msg: 'error : you did not provide any data to update' });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return response
      .status(409)
      .send('There is a User already exist with the same Email');
  }

  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

  try {
    const updatedAdmin = await prisma.user.update({
      where: { id: request.user.id },
      data: {
        name: name || undefined,
        email: email || undefined,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    return requestHandler.sendSuccess(
      response,
      'Admin updated successfully'
    )({ updatedAdmin });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const deleteBorrower = async (request: Request, response: Response) => {
  const { userId } = request.params;
  console.log(userId);
  try {
    await prisma.user.delete({
      where: { id: userId, role: 'BORROWER' },
    });

    return requestHandler.sendSuccess(
      response,
      'Borrower deleted successfully'
    )({});
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const listBorrowers = async (_: Request, response: Response) => {
  try {
    const borrowers = await prisma.user.findMany({
      where: { role: 'BORROWER' },
    });

    return requestHandler.sendSuccess(
      response,
      'Borrowers retrieved successfully'
    )({ borrowers });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};
