

"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

export default function ArtShowPage() {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "artworks"));
        const artworkUrls: string[] = [];
        querySnapshot.forEach((doc) => {
          artworkUrls.push(doc.data().imageUrl);
        });
        setArtworks(artworkUrls);
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

  // Swipe gesture handling
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
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Display current artwork */}
      {artworks.length > 0 && (
        <div className="flex justify-center items-center flex-grow relative">
          <img
            src={artworks[currentArtworkIndex]}
            alt={`Artwork ${currentArtworkIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          {/* Navigation buttons */}
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














/* "use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudMoon,
  faSun,
  faBackward,
  faForward,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

export default function ArtShowPage() {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "artworks"));
        const artworkUrls: string[] = [];
        querySnapshot.forEach((doc) => {
          artworkUrls.push(doc.data().imageUrl);
        });
        setArtworks(artworkUrls);
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

  if (loading) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center`} // Added justify-center and removed  //   ${darkMode ? "bg-gray-900" : "bg-white" }
    >
     
      {artworks.length > 0 && (
        <div className="flex justify-center items-center flex-grow">
       
          <img
            src={artworks[currentArtworkIndex]}
            alt={`Artwork ${currentArtworkIndex + 1}`}
            className="max-w-full max-h-full object-contain" // Changed class to max-w-full and max-h-full and object-contain
          />
        </div>
      )}

      {
      <div className="mt-4 flex space-x-134">
        <button
          title="Previous Artwork"
          onClick={handlePreviousArtwork}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faBackward} />
        </button>

        <button
          title="Next Artwork"
          onClick={handleNextArtwork}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faForward} />
        </button>
      </div>
    </div>
  );
}
 */








/* // File: src/app/art-show/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore"; // Import collection and getDocs
import RootLayout from "../layout";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faCloudMoon,
  faSun,
  faBackward,
  faForward,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

export default function ArtShowPage() {
  const [artworks, setArtworks] = useState<string[]>([]); // State to store all artwork URLs
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0); // State to track current artwork index
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true); // State to track loading state

  useEffect(() => {
    const fetchArtworks = async () =>{ 
      try {
        setLoading(true); // Set loading to true while fetching data
        const querySnapshot = await getDocs(collection(db, "artworks"));
        const artworkUrls: string[] = [];
        querySnapshot.forEach((doc) => {
          artworkUrls.push(doc.data().imageUrl);
        });
        setArtworks(artworkUrls);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchArtworks();
  }, []);

  const handleNextArtwork = () => {
    setCurrentArtworkIndex((prevIndex) => (prevIndex + 1) % artworks.length); // Increment index, loop back to 0 if at the end
  };

  const handlePreviousArtwork = () => {
    setCurrentArtworkIndex(
      (prevIndex) => (prevIndex - 1 + artworks.length) % artworks.length
    ); // Decrement index, loop back to the end if at 0
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-white"
        } flex justify-center items-center`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-white"
      } p-6 flex flex-col items-center`}
    >
   
      <button
        title="Go back"
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 p-2 bg-gray-700 text-white rounded z-10"
      >
        <FontAwesomeIcon icon={faDoorOpen} />
      </button>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 bg-gray-700 text-white rounded z-10"
      >
        {darkMode ? (
          <FontAwesomeIcon icon={faCloudMoon} />
        ) : (
          <FontAwesomeIcon icon={faSun} />
        )}
      </button>

 
      {artworks.length > 0 && (
        <img
          src={artworks[currentArtworkIndex]}
          alt={`Artwork ${currentArtworkIndex + 1}`}
          className="max-w-full h-auto border-2 border-gray-00 dark:border-gray-700"
        />
      )}

     
      <div className="mt-4 flex space-x-4">
        <button
          title="Previous Artwork"
          onClick={handlePreviousArtwork}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faBackward} />
        </button>
        <button
          title="Next Artwork"
          onClick={handleNextArtwork}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faForward} />
        </button>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="m-4 px-2 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
       
        <FontAwesomeIcon
          icon={darkMode ? faSun : faCloudMoon}
          className="ml-2"
        />
      </button>
    </div>
  );
} */

/* // File: src/app/art-show/page.tsx
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
     
      <button
        onClick={() => router.push("/")} // Navigate on click
        className="fixed top-4 left-4 p-2 bg-gray-300 text-white rounded z-10" // Back button styling
      >
          🔙  
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
  strokeWidth="2"
  strokeLinecap="round" // Corrected line
  strokeLinejoin="round" // Corrected line
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
 */
