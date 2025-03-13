"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ContentPage() {
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const contentSnapshot = await getDocs(collection(db, "content"));
        const contentList = contentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContentItems(contentList);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Content
      </h1>
      {contentItems.length > 0 ? (
        <ul className="space-y-6">
          {contentItems.map((item) => (
            <li
              key={item.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {item.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {item.body}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Posted on: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No content yet.</p>
      )}
    </div>
  );
}