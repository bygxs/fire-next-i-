"use client"; // Tells Next.js this is a Client Component—runs in the browser, not server.

import { useEffect, useState } from "react"; // Hooks for side effects and state management.
import {
  collection, // Creates a reference to a Firestore collection (e.g., "content").
  getDocs, // Fetches all docs from a query or collection.
  query, // Builds a Firestore query with conditions (like sorting).
  orderBy, // Sorts query results (e.g., by "createdAt").
  limit, // Caps how many docs you fetch (e.g., 5 per page).
  startAfter, // Starts fetching after a specific doc (for "Next" pagination).
} from "firebase/firestore"; // Firestore tools for data fetching.
import { db } from "../lib/firebase"; // Your Firestore instance from firebase.ts.
import Link from "next/link";

export default function ContentPage() {
  const [contentItems, setContentItems] = useState<any[]>([]); // Holds the list of content items.
  const [loading, setLoading] = useState(true); // Tracks if data’s still fetching.
  const [lastDoc, setLastDoc] = useState<any>(null); // Stores the last doc fetched for "Next".
  const [page, setPage] = useState(1); // Current page number (starts at 1).
  const itemsPerPage = 5; // Constant: how many items per page.

  useEffect(() => {
    // Runs once on mount to fetch initial content.
    const fetchContent = async () => {
      // Async function to handle Firestore fetch.
      try {
        // Critical: Builds a query to get 5 newest items, sorted by createdAt descending.
        const q = query(
          collection(db, "content"), // Targets the "content" collection.
          orderBy("createdAt", "desc"), // Sorts by timestamp, newest first.
          limit(itemsPerPage) // Limits to 5 items for pagination.
        );
        const contentSnapshot = await getDocs(q); // Fetches the query results.
        // Maps Firestore docs to an array with id + data (title, body, etc.).
        const contentList = contentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContentItems(contentList); // Updates state with fetched items.
        // Critical: Saves the last doc for "Next" pagination.
        setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]);
      } catch (error) {
        console.error("Error fetching content:", error); // Logs any fetch errors.
      } finally {
        setLoading(false); // Done loading, show the UI.
      }
    };
    fetchContent(); // Kick off the fetch.
  }, []); // Empty deps = runs once on mount.

  // Critical: Fetches the next 5 items when "Next" is clicked.
  const handleNext = async () => {
    if (!lastDoc) return; // No last doc? Can’t go next—end of list.
    try {
      const q = query(
        collection(db, "content"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc), // Starts after the last fetched doc.
        limit(itemsPerPage) // Still 5 items.
      );
      const contentSnapshot = await getDocs(q); // Fetch next batch.
      const contentList = contentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContentItems(contentList); // Update UI with new items.
      setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]); // New last doc.
      setPage(page + 1); // Bump page number.
    } catch (error) {
      console.error("Error fetching next page:", error);
    }
  };

  // Critical: Fetches previous items—hacky but works for small sets.
  const handlePrev = async () => {
    if (page <= 1) return; // Can’t go before page 1.
    try {
      const q = query(
        collection(db, "content"),
        orderBy("createdAt", "desc"),
        limit(itemsPerPage * (page - 1)) // Fetches up to the prior page’s end.
      );
      const contentSnapshot = await getDocs(q);
      // Slices the last 5 items from the fetched set.
      const contentList = contentSnapshot.docs
        .slice(-itemsPerPage)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setContentItems(contentList);
      setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]);
      setPage(page - 1); // Drop page number.
    } catch (error) {
      console.error("Error fetching prev page:", error);
    }
  };

  if (loading) {
    // Show loading state while fetching.
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    // Main UI render.
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Content
      </h1>
      <Link
          href="/art-show"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-2"
        >
          View Art
        </Link>
      {contentItems.length > 0 ? ( // If there’s content, show it.
        <>
          <ul className="space-y-6">
            {contentItems.map(
              (
                item // Loop through items.
              ) => (
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
              )
            )}
          </ul>
          <div className="mt-6 flex justify-between">
            {" "}
            // Pagination controls.
            <button
              onClick={handlePrev}
              disabled={page === 1} // Grayed out on first page.
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page}
            </span>
            <button
              onClick={handleNext}
              disabled={contentItems.length < itemsPerPage} // Grayed out if less than 5 items.
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        // No content case.
        <p className="text-gray-600 dark:text-gray-400">No content yet.</p>
      )}
    </div>
  );
}
