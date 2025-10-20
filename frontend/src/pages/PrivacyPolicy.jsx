import React from 'react'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-red-100 mt-2">Last updated: October 20, 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto rounded-lg shadow-lg p-8 md:p-12">
          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded">
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Project Notice</h2>
            <p className="text-yellow-700 leading-relaxed">
              <strong>This is a clone of a news website created solely as a personal project.</strong> This website has been developed 
              to showcase technical skills and is included in the developer's project portfolio. This is not a real news service 
              and does not collect, store, or process any real user data for commercial purposes.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Welcome to LankaLive Clone. This Privacy Policy explains how we handle information in this demonstration project. 
              As this is a portfolio project and not a commercial service, no personal data is actively collected or used 
              for any purpose beyond technical demonstration.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Since this is a demonstration project:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>No personal information is collected from visitors</li>
              <li>No cookies are used for tracking purposes</li>
              <li>No analytics or monitoring tools are implemented</li>
              <li>Admin authentication is for demonstration purposes only</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. How We Use Information</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Any data present in this application is for demonstration purposes only. Admin features are designed to 
              showcase content management capabilities and are not used to process real user information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Data Security</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              While this is a demonstration project, security best practices have been implemented including secure 
              authentication, data validation, and proper access controls. However, as this is not a production service, 
              it should not be used to store any sensitive or personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Third-Party Services</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              This demonstration project does not integrate with third-party services for data collection, analytics, 
              or advertising purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Your Rights</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              As no personal data is collected, there is no personal information to access, modify, or delete. This 
              project is open for viewing and evaluation as part of the developer's portfolio.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Changes to This Policy</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              This privacy policy may be updated as the project evolves. Any changes will be reflected on this page 
              with an updated revision date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Contact Information</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              For questions about this project or to discuss technical implementation, you can reach out through:
            </p>
            <ul className="list-none text-gray-700 mb-6 space-y-2">
              <li>
                <strong>GitHub:</strong>{' '}
                <a 
                  href="https://github.com/HimanM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 hover:underline"
                >
                  @HimanM
                </a>
              </li>
              <li><strong>Email:</strong> hghimanmanduja@gmail.com</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                to="/" 
                className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
