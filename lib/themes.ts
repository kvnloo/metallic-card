// Theme definitions with authentic color palettes
export interface ThemeColors {
  // Background colors
  background: string
  foreground: string

  // Card colors
  card: string
  cardForeground: string

  // Border and accent colors
  border: string
  accent: string
  accentForeground: string

  // Muted colors
  muted: string
  mutedForeground: string

  // Electric border specific
  electricBorder: string
  electricLight: string
  gradient: string

  // Silver/metallic colors
  silverBright: string
  silverMedium: string
  silverDark: string
}

export interface Theme {
  id: string
  name: string
  type: 'light' | 'dark'
  colors: ThemeColors
}

// Tokyo Night (Dark) - Popular VSCode theme
export const tokyoNight: Theme = {
  id: 'tokyo-night',
  name: 'Tokyo Night',
  type: 'dark',
  colors: {
    background: '#1a1b26',
    foreground: '#c0caf5',
    card: '#24283b',
    cardForeground: '#c0caf5',
    border: '#414868',
    accent: '#7aa2f7',
    accentForeground: '#1a1b26',
    muted: '#32344a',
    mutedForeground: '#9aa5ce',
    electricBorder: '#7aa2f7',
    electricLight: '#9ece6a',
    gradient: 'rgba(122, 162, 247, 0.3)',
    silverBright: '#c0caf5',
    silverMedium: '#7aa2f7',
    silverDark: '#565f89',
  },
}

// Nord (Cool, muted colors)
export const nord: Theme = {
  id: 'nord',
  name: 'Nord',
  type: 'dark',
  colors: {
    background: '#2e3440',
    foreground: '#eceff4',
    card: '#3b4252',
    cardForeground: '#eceff4',
    border: '#4c566a',
    accent: '#88c0d0',
    accentForeground: '#2e3440',
    muted: '#434c5e',
    mutedForeground: '#d8dee9',
    electricBorder: '#88c0d0',
    electricLight: '#8fbcbb',
    gradient: 'rgba(136, 192, 208, 0.3)',
    silverBright: '#eceff4',
    silverMedium: '#88c0d0',
    silverDark: '#5e81ac',
  },
}

// Catppuccin Mocha (Pastel, soft colors)
export const catppuccin: Theme = {
  id: 'catppuccin',
  name: 'Catppuccin',
  type: 'dark',
  colors: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    card: '#313244',
    cardForeground: '#cdd6f4',
    border: '#585b70',
    accent: '#89b4fa',
    accentForeground: '#1e1e2e',
    muted: '#45475a',
    mutedForeground: '#bac2de',
    electricBorder: '#89b4fa',
    electricLight: '#94e2d5',
    gradient: 'rgba(137, 180, 250, 0.3)',
    silverBright: '#cdd6f4',
    silverMedium: '#89b4fa',
    silverDark: '#74c7ec',
  },
}

// One Dark (Atom-inspired)
export const oneDark: Theme = {
  id: 'one-dark',
  name: 'One Dark',
  type: 'dark',
  colors: {
    background: '#282c34',
    foreground: '#abb2bf',
    card: '#2c313a',
    cardForeground: '#abb2bf',
    border: '#4b5263',
    accent: '#61afef',
    accentForeground: '#282c34',
    muted: '#3e4451',
    mutedForeground: '#9196a1',
    electricBorder: '#61afef',
    electricLight: '#98c379',
    gradient: 'rgba(97, 175, 239, 0.3)',
    silverBright: '#abb2bf',
    silverMedium: '#61afef',
    silverDark: '#528bff',
  },
}

// Light theme (Default light)
export const light: Theme = {
  id: 'light',
  name: 'Light',
  type: 'light',
  colors: {
    background: '#ffffff',
    foreground: '#1a1a1a',
    card: '#f5f5f5',
    cardForeground: '#1a1a1a',
    border: '#e5e5e5',
    accent: '#3b82f6',
    accentForeground: '#ffffff',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
    electricBorder: '#9ca3af',
    electricLight: '#d1d5db',
    gradient: 'rgba(156, 163, 175, 0.2)',
    silverBright: '#e5e7eb',
    silverMedium: '#9ca3af',
    silverDark: '#6b7280',
  },
}

// Dark theme (Default dark)
export const dark: Theme = {
  id: 'dark',
  name: 'Dark',
  type: 'dark',
  colors: {
    background: '#0a0a0a',
    foreground: '#ededed',
    card: '#171717',
    cardForeground: '#ededed',
    border: '#2a2a2a',
    accent: '#ffffff',
    accentForeground: '#0a0a0a',
    muted: '#1f1f1f',
    mutedForeground: '#a3a3a3',
    electricBorder: '#c0c0c0',
    electricLight: '#e8e8e8',
    gradient: 'rgba(192, 192, 192, 0.3)',
    silverBright: '#e8e8e8',
    silverMedium: '#a8a8a8',
    silverDark: '#808080',
  },
}

// Export all themes
export const themes: Theme[] = [
  light,
  dark,
  tokyoNight,
  nord,
  catppuccin,
  oneDark,
]

// Helper to get theme by id
export const getTheme = (id: string): Theme | undefined => {
  return themes.find((theme) => theme.id === id)
}

// Helper to get default theme
export const getDefaultTheme = (): Theme => {
  return dark
}

// Helper to toggle between light and dark themes
export const getNextThemeByType = (currentId: string): Theme => {
  const current = getTheme(currentId)
  if (!current) return getDefaultTheme()

  // Get all themes of opposite type
  const oppositeType = current.type === 'light' ? 'dark' : 'light'
  const themesOfType = themes.filter(t => t.type === oppositeType)

  // Return first theme of opposite type (default light/dark)
  return themesOfType[0] || getDefaultTheme()
}
