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
import CategoryPage from './pages/CategoryPage'
import AdminDashboard from './pages/AdminDashboard'
import ArticleEditor from './pages/ArticleEditor'
import ArticlesList from './pages/ArticlesList'
import Layout from './components/Layout'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/article/:slug' element={<Article />} />
        <Route path='/category/:slug' element={<CategoryPage />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/tags' element={<Tags />} />
        <Route path='/media' element={<Media />} />
        <Route path='/users' element={<Users />} />
        <Route path='/sections' element={<Sections />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/articles' element={<ArticlesList />} />
        <Route path='/admin/article/:id' element={<ArticleEditor />} />
        <Route path='/admin/categories' element={<Categories />} />
        <Route path='/admin/tags' element={<Tags />} />
        <Route path='/admin/media' element={<Media />} />
      </Routes>
    </Layout>
  )
}
