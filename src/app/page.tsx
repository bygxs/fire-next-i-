 //src/app/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { storage, auth } from "./lib/firebase"; //import { storage, auth, generateToken } from "./lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import BlogGlimpse from "./components/BlogGlimpse";

export default function Home() {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const storageRef = ref(storage, "art/");
        const result = await listAll(storageRef);
        const urls = await Promise.all(
          result.items.map((item) => getDownloadURL(item))
        );
        setArtworks(urls);
        setCurrentArtIndex(Math.floor(Math.random() * urls.length)); // Random start
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };
    fetchArtworks();

    const interval = setInterval(() => {
      setCurrentArtIndex((prev) => (prev + 1) % artworks.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [artworks.length]);

  const handleCarouselClick = () => {
    if (auth.currentUser) {
      router.push("/art-show");
    } else {
      router.push("/sign-fullstack?redirect=/art-show");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-between pt-8 sm:pt-12 lg:pt-16 h-full">
          {/*   <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            whatever
          </h1> */}

          <h4 className="text-l italic sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
            ...the eye is not satisfied with seeing, <br /> nor the ear filled
            with hearing. Ecclesiastes 1:8
          </h4>
          {artworks.length > 0 ? (
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mb-8">
              <img
                src={artworks[currentArtIndex]}
                alt={`Artwork ${currentArtIndex + 1}`}
                className="w-full h-86 sm:h-80 md:h-96 lg:h-[32rem] object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
                onClick={handleCarouselClick}
              />
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
              chill,downloading artworks....
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
            <Link
              href="/sign-fullstack"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign In / Sign Up
            </Link>

            <button
              className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 dark:bg-purple-600 dark:hover:bg-purple-700 text-center w-full sm:w-auto"
              onClick={handleCarouselClick}
            >
              View Art
            </button>
            {/* 
            <Link
              href="/test-notifications"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Test Notification
            </Link>

            <Link
              href="/signsign"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign Up & In
            </Link>
            <Link
              href="/signin-form"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign In / Sign Up
            </Link>
            <Link
              href="/signup-form"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign Up
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}


/*
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { storage, auth } from "./lib/firebase"; //import { storage, auth, generateToken } from "./lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import BlogGlimpse from "./components/BlogGlimpse";

export default function Home() {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const storageRef = ref(storage, "art/");
        const result = await listAll(storageRef);
        const urls = await Promise.all(
          result.items.map((item) => getDownloadURL(item))
        );
        setArtworks(urls);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };
    fetchArtworks();

    const interval = setInterval(() => {
      setCurrentArtIndex((prev) => (prev + 1) % artworks.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [artworks.length]);

  const handleCarouselClick = () => {
    if (auth.currentUser) {
      router.push("/art-show");
    } else {
      router.push("/sign-fullstack?redirect=/art-show");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center pt-8 sm:pt-12 lg:pt-16">
      //    {/*   <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            whatever
         </h1> 

          <h2 className="text-l italic sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
            ...the eye is not satisfied with seeing, <br /> nor the ear filled
            with hearing. Ecclesiastes 1:8
          </h2>
          {artworks.length > 0 ? (
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mb-8">
              <img
                src={artworks[currentArtIndex]}
                alt={`Artwork ${currentArtIndex + 1}`}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
                onClick={handleCarouselClick}
              />
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
              chill,downloading artworks....
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
            <Link
              href="/sign-fullstack"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign In / Sign Up
            </Link>

            <button
              className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 dark:bg-purple-600 dark:hover:bg-purple-700 text-center w-full sm:w-auto"
              onClick={handleCarouselClick}
            >
              View Art
            </button>
            {/* 
            <Link
              href="/test-notifications"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Test Notification
            </Link>

            <Link
              href="/signsign"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign Up & In
            </Link>
            <Link
              href="/signin-form"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign In / Sign Up
            </Link>
            <Link
              href="/signup-form"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign Up
            </Link> 
          </div>
        </div>
      </div>
    </div>
  );
}
 */