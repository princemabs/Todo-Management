import crypto from 'crypto';
import { SESSION_SECRET, SESSION_COOKIE } from '../config/auth.js';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp < Date.now()) return null;
    if (payload.role !== 'editor') return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken() {
  return sign({ role: 'editor', exp: Date.now() + TOKEN_TTL_MS });
}

export function getSessionTokenFromRequest(req) {
  const fromCookie = req.cookies?.[SESSION_COOKIE];
  if (fromCookie) return fromCookie;

  const header = req.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  return null;
}

export function requireEditor(req, res, next) {
  const payload = verify(getSessionTokenFromRequest(req));
  if (!payload) {
    return res.status(401).json({ error: 'Editor authentication required' });
  }
  req.editor = true;
  next();
}

export function isEditor(req) {
  return !!verify(getSessionTokenFromRequest(req));
}

export { SESSION_COOKIE };
