const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

/**
 * Convert a relative image URL to an absolute URL
 * @param {string} url - The image URL (e.g., /static/uploads/2025/10/image.png)
 * @returns {string} - Full URL to the image
 */
export function getImageUrl(url) {
  if (!url) return ''
  
  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If relative URL, prepend API base
  return API_BASE + url
}
