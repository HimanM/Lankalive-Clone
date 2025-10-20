const API_BASE = import.meta.env.VITE_API_BASE

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
  
  // In production (when VITE_API_BASE is empty or not set), 
  // return relative URL so it uses the current domain via Nginx proxy
  if (!API_BASE || API_BASE === '') {
    return url
  }
  
  // In development, prepend API base (e.g., http://localhost:8000)
  return API_BASE + url
}
