export type OverdueBookReport = {
  bookTitle: string;
  author: string;
  isbn: string;
  borrowedDate: string;
  dueDate: string;
  borrowerName: string;
  borrowerEmail: string;
};

export type BorrowingReport = {
  borrowingId: string;
  bookTitle: string;
  borrowedDate: string;
  dueDate: string;
  returned: boolean;
};
