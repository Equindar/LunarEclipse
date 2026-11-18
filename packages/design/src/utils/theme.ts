
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function setTheme(theme: Theme): void {
  const root = document.documentElement;

  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;

  localStorage.setItem(STORAGE_KEY, theme);
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';
}

export function toggleTheme(): void {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
