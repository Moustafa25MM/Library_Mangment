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

const router = Router();

router.post(
  '/add',
  bookValidationRules,
  authMethods.isAuthenicated,
  isAdmin,
  addBook
);
router.get('/list/books', authMethods.isAuthenicated, listBooks);
router.get('/search/books', authMethods.isAuthenicated, searchBooks);
router.put(
  '/update/:bookId',
  bookValidationRules,
  authMethods.isAuthenicated,
  isAdmin,
  updateBook
);
router.delete(
  '/delete/:bookId',
  authMethods.isAuthenicated,
  isAdmin,
  deleteBook
);

export const BookRoutes: Router = router;
