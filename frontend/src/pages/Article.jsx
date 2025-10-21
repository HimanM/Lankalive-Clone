import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { getImageUrl } from '../utils/image'
import Sidebar from '../components/Sidebar'
import FeaturedArticles from '../components/FeaturedArticles'

export default function Article() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const a = await api.getArticle(slug)
        setArticle(a)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [slug])

  if (!article) return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero Image Container - Fixed aspect ratio */}
        {article.hero_image_url && (
          <div className="w-full aspect-video bg-gray-100 overflow-hidden">
            <img 
              src={getImageUrl(article.hero_image_url)} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Article Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {/* Categories */}
          {article.categories && article.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map(c => (
                <span key={c.id} className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {c.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
            {article.published_at && (
              <time className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(article.published_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
            )}
          </div>
          
          {/* Summary */}
          {article.summary && (
            <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-6 leading-relaxed font-medium border-l-4 border-red-600 pl-4 italic">
              {article.summary}
            </p>
          )}
          
          {/* Body */}
          <div 
            className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md" 
            dangerouslySetInnerHTML={{ __html: article.body || '' }} 
          />
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-semibold text-gray-700">Tags:</span>
                {article.tags.map(t => (
                  <span key={t.id} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                    #{t.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="lg:col-span-1">
          <div className="space-y-4 md:space-y-6">
            <FeaturedArticles limit={3} />
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
