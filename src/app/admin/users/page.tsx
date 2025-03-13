"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { deleteDoc } from "firebase/firestore"; // Fix: Import from the correct package frome firebase lite to just firebase

export default function AdminPage() {
  // State variables
  const [users, setUsers] = useState<any[]>([]); // Stores the list of users
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [isAdmin, setIsAdmin] = useState(false); // Checks if the current user is an admin
  const router = useRouter(); // Next.js router for navigation

  // State for the "Create User" form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newDOB, setNewDOB] = useState("");
  const [newProfilePic, setNewProfilePic] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newInterests, setNewInterests] = useState("");
  const [newLinkedIn, setNewLinkedIn] = useState("");
  const [newTwitter, setNewTwitter] = useState("");
  const [newFacebook, setNewFacebook] = useState("");

  // State for feedback messages
  const [feedback, setFeedback] = useState("");

  // Fetch users and check admin status on component mount
  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/"); // Redirect if not logged in
        return;
      }

      // Check if the current user is an admin
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        router.push("/dashboard"); // Redirect non-admins
        return;
      }
      setIsAdmin(true);

      // Fetch all users from Firestore
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        setFeedback("Error fetching users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchUsers();
  }, [router]);

  // Handle "Create User" form submission
  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) {
      setFeedback("Email and password are required.");
      return;
    }

    try {
      const id = Math.random().toString(36).slice(2); // Generate a random ID for the new user
      await setDoc(doc(db, "users", id), {
        email: newEmail,
        password: newPassword, // Note: In a real app, hash passwords before storing!
        name: newName,
        dob: newDOB,
        profilePic: newProfilePic,
        bio: newBio,
        interests: newInterests,
        linkedIn: newLinkedIn,
        twitter: newTwitter,
        facebook: newFacebook,
        role: "user", // Default role
      });

      // Update the users list and clear the form
      setUsers([...users, { id, email: newEmail, name: newName, role: "user" }]);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setNewDOB("");
      setNewProfilePic("");
      setNewBio("");
      setNewInterests("");
      setNewLinkedIn("");
      setNewTwitter("");
      setNewFacebook("");
      setFeedback("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      setFeedback("Error creating user. Please try again.");
    }
  };

  // Handle "Update Role" button click
  const handleUpdateRole = async (user: any) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await setDoc(doc(db, "users", user.id), { role: newRole }, { merge: true });
      setUsers(users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
      setFeedback(`User role updated to ${newRole}.`);
    } catch (error) {
      console.error("Error updating role:", error);
      setFeedback("Error updating role. Please try again.");
    }
  };

  // Handle "Delete User" button click
  const handleDeleteUser = async (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.email}?`)) {
      try {
        await deleteDoc(doc(db, "users", user.id));
        setUsers(users.filter((u) => u.id !== user.id));
        setFeedback("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
        setFeedback("Error deleting user. Please try again.");
      }
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  // Redirect non-admins (handled by useEffect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Admin Panel - All Users
      </h1>

      {/* Feedback Message */}
      {feedback && (
        <div className="mb-4 p-4 rounded bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
          {feedback}
        </div>
      )}

      {/* Create User Form */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Create New User
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={newDOB}
            onChange={(e) => setNewDOB(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="Profile Picture URL"
            value={newProfilePic}
            onChange={(e) => setNewProfilePic(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          />
          <textarea
            placeholder="Bio"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="Interests"
            value={newInterests}
            onChange={(e) => setNewInterests(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={newLinkedIn}
            onChange={(e) => setNewLinkedIn(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="Twitter URL"
            value={newTwitter}
            onChange={(e) => setNewTwitter(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="Facebook URL"
            value={newFacebook}
            onChange={(e) => setNewFacebook(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <button
          onClick={handleCreateUser}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add User
        </button>
      </div>

      {/* Users List */}
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

              {/* Update Role Button */}
              <button
                onClick={() => handleUpdateRole(user)}
                className="m-4 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Toggle Role
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteUser(user)}
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