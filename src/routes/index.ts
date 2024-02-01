import { Router } from 'express';
import { AuthRoutes } from './auth';
import { AdminRoutes } from './admin';
import { UserRoutes } from './user';
import { BookRoutes } from './book';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/admin', AdminRoutes);
router.use('/user', UserRoutes);
router.use('/book', BookRoutes);

export const indexRouter: Router = router;
