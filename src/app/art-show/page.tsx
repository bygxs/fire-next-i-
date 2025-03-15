
// File: src/app/art-show/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

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
    <div className="min-h-screen flex flex-col items-center justify-center relative">
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




