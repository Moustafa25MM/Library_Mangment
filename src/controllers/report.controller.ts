import prisma from '../database';
import { Request, Response } from 'express';
import RequestHandler from '../handlers/requestHandler';
import { addDays, subMonths, formatISO } from 'date-fns';
import { writeDataToCsvFile } from '../utils/csvWriter';
import { OverdueBookReport } from '../types/reports';

export const getOverdueBooks = async (request: Request, response: Response) => {
  try {
    const overdueBooks = await prisma.borrowing.findMany({
      where: {
        dueDate: {
          lt: new Date(),
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
