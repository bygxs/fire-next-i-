//src/app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { deleteDoc } from "firebase/firestore/lite";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Admin Panel - All Users
      </h1>
      {users.length > 0 ? (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
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

              {/* Create User
Add a simple form above the list: */}

              <div className="mb-6">
                <input
                  type="email"
                  placeholder="New user email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                />
                <button
                  onClick={async () => {
                    const id = Math.random().toString(36).slice(2); // Dummy ID
                    await setDoc(doc(db, "users", id), {
                      email: newEmail,
                      role: "user",
                    });
                    setUsers([...users, { id, email: newEmail, role: "user" }]);
                    setNewEmail("");
                  }}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add User
                </button>
              </div>

              {/* Update Role
Add a button to toggle roles: */}

              <button
                onClick={async () => {
                  const newRole = user.role === "admin" ? "user" : "admin";
                  await setDoc(
                    doc(db, "users", user.id),
                    { role: newRole },
                    { merge: true }
                  );
                  setUsers(
                    users.map((u) =>
                      u.id === user.id ? { ...u, role: newRole } : u
                    )
                  );
                }}
                className="m-4 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Toggle Role
              </button>

              {/* delete button to delete a user */}
              <button
                onClick={async () => {
                  if (confirm("Delete this user?")) {
                    await deleteDoc(doc(db, "users", user.id));
                    setUsers(users.filter((u) => u.id !== user.id));
                  }
                }}
                className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No users found.</p>
      )}
    </div>
  );
}
