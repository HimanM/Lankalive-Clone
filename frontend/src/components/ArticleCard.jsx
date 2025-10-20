import React from 'react'
import { Link } from 'react-router-dom'

export default function ArticleCard({ article }) {
  return (
    <article className="border-b py-4">
      <h2 className="text-xl font-semibold"><Link to={`/article/${article.slug}`}>{article.title}</Link></h2>
      <p className="text-sm text-gray-600">{article.summary}</p>
    </article>
  )
}
