import React, { useState } from 'react'
import api from '../api'

export default function Users(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [pw,setPw]=useState('')
  async function onCreate(e){ e.preventDefault(); try{ await api.createUser({name,email,password_hash:pw}); setName(''); setEmail(''); setPw(''); alert('created') }catch(e){alert('create failed')} }
  return (<div>
    <h1 className='text-2xl font-bold mb-4'>Users</h1>
    <form onSubmit={onCreate} className='space-y-2 max-w-md'>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder='Name' className='w-full border px-2' />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' className='w-full border px-2' />
      <input value={pw} onChange={e=>setPw(e.target.value)} placeholder='Password' type='password' className='w-full border px-2' />
      <button className='bg-blue-600 text-white px-3 py-2'>Create</button>
    </form>
  </div>)
}
