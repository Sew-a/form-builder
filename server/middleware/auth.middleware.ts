import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const cookieName = process.env.COOKIE_NAME || 'fb_token';
  const token = req.cookies?.[cookieName];

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET missing');
    const decoded = jwt.verify(token, secret) as { sub: string };
    req.userId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

// Same check but doesn't reject — useful for public routes that behave
// differently when a user happens to be logged in (e.g. showing edit controls).
export function attachUserIfPresent(req: AuthedRequest, _res: Response, next: NextFunction) {
  const cookieName = process.env.COOKIE_NAME || 'fb_token';
  const token = req.cookies?.[cookieName];
  if (!token) return next();

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return next();
    const decoded = jwt.verify(token, secret) as { sub: string };
    req.userId = decoded.sub;
  } catch {
    // ignore invalid token for optional-auth routes
  }
  next();
}
