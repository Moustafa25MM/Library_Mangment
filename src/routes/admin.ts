import { Router } from 'express';
import {
  createAdmin,
  updateAdmin,
  deleteBorrower,
  listBorrowers,
} from '../controllers/admin.controller';
import { authMethods } from '../middlewares/auth';
import { isAdmin } from '../middlewares/role';

const router = Router();

router.post('/create/admin', authMethods.isAuthenicated, isAdmin, createAdmin);
router.get(
  '/get/borrowers',
  authMethods.isAuthenicated,
  isAdmin,
  listBorrowers
);
router.put('/update/admin', authMethods.isAuthenicated, isAdmin, updateAdmin);
router.delete(
  '/delete/:userId/borrower',
  authMethods.isAuthenicated,
  isAdmin,
  deleteBorrower
);

export const AdminRoutes: Router = router;
