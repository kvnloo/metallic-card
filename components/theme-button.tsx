'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Palette, Check } from 'lucide-react'
import { themes, getTheme, getNextThemeByType } from '@/lib/themes'

export function ThemeButton() {
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const { theme, setTheme } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showDropdown) return

      if (event.key === 'Escape') {
        setShowDropdown(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showDropdown])

  const handleMouseEnter = () => {
    // Show dropdown after 600ms delay (optimal UX timing)
    const timeout = setTimeout(() => {
      setShowDropdown(true)
    }, 600)
    setHoverTimeout(timeout)
  }

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before delay completes
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    // Keep dropdown open if already showing
  }

  const handleClick = () => {
    if (!mounted || !theme) return

    // Toggle between light and dark theme types
    const nextTheme = getNextThemeByType(theme)
    setTheme(nextTheme.id)
  }

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId)
    setShowDropdown(false)
  }

  if (!mounted) {
    return null
  }

  const currentTheme = getTheme(theme || 'dark')

  return (
    <div
      ref={dropdownRef}
      className="theme-button-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className="theme-button"
        aria-label="Toggle theme"
        title="Click to toggle light/dark, hover for more themes"
      >
        <Palette size={20} />
      </button>

      {showDropdown && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <span>Select Theme</span>
            <span className="theme-dropdown-hint">Click button to toggle</span>
          </div>
          <div className="theme-dropdown-list">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeSelect(t.id)}
                className={`theme-dropdown-item ${theme === t.id ? 'active' : ''}`}
                aria-label={`Select ${t.name} theme`}
              >
                <span className="theme-dropdown-item-name">{t.name}</span>
                <span className="theme-dropdown-item-type">{t.type}</span>
                {theme === t.id && <Check size={16} className="theme-dropdown-check" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .theme-button-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
        }

        .theme-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: radial-gradient(
              47.2% 50% at 50.39% 88.37%,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0) 100%
            ),
            rgba(255, 255, 255, 0.04);
          color: var(--foreground);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .theme-button:hover {
          transform: translateY(-2px);
          background: radial-gradient(
              47.2% 50% at 50.39% 88.37%,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.05) 100%
            ),
            rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(255, 255, 255, 0.1);
        }

        .theme-button:active {
          transform: translateY(0);
        }

        .theme-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 220px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3),
            0 10px 10px -5px rgba(0, 0, 0, 0.2);
          animation: dropdownFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .theme-dropdown-header {
          padding: 12px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 4px;
        }

        .theme-dropdown-header span:first-child {
          display: block;
          font-weight: 600;
          font-size: 14px;
          color: var(--foreground);
          margin-bottom: 4px;
        }

        .theme-dropdown-hint {
          display: block;
          font-size: 11px;
          color: var(--muted-foreground);
        }

        .theme-dropdown-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .theme-dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--foreground);
          font-size: 14px;
          text-align: left;
        }

        .theme-dropdown-item:hover {
          background: var(--accent);
          color: var(--accent-foreground);
        }

        .theme-dropdown-item.active {
          background: var(--accent);
          color: var(--accent-foreground);
          font-weight: 500;
        }

        .theme-dropdown-item-name {
          flex: 1;
        }

        .theme-dropdown-item-type {
          font-size: 11px;
          text-transform: uppercase;
          opacity: 0.7;
          margin-right: 8px;
          letter-spacing: 0.5px;
        }

        .theme-dropdown-check {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .theme-button-container {
            top: 16px;
            right: 16px;
          }

          .theme-button {
            width: 44px;
            height: 44px;
          }

          .theme-dropdown {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  )
}
