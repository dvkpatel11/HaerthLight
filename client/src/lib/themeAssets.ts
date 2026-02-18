import type { Theme } from '../types'

const THEME_BACKGROUNDS: Record<Theme, string> = {
  'golden-warmth': '/assets/backgrounds/golden-warmth.webp',
  'midnight-bloom': '/assets/backgrounds/midnight-bloom.webp',
  'ocean-calm': '/assets/backgrounds/ocean-calm.webp',
  'forest-dawn': '/assets/backgrounds/forest-dawn.webp',
  celestial: '/assets/backgrounds/celestial.webp',
}

const SHARED_TEXTURES: string[] = [
  '/assets/textures/parchment.webp',
  '/assets/textures/mist.webp',
  '/assets/textures/light-rays.webp',
]

const SHARED_LOTTIE_OVERLAY = '/assets/lottie/mist-drift.json'

export function getThemeBackground(theme: Theme | string): string {
  if ((THEME_BACKGROUNDS as Record<string, string>)[theme]) {
    return (THEME_BACKGROUNDS as Record<string, string>)[theme]
  }
  return THEME_BACKGROUNDS['golden-warmth']
}

export function getThemeTextureLayers(_theme: Theme | string): string[] {
  return SHARED_TEXTURES
}

export function getThemeLottieOverlay(_theme: Theme | string): string | null {
  return SHARED_LOTTIE_OVERLAY
}

