import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls window to top whenever the location pathname changes.
 * Import and call this at the top of any page component.
 */
export default function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Small timeout to let route transitions settle (optional)
    // but usually window.scrollTo is fine immediately.
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])
}
