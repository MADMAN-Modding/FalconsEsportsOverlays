import { useEffect } from 'react';

export const useTheme = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return { theme: 'dark' as const, toggleTheme: () => {}, setTheme: () => {} };
};