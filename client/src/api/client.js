const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Thin fetch wrapper: builds the URL, attaches JSON headers and the admin
 * token (if present), and throws a readable Error on non-2xx responses so
 * callers can just try/catch and show err.message to the user.
 */
async function request(path, { method = 'GET', body, token, params } = {}) {
  let url = `${API_BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new Error(data?.error || `Errore ${res.status}`);
  }
  return data;
}

export const api = {
  // Public content
  getSettings: () => request('/settings'),
  getServices: () => request('/services'),
  getContentBlocks: (section) => request('/content-blocks', { params: { section } }),
  getTeam: () => request('/team'),
  getTestimonials: () => request('/testimonials'),
  submitContact: (payload) => request('/contact', { method: 'POST', body: payload }),

  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/auth/me', { token }),

  // Admin CRUD (generic resource, e.g. "services", "team", "testimonials")
  adminList: (resource, token, params) => request(`/${resource}/admin`, { token, params }),
  adminCreate: (resource, token, payload) => request(`/${resource}`, { method: 'POST', body: payload, token }),
  adminUpdate: (resource, token, id, payload) => request(`/${resource}/${id}`, { method: 'PUT', body: payload, token }),
  adminDelete: (resource, token, id) => request(`/${resource}/${id}`, { method: 'DELETE', token }),
  adminUpdateSettings: (token, payload) => request('/settings', { method: 'PUT', body: payload, token }),

  // Contact inbox (admin)
  adminListContacts: (token) => request('/contact/admin', { token }),
  adminSetContactHandled: (token, id, handled) =>
    request(`/contact/admin/${id}`, { method: 'PUT', body: { handled }, token }),
  adminDeleteContact: (token, id) => request(`/contact/admin/${id}`, { method: 'DELETE', token }),
};
