import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../db/models/User';
import { Form } from '../db/models/Form';
import { ResponseModel } from '../db/models/Response';
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  UpdateAvatarSchema,
  DeleteAccountSchema,
  AuthUserDTO,
} from '../../shared/types';
import { ApiError } from '../middleware/error.middleware';
import { AuthedRequest } from '../middleware/auth.middleware';

const COOKIE_NAME = process.env.COOKIE_NAME || 'fb_token';

function signToken(userId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, 'Server misconfigured: JWT_SECRET missing');
  return jwt.sign({ sub: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
}

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function toAuthUser(user: UserDocument): AuthUserDTO {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    ...(user.nickname ? { nickname: user.nickname } : {}),
    ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
  };
}

export async function register(req: AuthedRequest, res: Response) {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }
  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with that email already exists');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(201).json(toAuthUser(user));
}

export async function login(req: AuthedRequest, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }
  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  res.json(toAuthUser(user));
}

export async function logout(_req: AuthedRequest, res: Response) {
  res.clearCookie(COOKIE_NAME);
  res.status(204).send();
}

export async function me(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(toAuthUser(user));
}

export async function updateProfile(req: AuthedRequest, res: Response) {
  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }

  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, 'User not found');

  const { name, nickname } = parsed.data;
  if (name !== undefined) user.name = name;
  if (nickname !== undefined) {
    user.nickname = nickname === '' ? undefined : nickname;
  }

  await user.save();
  res.json(toAuthUser(user));
}

export async function changePassword(req: AuthedRequest, res: Response) {
  const parsed = ChangePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }

  const user = await User.findById(req.userId).select('+passwordHash');
  if (!user) throw new ApiError(404, 'User not found');

  const { currentPassword, newPassword } = parsed.data;
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Current password is incorrect');

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ ok: true });
}

export async function updateAvatar(req: AuthedRequest, res: Response) {
  const parsed = UpdateAvatarSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }

  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, 'User not found');

  const { avatarUrl } = parsed.data;
  user.avatarUrl = avatarUrl === '' ? undefined : avatarUrl;
  await user.save();

  res.json(toAuthUser(user));
}

export async function deleteAccount(req: AuthedRequest, res: Response) {
  const parsed = DeleteAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }

  const user = await User.findById(req.userId).select('+passwordHash');
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Password is incorrect');

  const ownedForms = await Form.find({ ownerId: user._id }).select('_id');
  const formIds = ownedForms.map((f) => f._id);

  if (formIds.length > 0) {
    await ResponseModel.deleteMany({ formId: { $in: formIds } });
    await Form.deleteMany({ _id: { $in: formIds } });
  }

  await User.deleteOne({ _id: user._id });
  res.clearCookie(COOKIE_NAME);
  res.status(204).send();
}
