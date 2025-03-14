// src/page.tsx
import Link from "next/link";
import Navbar from "../app/components/Navbar";
import ThemeToggle from "./components/ThemeToggle";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

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
          <div>
      <h1>Hello, World!</h1>
      <FontAwesomeIcon icon={faCoffee} />
    </div>
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
           let them have a look around, <br/> and find what they like.  <br/>   AND dislike, for that matter. <br/> done serving peopel, i am. <br/> done prsenting myself suitable, <br/> to hell with that. <br/> i be what i be hosts of many, <br/> and lord of hosts. <br/> - talking to myself, at the sart of day breadk. <br/>
           i did what i did for Whatever reason,
          </p>
        </div>
      </div>
    </div>
  );
}