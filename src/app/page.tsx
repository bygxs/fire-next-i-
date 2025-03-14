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
        <div className="inline-block gap-x-1 py-2.5 px-2.5">
          <Link
            href="/signin-form"
            className="m-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Go to Sign-In
          </Link>

          <Link
            href="/signup-form"
            className="m-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Sign Up
          </Link>

          <Link
            href="/art-show"
            className="m-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            View Art
          </Link>
        </div>
        <p className="m-8 ">
          Nisi consequat officia laborum occaecat ex occaecat. Eu sit cupidatat
          mollit magna id excepteur aliquip aute deserunt duis laboris duis
          voluptate. Sit laboris consequat aute in occaecat et eiusmod. Mollit
          commodo fugiat laboris deserunt reprehenderit exercitation labore ex
          do occaecat aliquip in aliquip aute. Elit consectetur excepteur esse
          do ut non minim culpa tempor ut nostrud culpa sit. Do excepteur culpa
          pariatur adipisicing velit proident. Est duis velit pariatur veniam.
          Proident do qui eiusmod anim mollit sit. Ipsum tempor non eu cupidatat
          adipisicing amet irure.
        </p>
      </div>
    </div>
  );
}
