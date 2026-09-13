import { Router } from 'express';
import { EDITOR_USERNAME, EDITOR_PASSWORD } from '../config/auth.js';
import { createSessionToken, isEditor } from '../middleware/auth.js';
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  clearSessionCookieOptions,
} from '../config/cookies.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== EDITOR_USERNAME || password !== EDITOR_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = createSessionToken();
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  res.json({ ok: true, isEditor: true });
});

router.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, clearSessionCookieOptions());
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  res.json({ isEditor: isEditor(req) });
});

export default router;
