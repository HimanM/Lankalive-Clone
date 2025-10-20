const API_BASE = import.meta.env.VITE_API_BASE
const DOMAIN = import.meta.env.VITE_DOMAIN

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
  
  // If VITE_API_BASE is set, use it (development or custom API base)
  if (API_BASE && API_BASE !== '') return API_BASE + url

  // If a DOMAIN was provided, construct the full HTTPS URL
  if (DOMAIN && DOMAIN !== '') return `https://${DOMAIN}${url}`

  // Otherwise return the relative URL so it uses the same origin in production
  return url
}
