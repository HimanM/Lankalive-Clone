import { getToken, authHeaders } from '../utils/auth'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

async function request(path, opts = {}) {
  const url = API_BASE + path
  const resp = await fetch(url, opts)
  const text = await resp.text()
  if (!resp.ok) throw new Error(text || resp.statusText)
  try {
    return JSON.parse(text || '{}')
  } catch (e) {
    return text
  }
}

function withJson(body) {
  return { headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }
}

export function login(email, password) {
  return request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
}

// Articles
export function listArticles(limit = 20, offset = 0) {
  return request(`/api/articles/?limit=${limit}&offset=${offset}`)
}

export function getArticle(slug) {
  return request(`/api/articles/${encodeURIComponent(slug)}`)
}

export function createArticle(article) {
  const opts = { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(article) }
  return request('/api/articles/', opts)
}

// Categories
export function listCategories() { return request('/api/categories/') }
export function createCategory(cat) { return request('/api/categories/', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(cat) }) }

// Tags
export function listTags() { return request('/api/tags/') }
export function createTag(t) { return request('/api/tags/', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(t) }) }

// Media
export function listMedia() { return request('/api/media/') }
export async function uploadMedia(file) {
  const fd = new FormData()
  fd.append('file', file)
  const opts = { method: 'POST', headers: { ...authHeaders() }, body: fd }
  return request('/api/media/upload', opts)
}

// Users
export function listUsers() { return request('/api/users/') }
export function createUser(u) { return request('/api/users/', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(u) }) }

// Homepage sections / items
export function listSections() { return request('/api/homepage_sections/') }
export function createSection(s) { return request('/api/homepage_sections/', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(s) }) }
export function listSectionItems(sectionId) { return request(`/api/homepage_section_items/section/${sectionId}`) }
export function createSectionItem(i) { return request('/api/homepage_section_items/', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(i) }) }

export default {
  login,
  listArticles,
  getArticle,
  createArticle,
  listCategories,
  createCategory,
  listTags,
  createTag,
  listMedia,
  uploadMedia,
  listUsers,
  createUser,
  listSections,
  createSection,
  listSectionItems,
  createSectionItem,
}
