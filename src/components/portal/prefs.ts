import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "campus-theme";

export type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    // Default to light mode; only use dark when the user explicitly chose it.
    const initial: Theme = stored === "dark" ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}

// Single source of truth for language lives in ./i18n (event-driven so every
// component re-renders on change). Re-export to keep existing imports working.
export { languages, useLanguage } from "./i18n";
