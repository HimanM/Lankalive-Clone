import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import api from '../api'
import { getImageUrl } from '../utils/image'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categorySections, setCategorySections] = useState([])

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
      // Load category sections (latest 6 per category)
      try {
        const cats = await api.listCategories()
        if (Array.isArray(cats) && cats.length) {
          // Fetch up to 6 articles per category in parallel
          const promises = cats.map(async (c) => {
            try {
              const arts = await api.listArticles({ category: c.slug, limit: 6, status: 'published' })
              return { category: c, articles: Array.isArray(arts) ? arts : [] }
            } catch (err) {
              console.error('Error loading category articles for', c.slug, err)
              return { category: c, articles: [] }
            }
          })
          const sections = await Promise.all(promises)
          // Keep only categories that have at least one article
          setCategorySections(sections.filter(s => s.articles && s.articles.length > 0))
        } else {
          setCategorySections([])
        }
      } catch (e) {
        console.error('Failed to load categories:', e)
        setCategorySections([])
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
  
  // Get 6 latest articles sorted by published_at (most recent first)
  const latestArticles = [...filteredArticles]
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 6)
  
  const moreArticles = filteredArticles.slice(6, 26) // Show only 20 articles (6-26)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hot News Ticker */}
      {hotNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-3 md:px-4">
          <div className="container mx-auto flex items-center gap-2 md:gap-4">
            <span className="font-bold text-xs md:text-sm uppercase flex-shrink-0">Hot News</span>
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee whitespace-nowrap">
                {hotNews.map((article, idx) => (
                  <span key={article.id} className="inline-block mx-4 md:mx-8 text-xs md:text-sm">
                    {article.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-6 md:mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 md:px-6 py-3 md:py-4 pl-10 md:pl-14 text-sm md:text-base lg:text-lg border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all"
            />
            <svg className="absolute left-3 md:left-5 top-3 md:top-5 h-5 w-5 md:h-6 md:w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 md:right-4 top-3 md:top-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <section className="mb-6 md:mb-12">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              {/* Mobile: Compact vertical layout */}
              <div className="md:hidden">
                {featuredArticle.hero_image_url && (
                  <a href={`/article/${featuredArticle.slug}`} className="block">
                    <div className="relative overflow-hidden h-40">
                      <img 
                        src={getImageUrl(featuredArticle.hero_image_url)} 
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">Featured</span>
                    </div>
                  </a>
                )}
                <div className="p-3">
                  <a href={`/article/${featuredArticle.slug}`}>
                    <h2 className="text-base font-bold mb-2 leading-tight text-gray-900 line-clamp-2">
                      {featuredArticle.title}
                    </h2>
                  </a>
                  <div className="flex items-center text-xs text-gray-500">
                    <time>{new Date(featuredArticle.published_at).toLocaleDateString()}</time>
                  </div>
                </div>
              </div>
              
              {/* Desktop: Original horizontal layout */}
              <div className="hidden md:flex md:h-80 lg:h-96">
                {featuredArticle.hero_image_url && (
                  <a href={`/article/${featuredArticle.slug}`} className="md:w-2/3 h-full block">
                    <div className="relative overflow-hidden h-full">
                      <img 
                        src={getImageUrl(featuredArticle.hero_image_url)} 
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  </a>
                )}
                <div className="md:w-1/3 p-6 lg:p-8 flex flex-col justify-center">
                  <span className="text-red-600 font-semibold text-sm uppercase mb-2">Featured</span>
                  <a href={`/article/${featuredArticle.slug}`}>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight text-gray-900 hover:text-red-600 transition-colors duration-200">
                      {featuredArticle.title}
                    </h2>
                  </a>
                  <p className="text-base text-gray-600 mb-4 line-clamp-3">{featuredArticle.summary}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <time>{new Date(featuredArticle.published_at).toLocaleDateString()}</time>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest News Section */}
        <section className="mb-6 md:mb-12">
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3 md:pl-4">Latest News</h2>
            <a href="/latest-news" className="text-red-600 hover:text-red-700 text-xs md:text-sm font-semibold uppercase">View All →</a>
          </div>
          {/* Mobile: Show 4 articles in 2 columns */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {latestArticles.slice(0, 4).map(article => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
          {/* Desktop: Show all 6 articles in 3 columns */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Category Sections */}
        {categorySections.map(({ category, articles: catArticles }) => (
          <section className="mb-6 md:mb-12" key={category.id}>
            <div className="flex items-center justify-between mb-3 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3 md:pl-4">{category.name}</h2>
              <a href={`/category/${category.slug}`} className="text-red-600 hover:text-red-700 text-xs md:text-sm font-semibold uppercase">View All →</a>
            </div>
            {/* Mobile: Show 4 articles in 2 columns */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {catArticles.slice(0, 4).map(article => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
            {/* Desktop: Show all articles in 3 columns */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ))}

        {/* More News Section */}
        {moreArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3 md:pl-4">More Stories</h2>
            </div>
            {/* Mobile: 2 columns compact layout */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {moreArticles.map(article => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
            {/* Desktop: 4 columns layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
