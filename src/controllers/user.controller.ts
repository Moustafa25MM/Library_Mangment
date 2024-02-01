import prisma from '../database';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const registerUser = async (request: Request, response: Response) => {
  try {
    const { name, email, password } = request.body;
    const existingUser = await prisma.borrower.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response.status(409).send('user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.borrower.create({
      data: {
        name,
        email,
        password: hashedPassword,
        registeredDate: new Date(),
      },
    });
    return response.status(201).json({ msg: 'user created successfully' });
  } catch (error) {
    console.log('error occured in create user', error);
    throw error;
  }
};
