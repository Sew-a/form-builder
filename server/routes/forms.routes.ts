import { Router } from 'express';
import {
  listForms,
  createForm,
  getForm,
  updateForm,
  deleteForm,
  getPublicForm,
  submitResponse,
  listResponses,
} from '../controllers/forms.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// Public routes (no auth) — must come before the `/:id` authed route
router.get('/:id/public', asyncHandler(getPublicForm));
router.post('/:id/responses', asyncHandler(submitResponse));

// Authenticated routes
router.get('/', requireAuth, asyncHandler(listForms));
router.post('/', requireAuth, asyncHandler(createForm));
router.get('/:id', requireAuth, asyncHandler(getForm));
router.patch('/:id', requireAuth, asyncHandler(updateForm));
router.delete('/:id', requireAuth, asyncHandler(deleteForm));
router.get('/:id/responses', requireAuth, asyncHandler(listResponses));

export default router;
