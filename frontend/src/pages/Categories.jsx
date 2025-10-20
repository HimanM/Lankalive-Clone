import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Categories() {
  const [cats, setCats] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  useEffect(()=>{ api.listCategories().then(r=>setCats(r)).catch(()=>setCats([])) }, [])

  async function onCreate(e){
    e.preventDefault()
    try{ await api.createCategory({name, slug}); setName(''); setSlug(''); const r=await api.listCategories(); setCats(r)}catch(e){alert('create failed')}
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Categories</h1>
      <form onSubmit={onCreate} className='flex gap-2 mb-4'>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder='Name' className='border px-2' />
        <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder='Slug' className='border px-2' />
        <button className='bg-blue-600 text-white px-3'>Create</button>
      </form>
      <ul>
        {cats.map(c => <li key={c.id}>{c.name} — {c.slug}</li>)}
      </ul>
    </div>
  )
}
