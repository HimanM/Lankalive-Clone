import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import api from '../api'
import { getImageUrl } from '../utils/image'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await api.listArticles({ limit: 50, status: 'published' })
        // Ensure we always have an array
        if (Array.isArray(data)) {
          setArticles(data)
        } else {
          console.error('API returned non-array:', data)
          setArticles([])
        }
      } catch (e) {
        console.error('Failed to load articles:', e)
        setArticles([]) // Set empty array on error to prevent crashes
      }
    }
    load()
  }, [])

  // Filter articles by search query
  const filteredArticles = searchQuery.trim() 
    ? articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles

  // Split articles for different sections
  const hotNews = filteredArticles.slice(0, 5)
  
  // Get featured/highlighted articles sorted by latest (published_at)
  const highlightedArticles = filteredArticles
    .filter(article => article.is_featured)
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
  
  // Use the latest highlighted article as featured, or fallback to first article
  const featuredArticle = highlightedArticles.length > 0 ? highlightedArticles[0] : filteredArticles[0]
  
  // Get 12 latest articles sorted by published_at (most recent first)
  const latestArticles = [...filteredArticles]
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 12)
  
  const moreArticles = filteredArticles.slice(12)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hot News Ticker */}
      {hotNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-4">
          <div className="container mx-auto flex items-center gap-4">
            <span className="font-bold text-sm uppercase flex-shrink-0">Hot News</span>
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee whitespace-nowrap">
                {hotNews.map((article, idx) => (
                  <span key={article.id} className="inline-block mx-8 text-sm">
                    {article.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all"
            />
            <svg className="absolute left-5 top-5 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Hero Section - Featured Article */}
        {featuredArticle && (
          <section className="mb-12">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex md:h-96">
                {featuredArticle.hero_image_url && (
                  <div className="md:w-2/3 h-64 md:h-full relative overflow-hidden">
                    <img 
                      src={getImageUrl(featuredArticle.hero_image_url)} 
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}
                <div className="md:w-1/3 p-8 flex flex-col justify-center">
                  <span className="text-red-600 font-semibold text-sm uppercase mb-2">Featured</span>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
                    <a href={`/article/${featuredArticle.slug}`} className="hover:text-red-600 transition-colors">
                      {featuredArticle.title}
                    </a>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{featuredArticle.summary}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <time>{new Date(featuredArticle.published_at).toLocaleDateString()}</time>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest News Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-4">Latest News</h2>
            <a href="/latest-news" className="text-red-600 hover:text-red-700 text-sm font-semibold uppercase">View All →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* More News Section */}
        {moreArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-4">More Stories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreArticles.map(article => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </section>
        )}

        {/* No articles message */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? `No articles found for "${searchQuery}"` : 'No articles yet'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
