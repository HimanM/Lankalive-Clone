import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { getImageUrl } from '../utils/image'

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

  if (!article) return <div>Loading...</div>

  return (
    <article className="prose lg:prose-xl">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      {article.published_at && <div className="text-sm text-gray-500">{new Date(article.published_at).toLocaleString()}</div>}
      {article.hero_image_url && <img src={getImageUrl(article.hero_image_url)} alt={article.title} className="w-full my-4" />}
      {article.summary && <p className="text-lg text-gray-700">{article.summary}</p>}
      <div dangerouslySetInnerHTML={{ __html: article.body || '' }} />
      {article.categories && article.categories.length > 0 && (
        <div className="mt-4">Categories: {article.categories.map(c => <span key={c.id} className="mr-2">{c.name}</span>)}</div>
      )}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-2">Tags: {article.tags.map(t => <span key={t.id} className="mr-2">{t.name}</span>)}</div>
      )}
    </article>
  )
}
