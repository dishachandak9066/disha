'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;

  setTheme: (theme: Theme) => Promise<void>;

  toggleTheme: () => Promise<void>;
};

const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  );

// SAVE THEME TO API
async function persistTheme(theme: Theme) {
  try {
    await fetch('/api/theme', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ theme }),

      cache: 'no-store',
    });
  } catch (error) {
    console.error(
      'Failed to persist theme:',
      error
    );
  }
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;

  initialTheme: Theme;
}) {
  const [theme, setThemeState] =
    useState<Theme>(initialTheme);

  const [mounted, setMounted] =
    useState(false);

  // INITIAL LOAD
  useEffect(() => {
    if (typeof window === 'undefined')
      return;

    const loadTheme = async () => {
      try {
        // LOCAL STORAGE
        const storedTheme =
          localStorage.getItem(
            'readeverse_theme'
          ) as Theme | null;

        if (
          storedTheme === 'light' ||
          storedTheme === 'dark'
        ) {
          setThemeState(storedTheme);

          return;
        }

        // API THEME
        const response = await fetch(
          '/api/theme',
          {
            cache: 'no-store',
          }
        );

        if (response.ok) {
          const json =
            await response.json();

          if (
            json.theme === 'light' ||
            json.theme === 'dark'
          ) {
            setThemeState(json.theme);

            return;
          }
        }

        // SYSTEM THEME
        const prefersDark =
          window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;

        setThemeState(
          prefersDark ? 'dark' : 'light'
        );
      } catch (error) {
        console.error(
          'Failed to load theme:',
          error
        );
      } finally {
        setMounted(true);
      }
    };

    loadTheme();
  }, []);

  // APPLY THEME
  useEffect(() => {
    if (!mounted) return;

    const root =
      document.documentElement;

    // REMOVE OLD
    root.classList.remove(
      'light',
      'dark'
    );

    // ADD NEW
    root.classList.add(theme);

    // SAVE LOCAL
    localStorage.setItem(
      'readeverse_theme',
      theme
    );
  }, [theme, mounted]);

  // SET THEME
  const setTheme = async (
    nextTheme: Theme
  ) => {
    setThemeState(nextTheme);

    localStorage.setItem(
      'readeverse_theme',
      nextTheme
    );

    await persistTheme(nextTheme);
  };

  // TOGGLE THEME
  const toggleTheme = async () => {
    const nextTheme =
      theme === 'dark'
        ? 'light'
        : 'dark';

    await setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeProvider'
    );
  }

  return context;
}