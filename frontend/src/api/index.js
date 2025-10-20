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
export function listArticles(params = {}) {
  const { limit = 20, offset = 0, category, is_highlight, status } = params
  let url = `/api/articles/?limit=${limit}&offset=${offset}`
  if (category) url += `&category=${encodeURIComponent(category)}`
  if (is_highlight !== undefined) url += `&is_highlight=${is_highlight ? '1' : '0'}`
  if (status) url += `&status=${encodeURIComponent(status)}`
  return request(url)
}

export function getArticle(slug) {
  return request(`/api/articles/${encodeURIComponent(slug)}`)
}

export function getArticleById(id) {
  return request(`/api/articles/by-id/${id}`)
}

export function createArticle(article) {
  const opts = { method: 'POST', ...withJson(article) }
  return request('/api/articles/', opts)
}

export function updateArticle(id, article) {
  const opts = { method: 'PUT', ...withJson(article) }
  return request(`/api/articles/${id}`, opts)
}

export function deleteArticle(id) {
  const opts = { method: 'DELETE', headers: authHeaders() }
  return request(`/api/articles/${id}`, opts)
}

// Categories
export function listCategories() { return request('/api/categories/') }
export function getCategory(slug) { return request(`/api/categories/${encodeURIComponent(slug)}`) }
export function createCategory(cat) { return request('/api/categories/', { method: 'POST', ...withJson(cat) }) }
export function updateCategory(id, cat) { return request(`/api/categories/${id}`, { method: 'PUT', ...withJson(cat) }) }
export function deleteCategory(id) { return request(`/api/categories/${id}`, { method: 'DELETE', headers: authHeaders() }) }

// Tags
export function listTags() { return request('/api/tags/') }
export function createTag(t) { return request('/api/tags/', { method: 'POST', ...withJson(t) }) }
export function updateTag(id, t) { return request(`/api/tags/${id}`, { method: 'PUT', ...withJson(t) }) }
export function deleteTag(id) { return request(`/api/tags/${id}`, { method: 'DELETE', headers: authHeaders() }) }

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
export function createUser(u) { return request('/api/users/', { method: 'POST', ...withJson(u) }) }
export function updateUser(id, u) { return request(`/api/users/${id}`, { method: 'PUT', ...withJson(u) }) }
export function deleteUser(id) { return request(`/api/users/${id}`, { method: 'DELETE', headers: authHeaders() }) }

// Homepage sections / items
export function listSections() { return request('/api/homepage_sections/') }
export function createSection(s) { return request('/api/homepage_sections/', { method: 'POST', ...withJson(s) }) }
export function updateSection(id, s) { return request(`/api/homepage_sections/${id}`, { method: 'PUT', ...withJson(s) }) }
export function deleteSection(id) { return request(`/api/homepage_sections/${id}`, { method: 'DELETE', headers: authHeaders() }) }
export function listSectionItems(sectionId) { return request(`/api/homepage_section_items/section/${sectionId}`) }
export function createSectionItem(i) { return request('/api/homepage_section_items/', { method: 'POST', ...withJson(i) }) }
export function deleteSectionItem(id) { return request(`/api/homepage_section_items/${id}`, { method: 'DELETE', headers: authHeaders() }) }

export default {
  login,
  listArticles,
  getArticle,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  listTags,
  createTag,
  updateTag,
  deleteTag,
  listMedia,
  uploadMedia,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listSections,
  createSection,
  updateSection,
  deleteSection,
  listSectionItems,
  createSectionItem,
  deleteSectionItem,
}
