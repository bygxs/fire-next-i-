"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import React from "react";
import packageJson from '../../../package.json';

/**
 * ClientLayoutWrapper component.
 *
 * This component acts as a client-side wrapper for layout elements,
 * specifically managing the visibility of the Navbar and footer based on the current pathname.
 *
 * It uses the 'usePathname' hook from 'next/navigation' to determine the current route.
 *
 * @param {React.ReactNode} children - The content to be rendered within the layout wrapper.
 *
 * @returns {JSX.Element} - The layout wrapper with conditionally rendered Navbar and footer.
 */
export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  // Get the current pathname using the 'usePathname' hook.
  const pathname = usePathname();

  // Determine if the Navbar and footer should be shown.
  // They are shown for all pages except '/art-show'.
  const showNav = pathname !== "/art-show";

  return (
    <>
      {/* Conditionally render the Navbar. */}
      {showNav && <Navbar />}

      {/* Render the children components. */}
      {children}

      {/* Conditionally render the footer. */}
      {showNav && (
        <footer className=" text-center py-4 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
          Version: {packageJson.version}
        </footer>
      )}
    </>
  );
}