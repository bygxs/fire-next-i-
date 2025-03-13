// File: src/app/art-show/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ArtShowPage() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchArt = async () => {
      const artDoc = await getDoc(doc(db, "art", "latest"));
      if (artDoc.exists()) setPhotoUrl(artDoc.data().photoUrl);
    };
    fetchArt();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"} p-6 flex flex-col items-center`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      {photoUrl && (
        <img
          src={photoUrl}
          alt="Latest Art"
          className="max-w-full h-auto border-2 border-gray-300 dark:border-gray-700"
        />
      )}
    </div>
  );
}