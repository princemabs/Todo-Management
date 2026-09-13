const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  auth: {
    me: () => request('/api/auth/me'),
    login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
  },
  tasks: {
    list: (from, to) => request(`/api/tasks?from=${from}&to=${to}`),
    create: (body) => request('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
  },
  meta: {
    get: () => request('/api/meta'),
    patch: (body) => request('/api/meta', { method: 'PATCH', body: JSON.stringify(body) }),
  },
  public: {
    today: () => request('/api/public/today'),
  },
};
