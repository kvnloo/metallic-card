/**
 * Platform Detection and Browser Utilities
 * Provides cross-platform compatibility detection for Android and iOS
 */

export interface PlatformInfo {
  isAndroid: boolean
  isIOS: boolean
  isMobile: boolean
  isWebKit: boolean
  isBlink: boolean
  supportsBackdropFilter: boolean
  supportsWillChange: boolean
  requiresWebKitPrefix: boolean
}

/**
 * Detect current platform and browser engine
 */
export function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return {
      isAndroid: false,
      isIOS: false,
      isMobile: false,
      isWebKit: false,
      isBlink: false,
      supportsBackdropFilter: false,
      supportsWillChange: false,
      requiresWebKitPrefix: false,
    }
  }

  const ua = navigator.userAgent || ''
  const isAndroid = /Android/i.test(ua)
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isMobile = isAndroid || isIOS

  // Detect browser engine
  // All iOS browsers use WebKit (even Chrome)
  // Android typically uses Blink (Chrome/Edge) but could be WebKit (old devices)
  const isWebKit = /WebKit/i.test(ua) && !/Chrome/i.test(ua) || isIOS
  const isBlink = /Chrome/i.test(ua) && !isIOS

  // Feature detection
  const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') ||
                                  CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
  const supportsWillChange = CSS.supports('will-change', 'transform')

  return {
    isAndroid,
    isIOS,
    isMobile,
    isWebKit,
    isBlink,
    supportsBackdropFilter,
    supportsWillChange,
    requiresWebKitPrefix: isWebKit || isIOS,
  }
}

/**
 * Get optimized transform string for current platform
 * iOS requires explicit translate3d for hardware acceleration
 */
export function getOptimizedTransform(
  rotateX: number,
  rotateY: number,
  rotateZ: number,
  platform?: PlatformInfo
): string {
  const info = platform || detectPlatform()

  // iOS and WebKit benefit from explicit translate3d(0,0,0) hint
  if (info.isIOS || info.isWebKit) {
    return `translate3d(0, 0, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
  }

  // Android/Blink can use simpler syntax
  return `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
}

/**
 * Get optimized filter string with platform-specific limits
 */
export function getOptimizedFilter(blur: number, platform?: PlatformInfo): string {
  const info = platform || detectPlatform()

  // Reduce blur intensity on mobile for better performance
  if (info.isMobile) {
    const reducedBlur = Math.min(blur, blur * 0.7) // 30% reduction
    return `blur(${reducedBlur}px)`
  }

  return `blur(${blur}px)`
}

/**
 * Get optimal will-change hint for animations
 */
export function getWillChangeHint(isAnimating: boolean, platform?: PlatformInfo): string {
  const info = platform || detectPlatform()

  if (!info.supportsWillChange) {
    return 'auto'
  }

  // Only hint during active animation to reduce memory pressure
  if (isAnimating) {
    // iOS benefits from explicit hint
    if (info.isIOS) {
      return 'transform, opacity'
    }
    // Android can handle more aggressive hints
    return 'transform'
  }

  return 'auto'
}

/**
 * Check if reduced motion is preferred (accessibility)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}

/**
 * Get optimal event listener options for touch events
 */
export function getTouchEventOptions(): AddEventListenerOptions {
  return {
    passive: true, // Critical for smooth scrolling on mobile
    capture: false,
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Request animation frame with fallback
 */
export function requestAnimFrame(callback: FrameRequestCallback): number {
  return window.requestAnimationFrame(callback)
}

/**
 * Cancel animation frame with fallback
 */
export function cancelAnimFrame(id: number): void {
  window.cancelAnimationFrame(id)
}

/**
 * Memory-safe resource disposal
 */
export function disposeResources(cleanupFn: () => void): void {
  if (typeof window !== 'undefined') {
    cleanupFn()
  }
}
