// File: src/app/art-show/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage"; // Import Firebase Storage methods
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward, faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ArtShowPage() {
  const [artworks, setArtworks] = useState<{ id: string; imageUrl: string }[]>([]);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);

        // Initialize Firebase Storage and reference the 'art/' folder
        const storage = getStorage();
        const artRef = ref(storage, "art/");

        // Fetch all files in the 'art/' folder using listAll
        const result = await listAll(artRef);

        // Generate download URLs for each file using getDownloadURL
        const urls = await Promise.all(
          result.items.map(async (item) => ({
            id: item.name, // Use the file name as the ID
            imageUrl: await getDownloadURL(item), // Get valid URL for the image
          }))
        );

        // Shuffle the images using Fisher-Yates Shuffle
        const shuffledUrls = shuffleArray(urls);

        // Update state with shuffled images
        setArtworks(shuffledUrls);
      } catch (error) {
        console.error("Error fetching images from Firebase Storage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // Fisher-Yates Shuffle Algorithm to randomize the array
  const shuffleArray = (array: { id: string; imageUrl: string }[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const handleNextArtwork = () => {
    setCurrentArtworkIndex((prevIndex) => (prevIndex + 1) % artworks.length);
  };

  const handlePreviousArtwork = () => {
    setCurrentArtworkIndex(
      (prevIndex) => (prevIndex - 1 + artworks.length) % artworks.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Exit Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-20"
        title="Back to Home"
      >
        <FontAwesomeIcon icon={faHome} />
      </Link>

      {artworks.length > 0 && (
        <div className="flex justify-center items-center flex-grow relative max-h-[80vh]">
          {/* Display current artwork */}
          <img
            src={artworks[currentArtworkIndex].imageUrl}
            alt={`Artwork ${currentArtworkIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {/* Previous Artwork Button */}
          <button
            title="Previous Artwork"
            onClick={handlePreviousArtwork}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-10"
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>

          {/* Next Artwork Button */}
          <button
            title="Next Artwork"
            onClick={handleNextArtwork}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-10"
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
      )}
    </div>
  );
}



/* // File: src/app/art-show/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage"; // Import Firebase Storage methods
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward, faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ArtShowPage() {
  const [artworks, setArtworks] = useState<{ id: string; imageUrl: string }[]>([]);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);

        // Initialize Firebase Storage and reference the 'art/' folder
        const storage = getStorage();
        const artRef = ref(storage, "art/");

        // Fetch all files in the 'art/' folder using listAll
        const result = await listAll(artRef);

        // Generate download URLs for each file using getDownloadURL
        const urls = await Promise.all(
          result.items.map(async (item) => ({
            id: item.name, // Use the file name as the ID
            imageUrl: await getDownloadURL(item), // Get valid URL for the image
          }))
        );

        // Update state with fetched images
        setArtworks(urls);
      } catch (error) {
        console.error("Error fetching images from Firebase Storage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleNextArtwork = () => {
    setCurrentArtworkIndex((prevIndex) => (prevIndex + 1) % artworks.length);
  };

  const handlePreviousArtwork = () => {
    setCurrentArtworkIndex(
      (prevIndex) => (prevIndex - 1 + artworks.length) % artworks.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      // {/* Exit Button 
      <Link
        href="/"
        className="fixed top-4 left-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-20"
        title="Back to Home"
      >
        <FontAwesomeIcon icon={faHome} />
      </Link>

      {artworks.length > 0 && (
        <div className="flex justify-center items-center flex-grow relative max-h-[80vh]">
          // {/* Display current artwork 
          <img
            src={artworks[currentArtworkIndex].imageUrl}
            alt={`Artwork ${currentArtworkIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          // {/* Previous Artwork Button 
          <button
            title="Previous Artwork"
            onClick={handlePreviousArtwork}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-10"
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>

          // {/* Next Artwork Button 
          <button
            title="Next Artwork"
            onClick={handleNextArtwork}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-10"
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
      )}
    </div>
  );
} */


/* 
// File: src/app/art-show/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward, faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ArtShowPage() {
  const [artworks, setArtworks] = useState<{ id: string; imageUrl: string }[]>([]);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "artworks"));
        const artworkList = querySnapshot.docs.map((doc) => ({ id: doc.id, imageUrl: doc.data().imageUrl }));
        setArtworks(artworkList);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  const handleNextArtwork = () => {
    setCurrentArtworkIndex((prevIndex) => (prevIndex + 1) % artworks.length);
  };

  const handlePreviousArtwork = () => {
    setCurrentArtworkIndex(
      (prevIndex) => (prevIndex - 1 + artworks.length) % artworks.length
    );
  };

  const handleSwipe = (direction: string) => {
    if (direction === 'left') {
      handleNextArtwork();
    } else if (direction === 'right') {
      handlePreviousArtwork();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative ">
      // {/* Exit Button *
      <Link
        href="/"
        className="fixed top-4 left-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-20"
        title="Back to Home"
      >
        <FontAwesomeIcon icon={faHome} />
      </Link>
      {artworks.length > 0 && (
        <div className="flex justify-center items-center flex-grow relative max-h-[80vh]">
          <img
            src={artworks[currentArtworkIndex].imageUrl}
            alt={`Artwork ${currentArtworkIndex + 1}`}
            className="max-w-full max-h-full object-fit"
            onError={(e) => {
              setArtworks(artworks.filter((_, i) => i !== currentArtworkIndex));
              setCurrentArtworkIndex((prev) => (prev === 0 ? 0 : prev - 1));
            }} // Skip broken images
          />
          <button
            title="Previous Artwork"
            onClick={handlePreviousArtwork}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-10"
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button
            title="Next Artwork"
            onClick={handleNextArtwork}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-10"
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
      )}
    </div>
  );
}




 */