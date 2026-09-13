import { SESSION_COOKIE } from '../middleware/auth.js';

/** Cross-site (Vercel + Render) requires SameSite=None + Secure */
export function sessionCookieOptions() {
  const crossOrigin = process.env.CROSS_ORIGIN === 'true' || process.env.COOKIE_SAME_SITE === 'none';
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    sameSite: crossOrigin ? 'none' : 'lax',
    secure: isProd || crossOrigin,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function clearSessionCookieOptions() {
  const opts = sessionCookieOptions();
  return {
    httpOnly: opts.httpOnly,
    sameSite: opts.sameSite,
    secure: opts.secure,
  };
}

export { SESSION_COOKIE };
