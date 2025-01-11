'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { darkTheme, lightTheme } from '../../lib/theme';

const ThemeModeContext = createContext({
  toggleTheme: () => { },
  mode: 'light',
});

export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  const appliedTheme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeModeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={appliedTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);