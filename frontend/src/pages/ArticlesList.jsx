import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import * as api from '../api'

export default function ArticlesList() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: 'all', category: '' })
  const navigate = useNavigate()

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin')
      return
    }
    loadData()
  }, [navigate, filter])

  const loadData = async () => {
    setLoading(true)
    try {
      const [cats] = await Promise.all([
        api.listCategories()
      ])
      setCategories(cats)

      // Load articles with filters
      const params = { limit: 100 }
      if (filter.status !== 'all') params.status = filter.status
      if (filter.category) params.category = filter.category

      const arts = await api.listArticles(params)
      setArticles(arts)
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    
    try {
      await api.deleteArticle(id)
      alert('Article deleted successfully!')
      loadData()
    } catch (error) {
      alert('Error deleting article: ' + error.message)
    }
  }

  const handleStatusChange = (status) => {
    setFilter(prev => ({ ...prev, status }))
  }

  const handleCategoryChange = (e) => {
    setFilter(prev => ({ ...prev, category: e.target.value }))
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
              <h1 className="text-3xl font-bold text-gray-900">All Articles</h1>
              <p className="text-gray-600 mt-1">Manage your content</p>
            </div>
            <Link
              to="/admin/article/new"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              + Create Article
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
              <div className="inline-flex gap-2">
                <button
                  onClick={() => handleStatusChange('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter.status === 'all'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleStatusChange('published')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter.status === 'published'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => handleStatusChange('draft')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter.status === 'draft'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Draft
                </button>
                <button
                  onClick={() => handleStatusChange('archived')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter.status === 'archived'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Archived
                </button>
              </div>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mr-2">Category:</label>
              <select
                value={filter.category}
                onChange={handleCategoryChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {articles.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No articles found</p>
              <Link to="/admin/article/new" className="text-red-600 hover:text-red-700 font-medium mt-2 inline-block">
                Create your first article →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {article.hero_image_url && (
                            <img
                              src={article.hero_image_url}
                              alt=""
                              className="w-12 h-12 object-cover rounded mr-3"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{article.title}</div>
                            <div className="text-sm text-gray-500">{article.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.categories && article.categories[0] ? (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {article.categories[0].name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">No category</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          article.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : article.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status || 'draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {article.is_highlight && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                              Highlight
                            </span>
                          )}
                          {article.is_breaking && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                              Breaking
                            </span>
                          )}
                          {article.is_featured && (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/article/${article.slug}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-900"
                            title="View"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            to={`/admin/article/${article.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id, article.title)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
