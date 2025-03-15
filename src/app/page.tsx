// File: src/app/page.tsx
"use client";

/**
 * Landing page component with an art carousel and a content glimpse.
 * Fetches latest artwork from Storage and latest content from Firestore.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { storage, db } from "./lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faBackward,
  faForward,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [artworks, setArtworks] = useState<string[]>([]); // Art URLs from Storage
  const [currentArtIndex, setCurrentArtIndex] = useState(0); // Current art index
  interface Content {
    id: string;
    title: string;
    body: string;
    photoUrl?: string;
  }

  const [latestContent, setLatestContent] = useState<Content | null>(null); // Latest content item

  /**
   * Fetch artworks from Storage and latest content from Firestore on mount.
   */
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const storageRef = ref(storage, "art/");
        const result = await listAll(storageRef);
        const urls = await Promise.all(
          result.items.map((item) => getDownloadURL(item))
        );
        console.log("Fetched artworks from Storage:", urls);
        setArtworks(urls);
      } catch (error) {
        console.error("Error fetching artworks from Storage:", error);
      }
    };

    const fetchLatestContent = async () => {
      try {
        const q = query(
          collection(db, "content"),
          orderBy("createdAt", "desc"),
          limit(1) // Get only the newest item
        );
        const contentSnapshot = await getDocs(q);
        const contentList = contentSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            body: data.body,
            photoUrl: data.photoUrl,
          };
        });
        setLatestContent(contentList[0] || null);
      } catch (error) {
        console.error("Error fetching latest content:", error);
      }
    };

    fetchArtworks();
    fetchLatestContent();
  }, []);

  /** Navigate to next artwork in carousel */
  const handleNext = () => {
    setCurrentArtIndex((prev) => (prev + 1) % artworks.length);
  };

  /** Navigate to previous artwork in carousel */
  const handlePrevious = () => {
    setCurrentArtIndex(
      (prev) => (prev - 1 + artworks.length) % artworks.length
    );
  };

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

          {/* Art Carousel */}
          {artworks.length > 0 ? (
            <div className="w-full max-w-md mb-8 relative">
              <Link href="/art-show">
                <img
                  src={artworks[currentArtIndex]}
                  alt={`Artwork ${currentArtIndex + 1}`}
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />

              </Link>
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
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
              No artworks available.
            </p>
          )}

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
          {/* Content Glimpse */}
          {latestContent ? (
            <div className="w-full max-w-md mb-8 mt-4">
              <Link href="/content-show">
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {latestContent.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {latestContent.body.slice(0, 50)}...
                  </p>
                  {latestContent.photoUrl && (
                    <img
                      src={latestContent.photoUrl}
                      alt={latestContent.title}
                      className="mt-2 w-full h-48 object-cover rounded border-2 border-gray-300 dark:border-gray-700"
                    />
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
              No content available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* 
//src/app/page.tsx

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
} */
