import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { getImageUrl } from '../utils/image'

export default function FeaturedArticles({ limit = 3 }) {
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeatured() {
      try {
        // Fetch more articles and filter on frontend for featured ones
        const data = await api.listArticles({ limit: 50, status: 'published' })
        const featured = data
          .filter(article => article.is_featured)
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
          .slice(0, limit)
        setFeaturedArticles(featured)
      } catch (e) {
        console.error('Error loading featured articles:', e)
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [limit])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-red-600 pl-3">
          Featured Articles
        </h3>
        <div className="text-gray-500 text-sm text-center py-4">Loading...</div>
      </div>
    )
  }

  if (featuredArticles.length === 0) {
    return null // Don't show section if no featured articles
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-red-600 pl-3">
        Featured Articles
      </h3>
      <div className="space-y-4">
        {featuredArticles.map((article, index) => (
          <article key={article.id} className={`${index !== 0 ? 'pt-4 border-t border-gray-200' : ''}`}>
            <Link to={`/article/${article.slug}`} className="group">
              <div className="flex gap-3">
                {article.hero_image_url && (
                  <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden">
                    <img 
                      src={getImageUrl(article.hero_image_url)} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                    {article.title}
                  </h4>
                  <time className="text-xs text-gray-500">
                    {new Date(article.published_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
