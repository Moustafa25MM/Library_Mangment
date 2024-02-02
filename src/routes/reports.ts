import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { isAdmin } from '../middlewares/role';
import { getOverdueBooks } from '../controllers/report.controller';

const router = Router();

router.get(
  '/overdue/books',
  authMethods.isAuthenicated,
  isAdmin,
  getOverdueBooks
);

export const ReportRoutes: Router = router;
