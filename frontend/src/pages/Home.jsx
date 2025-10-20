import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import api from '../api'

export default function Home() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const data = await api.listArticles()
        setArticles(data || [])
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Latest</h1>
      <div className="space-y-4">
        {articles.length ? articles.map(a => <ArticleCard key={a.id} article={a} />) : <p>No articles yet</p>}
      </div>
    </div>
  )
}
