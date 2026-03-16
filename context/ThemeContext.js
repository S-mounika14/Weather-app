// context/ThemeContext.js
// Shares dark mode value across all screens

import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveDarkMode, getDarkMode } from '../storage/storage';

// Create context
const ThemeContext = createContext();

// Provider — wraps whole app
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const saved = await getDarkMode();
    setIsDark(saved);
  }

  async function toggleTheme() {
    const newVal = !isDark;
    setIsDark(newVal);
    await saveDarkMode(newVal);
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — use in any screen
export function useTheme() {
  return useContext(ThemeContext);
}