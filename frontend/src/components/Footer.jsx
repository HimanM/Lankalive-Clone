import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">About Lanka Live Clone</h3>
            <p className="text-sm leading-relaxed">
              A demonstration news website clone showcasing modern web development skills. 
              This portfolio project demonstrates full-stack development capabilities using React and Flask.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/latest-news" className="hover:text-red-500 transition-colors">Latest News</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-red-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/local-news" className="hover:text-red-500 transition-colors">Local News</Link></li>
              <li><Link to="/category/foreign-news" className="hover:text-red-500 transition-colors">Foreign News</Link></li>
              <li><Link to="/category/sports-live" className="hover:text-red-500 transition-colors">Sports</Link></li>
              <li><Link to="/category/business-live" className="hover:text-red-500 transition-colors">Business</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>No 45/3, Galle Road</li>
              <li>Colombo 03, Western Province</li>
              <li>Sri Lanka</li>
              <li className="pt-2">
                <a href="mailto:hghimanmanduja@gmail.com" className="hover:text-red-500 transition-colors">
                  hghimanmanduja@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href="tel:+94112345678" 
                  className="hover:text-red-500 transition-colors"
                >
                  +94 77 519 39 23
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm mb-4">
            <p>© {new Date().getFullYear()} Lanka Live Clone. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-red-500 transition-colors">Terms of Service</Link>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-700">
            <a 
              href="https://github.com/HimanM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            
          </div>
        </div>
      </div>
    </footer>
  )
}
