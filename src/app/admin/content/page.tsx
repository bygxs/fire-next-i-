 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/"); // Redirect if not logged in
        return;
      }
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        router.push("/dashboard"); // Redirect non-admins
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const handleCreateContent = async () => {
    if (!title || !body) return;
    try {
      await addDoc(collection(db, "content"), {
        title,
        body,
        createdBy: auth.currentUser?.uid,
        createdAt: new Date().toISOString(),
      });
      setTitle("");
      setBody("");
      alert("Content created!");
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Redirect handles this
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Admin - Create Content
      </h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
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
        <button
          onClick={handleCreateContent}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create
        </button>
      </div>
    </div>
  );
} 