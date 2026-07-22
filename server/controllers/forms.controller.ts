import { Response } from 'express';
import { Form } from '../db/models/Form';
import type { CollaboratorSubdoc } from '../db/models/Form';
import { ResponseModel } from '../db/models/Response';
import { CreateFormSchema, UpdateFormSchema, SubmitResponseSchema } from '../../shared/types';
import { ApiError } from '../middleware/error.middleware';
import { AuthedRequest } from '../middleware/auth.middleware';

// Convert a Mongoose document to a plain object with `id` as string
function toFormDTO(doc: any) {
  const obj = doc.toObject({ versionKey: false });
  return {
    id: String(obj._id),
    title: obj.title,
    description: obj.description,
    ownerId: String(obj.ownerId),
    collaborators: (obj.collaborators || []).map((c: any) => ({
      userId: String(c.userId),
      role: c.role,
    })),
    fields: (obj.fields || []).map((f: any) => ({
      id: f.id,
      type: f.type,
      label: f.label,
      placeholder: f.placeholder,
      required: f.required,
      options: f.options,
      order: f.order,
      content: f.content,
      backgroundColor: f.backgroundColor,
      borderColor: f.borderColor,
      borderRadius: f.borderRadius,
      width: f.width,
    })),
    settings: obj.settings,
    createdAt: obj.createdAt?.toISOString?.() || obj.createdAt,
    updatedAt: obj.updatedAt?.toISOString?.() || obj.updatedAt,
  };
}

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

  res.json(forms.map(toFormDTO));
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

  res.status(201).json(toFormDTO(form));
}

export async function getForm(req: AuthedRequest, res: Response) {
  const form = await loadOwnedForm(req.params.id, req.userId!);
  res.json(toFormDTO(form));
}

export async function updateForm(req: AuthedRequest, res: Response) {
  const parsed = UpdateFormSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');

  const form = await loadOwnedForm(req.params.id, req.userId!);

  Object.assign(form, parsed.data);
  await form.save();

  res.json(toFormDTO(form));
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
  const dto = toFormDTO(form);
  res.json({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    fields: dto.fields,
    settings: { submitMessage: dto.settings.submitMessage },
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

  res.status(201).json({ id: String(response._id) });
}

export async function listResponses(req: AuthedRequest, res: Response) {
  await loadOwnedForm(req.params.id, req.userId!); // ensures access
  const responses = await ResponseModel.find({ formId: req.params.id }).sort({ submittedAt: -1 });
  res.json(responses.map((r: any) => ({
    id: String(r._id),
    formId: String(r.formId),
    answers: r.answers,
    submittedAt: r.submittedAt?.toISOString?.() || r.submittedAt,
  })));
}
