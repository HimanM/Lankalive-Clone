import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import * as api from '../api'

export default function AdminDashboard() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin')
      return
    }

    Promise.all([
      api.listArticles({ status: 'published', limit: 10 }),
      api.listCategories()
    ])
      .then(([arts, cats]) => {
        setArticles(arts)
        setCategories(cats)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your news content</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Link
            to="/admin/article/new"
            className="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold">Create Article</div>
          </Link>
          <Link
            to="/admin/articles"
            className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📰</div>
            <div className="font-semibold">All Articles</div>
          </Link>
          <Link
            to="/admin/categories"
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📁</div>
            <div className="font-semibold">Categories</div>
          </Link>
          <Link
            to="/admin/media"
            className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🖼️</div>
            <div className="font-semibold">Media</div>
          </Link>
          <Link
            to="/admin/tags"
            className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🏷️</div>
            <div className="font-semibold">Tags</div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Total Articles</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{articles.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Categories</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Published</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{articles.length}</div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Articles</h2>
              <Link to="/admin/articles" className="text-red-600 hover:text-red-700 font-medium">
                Manage All Articles →
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {articles.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="mb-4">No articles yet</p>
                <Link to="/admin/article/new" className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Create Your First Article
                </Link>
              </div>
            ) : (
              articles.map(article => (
                <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        <Link to={`/admin/article/${article.id}`} className="hover:text-red-600">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(article.published_at).toLocaleDateString()}</span>
                        {article.categories && article.categories[0] && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                            {article.categories[0].name}
                          </span>
                        )}
                        {article.is_highlight && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Highlight
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Link
                        to={`/admin/article/${article.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit article"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <Link
                        to={`/article/${article.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600"
                        title="View article"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
