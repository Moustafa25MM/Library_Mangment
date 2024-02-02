import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { isAdmin, isUser } from '../middlewares/role';
import { getOverdueBooks } from '../controllers/report.controller';

const router = Router();

router.get('/overdue/books', getOverdueBooks);

export const ReportRoutes: Router = router;
