import prisma from '../database';
import { Request, Response } from 'express';
import RequestHandler from '../handlers/requestHandler';
import { paginationOption } from '../utils/paginations';

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

    return RequestHandler.sendSuccess(
      response,
      'Book Borrowed successfully'
    )({ borrowing });
  } catch (error: any) {
    return RequestHandler.sendError(response, error);
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

    return RequestHandler.sendSuccess(
      response,
      'Book returned successfully'
    )({});
  } catch (error: any) {
    return RequestHandler.sendError(response, error);
  }
};

export const getCurrentlyBorrowedBooks = async (
  request: any,
  response: Response
) => {
  const userId = request.user.id;
  const pageSize = parseInt(request.query.pageSize as string) || 10;
  const pageNumber = parseInt(request.query.pageNumber as string) || 1;
  try {
    const totalDocs = await prisma.borrowing.count({
      where: {
        userId,
        returned: false,
      },
    });

    const pagination = paginationOption(pageSize, pageNumber, totalDocs);

    const borrowedBooks = await prisma.borrowing.findMany({
      where: {
        userId,
        returned: false,
      },
      include: {
        book: true,
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    const paginatedResponse = {
      pagination,
      borrowedBooks,
    };

    return RequestHandler.sendSuccess(
      response,
      borrowedBooks.length === 0
        ? 'No books currently borrowed'
        : 'Currently borrowed books retrieved successfully'
    )({
      paginatedResponse,
    });
  } catch (error: any) {
    return RequestHandler.sendError(response, error);
  }
};

export const listAllOverdueBooks = async (request: any, response: Response) => {
  try {
    const currentDate = new Date();
    const pageSize = parseInt(request.query.pageSize as string) || 10;
    const pageNumber = parseInt(request.query.pageNumber as string) || 1;

    const totalDocs = await prisma.borrowing.count({
      where: {
        dueDate: {
          lt: currentDate,
        },
        returned: false,
      },
    });

    const pagination = paginationOption(pageSize, pageNumber, totalDocs);

    const overdueBooks = await prisma.borrowing.findMany({
      where: {
        dueDate: {
          lt: currentDate,
        },
        returned: false,
      },
      include: {
        book: true,
        user: true,
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    const paginatedResponse = {
      pagination,
      overdueBooks,
    };

    return RequestHandler.sendSuccess(
      response,
      overdueBooks.length === 0
        ? 'No overdue books found'
        : 'Overdue books retrieved successfully'
    )({
      paginatedResponse,
    });
  } catch (error: any) {
    return RequestHandler.sendError(response, error);
  }
};

export const checkBorrowerOverdueBooks = async (
  request: any,
  response: Response
) => {
  const userId = request.user.id;
  const pageSize = parseInt(request.query.pageSize as string) || 10;
  const pageNumber = parseInt(request.query.pageNumber as string) || 1;
  try {
    const currentDate = new Date();

    const totalDocs = await prisma.borrowing.count({
      where: {
        userId,
        dueDate: {
          lt: currentDate,
        },
        returned: false,
      },
    });

    const pagination = paginationOption(pageSize, pageNumber, totalDocs);

    const overdueBooks = await prisma.borrowing.findMany({
      where: {
        userId,
        dueDate: {
          lt: currentDate,
        },
        returned: false,
      },
      include: {
        book: true,
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    const paginatedResponse = {
      pagination,
      overdueBooks,
    };

    return RequestHandler.sendSuccess(
      response,
      overdueBooks.length === 0
        ? 'You have no overdue books'
        : 'Your overdue books retrieved successfully'
    )({
      paginatedResponse,
    });
  } catch (error: any) {
    return RequestHandler.sendError(response, error);
  }
};
