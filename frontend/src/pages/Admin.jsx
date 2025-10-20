import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { saveToken, getToken } from '../utils/auth'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (getToken()) {
      navigate('/admin/dashboard')
    }
  }, [navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    
    try {
      const res = await api.login(email, password)
      saveToken(res.access_token)
      setMsg('Logged in successfully!')
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 500)
    } catch (err) {
      setMsg('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Sign in to manage your content</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@lankaliveclone.lk"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {msg && (
            <div className={`mt-4 p-3 rounded-lg text-center ${msg.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
