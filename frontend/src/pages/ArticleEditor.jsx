import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as api from '../api'

export default function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    body: '',
    slug: '',
    hero_image_url: '',
    primary_category_id: '',
    category_ids: [],
    tag_ids: [],
    status: 'draft',
    is_breaking: false,
    is_highlight: false,
    is_featured: false,
    published_at: '',
  })

  useEffect(() => {
    // Load categories, tags, media
    Promise.all([
      api.listCategories(),
      api.listTags(),
      api.listMedia().catch(() => []),
    ])
      .then(([cats, tgs, med]) => {
        setCategories(cats)
        setTags(tgs)
        setMedia(med)
      })
      .catch(console.error)

    // Load article if editing
    if (!isNew) {
      api.getArticleById(id)
        .then(article => {
          setFormData({
            title: article.title || '',
            summary: article.summary || '',
            body: article.body || '',
            slug: article.slug || '',
            hero_image_url: article.hero_image_url || '',
            primary_category_id: article.primary_category_id || article.categories?.[0]?.id || '',
            category_ids: article.categories?.map(c => c.id) || [],
            tag_ids: article.tags?.map(t => t.id) || [],
            status: article.status || 'draft',
            is_breaking: article.is_breaking || false,
            is_highlight: article.is_highlight || false,
            is_featured: article.is_featured || false,
            published_at: article.published_at || '',
          })
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id, isNew])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || []
      if (currentValues.includes(value)) {
        return { ...prev, [name]: currentValues.filter(v => v !== value) }
      } else {
        return { ...prev, [name]: [...currentValues, value] }
      }
    })
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isNew) {
        await api.createArticle(formData)
        alert('Article created successfully!')
      } else {
        await api.updateArticle(id, formData)
        alert('Article updated successfully!')
      }
      navigate('/admin/dashboard')
    } catch (error) {
      alert('Error saving article: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Create New Article' : 'Edit Article'}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-4xl">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter article title"
            />
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="article-url-slug"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary *
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief summary of the article"
            />
          </div>

          {/* Body */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
              placeholder="Article content (HTML supported)"
            />
          </div>

          {/* Hero Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Image URL
            </label>
            <input
              type="text"
              name="hero_image_url"
              value={formData.hero_image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.hero_image_url && (
              <img 
                src={formData.hero_image_url} 
                alt="Preview" 
                className="mt-2 w-full max-w-md h-48 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Category *
            </label>
            <select
              name="primary_category_id"
              value={formData.primary_category_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Additional Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Categories
            </label>
            <div className="border border-gray-300 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.category_ids.includes(cat.id)}
                    onChange={() => handleMultiSelect('category_ids', cat.id)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="border border-gray-300 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500">No tags available. Create tags first.</p>
              ) : (
                tags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.tag_ids.includes(tag.id)}
                      onChange={() => handleMultiSelect('tag_ids', tag.id)}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Published Date */}
          {formData.status === 'published' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Published Date
              </label>
              <input
                type="datetime-local"
                name="published_at"
                value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Flags */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_highlight"
                checked={formData.is_highlight}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Highlight on homepage</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_breaking"
                checked={formData.is_breaking}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Breaking news</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured article</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : (isNew ? 'Create Article' : 'Update Article')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
