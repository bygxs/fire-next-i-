// app/store/useThemeStore.ts
import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  // Get the initial theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light"; // Avoid SSR issues
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme as Theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  return {
    theme: getInitialTheme(),
    setTheme: (theme: Theme) => {
      localStorage.setItem("theme", theme); // Save to localStorage
      document.documentElement.classList.toggle("dark", theme === "dark");
      set({ theme });
    },
    toggleTheme: () =>
      set((state) => {
        const newTheme: Theme = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme); // Save to localStorage
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        return { theme: newTheme };
      }),
  };
});