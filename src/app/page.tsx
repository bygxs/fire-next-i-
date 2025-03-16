
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { storage } from "./lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const storageRef = ref(storage, "art/");
        const result = await listAll(storageRef);
        const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
        setArtworks(urls);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };
    fetchArtworks();

    const interval = setInterval(() => {
      setCurrentArtIndex((prev) => (prev + 1) % artworks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [artworks.length]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center pt-12 sm:pt-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Welcome to my simple Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
            Here you can see some writings and art.
          </p>

          {/* Mini Carousel */}
          {artworks.length > 0 ? (
            <div className="w-full max-w-md mb-8">
              <Link href="/signin-form">
                <img
                  src={artworks[currentArtIndex]}
                  alt={`Artwork ${currentArtIndex + 1}`}
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700"
                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
              </Link>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">No artworks available.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
            <Link
              href="/signin-form"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Go to Sign-In
            </Link>
            <Link
              href="/signup-form"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign Up
            </Link>
            <Link
              href="/art-show"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 dark:bg-purple-600 dark:hover:bg-purple-700 text-center w-full sm:w-auto"
            >
              View Art
            </Link>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
            Let them have a look around, <br /> and find what they like. <br /> AND dislike, for that matter. <br /> Done serving people, I am. <br /> Done presenting myself suitable, <br /> to hell with that. <br /> I be what I be, hosts of many, <br /> and lord of hosts. <br /> - Talking to myself, at the start of daybreak. <br /> I did what I did for whatever reason.
          </p>
        </div>
      </div>
    </div>
  );
}























/* "use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import ArtCarousel from "./components/ArtCarousel";
import BlogGlimpse from "./components/BlogGlimpse";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pt-4 sm:pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center md:text-left">
              Welcome to my simple Page
            </h1>
           
            <p className=" text-gray-600 dark:text-gray-400 mb-3 text-center md:text-left max-w-2xl">
            <FontAwesomeIcon icon={faCoffee} /> Hello, World! here you can see some writings and art
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto ">
              <Link
                href="/signin-form"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
              >
                Go to Sign-In
              </Link>
              <Link
                href="/signup-form"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
              >
                Sign Up
              </Link>
              <Link
                href="/art-show"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 dark:bg-purple-600 dark:hover:bg-purple-700 text-center w-full sm:w-auto"
              >
                View Art
              </Link>
          
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 items-stretch">
          <div className="w-full md:w-1/2">
            <ArtCarousel />
          </div>
          </div>
            <p className="text-gray-600 italic dark:text-gray-400 text-center md:text-left max-w-2xl">
              let them have a look around, <br /> and find what they like. <br />{" "}
              AND dislike, for that matter. <br /> done serving peopel, i am.{" "}
              <br /> done prsenting myself suitable, <br /> to hell with that.{" "}
              <br /> i be what i be hosts of many, <br /> and lord of hosts.{" "}
              <br /> - talking to myself, at the start of day breadk. <br />i did
              what i did for Whatever reason. <br />*
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <BlogGlimpse />
          </div>
        </div>
        
      </div>
    </div>
  );
}
 */



/*  "use client";


//  * Landing page component using modular ArtCarousel and BlogGlimpse components.


import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import ArtCarousel from "./components/ArtCarousel";
import BlogGlimpse from "./components/BlogGlimpse"; // Ensure this path is correct or update it to the correct path

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center pt-4 sm:pt-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Welcome to my simple Page
          </h1>
          <FontAwesomeIcon icon={faCoffee} />
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
            Hello, World! here you can see some writings and art
          </p>

          <ArtCarousel />

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-4">
            <Link
              href="/signin-form"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Go to Sign-In
            </Link>
            <Link
              href="/signup-form"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-center w-full sm:w-auto"
            >
              Sign Up
            </Link>
            <Link
              href="/art-show"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 dark:bg-purple-600 dark:hover:bg-purple-700 text-center w-full sm:w-auto"
            >
              View Art
            </Link>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
            let them have a look around, <br /> and find what they like. <br />{" "}
            AND dislike, for that matter. <br /> done serving peopel, i am.{" "}
            <br /> done prsenting myself suitable, <br /> to hell with that.{" "}
            <br /> i be what i be hosts of many, <br /> and lord of hosts.{" "}
            <br /> - talking to myself, at the sart of day breadk. <br />i did
            what i did for Whatever reason,
          </p>

          <BlogGlimpse />
        </div>
      </div>
    </div>
  );
}




 */