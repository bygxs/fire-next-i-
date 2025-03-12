"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/"); // Redirect if not logged in
        return;
      }

      // Check if user is admin using getDoc
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        router.push("/dashboard"); // Redirect non-admins
        return;
      }
      setIsAdmin(true);

      // Fetch all users
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchUsers();
  }, [router]);

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Redirect will handle this
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Admin Panel - All Users</h1>
      {users.length > 0 ? (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>ID:</strong> {user.id}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> {user.email || "No email"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Name:</strong> {user.name || "No name"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Role:</strong> {user.role || "user"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No users found.</p>
      )}
    </div>
  );
}