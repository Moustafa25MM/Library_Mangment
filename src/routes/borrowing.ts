import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { isAdmin, isUser } from '../middlewares/role';
import {
  checkOutBook,
  getCurrentlyBorrowedBooks,
  listAllOverdueBooks,
  returnBook,
} from '../controllers/borrowing.controller';

const router = Router();

router.post('/checkout/book', authMethods.isAuthenicated, isUser, checkOutBook);
router.post('/return/book', authMethods.isAuthenicated, isUser, returnBook);
router.get(
  '/checked/books',
  authMethods.isAuthenicated,
  isUser,
  getCurrentlyBorrowedBooks
);
router.get(
  '/list/overdue/books',
  authMethods.isAuthenicated,
  isAdmin,
  listAllOverdueBooks
);

export const BorrowingRoutes: Router = router;
