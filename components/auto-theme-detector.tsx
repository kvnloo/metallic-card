'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

const MANUAL_THEME_KEY = 'manual-theme-override'

export function AutoThemeDetector() {
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // Check if user has manually selected a theme
    const hasManualOverride = localStorage.getItem(MANUAL_THEME_KEY)
    if (hasManualOverride) {
      console.log('Auto theme: Manual override detected, skipping auto-theme')
      return
    }

    // Check if browser supports prefers-color-scheme
    if (!window.matchMedia) {
      console.log('Browser does not support prefers-color-scheme')
      return
    }

    // Function to update theme based on system preference
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      // Double-check manual override hasn't been set
      if (localStorage.getItem(MANUAL_THEME_KEY)) {
        return
      }

      const isDarkMode = e.matches
      setTheme(isDarkMode ? 'dark' : 'light')
      console.log('Auto theme:', {
        systemPreference: isDarkMode ? 'dark' : 'light',
        selectedTheme: isDarkMode ? 'dark' : 'light'
      })
    }

    // Create media query for dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Set initial theme based on system preference
    updateTheme(darkModeQuery)

    // Listen for changes to system preference
    // Modern browsers use addEventListener
    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener('change', updateTheme)
      return () => darkModeQuery.removeEventListener('change', updateTheme)
    } else {
      // Fallback for older browsers
      darkModeQuery.addListener(updateTheme)
      return () => darkModeQuery.removeListener(updateTheme)
    }
  }, [setTheme, theme])

  return null
}
