import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { isAdmin } from '../middlewares/role';
import {
  getBorrowingsInPeriod,
  getLastMonthBorrowings,
  getOverdueBooks,
} from '../controllers/report.controller';

const router = Router();

router.get(
  '/overdue/books',
  authMethods.isAuthenicated,
  isAdmin,
  getOverdueBooks
);

router.get(
  '/lastmonth/borrowings/books',
  authMethods.isAuthenicated,
  isAdmin,
  getLastMonthBorrowings
);

router.get(
  '/borrowings-in-period',
  authMethods.isAuthenicated,
  isAdmin,
  getBorrowingsInPeriod
);

export const ReportRoutes: Router = router;
