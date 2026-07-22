import { Router } from 'express';
import {
  register,
  login,
  logout,
  me,
  updateProfile,
  changePassword,
  updateAvatar,
  deleteAccount,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { API_ROUTES } from './constants';

const router = Router();

router.post(API_ROUTES.auth.register, asyncHandler(register));
router.post(API_ROUTES.auth.login, asyncHandler(login));
router.post(API_ROUTES.auth.logout, asyncHandler(logout));
router.get(API_ROUTES.auth.me, requireAuth, asyncHandler(me));
router.patch(API_ROUTES.auth.updateProfile, requireAuth, asyncHandler(updateProfile));
router.patch(API_ROUTES.auth.changePassword, requireAuth, asyncHandler(changePassword));
router.patch(API_ROUTES.auth.updateAvatar, requireAuth, asyncHandler(updateAvatar));
router.delete(API_ROUTES.auth.deleteAccount, requireAuth, asyncHandler(deleteAccount));

export default router;
