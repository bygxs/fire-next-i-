// File: src/app/admin/art-upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../lib/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { ref, deleteObject, uploadBytes, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import Link from "next/link";

export default function AdminArtUploadPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [artworks, setArtworks] = useState<{ id: string; imageUrl: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return router.push("/");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") return router.push("/dashboard");
      setIsAdmin(true);
      setLoading(false);
      syncArtworksWithStorage();
    };
    checkAdmin();
  }, [router]);

  const syncArtworksWithStorage = async () => {
    const storageList = await listAll(ref(storage, "art"));
    const storageFiles = storageList.items.map((item) => item.name);
    const storageUrls = await Promise.all(storageFiles.map(async (name) => getDownloadURL(ref(storage, `art/${name}`))));
    
    const querySnapshot = await getDocs(collection(db, "artworks"));
    const firestoreDocs = querySnapshot.docs;
    for (const docSnap of firestoreDocs) {
      const url = docSnap.data().imageUrl;
      if (!storageUrls.includes(url)) await deleteDoc(doc(db, "artworks", docSnap.id));
    }

    const artList = storageFiles.map((name, i) => ({
      id: name,
      imageUrl: storageUrls[i],
    }));
    setArtworks(artList);
  };

  const handleUpload = async () => {
    if (!photos.length) return;
    const urls = [];
    for (const photo of photos) {
      const storageRef = ref(storage, `art/${photo.name}`);
      try {
        await getMetadata(storageRef); // Check if file exists
        console.log(`Skipping duplicate: ${photo.name}`);
        continue; // Skip if already in Storage
      } catch (e) {
        // File doesn’t exist, proceed with upload
        await uploadBytes(storageRef, photo);
        const photoUrl = await getDownloadURL(storageRef);
        urls.push(photoUrl);
        await setDoc(doc(db, "artworks", photo.name), { imageUrl: photoUrl, createdAt: new Date().toISOString() });
      }
    }
    setPreviewUrls(urls);
    setPhotos([]);
    syncArtworksWithStorage();
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this artwork?")) return;
    const storageRef = ref(storage, `art/${id}`);
    await deleteObject(storageRef);
    await deleteDoc(doc(db, "artworks", id));
    setArtworks(artworks.filter((art) => art.id !== id));
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Upload Art</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full max-w-md">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">Pick Your Art:
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files || []))}
            className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
          />
        </label>
        <button
          onClick={handleUpload}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload
        </button>
        {previewUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-green-500 mb-2">Uploaded!</p>
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Uploaded Art ${index + 1}`}
                className="max-w-full h-auto border-2 border-gray-300 dark:border-gray-700 rounded mb-2"
              />
            ))}
          </div>
        )}
        <Link
          href="/art-show"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-2"
        >
          View Art
        </Link>
      </div>
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">All Artworks</h2>
        <div className="grid grid-cols-2 gap-4">
          {artworks.map((art) => (
            <div key={art.id} className="relative">
              <img
                src={art.imageUrl}
                alt="Artwork"
                className="w-full h-auto border-2 border-gray-300 dark:border-gray-700 rounded"
              />
              <button
                onClick={() => handleDelete(art.id, art.imageUrl)}
                className="absolute top-1 right-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}