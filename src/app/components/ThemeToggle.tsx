// app/components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "../store/useThemeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 border rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
    >
   {theme === "dark" ? "🌞" : "🌜 "}
    </button>
  );
}