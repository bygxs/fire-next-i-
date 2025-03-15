// File: src/app/content-show/page.tsx
"use client";

/**
 * A client-side page component for displaying paginated content from Firestore.
 * Features: snippets with expand-on-click, search by title/body, sort by createdAt,
 * filter by tags, pagination, and images from posts.
 */

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  OrderByDirection,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";

export default function ContentPage() {
  interface ContentItem {
    id: string;
    title: string;
    body: string;
    createdAt: number;
    tags?: string[];
    photoUrl?: string;
  }

  const [contentItems, setContentItems] = useState<ContentItem[]>([]); // All fetched content items
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]); // Filtered/search results
  const [loading, setLoading] = useState(true); // Loading state
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null); // Last doc for pagination
  const [page, setPage] = useState(1); // Current page number
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({}); // Tracks expanded state per item
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [sortOrder, setSortOrder] = useState<OrderByDirection>("desc"); // Sort: "desc" (newest) or "asc" (oldest)
  const [selectedTag, setSelectedTag] = useState(""); // Selected filter tag
  const itemsPerPage = 5; // Items per page

  /**
   * Fetches initial content on mount and resets pagination.
   */
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "content"),
          orderBy("createdAt", sortOrder),
          limit(itemsPerPage)
        );
        const contentSnapshot = await getDocs(q);
        const contentList = contentSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            body: data.body,
            createdAt: data.createdAt,
            tags: data.tags,
            photoUrl: data.photoUrl,
          };
        });
        setContentItems(contentList);
        setFilteredItems(contentList);
        setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [sortOrder]);

  /**
   * Fetches next page of content.
   */
  const handleNext = async () => {
    if (!lastDoc) return;
    try {
      const q = query(
        collection(db, "content"),
        orderBy("createdAt", sortOrder),
        startAfter(lastDoc),
        limit(itemsPerPage)
      );
      const contentSnapshot = await getDocs(q);
      const contentList = contentSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          body: data.body,
          createdAt: data.createdAt,
          tags: data.tags,
          photoUrl: data.photoUrl,
        };
      });
      setContentItems(contentList);
      setFilteredItems(contentList);
      setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]);
      setPage(page + 1);
      setExpanded({});
    } catch (error) {
      console.error("Error fetching next page:", error);
    }
  };

  /**
   * Fetches previous page (approximate via larger limit and slice).
   */
  const handlePrev = async () => {
    if (page <= 1) return;
    try {
      const q = query(
        collection(db, "content"),
        orderBy("createdAt", sortOrder),
        limit(itemsPerPage * (page - 1))
      );
      const contentSnapshot = await getDocs(q);
      const contentList = contentSnapshot.docs
        .slice(-itemsPerPage)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            body: data.body,
            createdAt: data.createdAt,
            tags: data.tags,
            photoUrl: data.photoUrl,
          };
        });
      setContentItems(contentList);
      setFilteredItems(contentList);
      setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]);
      setPage(page - 1);
      setExpanded({});
    } catch (error) {
      console.error("Error fetching prev page:", error);
    }
  };

  /**
   * Toggles expanded state for a content item.
   * @param {string} id - The item's Firestore doc ID
   */
  const toggleExpand = (id: string | number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /**
   * Filters content by search query and selected tag.
   */
  useEffect(() => {
    const filterItems = () => {
      let result = [...contentItems];
      if (searchQuery) {
        result = result.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.body.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedTag) {
        result = result.filter((item) =>
          item.tags?.includes(selectedTag)
        );
      }
      setFilteredItems(result);
    };
    filterItems();
  }, [searchQuery, selectedTag, contentItems]);

  /**
   * Extracts unique tags from all content items for filter dropdown.
   * @returns {string[]} Array of unique tags
   */
  const getUniqueTags = () => {
    const allTags = contentItems.flatMap((item) => item.tags || []);
    return [...new Set(allTags)];
  };

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Content
      </h1>
      <Link
        href="/art-show"
        className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mb-4"
      >
        View Art
      </Link>

      {/* Search, Sort, Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or content..."
          className="px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full sm:w-1/3"
        />
        <label htmlFor="sortOrder" className="sr-only">Sort Order</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as OrderByDirection)}
          className="px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <label htmlFor="tagFilter" className="sr-only">Filter by Tag</label>
        <select
          id="tagFilter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="">All Tags</option>
          {getUniqueTags().map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {filteredItems.length > 0 ? (
        <>
          <ul className="space-y-6">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {item.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {expanded[item.id]
                    ? item.body
                    : `${item.body.slice(0, 50)}...`}
                </p>
                {item.photoUrl && (
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="mt-2 max-w-full h-auto rounded border-2 border-gray-300 dark:border-gray-700"
                  />
                )}
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Posted on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page}
            </span>
            <button
              onClick={handleNext}
              disabled={contentItems.length < itemsPerPage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No content matches.</p>
      )}
    </div>
  );
}






// File: src/app/content-show/page.tsx
//"use client";

/**
 * A client-side page component for displaying paginated content from Firestore.
 * Features: snippets with expand-on-click, search by title/body, sort by createdAt,
 * filter by tags, and pagination.
 */
/* 
import { useEffect, useState } from "react";
import {
  collection, // Reference to Firestore "content" collection
  getDocs, // Fetch all docs in a query
  query, // Build Firestore query with conditions
  orderBy, // Sort results (e.g., by "createdAt")
  limit, // Limit items per fetch (pagination)
  startAfter, // Start after last doc for "Next"
} from "firebase/firestore";
import { db } from "../lib/firebase"; // Firestore instance
import Link from "next/link";

export default function ContentPage() {
  const [contentItems, setContentItems] = useState([]); // All fetched content items
  const [filteredItems, setFilteredItems] = useState([]); // Filtered/search results
  const [loading, setLoading] = useState(true); // Loading state
  const [lastDoc, setLastDoc] = useState(null); // Last doc for pagination
  const [page, setPage] = useState(1); // Current page number
  const [expanded, setExpanded] = useState({}); // Tracks expanded state per item
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [sortOrder, setSortOrder] = useState("desc"); // Sort: "desc" (newest) or "asc" (oldest)
  const [selectedTag, setSelectedTag] = useState(""); // Selected filter tag
  const itemsPerPage = 5; // Items per page

  /**
   * Fetches initial content on mount and resets pagination.
   *//* 
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "content"),
          orderBy("createdAt", sortOrder), // Sort by creation date
          limit(itemsPerPage)
        );
        const contentSnapshot = await getDocs(q);
        const contentList = contentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Spread includes title, body, createdAt, tags (if exists)
        }));
        setContentItems(contentList);
        setFilteredItems(contentList); // Initial filter matches all
        setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [sortOrder]); // Re-fetch on sort change

  const handleNext = async () => {
    if (!lastDoc) return;
    try {
      const q = query(
        collection(db, "content"),
        orderBy("createdAt", sortOrder),
        startAfter(lastDoc),
        limit(itemsPerPage)
      );
      const contentSnapshot = await getDocs(q);
      const contentList = contentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContentItems(contentList);
      setFilteredItems(contentList);
      setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]);
      setPage(page + 1);
      setExpanded({});
    } catch (error) {
      console.error("Error fetching next page:", error);
    }
  };

 
  const handlePrev = async () => {
    if (page <= 1) return;
    try {
      const q = query(
        collection(db, "content"),
        orderBy("createdAt", sortOrder),
        limit(itemsPerPage * (page - 1))
      );
      const contentSnapshot = await getDocs(q);
      const contentList = contentSnapshot.docs
        .slice(-itemsPerPage)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setContentItems(contentList);
      setFilteredItems(contentList);
      setLastDoc(contentSnapshot.docs[contentSnapshot.docs.length - 1]);
      setPage(page - 1);
      setExpanded({});
    } catch (error) {
      console.error("Error fetching prev page:", error);
    }
  };

  
   Toggles expanded state for a content item.
   //@param {string} id - The item's Firestore doc ID
   
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  
   // Filters content by search query and selected tag.
   
  useEffect(() => {
    const filterItems = () => {
      let result = [...contentItems];
      if (searchQuery) {
        result = result.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.body.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedTag) {
        result = result.filter((item) =>
          item.tags?.includes(selectedTag) // Assumes tags is an array in Firestore
        );
      }
      setFilteredItems(result);
    };
    filterItems();
  }, [searchQuery, selectedTag, contentItems]);

   Extracts unique tags from all content items for filter dropdown.
   // @returns {string[]} Array of unique tags
   
  const getUniqueTags = () => {
    const allTags = contentItems.flatMap((item) => item.tags || []);
    return [...new Set(allTags)];
  };

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Content
      </h1>
      <Link
        href="/art-show"
        className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mb-4"
      >
        View Art
      </Link>

      // Search, Sort, Filter Controls 
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or content..."
          className="px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full sm:w-1/3"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="">All Tags</option>
          {getUniqueTags().map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {filteredItems.length > 0 ? (
        <>
          <ul className="space-y-6">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {item.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {expanded[item.id]
                    ? item.body
                    : `${item.body.slice(0, 50)}...`}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Posted on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page}
            </span>
            <button
              onClick={handleNext}
              disabled={contentItems.length < itemsPerPage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No content matches.</p>
      )}
    </div>
  );
}

 */


 