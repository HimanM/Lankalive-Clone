import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">About Lanka Live</h3>
            <p className="text-sm leading-relaxed">
              The best source of news in Sri Lanka for breaking news both locally and globally. 
              The most reliable and up-to-date source of accurate and timely news.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/categories" className="hover:text-red-500 transition-colors">Categories</Link></li>
              <li><Link to="/tags" className="hover:text-red-500 transition-colors">Tags</Link></li>
              <li><Link to="/admin" className="hover:text-red-500 transition-colors">Admin</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">Local News</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Foreign News</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Sports</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Business</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>No 9/2, Dudley Senanayaka Mawatha</li>
              <li>Borella, Colombo</li>
              <li>Sri Lanka</li>
              <li className="pt-2">
                <a href="mailto:hello@lankalive.lk" className="hover:text-red-500 transition-colors">
                  hello@lankalive.lk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© {new Date().getFullYear()} Lanka Live. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
