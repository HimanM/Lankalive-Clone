import React, { useEffect, useState } from 'react'
import api from '../api'
import { useAlert } from '../components/AlertProvider'

export default function Sections(){
  const [secs,setSecs]=useState([])
  const [key,setKey]=useState(''); const [title,setTitle]=useState('')
  const alert = useAlert()
  useEffect(()=>{ api.listSections().then(r=>setSecs(r)).catch(()=>setSecs([])) }, [])
  async function onCreate(e){
    e.preventDefault();
    try{ await api.createSection({key,title}); setKey(''); setTitle(''); setSecs(await api.listSections()) }catch(e){ await alert.alert('Create failed: ' + (e.message||e)) }
  }
  return (<div>
    <h1 className='text-2xl font-bold mb-4'>Homepage Sections</h1>
    <form onSubmit={onCreate} className='flex gap-2 mb-4'>
      <input value={key} onChange={e=>setKey(e.target.value)} placeholder='key' className='border px-2' />
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='title' className='border px-2' />
      <button className='bg-blue-600 text-white px-3'>Create</button>
    </form>
    <ul>{secs.map(s=> <li key={s.id}>{s.key} — {s.title}</li>)}</ul>
  </div>)
}
