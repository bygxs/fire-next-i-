// src/app/components/NavLinks.tsx
import Link from "next/link";

interface NavLinksProps {
  isSignedIn: boolean;
  onLinkClick?: () => void; // Optional callback for closing the hamburger menu
}

export default function NavLinks({ isSignedIn, onLinkClick }: NavLinksProps) {
  return (
    <>
      <Link
                href="/admin/users"
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-center sm:w-auto w-full"
              >
                Go to Admin Panel
              </Link>
      <Link href="/" onClick={onLinkClick}>
        <span className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
          Home
        </span>
      </Link>

      <Link href="/content-show" onClick={onLinkClick}>
        <span className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
          content
        </span>
      </Link>

      {isSignedIn && (
        <>
          <Link href="/dashboard" onClick={onLinkClick}>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Dashboard
            </span>
          </Link>
          <Link href="/onboarding" onClick={onLinkClick}>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Onboarding
            </span>
          </Link>
          <Link href="/profile" onClick={onLinkClick}>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Profile
            </span>
          </Link>
        </>
      )}

      {!isSignedIn && (
        <>
          <Link href="/signin-form" onClick={onLinkClick}>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Sign In
            </span>
          </Link>
          <Link href="/signup-form" onClick={onLinkClick}>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Sign Up
            </span>
          </Link>
        </>
      )}
    </>
  );
}
