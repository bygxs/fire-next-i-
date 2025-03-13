"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AdminPhotoUploadPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
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
    try {
      const storageRef = ref(storage, `content/${Date.now()}_${photo.name}`);
      await uploadBytes(storageRef, photo);
      const photoUrl = await getDownloadURL(storageRef);
      
      // Save to content collection with minimal data
      await addDoc(collection(db, "content"), {
        title: photo.name, // Default title from file name
        body: "", // Empty body—photo-only entry
        photoUrl,
        createdBy: auth.currentUser?.uid,
        createdAt: new Date().toISOString(),
      });
      
      setPhoto(null);
      alert("Photo uploaded!");
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  if (loading) return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Admin - Upload Photo</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <label htmlFor="photo" className="text-gray-700 dark:text-gray-300">Choose a Photo:</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 mb-4 dark:text-gray-200"
        />
        <button
          onClick={handleUpload}
          disabled={!photo} // Disable if no file selected
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Upload Photo
        </button>
      </div>
    </div>
  );
}