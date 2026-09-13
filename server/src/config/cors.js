function normalizeOrigin(value) {
  if (!value) return '';
  return value.trim().replace(/\/$/, '');
}

export function getAllowedOrigins() {
  const raw = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  return raw.split(',').map(normalizeOrigin).filter(Boolean);
}

/** Autorise aussi les previews Vercel si CLIENT_ORIGIN pointe déjà vers *.vercel.app */
export function isOriginAllowed(origin) {
  if (!origin) return true;

  const requestOrigin = normalizeOrigin(origin);
  const allowed = getAllowedOrigins();

  if (allowed.includes(requestOrigin)) return true;

  const vercelPrimary = allowed.find((o) => o.includes('.vercel.app'));
  if (vercelPrimary) {
    return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(requestOrigin);
  }

  return false;
}

export function corsOrigin(origin, callback) {
  if (isOriginAllowed(origin)) {
    callback(null, origin || true);
    return;
  }
  console.warn(
    `[CORS] Blocked origin: ${origin}. Set CLIENT_ORIGIN on Render to: ${origin}`
  );
  callback(null, false);
}

export function logCorsConfig() {
  console.log(`[CORS] Allowed origins: ${getAllowedOrigins().join(', ') || '(none)'}`);
  if (getAllowedOrigins().some((o) => o.includes('.vercel.app'))) {
    console.log('[CORS] Vercel preview URLs (*.vercel.app) also allowed');
  }
}
