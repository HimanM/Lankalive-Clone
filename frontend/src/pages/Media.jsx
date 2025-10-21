import React, { useEffect, useState } from 'react'
import api from '../api'
import { getImageUrl } from '../utils/image'
import { useAlert } from '../components/AlertSystem'

export default function Media(){
  const { success, error } = useAlert()
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
  const [deleteModal, setDeleteModal] = useState(null) // { media, usageInfo }
  const [currentPage, setCurrentPage] = useState(1)
  const imagesPerPage = 12
  const [totalItems, setTotalItems] = useState(0)

  async function load(q='', page = 1){
    try{
      const offset = (page - 1) * imagesPerPage
      const resp = await api.listMedia({ q, limit: imagesPerPage, offset })
      // Backend now returns { items, total }
      if (resp && resp.items) {
        setList(resp.items)
        setTotalItems(resp.total || 0)
      } else if (Array.isArray(resp)) {
        // backward compatibility
        setList(resp)
        setTotalItems(resp.length)
      } else {
        setList([])
        setTotalItems(0)
      }
    }catch(e){ 
      console.error('Error loading media:', e)
      setList([])
      setMessage({ text: 'Error loading media: ' + (e.message || e) })
    }
  }

  useEffect(()=>{ load(q, currentPage) }, [currentPage])

  async function onUpload(e){
    e.preventDefault();
    if(!file) {
      error('Please select a file')
      return
    }
    setLoading(true)
    try{
      const result = await api.uploadMedia(file, metadata)
      setFile(null)
      setMetadata({ alt_text: '', caption: '', credit: '' })
      setMessage({text: 'Upload successful', meta: result})
      success('Media uploaded successfully')
      // reload current page after upload
      await load(q, currentPage)
    }catch(err){
      setMessage({text: 'Upload failed: ' + (err.message||err)})
      error('Upload failed: ' + (err.message||err))
    }finally{ setLoading(false) }
  }

  async function handleDeleteClick(media) {
    setLoading(true)
    try {
      const usageInfo = await api.checkMediaUsage(media.id)
      setDeleteModal({ media, usageInfo })
    } catch(e) {
      setMessage({text: 'Error checking media usage: ' + (e.message||e)})
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteModal) return
    setLoading(true)
    try {
      await api.deleteMedia(deleteModal.media.id)
      setMessage({text: `✓ Media "${deleteModal.media.file_name}" deleted successfully`})
      setDeleteModal(null)
      // After deletion, reload current page. If the page became empty, go back one page
      await load(q, currentPage)
      if (list.length === 1 && currentPage > 1) {
        setCurrentPage(p => Math.max(1, p - 1))
      }
    } catch(e) {
      setMessage({text: 'Delete failed: ' + (e.message||e)})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Upload and manage images</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2">
            <input 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
              placeholder="Search media..." 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
            />
            <button 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold" 
              onClick={()=>load(q)}
            >
              Search
            </button>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Upload New Media</h2>
          <form onSubmit={onUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
              <input 
                type="file" 
                onChange={e=>setFile(e.target.files[0])} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                accept="image/*"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                <input 
                  type="text" 
                  value={metadata.alt_text} 
                  onChange={e => setMetadata({...metadata, alt_text: e.target.value})}
                  placeholder="Descriptive text for accessibility"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <input 
                  type="text" 
                  value={metadata.caption} 
                  onChange={e => setMetadata({...metadata, caption: e.target.value})}
                  placeholder="Image caption"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credit</label>
                <input 
                  type="text" 
                  value={metadata.credit} 
                  onChange={e => setMetadata({...metadata, credit: e.target.value})}
                  placeholder="Photo credit/source"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Media'}
            </button>
          </form>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${message.text.includes('failed') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="font-semibold text-gray-900">{message.text}</div>
            {message.meta && (
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <div><strong>URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{message.meta.url}</code></div>
                <div><strong>File:</strong> {message.meta.file_name}</div>
                <div><strong>Dimensions:</strong> {message.meta.width} x {message.meta.height} px</div>
                <div><strong>Type:</strong> {message.meta.mime_type}</div>
              </div>
            )}
          </div>
        )}

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {list.map(m=> (
            <div key={m.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={getImageUrl(m.url)} 
                  alt={m.alt_text || m.file_name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <div className="text-sm font-medium text-gray-900 truncate mb-2">{m.file_name}</div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>{m.mime_type}</div>
                  {m.width && m.height && <div>{m.width} x {m.height} px</div>}
                  {m.alt_text && <div className="truncate"><strong>Alt:</strong> {m.alt_text}</div>}
                  {m.caption && <div className="truncate"><strong>Caption:</strong> {m.caption}</div>}
                  {m.credit && <div className="truncate"><strong>Credit:</strong> {m.credit}</div>}
                </div>
                <div className="mt-3">
                  <button 
                    onClick={()=>{
                      navigator.clipboard.writeText(m.url); 
                      setMessage({text:'✓ Copied URL to clipboard', meta: m})
                    }} 
                    className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Copy URL
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(m)}
                    disabled={loading}
                    className="w-full mt-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {deleteModal.usageInfo.can_delete ? 'Confirm Delete' : 'Cannot Delete Media'}
            </h3>
            
            {deleteModal.usageInfo.can_delete ? (
              <>
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete <strong>{deleteModal.media.file_name}</strong>?
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  This action cannot be undone. The media file will be permanently removed from the server.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  <strong>{deleteModal.media.file_name}</strong> cannot be deleted because it is used in the following published article{deleteModal.usageInfo.articles.length > 1 ? 's' : ''}:
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                  <ul className="space-y-2">
                    {deleteModal.usageInfo.articles.map(article => (
                      <li key={article.id} className="text-sm">
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-gray-600">Status: {article.status}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  To delete this media, you must first archive or unpublish the article{deleteModal.usageInfo.articles.length > 1 ? 's' : ''} listed above.
                </p>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pagination Controls (below the media grid) */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">Page {currentPage} of {Math.max(1, Math.ceil(totalItems / imagesPerPage))}</span>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={(currentPage * imagesPerPage) >= totalItems}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
