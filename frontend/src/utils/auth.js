export function saveToken(token) { localStorage.setItem('ll_token', token) }
export function getToken() { return localStorage.getItem('ll_token') }
export function authHeaders() { const t = getToken(); return t ? { Authorization: `Bearer ${t}` } : {} }
