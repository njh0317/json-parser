import { useState, useEffect } from 'react';
import { Theme } from '../types';
import { initTheme, toggleTheme as toggle, setTheme } from '../services/themeManager';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const initialTheme = initTheme();
    setThemeState(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = toggle();
    setThemeState(newTheme);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  return { theme, toggleTheme, setTheme: changeTheme };
}
