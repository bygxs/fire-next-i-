// File: src/app/art-show/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import RootLayout from "../layout";
import { useRouter } from "next/navigation"; // Import useRouter

export default function ArtShowPage() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchArt = async () => {
      const artDoc = await getDoc(doc(db, "art", "latest"));
      if (artDoc.exists()) setPhotoUrl(artDoc.data().photoUrl);
    };
    fetchArt();
  }, []);

  return (
    //<div className={`min-h-screen  p-6 flex flex-col items-center`}>
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-white"
      } p-6 flex flex-col items-center`}
    >
      {/* Back button for mobile navigation */}
      <button
        onClick={() => router.push("/")} // Navigate on click
        className="fixed top-4 left-4 p-2 bg-gray-300 text-white rounded z-10" // Back button styling
      >
        {/*  🔙  */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 bg-gray-300 text-white rounded z-10"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.086l-1.591 1.591M21 12h-2.25m-.086 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773l1.591-1.591"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.71 9.71 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.333.266-2.597.748-3.752A10.245 10.245 0 0012 3c5.523 0 10.002 4.477 10.002 10.002z"
            />
          </svg>
        )}
      </button>

      {photoUrl && (
        <img
          src={photoUrl}
          alt="Latest Art"
          className="max-w-full h-auto border-2 border-gray-300 dark:border-gray-700"
        />
      )}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="m-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
