import prisma from '../database';
import { Request, Response } from 'express';
import requestHandler from '../handlers/requestHandler';

export const checkOutBook = async (request: any, response: Response) => {
  const userId = request.user.id;
  const { bookId } = request.body;

  if (!bookId) {
    return response.status(404).json({ message: 'No Book to Checkout!' });
  }
  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      return response.status(404).json({ message: 'Book does not exist' });
    }

    // Check if the user already has an active borrowing for the same book
    const activeBorrowing = await prisma.borrowing.findFirst({
      where: {
        bookId,
        userId,
        returned: false,
      },
    });

    if (activeBorrowing) {
      return response.status(400).json({
        message:
          'You have already borrowed this book and have not returned it yet',
      });
    }
    if (book && book.quantity > 0) {
      await prisma.book.update({
        where: { id: bookId },
        data: { quantity: book.quantity - 1 },
      });
    } else {
      return response
        .status(404)
        .json({ message: 'All copies of the book are currently borrowed' });
    }
    // Set due date to one week from today
    const borrowedDate = new Date();
    const dueDate = new Date(borrowedDate);
    dueDate.setDate(dueDate.getDate() + 7); // Add 7 days to the current date

    const borrowing = await prisma.borrowing.create({
      data: {
        bookId,
        userId,
        borrowedDate,
        dueDate,
      },
    });

    return requestHandler.sendSuccess(
      response,
      'Book Borrowed successfully'
    )({ borrowing });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const returnBook = async (request: any, response: Response) => {
  const userId = request.user.id;
  const { bookId } = request.body;

  if (!bookId) {
    return response.status(400).json({ message: 'Book ID is required' });
  }

  try {
    // Find the borrowing record that needs to be updated
    const borrowing = await prisma.borrowing.findFirst({
      where: {
        bookId,
        userId,
        returned: false,
      },
    });

    if (!borrowing) {
      return response
        .status(404)
        .json({ message: 'No active borrowing record found for this book' });
    }

    // Mark the borrowing as returned
    await prisma.borrowing.update({
      where: { id: borrowing.id },
      data: { returned: true },
    });

    // Increase the book quantity by 1
    await prisma.book.update({
      where: { id: bookId },
      data: { quantity: { increment: 1 } },
    });

    return requestHandler.sendSuccess(
      response,
      'Book returned successfully'
    )({});
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const getCurrentlyBorrowedBooks = async (
  request: any,
  response: Response
) => {
  const userId = request.user.id;

  try {
    // Find all borrowing records for the user that have not been returned
    const borrowedBooks = await prisma.borrowing.findMany({
      where: {
        userId,
        returned: false,
      },
      include: {
        book: true, // include information about the book
      },
    });

    if (borrowedBooks.length === 0) {
      return requestHandler.sendSuccess(
        response,
        'No books currently borrowed'
      )({ borrowedBooks });
    }

    return requestHandler.sendSuccess(
      response,
      'Currently borrowed books retrieved successfully'
    )({ borrowedBooks });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const listAllOverdueBooks = async (request: any, response: Response) => {
  try {
    const currentDate = new Date();

    const overdueBooks = await prisma.borrowing.findMany({
      where: {
        dueDate: {
          lt: currentDate,
        },
        returned: false,
      },
      include: {
        book: true, // include information about the book
        user: true, // include information about the user
      },
    });

    if (overdueBooks.length === 0) {
      return requestHandler.sendSuccess(
        response,
        'No overdue books found'
      )({ overdueBooks });
    }

    return requestHandler.sendSuccess(
      response,
      'Overdue books retrieved successfully'
    )({ overdueBooks });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const checkBorrowerOverdueBooks = async (
  request: any,
  response: Response
) => {
  const userId = request.user.id;

  try {
    const currentDate = new Date();

    const overdueBooks = await prisma.borrowing.findMany({
      where: {
        userId,
        dueDate: {
          lt: currentDate,
        },
        returned: false,
      },
      include: {
        book: true, // include information about the book
      },
    });

    if (overdueBooks.length === 0) {
      return requestHandler.sendSuccess(
        response,
        'You have no overdue books'
      )({ overdueBooks });
    }

    return requestHandler.sendSuccess(
      response,
      'Your overdue books retrieved successfully'
    )({ overdueBooks });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};
