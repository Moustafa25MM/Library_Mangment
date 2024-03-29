import { Router } from 'express';
import { AuthRoutes } from './auth';
import { AdminRoutes } from './admin';
import { UserRoutes } from './user';
import { BookRoutes } from './book';
import { BorrowingRoutes } from './borrowing';
import { ReportRoutes } from './reports';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/admin', AdminRoutes);
router.use('/user', UserRoutes);
router.use('/book', BookRoutes);
router.use('/borrowing', BorrowingRoutes);
router.use('/reports', ReportRoutes);

export const indexRouter: Router = router;
