import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'

export default function Sidebar() {
  const [categories, setCategories] = useState([])
  const [popularArticles, setPopularArticles] = useState([])

  useEffect(() => {
    // Load categories
    api.listCategories()
      .then(setCategories)
      .catch(console.error)

    // Load popular/recent articles (is_highlight or recent published)
    api.listArticles({ is_highlight: '1', limit: 5, status: 'published' })
      .then(articles => {
        // If no highlights, fall back to recent articles
        if (articles.length === 0) {
          return api.listArticles({ limit: 5, status: 'published' })
        }
        return articles
      })
      .then(setPopularArticles)
      .catch(console.error)
  }, [])

  return (
    <aside className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-red-600">
          Categories
        </h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category.id}>
              <Link
                to={`/category/${category.slug}`}
                className="flex items-center justify-between text-gray-700 hover:text-red-600 transition-colors py-2 px-3 hover:bg-gray-50 rounded"
              >
                <span className="font-medium">{category.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Articles Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-red-600">
          Popular Articles
        </h3>
        <div className="space-y-4">
          {popularArticles.map((article, index) => (
            <article key={article.id} className="border-b pb-4 last:border-0 last:pb-0">
              <Link to={`/article/${article.slug}`} className="group">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {article.published_at && (
                        <time>
                          {new Date(article.published_at).toLocaleDateString()}
                        </time>
                      )}
                      {article.categories && article.categories[0] && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">{article.categories[0].name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Ad Placeholder (Optional) */}
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm mb-2">Advertisement</p>
        <div className="bg-gray-200 h-64 rounded flex items-center justify-center">
          <span className="text-gray-400">300 x 250</span>
        </div>
      </div>
    </aside>
  )
}
