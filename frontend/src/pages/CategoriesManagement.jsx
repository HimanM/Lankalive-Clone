import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import * as api from '../api'

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [recentArticles, setRecentArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '' })
  const [editingId, setEditingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin')
      return
    }
    loadCategories()
  }, [navigate])

  async function loadCategories() {
    try {
      const cats = await api.listCategories()
      setCategories(cats)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function loadCategoryArticles(categorySlug) {
    try {
      const data = await api.getCategory(categorySlug)
      setRecentArticles((data.articles || []).slice(0, 5))
    } catch (e) {
      console.error(e)
      setRecentArticles([])
    }
  }

  function handleEdit(category) {
    setEditingId(category.id)
    setFormData({ name: category.name, slug: category.slug })
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
        await api.updateCategory(editingId, formData)
      } else {
        await api.createCategory(formData)
      }
      setShowForm(false)
      setFormData({ name: '', slug: '' })
      setEditingId(null)
      loadCategories()
    } catch (e) {
      alert('Error: ' + (e.message || e))
    }
  }

  async function handleDelete(categoryId) {
    if (!confirm('Delete this category? This cannot be undone.')) return
    try {
      await api.deleteCategory(categoryId)
      loadCategories()
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null)
        setRecentArticles([])
      }
    } catch (e) {
      alert('Error: ' + (e.message || e))
    }
  }

  function handleCategoryClick(category) {
    setSelectedCategory(category)
    loadCategoryArticles(category.slug)
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
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-1">Manage article categories</p>
            </div>
            <button
              onClick={handleNew}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              + New Category
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
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
                  {categories.map(category => (
                    <tr 
                      key={category.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedCategory?.id === category.id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-600">{category.slug}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(category) }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(category.id) }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {categories.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No categories yet. Click "New Category" to create one.
                </div>
              )}
            </div>
          </div>

          {/* Recent Articles Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {selectedCategory ? `Recent Articles in "${selectedCategory.name}"` : 'Select a category'}
              </h3>
              
              {selectedCategory ? (
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
                  <p className="text-gray-500 text-sm">No articles in this category yet.</p>
                )
              ) : (
                <p className="text-gray-500 text-sm">Click on a category to see its recent articles.</p>
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
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Technology"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., technology"
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
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
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
