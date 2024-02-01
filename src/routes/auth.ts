import { Router } from 'express';
import { loginUser, registerBorrower } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerBorrower);
router.post('/login', loginUser);

export const AuthRoutes: Router = router;
