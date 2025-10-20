import React, { useEffect, useState } from 'react'
import api from '../api'
import { useAlert } from '../components/AlertProvider'

export default function Tags(){
  const [tags, setTags] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const alert = useAlert()
  useEffect(()=>{ api.listTags().then(r=>setTags(r)).catch(()=>setTags([])) }, [])
  async function onCreate(e){
    e.preventDefault();
    try{
      await api.createTag({name,slug}); setName(''); setSlug(''); setTags(await api.listTags())
    }catch(e){
      await alert.alert('Create failed: ' + (e.message||e))
    }
  }
  return (<div>
    <h1 className='text-2xl font-bold mb-4'>Tags</h1>
    <form onSubmit={onCreate} className='flex gap-2 mb-4'>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder='Name' className='border px-2' />
      <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder='Slug' className='border px-2' />
      <button className='bg-blue-600 text-white px-3'>Create</button>
    </form>
    <ul>{tags.map(t=> <li key={t.id}>{t.name} — {t.slug}</li>)}</ul>
  </div>)
}
