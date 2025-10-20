import React, { useEffect, useState } from 'react'
import api from '../api'
import { getImageUrl } from '../utils/image'

export default function Media(){
  const [list, setList] = useState([])
  const [file, setFile] = useState(null)
  const [q, setQ] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState({
    alt_text: '',
    caption: '',
    credit: ''
  })

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
      const result = await api.uploadMedia(file, metadata)
      setFile(null)
      setMetadata({ alt_text: '', caption: '', credit: '' })
      setMessage({text: 'Upload successful', meta: result})
      await load(q)
    }catch(e){
      setMessage({text: 'Upload failed: ' + (e.message||e)})
    }finally{ setLoading(false) }
  }

  return (<div className="max-w-7xl mx-auto p-6">
    <h1 className='text-3xl font-bold mb-6 text-gray-900'>Media Library</h1>
    
    {/* Search */}
    <div className='mb-6 flex gap-2'>
      <input 
        className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
        placeholder='Search media...' 
        value={q} 
        onChange={e=>setQ(e.target.value)} 
      />
      <button 
        className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors' 
        onClick={()=>load(q)}
      >
        Search
      </button>
    </div>

    {/* Upload Form */}
    <div className='mb-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
      <h2 className='text-xl font-semibold mb-4 text-gray-900'>Upload New Media</h2>
      <form onSubmit={onUpload} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>File</label>
          <input 
            type='file' 
            onChange={e=>setFile(e.target.files[0])} 
            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100'
            accept='image/*'
          />
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Alt Text</label>
            <input 
              type='text' 
              value={metadata.alt_text} 
              onChange={e => setMetadata({...metadata, alt_text: e.target.value})}
              placeholder='Descriptive text for accessibility'
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent'
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Caption</label>
            <input 
              type='text' 
              value={metadata.caption} 
              onChange={e => setMetadata({...metadata, caption: e.target.value})}
              placeholder='Image caption'
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent'
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Credit</label>
            <input 
              type='text' 
              value={metadata.credit} 
              onChange={e => setMetadata({...metadata, credit: e.target.value})}
              placeholder='Photo credit/source'
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent'
            />
          </div>
        </div>
        
        <button 
          type='submit'
          className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed' 
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Media'}
        </button>
      </form>
    </div>

    {/* Success/Error Message */}
    {message && (
      <div className={`mb-6 p-4 rounded-lg border ${message.text.includes('failed') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        <div className='font-semibold text-gray-900'>{message.text}</div>
        {message.meta && (
          <div className='mt-3 space-y-1 text-sm text-gray-700'>
            <div><strong>URL:</strong> <code className='bg-gray-100 px-2 py-1 rounded'>{message.meta.url}</code></div>
            <div><strong>File:</strong> {message.meta.file_name}</div>
            <div><strong>Dimensions:</strong> {message.meta.width} x {message.meta.height} px</div>
            <div><strong>Type:</strong> {message.meta.mime_type}</div>
          </div>
        )}
      </div>
    )}

    {/* Media Grid */}
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {list.map(m=> (
        <div key={m.id} className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
          <div className='aspect-video bg-gray-100 flex items-center justify-center overflow-hidden'>
            <img 
              src={getImageUrl(m.url)} 
              alt={m.alt_text || m.file_name} 
              className='w-full h-full object-contain'
            />
          </div>
          <div className='p-4'>
            <div className='text-sm font-medium text-gray-900 truncate mb-2'>{m.file_name}</div>
            <div className='text-xs text-gray-500 space-y-1'>
              <div>{m.mime_type}</div>
              {m.width && m.height && <div>{m.width} x {m.height} px</div>}
              {m.alt_text && <div className='truncate'><strong>Alt:</strong> {m.alt_text}</div>}
              {m.caption && <div className='truncate'><strong>Caption:</strong> {m.caption}</div>}
              {m.credit && <div className='truncate'><strong>Credit:</strong> {m.credit}</div>}
            </div>
            <div className='mt-3'>
              <button 
                onClick={()=>{
                  navigator.clipboard.writeText(m.url); 
                  setMessage({text:'✓ Copied URL to clipboard', meta: m})
                }} 
                className='w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors'
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>)
}
