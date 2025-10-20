import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-6 text-sm text-center">© {new Date().getFullYear()} Lankalive Clone</div>
    </footer>
  )
}
