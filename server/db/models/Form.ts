import { Schema, model, models, Document, Types } from 'mongoose';
import { FIELD_TYPES } from '../../../shared/types';

export interface FormFieldSubdoc {
  id: string;
  type: (typeof FIELD_TYPES)[number];
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
  content?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  width?: 'full' | 'half' | 'auto';
}

export interface CollaboratorSubdoc {
  userId: Types.ObjectId;
  role: 'editor' | 'viewer';
}

export interface FormDocument extends Document {
  title: string;
  description?: string;
  ownerId: Types.ObjectId;
  collaborators: CollaboratorSubdoc[];
  fields: FormFieldSubdoc[];
  settings: {
    isPublished: boolean;
    submitMessage: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema<FormFieldSubdoc>(
  {
    id: { type: String, required: true },
    type: { type: String, enum: FIELD_TYPES, required: true },
    label: { type: String, required: true },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
    order: { type: Number, required: true },
    content: { type: String },
    backgroundColor: { type: String },
    borderColor: { type: String },
    borderRadius: { type: String },
    width: { type: String, enum: ['full', 'half', 'auto'] },
  },
  { _id: false },
);

const CollaboratorSchema = new Schema<CollaboratorSubdoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['editor', 'viewer'], default: 'editor' },
  },
  { _id: false },
);

const FormSchema = new Schema<FormDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    collaborators: [CollaboratorSchema],
    fields: [FormFieldSchema],
    settings: {
      isPublished: { type: Boolean, default: false },
      submitMessage: { type: String, default: 'Thanks for your response!' },
    },
  },
  { timestamps: true },
);

export const Form = models.Form || model<FormDocument>('Form', FormSchema);
