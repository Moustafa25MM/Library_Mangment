import { Router } from 'express';
import { updateUser } from '../controllers/user.controller';
import { authMethods } from '../middlewares/auth';
import { isUser } from '../middlewares/role';

const router = Router();

router.put('/update', authMethods.isAuthenicated, isUser, updateUser);

export const UserRoutes: Router = router;
