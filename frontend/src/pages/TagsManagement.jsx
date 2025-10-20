import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import * as api from '../api'
import { useAlert } from '../components/AlertProvider'

export default function TagsManagement() {
  const [tags, setTags] = useState([])
  const [selectedTag, setSelectedTag] = useState(null)
  const [recentArticles, setRecentArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '' })
  const [editingId, setEditingId] = useState(null)
  const navigate = useNavigate()
  const alert = useAlert()

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin')
      return
    }
    loadTags()
  }, [navigate])

  async function loadTags() {
    try {
      const tagsList = await api.listTags()
      setTags(tagsList)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function loadTagArticles(tagSlug) {
    try {
      // Fetch articles with this tag
      const articles = await api.listArticles({ tag: tagSlug, limit: 5 })
      setRecentArticles(articles || [])
    } catch (e) {
      console.error(e)
      setRecentArticles([])
    }
  }

  function handleEdit(tag) {
    setEditingId(tag.id)
    setFormData({ name: tag.name, slug: tag.slug })
    setShowForm(true)
  }

  function handleNew() {
    setEditingId(null)
    setFormData({ name: '', slug: '' })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (editingId) {
        await api.updateTag(editingId, formData)
      } else {
        await api.createTag(formData)
      }
      setShowForm(false)
      setFormData({ name: '', slug: '' })
      setEditingId(null)
      loadTags()
    } catch (e) {
      await alert.alert('Error: ' + (e.message || e))
    }
  }

  async function handleDelete(tagId) {
    const ok = await alert.confirm('Delete this tag? This cannot be undone.')
    if (!ok) return
    try {
      await api.deleteTag(tagId)
      loadTags()
      if (selectedTag?.id === tagId) {
        setSelectedTag(null)
        setRecentArticles([])
      }
    } catch (e) {
      await alert.alert('Error: ' + (e.message || e))
    }
  }

  function handleTagClick(tag) {
    setSelectedTag(tag)
    loadTagArticles(tag.slug)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
              <p className="text-gray-600 mt-1">Manage article tags</p>
            </div>
            <button
              onClick={handleNew}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              + New Tag
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tags List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tag Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tags.map(tag => (
                    <tr 
                      key={tag.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedTag?.id === tag.id ? 'bg-purple-50' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          #{tag.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-600">{tag.slug}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(tag) }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(tag.id) }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {tags.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No tags yet. Click "New Tag" to create one.
                </div>
              )}
            </div>
          </div>

          {/* Recent Articles Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {selectedTag ? `Recent Articles with "${selectedTag.name}"` : 'Select a tag'}
              </h3>
              
              {selectedTag ? (
                recentArticles.length > 0 ? (
                  <div className="space-y-4">
                    {recentArticles.map(article => (
                      <div key={article.id} className="border-b pb-3">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Not published'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No articles with this tag yet.</p>
                )
              ) : (
                <p className="text-gray-500 text-sm">Click on a tag to see its recent articles.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Tag' : 'New Tag'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Breaking News"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL-friendly)
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., breaking-news"
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only lowercase letters, numbers, and hyphens
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ name: '', slug: '' })
                    setEditingId(null)
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
