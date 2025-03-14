"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import {
  doc,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../../lib/firebase"; // Add storage import
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Storage functions

export default function AdminContentCreatePage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<File | null>(null); // New state for photo file
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAndFetchContent = async () => {
      const user = auth.currentUser;
      if (!user) return router.push("/");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") return router.push("/dashboard");
      setIsAdmin(true);
      const contentSnapshot = await getDocs(collection(db, "content"));
      const contentList = contentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContentItems(contentList);
      setLoading(false);
    };
    checkAdminAndFetchContent();
  }, [router]);

  const handleSubmit = async () => {
    if (!title || !body) return;
    try {
      let photoUrl = "";
      if (photo) { // If a photo is selected
        const storageRef = ref(storage, `content/${Date.now()}_${photo.name}`); // Unique path
        await uploadBytes(storageRef, photo); // Upload to Storage
        photoUrl = await getDownloadURL(storageRef); // Get public URL
      }

      if (editId) { // Edit mode
        await setDoc(doc(db, "content", editId), { title, body, photoUrl }, { merge: true });
        setContentItems(contentItems.map((item) =>
          item.id === editId ? { ...item, title, body, photoUrl } : item
        ));
        setEditId(null);
      } else { // Create mode
        const newDoc = await addDoc(collection(db, "content"), {
          title,
          body,
          photoUrl, // Add photo URL to Firestore
          createdBy: auth.currentUser?.uid,
          createdAt: new Date().toISOString(),
        });
        setContentItems([{ id: newDoc.id, title, body, photoUrl, createdAt: new Date().toISOString() }, ...contentItems]);
      }
      setTitle("");
      setBody("");
      setPhoto(null); // Clear photo input
      alert(editId ? "Content updated!" : "Content created!");
    } catch (error) {
      console.error("Error submitting content:", error);
    }
  };

  const handleEdit = (item: any) => {
    setTitle(item.title);
    setBody(item.body);
    setEditId(item.id);
    setPhoto(null); // Reset photo—edit doesn’t preload it (simpler)
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content?")) return;
    await deleteDoc(doc(db, "content", id));
    setContentItems(contentItems.filter((item) => item.id !== id));
  };

  if (loading) return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Admin - Create/Edit Content</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-gray-200"
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 mb-4 border rounded h-40 dark:bg-gray-700 dark:text-gray-200"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Upload Photo
          <input
            type="file"
            accept="image/*" // Restrict to images
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
           className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        
          />
        </label>
        
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {editId ? "Save Changes" : "Create"}
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Previous Content</h2>
      {contentItems.length > 0 ? (
        <ul className="space-y-4">
          {contentItems.map((item) => (
            <li key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Posted on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
                {item.photoUrl && (
                  <img src={item.photoUrl} alt={item.title} className="mt-2 max-w-xs" />
                )}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(item)}
                  className="m-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="m-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No content yet.</p>
      )}
    </div>
  );
}
