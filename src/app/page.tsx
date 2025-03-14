// src/page.tsx
import Link from "next/link";
import Navbar from "../app/components/Navbar";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Welcome to the Landing Page
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This is a simple landing page with dark mode support.
        </p>

        <Link
          href="/signin-form"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Go to Sign-In
        </Link>

        <Link
          href="/signup-form"
          className="mt-7 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Sign Up
        </Link>

        <Link
          href="/art-show"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-2"
        >
          View Art
        </Link>
        <div> </div>
      </div>
    </div>
  );
}
