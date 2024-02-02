import prisma from '../database';
import { Request, Response } from 'express';
import requestHandler from '../handlers/requestHandler';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

export const updateUser = async (request: any, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    // If there are errors, send a 400 response with the errors
    return response.status(400).json({ errors: errors.array()[0].msg });
  }
  const { name, email, password } = request.body;
  const userId = request.user.id;

  // Check if no data was provided for update
  if (!email && !password && !name) {
    return response
      .status(400)
      .json({ msg: 'Error: You did not provide any data to update.' });
  }

  const updateData: { name?: string; email?: string; password?: string } = {};

  // Check if the password was provided and hash it
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    updateData.password = hashedPassword;
  }

  // Add name and email to the update payload if they were provided
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  try {
    // Only update the fields that were provided
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return requestHandler.sendSuccess(
      response,
      'User updated successfully'
    )({ updatedUser });
  } catch (error: any) {
    // Handle the case where email is not unique
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return response
        .status(409)
        .send('There is already a user with the same email.');
    }
    return requestHandler.sendError(response, error);
  }
};
