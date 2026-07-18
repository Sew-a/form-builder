import { z } from 'zod';

// ---------- Field types ----------
export const FIELD_TYPES = [
  'text',
  'textarea',
  'checkbox',
  'radio',
  'dropdown',
  'date',
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.enum(FIELD_TYPES),
  label: z.string().min(1).max(200),
  placeholder: z.string().max(200).optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // for radio / dropdown
  order: z.number(),
});

export type FormField = z.infer<typeof FormFieldSchema>;

// ---------- Form ----------
export const CollaboratorSchema = z.object({
  userId: z.string(),
  role: z.enum(['editor', 'viewer']),
});

export type Collaborator = z.infer<typeof CollaboratorSchema>;

export const FormSettingsSchema = z.object({
  isPublished: z.boolean().default(false),
  submitMessage: z.string().default('Thanks for your response!'),
});

export const CreateFormSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
});

export type CreateFormInput = z.infer<typeof CreateFormSchema>;

export const UpdateFormSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  description: z.string().max(1000).optional(),
  fields: z.array(FormFieldSchema).optional(),
  settings: FormSettingsSchema.partial().optional(),
});

export type UpdateFormInput = z.infer<typeof UpdateFormSchema>;

export interface FormDTO {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  collaborators: Collaborator[];
  fields: FormField[];
  settings: z.infer<typeof FormSettingsSchema>;
  createdAt: string;
  updatedAt: string;
}

// ---------- Auth ----------
export const RegisterSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
}

// ---------- Responses (form submissions) ----------
export const AnswerSchema = z.object({
  fieldId: z.string(),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
});

export const SubmitResponseSchema = z.object({
  answers: z.array(AnswerSchema),
});

export type SubmitResponseInput = z.infer<typeof SubmitResponseSchema>;

// ---------- Socket.io event contracts ----------
// Keeping these in one place avoids "stringly typed" event names drifting
// between client and server.
export const SOCKET_EVENTS = {
  JOIN_FORM: 'form:join',
  LEAVE_FORM: 'form:leave',
  USER_JOINED: 'user:joined',
  USER_LEFT: 'user:left',
  PRESENCE_LIST: 'presence:list',
  FIELD_ADD: 'field:add',
  FIELD_UPDATE: 'field:update',
  FIELD_REORDER: 'field:reorder',
  FIELD_DELETE: 'field:delete',
} as const;

export interface PresenceUser {
  socketId: string;
  userId: string;
  name: string;
}
