import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User';
import { RegisterSchema, LoginSchema } from '../../shared/types';
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

  res.status(201).json({ id: user._id, name: user.name, email: user.email });
}

export async function login(req: AuthedRequest, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }
  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  res.json({ id: user._id, name: user.name, email: user.email });
}

export async function logout(_req: AuthedRequest, res: Response) {
  res.clearCookie(COOKIE_NAME);
  res.status(204).send();
}

export async function me(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId).select('name email');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ id: user._id, name: user.name, email: user.email });
}
