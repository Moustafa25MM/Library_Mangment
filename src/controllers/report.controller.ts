import prisma from '../database';
import { Request, Response } from 'express';
import RequestHandler from '../handlers/requestHandler';
import { addDays, subMonths, formatISO, isValid, isAfter } from 'date-fns';
import { writeDataToCsvFile } from '../utils/csvWriter';
import { BorrowingReport, OverdueBookReport } from '../types/reports';

export const getOverdueBooks = async (request: Request, response: Response) => {
  const today = new Date();
  const oneMonthAgo = subMonths(today, 1);

  try {
    const overdueBooks = await prisma.borrowing.findMany({
      where: {
        dueDate: {
          lt: today,
          gte: oneMonthAgo,
        },
        returned: false,
      },
      include: {
        book: true,
        user: true,
      },
    });

    const overdueBookReports: OverdueBookReport[] = overdueBooks.map(
      (borrowing: any) => ({
        bookTitle: borrowing.book.title,
        author: borrowing.book.author,
        isbn: borrowing.book.isbn,
        borrowedDate: formatISO(borrowing.borrowedDate, {
          representation: 'date',
        }),
        dueDate: formatISO(borrowing.dueDate, { representation: 'date' }),
        borrowerName: borrowing.user.name,
        borrowerEmail: borrowing.user.email,
      })
    );

    // Use the CSV writer function with the correct headers
    const headers = [
      { id: 'bookTitle', title: 'Book Title' },
      { id: 'author', title: 'Author' },
      { id: 'isbn', title: 'ISBN' },
      { id: 'borrowedDate', title: 'Borrowed Date' },
      { id: 'dueDate', title: 'Due Date' },
      { id: 'borrowerName', title: 'Borrower Name' },
      { id: 'borrowerEmail', title: 'Borrower Email' },
    ];

    await writeDataToCsvFile(
      '../assets/reports/overdueBooksReport.csv',
      headers,
      overdueBookReports
    );

    return RequestHandler.sendSuccess(
      response,
      'Overdue books report generated successfully.'
    )({ overdueBookReports });
  } catch (error: any) {
    return RequestHandler.sendError(response, error);
  }
};

export const getLastMonthBorrowings = async (
  request: Request,
  response: Response
) => {
  const lastMonthDate = subMonths(new Date(), 1);

  try {
    const lastMonthBorrowings = await prisma.borrowing.findMany({
      where: {
        borrowedDate: {
          gte: lastMonthDate,
        },
      },
      include: {
        book: true,
      },
    });

    const borrowingReports: BorrowingReport[] = lastMonthBorrowings.map(
      (borrowing: any) => ({
        borrowingId: borrowing.id,
        bookTitle: borrowing.book.title,
        borrowedDate: formatISO(borrowing.borrowedDate, {
          representation: 'date',
        }),
        dueDate: formatISO(borrowing.dueDate, { representation: 'date' }),
        returned: borrowing.returned,
      })
    );

    const headers = [
      { id: 'borrowingId', title: 'Borrowing ID' },
      { id: 'bookTitle', title: 'Book Title' },
      { id: 'borrowedDate', title: 'Borrowed Date' },
      { id: 'dueDate', title: 'Due Date' },
      { id: 'returned', title: 'Returned' },
    ];

    await writeDataToCsvFile(
      '../assets/reports/lastMonthBorrowingsReport.csv',
      headers,
      borrowingReports
    );

    return RequestHandler.sendSuccess(
      response,
      'Last month borrowings report generated successfully.'
    )({ borrowingReports });
  } catch (error: any) {
    return RequestHandler.sendError(response, error);
  }
};

export const getBorrowingsInPeriod = async (
  request: Request,
  response: Response
) => {
  const { startDate, endDate } = request.query;

  if (!startDate || !endDate) {
    return response
      .status(404)
      .json({ error: 'Start date and end date are required.' });
  }

  const parsedStartDate = new Date(startDate as string);
  const parsedEndDate = new Date(endDate as string);

  if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
    return response.status(400).json({
      error:
        'Invalid date format. Please use ISO 8601 date format , something like : 2024-01-01 .',
    });
  }
  if (isAfter(parsedStartDate, parsedEndDate)) {
    return response
      .status(400)
      .json({ error: 'Start date must be before end date.' });
  }
  try {
    const periodBorrowings = await prisma.borrowing.findMany({
      where: {
        borrowedDate: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      },
      include: {
        book: true,
        user: true,
      },
    });

    const borrowingReports: BorrowingReport[] = periodBorrowings.map(
      (borrowing: any) => ({
        borrowingId: borrowing.id,
        bookTitle: borrowing.book.title,
        borrowedDate: formatISO(borrowing.borrowedDate, {
          representation: 'date',
        }),
        dueDate: formatISO(borrowing.dueDate, { representation: 'date' }),
        borrowerName: borrowing.user.name,
        borrowerEmail: borrowing.user.email,
        returned: borrowing.returned,
      })
    );

    const headers = [
      { id: 'borrowingId', title: 'Borrowing ID' },
      { id: 'bookTitle', title: 'Book Title' },
      { id: 'borrowedDate', title: 'Borrowed Date' },
      { id: 'dueDate', title: 'Due Date' },
      { id: 'borrowerName', title: 'Borrower Name' },
      { id: 'borrowerEmail', title: 'Borrower Email' },
      { id: 'returned', title: 'Returned' },
    ];

    const reportFileName = `borrowingsReport_${startDate}_${endDate}.csv`;
    await writeDataToCsvFile(
      `../assets/reports/${reportFileName}`,
      headers,
      borrowingReports
    );

    return RequestHandler.sendSuccess(
      response,
      'Borrowings report for the specified period generated successfully.'
    )({ borrowingReports });
  } catch (error: any) {
    return RequestHandler.sendError(response, error);
  }
};
