const STORAGE_KEY = 'homefix-theme';

// Returns "dark", "light", or null if nothing valid is saved.
// try/catch is needed because some browsers block LocalStorage
// (for example in certain private modes), and that throws an error.
function getSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Not fatal: the theme still works for this visit, it just won't be remembered.
  }
}

function getCurrentTheme() {
  // The inline script in index.html has already set this attribute.
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

// The CSS reads data-theme to move the thumb and change its icon.
// aria-checked is for assistive technology (screen readers).
function applyTheme(theme, toggle) {
  document.documentElement.dataset.theme = theme;
  toggle.setAttribute('aria-checked', String(theme === 'dark'));
}

export function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');

  // Sync the switch with the theme that is already showing.
  applyTheme(getSavedTheme() ?? getCurrentTheme(), toggle);

  toggle.addEventListener('click', () => {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next, toggle);
    saveTheme(next);
  });
}