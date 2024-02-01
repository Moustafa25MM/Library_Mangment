import { Router } from 'express';
import { AuthRoutes } from './auth';
import { AdminRoutes } from './admin';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/admin', AdminRoutes);

export const indexRouter: Router = router;
