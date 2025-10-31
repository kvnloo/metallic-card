'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { themes, getTheme } from '@/lib/themes'
import { useEffect } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={defaultTheme}
      themes={themes.map((t) => t.id)}
      enableSystem={false}
      storageKey="metallic-card-theme"
    >
      <ThemeApplier>{children}</ThemeApplier>
    </NextThemesProvider>
  )
}

// Component to apply theme CSS variables
function ThemeApplier({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)

    // Apply theme colors as CSS custom properties
    const applyTheme = (themeId: string) => {
      const theme = getTheme(themeId)
      if (!theme) return

      const root = document.documentElement
      const { colors } = theme

      // Apply all theme colors as CSS custom properties
      root.style.setProperty('--background', colors.background)
      root.style.setProperty('--foreground', colors.foreground)
      root.style.setProperty('--card', colors.card)
      root.style.setProperty('--card-foreground', colors.cardForeground)
      root.style.setProperty('--border', colors.border)
      root.style.setProperty('--accent', colors.accent)
      root.style.setProperty('--accent-foreground', colors.accentForeground)
      root.style.setProperty('--muted', colors.muted)
      root.style.setProperty('--muted-foreground', colors.mutedForeground)
      root.style.setProperty('--electric-border-color', colors.electricBorder)
      root.style.setProperty('--electric-light-color', colors.electricLight)
      root.style.setProperty('--gradient-color', colors.gradient)
      root.style.setProperty('--silver-bright', colors.silverBright)
      root.style.setProperty('--silver-medium', colors.silverMedium)
      root.style.setProperty('--silver-dark', colors.silverDark)

      // Apply icon colors (syntax-highlighting style)
      colors.iconColors.forEach((color, index) => {
        root.style.setProperty(`--icon-color-${index + 1}`, color)
      })

      // Apply text element colors
      root.style.setProperty('--name-color', colors.nameColor)
      root.style.setProperty('--role-color', colors.roleColor)
    }

    // Get current theme from data-theme attribute
    const getCurrentTheme = () => {
      return document.documentElement.getAttribute('data-theme') || 'dark'
    }

    // Apply initial theme
    applyTheme(getCurrentTheme())

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          applyTheme(getCurrentTheme())
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return <>{children}</>
}
