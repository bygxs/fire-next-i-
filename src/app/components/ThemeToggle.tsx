'use client';

import { useEffect, useState } from 'react';

/**
 * ThemeToggle Component
 * 
 * A simple component that toggles between light and dark themes.
 * It uses an emoji as the toggle button and persists the theme preference in localStorage.
 * 
 * @returns JSX.Element - The rendered toggle button
 */
const ThemeToggle = () => {
  // State to track current theme (light or dark)
  const [darkMode, setDarkMode] = useState(false);

  // Effect that runs once on component mount
  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      // Get the saved theme from localStorage or use system preference as default
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        // If a theme preference exists in localStorage, use it
        setDarkMode(savedTheme === 'dark');
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        // Otherwise check for system preference
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isSystemDark);
        document.documentElement.classList.toggle('dark', isSystemDark);
      }
    }
  }, []);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Update the class on the document root element
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Store the theme preference in localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    // Update CSS variables dynamically
    if (newDarkMode) {
      document.documentElement.style.setProperty('--background', '#0a0a0a');
      document.documentElement.style.setProperty('--foreground', '#ededed');
    } else {
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--foreground', '#171717');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
    >
      {/* Display moon emoji for dark mode, sun emoji for light mode */}
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;