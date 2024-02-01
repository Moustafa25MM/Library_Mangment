import { Router } from 'express';
import { AuthRoutes } from './auth';
import { AdminRoutes } from './admin';
import { UserRoutes } from './user';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/admin', AdminRoutes);
router.use('/user', UserRoutes);

export const indexRouter: Router = router;
