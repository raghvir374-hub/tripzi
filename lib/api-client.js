'use client'

export const api = {
  async get(path) {
    const r = await fetch(`/api${path}`, { headers: authHeaders() })
    return r.json()
  },
  async post(path, body) {
    const r = await fetch(`/api${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) })
    return r.json()
  },
  async put(path, body) {
    const r = await fetch(`/api${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) })
    return r.json()
  },
  async patch(path, body) {
    const r = await fetch(`/api${path}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) })
    return r.json()
  },
  async del(path) {
    const r = await fetch(`/api${path}`, { method: 'DELETE', headers: authHeaders() })
    return r.json()
  },
}

function authHeaders() {
  if (typeof window === 'undefined') return {}
  const t = localStorage.getItem('admin_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}
