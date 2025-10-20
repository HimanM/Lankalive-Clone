import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600">404</h1>
          <div className="h-1 w-32 bg-red-600 mx-auto mt-4"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/" className="text-red-600 hover:text-red-700 hover:underline">
              Home
            </Link>
            <Link to="/category/local-news" className="text-red-600 hover:text-red-700 hover:underline">
              Local News
            </Link>
            <Link to="/category/sports" className="text-red-600 hover:text-red-700 hover:underline">
              Sports
            </Link>
            <Link to="/admin" className="text-red-600 hover:text-red-700 hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
