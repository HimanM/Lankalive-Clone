import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Media(){
  const [list, setList] = useState([])
  const [file, setFile] = useState(null)
  useEffect(()=>{ api.listMedia().then(r=>setList(r)).catch(()=>setList([])) }, [])
  async function onUpload(e){ e.preventDefault(); if(!file) return alert('select file'); try{ await api.uploadMedia(file); setFile(null); setList(await api.listMedia()) }catch(e){alert('upload failed')} }
  return (<div>
    <h1 className='text-2xl font-bold mb-4'>Media</h1>
    <form onSubmit={onUpload} className='mb-4'>
      <input type='file' onChange={e=>setFile(e.target.files[0])} />
      <button className='bg-blue-600 text-white px-3 ml-2'>Upload</button>
    </form>
    <ul>{list.map(m=> <li key={m.id}><img src={m.url} alt={m.file_name} style={{maxWidth:120}}/> {m.file_name}</li>)}</ul>
  </div>)
}
