"use client";

/**
 * Component for displaying a glimpse of the latest blog content from Firestore.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface Content {
  id: string;
  title: string;
  body: string;
  photoUrl?: string;
}

export default function BlogGlimpse() {
  const [latestContent, setLatestContent] = useState<Content | null>(null);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        const q = query(
          collection(db, "content"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const contentSnapshot = await getDocs(q);
        const contentList = contentSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            body: data.body,
            photoUrl: data.photoUrl,
          };
        });
        setLatestContent(contentList[0] || null);
      } catch (error) {
        console.error("Error fetching latest content:", error);
      }
    };
    fetchLatestContent();
  }, []);

  return latestContent ? (
    <div className="w-full max-w-md mb-8 mt-4">
      <Link href="/content-show">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {latestContent.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            {latestContent.body.slice(0, 50)}...
          </p>
          {latestContent.photoUrl && (
            <img
              src={latestContent.photoUrl}
              alt={latestContent.title}
              className="mt-2 w-full h-48 object-cover rounded border-2 border-gray-300 dark:border-gray-700"
            />
          )}
        </div>
      </Link>
    </div>
  ) : (
    <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
      No content available.
    </p>
  );
}