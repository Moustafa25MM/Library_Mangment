import prisma from '../database';
import { Request, Response } from 'express';
import requestHandler from '../handlers/requestHandler';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

export const createAdmin = async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    // If there are errors, send a 400 response with the errors
    return response.status(400).json({ errors: errors.array()[0].msg });
  }

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
  const adminId = request.user.id;
  if (!email && !password && !name) {
    return response
      .status(404)
      .json({ msg: 'error : you did not provide any data to update' });
  }
  const updateData: { name?: string; email?: string; password?: string } = {};
  if (email) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response
        .status(409)
        .send('There is already a user with the same email.');
    }
    updateData.email = email;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    updateData.password = hashedPassword;
  }

  if (name) {
    updateData.name = name;
  }

  try {
    // Update only the fields that were provided
    const updatedAdmin = await prisma.user.update({
      where: { id: adminId },
      data: updateData,
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
