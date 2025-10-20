import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'

export default function Header() {
  const nav = useNavigate()
  const logged = !!getToken()
  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">Lankalive Clone</Link>
        <nav>
          <Link to="/" className="px-3 hover:underline">Home</Link>
          <Link to="/categories" className="px-3 hover:underline">Categories</Link>
          <Link to="/tags" className="px-3 hover:underline">Tags</Link>
          <Link to="/media" className="px-3 hover:underline">Media</Link>
          <Link to="/users" className="px-3 hover:underline">Users</Link>
          <Link to="/sections" className="px-3 hover:underline">Sections</Link>
          <Link to="/admin" className="px-3 hover:underline">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
