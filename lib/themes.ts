// Theme definitions with OFFICIAL color palettes from each theme's source
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

  // Icon colors (syntax-highlighting style)
  iconColors: string[]

  // Text element colors (syntax-highlighting style)
  nameColor: string    // Name/title color (like class/function names)
  roleColor: string    // Role/description color (like strings/attributes)
}

export interface Theme {
  id: string
  name: string
  type: 'light' | 'dark'
  colors: ThemeColors
}

// Tokyo Night (Dark) - Official VSCode theme
// Source: https://github.com/tokyo-night/tokyo-night-vscode-theme
export const tokyoNight: Theme = {
  id: 'tokyo-night',
  name: 'Tokyo Night',
  type: 'dark',
  colors: {
    background: '#1a1b26',      // Official background
    foreground: '#c0caf5',      // Official white/foreground
    card: '#24283b',            // Official storm background (for cards)
    cardForeground: '#c0caf5',
    border: '#414868',          // Official black terminal color
    accent: '#7aa2f7',          // Official blue
    accentForeground: '#1a1b26',
    muted: '#32344a',           // Slightly lighter than border
    mutedForeground: '#9aa5ce', // Official markdown text
    electricBorder: '#7aa2f7',  // Blue accent
    electricLight: '#9ece6a',   // Official URL/green
    gradient: 'rgba(36, 40, 59, 0.4)', // Card color with slight transparency for depth
    silverBright: '#c0caf5',    // White
    silverMedium: '#7aa2f7',    // Blue
    silverDark: '#565f89',      // Official comments
    iconColors: [
      '#7aa2f7',  // LinkedIn - Blue (professional, link-like)
      '#bb9af7',  // Behance - Purple (creative, artistic)
      '#7dcfff',  // GitHub - Cyan (technical, code-related)
      '#ff9e64',  // Phone - Orange (warm, attention-grabbing)
      '#e0af68',  // Email - Yellow (communication, highlight)
      '#9ece6a',  // Map Pin - Green (location, stable, earthy)
    ],
    nameColor: '#7dcfff',    // Cyan (like function/class names)
    roleColor: '#7dcfff',    // Same as name - cyan
  },
}

// Nord (Cool, muted colors)
// Source: https://www.nordtheme.com/docs/colors-and-palettes/
export const nord: Theme = {
  id: 'nord',
  name: 'Nord',
  type: 'dark',
  colors: {
    background: '#2e3440',      // nord0 - Polar Night
    foreground: '#eceff4',      // nord6 - Snow Storm
    card: '#3b4252',            // nord1 - Polar Night
    cardForeground: '#eceff4',
    border: '#4c566a',          // nord3 - Polar Night
    accent: '#88c0d0',          // nord8 - Frost
    accentForeground: '#2e3440',
    muted: '#434c5e',           // nord2 - Polar Night
    mutedForeground: '#d8dee9', // nord4 - Snow Storm
    electricBorder: '#88c0d0',  // nord8 - Frost (cyan)
    electricLight: '#8fbcbb',   // nord7 - Frost (teal)
    gradient: 'rgba(59, 66, 82, 0.4)', // Card color (nord1) with slight transparency
    silverBright: '#eceff4',    // nord6 - brightest
    silverMedium: '#88c0d0',    // nord8 - Frost
    silverDark: '#5e81ac',      // nord10 - Frost (dark blue)
    iconColors: [
      '#5e81ac',  // LinkedIn - Frost Blue 4 (professional, deepest blue)
      '#b48ead',  // Behance - Aurora Purple (creative, artistic)
      '#88c0d0',  // GitHub - Frost Blue 2 (technical, bright cyan-blue)
      '#d08770',  // Phone - Aurora Orange (warm, inviting)
      '#ebcb8b',  // Email - Aurora Yellow (communication, warm)
      '#a3be8c',  // Map Pin - Aurora Green (location, natural, earthy)
    ],
    nameColor: '#bf616a',    // Aurora Red (nord11 - stands out from background)
    roleColor: '#bf616a',    // Same as name - red
  },
}

// Catppuccin Mocha (Pastel, soft colors)
// Source: https://catppuccin.com/palette/
export const catppuccin: Theme = {
  id: 'catppuccin',
  name: 'Catppuccin',
  type: 'dark',
  colors: {
    background: '#1e1e2e',      // Base
    foreground: '#cdd6f4',      // Text
    card: '#313244',            // Surface 0
    cardForeground: '#cdd6f4',
    border: '#585b70',          // Surface 2
    accent: '#89b4fa',          // Blue
    accentForeground: '#1e1e2e',
    muted: '#45475a',           // Surface 1
    mutedForeground: '#bac2de', // Subtext 1
    electricBorder: '#89b4fa',  // Blue
    electricLight: '#94e2d5',   // Teal
    gradient: 'rgba(49, 50, 68, 0.4)', // Card color (Surface 0) with slight transparency
    silverBright: '#cdd6f4',    // Text
    silverMedium: '#89b4fa',    // Blue
    silverDark: '#74c7ec',      // Sapphire
    iconColors: [
      '#89b4fa',  // LinkedIn - Blue (professional, primary link color)
      '#cba6f7',  // Behance - Mauve (creative, vibrant purple)
      '#89dceb',  // GitHub - Sky (technical, bright cyan)
      '#fab387',  // Phone - Peach (warm, friendly, accessible)
      '#f9e2af',  // Email - Yellow (communication, attention)
      '#94e2d5',  // Map Pin - Teal (location, stable, earthy-cool)
    ],
    nameColor: '#89dceb',    // Sky (bright cyan)
    roleColor: '#89dceb',    // Same as name
  },
}

// One Dark (Atom-inspired)
// Source: https://github.com/atom/one-dark-syntax
export const oneDark: Theme = {
  id: 'one-dark',
  name: 'One Dark',
  type: 'dark',
  colors: {
    background: '#282c34',      // Official background
    foreground: '#abb2bf',      // Official foreground
    card: '#2c313a',            // Slightly lighter than background
    cardForeground: '#abb2bf',
    border: '#4b5263',          // Gutter grey
    accent: '#61afef',          // Official blue
    accentForeground: '#282c34',
    muted: '#3e4451',           // Grey (inactive)
    mutedForeground: '#5c6370', // Comment grey
    electricBorder: '#61afef',  // Blue
    electricLight: '#98c379',   // Official green
    gradient: 'rgba(44, 49, 58, 0.4)', // Card color with slight transparency for depth
    silverBright: '#abb2bf',    // Foreground
    silverMedium: '#61afef',    // Blue
    silverDark: '#56b6c2',      // Official cyan
    iconColors: [
      '#61afef',  // LinkedIn - Blue (professional, standard link)
      '#c678dd',  // Behance - Purple (creative, distinctive)
      '#56b6c2',  // GitHub - Cyan (technical, code-focused)
      '#d19a66',  // Phone - Orange (warm, action-oriented)
      '#e5c07b',  // Email - Yellow (communication, highlight)
      '#98c379',  // Map Pin - Green (location, grounded, natural)
    ],
    nameColor: '#56b6c2',    // Cyan
    roleColor: '#56b6c2',    // Same as name
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
    electricBorder: '#1a1a1a',  // Black
    electricLight: '#1a1a1a',   // Black
    gradient: 'rgba(26, 26, 26, 0.2)',  // Black with transparency
    silverBright: '#e5e7eb',
    silverMedium: '#9ca3af',
    silverDark: '#6b7280',
    iconColors: [
      '#1a1a1a',  // LinkedIn - Black
      '#1a1a1a',  // Behance - Black
      '#1a1a1a',  // GitHub - Black
      '#1a1a1a',  // Phone - Black
      '#1a1a1a',  // Email - Black
      '#1a1a1a',  // Map Pin - Black
    ],
    nameColor: '#1a1a1a',    // Black
    roleColor: '#1a1a1a',    // Black
  },
}

// Dark theme (Default dark - Silver metallic)
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
    electricBorder: '#c0c0c0',  // Silver
    electricLight: '#e8e8e8',   // Bright silver
    gradient: 'rgba(192, 192, 192, 0.3)',
    silverBright: '#e8e8e8',
    silverMedium: '#a8a8a8',
    silverDark: '#808080',
    iconColors: [
      '#e8e8e8',  // LinkedIn - Bright silver
      '#e8e8e8',  // Behance - Bright silver
      '#e8e8e8',  // GitHub - Bright silver
      '#e8e8e8',  // Phone - Bright silver
      '#e8e8e8',  // Email - Bright silver
      '#e8e8e8',  // Map Pin - Bright silver
    ],
    nameColor: '#e8e8e8',    // Bright silver
    roleColor: '#e8e8e8',    // Same as name
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
