import React from 'react'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-red-100 mt-2">Last updated: October 20, 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto rounded-lg shadow-lg p-8 md:p-12">
          {/* Important Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded">
            <h2 className="text-xl font-bold text-blue-800 mb-2">Project Notice</h2>
            <p className="text-blue-700 leading-relaxed">
              <strong>This is a demonstration project created for portfolio purposes.</strong> This website is a clone of a 
              news website developed to showcase technical skills in web development. It is not a commercial service and 
              should not be used as a real news platform.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              By accessing and using this demonstration website, you acknowledge that this is a portfolio project created 
              for educational and showcase purposes. This is not a real news service, and all content is for demonstration only.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Description of Service</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              LankaLive Clone is a portfolio project that demonstrates:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>Modern web application development using React and Flask</li>
              <li>Content management system (CMS) capabilities</li>
              <li>User authentication and authorization</li>
              <li>Responsive design and user interface development</li>
              <li>Database integration and API development</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. User Responsibilities</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Users viewing this demonstration project should:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>Not use this platform for any commercial purposes</li>
              <li>Not attempt to exploit or misuse the demonstration features</li>
              <li>Understand that this is a portfolio piece, not a production service</li>
              <li>Not input any sensitive or personal information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Intellectual Property</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              This project is created by the developer as a portfolio piece. The code, design, and implementation are 
              original work created to demonstrate technical capabilities. Any resemblance to existing news platforms 
              is intentional as this is a clone project for educational purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Content Disclaimer</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              All content displayed on this website is for demonstration purposes only. Any news articles, images, or 
              information shown are used solely to demonstrate the functionality of the content management system and 
              should not be considered as real news or factual information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              As this is a demonstration project, it is provided "as is" without any warranties. The developer is not 
              liable for any issues, damages, or consequences arising from the use of this demonstration website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Privacy</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Please refer to our{' '}
              <Link to="/privacy-policy" className="text-red-600 hover:text-red-700 hover:underline">
                Privacy Policy
              </Link>
              {' '}for information about how this demonstration project handles data.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Changes to Terms</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              These terms may be updated as the project evolves. Continued use of the demonstration website constitutes 
              acceptance of any updated terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Contact</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              For questions about this project or to view more work:
            </p>
            <ul className="list-none text-gray-700 mb-6 space-y-2">
              <li>
                <strong>Developer:</strong> HimanM
              </li>
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
              <li><strong>Location:</strong> Colombo, Sri Lanka</li>
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
