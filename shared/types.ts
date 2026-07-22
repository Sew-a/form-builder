import { z } from 'zod';

// ---------- Field types ----------
export const FIELD_TYPES = [
  'text',
  'email',
  'number',
  'textarea',
  'checkbox',
  'radio',
  'dropdown',
  'date',
  'file',
  'rating',
  'section',
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const COLOR_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Dark', value: '#292a2e' },
  { label: 'Dark Alt', value: '#1f2023' },
  { label: 'Dark Surface', value: '#363739' },
  { label: 'Amber Glow', value: '#2a2520' },
  { label: 'Blue Tint', value: '#1e2a3a' },
  { label: 'Green Tint', value: '#1e2a22' },
  { label: 'Rose Tint', value: '#2a1e22' },
  { label: 'Purple Tint', value: '#251e2a' },
  { label: 'Slate', value: '#2d3035' },
];

export const BORDER_COLOR_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Dark', value: '#363739' },
  { label: 'Accent', value: '#5b8def' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Slate', value: '#64748b' },
  { label: 'Muted', value: '#4b5058' },
];

export const BORDER_RADIUS_OPTIONS = [
  { label: 'None', value: '0' },
  { label: 'Small', value: '0.375rem' },
  { label: 'Medium', value: '0.5rem' },
  { label: 'Large', value: '0.75rem' },
  { label: 'XL', value: '1rem' },
  { label: 'Full', value: '9999px' },
];

export const WIDTH_OPTIONS = [
  { label: 'Full', value: 'full' },
  { label: 'Half', value: 'half' },
  { label: 'Auto', value: 'auto' },
] as const;

export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.enum(FIELD_TYPES),
  label: z.string().min(1).max(200),
  placeholder: z.string().max(200).optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  order: z.number(),
  content: z.string().optional(),
  backgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderRadius: z.string().optional(),
  width: z.enum(['full', 'half', 'auto']).optional(),
  maxLength: z.number().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  maxRating: z.number().optional(),
  fontSize: z.number().optional(),
  color: z.string().optional(),
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
  nickname?: string;
  avatarUrl?: string;
}

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  nickname: z
    .union([
      z.string().min(1).max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Nickname can only contain letters, numbers, _ and -'),
      z.literal(''),
    ])
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8).max(100),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

const AVATAR_DATA_URL_MAX = 500_000;

export const UpdateAvatarSchema = z.object({
  avatarUrl: z.union([
    z.literal(''),
    z
      .string()
      .max(AVATAR_DATA_URL_MAX, 'Image is too large')
      .refine(
        (v) => v.startsWith('data:image/jpeg;base64,') || v.startsWith('data:image/png;base64,') || v.startsWith('data:image/webp;base64,'),
        'Invalid image format',
      ),
  ]),
});

export type UpdateAvatarInput = z.infer<typeof UpdateAvatarSchema>;

export const DeleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete your account'),
});

export type DeleteAccountInput = z.infer<typeof DeleteAccountSchema>;

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
