import { Router } from 'express';
import { updateUser } from '../controllers/user.controller';
import { authMethods } from '../middlewares/auth';
import { isUser } from '../middlewares/role';
import { userValidationRules } from '../middlewares/inputValidation';

const router = Router();

router.put(
  '/update',
  userValidationRules,
  authMethods.isAuthenicated,
  isUser,
  updateUser
);

export const UserRoutes: Router = router;
