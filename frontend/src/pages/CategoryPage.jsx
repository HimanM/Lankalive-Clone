import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as api from '../api'
import ArticleCard from '../components/ArticleCard'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.getCategory(slug),
      api.listArticles({ category: slug, limit: 50 })
    ])
      .then(([cat, arts]) => {
        setCategory(cat)
        setArticles(arts)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Category not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">{category.name}</h1>
          <p className="text-red-100 mt-2">Latest news and updates</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
