"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Define theme types
type Theme = "light" | "dark" | "system";

// Create context with defaults and required methods
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // State to track the current theme
  const [theme, setTheme] = useState<Theme>("system");

  // State to track if component has mounted (to prevent hydration issues)
  const [mounted, setMounted] = useState(false);

  // Apply the theme to the document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const isDark =
      newTheme === "dark" ||
      (newTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Set data-theme attribute on html element
    root.setAttribute("data-theme", isDark ? "dark" : "light");

    // Apply CSS variables based on theme
    if (isDark) {
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#ededed");
    } else {
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--foreground", "#171717");
    }
  };

  // Effect to initialize theme from localStorage and handle system preference changes
  useEffect(() => {
    // Set mounted to true once component has mounted
    setMounted(true);

    // Get saved theme from localStorage or default to system
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "system";
    setTheme(initialTheme);

    // Apply the theme
    applyTheme(initialTheme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    // Add event listener for system preference changes
    mediaQuery.addEventListener("change", handleChange);

    // Clean up event listener
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Function to change theme and save to localStorage
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Provide the theme context to children
  const contextValue = {
    theme,
    setTheme: handleThemeChange,
  };

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
