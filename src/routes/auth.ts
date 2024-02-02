import { Router } from 'express';
import { loginUser, registerBorrower } from '../controllers/auth.controller';
import { userValidationRules } from '../middlewares/inputValidation';

const router = Router();

router.post('/register', userValidationRules, registerBorrower);
router.post('/login', loginUser);

export const AuthRoutes: Router = router;
