import { getEditorToken, setEditorToken } from './editorToken';

const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getEditorToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  auth: {
    me: () => request('/api/auth/me'),
    login: async (body) => {
      const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
      if (data.token) setEditorToken(data.token);
      return data;
    },
    logout: async () => {
      try {
        await request('/api/auth/logout', { method: 'POST' });
      } finally {
        setEditorToken(null);
      }
    },
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
