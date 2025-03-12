// src/app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import HamburgerMenu from "./HamburgerMenu";
import NavLinks from "./NavLinks";
import InactivityTimer from "./InactivityTimer";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully", {
        duration: 3000, // Display the toast for 3 seconds
      });

      // Delay the redirect by 3 seconds to allow the toast to be visible
      setTimeout(() => {
        window.location.href = "/";
      }, 3000); // 3 seconds delay
    } catch (error) {
      toast.error("Sign-out failed. Please try again.");
      console.error("Sign-out error:", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
                BYG:XS
              </span>
            </Link>

          {/*   <ThemeToggle /> */}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
        {/*     <ThemeToggle /> */}
            <NavLinks isSignedIn={isSignedIn} />
            {/*        <ThemeToggle /> */}
            {isSignedIn && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 dark:bg-red-600 dark:hover:bg-red-700 text-sm font-medium"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <HamburgerMenu isSignedIn={isSignedIn} onSignOut={handleSignOut} />
        </div>
      </div>

      {/* Inactivity Timer */}
      {isSignedIn && <InactivityTimer onSignOut={handleSignOut} />}
    </nav>
  );
}
