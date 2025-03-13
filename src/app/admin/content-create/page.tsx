"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase"; // Adjusted path for /admin/content-create.
import {
  doc,
  getDoc,
  addDoc,
  setDoc, // For updating existing content.
  deleteDoc, // For deleting content.
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminContentCreatePage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState(""); // Form title state.
  const [body, setBody] = useState(""); // Form body state.
  const [contentItems, setContentItems] = useState<any[]>([]); // List of content.
  const [editId, setEditId] = useState<string | null>(null); // Tracks if editing (null = create).
  const router = useRouter();

  // Check admin status on mount.
  useEffect(() => {
    const checkAdminAndFetchContent = async () => {
      const user = auth.currentUser;
      if (!user) return router.push("/"); // No user, bail to home.
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin")
        return router.push("/dashboard");
      setIsAdmin(true);

      // Fetch all content for the list.
      const contentSnapshot = await getDocs(collection(db, "content"));
      const contentList = contentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContentItems(contentList);
      setLoading(false);
    };
    checkAdminAndFetchContent();
  }, [router]);

  // Handle creating or updating content.
  const handleSubmit = async () => {
    if (!title || !body) return; // Basic validation.
    try {
      if (editId) {
        // Editing mode.
        await setDoc(
          doc(db, "content", editId),
          { title, body },
          { merge: true }
        ); // Update existing doc.
        setContentItems(
          contentItems.map((item) =>
            item.id === editId ? { ...item, title, body } : item
          )
        ); // Update UI list.
        setEditId(null); // Exit edit mode.
      } else {
        // Create mode.
        const newDoc = await addDoc(collection(db, "content"), {
          title,
          body,
          createdBy: auth.currentUser?.uid,
          createdAt: new Date().toISOString(),
        }); // Add new doc.
        setContentItems([
          { id: newDoc.id, title, body, createdAt: new Date().toISOString() },
          ...contentItems,
        ]); // Prepend to list.
      }
      setTitle(""); // Clear form.
      setBody("");
      alert(editId ? "Content updated!" : "Content created!");
    } catch (error) {
      console.error("Error submitting content:", error);
    }
  };

  // Handle edit button click.
  const handleEdit = (item: any) => {
    setTitle(item.title); // Load title into form.
    setBody(item.body); // Load body into form.
    setEditId(item.id); // Switch to edit mode with this ID.
  };

  // Handle delete button click.
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content?")) return; // Confirm action.
    try {
      await deleteDoc(doc(db, "content", id)); // Remove from Firestore.
      setContentItems(contentItems.filter((item) => item.id !== id)); // Remove from UI.
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  if (loading)
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Admin - Create/Edit Content
      </h1>
      {/* Creation/Edit Form */}
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
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {editId ? "Save Changes" : "Create"} {/* Dynamic button text */}
        </button>
      </div>
      {/* Content List */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Previous Content
      </h2>
      {contentItems.length > 0 ? (
        <ul className="space-y-4">
          {contentItems.map((item) => (
            <li
              key={item.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Posted on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(item)}
                  className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No content yet, on this page.
        </p>
      )}
    </div>
  );
}
