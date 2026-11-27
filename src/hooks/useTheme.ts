import { useEffect, useState } from 'react';
import type { ThemeId } from '../types/exegesis';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  emoji: string;
  subtitle: string;
  canvasSwatch: string;
  surfaceSwatch: string;
  accentSwatch: string;
  isDark?: boolean;
}

export const APP_THEMES: ThemeOption[] = [
  {
    id: 'pergamino',
    name: 'Pergamino Clásico',
    emoji: '🏛️',
    subtitle: 'Marfil editorial y azul lapislázuli',
    canvasSwatch: '#FAF9F6',
    surfaceSwatch: '#FFFFFF',
    accentSwatch: '#1E3A8A',
  },
  {
    id: 'papiro',
    name: 'Papiro Antiguo',
    emoji: '📜',
    subtitle: 'Sepia cálido de manuscrito y terracota',
    canvasSwatch: '#F5ECD7',
    surfaceSwatch: '#FCF7E8',
    accentSwatch: '#8B3A1E',
  },
  {
    id: 'olivo',
    name: 'Olivo de Galilea',
    emoji: '🌿',
    subtitle: 'Lino herbal sereno y verde bosque',
    canvasSwatch: '#F1F5EE',
    surfaceSwatch: '#FAFCF8',
    accentSwatch: '#1F5E43',
  },
  {
    id: 'zafiro',
    name: 'Códice Zafiro',
    emoji: '💎',
    subtitle: 'Alabastro mineral e índigo profundo',
    canvasSwatch: '#F1F5FA',
    surfaceSwatch: '#FFFFFF',
    accentSwatch: '#2B3D9E',
  },
  {
    id: 'camino',
    name: 'Camino de Luz',
    emoji: '🕯️',
    subtitle: 'Salvia serena, blanco puro y turquesa profundo',
    canvasSwatch: '#EEF2E8',
    surfaceSwatch: '#FFFFFF',
    accentSwatch: '#0F5C66',
  },
  {
    id: 'nocturno',
    name: 'Noche de Estudio',
    emoji: '🌙',
    subtitle: 'Obsidiana suave con oro antiguo',
    canvasSwatch: '#111318',
    surfaceSwatch: '#191D24',
    accentSwatch: '#D4A34C',
    isDark: true,
  },
];

const THEME_STORAGE_KEY = 'scriptura_theme_v1';

function getStoredTheme(): ThemeId {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && APP_THEMES.some((t) => t.id === raw)) {
      return raw as ThemeId;
    }
  } catch {
    // Ignore storage issues
  }
  return 'pergamino';
}

export function applyThemeToDocument(themeId: ThemeId): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', themeId);
  if (themeId === 'nocturno') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const initial = getStoredTheme();
    if (typeof document !== 'undefined') {
      applyThemeToDocument(initial);
    }
    return initial;
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const currentTheme = APP_THEMES.find((t) => t.id === theme) ?? APP_THEMES[0];

  return {
    theme,
    setTheme,
    currentTheme,
    themes: APP_THEMES,
  };
}
