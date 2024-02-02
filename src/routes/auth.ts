import { Router } from 'express';
import { loginUser, registerBorrower } from '../controllers/auth.controller';
import { userValidationRules } from '../middlewares/inputValidation';
import { loginRateLimiter } from '../rateLimiters/loginRateLimiter';

const router = Router();

router.post('/register', userValidationRules, registerBorrower);
router.post('/login', loginRateLimiter, loginUser);

export const AuthRoutes: Router = router;
