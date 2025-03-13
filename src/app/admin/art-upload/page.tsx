// File: src/app/admin/art-upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function AdminArtUploadPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // For preview
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return router.push("/");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") return router.push("/dashboard");
      setIsAdmin(true);
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const handleUpload = async () => {
    if (!photo) return;
    const storageRef = ref(storage, `art/latest`);
    await uploadBytes(storageRef, photo);
    const photoUrl = await getDownloadURL(storageRef);
    await setDoc(doc(db, "art", "latest"), { photoUrl, createdAt: new Date().toISOString() });
    setPreviewUrl(photoUrl); // Show preview
    setPhoto(null);
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Upload Art</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full max-w-md">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">Pick Your Art:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        />
        <button
          onClick={handleUpload}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload
        </button>
        {previewUrl && (
          <div className="mt-4">
            <p className="text-green-500 mb-2">Uploaded!</p>
            <img
              src={previewUrl}
              alt="Uploaded Art"
              className="max-w-full h-auto border-2 border-gray-300 dark:border-gray-700 rounded"
            />
          </div>
        )}
        <Link
          href="/art-show"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-2"
        >
          View Art
        </Link>
      </div>
    </div>
  );
}