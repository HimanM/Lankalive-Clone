import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import api from '../api'

export default function Home() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const data = await api.listArticles({ limit: 50, status: 'published' })
        setArticles(data || [])
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  // Split articles for different sections
  const hotNews = articles.slice(0, 5)
  const featuredArticle = articles[0]
  const latestArticles = articles.slice(1, 7)
  const moreArticles = articles.slice(7)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hot News Ticker */}
      {hotNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-4">
          <div className="container mx-auto flex items-center gap-4">
            <span className="font-bold text-sm uppercase flex-shrink-0">🔥 Hot News</span>
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
        {/* Hero Section - Featured Article */}
        {featuredArticle && (
          <section className="mb-12">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                {featuredArticle.hero_image_url && (
                  <div className="md:w-2/3 relative overflow-hidden">
                    <img 
                      src={featuredArticle.hero_image_url} 
                      alt={featuredArticle.title}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
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
            <a href="#" className="text-red-600 hover:text-red-700 text-sm font-semibold uppercase">View All →</a>
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
        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
