"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { storage } from "../lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

export default function ArtCarousel() {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);

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
        console.error("Error fetching artworks from Storage:", error);
      }
    };
    fetchArtworks();
  }, []);

  const handleNext = () => {
    setCurrentArtIndex((prev) => (prev + 1) % artworks.length);
  };

  const handlePrevious = () => {
    setCurrentArtIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  const fixedHeight = "400px"; // Set a fixed height

  return artworks.length > 0 ? (
    <div className="w-full max-w-md mb-8 relative" style={{ height: fixedHeight }}>
      <Link href="/art-show">
        <img
          src={artworks[currentArtIndex]}
          alt={`Artwork ${currentArtIndex + 1}`}
          className="w-full h-full object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700"
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
    <p className="text-gray-600 dark:text-gray-400 mb-8 text-center" style={{ height: fixedHeight }}>
      No artworks available.
    </p>
  );
}





//"use client";

/**
 * Component for displaying a carousel of artworks from Firebase Storage.
 */
/* 
import { useEffect, useState } from "react";
import Link from "next/link";
import { storage } from "../lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

export default function ArtCarousel() {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);

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
    fetchArtworks();
  }, []);

  const handleNext = () => {
    setCurrentArtIndex((prev) => (prev + 1) % artworks.length);
  };

  const handlePrevious = () => {
    setCurrentArtIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  return artworks.length > 0 ? (
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
  );
} */