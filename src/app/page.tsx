// src/page.tsx
import Link from "next/link";
import Navbar from "../app/components/Navbar";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    // Main container with responsive padding
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Centered content with max-width */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center pt-12 sm:pt-20">
          {/* Responsive heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Welcome to my simple Page
          </h1>
          {/* Responsive paragraph */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
            here you can see some writings and art 
          </p>
          
          {/* Button container with responsive stacking */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
            <Link
              href="/signin-form"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                text-center w-full sm:w-auto"
            >
              Go to Sign-In
            </Link>

            <Link
              href="/signup-form"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                text-center w-full sm:w-auto"
            >
              Sign Up
            </Link>

            <Link
              href="/art-show"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-purple-600 
                transition duration-300 dark:bg-purple-600 dark:hover:bg-purple-700 
                text-center w-full sm:w-auto"
            >
              View Art
            </Link>
          </div>

          {/* Responsive text block */}
    {/* Fictional artist/developer paragraph */}
    <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
            I’m Alex Rivera, a digital artist and web developer with a passion for blending 
            creativity with code. By day, I craft immersive user interfaces with React and 
            Tailwind, and by night, I paint vibrant digital landscapes that have been 
            featured in galleries across the coast. My work bridges the gap between 
            technical precision and artistic expression, delivering experiences that are 
            both functional and beautiful.
          </p>
        </div>
      </div>
    </div>
  );
}