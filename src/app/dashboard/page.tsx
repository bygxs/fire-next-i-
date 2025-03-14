// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/"); // Redirect to home page if user is not authenticated
        return;
      }

      setUserEmail(user.email);

      // Fetch profile data from Firestore
      try {
        const profileDoc = await getDoc(doc(db, "users", user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data()); // Keep the full profile
          console.log(profileDoc.data().role); // Check role here
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/"); // Redirect to home page if user signs out
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Welcome to the Dashboard, {userEmail || "User"}!
        </h1>

        {/* check Firestore’s content collection. */}
        <div>
        {profile?.role === "admin" && (
          <Link
            href="/admin/content-create"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manage Content
          </Link>
        )}

        <Link
          href="/profile"
          className="m-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Edit Profile
        </Link>

        {profile?.role === "admin" && (
          <Link
            href="/admin/art-upload"
            className="m-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Art
          </Link>
        )}
        <Link
          href="/art-show"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-2"
        >
          View Art
        </Link>

        </div>

        {/* you’ll see the message if you’re admin. Non-admins won’t. */}

        {profile?.role === "admin" && (
          <div className="jusfty-center items-center mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
            <p className="text-green-500 ml-11">
              You’re an admin! Secret powers unlocked.
            </p>
            <Link
              href="/admin/users"
              className=" ml-64 mt-2 inline-block px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
            >
              Go to Admin Panel
            </Link>
          </div>
        )}

        {profile ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg mt-6">
            {profile.profilePictureUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={profile.profilePictureUrl}
                  alt="Profile Picture"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Your Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Bio:</strong> {profile.bio}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Location:</strong> {profile.location}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Date of Birth:</strong> {profile.dob}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Interests:</strong> {profile.interests.join(", ")}
            </p>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Social Links
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>LinkedIn:</strong>{" "}
                {profile.socialLinks.linkedin || "Not provided"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Twitter:</strong>{" "}
                {profile.socialLinks.twitter || "Not provided"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Facebook:</strong>{" "}
                {profile.socialLinks.facebook || "Not provided"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mt-6">
            No profile data found. Please complete your profile.
          </p>
        )}
      </div>
    </div>
  );
}
