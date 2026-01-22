import { Theme } from '../types';

const STORAGE_KEY = 'json-parser-theme';

/**
 * 현재 테마를 가져옵니다.
 */
export function getTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return detectSystemTheme();
}

/**
 * 테마를 설정합니다.
 */
export function setTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

/**
 * 테마를 토글합니다.
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next: Theme = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
}

/**
 * 시스템 테마를 감지합니다.
 */
export function detectSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * 테마를 DOM에 적용합니다.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
}

/**
 * 초기 테마를 설정합니다.
 */
export function initTheme(): Theme {
  const theme = getTheme();
  applyTheme(theme);
  return theme;
}
