import React, { useEffect, useState } from 'react'
import api from '../api'
import { getImageUrl } from '../utils/image'

export default function Media(){
  const [list, setList] = useState([])
  const [file, setFile] = useState(null)
  const [q, setQ] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load(q=''){
    try{
      const url = '/api/media/' + (q ? `?q=${encodeURIComponent(q)}` : '')
      const res = await fetch((import.meta.env.VITE_API_BASE||'http://127.0.0.1:8000') + url)
      const json = await res.json()
      setList(json)
    }catch(e){ setList([]) }
  }

  useEffect(()=>{ load() }, [])

  async function onUpload(e){
    e.preventDefault();
    if(!file) return alert('select file')
    setLoading(true)
    try{
      const result = await api.uploadMedia(file)
      setFile(null)
      setMessage({text: 'Upload successful', meta: result})
      await load(q)
    }catch(e){
      setMessage({text: 'Upload failed: ' + (e.message||e)})
    }finally{ setLoading(false) }
  }

  return (<div>
    <h1 className='text-2xl font-bold mb-4'>Media</h1>
    <div className='mb-4 flex gap-2'>
      <input className='border px-2 py-1' placeholder='Search media...' value={q} onChange={e=>setQ(e.target.value)} />
      <button className='bg-gray-200 px-3' onClick={()=>load(q)}>Search</button>
    </div>

    <form onSubmit={onUpload} className='mb-4 flex items-center gap-2'>
      <input type='file' onChange={e=>setFile(e.target.files[0])} />
      <button className='bg-blue-600 text-white px-3 ml-2' disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
    </form>

    {message && (
      <div className='mb-4 p-3 bg-green-50 border rounded'>
        <div className='font-medium'>{message.text}</div>
        {message.meta && (
          <div className='mt-2'>
            <div><strong>URL:</strong> <code>{message.meta.url}</code></div>
            <div><strong>ID:</strong> {message.meta.id}</div>
            <div><strong>File:</strong> {message.meta.file_name}</div>
          </div>
        )}
      </div>
    )}

    <ul className='grid grid-cols-4 gap-4'>
      {list.map(m=> (
        <li key={m.id} className='border p-2 rounded'>
          <img src={getImageUrl(m.url)} alt={m.file_name} style={{maxWidth:240, maxHeight:140}} className='mb-2' />
          <div className='text-sm truncate'>{m.file_name}</div>
          <div className='text-xs text-gray-500'>{m.mime_type}</div>
          <div className='mt-2 flex gap-2'>
            <button onClick={()=>{navigator.clipboard.writeText(m.url); setMessage({text:'Copied URL to clipboard', meta: m})}} className='px-2 py-1 bg-gray-100 rounded'>Copy URL</button>
          </div>
        </li>
      ))}
    </ul>
  </div>)
}
