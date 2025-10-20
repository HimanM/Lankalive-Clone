import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Article from './pages/Article'
import Admin from './pages/Admin'
import Categories from './pages/Categories'
import Tags from './pages/Tags'
import Media from './pages/Media'
import Users from './pages/Users'
import Sections from './pages/Sections'
import Layout from './components/Layout'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
  <Route path='/article/:slug' element={<Article />} />
  <Route path='/categories' element={<Categories />} />
  <Route path='/tags' element={<Tags />} />
  <Route path='/media' element={<Media />} />
  <Route path='/users' element={<Users />} />
  <Route path='/sections' element={<Sections />} />
  <Route path='/admin' element={<Admin />} />
      </Routes>
    </Layout>
  )
}
