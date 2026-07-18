import { Response } from 'express';
import { Form } from '../db/models/Form';
import type { CollaboratorSubdoc } from '../db/models/Form';
import { ResponseModel } from '../db/models/Response';
import { CreateFormSchema, UpdateFormSchema, SubmitResponseSchema } from '../../shared/types';
import { ApiError } from '../middleware/error.middleware';
import { AuthedRequest } from '../middleware/auth.middleware';

// Helper: can this user view/edit this form?
async function loadOwnedForm(formId: string, userId: string) {
  const form = await Form.findById(formId);
  if (!form) throw new ApiError(404, 'Form not found');

  const isOwner = form.ownerId.toString() === userId;
  const isCollaborator = form.collaborators.some(
    (c: CollaboratorSubdoc) => c.userId.toString() === userId,
  );
  if (!isOwner && !isCollaborator) throw new ApiError(403, 'You do not have access to this form');

  return form;
}

export async function listForms(req: AuthedRequest, res: Response) {
  const forms = await Form.find({
    $or: [{ ownerId: req.userId }, { 'collaborators.userId': req.userId }],
  }).sort({ updatedAt: -1 });

  res.json(forms);
}

export async function createForm(req: AuthedRequest, res: Response) {
  const parsed = CreateFormSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');

  const form = await Form.create({
    ...parsed.data,
    ownerId: req.userId,
    fields: [],
    collaborators: [],
  });

  res.status(201).json(form);
}

export async function getForm(req: AuthedRequest, res: Response) {
  const form = await loadOwnedForm(req.params.id, req.userId!);
  res.json(form);
}

export async function updateForm(req: AuthedRequest, res: Response) {
  const parsed = UpdateFormSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');

  const form = await loadOwnedForm(req.params.id, req.userId!);

  Object.assign(form, parsed.data);
  await form.save();

  res.json(form);
}

export async function deleteForm(req: AuthedRequest, res: Response) {
  const form = await Form.findById(req.params.id);
  if (!form) throw new ApiError(404, 'Form not found');
  if (form.ownerId.toString() !== req.userId) {
    throw new ApiError(403, 'Only the owner can delete this form');
  }
  await form.deleteOne();
  res.status(204).send();
}

// Public: anyone with the link can view a published form (no auth required)
export async function getPublicForm(req: AuthedRequest, res: Response) {
  const form = await Form.findById(req.params.id);
  if (!form || !form.settings.isPublished) {
    throw new ApiError(404, 'Form not found or not published');
  }
  res.json({
    id: form._id,
    title: form.title,
    description: form.description,
    fields: form.fields,
    settings: { submitMessage: form.settings.submitMessage },
  });
}

export async function submitResponse(req: AuthedRequest, res: Response) {
  const parsed = SubmitResponseSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');

  const form = await Form.findById(req.params.id);
  if (!form || !form.settings.isPublished) {
    throw new ApiError(404, 'Form not found or not published');
  }

  const response = await ResponseModel.create({
    formId: form._id,
    answers: parsed.data.answers,
  });

  res.status(201).json({ id: response._id });
}

export async function listResponses(req: AuthedRequest, res: Response) {
  await loadOwnedForm(req.params.id, req.userId!); // ensures access
  const responses = await ResponseModel.find({ formId: req.params.id }).sort({ submittedAt: -1 });
  res.json(responses);
}
