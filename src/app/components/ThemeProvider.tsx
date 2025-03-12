// app/components/ThemeProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "../store/useThemeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side rendering
  useEffect(() => {
    setMounted(true);
    // Apply the theme to the HTML tag after mounting
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Render nothing or a loading state before mounting on the client
  if (!mounted) return null;

  return <>{children}</>;
}