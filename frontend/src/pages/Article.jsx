import React from 'react'
import { useParams } from 'react-router-dom'

export default function Article() {
  const { slug } = useParams()
  return (
    <div>
      <h1 className="text-3xl font-bold">Article: {slug}</h1>
      <div className="mt-4">Article content will appear here.</div>
    </div>
  )
}
