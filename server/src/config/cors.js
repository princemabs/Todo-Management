export function getAllowedOrigins() {
  const raw = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

export function corsOrigin(origin, callback) {
  const allowed = getAllowedOrigins();
  if (!origin || allowed.includes(origin)) {
    callback(null, true);
    return;
  }
  callback(null, false);
}
