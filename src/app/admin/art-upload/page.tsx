// File: src/app/admin/art-upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../lib/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function AdminArtUploadPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return router.push("/");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") return router.push("/dashboard");
      setIsAdmin(true);
      setLoading(false);
      fetchArtworks();
    };
    checkAdmin();
  }, [router]);

  const fetchArtworks = async () => {
    const querySnapshot = await getDocs(collection(db, "artworks"));
    const artList = querySnapshot.docs.map((doc) => ({ id: doc.id, imageUrl: doc.data().imageUrl }));
    setArtworks(artList);
  };

  const handleUpload = async () => {
    if (!photos.length) return;
    const urls = [];
    for (const photo of photos) {
      const storageRef = ref(storage, `art/${photo.name}`);
      await uploadBytes(storageRef, photo);
      const photoUrl = await getDownloadURL(storageRef);
      urls.push(photoUrl);
      await addDoc(collection(db, "artworks"), { imageUrl: photoUrl, createdAt: new Date().toISOString() });
    }
    setPreviewUrls(urls);
    setPhotos([]);
    fetchArtworks();
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Delete this artwork?")) return;
    await deleteDoc(doc(db, "artworks", id));
    const fileName = imageUrl.split('/art%2F')[1].split('?')[0];
    const storageRef = ref(storage, `art/${fileName}`);
    await deleteObject(storageRef);
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
            <div key={art.id} className="relative" style={{ display: art.imageUrl ? 'block' : 'none' }}>
              <img
                src={art.imageUrl}
                alt="Artwork"
                className="w-full h-auto border-2 border-gray-300 dark:border-gray-700 rounded"
                onError={(e) => e.target.parentElement.style.display = 'none'} // Hide div if img fails
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


/* "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../lib/firebase";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore"; // Ensure getDoc and doc are imported
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function AdminArtUploadPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [artworkUrls, setArtworkUrls] = useState<string[]>([]); // New state for all artwork URLs
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return router.push("/");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") return router.push("/dashboard");
      setIsAdmin(true);
      setLoading(false);
      fetchArtworks(); // Fetch artworks on component mount
    };
    checkAdmin();
  }, [router]);

  const fetchArtworks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "artworks"));
      const urls: string[] = [];
      querySnapshot.forEach((doc) => {
        urls.push(doc.data().imageUrl);
      });
      setArtworkUrls(urls);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  const handleUpload = async () => {
    if (!photos.length) return;
    const urls: string[] = [];
    for (const photo of photos) {
      const storageRef = ref(storage, `art/${photo.name}`);
      await uploadBytes(storageRef, photo);
      const photoUrl = await getDownloadURL(storageRef);
      urls.push(photoUrl);
      await addDoc(collection(db, "artworks"), { imageUrl: photoUrl, createdAt: new Date().toISOString() });
    }
    setPreviewUrls(urls);
    setPhotos([]);
    fetchArtworks(); // Refresh artwork list after upload
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
          {artworkUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Artwork ${index + 1}`}
              className="w-full h-auto border-2 border-gray-300 dark:border-gray-700 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
  */
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 /* // File: src/app/admin/art-upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../lib/firebase";
//import { collection, addDoc } from "firebase/firestore"; // Changed to use collection and addDoc
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

import { collection, addDoc, doc, getDoc } from "firebase/firestore"; // Added import of getDoc and doc


/**
 * AdminArtUploadPage component.
 *
 * Allows admin users to upload multiple art pieces to Firebase Storage and Firestore.
 */
/* export default function AdminArtUploadPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]); // Changed to handle multiple files
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Changed to handle multiple previews
  const router = useRouter();

  useEffect(() => {
    // Check if the user is an admin
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

  // Function to handle multiple file uploads
  const handleUpload = async () => {
    if (!photos.length) return; // Check if any photos are selected

    const urls: string[] = [];

    for (const photo of photos) {
      const storageRef = ref(storage, `art/${photo.name}`); // Use unique name for each image
      await uploadBytes(storageRef, photo);
      const photoUrl = await getDownloadURL(storageRef);
      urls.push(photoUrl);

      // Store image URL and metadata in Firestore
      await addDoc(collection(db, "artworks"), {
        imageUrl: photoUrl,
        createdAt: new Date().toISOString(),
      });
    }
    setPreviewUrls(urls); // Show previews of uploaded images
    setPhotos([]); // Clear selected files
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Upload Art</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full max-w-md">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">
          Pick Your Art:
          <input
            type="file"
            accept="image/*"
            multiple // Allow multiple file selection
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
    </div>
  );
}
  */


/* // File: src/app/admin/art-upload/page.tsx
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
  const [photo, setPhoto] = useState<File | null>(null);
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
        <label className="block text-gray-700 dark:text-gray-200 mb-2">Pick Your Art:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        />
        </label>
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
} */ 