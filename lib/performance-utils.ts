/**
 * Performance optimization utilities for mobile devices
 */

/**
 * Throttle function using requestAnimationFrame
 * Ensures callback runs at most once per frame (60fps)
 */
export function throttleRAF<T extends (...args: any[]) => void>(callback: T): T {
  let rafId: number | null = null
  let lastArgs: any[] | null = null

  const throttled = (...args: any[]) => {
    lastArgs = args

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          callback(...lastArgs)
        }
        rafId = null
        lastArgs = null
      })
    }
  }

  return throttled as T
}

/**
 * Detect if device is mobile/low-end
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  // Check for touch support and screen size
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth <= 768

  return hasTouch || isSmallScreen
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get optimal performance settings based on device
 */
export function getPerformanceSettings() {
  const isMobile = isMobileDevice()
  const reducedMotion = prefersReducedMotion()

  return {
    enableComplexFilters: !isMobile, // Disable SVG filters on mobile
    enableBlur: !isMobile, // Disable blur effects on mobile
    enableTransitions: !reducedMotion,
    throttleDelay: isMobile ? 100 : 16, // Longer throttle on mobile
    maxRotation: isMobile ? 5 : 10, // Reduce 3D effect on mobile
  }
}
