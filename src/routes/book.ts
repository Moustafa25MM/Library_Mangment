import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { isAdmin, isUser } from '../middlewares/role';
import {
  addBook,
  deleteBook,
  listBooks,
  searchBooks,
  updateBook,
} from '../controllers/book.contoller';
import { bookValidationRules } from '../middlewares/inputValidation';
import { searchRateLimiter } from '../rateLimiters/searchRateLimiter';

const router = Router();

router.post(
  '/add',
  bookValidationRules,
  authMethods.isAuthenicated,
  isAdmin,
  addBook
);
router.get('/list/books', authMethods.isAuthenicated, listBooks);
router.get(
  '/search/books',
  authMethods.isAuthenicated,
  searchRateLimiter,
  searchBooks
);
router.put('/update/:bookId', authMethods.isAuthenicated, isAdmin, updateBook);
router.delete(
  '/delete/:bookId',
  authMethods.isAuthenicated,
  isAdmin,
  deleteBook
);

export const BookRoutes: Router = router;
