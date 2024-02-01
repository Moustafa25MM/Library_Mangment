import { Router } from 'express';
import {
  loginBorrower,
  registerBorrower,
} from '../controllers/user.controller';

const router = Router();

router.post('/register', registerBorrower);
router.post('/login', loginBorrower);

export const UserRoutes: Router = router;
