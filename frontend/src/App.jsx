import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Article from './pages/Article'
import Admin from './pages/Admin'
import CategoryPage from './pages/CategoryPage'
import AdminDashboard from './pages/AdminDashboard'
import ArticleEditor from './pages/ArticleEditor'
import ArticlesList from './pages/ArticlesList'
import CategoriesManagement from './pages/CategoriesManagement'
import TagsManagement from './pages/TagsManagement'
import Media from './pages/Media'
import Layout from './components/Layout'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/article/:slug' element={<Article />} />
        <Route path='/category/:slug' element={<CategoryPage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/articles' element={<ArticlesList />} />
        <Route path='/admin/articles/:id' element={<ArticleEditor />} />
        <Route path='/admin/categories' element={<CategoriesManagement />} />
        <Route path='/admin/tags' element={<TagsManagement />} />
        <Route path='/admin/media' element={<Media />} />
      </Routes>
    </Layout>
  )
}
