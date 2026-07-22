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

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', requireAuth, asyncHandler(me));
router.patch('/me', requireAuth, asyncHandler(updateProfile));
router.patch('/password', requireAuth, asyncHandler(changePassword));
router.patch('/avatar', requireAuth, asyncHandler(updateAvatar));
router.delete('/me', requireAuth, asyncHandler(deleteAccount));

export default router;
