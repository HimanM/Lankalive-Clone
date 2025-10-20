import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as api from '../api'
import { getImageUrl } from '../utils/image'

export default function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [media, setMedia] = useState([])
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadMetadata, setUploadMetadata] = useState({
    alt_text: '',
    caption: '',
    credit: ''
  })

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          setUploadFile(file)
          e.preventDefault()
        }
      }
    }
  }

  const handleUploadMedia = async () => {
    if (!uploadFile) {
      alert('Please select or paste an image')
      return
    }

    setUploading(true)
    try {
      const result = await api.uploadMedia(uploadFile, uploadMetadata)
      
      // Set the uploaded image as hero image
      setFormData(prev => ({ ...prev, hero_image_url: result.url }))
      
      // Reload media list
      const updatedMedia = await api.listMedia().catch(() => [])
      setMedia(updatedMedia)
      
      // Close modal and reset
      setUploadModalOpen(false)
      setUploadFile(null)
      setUploadMetadata({ alt_text: '', caption: '', credit: '' })
      
      alert('Image uploaded successfully!')
    } catch (error) {
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form - 2/3 width */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
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
              <div className="flex items-center gap-2 mt-2">
                <button type="button" onClick={() => setMediaPickerOpen(open => !open)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors">{mediaPickerOpen ? 'Close media' : 'Choose from media'}</button>
                <button type="button" onClick={() => setUploadModalOpen(true)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">+ Upload New</button>
                {formData.hero_image_url && (
                  <img 
                    src={getImageUrl(formData.hero_image_url)} 
                    alt="Preview" 
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {mediaPickerOpen && (
                <div className="mt-4 border p-3 rounded bg-white">
                  <div className="mb-2 flex gap-2">
                    <input placeholder="Search media..." className="flex-1 border px-2 py-1" onChange={async (e) => { const q = e.target.value; const list = await api.listMedia({ q }).catch(()=>[]); setMedia(list) }} />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {media.map(m => (
                      <div key={m.id} className="border rounded p-2 text-center">
                        <img src={getImageUrl(m.url)} alt={m.file_name} className="w-full h-24 object-cover mb-2" />
                        <div className="text-xs truncate mb-2">{m.file_name}</div>
                        <button type="button" className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => { setFormData(prev => ({...prev, hero_image_url: m.url })); setMediaPickerOpen(false) }}>Select</button>
                      </div>
                    ))}
                  </div>
                </div>
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

      {/* Right: Preview - 1/3 width */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-30 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Preview</h3>
          
          {/* URL Preview */}
          {formData.slug && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-900 mb-1">Article URL:</p>
              <code className="text-xs text-blue-700 break-all">
                {window.location.origin}/article/{formData.slug}
              </code>
            </div>
          )}

          {/* Hero Image Preview */}
          {formData.hero_image_url && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Hero Image:</p>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={getImageUrl(formData.hero_image_url)} 
                  alt="Hero preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Title Preview */}
          {formData.title && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Title:</p>
              <h2 className="text-xl font-bold text-gray-900 line-clamp-3">{formData.title}</h2>
            </div>
          )}

          {/* Summary Preview */}
          {formData.summary && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Summary:</p>
              <p className="text-sm text-gray-600 line-clamp-4">{formData.summary}</p>
            </div>
          )}

          {/* Status Badge */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Status:</p>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${
              formData.status === 'published'
                ? 'bg-green-100 text-green-800'
                : formData.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {formData.status}
            </span>
          </div>

          {/* Category Preview */}
          {formData.primary_category_id && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Primary Category:</p>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {categories.find(c => c.id === formData.primary_category_id)?.name || 'Unknown'}
              </span>
            </div>
          )}

          {/* Flags Preview */}
          {(formData.is_highlight || formData.is_breaking || formData.is_featured) && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Flags:</p>
              <div className="flex flex-wrap gap-1">
                {formData.is_highlight && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Highlight
                  </span>
                )}
                {formData.is_breaking && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                    Breaking
                  </span>
                )}
                {formData.is_featured && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Content Length */}
          {formData.body && (
            <div className="mb-4 text-xs text-gray-500">
              Content: ~{formData.body.length} characters
            </div>
          )}
        </div>
      </div>
    </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload New Image</h2>
                <button
                  type="button"
                  onClick={() => {
                    setUploadModalOpen(false)
                    setUploadFile(null)
                    setUploadMetadata({ alt_text: '', caption: '', credit: '' })
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Upload Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image File
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors"
                  onPaste={handlePaste}
                >
                  {uploadFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <img 
                          src={URL.createObjectURL(uploadFile)} 
                          alt="Preview" 
                          className="max-h-48 rounded-lg"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {uploadFile.name} ({(uploadFile.size / 1024).toFixed(2)} KB)
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadFile(null)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-4xl text-gray-400">📷</div>
                      <div>
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-block">
                            Choose File
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="text-sm text-gray-500">
                        or paste an image (Ctrl+V / Cmd+V)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text *
                  </label>
                  <input
                    type="text"
                    value={uploadMetadata.alt_text}
                    onChange={(e) => setUploadMetadata({ ...uploadMetadata, alt_text: e.target.value })}
                    placeholder="Descriptive text for accessibility"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Describe the image for screen readers</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={uploadMetadata.caption}
                    onChange={(e) => setUploadMetadata({ ...uploadMetadata, caption: e.target.value })}
                    placeholder="Image caption (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit
                  </label>
                  <input
                    type="text"
                    value={uploadMetadata.credit}
                    onChange={(e) => setUploadMetadata({ ...uploadMetadata, credit: e.target.value })}
                    placeholder="Photo credit/source (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setUploadModalOpen(false)
                    setUploadFile(null)
                    setUploadMetadata({ alt_text: '', caption: '', credit: '' })
                  }}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUploadMedia}
                  disabled={!uploadFile || uploading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload & Use Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
