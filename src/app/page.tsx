"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { storage } from "./lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        // Reference to the 'art/' folder in Firebase Storage
        const storageRef = ref(storage, "art/");
        const result = await listAll(storageRef);

        // Get download URLs for each file in the folder
        const urls = await Promise.all(
          result.items.map(async (item) => {
            return await getDownloadURL(item);
          })
        );

        console.log("Fetched artworks from Storage:", urls); // Log fetched URLs
        setArtworks(urls);
      } catch (error) {
        console.error("Error fetching artworks from Storage:", error);
      }
    };
    fetchArtworks();
  }, []);

  // Function to handle "Next" button click
  const handleNext = () => {
    setCurrentArtIndex((prev) => (prev + 1) % artworks.length);
  };

  // Function to handle "Previous" button click
  const handlePrevious = () => {
    setCurrentArtIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center pt-12 sm:pt-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Welcome to my simple Page
          </h1>
          <div>
            <h1>Hello, World!</h1>
            <FontAwesomeIcon icon={faCoffee} />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
            here you can see some writings and art
          </p>

          {/* Carousel */}
          {artworks.length > 0 ? (
            <div className="w-full max-w-md mb-8 relative">
              <Link href="/art-show">
                <img
                  src={artworks[currentArtIndex]}
                  alt={`Artwork ${currentArtIndex + 1}`}
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700"
                  onError={(e) => e.target.style.display = 'none'} // Hide if broken
                />
              </Link>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 z-10"
                title="Previous Artwork"
              >
                <FontAwesomeIcon icon={faBackward} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 z-10"
                title="Next Artwork"
              >
                <FontAwesomeIcon icon={faForward} />
              </button>
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
            let them have a look around, <br /> and find what they like. <br /> AND dislike, for that matter. <br /> done
            serving peopel, i am. <br /> done prsenting myself suitable, <br /> to hell with that. <br /> i be what i be
            hosts of many, <br /> and lord of hosts. <br /> - talking to myself, at the sart of day breadk. <br />
            i did what i did for Whatever reason,
          </p>
        </div>
      </div>
    </div>
  );
}