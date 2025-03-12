// src/app/components/HamburgerMenu.tsx
"use client";

import { useState } from "react";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

interface HamburgerMenuProps {
  isSignedIn: boolean;
  onSignOut: () => void;
}

export default function HamburgerMenu({ isSignedIn, onSignOut }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Icon */}
      <button onClick={toggleMenu} className="p-2 focus:outline-none">
        {isOpen ? (
          <span className="text-2xl">✕</span> // Close icon
        ) : (
          <span className="text-2xl">☰</span> // Hamburger icon
        )}
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeMenu}
        ></div>
      )}

      {/* Menu Content */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col space-y-4">
          {/* Nav Links */}
          <NavLinks isSignedIn={isSignedIn} onLinkClick={closeMenu} />

          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ThemeToggle />
          </div>

          {/* Sign Out Button */}
          {isSignedIn && (
            <button
              onClick={() => {
                onSignOut();
                closeMenu();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 dark:bg-red-600 dark:hover:bg-red-700 text-sm font-medium"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}