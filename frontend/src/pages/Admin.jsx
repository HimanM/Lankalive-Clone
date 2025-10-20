import React, { useState } from 'react'
import api from '../api'
import { saveToken } from '../utils/auth'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const res = await api.login(email, password)
      saveToken(res.access_token)
      setMsg('Logged in')
    } catch (err) {
      setMsg('Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border px-3 py-2" />
        <button className="bg-blue-600 text-white px-4 py-2">Login</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  )
}
