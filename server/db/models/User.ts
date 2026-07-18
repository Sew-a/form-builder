import { Schema, model, models, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Avoid model overwrite errors when tsx/next hot-reloads in dev
export const User = models.User || model<UserDocument>('User', UserSchema);
