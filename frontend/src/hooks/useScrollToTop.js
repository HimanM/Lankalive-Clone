import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls window to top whenever the provided dependencies change.
 * If no deps array is provided, it defaults to listening to the location pathname.
 * Usage:
 *  - useScrollToTop() // scrolls when pathname changes
 *  - useScrollToTop([currentPage]) // scrolls when currentPage changes
 */
export default function useScrollToTop(deps) {
  const { pathname } = useLocation()

  useEffect(() => {
    // Smooth scroll to top for better UX when changing pages
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch (e) {
      // Fallback in environments where smooth isn't supported
      window.scrollTo(0, 0)
    }
  // If deps were provided, use them; otherwise use pathname
  }, deps && Array.isArray(deps) ? deps : [pathname])
}
