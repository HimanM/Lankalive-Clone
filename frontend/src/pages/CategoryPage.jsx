import React, { useEffect, useState } from 'react'
import useScrollToTop from '../hooks/useScrollToTop'
import { useParams } from 'react-router-dom'
import * as api from '../api'
import ArticleCard from '../components/ArticleCard'
import Sidebar from '../components/Sidebar'
import FeaturedArticles from '../components/FeaturedArticles'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  useScrollToTop([currentPage])
  const articlesPerPage = 8
  
  // Filter states
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    const loadData = () => {
      setLoading(true)
      const offset = (currentPage - 1) * articlesPerPage
      
      const params = { 
        category: slug,
        limit: articlesPerPage,
        offset,
        status: 'published'
      }
      
      // Add date filters if set
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo
      
      Promise.all([
        api.getCategory(slug),
        api.listArticles(params)
      ])
        .then(([cat, arts]) => {
          setCategory(cat)
          // Filter by search query on frontend
          let filtered = arts
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = arts.filter(article => 
              article.title.toLowerCase().includes(query) ||
              article.summary?.toLowerCase().includes(query)
            )
          }
          setArticles(filtered)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
    loadData()
  }, [slug, currentPage, dateFrom, dateTo, searchQuery])

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Search and Filter Combined */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              {/* Search Bar */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filter Toggle and Results Count */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <div className="text-sm text-gray-500">
                  {articles.length} article{articles.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Date Filter Controls (Collapsible) */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-medium text-gray-700">Filter by date:</span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-sm text-gray-600 whitespace-nowrap">From:</label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1) }}
                          className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-sm text-gray-600 whitespace-nowrap">To:</label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1) }}
                          className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                      {(dateFrom || dateTo) && (
                        <button
                          onClick={() => { setDateFrom(''); setDateTo(''); setCurrentPage(1) }}
                          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors w-full sm:w-auto"
                        >
                          Clear Dates
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Articles Grid */}
            {articles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No articles in this category yet</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination: show controls when we have a full page or are on a later page */}
                {(articles.length === articlesPerPage || currentPage > 1) && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                      Page {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={articles.length < articlesPerPage}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <FeaturedArticles limit={3} />
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
