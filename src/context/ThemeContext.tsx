import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type FontSizeScale = 'sm' | 'base' | 'lg' | 'xl';

export interface FontSizeOption {
  id: FontSizeScale;
  label: string;
  sublabel: string;
  sizePx: number;
  percentage: string;
}

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  {
    id: 'sm',
    label: 'Compacta',
    sublabel: 'Mayor densidad de datos',
    sizePx: 14,
    percentage: '88%',
  },
  {
    id: 'base',
    label: 'Normal',
    sublabel: 'Estándar recomendada',
    sizePx: 16,
    percentage: '100%',
  },
  {
    id: 'lg',
    label: 'Grande',
    sublabel: 'Mayor comodidad visual',
    sizePx: 18,
    percentage: '112%',
  },
  {
    id: 'xl',
    label: 'Muy grande',
    sublabel: 'Accesibilidad etaria alta',
    sizePx: 20,
    percentage: '125%',
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  fontSize: FontSizeScale;
  setFontSize: (size: FontSizeScale) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  fontSizeOptions: FontSizeOption[];
  currentFontOption: FontSizeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'senda_theme_mode';
const FONT_SIZE_STORAGE_KEY = 'senda_font_scale';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // Ignore storage restrictions
  }
  return 'light';
};

const getInitialFontSize = (): FontSizeScale => {
  if (typeof window === 'undefined') return 'base';
  try {
    const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizeScale;
    if (saved && FONT_SIZE_OPTIONS.some((opt) => opt.id === saved)) {
      return saved;
    }
  } catch {
    // Ignore storage restrictions
  }
  return 'base';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [fontSize, setFontSizeState] = useState<FontSizeScale>(getInitialFontSize);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  };

  const applyFontSize = (scale: FontSizeScale) => {
    const option = FONT_SIZE_OPTIONS.find((opt) => opt.id === scale) || FONT_SIZE_OPTIONS[1];
    const root = document.documentElement;
    root.style.fontSize = `${option.sizePx}px`;
    root.style.setProperty('--senda-font-size', `${option.sizePx}px`);
  };

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  useEffect(() => {
    applyFontSize(fontSize);
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
    } catch {
      // storage unavailable
    }
  }, [fontSize]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setFontSize = (scale: FontSizeScale) => {
    setFontSizeState(scale);
  };

  const increaseFontSize = () => {
    const currentIndex = FONT_SIZE_OPTIONS.findIndex((opt) => opt.id === fontSize);
    if (currentIndex < FONT_SIZE_OPTIONS.length - 1) {
      setFontSizeState(FONT_SIZE_OPTIONS[currentIndex + 1].id);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = FONT_SIZE_OPTIONS.findIndex((opt) => opt.id === fontSize);
    if (currentIndex > 0) {
      setFontSizeState(FONT_SIZE_OPTIONS[currentIndex - 1].id);
    }
  };

  const currentFontOption =
    FONT_SIZE_OPTIONS.find((opt) => opt.id === fontSize) || FONT_SIZE_OPTIONS[1];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
        fontSize,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        fontSizeOptions: FONT_SIZE_OPTIONS,
        currentFontOption,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
