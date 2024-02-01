import prisma from '../database';
import { Request, Response } from 'express';
import requestHandler from '../handlers/requestHandler';

export const addBook = async (request: Request, response: Response) => {
  const { title, author, isbn, quantity, shelfLocation } = request.body;

  // Check for existing book with the same ISBN
  const existingBook = await prisma.book.findUnique({
    where: { isbn },
  });

  if (existingBook) {
    return response
      .status(409)
      .json({ msg: 'A book with the same ISBN already exists.' });
  }

  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        quantity,
        shelfLocation,
      },
    });

    return requestHandler.sendSuccess(
      response,
      'Book added successfully'
    )({ book });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const updateBook = async (request: Request, response: Response) => {
  const { bookId } = request.params;
  const { title, author, isbn, quantity, shelfLocation } = request.body;

  const updateData: {
    title?: string;
    author?: string;
    isbn?: string;
    quantity?: number;
    shelfLocation?: string;
  } = {};

  if (title !== undefined) updateData.title = title;
  if (author !== undefined) updateData.author = author;
  if (isbn !== undefined) updateData.isbn = isbn;
  if (quantity !== undefined) updateData.quantity = quantity;
  if (shelfLocation !== undefined) updateData.shelfLocation = shelfLocation;

  // If ISBN is updated, check for existing book with the same ISBN
  if (isbn !== undefined) {
    const existingBook = await prisma.book.findFirst({
      where: {
        isbn,
        NOT: {
          id: bookId,
        },
      },
    });

    if (existingBook) {
      return response
        .status(409)
        .json({ msg: 'Another book with the same ISBN already exists.' });
    }
  }

  try {
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: updateData,
    });

    return requestHandler.sendSuccess(
      response,
      'Book updated successfully'
    )({ updatedBook });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return response.status(404).json({ msg: 'Error: Book not found.' });
    }
    return requestHandler.sendError(response, error);
  }
};

export const deleteBook = async (request: Request, response: Response) => {
  const { bookId } = request.params;

  try {
    await prisma.book.delete({
      where: { id: bookId },
    });

    return requestHandler.sendSuccess(
      response,
      'Book deleted successfully'
    )({});
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const listBooks = async (_: Request, response: Response) => {
  try {
    const books = await prisma.book.findMany();

    return requestHandler.sendSuccess(
      response,
      'Books retrieved successfully'
    )({ books });
  } catch (error: any) {
    return requestHandler.sendError(response, error);
  }
};

export const searchBooks = async (request: any, response: Response) => {
  // Extract title, author, and isbn from the query parameters
  const { title, author, isbn } = request.query;

  // Initialize an object to hold the search conditions
  const searchConditions: any = {};

  // If title is provided, add its condition into the object
  if (title) {
    searchConditions.title = {
      contains: title,
      mode: 'insensitive',
    };
  }

  // If author is provided, add its condition into the object
  if (author) {
    searchConditions.author = {
      contains: author,
      mode: 'insensitive',
    };
  }

  // If isbn is provided, add its condition into the object
  if (isbn) {
    searchConditions.isbn = {
      contains: isbn,
      mode: 'insensitive',
    };
  }

  try {
    // Perform the query with the search conditions
    const books = await prisma.book.findMany({
      where: {
        AND: [searchConditions],
      },
    });
    // If books are found, send them back in the response
    if (books.length > 0) {
      return requestHandler.sendSuccess(
        response,
        'Books found successfully'
      )({ books });
    } else {
      return requestHandler.sendSuccess(
        response,
        'No books found with the given criteria.'
      )({});
    }
  } catch (error: any) {
    // Handle any errors that occur during the database query
    return requestHandler.sendError(response, error);
  }
};