import { Router } from 'express';
import { AuthRoutes } from './user';

const router = Router();

router.use('/auth', AuthRoutes);

export const indexRouter: Router = router;
